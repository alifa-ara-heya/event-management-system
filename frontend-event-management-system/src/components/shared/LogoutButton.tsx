"use client";

import { logoutUser } from "@/services/auth/logoutUser";
import { useTransition } from "react";
import { toast } from "sonner";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleLogout = async () => {
        // Clear cookies client-side immediately
        document.cookie = "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
        document.cookie = "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";

        // Dispatch custom event to notify navbar BEFORE redirect
        window.dispatchEvent(new CustomEvent("user-logged-out"));

        startTransition(async () => {
            // Call server action to clear cookies server-side
            await logoutUser();

            // Show toast
            toast.success("You have been logged out successfully");

            // Small delay to ensure state updates, then redirect
            setTimeout(() => {
                router.push("/");
                router.refresh();
            }, 50);
        });
    };

    return (
        <DropdownMenuItem
            onClick={handleLogout}
            disabled={isPending}
            className="cursor-pointer"
        >
            {isPending ? "Logging out..." : "Log out"}
        </DropdownMenuItem>
    );
}

