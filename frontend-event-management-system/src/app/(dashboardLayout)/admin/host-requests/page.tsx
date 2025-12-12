import { getAllHostRequests } from "@/services/admin/getAllHostRequests";
import { Card, CardContent } from "@/components/ui/card";
import { UserCheck } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { HostRequestsFilters } from "@/components/modules/Admin/HostRequestsFilters";
import { HostRequestsList } from "@/components/modules/Admin/HostRequestsList";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";

interface HostRequestsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        searchTerm?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }>;
}

async function HostRequestsContent({ searchParams }: HostRequestsPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const limit = 12;

    const requestsData = await getAllHostRequests({
        page,
        limit,
        status: params.status && params.status !== "all" ? params.status : undefined,
        searchTerm: params.searchTerm,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
    });

    const totalPages = Math.ceil(requestsData.meta.total / limit);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Host Requests</h1>
                <p className="text-muted-foreground">
                    Review and manage host requests ({requestsData.meta.total} total)
                </p>
            </div>

            <HostRequestsFilters />

            <HostRequestsList requests={requestsData.data} />

            {requestsData.data.length > 0 && (
                <EventsPagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={requestsData.meta.total}
                    itemsPerPage={limit}
                />
            )}
        </div>
    );
}

function HostRequestsSkeleton() {
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

const HostRequestsPage = async (props: HostRequestsPageProps) => {
    return (
        <Suspense fallback={<HostRequestsSkeleton />}>
            <HostRequestsContent {...props} />
        </Suspense>
    );
};

export default HostRequestsPage;

