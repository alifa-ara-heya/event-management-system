import { getMyProfile } from "@/services/user/getMyProfile";
import { checkHostRequestStatus } from "@/services/host/checkHostRequestStatus";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BecomeHostForm } from "@/components/modules/Host/BecomeHostForm";
import { AlertCircle } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

async function BecomeHostContent() {
    const profile = await getMyProfile();
    const requestStatus = await checkHostRequestStatus();

    // If user is already a host, redirect to host dashboard
    if (requestStatus.isHost) {
        redirect("/host/dashboard");
    }

    // Note: We can't check for pending/rejected requests without a backend endpoint
    // The form submission will handle errors if there's already a pending request
    // For now, we'll just show the form

    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight mb-2">Become a Host</h1>
                <p className="text-muted-foreground">
                    Join our community of event hosts and start creating amazing experiences!
                </p>
            </div>

            <div className="mb-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <AlertCircle className="h-5 w-5" />
                            What happens next?
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                            <li>Fill out the form below with your information</li>
                            <li>An admin will review your request</li>
                            <li>You'll be notified once your request is approved</li>
                            <li>Start creating and managing events!</li>
                        </ol>
                    </CardContent>
                </Card>
            </div>

            <BecomeHostForm userProfile={profile} />
        </div>
    );
}

function BecomeHostSkeleton() {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-3xl">
            <div className="mb-6">
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-96" />
            </div>
            <div className="mb-6">
                <Card>
                    <CardHeader>
                        <Skeleton className="h-6 w-64" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full mb-2" />
                        <Skeleton className="h-4 w-full" />
                    </CardContent>
                </Card>
            </div>
            <Card>
                <CardHeader>
                    <Skeleton className="h-6 w-48 mb-2" />
                    <Skeleton className="h-4 w-96" />
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-24 w-full" />
                        <Skeleton className="h-10 w-full" />
                        <Skeleton className="h-32 w-32 rounded-lg" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

const BecomeHostPage = async () => {
    return (
        <Suspense fallback={<BecomeHostSkeleton />}>
            <BecomeHostContent />
        </Suspense>
    );
};

export default BecomeHostPage;

