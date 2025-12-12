import { getAllUsers } from "@/services/admin/getAllUsers";
import { Card, CardContent } from "@/components/ui/card";
import { User as UserIcon } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { UsersFilters } from "@/components/modules/Admin/UsersFilters";
import { UsersList } from "@/components/modules/Admin/UsersList";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";

interface UsersManagementPageProps {
    searchParams: Promise<{
        page?: string;
        role?: string;
        status?: string;
        searchTerm?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }>;
}

async function UsersManagementContent({ searchParams }: UsersManagementPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const limit = 12;

    const usersData = await getAllUsers({
        page,
        limit,
        role: params.role && params.role !== "all" ? params.role : undefined,
        status: params.status && params.status !== "all" ? params.status : undefined,
        searchTerm: params.searchTerm,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
    });

    const totalPages = Math.ceil(usersData.meta.total / limit);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Users Management</h1>
                <p className="text-muted-foreground">
                    Manage all platform users ({usersData.meta.total} total)
                </p>
            </div>

            <UsersFilters />

            <UsersList users={usersData.data} />

            {usersData.data.length > 0 && (
                <EventsPagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={usersData.meta.total}
                    itemsPerPage={limit}
                />
            )}
        </div>
    );
}

function UsersManagementSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <div className="flex gap-4">
                    <Skeleton className="h-10 w-[180px]" />
                    <Skeleton className="h-10 w-[180px]" />
                    <Skeleton className="h-10 w-[200px]" />
                </div>
            </div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-10 w-32 mt-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const UsersManagementPage = async (props: UsersManagementPageProps) => {
    return (
        <Suspense fallback={<UsersManagementSkeleton />}>
            <UsersManagementContent {...props} />
        </Suspense>
    );
};

export default UsersManagementPage;

