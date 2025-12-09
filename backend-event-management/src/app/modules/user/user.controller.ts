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

export const UserController = {
    createUser,
    createAdmin,
    createHost
};

