"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";

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
    { value: "createdAt:desc", label: "Recently Added" },
    { value: "createdAt:asc", label: "Oldest Added" },
];

export function ExploreEventsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");

    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";
    const sortBy = searchParams.get("sortBy") || "date";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const sortValue = `${sortBy}:${sortOrder}`;
    const includePast = searchParams.get("includePast") === "true";

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

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (searchTerm.trim()) {
                params.set("searchTerm", searchTerm.trim());
            } else {
                params.delete("searchTerm");
            }
            params.delete("page");
            router.push(`?${params.toString()}`);
        });
    };

    const toggleIncludePast = (checked: boolean) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (checked) {
                params.set("includePast", "true");
            } else {
                params.delete("includePast");
            }
            params.delete("page");
            router.push(`?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        startTransition(() => {
            const params = new URLSearchParams();
            // Keep default sort if it's not the default
            if (sortBy !== "date" || sortOrder !== "desc") {
                params.set("sortBy", "date");
                params.set("sortOrder", "desc");
            }
            setSearchTerm("");
            router.push(`?${params.toString()}`);
        });
    };

    const hasActiveFilters = status !== "all" || type !== "all" || searchTerm.trim() !== "" || includePast;

    return (
        <div className="space-y-4">
            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search events by name, description, or location..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9"
                        disabled={isPending}
                    />
                </div>
                <Button type="submit" disabled={isPending}>
                    Search
                </Button>
            </form>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-4">
                <Select value={status} onValueChange={(value) => updateParams("status", value)} disabled={isPending}>
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

                <Select value={type} onValueChange={(value) => updateParams("type", value)} disabled={isPending}>
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

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="includePast"
                        checked={includePast}
                        onCheckedChange={toggleIncludePast}
                        disabled={isPending}
                    />
                    <Label
                        htmlFor="includePast"
                        className="text-sm font-normal cursor-pointer"
                    >
                        Include past events
                    </Label>
                </div>

                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        className="gap-2"
                        disabled={isPending}
                    >
                        <X className="h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
}

