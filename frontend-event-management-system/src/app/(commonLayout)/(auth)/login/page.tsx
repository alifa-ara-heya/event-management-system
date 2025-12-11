import LoginForm from "@/components/modules/Auth/login-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

const LoginPage = async ({
    searchParams,
}: {
    searchParams: Promise<{ redirect?: string; registered?: string }>;
}) => {
    const params = await searchParams;

    // Filter out reset-password redirects
    const redirect = params?.redirect && !params.redirect.includes('reset-password')
        ? params.redirect
        : undefined;

    return (
        <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10 bg-background">
            <div className="w-full max-w-xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome back</CardTitle>
                        <CardDescription>
                            {params?.registered === "true"
                                ? "Your account has been created successfully! Please login to continue."
                                : "Enter your credentials to access your account"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <LoginForm redirect={redirect} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;

