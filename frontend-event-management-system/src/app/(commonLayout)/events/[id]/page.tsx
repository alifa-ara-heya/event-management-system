import { getEventById } from "@/services/event/getEventById";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, MapPin, Users, DollarSign, Clock, User, Star } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { JoinEventButton } from "@/components/modules/Events/JoinEventButton";
import { ReviewFormWrapper } from "@/components/modules/Events/ReviewFormWrapper";
import { EventReviews } from "@/components/modules/Events/EventReviews";
import { notFound } from "next/navigation";
import { getUserInfo } from "@/services/auth/getUserInfo";
import Link from "next/link";

interface EventDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

async function EventDetailContent({ params }: EventDetailPageProps) {
    const { id } = await params;

    let event;
    let currentUser = null;
    
    try {
        event = await getEventById(id);
        // Try to get current user info (won't throw if not logged in)
        try {
            currentUser = await getUserInfo();
        } catch (error) {
            // User is not logged in, that's okay
            currentUser = null;
        }
    } catch (error: any) {
        console.error("Error fetching event:", error);
        notFound();
    }

    const isUpcoming = new Date(event.date) > new Date();
    const spotsLeft = event.maxParticipants - event.currentParticipants;
    const isFull = event.currentParticipants >= event.maxParticipants;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
            <div className="space-y-6 lg:space-y-8">
                {/* Event Header */}
                <div className="space-y-4 lg:space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1 space-y-3">
                            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                                <Badge variant="outline" className="capitalize">
                                    {event.status.toLowerCase()}
                                </Badge>
                                <Badge variant="secondary" className="capitalize">
                                    {event.type.toLowerCase().replace("_", " ")}
                                </Badge>
                            </div>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">{event.name}</h1>
                            {event.description && (
                                <p className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-3xl">
                                    {event.description}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Event Image */}
                    {event.image && (
                        <div className="relative w-full aspect-video sm:aspect-[21/9] rounded-xl overflow-hidden border shadow-lg">
                            <Image
                                src={event.image}
                                alt={event.name}
                                fill
                                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 90vw, 1200px"
                                className="object-cover"
                                priority
                                quality={75}
                            />
                        </div>
                    )}
                </div>

                <div className="grid gap-6 lg:gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Event Details */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                        <Calendar className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-base mb-1">Date & Time</p>
                                        <p className="text-sm sm:text-base text-muted-foreground">
                                            {new Date(event.date).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                                hour: "numeric",
                                                minute: "2-digit",
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                        <MapPin className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-base mb-1">Location</p>
                                        <p className="text-sm sm:text-base text-muted-foreground break-words">{event.location}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 sm:gap-4">
                                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                        <Users className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold text-base mb-1">Participants</p>
                                        <p className="text-sm sm:text-base text-muted-foreground">
                                            {event.currentParticipants} / {event.maxParticipants} participants
                                            {isUpcoming && !isFull && (
                                                <span className="ml-2 text-primary font-medium">
                                                    ({spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left)
                                                </span>
                                            )}
                                        </p>
                                    </div>
                                </div>

                                {event.joiningFee > 0 && (
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                                            <DollarSign className="h-5 w-5 text-primary" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-base mb-1">Joining Fee</p>
                                            <p className="text-lg sm:text-xl font-semibold text-primary">
                                                ${event.joiningFee.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Host Information */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Host Information</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Link href={`/host/${event.host.id}`} className="block">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:opacity-80 transition-opacity">
                                        <Avatar className="h-20 w-20 sm:h-24 sm:w-24 shrink-0">
                                            <AvatarImage src={event.host.profilePhoto || ""} alt={event.host.name} sizes="96px" />
                                            <AvatarFallback className="text-lg sm:text-xl">
                                                {event.host.name.charAt(0).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1 min-w-0 space-y-2">
                                            <h3 className="font-semibold text-lg sm:text-xl hover:text-primary transition-colors">
                                                {event.host.name}
                                            </h3>
                                            {event.host.bio && (
                                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">{event.host.bio}</p>
                                            )}
                                            {event.host.location && (
                                                <p className="text-sm text-muted-foreground flex items-center gap-1">
                                                    <MapPin className="h-4 w-4 shrink-0" />
                                                    <span className="break-words">{event.host.location}</span>
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-sm">
                                                {event.host.averageRating && (
                                                    <div className="flex items-center gap-1.5">
                                                        <Star className="h-4 w-4 fill-primary text-primary shrink-0" />
                                                        <span className="font-semibold">{event.host.averageRating.toFixed(1)}</span>
                                                        <span className="text-muted-foreground">
                                                            ({event.host._count.reviews} review{event.host._count.reviews !== 1 ? "s" : ""})
                                                        </span>
                                                    </div>
                                                )}
                                                <span className="text-muted-foreground">
                                                    {event.host._count.hostedEvents} event{event.host._count.hostedEvents !== 1 ? "s" : ""} hosted
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>

                        {/* Participants */}
                        {event.participants.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>Participants</CardTitle>
                                    <CardDescription>
                                        {event._count.participants} participant{event._count.participants !== 1 ? "s" : ""} joined
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid gap-4 sm:grid-cols-2">
                                        {event.participants.map((participant) => (
                                            <div key={participant.id} className="flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors">
                                                <Avatar className="h-10 w-10 shrink-0">
                                                    <AvatarImage
                                                        src={participant.user.profilePhoto || ""}
                                                        alt={participant.user.name || participant.user.email}
                                                        sizes="40px"
                                                    />
                                                    <AvatarFallback>
                                                        {participant.user.name?.charAt(0).toUpperCase() || participant.user.email.charAt(0).toUpperCase()}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate text-sm sm:text-base">
                                                        {participant.user.name || participant.user.email}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        Joined {new Date(participant.joinedAt).toLocaleDateString()}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Review Form - Only shown for past events where user participated */}
                        <ReviewFormWrapper
                            eventId={event.id}
                            eventDate={event.date}
                            participants={event.participants}
                        />

                        {/* Event Reviews */}
                        <EventReviews
                            eventId={event.id}
                            currentUserEmail={currentUser?.email || null}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Event Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Status</p>
                                        <Badge variant="outline" className="capitalize">
                                            {event.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Type</p>
                                        <p className="capitalize text-base">{event.type.toLowerCase().replace("_", " ")}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-muted-foreground mb-2">Capacity</p>
                                        <p className="text-base">{event.maxParticipants} participants</p>
                                    </div>
                                    {event.joiningFee > 0 && (
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground mb-2">Fee</p>
                                            <p className="text-xl font-bold text-primary">${event.joiningFee.toFixed(2)}</p>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Join Event Button */}
                            <JoinEventButton
                                eventId={event.id}
                                isUpcoming={isUpcoming}
                                isFull={isFull}
                                status={event.status}
                                joiningFee={event.joiningFee}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function EventDetailSkeleton() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 max-w-7xl">
            <div className="space-y-6 lg:space-y-8">
                <div className="space-y-4">
                    <Skeleton className="h-10 w-3/4" />
                    <Skeleton className="h-6 w-1/2" />
                    <Skeleton className="w-full aspect-video sm:aspect-[21/9] rounded-xl" />
                </div>
                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <Skeleton className="h-6 w-32" />
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
                                <Skeleton className="h-20 w-full" />
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

const EventDetailPage = async (props: EventDetailPageProps) => {
    return (
        <Suspense fallback={<EventDetailSkeleton />}>
            <EventDetailContent {...props} />
        </Suspense>
    );
};

export default EventDetailPage;

