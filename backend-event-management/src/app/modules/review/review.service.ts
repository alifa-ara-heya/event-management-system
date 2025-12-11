import { prisma } from "../../shared/prisma";
import ApiError from "../../errors/ApiError";
import httpStatus from "http-status";
import { IJWTPayload } from "../../types/common";
import { Prisma } from "@prisma/client";
import { calculatePagination, IOptions } from "../../helpers/paginationHelper";

/**
 * Create a review for a host after attending an event
 */
const insertIntoDB = async (user: IJWTPayload, payload: any) => {
    // Verify user exists and get user ID
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email
        },
        select: {
            id: true,
            email: true
        }
    });

    // Verify event exists
    const eventData = await prisma.event.findUniqueOrThrow({
        where: {
            id: payload.eventId,
            isDeleted: false
        },
        include: {
            host: true
        }
    });

    // Verify user attended this event
    const participant = await prisma.eventParticipant.findUnique({
        where: {
            eventId_userId: {
                eventId: payload.eventId,
                userId: user.email
            }
        }
    });

    if (!participant || participant.isDeleted) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You can only review events you have attended."
        );
    }

    // Check if event date has passed (optional - can review after event)
    const eventDate = new Date(eventData.date);
    const now = new Date();
    if (eventDate > now) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You can only review events that have already occurred."
        );
    }

    // Check if user already reviewed this host for this event
    const existingReview = await prisma.review.findFirst({
        where: {
            eventId: payload.eventId,
            reviewerId: userData.id,
            hostId: eventData.host.email,
            isDeleted: false
        }
    });

    if (existingReview) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "You have already reviewed this host for this event."
        );
    }

    // Validate rating (1-5)
    if (payload.rating < 1 || payload.rating > 5) {
        throw new ApiError(
            httpStatus.BAD_REQUEST,
            "Rating must be between 1 and 5."
        );
    }

    return await prisma.$transaction(async (tnx) => {
        // Create review
        const result = await tnx.review.create({
            data: {
                eventId: eventData.id,
                hostId: eventData.host.email,
                reviewerId: userData.id,
                rating: payload.rating,
                comment: payload.comment
            }
        });

        // Calculate average rating for the host
        const avgRating = await tnx.review.aggregate({
            _avg: {
                rating: true
            },
            where: {
                hostId: eventData.host.email,
                isDeleted: false
            }
        });

        // Update host's average rating
        await tnx.host.update({
            where: {
                email: eventData.host.email
            },
            data: {
                averageRating: avgRating._avg.rating as number || 0
            }
        });

        return result;
    });
};

/**
 * Get all reviews with pagination and filters
 */
const getAllFromDB = async (filters: any, options: IOptions) => {
    const { limit, page, skip } = calculatePagination(options);
    const { reviewerEmail, hostEmail, eventId } = filters;

    const andConditions: Prisma.ReviewWhereInput[] = [
        { isDeleted: false }
    ];

    if (reviewerEmail) {
        andConditions.push({
            reviewer: {
                email: reviewerEmail
            }
        });
    }

    if (hostEmail) {
        andConditions.push({
            host: {
                email: hostEmail
            }
        });
    }

    if (eventId) {
        andConditions.push({
            eventId: eventId
        });
    }

    const whereConditions: Prisma.ReviewWhereInput =
        andConditions.length > 0 ? { AND: andConditions } : { isDeleted: false };

    const result = await prisma.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy:
            options.sortBy && options.sortOrder
                ? { [options.sortBy]: options.sortOrder }
                : {
                    createdAt: "desc"
                },
        include: {
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profilePhoto: true
                }
            },
            host: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profilePhoto: true
                }
            }
        }
    });

    const total = await prisma.review.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

/**
 * Get reviews for a specific host (includes all reviews for the host, including event-specific ones)
 */
const getHostReviews = async (hostId: string, options: IOptions) => {
    // First, get the host by ID to get their email (since Review.hostId references Host.email)
    const host = await prisma.host.findUniqueOrThrow({
        where: { id: hostId, isDeleted: false },
        select: { email: true }
    });

    const { limit, page, skip } = calculatePagination(options);

    // Get all reviews for this host (includes both event-specific and general host reviews)
    const whereConditions: Prisma.ReviewWhereInput = {
        hostId: host.email,
        isDeleted: false
    };

    const result = await prisma.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc"
        },
        include: {
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profilePhoto: true
                }
            },
            host: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profilePhoto: true
                }
            }
        }
    });

    const total = await prisma.review.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

/**
 * Get reviews for a specific event
 */
const getEventReviews = async (eventId: string, options: IOptions) => {
    const { limit, page, skip } = calculatePagination(options);

    const whereConditions: Prisma.ReviewWhereInput = {
        eventId: eventId,
        isDeleted: false
    };

    const result = await prisma.review.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            createdAt: "desc"
        },
        include: {
            reviewer: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profilePhoto: true
                }
            },
            host: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    profilePhoto: true
                }
            }
        }
    });

    const total = await prisma.review.count({
        where: whereConditions
    });

    return {
        meta: {
            total,
            page,
            limit
        },
        data: result
    };
};

export const ReviewService = {
    insertIntoDB,
    getAllFromDB,
    getHostReviews,
    getEventReviews
};

