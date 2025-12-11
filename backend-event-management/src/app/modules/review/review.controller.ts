import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { ReviewService } from "./review.service";
import catchAsync from "../../shared/catchAsync";

const insertIntoDB = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await ReviewService.insertIntoDB(user, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Review created successfully",
        data: result
    });
});

const getAllFromDB = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page: page as string | number | undefined,
        limit: limit as string | number | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as string | undefined
    };

    const result = await ReviewService.getAllFromDB(filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Reviews retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const getHostReviews = catchAsync(async (req: Request, res: Response) => {
    const { hostId } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;

    const paginationOptions = {
        page: page as string | number | undefined,
        limit: limit as string | number | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as string | undefined
    };

    const result = await ReviewService.getHostReviews(hostId, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host reviews retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const getEventReviews = catchAsync(async (req: Request, res: Response) => {
    const { eventId } = req.params;
    const { page, limit, sortBy, sortOrder } = req.query;

    const paginationOptions = {
        page: page as string | number | undefined,
        limit: limit as string | number | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as string | undefined
    };

    const result = await ReviewService.getEventReviews(eventId, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event reviews retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

export const ReviewController = {
    insertIntoDB,
    getAllFromDB,
    getHostReviews,
    getEventReviews
};

