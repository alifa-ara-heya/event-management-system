import { prisma } from "../../shared/prisma";
import { EventStatus, PaymentStatus, Prisma, HostRequestStatus, UserRole, UserStatus } from "@prisma/client";
import { calculatePagination } from "../../helpers/paginationHelper";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

/**
 * Get admin dashboard statistics
 */
const getDashboardStats = async () => {
    const [
        totalUsers,
        totalHosts,
        totalEvents,
        totalPayments,
        activeUsers,
        activeHosts,
        activeEvents,
        pendingHostRequests,
        totalRevenue,
        recentEvents,
        recentUsers
    ] = await Promise.all([
        prisma.user.count({ where: { isDeleted: false } }),
        prisma.host.count({ where: { isDeleted: false } }),
        prisma.event.count({ where: { isDeleted: false } }),
        prisma.payment.count(),
        prisma.user.count({ where: { isDeleted: false, status: UserStatus.ACTIVE } }),
        prisma.host.count({ where: { isDeleted: false } }),
        prisma.event.count({ where: { isDeleted: false, status: { not: EventStatus.CANCELLED } } }),
        prisma.hostRequest.count({ where: { status: HostRequestStatus.PENDING } }),
        prisma.payment.aggregate({
            where: { status: PaymentStatus.PAID },
            _sum: { amount: true }
        }),
        prisma.event.findMany({
            where: { isDeleted: false },
            take: 5,
            orderBy: { createdAt: 'desc' },
            include: {
                host: {
                    select: {
                        name: true,
                        email: true
                    }
                },
                _count: {
                    select: {
                        participants: true
                    }
                }
            }
        }),
        prisma.user.findMany({
            where: { isDeleted: false },
            take: 5,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        })
    ]);

    return {
        overview: {
            totalUsers,
            totalHosts,
            totalEvents,
            totalPayments,
            activeUsers,
            activeHosts,
            activeEvents,
            pendingHostRequests,
            totalRevenue: totalRevenue._sum.amount || 0
        },
        recentEvents,
        recentUsers
    };
};

/**
 * Get all events (Admin only - with full management capabilities)
 */
const getAllEvents = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, status, type, ...filterData } = params;

    const andConditions: Prisma.EventWhereInput[] = [
        { isDeleted: false }
    ];

    // Search by name, description, or location
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { description: { contains: searchTerm, mode: "insensitive" } },
                { location: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
    }

    // Filter by status
    if (status) {
        andConditions.push({ status: status as EventStatus });
    }

    // Filter by type
    if (type) {
        andConditions.push({ type: type as any });
    }

    const whereConditions: Prisma.EventWhereInput = andConditions.length > 0 ? { AND: andConditions } : { isDeleted: false };

    const result = await prisma.event.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: {
            host: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true
                }
            },
            _count: {
                select: {
                    participants: true,
                    payments: true
                }
            }
        }
    });

    const total = await prisma.event.count({ where: whereConditions });

    return {
        meta: { page, limit, total },
        data: result
    };
};

/**
 * Update event (Admin only - can update any event)
 */
const updateEvent = async (eventId: string, data: any) => {
    const event = await prisma.event.findUniqueOrThrow({
        where: { id: eventId, isDeleted: false }
    });

    const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: {
            ...data,
            // Auto-update status if participants reach max
            status: data.currentParticipants !== undefined && data.currentParticipants >= event.maxParticipants
                ? EventStatus.FULL
                : data.status || event.status
        }
    });

    return updatedEvent;
};

/**
 * Delete event (Admin only - can delete any event)
 */
const deleteEvent = async (eventId: string) => {
    const event = await prisma.event.findUniqueOrThrow({
        where: { id: eventId, isDeleted: false }
    });

    // Soft delete
    const deletedEvent = await prisma.event.update({
        where: { id: eventId },
        data: { isDeleted: true }
    });

    return deletedEvent;
};

/**
 * Update event status (Admin only - can update any event status)
 */
const updateEventStatus = async (eventId: string, status: EventStatus) => {
    const event = await prisma.event.findUniqueOrThrow({
        where: { id: eventId, isDeleted: false }
    });

    // Validate status transitions
    if (event.status === EventStatus.COMPLETED && status !== EventStatus.COMPLETED) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Cannot change status of a completed event.");
    }

    // Auto-update to FULL if currentParticipants >= maxParticipants
    let finalStatus = status;
    if (status === EventStatus.OPEN && event.currentParticipants >= event.maxParticipants) {
        finalStatus = EventStatus.FULL;
    }

    const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: { status: finalStatus }
    });

    return updatedEvent;
};

/**
 * Get statistics for events
 */
const getEventStatistics = async () => {
    const [
        totalEvents,
        openEvents,
        fullEvents,
        cancelledEvents,
        completedEvents,
        eventsByType,
        upcomingEvents,
        pastEvents,
        totalParticipants,
        totalRevenue
    ] = await Promise.all([
        prisma.event.count({ where: { isDeleted: false } }),
        prisma.event.count({ where: { isDeleted: false, status: EventStatus.OPEN } }),
        prisma.event.count({ where: { isDeleted: false, status: EventStatus.FULL } }),
        prisma.event.count({ where: { isDeleted: false, status: EventStatus.CANCELLED } }),
        prisma.event.count({ where: { isDeleted: false, status: EventStatus.COMPLETED } }),
        prisma.event.groupBy({
            by: ['type'],
            where: { isDeleted: false },
            _count: { type: true }
        }),
        prisma.event.count({
            where: {
                isDeleted: false,
                date: { gte: new Date() }
            }
        }),
        prisma.event.count({
            where: {
                isDeleted: false,
                date: { lt: new Date() }
            }
        }),
        prisma.eventParticipant.count({ where: { isDeleted: false } }),
        prisma.payment.aggregate({
            where: { status: PaymentStatus.PAID },
            _sum: { amount: true }
        })
    ]);

    return {
        totalEvents,
        statusBreakdown: {
            open: openEvents,
            full: fullEvents,
            cancelled: cancelledEvents,
            completed: completedEvents
        },
        eventsByType: eventsByType.map(item => ({
            type: item.type,
            count: item._count.type
        })),
        timeBreakdown: {
            upcoming: upcomingEvents,
            past: pastEvents
        },
        totalParticipants,
        totalRevenue: totalRevenue._sum.amount || 0
    };
};

/**
 * Get statistics for users
 */
const getUserStatistics = async () => {
    const [
        totalUsers,
        activeUsers,
        inactiveUsers,
        usersByRole,
        recentRegistrations
    ] = await Promise.all([
        prisma.user.count({ where: { isDeleted: false } }),
        prisma.user.count({ where: { isDeleted: false, status: UserStatus.ACTIVE } }),
        prisma.user.count({ where: { isDeleted: false, status: UserStatus.INACTIVE } }),
        prisma.user.groupBy({
            by: ['role'],
            where: { isDeleted: false },
            _count: { role: true }
        }),
        prisma.user.findMany({
            where: { isDeleted: false },
            take: 10,
            orderBy: { createdAt: 'desc' },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                createdAt: true
            }
        })
    ]);

    return {
        totalUsers,
        statusBreakdown: {
            active: activeUsers,
            inactive: inactiveUsers
        },
        usersByRole: usersByRole.map(item => ({
            role: item.role,
            count: item._count.role
        })),
        recentRegistrations
    };
};

/**
 * Get statistics for hosts
 */
const getHostStatistics = async () => {
    const [
        totalHosts,
        activeHosts,
        hostsWithEvents,
        topHostsByRevenue,
        topHostsByEvents
    ] = await Promise.all([
        prisma.host.count({ where: { isDeleted: false } }),
        prisma.host.count({ where: { isDeleted: false } }),
        prisma.host.count({
            where: {
                isDeleted: false,
                hostedEvents: {
                    some: { isDeleted: false }
                }
            }
        }),
        prisma.host.findMany({
            where: { isDeleted: false },
            take: 10,
            orderBy: { totalRevenue: 'desc' },
            select: {
                id: true,
                name: true,
                email: true,
                totalRevenue: true,
                averageRating: true,
                _count: {
                    select: {
                        hostedEvents: true
                    }
                }
            }
        }),
        prisma.host.findMany({
            where: { isDeleted: false },
            take: 10,
            orderBy: {
                hostedEvents: {
                    _count: 'desc'
                }
            },
            select: {
                id: true,
                name: true,
                email: true,
                totalRevenue: true,
                averageRating: true,
                _count: {
                    select: {
                        hostedEvents: true
                    }
                }
            }
        })
    ]);

    return {
        totalHosts,
        activeHosts,
        hostsWithEvents,
        topHostsByRevenue,
        topHostsByEvents
    };
};

export const AdminService = {
    getDashboardStats,
    getAllEvents,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    getEventStatistics,
    getUserStatistics,
    getHostStatistics
};

