import { getAdminEvents } from "@/services/admin/getAdminEvents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";
import { AdminEventsFilters } from "@/components/modules/Admin/AdminEventsFilters";
import { AdminEventCard } from "@/components/modules/Admin/AdminEventCard";

interface AdminEventsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        type?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        searchTerm?: string;
    }>;
}

async function AdminEventsContent({ searchParams }: AdminEventsPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const limit = 12;

    const eventsData = await getAdminEvents({
        page,
        limit,
        status: params.status && params.status !== "all" ? params.status : undefined,
        type: params.type && params.type !== "all" ? params.type : undefined,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
        searchTerm: params.searchTerm,
    });

    const totalPages = Math.ceil(eventsData.meta.total / limit);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">All Events</h1>
                    <p className="text-muted-foreground">
                        Manage all events on the platform ({eventsData.meta.total} total)
                    </p>
                </div>
            </div>

            <AdminEventsFilters />

            {eventsData.data.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No events found</h3>
                            <p className="text-muted-foreground">
                                {params.searchTerm || params.status !== "all" || params.type !== "all"
                                    ? "Try adjusting your filters"
                                    : "No events have been created yet."}
                            </p>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {eventsData.data.map((event) => (
                        <AdminEventCard key={event.id} event={event} />
                    ))}
                </div>
            )}

            {eventsData.data.length > 0 && (
                <EventsPagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={eventsData.meta.total}
                    itemsPerPage={limit}
                />
            )}
        </div>
    );
}

function AdminEventsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                    <Card key={i}>
                        <Skeleton className="h-48 w-full rounded-t-lg" />
                        <CardHeader>
                            <Skeleton className="h-6 w-full mb-2" />
                            <Skeleton className="h-4 w-3/4" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-2/3" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const AdminEventsPage = async (props: AdminEventsPageProps) => {
    return (
        <Suspense fallback={<AdminEventsSkeleton />}>
            <AdminEventsContent {...props} />
        </Suspense>
    );
};

export default AdminEventsPage;
