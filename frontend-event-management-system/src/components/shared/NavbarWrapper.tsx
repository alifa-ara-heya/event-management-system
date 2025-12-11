import { getUserInfo } from "@/services/auth/getUserInfo";
import { Navbar } from "./navbar";

export async function NavbarWrapper() {
    let userInfo = null;
    
    try {
        userInfo = await getUserInfo();
    } catch (error) {
        // User is not logged in, userInfo remains null
        console.log("User not authenticated");
    }
    
    return <Navbar userInfo={userInfo} />;
}
