import { Search, UserPlus, CalendarCheck, Users, MapPin, CreditCard, Heart, Sparkles } from 'lucide-react';
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const steps = [
    {
        icon: Search,
        title: 'Browse Events',
        description: 'Discover exciting events happening near you or explore new interests.'
    },
    {
        icon: UserPlus,
        title: 'Join or Create',
        description: 'Join existing events or create your own and invite others to join.'
    },
    {
        icon: CalendarCheck,
        title: 'Confirm Attendance',
        description: 'Secure your spot and get all the event details you need.'
    },
    {
        icon: Users,
        title: 'Meet Your Companions',
        description: 'Connect with like-minded people before the event.'
    },
    {
        icon: MapPin,
        title: 'Attend Together',
        description: 'Meet up and enjoy the event with your new companions.'
    },
    {
        icon: CreditCard,
        title: 'Easy Payments',
        description: 'Pay event fees securely through our platform.'
    },
    {
        icon: Heart,
        title: 'Share Experiences',
        description: 'Rate events and share your experiences with the community.'
    },
    {
        icon: Sparkles,
        title: 'Build Connections',
        description: 'Form lasting friendships and find your event crew.'
    },
];

const StepCard = ({
    icon: Icon,
    title,
    description,
    index
}: {
    icon: React.ElementType;
    title: string;
    description: string;
    index: number;
}) => {
    const colors = [
        { bg: 'bg-primary/10', icon: 'text-primary' },
        { bg: 'bg-secondary', icon: 'text-primary' },
        { bg: 'bg-accent', icon: 'text-primary' },
        { bg: 'bg-primary/10', icon: 'text-primary' },
        { bg: 'bg-secondary', icon: 'text-primary' },
        { bg: 'bg-accent', icon: 'text-primary' },
        { bg: 'bg-primary/10', icon: 'text-primary' },
        { bg: 'bg-secondary', icon: 'text-primary' },
    ];

    const color = colors[index % 8];

    return (
        <Card className={cn('transition-all duration-300 hover:shadow-md', color.bg)}>
            <CardContent className="p-4 md:p-6">
                <div className="flex items-start space-x-4">
                    <div className={cn('p-3 rounded-full bg-card shadow-sm flex-shrink-0', color.icon)}>
                        <Icon size={24} />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-foreground mb-1">{title}</h3>
                        <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const HowItWorks = () => {
    return (
        <section className="py-16 md:py-24 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        How It Works
                    </h2>
                    <p className="text-muted-foreground mt-4">
                        Join events, meet new people, and create unforgettable memories together.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12">
                    {steps.map((step, index) => (
                        <StepCard key={index} {...step} index={index} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;

