import { getHostEvents } from "@/services/event/getHostEvents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus, Settings } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventsFilters } from "@/components/modules/Events/EventsFilters";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";
import ManageEventsClient from "@/components/modules/Events/ManageEventsClient";
import { HostEvent } from "@/services/event/getHostEvents";

interface ManageEventsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        searchTerm?: string;
    }>;
}

async function ManageEventsContent({ searchParams }: ManageEventsPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const limit = 12;

    const eventsData = await getHostEvents({
        page,
        limit,
        status: params.status && params.status !== "all" ? params.status : undefined,
        sortBy: params.sortBy || "date",
        sortOrder: params.sortOrder || "desc",
        searchTerm: params.searchTerm,
    });

    const totalPages = Math.ceil(eventsData.meta.total / limit);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Manage Events</h1>
                    <p className="text-muted-foreground">
                        Update, change status, or delete your events ({eventsData.meta.total} total)
                    </p>
                </div>
                <Button asChild>
                    <Link href="/host/create-event">
                        <Plus className="mr-2 h-4 w-4" />
                        Create Event
                    </Link>
                </Button>
            </div>

            <EventsFilters showTypeFilter={false} />

            {eventsData.data.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No events yet</h3>
                            <p className="text-muted-foreground mb-4">
                                You haven't created any events yet.
                            </p>
                            <Button asChild>
                                <Link href="/host/create-event">
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Your First Event
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <ManageEventsClient events={eventsData.data} />
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

function ManageEventsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>
            <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="pt-6">
                            <Skeleton className="h-20 w-full" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const ManageEventsPage = async (props: ManageEventsPageProps) => {
    return (
        <Suspense fallback={<ManageEventsSkeleton />}>
            <ManageEventsContent {...props} />
        </Suspense>
    );
};

export default ManageEventsPage;

