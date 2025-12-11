import { getMyProfile } from "@/services/user/getMyProfile";
import ProfileForm from "@/components/modules/Profile/ProfileForm";
import { Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

async function ProfileContent() {
    const profile = await getMyProfile();
    return <ProfileForm profile={profile} />;
}

function ProfileSkeleton() {
    return (
        <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-1">
                <CardContent className="pt-6">
                    <div className="flex flex-col items-center space-y-4">
                        <Skeleton className="h-32 w-32 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </CardContent>
            </Card>
            <Card className="lg:col-span-2">
                <CardContent className="pt-6 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-24 w-full" />
                </CardContent>
            </Card>
        </div>
    );
}

const MyProfilePage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
                <p className="text-muted-foreground">
                    Manage your personal information and preferences
                </p>
            </div>

            <Suspense fallback={<ProfileSkeleton />}>
                <ProfileContent />
            </Suspense>
        </div>
    );
};

export default MyProfilePage;

