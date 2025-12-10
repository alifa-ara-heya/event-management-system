import { Request } from "express";
import bcrypt from "bcryptjs";
import { fileUploader } from "../../helpers/fileUploader";
import config from "../../../config";
import { User, UserRole, UserStatus, Admin, Host, Prisma } from "@prisma/client";
import { prisma } from "src/app/shared/prisma";
import { IJWTPayload } from "../../types/common";
import { calculatePagination } from "../../helpers/paginationHelper";
import { userSearchableFields } from "./user.constant";

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

const getMyProfile = async (user: IJWTPayload) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        },
        select: {
            id: true,
            email: true,
            needPasswordChange: true,
            role: true,
            status: true,
            profilePhoto: true,
            bio: true,
            location: true,
            interests: true
        }
    });

    let profileData;

    if (userInfo.role === UserRole.USER) {
        // For regular users, profile data is in the User model itself
        profileData = {
            bio: userInfo.bio,
            location: userInfo.location,
            interests: userInfo.interests,
            profilePhoto: userInfo.profilePhoto
        };
    } else if (userInfo.role === UserRole.HOST) {
        profileData = await prisma.host.findUnique({
            where: {
                email: userInfo.email
            }
        });
    } else if (userInfo.role === UserRole.ADMIN) {
        profileData = await prisma.admin.findUnique({
            where: {
                email: userInfo.email
            }
        });
    }

    return {
        ...userInfo,
        ...profileData
    };
};

const updateMyProfile = async (user: IJWTPayload, req: Request) => {
    const userInfo = await prisma.user.findUniqueOrThrow({
        where: {
            email: user?.email,
            status: UserStatus.ACTIVE
        }
    });

    const file = req.file;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.profilePhoto = uploadToCloudinary?.secure_url;
    }

    let profileInfo;

    if (userInfo.role === UserRole.USER) {
        // Update User model directly for regular users
        // User model fields: bio, location, interests, profilePhoto
        profileInfo = await prisma.user.update({
            where: {
                email: userInfo.email
            },
            data: {
                bio: req.body.bio,
                location: req.body.location,
                interests: req.body.interests,
                profilePhoto: req.body.profilePhoto
            }
        });
    } else if (userInfo.role === UserRole.ADMIN) {
        // Admin model fields: name, contactNumber, profilePhoto
        // Note: Admin does NOT have bio, location, or interests
        // Use upsert to create if doesn't exist, update if exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email: userInfo.email }
        });

        const updateData: any = {};
        if (req.body.name !== undefined) updateData.name = req.body.name;
        if (req.body.contactNumber !== undefined) updateData.contactNumber = req.body.contactNumber;
        if (req.body.profilePhoto !== undefined) updateData.profilePhoto = req.body.profilePhoto;

        profileInfo = await prisma.admin.upsert({
            where: {
                email: userInfo.email
            },
            update: updateData,
            create: {
                email: userInfo.email,
                name: req.body.name || existingAdmin?.name || "Admin", // Use existing name or default
                contactNumber: req.body.contactNumber,
                profilePhoto: req.body.profilePhoto
            }
        });
    } else if (userInfo.role === UserRole.HOST) {
        // Host model fields: name, contactNumber, bio, location, profilePhoto
        // User model fields: interests (interests are stored in User model, not Host model)
        // Use upsert to create if doesn't exist, update if exists
        const existingHost = await prisma.host.findUnique({
            where: { email: userInfo.email }
        });

        const hostUpdateData: any = {};
        if (req.body.name !== undefined) hostUpdateData.name = req.body.name;
        if (req.body.contactNumber !== undefined) hostUpdateData.contactNumber = req.body.contactNumber;
        if (req.body.bio !== undefined) hostUpdateData.bio = req.body.bio;
        if (req.body.location !== undefined) hostUpdateData.location = req.body.location;
        if (req.body.profilePhoto !== undefined) hostUpdateData.profilePhoto = req.body.profilePhoto;

        // Update Host model
        profileInfo = await prisma.host.upsert({
            where: {
                email: userInfo.email
            },
            update: hostUpdateData,
            create: {
                email: userInfo.email,
                name: req.body.name || existingHost?.name || "Host", // Use existing name or default
                contactNumber: req.body.contactNumber,
                bio: req.body.bio,
                location: req.body.location,
                profilePhoto: req.body.profilePhoto
            }
        });

        // Update User model for interests (if provided)
        if (req.body.interests !== undefined) {
            await prisma.user.update({
                where: {
                    email: userInfo.email
                },
                data: {
                    interests: req.body.interests
                }
            });
        }
    }

    // For HOST, also return interests from User model
    if (userInfo.role === UserRole.HOST) {
        const userData = await prisma.user.findUnique({
            where: { email: userInfo.email },
            select: { interests: true }
        });
        return { ...profileInfo, interests: userData?.interests || [] };
    }

    return { ...profileInfo };
};

/**
 * Retrieves all users from the database with advanced filtering, searching, and pagination
 * 
 * @param params - Contains search term and filter criteria (e.g., { searchTerm: "john", role: "USER", status: "ACTIVE" })
 * @param options - Contains pagination and sorting options (e.g., { page: 1, limit: 10, sortBy: "createdAt", sortOrder: "desc" })
 * @returns Promise with paginated user data and metadata (total count, page info)
 */
const getAllUsers = async (params: any, options: any) => {
    // STEP 1: Calculate pagination values
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(options);

    // STEP 2: Separate search term from other filter criteria
    const { searchTerm, ...filterData } = params;

    // STEP 3: Build an array to hold all our search/filter conditions
    const andConditions: Prisma.UserWhereInput[] = [];

    // STEP 4: Add search condition (if searchTerm exists)
    if (searchTerm) {
        andConditions.push({
            OR: userSearchableFields.map(field => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        });
    }

    // STEP 5: Add filter conditions (if any filter data exists)
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key]
                }
            }))
        });
    }

    // STEP 6: Exclude deleted users by default
    andConditions.push({
        isDeleted: false
    });

    // STEP 7: Combine all conditions into final WHERE clause
    const whereConditions: Prisma.UserWhereInput = andConditions.length > 0 ? {
        AND: andConditions
    } : {
        isDeleted: false
    };

    // STEP 8: Execute the database query
    const result = await prisma.user.findMany({
        skip,
        take: limit,
        where: whereConditions,
        orderBy: {
            [sortBy]: sortOrder
        },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
            profilePhoto: true,
            bio: true,
            location: true,
            interests: true,
            createdAt: true,
            updatedAt: true,
            host: {
                select: {
                    name: true,
                    profilePhoto: true,
                    contactNumber: true,
                    bio: true,
                    location: true,
                    averageRating: true,
                    totalRevenue: true
                }
            },
            admin: {
                select: {
                    name: true,
                    profilePhoto: true,
                    contactNumber: true
                }
            }
        }
    });

    // STEP 8.5: Merge Host/Admin data with User data
    const mergedResult = result.map(user => {
        // Remove host and admin from the base user object
        const { host, admin, ...userBase } = user;

        if (user.role === UserRole.HOST && user.host) {
            // For HOST, merge Host model data (prioritize Host data over User data)
            return {
                ...userBase,
                name: user.host.name,
                profilePhoto: user.host.profilePhoto || userBase.profilePhoto,
                contactNumber: user.host.contactNumber,
                bio: user.host.bio || userBase.bio,
                location: user.host.location || userBase.location,
                averageRating: user.host.averageRating,
                totalRevenue: user.host.totalRevenue
            };
        } else if (user.role === UserRole.ADMIN && user.admin) {
            // For ADMIN, merge Admin model data (prioritize Admin data over User data)
            return {
                ...userBase,
                name: user.admin.name,
                profilePhoto: user.admin.profilePhoto || userBase.profilePhoto,
                contactNumber: user.admin.contactNumber
            };
        }
        // For USER role, return as is
        return userBase;
    });

    // STEP 9: Count total matching records
    const total = await prisma.user.count({
        where: whereConditions
    });

    // STEP 10: Return formatted response with data and metadata
    return {
        meta: {
            page,
            limit,
            total
        },
        data: mergedResult
    };
};

/**
 * Soft deletes a user by setting isDeleted to true
 * @param id - User ID to delete
 * @returns Promise<User> - The updated user record
 */
const deleteUser = async (id: string) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const deletedUser = await prisma.user.update({
        where: {
            id
        },
        data: {
            isDeleted: true,
            status: UserStatus.DELETED
        }
    });

    return deletedUser;
};

/**
 * Changes user status (ACTIVE, INACTIVE, DELETED)
 * @param id - User ID
 * @param payload - Status update payload
 * @returns Promise<User> - The updated user record
 */
const changeUserStatus = async (id: string, payload: { status: UserStatus }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id
        }
    });

    const updateData: any = {
        status: payload.status
    };

    // If status is DELETED, also set isDeleted to true
    if (payload.status === UserStatus.DELETED) {
        updateData.isDeleted = true;
    } else if (payload.status === UserStatus.ACTIVE) {
        // If activating, set isDeleted to false
        updateData.isDeleted = false;
    }

    const updateUserStatus = await prisma.user.update({
        where: {
            id
        },
        data: updateData
    });

    return updateUserStatus;
};

export const UserService = {
    createUser,
    createAdmin,
    createHost,
    getMyProfile,
    updateMyProfile,
    getAllUsers,
    deleteUser,
    changeUserStatus
};

