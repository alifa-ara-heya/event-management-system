import { Music, Mountain, Gamepad2, UtensilsCrossed, Camera, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

const eventCategories = [
  {
    name: 'Music & Concerts',
    icon: Music,
  },
  {
    name: 'Outdoor & Sports',
    icon: Mountain,
  },
  {
    name: 'Gaming & Board Games',
    icon: Gamepad2,
  },
  {
    name: 'Food & Dining',
    icon: UtensilsCrossed,
  },
  {
    name: 'Photography',
    icon: Camera,
  },
  {
    name: 'Learning & Workshops',
    icon: BookOpen,
  },
];

const EventCategories = () => {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">Event Categories</h2>
            <p className="text-muted-foreground max-w-md mt-2">
              Explore events across various categories and find what interests you.
            </p>
          </div>
          <a href="#" className="text-primary font-semibold hover:underline mt-4 sm:mt-0">
            View All
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {eventCategories.map((category) => (
            <Card
              key={category.name}
              className={cn(
                'text-center transition-all duration-300 cursor-pointer hover:shadow-lg hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground group',
              )}
            >
              <CardContent className="p-6">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4 bg-secondary group-hover:bg-primary-foreground/20 transition-colors',
                  )}
                >
                  <category.icon
                    className={cn('text-primary group-hover:text-primary-foreground transition-colors')}
                    size={32}
                  />
                </div>
                <h3 className="text-lg font-semibold">
                  {category.name}
                </h3>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default EventCategories;

