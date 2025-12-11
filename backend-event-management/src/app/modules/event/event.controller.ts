import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { EventService } from "./event.service";
import catchAsync from "../../shared/catchAsync";

const createEvent = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await EventService.createEvent(user, req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Event created successfully",
        data: result
    });
});

const getAllEvents = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page,
        limit,
        sortBy,
        sortOrder
    };

    const result = await EventService.getAllEvents(filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Events retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const getEventById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await EventService.getEventById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event retrieved successfully",
        data: result
    });
});

const updateEvent = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await EventService.updateEvent(user, id, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event updated successfully",
        data: result
    });
});

const deleteEvent = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await EventService.deleteEvent(user, id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event deleted successfully",
        data: result
    });
});

const getMyEvents = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page,
        limit,
        sortBy,
        sortOrder
    };

    const result = await EventService.getMyEvents(user, filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My events retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const updateEventStatus = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { id } = req.params;
    const result = await EventService.updateEventStatus(user, id, req.body.status);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Event status updated successfully",
        data: result
    });
});

export const EventController = {
    createEvent,
    getAllEvents,
    getEventById,
    updateEvent,
    deleteEvent,
    getMyEvents,
    updateEventStatus
};

