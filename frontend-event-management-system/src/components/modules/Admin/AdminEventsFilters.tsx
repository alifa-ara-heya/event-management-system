"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
    { value: "createdAt:desc", label: "Recently Added" },
    { value: "createdAt:asc", label: "Oldest Added" },
    { value: "date:desc", label: "Date (Newest)" },
    { value: "date:asc", label: "Date (Oldest)" },
    { value: "name:asc", label: "Name (A-Z)" },
    { value: "name:desc", label: "Name (Z-A)" },
];

export function AdminEventsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");

    const status = searchParams.get("status") || "all";
    const type = searchParams.get("type") || "all";
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

    const clearFilters = () => {
        startTransition(() => {
            const params = new URLSearchParams();
            params.set("sortBy", "createdAt");
            params.set("sortOrder", "desc");
            setSearchTerm("");
            router.push(`?${params.toString()}`);
        });
    };

    const hasActiveFilters = status !== "all" || type !== "all" || searchTerm.trim() !== "";

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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

            <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Status:</label>
                    <Select
                        value={status}
                        onValueChange={(value) => updateParams("status", value)}
                        disabled={isPending}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {EVENT_STATUSES.map((status) => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Type:</label>
                    <Select
                        value={type}
                        onValueChange={(value) => updateParams("type", value)}
                        disabled={isPending}
                    >
                        <SelectTrigger className="w-[150px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {EVENT_TYPES.map((type) => (
                                <SelectItem key={type.value} value={type.value}>
                                    {type.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="flex items-center gap-2">
                    <label className="text-sm font-medium">Sort:</label>
                    <Select
                        value={sortValue}
                        onValueChange={(value) => {
                            const [by, order] = value.split(":");
                            updateParams("sortBy", by);
                            updateParams("sortOrder", order);
                        }}
                        disabled={isPending}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            {SORT_OPTIONS.map((option) => (
                                <SelectItem key={option.value} value={option.value}>
                                    {option.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {hasActiveFilters && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={clearFilters}
                        disabled={isPending}
                        className="ml-auto"
                    >
                        <X className="mr-2 h-4 w-4" />
                        Clear Filters
                    </Button>
                )}
            </div>
        </div>
    );
}

