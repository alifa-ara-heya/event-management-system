"use client";

import { Music, Mountain, Gamepad2, UtensilsCrossed, Activity, Palette, Code2, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

const eventCategories = [
  {
    name: 'Concert',
    type: 'CONCERT',
    icon: Music,
    gradient: 'from-purple-500/20 via-pink-500/20 to-red-500/20',
    darkGradient: 'from-purple-500/30 via-pink-500/30 to-red-500/30',
    glowColor: 'rgba(168, 85, 247, 0.4)',
  },
  {
    name: 'Hike',
    type: 'HIKE',
    icon: Mountain,
    gradient: 'from-green-500/20 via-emerald-500/20 to-teal-500/20',
    darkGradient: 'from-green-500/30 via-emerald-500/30 to-teal-500/30',
    glowColor: 'rgba(34, 197, 94, 0.4)',
  },
  {
    name: 'Dinner',
    type: 'DINNER',
    icon: UtensilsCrossed,
    gradient: 'from-orange-500/20 via-amber-500/20 to-yellow-500/20',
    darkGradient: 'from-orange-500/30 via-amber-500/30 to-yellow-500/30',
    glowColor: 'rgba(249, 115, 22, 0.4)',
  },
  {
    name: 'Gaming',
    type: 'GAMING',
    icon: Gamepad2,
    gradient: 'from-blue-500/20 via-indigo-500/20 to-purple-500/20',
    darkGradient: 'from-blue-500/30 via-indigo-500/30 to-purple-500/30',
    glowColor: 'rgba(59, 130, 246, 0.4)',
  },
  {
    name: 'Sports',
    type: 'SPORTS',
    icon: Activity,
    gradient: 'from-red-500/20 via-rose-500/20 to-pink-500/20',
    darkGradient: 'from-red-500/30 via-rose-500/30 to-pink-500/30',
    glowColor: 'rgba(239, 68, 68, 0.4)',
  },
  {
    name: 'Art',
    type: 'ART',
    icon: Palette,
    gradient: 'from-violet-500/20 via-fuchsia-500/20 to-pink-500/20',
    darkGradient: 'from-violet-500/30 via-fuchsia-500/30 to-pink-500/30',
    glowColor: 'rgba(139, 92, 246, 0.4)',
  },
  {
    name: 'Tech Meetup',
    type: 'TECH_MEETUP',
    icon: Code2,
    gradient: 'from-cyan-500/20 via-blue-500/20 to-indigo-500/20',
    darkGradient: 'from-cyan-500/30 via-blue-500/30 to-indigo-500/30',
    glowColor: 'rgba(6, 182, 212, 0.4)',
  },
  {
    name: 'Other',
    type: 'OTHER',
    icon: MoreHorizontal,
    gradient: 'from-gray-500/20 via-slate-500/20 to-zinc-500/20',
    darkGradient: 'from-gray-500/30 via-slate-500/30 to-zinc-500/30',
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
                'bg-gradient-to-br',
                category.gradient,
                'dark:bg-gradient-to-br',
                category.darkGradient,
                'border-2 border-transparent',
                'hover:border-primary/50',
                isPending && 'opacity-50 cursor-wait'
              )}
              style={{
                boxShadow: 'none',
              }}
            >
              {/* Glow effect overlay for dark mode - appears on hover */}
              <div
                className={cn(
                  'absolute inset-0 opacity-0 dark:group-hover:opacity-100 transition-opacity duration-300',
                  'dark:block hidden',
                )}
                style={{
                  background: `radial-gradient(circle at center, ${category.glowColor}, transparent 70%)`,
                  filter: 'blur(20px)',
                  transform: 'scale(1.3)',
                  zIndex: 0,
                }}
              />

              <CardContent className="p-6 relative z-10">
                <div
                  className={cn(
                    'w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-4',
                    'bg-background/80 backdrop-blur-sm',
                    'border-2 border-primary/20',
                    'group-hover:border-primary/60',
                    'group-hover:bg-primary/10',
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
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors">
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

