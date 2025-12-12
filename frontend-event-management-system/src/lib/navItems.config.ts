import { getDefaultDashboardRoute, UserRole } from "./auth-utils";

export interface NavItem {
    title: string;
    href: string;
    icon: string;
    badge?: string;
    roles?: UserRole[];
}

export interface NavSection {
    title?: string;
    items: NavItem[];
}

export const getCommonNavItems = (role: UserRole): NavSection[] => {
    const defaultDashboard = getDefaultDashboardRoute(role);

    return [
        {
            items: [
                {
                    title: "Home",
                    href: "/",
                    icon: "Home",
                    roles: ["USER", "HOST", "ADMIN"],
                },
                {
                    title: "Dashboard",
                    href: defaultDashboard,
                    icon: "LayoutDashboard",
                    roles: ["USER", "HOST", "ADMIN"],
                },
                {
                    title: "My Profile",
                    href: "/my-profile",
                    icon: "User",
                    roles: ["USER", "HOST", "ADMIN"],
                },
            ],
        },
    ];
};

export const getUserNavItems = (): NavSection[] => {
    return [
        {
            title: "Events",
            items: [
                {
                    title: "My Events",
                    href: "/dashboard/my-events",
                    icon: "Calendar",
                    roles: ["USER"],
                },
                {
                    title: "Upcoming Events",
                    href: "/dashboard/upcoming-events",
                    icon: "Clock",
                    roles: ["USER"],
                },
                {
                    title: "Past Events",
                    href: "/dashboard/past-events",
                    icon: "History",
                    roles: ["USER"],
                },
            ],
        },
        {
            title: "Payments",
            items: [
                {
                    title: "My Payments",
                    href: "/dashboard/my-payments",
                    icon: "Wallet",
                    roles: ["USER"],
                },
            ],
        },
        {
            title: "Host",
            items: [
                {
                    title: "Become a Host",
                    href: "/dashboard/become-host",
                    icon: "UserPlus",
                    roles: ["USER"],
                },
            ],
        },
    ];
};

export const getHostNavItems = (): NavSection[] => {
    return [
        {
            title: "Event Management",
            items: [
                {
                    title: "My Events",
                    href: "/host/my-events",
                    icon: "Calendar",
                    roles: ["HOST"],
                },
                {
                    title: "Manage Events",
                    href: "/host/manage-events",
                    icon: "Settings",
                    roles: ["HOST"],
                },
                {
                    title: "Create Event",
                    href: "/host/create-event",
                    icon: "PlusCircle",
                    roles: ["HOST"],
                },
            ],
        },
    ];
};

export const getAdminNavItems = (): NavSection[] => {
    return [
        {
            title: "User Management",
            items: [
                {
                    title: "Users",
                    href: "/admin/users",
                    icon: "Users",
                    roles: ["ADMIN"],
                },
                {
                    title: "Hosts",
                    href: "/admin/hosts",
                    icon: "UserCog",
                    roles: ["ADMIN"],
                },
                {
                    title: "Host Requests",
                    href: "/admin/host-requests",
                    icon: "UserCheck",
                    roles: ["ADMIN"],
                },
            ],
        },
        {
            title: "Event Management",
            items: [
                {
                    title: "All Events",
                    href: "/admin/events",
                    icon: "Calendar",
                    roles: ["ADMIN"],
                },
                {
                    title: "Event Statistics",
                    href: "/admin/event-statistics",
                    icon: "BarChart3",
                    roles: ["ADMIN"],
                },
            ],
        },
    ];
};

export const getNavItemsByRole = (role: UserRole): NavSection[] => {
    const commonNavItems = getCommonNavItems(role);

    switch (role) {
        case "ADMIN":
            return [...commonNavItems, ...getAdminNavItems()];
        case "HOST":
            return [...commonNavItems, ...getHostNavItems()];
        case "USER":
            return [...commonNavItems, ...getUserNavItems()];
        default:
            return commonNavItems;
    }
};

