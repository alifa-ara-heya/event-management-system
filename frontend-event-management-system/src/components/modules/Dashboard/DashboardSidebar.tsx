import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getUserInfo, UserInfo } from "@/services/auth/getUserInfo";
import { NavSection } from "@/lib/navItems.config";
import DashboardSidebarContent from "./DashboardSidebarContent";

const DashboardSidebar = async () => {
    const userInfo = await getUserInfo();

    const navItems: NavSection[] = getNavItemsByRole(userInfo.role);
    const dashboardHome = getDefaultDashboardRoute(userInfo.role);

    return (
        <DashboardSidebarContent
            userInfo={userInfo}
            navItems={navItems}
            dashboardHome={dashboardHome}
        />
    );
};

export default DashboardSidebar;

