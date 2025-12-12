import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface PaymentSuccessPageProps {
    searchParams: Promise<{
        session_id?: string;
    }>;
}

async function PaymentSuccessContent({ searchParams }: PaymentSuccessPageProps) {
    const params = await searchParams;
    const sessionId = params.session_id;

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
            <Card>
                <CardHeader className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="rounded-full bg-green-100 dark:bg-green-900 p-3">
                            <CheckCircle2 className="h-12 w-12 text-green-600 dark:text-green-400" />
                        </div>
                    </div>
                    <CardTitle className="text-2xl sm:text-3xl">Payment Successful!</CardTitle>
                    <CardDescription className="text-base mt-2">
                        Thank you for your payment. The webhook will process your event registration shortly.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {sessionId && (
                        <div className="bg-muted p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground mb-1">Session ID:</p>
                            <p className="text-xs font-mono break-all">{sessionId}</p>
                        </div>
                    )}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button asChild variant="default">
                            <Link href="/events">Explore More Events</Link>
                        </Button>
                        <Button asChild variant="outline">
                            <Link href="/dashboard/my-events">View My Events</Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

function PaymentSuccessSkeleton() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 max-w-2xl">
            <Card>
                <CardHeader className="text-center">
                    <Skeleton className="h-16 w-16 mx-auto mb-4 rounded-full" />
                    <Skeleton className="h-8 w-64 mx-auto mb-2" />
                    <Skeleton className="h-5 w-96 mx-auto" />
                </CardHeader>
                <CardContent>
                    <Skeleton className="h-20 w-full mb-6" />
                    <div className="flex gap-4 justify-center">
                        <Skeleton className="h-10 w-40" />
                        <Skeleton className="h-10 w-40" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const PaymentSuccessPage = async (props: PaymentSuccessPageProps) => {
    return (
        <Suspense fallback={<PaymentSuccessSkeleton />}>
            <PaymentSuccessContent {...props} />
        </Suspense>
    );
};

export default PaymentSuccessPage;

