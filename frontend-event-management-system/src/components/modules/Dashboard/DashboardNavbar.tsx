import { getUserInfo } from "@/services/auth/getUserInfo";
import DashboardNavbarContent from "./DashboardNavbarContent";

const DashboardNavbar = async () => {
    // getUserInfo will redirect to login if no token, so we don't need try-catch
    const userInfo = await getUserInfo();

    return <DashboardNavbarContent userInfo={userInfo} />;
};

export default DashboardNavbar;

