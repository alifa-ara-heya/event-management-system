import { Shield, Users, Zap, Star, Heart, Lock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const features = [
    {
        icon: Shield,
        title: 'Secure & Safe',
        description: 'Your payments and personal information are protected with industry-standard security measures.',
        gradient: 'from-blue-500/20 to-cyan-500/20',
        iconColor: 'text-blue-600 dark:text-blue-400',
    },
    {
        icon: Users,
        title: 'Trusted Community',
        description: 'Join thousands of verified users and hosts creating amazing experiences together.',
        gradient: 'from-purple-500/20 to-pink-500/20',
        iconColor: 'text-purple-600 dark:text-purple-400',
    },
    {
        icon: Zap,
        title: 'Easy to Use',
        description: 'Simple, intuitive interface that makes finding and joining events effortless.',
        gradient: 'from-yellow-500/20 to-orange-500/20',
        iconColor: 'text-yellow-600 dark:text-yellow-400',
    },
    {
        icon: Star,
        title: 'Verified Hosts',
        description: 'All hosts are verified and rated by the community for quality and reliability.',
        gradient: 'from-green-500/20 to-emerald-500/20',
        iconColor: 'text-green-600 dark:text-green-400',
    },
    {
        icon: Heart,
        title: 'Build Connections',
        description: 'Meet like-minded people and form lasting friendships through shared experiences.',
        gradient: 'from-red-500/20 to-rose-500/20',
        iconColor: 'text-red-600 dark:text-red-400',
    },
    {
        icon: Lock,
        title: 'Secure Payments',
        description: 'Safe and secure payment processing with multiple payment options available.',
        gradient: 'from-indigo-500/20 to-violet-500/20',
        iconColor: 'text-indigo-600 dark:text-indigo-400',
    },
];

const WhyChooseUs = () => {
    return (
        <section className="py-16 md:py-24 bg-muted/50 relative overflow-hidden">
            {/* Decorative background pattern */}
            <div className="absolute inset-0 opacity-5 dark:opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-2xl mx-auto mb-12">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4">
                        Why Choose EventMate?
                    </h2>
                    <p className="text-muted-foreground text-lg">
                        Discover what makes us the perfect platform for finding and hosting amazing events
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                    {features.map((feature, index) => {
                        const Icon = feature.icon;
                        return (
                            <Card
                                key={index}
                                className={cn(
                                    'group relative overflow-hidden transition-all duration-300',
                                    'hover:shadow-xl hover:-translate-y-2',
                                    'bg-card border-2',
                                    'hover:border-primary/30',
                                    'shadow-sm'
                                )}
                            >
                                {/* Subtle gradient overlay on hover */}
                                <div className={cn(
                                    'absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300',
                                    'bg-gradient-to-br',
                                    feature.gradient
                                )} />

                                <CardContent className="p-6 relative z-10">
                                    <div className="flex flex-col items-start space-y-4">
                                        <div
                                            className={cn(
                                                'p-4 rounded-2xl',
                                                'bg-gradient-to-br',
                                                feature.gradient,
                                                'shadow-lg group-hover:shadow-xl',
                                                'group-hover:scale-110 transition-all duration-300',
                                                'border border-border/20'
                                            )}
                                        >
                                            <Icon
                                                className={cn(
                                                    'h-7 w-7',
                                                    feature.iconColor
                                                )}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                                                {feature.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm leading-relaxed">
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default WhyChooseUs;

