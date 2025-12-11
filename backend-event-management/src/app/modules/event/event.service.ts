import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader";
import { prisma } from "../../shared/prisma";
import { Event, EventStatus, EventType, Prisma } from "@prisma/client";
import { IJWTPayload } from "../../types/common";
import { calculatePagination } from "../../helpers/paginationHelper";
import { eventSearchableFields } from "./event.constant";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";

/**
 * Create a new event (Host only)
 */
const createEvent = async (user: IJWTPayload, req: Request): Promise<Event> => {
    // Verify user is a host
    const host = await prisma.host.findUniqueOrThrow({
        where: { email: user.email, isDeleted: false }
    });

    // Handle file upload if provided
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.image = uploadResult?.secure_url;
    }

    // Validate date is in the future
    if (req.body.date && new Date(req.body.date) <= new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Event date must be in the future.");
    }

    // Validate minParticipants <= maxParticipants
    if (req.body.minParticipants && req.body.maxParticipants) {
        if (req.body.minParticipants > req.body.maxParticipants) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Minimum participants cannot exceed maximum participants.");
        }
    }

    const eventData = {
        name: req.body.name,
        type: req.body.type as EventType,
        description: req.body.description,
        date: req.body.date,
        location: req.body.location,
        minParticipants: req.body.minParticipants || 1,
        maxParticipants: req.body.maxParticipants,
        joiningFee: req.body.joiningFee || 0,
        status: req.body.status || EventStatus.OPEN,
        image: req.body.image,
        hostId: host.id
    };

    const event = await prisma.event.create({
        data: eventData
    });

    return event;
};

/**
 * Get all events with pagination, search, and filters (Public)
 */
const getAllEvents = async (params: any, options: any) => {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andConditions: Prisma.EventWhereInput[] = [];

    // Search by name, description, or location
    if (searchTerm) {
        andConditions.push({
            OR: eventSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }

    // Add filter conditions
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (key === 'type') {
                    return { [key]: { equals: filterData[key] as EventType } };
                } else if (key === 'status') {
                    return { [key]: { equals: filterData[key] as EventStatus } };
                } else {
                    return { [key]: { equals: filterData[key] } };
                }
            })
        });
    }

    // Exclude deleted events
    andConditions.push({ isDeleted: false });

    // Filter out past events by default (optional - can be overridden)
    if (!filterData.includePast) {
        andConditions.push({
            date: { gte: new Date() }
        });
    }

    const whereConditions: Prisma.EventWhereInput = andConditions.length > 0
        ? { AND: andConditions }
        : { isDeleted: false };

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
                    profilePhoto: true,
                    averageRating: true
                }
            },
            _count: {
                select: {
                    participants: true
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
 * Get event by ID (Public)
 */
const getEventById = async (id: string) => {
    const event = await prisma.event.findUniqueOrThrow({
        where: { id, isDeleted: false },
        include: {
            host: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    profilePhoto: true,
                    bio: true,
                    location: true,
                    averageRating: true,
                    _count: {
                        select: {
                            hostedEvents: true,
                            reviews: true
                        }
                    }
                }
            },
            participants: {
                where: { isDeleted: false },
                select: {
                    id: true,
                    userId: true,
                    joinedAt: true,
                    user: {
                        select: {
                            email: true,
                            name: true,
                            profilePhoto: true
                        }
                    }
                },
                take: 10,
                orderBy: { joinedAt: "desc" }
            },
            _count: {
                select: {
                    participants: true
                }
            }
        }
    });

    return event;
};

/**
 * Update event (Host only - own events)
 */
const updateEvent = async (user: IJWTPayload, eventId: string, req: Request): Promise<Event> => {
    // Verify user is a host
    const host = await prisma.host.findUniqueOrThrow({
        where: { email: user.email, isDeleted: false }
    });

    // Verify event exists and belongs to this host
    const existingEvent = await prisma.event.findUniqueOrThrow({
        where: { id: eventId, isDeleted: false }
    });

    if (existingEvent.hostId !== host.id) {
        throw new ApiError(httpStatus.FORBIDDEN, "You can only update your own events.");
    }

    // Handle file upload if provided
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.image = uploadResult?.secure_url;
    }

    // Validate date is in the future (if updating date)
    if (req.body.date && new Date(req.body.date) <= new Date()) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Event date must be in the future.");
    }

    // Validate minParticipants <= maxParticipants
    const minParticipants = req.body.minParticipants !== undefined ? req.body.minParticipants : existingEvent.minParticipants;
    const maxParticipants = req.body.maxParticipants !== undefined ? req.body.maxParticipants : existingEvent.maxParticipants;

    if (minParticipants > maxParticipants) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Minimum participants cannot exceed maximum participants.");
    }

    // Check if updating maxParticipants would make event FULL
    if (req.body.maxParticipants !== undefined && existingEvent.currentParticipants > req.body.maxParticipants) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Cannot set max participants below current participant count.");
    }

    const updateData: any = {};
    if (req.body.name !== undefined) updateData.name = req.body.name;
    if (req.body.type !== undefined) updateData.type = req.body.type;
    if (req.body.description !== undefined) updateData.description = req.body.description;
    if (req.body.date !== undefined) updateData.date = req.body.date;
    if (req.body.location !== undefined) updateData.location = req.body.location;
    if (req.body.minParticipants !== undefined) updateData.minParticipants = req.body.minParticipants;
    if (req.body.maxParticipants !== undefined) updateData.maxParticipants = req.body.maxParticipants;
    if (req.body.joiningFee !== undefined) updateData.joiningFee = req.body.joiningFee;
    if (req.body.status !== undefined) updateData.status = req.body.status;
    if (req.body.image !== undefined) updateData.image = req.body.image;

    // Auto-update status to FULL if currentParticipants >= maxParticipants
    if (updateData.maxParticipants !== undefined && existingEvent.currentParticipants >= updateData.maxParticipants) {
        updateData.status = EventStatus.FULL;
    } else if (updateData.maxParticipants !== undefined && existingEvent.currentParticipants < updateData.maxParticipants && existingEvent.status === EventStatus.FULL) {
        updateData.status = EventStatus.OPEN;
    }

    const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: updateData
    });

    return updatedEvent;
};

/**
 * Delete event (Host only - own events, soft delete)
 */
const deleteEvent = async (user: IJWTPayload, eventId: string): Promise<Event> => {
    // Verify user is a host
    const host = await prisma.host.findUniqueOrThrow({
        where: { email: user.email, isDeleted: false }
    });

    // Verify event exists and belongs to this host
    const existingEvent = await prisma.event.findUniqueOrThrow({
        where: { id: eventId, isDeleted: false }
    });

    if (existingEvent.hostId !== host.id) {
        throw new ApiError(httpStatus.FORBIDDEN, "You can only delete your own events.");
    }

    // Soft delete
    const deletedEvent = await prisma.event.update({
        where: { id: eventId },
        data: { isDeleted: true, status: EventStatus.CANCELLED }
    });

    return deletedEvent;
};

/**
 * Get my events (Host only - events I created)
 */
const getMyEvents = async (user: IJWTPayload, params: any, options: any) => {
    // Verify user is a host
    const host = await prisma.host.findUniqueOrThrow({
        where: { email: user.email, isDeleted: false }
    });

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);
    const { searchTerm, status, ...filterData } = params;

    const andConditions: Prisma.EventWhereInput[] = [
        { hostId: host.id }, // Only events created by this host
        { isDeleted: false }
    ];

    // Search by name, description, or location
    if (searchTerm) {
        andConditions.push({
            OR: eventSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }

    // Filter by status
    if (status) {
        andConditions.push({ status: status as EventStatus });
    }

    // Add other filters
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => {
                if (key === 'type') {
                    return { [key]: { equals: filterData[key] as EventType } };
                } else {
                    return { [key]: { equals: filterData[key] } };
                }
            })
        });
    }

    const whereConditions: Prisma.EventWhereInput = { AND: andConditions };

    const result = await prisma.event.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: { [sortBy]: sortOrder },
        include: {
            _count: {
                select: {
                    participants: true
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
 * Update event status (Host only - own events)
 */
const updateEventStatus = async (user: IJWTPayload, eventId: string, status: EventStatus): Promise<Event> => {
    // Verify user is a host
    const host = await prisma.host.findUniqueOrThrow({
        where: { email: user.email, isDeleted: false }
    });

    // Verify event exists and belongs to this host
    const existingEvent = await prisma.event.findUniqueOrThrow({
        where: { id: eventId, isDeleted: false }
    });

    if (existingEvent.hostId !== host.id) {
        throw new ApiError(httpStatus.FORBIDDEN, "You can only update your own events.");
    }

    // Validate status transitions
    if (existingEvent.status === EventStatus.COMPLETED && status !== EventStatus.COMPLETED) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Cannot change status of a completed event.");
    }

    // Auto-update to FULL if currentParticipants >= maxParticipants
    let finalStatus = status;
    if (status === EventStatus.OPEN && existingEvent.currentParticipants >= existingEvent.maxParticipants) {
        finalStatus = EventStatus.FULL;
    }

    const updatedEvent = await prisma.event.update({
        where: { id: eventId },
        data: { status: finalStatus }
    });

    return updatedEvent;
};

export const EventService = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents,
    updateEventStatus
};

