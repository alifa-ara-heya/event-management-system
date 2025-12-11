import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { prisma } from "../../shared/prisma";
import { Host, HostRequest, HostRequestStatus, Prisma, UserRole, UserStatus, PaymentStatus } from "@prisma/client";
import { IJWTPayload } from "../../types/common";
import { calculatePagination } from "../../helpers/paginationHelper";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

/**
 * Submit a host request (user wants to become a host)
 * Pulls user's existing profile data and uses it as defaults
 */
const submitHostRequest = async (user: IJWTPayload, req: Request): Promise<HostRequest> => {
    // Check if user already has a host request
    const existingRequest = await prisma.hostRequest.findUnique({
        where: { userId: user.email }
    });

    if (existingRequest) {
        if (existingRequest.status === HostRequestStatus.PENDING) {
            throw new ApiError(httpStatus.BAD_REQUEST, "You already have a pending host request.");
        }
        if (existingRequest.status === HostRequestStatus.APPROVED) {
            throw new ApiError(httpStatus.BAD_REQUEST, "You are already a host.");
        }
    }

    // Check if user is already a host
    const existingHost = await prisma.host.findUnique({
        where: { email: user.email }
    });

    if (existingHost) {
        throw new ApiError(httpStatus.BAD_REQUEST, "You are already a host.");
    }

    // Fetch user's existing profile data to use as defaults
    const userProfile = await prisma.user.findUniqueOrThrow({
        where: { email: user.email },
        select: {
            name: true,
            profilePhoto: true,
            bio: true,
            location: true
        }
    });

    // Handle file upload if provided (overrides user's profile photo)
    let profilePhoto = userProfile.profilePhoto;
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        profilePhoto = uploadResult?.secure_url || profilePhoto;
    }

    // Generate a default name from email if user doesn't have a name and none provided
    const defaultName = user.email.split('@')[0].charAt(0).toUpperCase() + user.email.split('@')[0].slice(1);
    const finalName = req.body.name || userProfile.name || defaultName;

    // Use provided data or fall back to user's existing profile data
    const hostRequestData = {
        name: finalName,
        contactNumber: req.body.contactNumber || null, // Optional - not in User model
        bio: req.body.bio || userProfile.bio || null,
        location: req.body.location || userProfile.location || null,
        profilePhoto: profilePhoto || null
    };

    // Create or update host request
    const hostRequest = await prisma.hostRequest.upsert({
        where: { userId: user.email },
        update: {
            ...hostRequestData,
            status: HostRequestStatus.PENDING,
            rejectionReason: null
        },
        create: {
            userId: user.email,
            ...hostRequestData,
            status: HostRequestStatus.PENDING
        }
    });

    return hostRequest;
};

/**
 * Get all host requests with pagination and filters (Admin only)
 */
const getAllHostRequests = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, status, ...filterData } = params;

    const andConditions: Prisma.HostRequestWhereInput[] = [];

    // Search by name or email
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { userId: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
    }

    // Filter by status
    if (status) {
        andConditions.push({ status: status as HostRequestStatus });
    }

    // Add other filters
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: { equals: (filterData as any)[key] }
            }))
        });
    }

    const whereConditions: Prisma.HostRequestWhereInput = andConditions.length > 0
        ? { AND: andConditions }
        : {};

    const result = await prisma.hostRequest.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: {
            user: {
                select: {
                    email: true,
                    role: true,
                    status: true
                }
            }
        }
    });

    const total = await prisma.hostRequest.count({ where: whereConditions });

    return {
        meta: { page, limit, total },
        data: result
    };
};

/**
 * Approve host request and create host account (Admin only)
 */
const approveHostRequest = async (requestId: string): Promise<Host> => {
    const hostRequest = await prisma.hostRequest.findUniqueOrThrow({
        where: { id: requestId },
        include: { user: true }
    });

    if (hostRequest.status !== HostRequestStatus.PENDING) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Host request is already ${hostRequest.status.toLowerCase()}.`);
    }

    // Check if user is already a host
    const existingHost = await prisma.host.findUnique({
        where: { email: hostRequest.userId }
    });

    if (existingHost) {
        throw new ApiError(httpStatus.BAD_REQUEST, "User is already a host.");
    }

    // Create host account and update user role in transaction
    const result = await prisma.$transaction(async (tnx) => {
        // Update user role to HOST
        await tnx.user.update({
            where: { email: hostRequest.userId },
            data: { role: UserRole.HOST }
        });

        // Create host record
        const host = await tnx.host.create({
            data: {
                email: hostRequest.userId,
                name: hostRequest.name,
                contactNumber: hostRequest.contactNumber,
                bio: hostRequest.bio,
                location: hostRequest.location,
                profilePhoto: hostRequest.profilePhoto
            }
        });

        // Update request status to APPROVED
        await tnx.hostRequest.update({
            where: { id: requestId },
            data: { status: HostRequestStatus.APPROVED }
        });

        return host;
    });

    return result;
};

/**
 * Reject host request (Admin only)
 */
const rejectHostRequest = async (requestId: string, rejectionReason?: string): Promise<HostRequest> => {
    const hostRequest = await prisma.hostRequest.findUniqueOrThrow({
        where: { id: requestId }
    });

    if (hostRequest.status !== HostRequestStatus.PENDING) {
        throw new ApiError(httpStatus.BAD_REQUEST, `Host request is already ${hostRequest.status.toLowerCase()}.`);
    }

    const updatedRequest = await prisma.hostRequest.update({
        where: { id: requestId },
        data: {
            status: HostRequestStatus.REJECTED,
            rejectionReason: rejectionReason || null
        }
    });

    return updatedRequest;
};

/**
 * Get all hosts with pagination, search, and filters (Admin only)
 */
const getAllHosts = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, location, ...filterData } = params;

    const andConditions: Prisma.HostWhereInput[] = [];

    // Search by name or email
    if (searchTerm) {
        andConditions.push({
            OR: [
                { name: { contains: searchTerm, mode: "insensitive" } },
                { email: { contains: searchTerm, mode: "insensitive" } }
            ]
        });
    }

    // Filter by location
    if (location) {
        andConditions.push({
            location: { contains: location, mode: "insensitive" }
        });
    }

    // Add other filters
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: { equals: (filterData as any)[key] }
            }))
        });
    }

    // Exclude deleted hosts
    andConditions.push({ isDeleted: false });

    const whereConditions: Prisma.HostWhereInput = andConditions.length > 0
        ? { AND: andConditions }
        : { isDeleted: false };

    const result = await prisma.host.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true,
                    interests: true
                }
            },
            _count: {
                select: {
                    hostedEvents: true,
                    reviews: true
                }
            }
        }
    });

    // Clean up response: merge interests and remove duplicate user data
    const mergedResult = result.map(host => {
        const { user, ...hostData } = host;
        return {
            ...hostData,
            interests: user.interests || [],
            userId: user.id, // Keep user ID for reference
            userStatus: user.status // Keep user status
        };
    });

    const total = await prisma.host.count({ where: whereConditions });

    return {
        meta: { page, limit, total },
        data: mergedResult
    };
};

/**
 * Get host by ID (public profile)
 */
const getHostById = async (id: string) => {
    const host = await prisma.host.findUniqueOrThrow({
        where: { id, isDeleted: false },
        include: {
            user: {
                select: {
                    id: true,
                    email: true,
                    role: true,
                    status: true
                }
            },
            hostedEvents: {
                where: { isDeleted: false },
                select: {
                    id: true,
                    name: true,
                    type: true,
                    date: true,
                    location: true,
                    status: true,
                    currentParticipants: true,
                    maxParticipants: true
                },
                take: 5,
                orderBy: { date: "asc" }
            },
            reviews: {
                where: { isDeleted: false },
                select: {
                    id: true,
                    rating: true,
                    comment: true,
                    createdAt: true,
                    reviewer: {
                        select: {
                            email: true,
                            profilePhoto: true
                        }
                    }
                },
                take: 10,
                orderBy: { createdAt: "desc" }
            },
            _count: {
                select: {
                    hostedEvents: true,
                    reviews: true
                }
            }
        }
    });

    // Clean up response: interests are now directly in Host model
    const { user, ...hostData } = host;
    return {
        ...hostData,
        userId: user.id, // Keep user ID for reference
        userStatus: user.status // Keep user status
    };
};

/**
 * Get my host statistics (Host only)
 */
const getMyHostStats = async (user: IJWTPayload) => {
    const host = await prisma.host.findUniqueOrThrow({
        where: { email: user.email, isDeleted: false },
        include: {
            hostedEvents: {
                where: { isDeleted: false },
                select: {
                    id: true,
                    name: true,
                    status: true,
                    date: true,
                    location: true,
                    image: true,
                    currentParticipants: true,
                    maxParticipants: true,
                    joiningFee: true,
                    _count: {
                        select: {
                            participants: true,
                            payments: true
                        }
                    }
                }
            },
            _count: {
                select: {
                    hostedEvents: true,
                    reviews: true
                }
            }
        }
    });

    const now = new Date();
    const upcomingEvents = host.hostedEvents.filter(
        event => new Date(event.date) > now && event.status !== "CANCELLED" && event.status !== "COMPLETED"
    );
    const pastEvents = host.hostedEvents.filter(
        event => new Date(event.date) <= now || event.status === "COMPLETED"
    );

    const totalParticipants = host.hostedEvents.reduce(
        (sum, event) => sum + event.currentParticipants,
        0
    );

    // Get recent events (upcoming and past)
    const recentUpcomingEvents = upcomingEvents
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const recentPastEvents = pastEvents
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 5);

    // Calculate total revenue from paid payments
    const totalPaidRevenue = await prisma.payment.aggregate({
        where: {
            eventId: { in: host.hostedEvents.map(e => e.id) },
            status: PaymentStatus.PAID
        },
        _sum: {
            amount: true
        }
    });

    return {
        overview: {
            totalEvents: host._count.hostedEvents,
            upcomingEvents: upcomingEvents.length,
            pastEvents: pastEvents.length,
            totalParticipants,
            totalRevenue: totalPaidRevenue._sum.amount || host.totalRevenue,
            averageRating: host.averageRating,
            totalReviews: host._count.reviews
        },
        recentUpcomingEvents,
        recentPastEvents
    };
};

/**
 * Update host status (Admin only)
 */
const updateHostStatus = async (id: string, isDeleted: boolean) => {
    const host = await prisma.host.findUniqueOrThrow({
        where: { id }
    });

    const updatedHost = await prisma.host.update({
        where: { id },
        data: { isDeleted }
    });

    // Also update user status if soft deleting
    if (isDeleted) {
        await prisma.user.update({
            where: { email: host.email },
            data: { status: UserStatus.INACTIVE }
        });
    }

    return updatedHost;
};

/**
 * Delete host (soft delete) (Admin only)
 */
const deleteHost = async (id: string) => {
    const host = await prisma.host.findUniqueOrThrow({
        where: { id }
    });

    const deletedHost = await prisma.host.update({
        where: { id },
        data: { isDeleted: true }
    });

    // Update user status
    await prisma.user.update({
        where: { email: host.email },
        data: { status: UserStatus.INACTIVE }
    });

    return deletedHost;
};

export const HostService = {
    submitHostRequest,
    getAllHostRequests,
    approveHostRequest,
    rejectHostRequest,
    getAllHosts,
    getHostById,
    getMyHostStats,
    updateHostStatus,
    deleteHost
};

