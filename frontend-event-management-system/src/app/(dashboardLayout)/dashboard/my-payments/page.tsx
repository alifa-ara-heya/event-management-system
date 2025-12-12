import { getMyPayments } from "@/services/payment/getMyPayments";
import { Card, CardContent } from "@/components/ui/card";
import { DollarSign } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PaymentsFilters } from "@/components/modules/Payments/PaymentsFilters";
import { PaymentsList } from "@/components/modules/Payments/PaymentsList";
import { EventsPagination } from "@/components/modules/Events/EventsPagination";

interface MyPaymentsPageProps {
    searchParams: Promise<{
        page?: string;
        status?: string;
        sortBy?: string;
        sortOrder?: "asc" | "desc";
    }>;
}

async function MyPaymentsContent({ searchParams }: MyPaymentsPageProps) {
    const params = await searchParams;
    const page = parseInt(params.page || "1", 10);
    const limit = 12;

    const paymentsData = await getMyPayments({
        page,
        limit,
        status: params.status && params.status !== "all" ? (params.status as "PAID" | "UNPAID") : undefined,
        sortBy: params.sortBy || "createdAt",
        sortOrder: params.sortOrder || "desc",
    });

    const totalPages = Math.ceil(paymentsData.meta.total / limit);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">My Payments</h1>
                <p className="text-muted-foreground">
                    View and manage all your payments ({paymentsData.meta.total} total)
                </p>
            </div>

            <PaymentsFilters />

            <PaymentsList payments={paymentsData.data} />

            {paymentsData.data.length > 0 && (
                <EventsPagination
                    currentPage={page}
                    totalPages={totalPages}
                    totalItems={paymentsData.meta.total}
                    itemsPerPage={limit}
                />
            )}
        </div>
    );
}

function MyPaymentsSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <Skeleton className="h-9 w-48 mb-2" />
                <Skeleton className="h-5 w-64" />
            </div>
            <div className="flex gap-4">
                <Skeleton className="h-10 w-[180px]" />
                <Skeleton className="h-10 w-[200px]" />
            </div>
            <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="h-6 w-3/4 mb-4" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-4 w-full mb-2" />
                            <Skeleton className="h-10 w-32 mt-4" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

const MyPaymentsPage = async (props: MyPaymentsPageProps) => {
    return (
        <Suspense fallback={<MyPaymentsSkeleton />}>
            <MyPaymentsContent {...props} />
        </Suspense>
    );
};

export default MyPaymentsPage;

