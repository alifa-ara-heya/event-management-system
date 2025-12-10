import { Request, Response } from "express";
import httpStatus from "http-status";
import sendResponse from "../../shared/sendResponse";
import { HostService } from "./host.service";
import catchAsync from "../../shared/catchAsync";

const submitHostRequest = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await HostService.submitHostRequest(user, req);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Host request submitted successfully",
        data: result
    });
});

const getAllHostRequests = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page,
        limit,
        sortBy,
        sortOrder
    };

    const result = await HostService.getAllHostRequests(filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host requests retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const approveHostRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HostService.approveHostRequest(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host request approved and host account created successfully",
        data: result
    });
});

const rejectHostRequest = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HostService.rejectHostRequest(id, req.body.rejectionReason);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host request rejected successfully",
        data: result
    });
});

const getAllHosts = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, sortBy, sortOrder, ...filterParams } = req.query;

    const paginationOptions = {
        page,
        limit,
        sortBy,
        sortOrder
    };

    const result = await HostService.getAllHosts(filterParams, paginationOptions);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Hosts retrieved successfully",
        meta: result.meta,
        data: result.data
    });
});

const getHostById = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HostService.getHostById(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host profile retrieved successfully",
        data: result
    });
});

const getMyHostStats = catchAsync(async (req: Request & { user?: any }, res: Response) => {
    const user = req.user;
    const result = await HostService.getMyHostStats(user);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host statistics retrieved successfully",
        data: result
    });
});

const updateHostStatus = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HostService.updateHostStatus(id, req.body.isDeleted);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host status updated successfully",
        data: result
    });
});

const deleteHost = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;
    const result = await HostService.deleteHost(id);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Host deleted successfully",
        data: result
    });
});

export const HostController = {
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

