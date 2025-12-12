import LoginForm from "@/components/modules/Auth/login-form";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Info } from "lucide-react";

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
            <div className="w-full max-w-xl space-y-4">
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

                {/* Test Credentials */}
                <Card className="border-muted">
                    <CardContent className="pt-6">
                        <Accordion type="single" collapsible>
                            <AccordionItem value="test-credentials" className="border-none">
                                <AccordionTrigger className="text-sm text-muted-foreground hover:no-underline">
                                    <div className="flex items-center gap-2">
                                        <Info className="h-4 w-4" />
                                        <span>Test Credentials (Development Only)</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <div className="space-y-3 pt-2">
                                        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                                            <p className="text-xs font-semibold text-foreground">Regular User</p>
                                            <p className="text-xs text-muted-foreground">
                                                Email: <span className="font-mono text-foreground">user@test.com</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Password: <span className="font-mono text-foreground">Abc@123</span>
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                                            <p className="text-xs font-semibold text-foreground">Admin</p>
                                            <p className="text-xs text-muted-foreground">
                                                Email: <span className="font-mono text-foreground">admin@test.com</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Password: <span className="font-mono text-foreground">Abc@123</span>
                                            </p>
                                        </div>
                                        <div className="rounded-lg bg-muted/50 p-3 space-y-1">
                                            <p className="text-xs font-semibold text-foreground">Host</p>
                                            <p className="text-xs text-muted-foreground">
                                                Email: <span className="font-mono text-foreground">host@test.com</span>
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                Password: <span className="font-mono text-foreground">Abc@123</span>
                                            </p>
                                        </div>
                                    </div>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default LoginPage;

