"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UserInfo } from "@/services/auth/getUserInfo";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import DashboardMobileSidebar from "./DashboardMobileSidebar";
import { getNavItemsByRole } from "@/lib/navItems.config";
import { getDefaultDashboardRoute } from "@/lib/auth-utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import Image from "next/image";
import { LogoutButton } from "@/components/shared/LogoutButton";
import { ModeToggle } from "@/components/shared/modeToggle";

interface DashboardNavbarContentProps {
    userInfo: UserInfo;
}

const DashboardNavbarContent = ({ userInfo }: DashboardNavbarContentProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkSmallerScreen = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkSmallerScreen();
        window.addEventListener("resize", checkSmallerScreen);

        return () => {
            window.removeEventListener("resize", checkSmallerScreen);
        };
    }, []);

    const navItems = getNavItemsByRole(userInfo.role);
    const dashboardHome = getDefaultDashboardRoute(userInfo.role);

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur">
            <div className="flex h-16 items-center justify-between gap-4 px-4 md:px-6">
                {/* Mobile Menu Toggle */}
                <Sheet open={isMobile && isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="outline" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                        <DashboardMobileSidebar
                            userInfo={userInfo}
                            navItems={navItems}
                            dashboardHome={dashboardHome}
                        />
                    </SheetContent>
                </Sheet>

                {/* Right Side Actions */}
                <div className="flex items-center gap-2 ml-auto">
                    {/* Theme Toggle */}
                    <ModeToggle />

                    {/* User Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage
                                        src={userInfo.profilePhoto || ""}
                                        alt={userInfo.name || "User"}
                                        className="object-cover"
                                    />
                                    <AvatarFallback className="bg-primary/10 text-primary">
                                        {userInfo.name?.charAt(0).toUpperCase() || "U"}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{userInfo.name || "User"}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {userInfo.email}
                                    </p>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/my-profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href={dashboardHome}>Dashboard</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <LogoutButton />
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbarContent;

