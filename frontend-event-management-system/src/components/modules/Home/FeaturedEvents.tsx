import { Star, MapPin, Calendar, Users } from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const featuredEvents = [
  {
    id: 1,
    title: 'Sunset Hiking Adventure',
    location: 'Mountain Trail, City Park',
    date: 'March 15, 2024',
    time: '5:00 PM',
    participants: { current: 8, max: 12 },
    rating: 4.9,
    reviews: 23,
    category: 'Outdoor & Sports',
    fee: '$15',
    image: '/api/placeholder/400/250',
  },
  {
    id: 2,
    title: 'Jazz Night at Downtown',
    location: 'Blue Note Jazz Club',
    date: 'March 20, 2024',
    time: '8:00 PM',
    participants: { current: 15, max: 20 },
    rating: 4.8,
    reviews: 45,
    category: 'Music & Concerts',
    fee: '$25',
    image: '/api/placeholder/400/250',
  },
  {
    id: 3,
    title: 'Board Game Meetup',
    location: 'Game Cafe Central',
    date: 'March 18, 2024',
    time: '6:30 PM',
    participants: { current: 6, max: 10 },
    rating: 4.9,
    reviews: 32,
    category: 'Gaming & Board Games',
    fee: '$10',
    image: '/api/placeholder/400/250',
  },
];

const EventCard = ({ event }: { event: typeof featuredEvents[0] }) => {
  const participantPercentage = (event.participants.current / event.participants.max) * 100;

  return (
    <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col">
      <CardHeader className="bg-muted/50 items-center p-0 relative">
        <div className="w-full h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
          <div className="text-4xl text-primary/30">
            {event.category === 'Outdoor & Sports' && '🏔️'}
            {event.category === 'Music & Concerts' && '🎵'}
            {event.category === 'Gaming & Board Games' && '🎲'}
          </div>
        </div>
        <div className="absolute top-4 right-4 bg-card px-3 py-1 rounded-full shadow-sm border">
          <span className="text-sm font-semibold text-primary">{event.fee}</span>
        </div>
      </CardHeader>
      <CardContent className="p-6 flex-1">
        <div className="mb-3">
          <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
            {event.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-foreground mb-3">{event.title}</h3>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="size-4" />
            <span>{event.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span>{event.date} • {event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>{event.participants.current}/{event.participants.max} participants</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="bg-primary h-full transition-all"
              style={{ width: `${participantPercentage}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {event.participants.max - event.participants.current} spots left
          </p>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Star className="text-primary fill-primary" size={16} />
          <span className="font-semibold text-foreground">{event.rating}</span>
          <span className="text-muted-foreground">({event.reviews} reviews)</span>
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 p-4 pt-0">
        <Button variant="outline" className="w-full">
          View Details
        </Button>
        <Button className="w-full">
          Join Event
        </Button>
      </CardFooter>
    </Card>
  );
};

const FeaturedEvents = () => {
  return (
    <section className="py-16 md:py-24 bg-card">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Featured Events
          </h2>
          <p className="text-muted-foreground mt-4">
            Discover popular events happening near you and join amazing experiences with new friends.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
          {featuredEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button size="lg">View All Events</Button>
        </div>
      </div>
    </section>
  );
};

export default FeaturedEvents;


