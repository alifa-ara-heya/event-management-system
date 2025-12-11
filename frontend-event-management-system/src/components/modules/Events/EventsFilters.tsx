"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const EVENT_STATUSES = [
    { value: "all", label: "All Statuses" },
    { value: "OPEN", label: "Open" },
    { value: "FULL", label: "Full" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "COMPLETED", label: "Completed" },
];

const EVENT_TYPES = [
    { value: "all", label: "All Types" },
    { value: "CONCERT", label: "Concert" },
    { value: "HIKE", label: "Hike" },
    { value: "DINNER", label: "Dinner" },
    { value: "GAMING", label: "Gaming" },
    { value: "SPORTS", label: "Sports" },
    { value: "ART", label: "Art" },
    { value: "TECH_MEETUP", label: "Tech Meetup" },
    { value: "OTHER", label: "Other" },
];

const SORT_OPTIONS = [
    { value: "date:desc", label: "Date (Newest)" },
    { value: "date:asc", label: "Date (Oldest)" },
    { value: "name:asc", label: "Name (A-Z)" },
    { value: "name:desc", label: "Name (Z-A)" },
    { value: "createdAt:desc", label: "Recently Joined" },
    { value: "createdAt:asc", label: "Oldest Joined" },
];

interface EventsFiltersProps {
    showTypeFilter?: boolean;
    showStatusFilter?: boolean;
    showSort?: boolean;
}

export function EventsFilters({ 
    showTypeFilter = true, 
    showStatusFilter = true,
    showSort = true 
}: EventsFiltersProps) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const sortValue = `${sortBy}:${sortOrder}`;

    const updateParams = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value && value !== "all") {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        // Reset to page 1 when filters change
        params.delete("page");
        router.push(`?${params.toString()}`);
    };

    const clearFilters = () => {
        const params = new URLSearchParams();
        // Keep sort if it's not default
        if (sortBy !== "date" || sortOrder !== "desc") {
            params.set("sortBy", sortBy);
            params.set("sortOrder", sortOrder);
        }
        router.push(`?${params.toString()}`);
    };

    const hasActiveFilters = (status && status !== "all") || (type && type !== "all");

    return (
        <div className="flex flex-wrap items-center gap-4">
            {showStatusFilter && (
                <Select value={status} onValueChange={(value) => updateParams("status", value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {EVENT_STATUSES.map((statusOption) => (
                            <SelectItem key={statusOption.value} value={statusOption.value}>
                                {statusOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {showTypeFilter && (
                <Select value={type} onValueChange={(value) => updateParams("type", value)}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                        {EVENT_TYPES.map((typeOption) => (
                            <SelectItem key={typeOption.value} value={typeOption.value}>
                                {typeOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            )}

            {showSort && (
                <Select value={sortValue} onValueChange={(value) => {
                    const [newSortBy, newSortOrder] = value.split(":");
                    updateParams("sortBy", newSortBy);
                    updateParams("sortOrder", newSortOrder);
                }}>
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
            )}

            {hasActiveFilters && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    className="gap-2"
                >
                    <X className="h-4 w-4" />
                    Clear Filters
                </Button>
            )}
        </div>
    );
}

