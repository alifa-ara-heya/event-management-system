import { getHostEvents } from "@/services/event/getHostEvents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Plus } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EventsFilters } from "@/components/modules/Events/EventsFilters";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";

interface HostMyEventsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        searchTerm?: string;
    }>;
}

async function HostMyEventsContent({ searchParams }: HostMyEventsPageProps) {
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
                    <h1 className="text-3xl font-bold tracking-tight">My Events</h1>
                    <p className="text-muted-foreground">
                        All events you have created ({eventsData.meta.total} total)
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
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {eventsData.data.map((event) => (
                        <Link
                            key={event.id}
                            href={`/events/${event.id}`}
                            className="group"
                        >
                            <Card className="h-full transition-all hover:shadow-md">
                                {event.image && (
                                    <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                        <Image
                                            src={event.image}
                                            alt={event.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader>
                                    <div className="flex items-start justify-between gap-2">
                                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                            {event.name}
                                        </CardTitle>
                                        <Badge variant="outline" className="shrink-0 capitalize">
                                            {event.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                    <CardDescription className="line-clamp-2">
                                        {event.description || "No description available"}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        <span>{new Date(event.date).toLocaleDateString("en-US", {
                                            weekday: "short",
                                            year: "numeric",
                                            month: "short",
                                            day: "numeric",
                                        })}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="font-medium">Location:</span>
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                {event.currentParticipants}/{event.maxParticipants} participants
                                            </span>
                                            {event.joiningFee > 0 && (
                                                <span className="font-semibold text-primary">
                                                    ${event.joiningFee.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
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

function HostMyEventsSkeleton() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
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

const HostMyEventsPage = async (props: HostMyEventsPageProps) => {
    return (
        <Suspense fallback={<HostMyEventsSkeleton />}>
            <HostMyEventsContent {...props} />
        </Suspense>
    );
};

export default HostMyEventsPage;

