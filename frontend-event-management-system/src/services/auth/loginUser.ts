/* eslint-disable @typescript-eslint/no-explicit-any */
"use server"

import { getDefaultDashboardRoute, isValidRedirectForRole, UserRole } from "@/lib/auth-utils";
import { serverFetch } from "@/lib/server-fetch";
import { zodValidator } from "@/lib/zodValidator";
import { loginValidationZodSchema } from "@/zod/auth.validation";
import { parse } from "cookie";
import { redirect } from "next/navigation";
import { setCookie } from "./tokenHandlers";

export const loginUser = async (_currentState: any, formData: FormData): Promise<any> => {
    try {
        const redirectTo = formData.get('redirect') || null;

        const payload = {
            email: formData.get('email'),
            password: formData.get('password'),
        }

        const validationResult = zodValidator(payload, loginValidationZodSchema);

        if (validationResult.success === false) {
            return validationResult;
        }

        const validatedPayload = validationResult.data;

        console.log("🔐 Attempting login for:", validatedPayload.email);

        const res = await serverFetch.post("/auth/login", {
            body: JSON.stringify(validatedPayload),
            headers: {
                "Content-Type": "application/json",
            }
        });

        const result = await res.json();
        console.log("📥 Login response:", { success: result.success, message: result.message });
        console.log("📋 Response status:", res.status);

        // Check if login was successful FIRST - before checking cookies
        if (!result.success) {
            console.error("❌ Login failed:", result.message);
            // Clean up error message - remove Prisma error details for user-friendly message
            let errorMessage = result.message || "Login failed";
            if (errorMessage.includes("No record was found")) {
                errorMessage = "Invalid email or password. Please check your credentials and try again.";
            } else if (errorMessage.includes("Password is incorrect")) {
                errorMessage = "Invalid email or password. Please check your credentials and try again.";
            }
            return {
                success: false,
                message: errorMessage
            };
        }

        // Check response status
        if (!res.ok) {
            console.error("❌ Login request failed with status:", res.status);
            return {
                success: false,
                message: result.message || `Login failed with status ${res.status}`
            };
        }

        console.log("📋 Response headers:", Object.fromEntries(res.headers.entries()));

        const setCookieHeaders = res.headers.getSetCookie();
        console.log("🍪 Set-Cookie headers (getSetCookie):", setCookieHeaders);

        // Also check for cookies in the response headers directly
        const cookieHeader = res.headers.get('set-cookie');
        console.log("🍪 Set-Cookie header (raw get):", cookieHeader);

        // Try to parse cookies from the raw header if getSetCookie doesn't work
        let accessTokenObject: any = null;
        let refreshTokenObject: any = null;

        if (setCookieHeaders && setCookieHeaders.length > 0) {
            setCookieHeaders.forEach((cookie: string) => {
                const parsedCookie = parse(cookie);
                console.log("🍪 Parsed cookie:", parsedCookie);

                if (parsedCookie['accessToken']) {
                    accessTokenObject = parsedCookie;
                }
                if (parsedCookie['refreshToken']) {
                    refreshTokenObject = parsedCookie;
                }
            });
        } else if (cookieHeader) {
            // Fallback: parse from raw header string
            console.log("⚠️ Using fallback cookie parsing");
            const cookies = cookieHeader.split(',').map(c => c.trim());
            cookies.forEach((cookie: string) => {
                const parsedCookie = parse(cookie);
                if (parsedCookie['accessToken']) {
                    accessTokenObject = parsedCookie;
                }
                if (parsedCookie['refreshToken']) {
                    refreshTokenObject = parsedCookie;
                }
            });
        }

        console.log("🔍 Token objects:", {
            hasAccessToken: !!accessTokenObject,
            hasRefreshToken: !!refreshTokenObject
        });

        if (accessTokenObject && accessTokenObject.accessToken) {
            console.log("✅ Access token found, setting cookie...");
            await setCookie("accessToken", accessTokenObject.accessToken, {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: parseInt(accessTokenObject['Max-Age']) || 1000 * 60 * 60,
                path: accessTokenObject.Path || "/",
                sameSite: (accessTokenObject['SameSite']?.toLowerCase() || "lax") as "lax" | "strict" | "none",
            });
        }

        if (refreshTokenObject && refreshTokenObject.refreshToken) {
            console.log("✅ Refresh token found, setting cookie...");
            await setCookie("refreshToken", refreshTokenObject.refreshToken, {
                secure: process.env.NODE_ENV === 'production',
                httpOnly: true,
                maxAge: parseInt(refreshTokenObject['Max-Age']) || 1000 * 60 * 60 * 24 * 90,
                path: refreshTokenObject.Path || "/",
                sameSite: (refreshTokenObject['SameSite']?.toLowerCase() || "lax") as "lax" | "strict" | "none",
            });
        }

        if (!accessTokenObject || !accessTokenObject.accessToken) {
            console.error("❌ No access token found in cookies");
            console.error("📋 Available cookie data:", { accessTokenObject, refreshTokenObject });
            return {
                success: false,
                message: "Login failed: No authentication tokens received. Please check backend cookie settings."
            };
        }

        // Decode token to get user role (simple decode without verification for now)
        const tokenParts = accessTokenObject.accessToken.split('.');
        if (tokenParts.length === 3) {
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            const userRole: UserRole = payload.role;

            console.log("✅ Login successful! Role:", userRole);

            // Redirect to dashboard (ignore reset-password redirects)
            if (redirectTo) {
                const requestedPath = redirectTo.toString();
                // Ignore reset-password redirects
                if (requestedPath === "/reset-password" || requestedPath.startsWith("/reset-password")) {
                    redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
                } else if (isValidRedirectForRole(requestedPath, userRole)) {
                    redirect(`${requestedPath}?loggedIn=true`);
                } else {
                    redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
                }
            } else {
                redirect(`${getDefaultDashboardRoute(userRole)}?loggedIn=true`);
            }
        } else {
            console.error("❌ Invalid token format");
            return { success: false, message: "Login failed: Invalid token format" };
        }

        return result;

    } catch (error: any) {
        // Re-throw NEXT_REDIRECT errors so Next.js can handle them
        if (error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error;
        }
        console.error("❌ Login error:", error);
        return {
            success: false,
            message: `${process.env.NODE_ENV === 'development' ? error.message : "Login Failed. You might have entered incorrect email or password."}`
        };
    }
}

