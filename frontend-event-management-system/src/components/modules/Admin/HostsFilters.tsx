"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";

const SORT_OPTIONS = [
    { value: "createdAt:desc", label: "Newest First" },
    { value: "createdAt:asc", label: "Oldest First" },
    { value: "name:asc", label: "Name (A-Z)" },
    { value: "name:desc", label: "Name (Z-A)" },
    { value: "averageRating:desc", label: "Rating (High to Low)" },
    { value: "totalRevenue:desc", label: "Revenue (High to Low)" },
];

export function HostsFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");
    const [location, setLocation] = useState(searchParams.get("location") || "");

    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";
    const sortValue = `${sortBy}:${sortOrder}`;

    const updateParams = (key: string, value: string) => {
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (value) {
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

    const handleLocationSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        startTransition(() => {
            const params = new URLSearchParams(searchParams.toString());
            if (location.trim()) {
                params.set("location", location.trim());
            } else {
                params.delete("location");
            }
            params.delete("page");
            router.push(`?${params.toString()}`);
        });
    };

    const clearFilters = () => {
        startTransition(() => {
            const params = new URLSearchParams();
            if (sortBy !== "createdAt" || sortOrder !== "desc") {
                params.set("sortBy", sortBy);
                params.set("sortOrder", sortOrder);
            }
            setSearchTerm("");
            setLocation("");
            router.push(`?${params.toString()}`);
        });
    };

    const hasActiveFilters = searchTerm.trim() !== "" || location.trim() !== "";

    return (
        <div className="space-y-4">
            <div className="flex gap-2">
                <form onSubmit={handleSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search hosts by name or email..."
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
                <form onSubmit={handleLocationSearch} className="flex-1 flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Filter by location..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="pl-9"
                            disabled={isPending}
                        />
                    </div>
                    <Button type="submit" variant="outline" disabled={isPending}>
                        Filter
                    </Button>
                </form>
            </div>

            <div className="flex flex-wrap items-center gap-4">
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

