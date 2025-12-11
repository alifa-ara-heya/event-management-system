import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { AdminService } from "./admin.service";
import catchAsync from "../../shared/catchAsync";

const getDashboardStats = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getDashboardStats();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: result
    });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page: page as string | number | undefined,
        limit: limit as string | number | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as string | undefined
    };

    const result = await AdminService.getAllEvents(filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Events retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const updateEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.updateEvent(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event updated successfully",
        data: result
    });
});

const deleteEvent = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.deleteEvent(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event deleted successfully",
        data: result
    });
});

const updateEventStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await AdminService.updateEventStatus(id, req.body.status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event status updated successfully",
        data: result
    });
});

const getEventStatistics = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getEventStatistics();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event statistics retrieved successfully",
        data: result
    });
});

const getUserStatistics = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getUserStatistics();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User statistics retrieved successfully",
        data: result
    });
});

const getHostStatistics = catchAsync(async (req: Request, res: Response) => {
    const result = await AdminService.getHostStatistics();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host statistics retrieved successfully",
        data: result
    });
});

export const AdminController = {
    getDashboardStats,
    getAllEvents,
    updateEvent,
    deleteEvent,
    updateEventStatus,
    getEventStatistics,
    getUserStatistics,
    getHostStatistics
};

