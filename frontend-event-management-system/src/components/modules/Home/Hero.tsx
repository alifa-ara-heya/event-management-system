import { Search, Calendar, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function Hero() {
    return (
        <div className="w-full relative overflow-hidden">
            {/* Gradient Background */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    background: `radial-gradient(125% 125% at 50% 90%, hsl(var(--background)) 30%, hsl(var(--primary)) 100%)`,
                }}
            />

            {/* Content Container */}
            <div className="w-full px-4 py-8 md:px-8 lg:px-16 relative z-10">
                <div className="mx-auto max-w-[1200px]">
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-12">
                        {/* Left Column - Hero Content */}
                        <div className="flex flex-col justify-center space-y-6">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-3 self-start rounded-full bg-card px-4 py-2 shadow-sm border">
                                <span className="text-xs font-medium text-primary">
                                    ✨ Find Your Perfect Event Companion
                                </span>
                            </div>

                            {/* Heading */}
                            <div className="space-y-2">
                                <h1 className="text-4xl md:text-5xl lg:text-[51px] leading-tight font-bold text-foreground">
                                    Connect with Like-Minded
                                </h1>
                                <h1 className="text-4xl md:text-5xl lg:text-[51px] leading-tight font-bold text-foreground">
                                    Event Enthusiasts
                                </h1>
                            </div>

                            {/* Description */}
                            <div className="space-y-1 text-base md:text-lg leading-7 text-muted-foreground">
                                <p>
                                    Discover amazing events and find the perfect companions to share
                                    unforgettable experiences with. From concerts to hiking trips,
                                    never miss out on an event again.
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col gap-4 sm:flex-row">
                                <Button
                                    size="lg"
                                    className="h-14 gap-3 rounded-xl px-8 text-base"
                                >
                                    <Search className="size-5" />
                                    Find Events
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="h-14 gap-3 rounded-xl px-8 text-base border-primary text-primary hover:bg-primary/10"
                                >
                                    <Calendar className="size-5" />
                                    Create Event
                                </Button>
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 pt-4">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl md:text-3xl font-bold text-foreground">10K+</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Active Users
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl md:text-3xl font-bold text-foreground">500+</p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        Events Monthly
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <p className="text-2xl md:text-3xl font-bold text-foreground">4.8</p>
                                        <Star className="size-5 fill-primary text-primary" />
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        User Rating
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Search Card */}
                        <div className="flex items-center justify-center lg:justify-end">
                            <div className="w-full max-w-[560px] rounded-2xl bg-card p-6 md:p-8 shadow-lg border">
                                {/* Card Header */}
                                <div className="mb-6 flex items-center justify-between">
                                    <h2 className="text-xl font-semibold text-foreground">Find Your Event</h2>
                                    <div className="text-primary text-2xl">✨</div>
                                </div>

                                {/* Form */}
                                <form className="space-y-6">
                                    {/* Event Search Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="event-search" className="text-sm text-muted-foreground">
                                            What event are you looking for?
                                        </Label>
                                        <Input
                                            id="event-search"
                                            name="event-search"
                                            placeholder="e.g., concert, hiking, board games"
                                            className="h-12 rounded-xl"
                                        />
                                    </div>

                                    {/* Location Input */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location" className="text-sm text-muted-foreground">
                                            Location
                                        </Label>
                                        <Input
                                            id="location"
                                            name="location"
                                            placeholder="City or area"
                                            className="h-12 rounded-xl"
                                        />
                                    </div>

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        className="h-12 w-full rounded-xl text-base"
                                    >
                                        <Search className="size-5" />
                                        Search Events
                                    </Button>
                                </form>

                                {/* Footer */}
                                <div className="mt-6 border-t border-border pt-4">
                                    <p className="text-center text-xs text-muted-foreground">
                                        ✨ Connect with people who share your interests and passions
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

