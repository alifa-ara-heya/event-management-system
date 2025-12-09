import { NextFunction, Request, Response } from "express"
import config from "../../config";
import ApiError from "../errors/ApiError";
import httpStatus from "http-status"
import { jwtHelper } from "../helpers/jwtHelper";

export const auth = (...roles: string[]) => {
    return async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
        try {
            const token = req.cookies?.accessToken;

            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You don't have tokens. You are not authorized!")
            }

            const accessSecret = config.jwt.access_secret
            if (!accessSecret) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "JWT access secret is not configured.")
            }

            const verifyUser = jwtHelper.verifyToken(token, accessSecret)

            req.user = verifyUser;

            if (roles.length && !roles.includes(verifyUser.role)) {
                throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized.')
            }

            next()


        } catch (error) {
            next(error)
        }
    }
}