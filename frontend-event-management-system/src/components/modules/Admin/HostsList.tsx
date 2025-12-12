"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Host } from "@/services/admin/getAllHosts";
import { deleteHost, updateHostStatus } from "@/services/admin/hostActions";
import { Trash2, Loader2, UserCog } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HostsListProps {
    hosts: Host[];
}

export function HostsList({ hosts }: HostsListProps) {
    const router = useRouter();
    const [deletingHostId, setDeletingHostId] = useState<string | null>(null);
    const [updatingStatusHostId, setUpdatingStatusHostId] = useState<string | null>(null);

    const handleDeleteHost = async (hostId: string) => {
        setDeletingHostId(hostId);
        try {
            const result = await deleteHost(hostId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete host");
        } finally {
            setDeletingHostId(null);
        }
    };

    const handleStatusToggle = async (hostId: string, currentIsDeleted: boolean) => {
        setUpdatingStatusHostId(hostId);
        try {
            const result = await updateHostStatus(hostId, !currentIsDeleted);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update host status");
        } finally {
            setUpdatingStatusHostId(null);
        }
    };

    if (hosts.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-12">
                        <UserCog className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No hosts found</h3>
                        <p className="text-muted-foreground">
                            No hosts match your current filters.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {hosts.map((host) => (
                <Card key={host.id}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={host.profilePhoto || undefined} alt={host.name || ""} />
                                    <AvatarFallback>
                                        {host.name?.[0]?.toUpperCase() || host.email[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold">{host.name || "No Name"}</h3>
                                        {host.averageRating !== null && (
                                            <Badge variant="outline">
                                                ⭐ {host.averageRating.toFixed(1)}
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{host.email}</p>
                                    {host.bio && (
                                        <p className="text-sm text-muted-foreground mb-2">{host.bio}</p>
                                    )}
                                    {host.location && (
                                        <p className="text-sm text-muted-foreground mb-2">{host.location}</p>
                                    )}
                                    {host.contactNumber && (
                                        <p className="text-sm text-muted-foreground mb-2">{host.contactNumber}</p>
                                    )}
                                    {host._count && (
                                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                            {host._count.hostedEvents !== undefined && (
                                                <span>Events: {host._count.hostedEvents}</span>
                                            )}
                                            {host._count.reviews !== undefined && (
                                                <span>Reviews: {host._count.reviews}</span>
                                            )}
                                        </div>
                                    )}
                                    <div className="mt-2 text-sm font-medium">
                                        Total Revenue: ${host.totalRevenue.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant={host.isDeleted ? "outline" : "default"}
                                    size="sm"
                                    onClick={() => handleStatusToggle(host.id, host.isDeleted || false)}
                                    disabled={updatingStatusHostId === host.id}
                                >
                                    {updatingStatusHostId === host.id ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : host.isDeleted ? (
                                        "Restore"
                                    ) : (
                                        "Deactivate"
                                    )}
                                </Button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            disabled={deletingHostId === host.id}
                                        >
                                            {deletingHostId === host.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete Host?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this host? This action cannot be undone.
                                                The host will be permanently deleted.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteHost(host.id)}
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                            >
                                                Delete
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}

