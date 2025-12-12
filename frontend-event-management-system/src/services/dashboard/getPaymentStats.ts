"use server";

import { serverFetch } from "@/lib/server-fetch";

export interface PaymentStats {
    totalSpent: number;
    totalPayments: number;
    paidPayments: number;
    unpaidPayments: number;
    monthlySpending: Array<{
        month: string;
        amount: number;
        count: number;
    }>;
    eventTypeDistribution: Array<{
        type: string;
        count: number;
        amount: number;
    }>;
}

export const getPaymentStats = async (): Promise<PaymentStats> => {
    try {
        // Fetch all payments (we'll process them client-side for now)
        // In a real scenario, you'd want a dedicated stats endpoint
        const response = await serverFetch.get("/payment/my/payments?limit=1000&sortBy=createdAt&sortOrder=desc");
        const result = await response.json();

        if (!result.success) {
            return {
                totalSpent: 0,
                totalPayments: 0,
                paidPayments: 0,
                unpaidPayments: 0,
                monthlySpending: [],
                eventTypeDistribution: [],
            };
        }

        const payments = result.data || [];

        // Calculate stats
        const paidPayments = payments.filter((p: any) => p.status === "PAID");
        const totalSpent = paidPayments.reduce((sum: number, p: any) => sum + (p.amount || 0), 0);

        // Group by month
        const monthlyMap = new Map<string, { amount: number; count: number; label: string }>();
        paidPayments.forEach((payment: any) => {
            if (payment.paidAt) {
                const date = new Date(payment.paidAt);
                const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
                const monthLabel = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

                if (!monthlyMap.has(monthKey)) {
                    monthlyMap.set(monthKey, { amount: 0, count: 0, label: monthLabel });
                }
                const monthData = monthlyMap.get(monthKey)!;
                monthData.amount += payment.amount || 0;
                monthData.count += 1;
            }
        });

        const monthlySpending = Array.from(monthlyMap.entries())
            .map(([key, data]) => ({
                month: data.label || key,
                amount: data.amount,
                count: data.count,
            }))
            .sort((a, b) => a.month.localeCompare(b.month));

        // Group by event type (if available in payment data)
        const eventTypeMap = new Map<string, { count: number; amount: number }>();
        paidPayments.forEach((payment: any) => {
            if (payment.event?.type) {
                const type = payment.event.type;
                if (!eventTypeMap.has(type)) {
                    eventTypeMap.set(type, { count: 0, amount: 0 });
                }
                const typeData = eventTypeMap.get(type)!;
                typeData.count += 1;
                typeData.amount += payment.amount || 0;
            }
        });

        const eventTypeDistribution = Array.from(eventTypeMap.entries())
            .map(([type, data]) => ({
                type: type.replace('_', ' '),
                count: data.count,
                amount: data.amount,
            }));

        return {
            totalSpent,
            totalPayments: payments.length,
            paidPayments: paidPayments.length,
            unpaidPayments: payments.length - paidPayments.length,
            monthlySpending,
            eventTypeDistribution,
        };
    } catch (error) {
        console.error("Error fetching payment stats:", error);
        return {
            totalSpent: 0,
            totalPayments: 0,
            paidPayments: 0,
            unpaidPayments: 0,
            monthlySpending: [],
            eventTypeDistribution: [],
        };
    }
};

