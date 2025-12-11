import { getUserDashboardStats } from "@/services/dashboard/getUserDashboardStats";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Clock, History, Star, CalendarDays } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";

async function UserDashboardContent() {
    const stats = await getUserDashboardStats();

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
                        <div className="text-2xl font-bold">{stats.overview.totalJoinedEvents}</div>
                        <p className="text-xs text-muted-foreground">All joined events</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Upcoming Events</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.upcomingEvents}</div>
                        <p className="text-xs text-muted-foreground">Events coming soon</p>
                    </CardContent>
                </Card>
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
                        <CardTitle className="text-sm font-medium">Reviews</CardTitle>
                        <Star className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.overview.totalReviews}</div>
                        <p className="text-xs text-muted-foreground">Total reviews written</p>
                    </CardContent>
                </Card>
            </div>

            {/* Upcoming Events */}
            {stats.upcomingEvents.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Upcoming Events</CardTitle>
                        <CardDescription>Your upcoming event participations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.upcomingEvents.map((event) => (
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
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Host: {event.host.name}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Recent Joined Events */}
            {stats.recentJoinedEvents.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recently Joined Events</CardTitle>
                        <CardDescription>Your latest event participations</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {stats.recentJoinedEvents.map((event) => (
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
                                        <p className="text-xs text-muted-foreground mt-1">
                                            Joined: {new Date(event.joinedAt).toLocaleDateString()}
                                        </p>
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

const UserDashboardPage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-muted-foreground">
                    Overview of your event participations and activities
                </p>
            </div>

            <Suspense fallback={<DashboardSkeleton />}>
                <UserDashboardContent />
            </Suspense>
        </div>
    );
};

export default UserDashboardPage;

