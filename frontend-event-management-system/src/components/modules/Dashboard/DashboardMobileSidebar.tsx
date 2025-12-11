"use client";

import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/icon-mapper";
import { cn } from "@/lib/utils";
import { NavSection } from "@/lib/navItems.config";
import { UserInfo } from "@/services/auth/getUserInfo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

interface DashboardMobileSidebarProps {
    userInfo: UserInfo;
    navItems: NavSection[];
    dashboardHome: string;
}

const DashboardMobileSidebar = ({
    userInfo,
    navItems,
    dashboardHome,
}: DashboardMobileSidebarProps) => {
    const pathname = usePathname();

    return (
        <div className="flex h-full w-full flex-col border-r bg-card">
            {/* Logo/Brand */}
            <div className="flex h-16 items-center border-b px-6">
                <Link href={dashboardHome} className="flex items-center space-x-2">
                    <span className="text-xl font-bold text-primary">EventHub</span>
                </Link>
            </div>

            {/* Navigation */}
            <div className="flex-1 overflow-y-auto px-3 py-4">
                <nav className="space-y-6">
                    {navItems.map((section, sectionIdx) => (
                        <div key={sectionIdx}>
                            {section.title && (
                                <h4 className="mb-2 px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                                    {section.title}
                                </h4>
                            )}
                            <div className="space-y-1">
                                {section.items.map((item) => {
                                    const isActive = pathname === item.href;
                                    const Icon = getIconComponent(item.icon);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={cn(
                                                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all",
                                                isActive
                                                    ? "bg-primary text-primary-foreground"
                                                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                            )}
                                        >
                                            <Icon className="h-4 w-4" />
                                            <span className="flex-1">{item.title}</span>
                                            {item.badge && (
                                                <Badge
                                                    variant={isActive ? "secondary" : "default"}
                                                    className="ml-auto"
                                                >
                                                    {item.badge}
                                                </Badge>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                            {sectionIdx < navItems.length - 1 && (
                                <Separator className="my-4" />
                            )}
                        </div>
                    ))}
                </nav>
            </div>

            {/* User Info at Bottom */}
            <div className="border-t p-4">
                <div className="flex items-center gap-3">
                    {userInfo.profilePhoto ? (
                        <div className="relative h-8 w-8 rounded-full overflow-hidden">
                            <Image
                                src={userInfo.profilePhoto}
                                alt={userInfo.name || "User"}
                                fill
                                className="object-cover"
                            />
                        </div>
                    ) : (
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <span className="text-sm font-semibold text-primary">
                                {userInfo.name?.charAt(0).toUpperCase() || "U"}
                            </span>
                        </div>
                    )}
                    <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-medium truncate">{userInfo.name || "User"}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                            {userInfo.role.toLowerCase()}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardMobileSidebar;

