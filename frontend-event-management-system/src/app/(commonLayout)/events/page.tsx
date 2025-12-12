import { getAllEvents } from "@/services/event/getAllEvents";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Search } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExploreEventsFilters } from "@/components/modules/Events/ExploreEventsFilters";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";
import { MapPin, Users, DollarSign } from "lucide-react";

interface ExploreEventsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        type?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
        searchTerm?: string;
        includePast?: string;
    }>;
}

async function ExploreEventsContent({ searchParams }: ExploreEventsPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const limit = 12;

    const eventsData = await getAllEvents({
        page,
        limit,
        status: params.status && params.status !== "all" ? params.status : undefined,
        type: params.type && params.type !== "all" ? params.type : undefined,
        sortBy: params.sortBy || "date",
        sortOrder: params.sortOrder || "desc",
        searchTerm: params.searchTerm,
        includePast: params.includePast === "true", // Show all events including past ones if explicitly requested
    });

    const totalPages = Math.ceil(eventsData.meta.total / limit);

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
            <div className="space-y-6">
                <div>
                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Explore Events</h1>
                    <p className="text-muted-foreground mt-2">
                        Discover amazing events happening around you ({eventsData.meta.total} events found)
                    </p>
                </div>

                <ExploreEventsFilters />

                {eventsData.data.length === 0 ? (
                    <Card>
                        <CardContent className="pt-6">
                            <div className="text-center py-12">
                                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                <h3 className="text-lg font-semibold mb-2">No events found</h3>
                                <p className="text-muted-foreground">
                                    Try adjusting your search or filters to find more events.
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {eventsData.data.map((event) => (
                            <Card key={event.id} className="group relative overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
                                {event.image && (
                                    <div className="relative h-48 w-full overflow-hidden">
                                        <Image
                                            src={event.image}
                                            alt={event.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                )}
                                <CardHeader className="flex-1">
                                    <div className="flex items-start justify-between gap-2 mb-2">
                                        <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors flex-1">
                                            {event.name}
                                        </CardTitle>
                                        <Badge variant="outline" className="capitalize shrink-0">
                                            {event.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-2 flex-wrap mb-2">
                                        <Badge variant="secondary" className="capitalize">
                                            {event.type.toLowerCase().replace("_", " ")}
                                        </Badge>
                                    </div>
                                    {event.description && (
                                        <CardDescription className="line-clamp-2">
                                            {event.description}
                                        </CardDescription>
                                    )}
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <Calendar className="h-4 w-4 shrink-0" />
                                        <span className="truncate">
                                            {new Date(event.date).toLocaleDateString("en-US", {
                                                weekday: "short",
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4 shrink-0" />
                                        <span className="truncate">{event.location}</span>
                                    </div>
                                    <div className="pt-2 border-t space-y-3">
                                        <div className="flex items-center justify-between text-sm">
                                            <div className="flex items-center gap-1 text-muted-foreground">
                                                <Users className="h-4 w-4" />
                                                <span>
                                                    {event.currentParticipants}/{event.maxParticipants} participants
                                                </span>
                                            </div>
                                            {event.joiningFee > 0 && (
                                                <span className="font-semibold text-primary">
                                                    ${event.joiningFee.toFixed(2)}
                                                </span>
                                            )}
                                        </div>
                                        <Button asChild className="w-full" variant="default">
                                            <Link href={`/events/${event.id}`}>
                                                View Details
                                            </Link>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
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
        </div>
    );
}

function ExploreEventsSkeleton() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
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
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}

const ExploreEventsPage = async (props: ExploreEventsPageProps) => {
    return (
        <Suspense fallback={<ExploreEventsSkeleton />}>
            <ExploreEventsContent {...props} />
        </Suspense>
    );
};

export default ExploreEventsPage;

