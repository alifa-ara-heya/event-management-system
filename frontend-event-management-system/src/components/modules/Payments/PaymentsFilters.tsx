"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState, useTransition } from "react";

const PAYMENT_STATUSES = [
    { value: "all", label: "All Payments" },
    { value: "PAID", label: "Paid" },
    { value: "UNPAID", label: "Unpaid" },
];

const SORT_OPTIONS = [
    { value: "createdAt:desc", label: "Newest First" },
    { value: "createdAt:asc", label: "Oldest First" },
    { value: "amount:desc", label: "Amount (High to Low)" },
    { value: "amount:asc", label: "Amount (Low to High)" },
];

export function PaymentsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();

    const status = searchParams.get("status") || "all";
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const sortValue = `${sortBy}:${sortOrder}`;

    const updateParams = (key: string, value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value && value !== "all") {
                params.set(key, value);
            } else {
                params.delete(key);
            }
            params.delete("page");
            router.push(`?${params.toString()}`);
        });
    };

    return (
        <div className="flex flex-wrap items-center gap-4">
            <Select value={status} onValueChange={(value) => updateParams("status", value)} disabled={isPending}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                    {PAYMENT_STATUSES.map((statusOption) => (
                        <SelectItem key={statusOption.value} value={statusOption.value}>
                            {statusOption.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select
                value={sortValue}
                onValueChange={(value) => {
                    const [newSortBy, newSortOrder] = value.split(":");
                    updateParams("sortBy", newSortBy);
                    updateParams("sortOrder", newSortOrder);
                }}
                disabled={isPending}
            >
                <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                    {SORT_OPTIONS.map((sortOption) => (
                        <SelectItem key={sortOption.value} value={sortOption.value}>
                            {sortOption.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

