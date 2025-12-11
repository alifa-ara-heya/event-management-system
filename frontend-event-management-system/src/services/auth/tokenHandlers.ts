"use server"

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const setCookie = async (key: string, value: string, options: Partial<ResponseCookie>) => {
    const cookieStore = await cookies();
    // Ensure all required options are set for persistence
    const cookieOptions: Partial<ResponseCookie> = {
        path: "/",
        ...options,
    };
    cookieStore.set(key, value, cookieOptions);
    console.log(`🍪 Cookie ${key} set with options:`, cookieOptions);
}

export const getCookie = async (key: string) => {
    const cookieStore = await cookies();
    return cookieStore.get(key)?.value || null;
}

export const deleteCookie = async (key: string) => {
    const cookieStore = await cookies();
    // Delete and also set with expired date to ensure it's cleared
    cookieStore.delete(key);
    cookieStore.set(key, "", {
        expires: new Date(0),
        path: "/",
    });
}

