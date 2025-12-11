import { NavbarWrapper } from "./NavbarWrapper";

interface ConditionalNavbarProps {
    pathname: string;
}

export async function ConditionalNavbar({ pathname }: ConditionalNavbarProps) {
    // Hide navbar in dashboard routes
    const isDashboardRoute = pathname.startsWith("/dashboard") || 
                             pathname.startsWith("/host") || 
                             pathname.startsWith("/admin") ||
                             pathname.startsWith("/my-profile");
    
    if (isDashboardRoute) {
        return null;
    }
    
    return <NavbarWrapper />;
}
