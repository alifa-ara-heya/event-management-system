import { getAllHosts } from "@/services/admin/getAllHosts";
import { Card, CardContent } from "@/components/ui/card";
import { UserCog } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HostsFilters } from "@/components/modules/Admin/HostsFilters";
import { HostsList } from "@/components/modules/Admin/HostsList";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";

interface HostsManagementPageProps {
    searchParams: Promise<{
        page?: string;
        searchTerm?: string;
        location?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }>;
}

async function HostsManagementContent({ searchParams }: HostsManagementPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const limit = 12;

    const hostsData = await getAllHosts({
        page,
        limit,
        searchTerm: params.searchTerm,
        location: params.location,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
    });

    const totalPages = Math.ceil(hostsData.meta.total / limit);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Hosts Management</h1>
                <p className="text-muted-foreground">
                    Manage all platform hosts ({hostsData.meta.total} total)
                </p>
            </div>

            <HostsFilters />

            <HostsList hosts={hostsData.data} />

            {hostsData.data.length > 0 && (
                <EventsPagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={hostsData.meta.total}
                    itemsPerPage={limit}
                />
            )}
        </div>
    );
}

function HostsManagementSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
            </div>
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-[200px]" />
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

const HostsManagementPage = async (props: HostsManagementPageProps) => {
    return (
        <Suspense fallback={<HostsManagementSkeleton />}>
            <HostsManagementContent {...props} />
        </Suspense>
    );
};

export default HostsManagementPage;

