"use server"

import { ResponseCookie } from "next/dist/compiled/@edge-runtime/cookies";
import { cookies } from "next/headers";

export const setCookie = async (key: string, value: string, options: Partial<ResponseCookie>) => {
    const cookieStore = await cookies();
    cookieStore.set(key, value, options);
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

