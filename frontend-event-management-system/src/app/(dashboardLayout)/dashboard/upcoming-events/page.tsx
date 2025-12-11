import { getMyUpcomingEvents } from "@/services/user/getMyUpcomingEvents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EventsFilters } from "@/components/modules/Events/EventsFilters";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";

interface UpcomingEventsPageProps {
    searchParams: Promise<{
        page?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }>;
}

async function UpcomingEventsContent({ searchParams }: UpcomingEventsPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const limit = 12;

    const eventsData = await getMyUpcomingEvents({
        page,
        limit,
        sortBy: params.sortBy || "date",
        sortOrder: params.sortOrder || "asc",
    });

    const totalPages = Math.ceil(eventsData.meta.total / limit);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
                <p className="text-muted-foreground">
                    Events you've joined that are coming up ({eventsData.meta.total} total)
                </p>
            </div>

            <EventsFilters showTypeFilter={false} showStatusFilter={false} />

            {eventsData.data.length === 0 ? (
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center py-12">
                            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                            <h3 className="text-lg font-semibold mb-2">No upcoming events</h3>
                            <p className="text-muted-foreground mb-4">
                                You don't have any upcoming events.
                            </p>
                            <Link
                                href="/"
                                className="text-primary hover:underline"
                            >
                                Browse events →
                            </Link>
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
                                        <Clock className="h-4 w-4 shrink-0" />
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
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="font-medium">Host:</span>
                                        <span className="truncate">{event.host.name}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <span className="font-medium">Joined:</span>
                                        <span>{new Date(event.joinedAt).toLocaleDateString()}</span>
                                    </div>
                                    <div className="pt-2 border-t">
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">
                                                {event._count.participants} participant{event._count.participants !== 1 ? "s" : ""}
                                            </span>
                                            {event.price > 0 && (
                                                <span className="font-semibold text-primary">
                                                    ${event.price.toFixed(2)}
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

function UpcomingEventsSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-9 w-64 mb-2" />
                <Skeleton className="h-5 w-80" />
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

const UpcomingEventsPage = async (props: UpcomingEventsPageProps) => {
    return (
        <Suspense fallback={<UpcomingEventsSkeleton />}>
            <UpcomingEventsContent {...props} />
        </Suspense>
    );
};

export default UpcomingEventsPage;

