import DashboardNavbar from "@/components/modules/Dashboard/DashboardNavbar";
import DashboardSidebar from "@/components/modules/Dashboard/DashboardSidebar";
import React, { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const dynamic = "force-dynamic";

function DashboardSidebarSkeleton() {
    return (
        <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 border-r bg-background">
            <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto p-4">
                    <Skeleton className="h-8 w-32 mb-6" />
                    <div className="space-y-2">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </div>
                <div className="p-4 border-t">
                    <Skeleton className="h-12 w-full rounded-md" />
                </div>
            </div>
        </aside>
    );
}

function DashboardNavbarSkeleton() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center justify-between px-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex items-center gap-4">
                    <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
        </header>
    );
}

const CommonDashboardLayout = async ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="flex h-screen overflow-hidden">
            <Suspense fallback={<DashboardSidebarSkeleton />}>
                <DashboardSidebar />
            </Suspense>
            <div className="flex flex-1 flex-col overflow-hidden">
                <Suspense fallback={<DashboardNavbarSkeleton />}>
                    <DashboardNavbar />
                </Suspense>
                <main className="flex-1 overflow-y-auto bg-muted/10 p-4 md:p-6">
                    <div className="">{children}</div>
                </main>
            </div>
        </div>
    );
};

export default CommonDashboardLayout;

