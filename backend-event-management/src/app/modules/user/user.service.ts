import { Request } from "express";

// import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/fileUploader";
import config from "../../../config";
import { User, UserRole, UserStatus, Admin, Host } from "@prisma/client";
import { prisma } from "src/app/shared/prisma";

/**
 * Creates a new user account
 */
const createUser = async (req: Request): Promise<User> => {
    // File sending is optional, so we will check if it exists
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        // console.log('uploadResult from user.service.ts', uploadResult);
        req.body.profilePhoto = uploadResult?.secure_url;
    }

    // Hash the user's password using bcrypt with salt rounds from config
    const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round));

    const userData = {
        email: req.body.email,
        password: hashPassword,
        role: UserRole.USER, // Default role for regular users
        profilePhoto: req.body.profilePhoto,
        bio: req.body.bio,
        location: req.body.location,
        interests: req.body.interests || [], // Array of interests
    };

    const result = await prisma.user.create({
        data: userData
    });

    return result;
};

// creating admin
const createAdmin = async (req: Request): Promise<Admin> => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.admin.profilePhoto = uploadResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round));

    const userData = {
        email: req.body.admin.email,
        password: hashPassword,
        role: UserRole.ADMIN
    };

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: userData
        });

        const createdAdminData = await tnx.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};

// creating host
const createHost = async (req: Request): Promise<Host> => {
    if (req.file) {
        const uploadResult = await fileUploader.uploadToCloudinary(req.file);
        req.body.host.profilePhoto = uploadResult?.secure_url;
    }

    const hashPassword = await bcrypt.hash(req.body.password, Number(config.bcrypt_salt_round));

    const userData = {
        email: req.body.host.email,
        password: hashPassword,
        role: UserRole.HOST
    };

    const result = await prisma.$transaction(async (tnx) => {
        await tnx.user.create({
            data: userData
        });

        const createdHostData = await tnx.host.create({
            data: req.body.host
        });

        return createdHostData;
    });

    return result;
};

export const UserService = {
    createUser,
    createAdmin,
    createHost
};

