import { Star, MapPin, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllEvents, PublicEvent } from '@/services/event/getAllEvents';
import Image from 'next/image';
import Link from 'next/link';
import { Badge } from '@/components/ui/badge';

const EventCard = ({ event, priority = false }: { event: PublicEvent; priority?: boolean }) => {
  const participantPercentage = (event.currentParticipants / event.maxParticipants) * 100;
  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col group">
      <CardHeader className="bg-muted/50 items-center p-0 relative h-48 overflow-hidden">
        {event.image ? (
          <div className="absolute inset-0 w-full h-full">
            <Image
              src={event.image}
              alt={event.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform group-hover:scale-105"
              priority={priority}
              quality={85}
            />
          </div>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <div className="text-4xl text-primary/30">
              {event.type === 'HIKE' && '🏔️'}
              {event.type === 'CONCERT' && '🎵'}
              {event.type === 'GAMING' && '🎲'}
              {event.type === 'DINNER' && '🍽️'}
              {event.type === 'SPORTS' && '⚽'}
              {event.type === 'ART' && '🎨'}
              {event.type === 'TECH_MEETUP' && '💻'}
              {!['HIKE', 'CONCERT', 'GAMING', 'DINNER', 'SPORTS', 'ART', 'TECH_MEETUP'].includes(event.type) && '📅'}
            </div>
          </div>
        )}
        <div className="absolute top-4 right-4 bg-card px-3 py-1 rounded-full shadow-sm border z-10">
          <span className="text-sm font-semibold text-primary">
            {event.joiningFee > 0 ? `$${event.joiningFee.toFixed(2)}` : 'Free'}
          </span>
        </div>
        <div className="absolute top-4 left-4 z-10">
          <Badge variant="outline" className="capitalize bg-card/90 backdrop-blur-sm">
            {event.type.toLowerCase().replace('_', ' ')}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1">
        <h3 className="text-xl font-bold text-foreground mb-3 line-clamp-2">{event.name}</h3>
        {event.description && (
          <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{event.description}</p>
        )}

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4 shrink-0" />
            <span className="truncate">{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4 shrink-0" />
            <span>{formattedDate} • {formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4 shrink-0" />
            <span>{event.currentParticipants}/{event.maxParticipants} participants</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${Math.min(participantPercentage, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {event.maxParticipants - event.currentParticipants} spots left
          </p>
        </div>

        {event.host.averageRating && (
          <div className="flex items-center gap-2 text-sm">
            <Star className="text-primary fill-primary" size={16} />
            <span className="font-semibold text-foreground">{event.host.averageRating.toFixed(1)}</span>
            <span className="text-muted-foreground">Host rating</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
        <Button variant="outline" className="w-full" asChild>
          <Link href={`/events/${event.id}`}>
            View Details
          </Link>
        </Button>
        <Button className="w-full" asChild>
          <Link href={`/events/${event.id}`}>
            Join Event
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeaturedEvents = async () => {
  let featuredEvents: PublicEvent[] = [];
  let hasError = false;

  try {
    // Fetch the 3 newest events (sorted by createdAt descending)
    const eventsData = await getAllEvents({
      page: 1,
      limit: 3,
      sortBy: "createdAt",
      sortOrder: "desc",
      includePast: false, // Only show future events
    });

    featuredEvents = eventsData.data.slice(0, 3);
  } catch (error) {
    console.error("Error fetching featured events:", error);
    hasError = true;
  }

  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Featured Events
          </h2>
          <p className="text-muted-foreground mt-4">
            Discover the newest events happening near you and join amazing experiences with new friends.
          </p>
        </div>

        {hasError ? (
          <div className="text-center mt-12 py-12">
            <p className="text-muted-foreground">Unable to load featured events at the moment.</p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/events">
                Explore All Events
              </Link>
            </Button>
          </div>
        ) : featuredEvents.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
              {featuredEvents.map((event, index) => (
                <EventCard
                  key={event.id}
                  event={event}
                  priority={index === 0} // Only prioritize the first image for LCP
                />
              ))}
            </div>

            <div className="text-center mt-12">
              <Button size="lg" asChild>
                <Link href="/events">
                  View All Events
                </Link>
              </Button>
            </div>
          </>
        ) : (
          <div className="text-center mt-12 py-12">
            <p className="text-muted-foreground">No featured events available at the moment.</p>
            <Button size="lg" className="mt-4" asChild>
              <Link href="/events">
                Explore All Events
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedEvents;


