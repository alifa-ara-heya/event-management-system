import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { UserService } from "./user.service";
import catchAsync from "../../shared/catchAsync";

const createUser = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createUser(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User created successfully",
        data: result
    });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createAdmin(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Admin created successfully",
        data: result
    });
});

const createHost = catchAsync(async (req: Request, res: Response) => {
    const result = await UserService.createHost(req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Host created successfully",
        data: result
    });
});

const getMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await UserService.getMyProfile(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile retrieved successfully",
        data: result
    });
});

const updateMyProfile = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await UserService.updateMyProfile(user, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Profile updated successfully",
        data: result
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    // Separate pagination options from filter params
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page,
        limit,
        sortBy,
        sortOrder
    };

    const result = await UserService.getAllUsers(filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Users retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const deleteUser = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.deleteUser(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User deleted successfully",
        data: result
    });
});

const changeUserStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.changeUserStatus(id, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User status updated successfully",
        data: result
    });
});

const getMyJoinedEvents = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page: page as string | number | undefined,
        limit: limit as string | number | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as string | undefined
    };

    const result = await UserService.getMyJoinedEvents(user, filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My joined events retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const getMyUpcomingEvents = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page: page as string | number | undefined,
        limit: limit as string | number | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as string | undefined
    };

    const result = await UserService.getMyUpcomingEvents(user, filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My upcoming events retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const getMyPastEvents = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page: page as string | number | undefined,
        limit: limit as string | number | undefined,
        sortBy: sortBy as string | undefined,
        sortOrder: sortOrder as string | undefined
    };

    const result = await UserService.getMyPastEvents(user, filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My past events retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const getUserProfileById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await UserService.getUserProfileById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "User profile retrieved successfully",
        data: result
    });
});

const getMyDashboardStats = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await UserService.getMyDashboardStats(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Dashboard statistics retrieved successfully",
        data: result
    });
});

export const UserController = {
    createUser,
    createAdmin,
    createHost,
    getMyProfile,
    getUserProfileById,
    updateMyProfile,
    getAllUsers,
    deleteUser,
    changeUserStatus,
    getMyJoinedEvents,
    getMyUpcomingEvents,
    getMyPastEvents,
    getMyDashboardStats
};

