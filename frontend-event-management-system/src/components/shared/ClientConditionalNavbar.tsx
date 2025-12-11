"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { Navbar } from "./navbar";
import { UserInfo } from "@/services/auth/getUserInfo";

export function ClientConditionalNavbar() {
    const pathname = usePathname();
    const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [authKey, setAuthKey] = useState(0); // Force re-render key

    // Hide navbar in dashboard routes
    const isDashboardRoute = pathname.startsWith("/dashboard") ||
        pathname.startsWith("/host") ||
        pathname.startsWith("/admin") ||
        pathname.startsWith("/my-profile");

    const checkAuth = useCallback(async () => {
        try {
            console.log("🔍 Checking authentication status...");
            const response = await fetch("/api/auth/me", {
                credentials: "include",
                cache: "no-store",
                headers: {
                    "Cache-Control": "no-cache",
                },
            });

            console.log("📡 Auth check response status:", response.status);

            if (response.ok) {
                const data = await response.json();
                console.log("✅ Auth check successful, user data:", data.data);
                if (data.success && data.data && data.data.email) {
                    setUserInfo({
                        id: data.data.id,
                        name: data.data.name,
                        email: data.data.email,
                        role: data.data.role,
                        profilePhoto: data.data.profilePhoto,
                    });
                } else {
                    console.log("❌ Auth check failed: invalid data structure");
                    setUserInfo(null);
                }
            } else {
                // 401 or other error - user is not logged in
                console.log("❌ Auth check failed: status", response.status);
                setUserInfo(null);
            }
        } catch (error) {
            // Network error or other issue - assume not logged in
            console.error("❌ Error checking auth:", error);
            setUserInfo(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (isDashboardRoute) {
            setIsLoading(false);
            setUserInfo(null);
            return;
        }

        // Always re-check auth when pathname changes (especially when navigating from dashboard to home)
        console.log("🔄 Checking auth for pathname:", pathname);
        setIsLoading(true);
        checkAuth();
    }, [isDashboardRoute, pathname, checkAuth, authKey]);

    // Listen for logout event and immediately clear user info
    useEffect(() => {
        if (isDashboardRoute) return;

        const handleLogout = (e: Event) => {
            console.log("Logout event received, clearing user info");
            setUserInfo(null);
            setIsLoading(false);
            // Don't re-check auth after logout - cookies are cleared
        };

        const handleFocus = () => {
            checkAuth();
        };

        window.addEventListener("user-logged-out", handleLogout as EventListener);
        window.addEventListener("focus", handleFocus);

        return () => {
            window.removeEventListener("user-logged-out", handleLogout as EventListener);
            window.removeEventListener("focus", handleFocus);
        };
    }, [isDashboardRoute, checkAuth]);

    if (isDashboardRoute) {
        return null;
    }

    if (isLoading) {
        return (
            <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
                <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                    <div className="h-9 w-32 bg-muted animate-pulse rounded" />
                    <div className="h-9 w-24 bg-muted animate-pulse rounded" />
                </div>
            </header>
        );
    }

    return <Navbar userInfo={userInfo} />;
}
