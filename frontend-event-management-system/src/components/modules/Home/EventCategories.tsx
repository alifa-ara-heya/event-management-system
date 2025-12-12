"use client";

import { Music, Mountain, Gamepad2, UtensilsCrossed, Activity, Palette, Code2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import Image from 'next/image';

const eventCategories = [
  {
    name: 'Concert',
    type: 'CONCERT',
    icon: Music,
    image: '/assets/images/concert.jpg',
    glowColor: 'rgba(168, 85, 247, 0.4)',
  },
  {
    name: 'Hike',
    type: 'HIKE',
    icon: Mountain,
    image: '/assets/images/hike2.webp',
    glowColor: 'rgba(34, 197, 94, 0.4)',
  },
  {
    name: 'Dinner',
    type: 'DINNER',
    icon: UtensilsCrossed,
    image: '/assets/images/dinner2.webp',
    glowColor: 'rgba(249, 115, 22, 0.4)',
  },
  {
    name: 'Gaming',
    type: 'GAMING',
    icon: Gamepad2,
    image: '/assets/images/event1.jpg',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  {
    name: 'Sports',
    type: 'SPORTS',
    icon: Activity,
    image: '/assets/images/soccer.webp',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  {
    name: 'Art',
    type: 'ART',
    icon: Palette,
    image: '/assets/images/art-gallery.webp',
    glowColor: 'rgba(139, 92, 246, 0.4)',
  },
  {
    name: 'Tech Meetup',
    type: 'TECH_MEETUP',
    icon: Code2,
    image: '/assets/images/tech-event.jpg',
    glowColor: 'rgba(6, 182, 212, 0.4)',
  },
  {
    name: 'Other',
    type: 'OTHER',
    icon: MoreHorizontal,
    image: '/assets/images/event2.jpg',
    glowColor: 'rgba(107, 114, 128, 0.4)',
  },
];

const EventCategories = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCategoryClick = (type: string) => {
    startTransition(() => {
      router.push(`/events?type=${type}`);
    });
  };

  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">Event Categories</h2>
          <p className="text-muted-foreground max-w-md mt-2">
            Explore events across various categories and find what interests you.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {eventCategories.map((category) => (
            <Card
              key={category.type}
              onClick={() => handleCategoryClick(category.type)}
              className={cn(
                'text-center transition-all duration-300 cursor-pointer',
                'hover:shadow-lg hover:-translate-y-1',
                'group relative overflow-hidden',
                'border-2 border-transparent',
                'hover:border-primary/50',
                isPending && 'opacity-50 cursor-wait',
                'h-full min-h-[180px]'
              )}
              style={{
                boxShadow: 'none',
              }}
            >
              {/* Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Dark overlay for better text readability */}
                <div className="absolute inset-0 bg-black/40 dark:bg-black/60 group-hover:bg-black/50 dark:group-hover:bg-black/70 transition-colors duration-300" />
              </div>

              {/* Glow effect overlay for dark mode - appears on hover */}
              <div
                className={cn(
                  'absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300',
                  'dark:block hidden',
                  'z-0'
                )}
                style={{
                  background: `radial-gradient(circle at center, ${category.glowColor}, transparent 70%)`,
                  filter: 'blur(20px)',
                  transform: 'scale(1.3)',
                }}
              />

              <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center h-full">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4',
                    'bg-background/90 backdrop-blur-sm',
                    'border-2 border-primary/30',
                    'group-hover:border-primary/80',
                    'group-hover:bg-primary/20',
                    'group-hover:scale-110',
                    'transition-all duration-300',
                    'shadow-lg',
                  )}
                  style={{
                    boxShadow: `0 0 15px ${category.glowColor}`,
                  }}
                >
                  <category.icon
                    className={cn(
                      'text-primary',
                      'group-hover:text-primary',
                      'group-hover:scale-110',
                      'transition-all duration-300',
                    )}
                    style={{
                      filter: `drop-shadow(0 0 8px ${category.glowColor})`,
                    }}
                    size={32}
                  />
                </div>
                <h3 className="text-lg font-semibold text-white drop-shadow-lg group-hover:text-primary-foreground transition-colors">
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

