import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { serverFetch } from "@/lib/server-fetch";

async function BecomeAHostRedirect() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("accessToken")?.value;

    // If not logged in, redirect to login with return path
    if (!accessToken) {
        redirect("/login?redirect=/dashboard/become-host");
    }

    try {
        // Check user's role
        const response = await serverFetch.get("/auth/me");
        const result = await response.json();

        if (result.success && result.data) {
            const userRole = result.data.role;

            // If user is already a host, redirect to host dashboard
            if (userRole === "HOST") {
                redirect("/host/dashboard");
            }

            // If user is an admin, they can't become a host (or redirect to admin dashboard)
            if (userRole === "ADMIN") {
                redirect("/admin/dashboard");
            }

            // If user is a regular user, redirect to become host page
            if (userRole === "USER") {
                redirect("/dashboard/become-host");
            }
        }

        // Fallback: redirect to login if we can't determine role
        redirect("/login?redirect=/dashboard/become-host");
    } catch (error) {
        // If there's an error, redirect to login
        redirect("/login?redirect=/dashboard/become-host");
    }
}

export default BecomeAHostRedirect;

