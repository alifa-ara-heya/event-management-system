import { getHostDashboardStats } from "@/services/dashboard/getHostDashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, History, Users, DollarSign, Star } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

async function HostDashboardContent() {
    const stats = await getHostDashboardStats();

    return (
        <div className="space-y-6">
            {/* Stats Cards Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalEvents}</div>
                        <p className="text-xs text-muted-foreground">All hosted events</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.upcomingEvents}</div>
                        <p className="text-xs text-muted-foreground">Scheduled events</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalParticipants}</div>
                        <p className="text-xs text-muted-foreground">All participants</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">${stats.overview.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Total earnings</p>
                    </CardContent>
                </Card>
            </div>

            {/* Additional Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Past Events</CardTitle>
                        <History className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.pastEvents}</div>
                        <p className="text-xs text-muted-foreground">Completed events</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {stats.overview.averageRating ? stats.overview.averageRating.toFixed(1) : "0.0"}
                        </div>
                        <p className="text-xs text-muted-foreground">From {stats.overview.totalReviews} reviews</p>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Events */}
            {stats.recentUpcomingEvents.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>Your upcoming hosted events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentUpcomingEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                                >
                                    {event.image && (
                                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={event.image}
                                                alt={event.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{event.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(event.date).toLocaleDateString()} • {event.location}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                            <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
                                            <span>${event.joiningFee} fee</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Past Events */}
            {stats.recentPastEvents.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Past Events</CardTitle>
                        <CardDescription>Your recently completed events</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentPastEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${event.id}`}
                                    className="flex items-center gap-4 p-4 rounded-lg border hover:bg-accent transition-colors"
                                >
                                    {event.image && (
                                        <div className="relative h-16 w-16 rounded-lg overflow-hidden flex-shrink-0">
                                            <Image
                                                src={event.image}
                                                alt={event.name}
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold truncate">{event.name}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            {new Date(event.date).toLocaleDateString()} • {event.location}
                                        </p>
                                        <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                            <span>{event.currentParticipants} participants</span>
                                            <span className="capitalize">{event.status.toLowerCase()}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

function DashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-4 w-24" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-16 mb-2" />
                            <Skeleton className="h-3 w-32" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const HostDashboardPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your hosted events and statistics
                </p>
            </div>

            <Suspense fallback={<DashboardSkeleton />}>
                <HostDashboardContent />
            </Suspense>
        </div>
    );
};

export default HostDashboardPage;

