"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { useState, useTransition } from "react";

const USER_ROLES = [
    { value: "all", label: "All Roles" },
    { value: "USER", label: "User" },
    { value: "HOST", label: "Host" },
    { value: "ADMIN", label: "Admin" },
];

const USER_STATUSES = [
    { value: "all", label: "All Statuses" },
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
];

const SORT_OPTIONS = [
    { value: "createdAt:desc", label: "Newest First" },
    { value: "createdAt:asc", label: "Oldest First" },
    { value: "email:asc", label: "Email (A-Z)" },
    { value: "email:desc", label: "Email (Z-A)" },
];

export function UsersFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [searchTerm, setSearchTerm] = useState(searchParams.get("searchTerm") || "");

    const role = searchParams.get("role") || "all";
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
            if (sortBy !== "createdAt" || sortOrder !== "desc") {
                params.set("sortBy", sortBy);
                params.set("sortOrder", sortOrder);
            }
            setSearchTerm("");
            router.push(`?${params.toString()}`);
        });
    };

    const hasActiveFilters = role !== "all" || status !== "all" || searchTerm.trim() !== "";

    return (
        <div className="space-y-4">
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search users by name or email..."
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
                <Select value={role} onValueChange={(value) => updateParams("role", value)} disabled={isPending}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by role" />
                    </SelectTrigger>
                    <SelectContent>
                        {USER_ROLES.map((roleOption) => (
                            <SelectItem key={roleOption.value} value={roleOption.value}>
                                {roleOption.label}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>

                <Select value={status} onValueChange={(value) => updateParams("status", value)} disabled={isPending}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                        {USER_STATUSES.map((statusOption) => (
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

