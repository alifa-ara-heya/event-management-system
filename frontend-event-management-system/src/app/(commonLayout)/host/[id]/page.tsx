import { getHostById } from "@/services/host/getHostById";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Star, MapPin, Calendar, Users, DollarSign, Mail, Phone, CalendarDays } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { HostReviews } from "@/components/modules/Host/HostReviews";
import { notFound } from "next/navigation";
import Image from "next/image";

interface HostProfilePageProps {
    params: Promise<{
        id: string;
    }>;
}

async function HostProfileContent({ params }: HostProfilePageProps) {
    const { id } = await params;

    let host;
    try {
        host = await getHostById(id);
    } catch (error: any) {
        console.error("Error fetching host:", error);
        notFound();
    }

    const upcomingEvents = host.hostedEvents.filter(
        (event) => new Date(event.date) > new Date() && event.status !== "CANCELLED" && event.status !== "COMPLETED"
    );
    const pastEvents = host.hostedEvents.filter(
        (event) => new Date(event.date) <= new Date() || event.status === "COMPLETED"
    );

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
            <div className="space-y-6 lg:space-y-8">
                {/* Host Header */}
                <Card>
                    <CardContent className="p-6 sm:p-8">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 sm:gap-8">
                            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 shrink-0">
                                <AvatarImage src={host.profilePhoto || ""} alt={host.name} sizes="128px" />
                                <AvatarFallback className="text-2xl sm:text-3xl">
                                    {host.name.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0 space-y-3">
                                <div className="flex flex-wrap items-center gap-3">
                                    <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{host.name}</h1>
                                    {host.averageRating > 0 && (
                                        <Badge variant="outline" className="text-base px-3 py-1 border-primary/50">
                                            <Star className="h-4 w-4 fill-primary text-primary mr-1" />
                                            <span className="text-primary">{host.averageRating.toFixed(1)}</span> ({host._count.reviews} {host._count.reviews === 1 ? "review" : "reviews"})
                                        </Badge>
                                    )}
                                </div>
                                {host.bio && (
                                    <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                                        {host.bio}
                                    </p>
                                )}
                                <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm sm:text-base">
                                    {host.location && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <MapPin className="h-4 w-4 shrink-0" />
                                            <span>{host.location}</span>
                                        </div>
                                    )}
                                    {host.contactNumber && (
                                        <div className="flex items-center gap-2 text-muted-foreground">
                                            <Phone className="h-4 w-4 shrink-0" />
                                            <span>{host.contactNumber}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <CalendarDays className="h-4 w-4 shrink-0" />
                                        <span>{host._count.hostedEvents} {host._count.hostedEvents === 1 ? "event" : "events"} hosted</span>
                                    </div>
                                </div>
                                {host.interests && host.interests.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {host.interests.map((interest, index) => (
                                            <Badge key={index} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
                                                {interest}
                                            </Badge>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Upcoming Events */}
                        {upcomingEvents.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Upcoming Events</CardTitle>
                                    <CardDescription>
                                        {upcomingEvents.length} {upcomingEvents.length === 1 ? "event" : "events"} coming up
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {upcomingEvents.map((event) => (
                                            <Link
                                                key={event.id}
                                                href={`/events/${event.id}`}
                                                className="block p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {event.image && (
                                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden border">
                                                            <Image
                                                                src={event.image}
                                                                alt={event.name}
                                                                fill
                                                                sizes="(max-width: 640px) 96px, 128px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold truncate mb-1 text-primary">{event.name}</h3>
                                                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span className="truncate">{event.location}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <Users className="h-4 w-4" />
                                                                    <span>{event.currentParticipants}/{event.maxParticipants}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="capitalize shrink-0 border-primary/50 text-primary">
                                                            {event.status.toLowerCase()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Past Events */}
                        {pastEvents.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Past Events</CardTitle>
                                    <CardDescription>
                                        {pastEvents.length} {pastEvents.length === 1 ? "event" : "events"} completed
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {pastEvents.map((event) => (
                                            <Link
                                                key={event.id}
                                                href={`/events/${event.id}`}
                                                className="block p-4 rounded-lg border hover:border-primary/50 hover:bg-primary/5 transition-colors"
                                            >
                                                <div className="flex items-start gap-4">
                                                    {event.image && (
                                                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 rounded-lg overflow-hidden border">
                                                            <Image
                                                                src={event.image}
                                                                alt={event.name}
                                                                fill
                                                                sizes="(max-width: 640px) 96px, 128px"
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="flex-1 min-w-0 flex items-start justify-between gap-4">
                                                        <div className="flex-1 min-w-0">
                                                            <h3 className="font-semibold truncate mb-1 text-primary">{event.name}</h3>
                                                            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                                                                <div className="flex items-center gap-1">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                                                </div>
                                                                <div className="flex items-center gap-1">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span className="truncate">{event.location}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <Badge variant="outline" className="capitalize shrink-0 border-primary/50 text-primary">
                                                            {event.status.toLowerCase()}
                                                        </Badge>
                                                    </div>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reviews */}
                        <HostReviews hostId={host.id} />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Host Statistics</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Total Events</p>
                                        <p className="text-2xl font-bold">{host._count.hostedEvents}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Total Reviews</p>
                                        <p className="text-2xl font-bold">{host._count.reviews}</p>
                                    </div>
                                    {host.averageRating > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Average Rating</p>
                                                <div className="flex items-center gap-2">
                                                    <p className="text-2xl font-bold text-primary">{host.averageRating.toFixed(1)}</p>
                                                    <div className="flex items-center gap-1">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <Star
                                                                key={star}
                                                                className={`h-4 w-4 ${
                                                                    star <= Math.round(host.averageRating)
                                                                        ? "fill-primary text-primary"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Member Since</p>
                                        <p className="text-base">{new Date(host.createdAt).toLocaleDateString()}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function HostProfileSkeleton() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
            <div className="space-y-6">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-start gap-6">
                            <Skeleton className="h-32 w-32 rounded-full" />
                            <div className="flex-1 space-y-3">
                                <Skeleton className="h-8 w-48" />
                                <Skeleton className="h-4 w-96" />
                                <Skeleton className="h-4 w-64" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-32 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                    <div className="lg:col-span-1">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent>
                                <Skeleton className="h-32 w-full" />
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}

const HostProfilePage = async (props: HostProfilePageProps) => {
    return (
        <Suspense fallback={<HostProfileSkeleton />}>
            <HostProfileContent {...props} />
        </Suspense>
    );
};

export default HostProfilePage;

