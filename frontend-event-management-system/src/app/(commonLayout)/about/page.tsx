import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Users, Heart, Award, Globe, Zap } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[60vh] min-h-[400px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/images/tech-event.jpg"
                        alt="EventMate Platform"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                        About EventMate
                    </h1>
                    <p className="text-lg sm:text-xl max-w-2xl mx-auto">
                        Connecting people through amazing events and unforgettable experiences
                    </p>
                </div>
            </section>

            {/* Our Story Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Story</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            EventMate was born from a simple idea: making it easier for people to discover, join, and create amazing events.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div className="relative h-64 md:h-80 rounded-lg overflow-hidden">
                            <Image
                                src="/assets/images/event1.jpg"
                                alt="Our Story"
                                fill
                                sizes="(max-width: 768px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                        <div className="space-y-4">
                            <p className="text-muted-foreground">
                                Founded in 2024, EventMate has quickly become the go-to platform for event enthusiasts and hosts alike.
                                We believe that great experiences bring people together and create lasting memories.
                            </p>
                            <p className="text-muted-foreground">
                                Our platform connects event hosts with participants, making it simple to discover local concerts,
                                hiking adventures, tech meetups, art exhibitions, and so much more. Whether you're looking to join
                                an event or host your own, EventMate makes it easy.
                            </p>
                            <p className="text-muted-foreground">
                                We're committed to building a vibrant community where everyone can find their perfect event,
                                from casual meetups to professional networking opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission & Values Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-muted/50">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            To create a seamless platform that empowers people to discover, join, and host amazing events that bring communities together.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl mx-auto">
                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Target className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Our Mission</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    To democratize event discovery and hosting, making it accessible to everyone regardless of their background or experience.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Heart className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Our Values</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    We value community, inclusivity, and authenticity. Every event on our platform is a chance to build meaningful connections.
                                </CardDescription>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Award className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>Our Vision</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>
                                    To become the world's leading platform for event discovery, where millions of people find their next great experience.
                                </CardDescription>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* What We Offer Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold mb-4">What We Offer</h2>
                        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                            Everything you need to discover and host amazing events
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>For Participants</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Discover events by category and location</li>
                                    <li>• Easy event registration and payment</li>
                                    <li>• Track your event history</li>
                                    <li>• Connect with hosts and other participants</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Zap className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>For Hosts</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Create and manage your events easily</li>
                                    <li>• Set pricing and participant limits</li>
                                    <li>• Track registrations and payments</li>
                                    <li>• Build your hosting reputation</li>
                                </ul>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                                    <Globe className="h-6 w-6 text-primary" />
                                </div>
                                <CardTitle>For Everyone</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li>• Secure payment processing</li>
                                    <li>• Responsive customer support</li>
                                    <li>• Mobile-friendly platform</li>
                                    <li>• Safe and trusted community</li>
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 sm:py-20 lg:py-24 bg-primary/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">Join the EventMate Community</h2>
                    <p className="text-lg text-muted-foreground mb-8">
                        Whether you're looking to discover amazing events or host your own, we're here to help you every step of the way.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="/register"
                            className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                        >
                            Get Started
                        </a>
                        <a
                            href="/events"
                            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
                        >
                            Explore Events
                        </a>
                    </div>
                </div>
            </section>
        </main>
    );
}

