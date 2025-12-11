import { Star, Quote } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
// import { cn } from '@/lib/utils';

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Event Enthusiast',
        quote: 'I found amazing hiking companions through this platform! The events are well-organized and I\'ve made lasting friendships. Highly recommend!',
        rating: 5,
    },
    {
        name: 'Michael Chen',
        role: 'Music Lover',
        quote: 'As someone new to the city, this platform helped me discover local concerts and meet people with similar music tastes. The community is welcoming and fun!',
        rating: 5,
    },
    {
        name: 'Emily Rodriguez',
        role: 'Board Game Enthusiast',
        quote: 'I\'ve been hosting board game nights through this platform and the response has been incredible. Great way to connect with fellow gamers!',
        rating: 5,
    },
];

const Testimonials = () => {
    return (
        <section className="py-16 md:py-24 bg-background">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                        What Our Community Says
                    </h2>
                    <p className="text-muted-foreground mt-4">
                        Join thousands of users who have found their perfect event companions and created unforgettable memories.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
                    {testimonials.map((testimonial, index) => (
                        <Card key={index} className="bg-card relative border">
                            <CardContent className="p-6 md:p-8">
                                <Quote className="absolute top-4 left-4 text-primary opacity-20" size={48} />
                                <div className="relative z-10">
                                    <p className="text-muted-foreground mb-6 leading-relaxed">
                                        {testimonial.quote}
                                    </p>
                                    <div className="flex items-center">
                                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                            <span className="text-primary font-semibold text-lg">
                                                {testimonial.name.charAt(0)}
                                            </span>
                                        </div>
                                        <div className="ml-4 flex-1">
                                            <h4 className="font-bold text-foreground">{testimonial.name}</h4>
                                            <p className="text-muted-foreground text-sm">{testimonial.role}</p>
                                            <div className="flex mt-1 gap-0.5">
                                                {[...Array(testimonial.rating)].map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className="text-primary fill-primary"
                                                        size={16}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Testimonials;

