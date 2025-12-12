"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import Image from "next/image"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ModeToggle } from "@/components/shared/modeToggle"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getDefaultDashboardRoute } from "@/lib/auth-utils"
import { UserInfo } from "@/services/auth/getUserInfo"
import { LogoutButton } from "./LogoutButton"

interface NavbarProps {
    userInfo?: UserInfo | null;
}

export function Navbar({ userInfo }: NavbarProps) {
    const pathname = usePathname()
    const dashboardRoute = userInfo?.role ? getDefaultDashboardRoute(userInfo.role) : "/dashboard"

    // Only show "Become a Host" if user is not already a host or admin
    // Show it for regular users and non-logged-in users
    const navLinks = [
        { href: "/events", label: "Explore Events" },
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/faq", label: "FAQ" },
        ...(userInfo?.role !== "HOST" && userInfo?.role !== "ADMIN"
            ? [{ href: "/become-a-host", label: "Become a Host" }]
            : []),
    ]

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
            <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-2">
                    <Link href="/" className="flex items-center gap-2 font-semibold text-foreground">
                        <div className="relative h-9 w-9 flex items-center justify-center">
                            <Image
                                src="/assets/icons/event-icon.png"
                                alt="EventMate Logo"
                                width={36}
                                height={36}
                                className="object-contain"
                                priority
                            />
                        </div>
                        <span className="text-base">EventMate</span>
                    </Link>
                </div>

                <nav className="hidden items-center gap-6 md:flex">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className={cn(
                                "text-sm font-medium transition-colors",
                                pathname === link.href
                                    ? "text-foreground"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {link.label}
                        </Link>
                    ))}
                </nav>

                <div className="hidden items-center gap-3 md:flex">
                    <ModeToggle />
                    {userInfo ? (
                        <>
                            <Button variant="outline" asChild>
                                <Link href={dashboardRoute}>Go to Dashboard</Link>
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                                        {userInfo.profilePhoto ? (
                                            <Avatar className="h-10 w-10">
                                                <AvatarImage src={userInfo.profilePhoto} alt={userInfo.name || "User"} />
                                                <AvatarFallback>
                                                    {userInfo.name?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        ) : (
                                            <Avatar className="h-10 w-10">
                                                <AvatarFallback>
                                                    {userInfo.name?.charAt(0).toUpperCase() || "U"}
                                                </AvatarFallback>
                                            </Avatar>
                                        )}
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
                                        <Link href={dashboardRoute}>Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <LogoutButton />
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </>
                    ) : (
                        <>
                            <Button variant="ghost" asChild>
                                <Link href="/login">Login</Link>
                            </Button>
                            <Button asChild>
                                <Link href="/register">Register</Link>
                            </Button>
                        </>
                    )}
                </div>

                <div className="flex items-center gap-2 md:hidden">
                    <ModeToggle />
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" aria-label="Open menu">
                                <Menu className="size-5" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>Navigate</DropdownMenuLabel>
                            {navLinks.map((link) => (
                                <DropdownMenuItem key={link.href} asChild>
                                    <Link href={link.href}>{link.label}</Link>
                                </DropdownMenuItem>
                            ))}
                            <DropdownMenuSeparator />
                            {userInfo ? (
                                <>
                                    <DropdownMenuLabel className="font-normal">
                                        <div className="flex items-center gap-2">
                                            {userInfo.profilePhoto ? (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarImage src={userInfo.profilePhoto} alt={userInfo.name || "User"} />
                                                    <AvatarFallback>
                                                        {userInfo.name?.charAt(0).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            ) : (
                                                <Avatar className="h-8 w-8">
                                                    <AvatarFallback>
                                                        {userInfo.name?.charAt(0).toUpperCase() || "U"}
                                                    </AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className="flex flex-col">
                                                <p className="text-sm font-medium leading-none">{userInfo.name || "User"}</p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {userInfo.email}
                                                </p>
                                            </div>
                                        </div>
                                    </DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem asChild>
                                        <Link href={dashboardRoute} className="font-medium">Go to Dashboard</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/my-profile">Profile</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <LogoutButton />
                                </>
                            ) : (
                                <>
                                    <DropdownMenuItem asChild>
                                        <Link href="/login">Login</Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link href="/register">Register</Link>
                                    </DropdownMenuItem>
                                </>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    )
}
