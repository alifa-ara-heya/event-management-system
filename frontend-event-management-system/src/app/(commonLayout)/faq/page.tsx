import Image from "next/image";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HelpCircle, Search } from "lucide-react";

const faqCategories = [
    {
        title: "General Questions",
        items: [
            {
                question: "What is EventMate?",
                answer: "EventMate is a platform that connects event hosts with participants. You can discover amazing events happening around you or create and host your own events. Whether you're interested in concerts, hiking, tech meetups, art exhibitions, or any other type of event, EventMate makes it easy to find and join them."
            },
            {
                question: "How do I get started?",
                answer: "Getting started is easy! Simply create an account by clicking the 'Register' button. Once registered, you can browse events, join events that interest you, or apply to become a host to create your own events."
            },
            {
                question: "Is EventMate free to use?",
                answer: "Yes, creating an account and browsing events is completely free. Some events may have a joining fee set by the host, but the platform itself is free to use."
            },
            {
                question: "How do I search for events?",
                answer: "You can search for events by using the search bar on the Explore Events page. You can filter by event type, status, location, and date. You can also browse events by category on the homepage."
            }
        ]
    },
    {
        title: "Events & Participation",
        items: [
            {
                question: "How do I join an event?",
                answer: "To join an event, simply click on the event card or 'View Details' button. On the event details page, click the 'Join Event' button. If the event has a joining fee, you'll be redirected to complete the payment. Once payment is confirmed, you'll be registered for the event."
            },
            {
                question: "Can I cancel my participation?",
                answer: "You can cancel unpaid event registrations from your 'My Payments' page. For paid events, cancellation policies may vary depending on the event host. Please contact the host directly for cancellation requests."
            },
            {
                question: "What happens if an event is cancelled?",
                answer: "If an event is cancelled by the host, all participants will be notified via email. If you've paid a joining fee, you'll receive a full refund automatically."
            },
            {
                question: "How do I know if an event is full?",
                answer: "Events show the current number of participants and the maximum capacity. If an event is full, it will be marked as 'FULL' and you won't be able to join until a spot becomes available."
            }
        ]
    },
    {
        title: "Hosting Events",
        items: [
            {
                question: "How do I become a host?",
                answer: "To become a host, click on 'Become a Host' in the navigation menu. Fill out the host application form with your information. Once submitted, our admin team will review your application and approve it if everything looks good."
            },
            {
                question: "What can I do as a host?",
                answer: "As a host, you can create and manage your own events, set pricing, manage participants, update event details, and track your event statistics. You have full control over your events."
            },
            {
                question: "How do I create an event?",
                answer: "Once you're approved as a host, go to your dashboard and click 'Create Event'. Fill out the event details including name, type, date, location, description, participant limits, and joining fee. You can also upload an event image."
            },
            {
                question: "How do I get paid for my events?",
                answer: "When participants pay to join your event, the payment is processed securely through our platform. You'll receive payments according to our payout schedule. Check your host dashboard for payment details and history."
            },
            {
                question: "Can I edit or delete my events?",
                answer: "Yes, you can edit your events at any time from the 'Manage Events' page in your host dashboard. You can update event details, change the status, or delete events if needed."
            }
        ]
    },
    {
        title: "Payments & Billing",
        items: [
            {
                question: "What payment methods are accepted?",
                answer: "We accept all major credit cards and debit cards through our secure payment processor, Stripe. All payments are processed securely and encrypted."
            },
            {
                question: "Are my payment details secure?",
                answer: "Yes, absolutely. We use Stripe, a PCI-compliant payment processor, to handle all payments. We never store your full credit card information on our servers."
            },
            {
                question: "What if a payment fails?",
                answer: "If a payment fails, you'll see an error message. Please check that your card details are correct and that you have sufficient funds. You can try again or use a different payment method."
            },
            {
                question: "Can I get a refund?",
                answer: "Refund policies vary by event. If an event is cancelled by the host, you'll receive an automatic refund. For other cancellation requests, please contact the event host directly."
            },
            {
                question: "Where can I see my payment history?",
                answer: "You can view all your payments in the 'My Payments' section of your dashboard. This shows all your transactions, payment status, and event details."
            }
        ]
    },
    {
        title: "Account & Profile",
        items: [
            {
                question: "How do I update my profile?",
                answer: "Go to 'My Profile' from your dashboard or the navigation menu. You can update your name, bio, location, interests, and profile photo. Click 'Save Changes' when you're done."
            },
            {
                question: "Can I change my email address?",
                answer: "Your email address is used as your account identifier and cannot be changed directly. If you need to change your email, please contact our support team."
            },
            {
                question: "What if I forget my password?",
                answer: "If you forget your password, click 'Login' and then 'Forgot Password'. You'll receive an email with instructions to reset your password."
            },
            {
                question: "How do I delete my account?",
                answer: "To delete your account, please contact our support team. We'll help you through the process and ensure all your data is properly removed."
            }
        ]
    }
];

export default function FAQPage() {
    return (
        <main className="min-h-screen">
            {/* Hero Section */}
            <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/assets/images/event1.jpg"
                        alt="FAQ"
                        fill
                        sizes="100vw"
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>
                <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
                    <div className="flex justify-center mb-4">
                        <div className="h-16 w-16 rounded-full bg-primary/20 flex items-center justify-center">
                            <HelpCircle className="h-8 w-8" />
                        </div>
                    </div>
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-lg sm:text-xl max-w-2xl mx-auto">
                        Find answers to common questions about EventMate
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-16 sm:py-20 lg:py-24 bg-background">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
                    <div className="space-y-8">
                        {faqCategories.map((category, categoryIndex) => (
                            <Card key={categoryIndex}>
                                <CardHeader>
                                    <CardTitle className="text-2xl">{category.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Accordion type="single" collapsible className="w-full">
                                        {category.items.map((item, itemIndex) => (
                                            <AccordionItem
                                                key={itemIndex}
                                                value={`item-${categoryIndex}-${itemIndex}`}
                                            >
                                                <AccordionTrigger className="text-left">
                                                    {item.question}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-muted-foreground">
                                                    {item.answer}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    {/* Still Have Questions */}
                    <Card className="mt-12 bg-muted/50">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Search className="h-5 w-5" />
                                Still have questions?
                            </CardTitle>
                            <CardDescription>
                                Can't find the answer you're looking for? We're here to help!
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <a
                                    href="/contact"
                                    className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                                >
                                    Contact Support
                                </a>
                                <a
                                    href="/events"
                                    className="inline-flex items-center justify-center rounded-md border border-input bg-background px-6 py-3 text-sm font-medium hover:bg-accent transition-colors"
                                >
                                    Explore Events
                                </a>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>
        </main>
    );
}

