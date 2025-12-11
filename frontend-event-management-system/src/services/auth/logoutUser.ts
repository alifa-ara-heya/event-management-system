"use server";

import { deleteCookie } from "./tokenHandlers";

export const logoutUser = async () => {
    try {
        // Delete both access and refresh tokens
        await deleteCookie("accessToken");
        await deleteCookie("refreshToken");

        return { success: true };
    } catch (error: any) {
        // Even if there's an error, try to clear cookies
        try {
            await deleteCookie("accessToken");
            await deleteCookie("refreshToken");
        } catch (e) {
            console.error("Error clearing cookies:", e);
        }
        return { success: true };
    }
};
