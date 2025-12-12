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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { User } from "@/services/admin/getAllUsers";
import { deleteUser, changeUserStatus } from "@/services/admin/userActions";
import { Trash2, Loader2, User as UserIcon } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UsersListProps {
    users: User[];
}

const USER_STATUSES = [
    { value: "ACTIVE", label: "Active" },
    { value: "INACTIVE", label: "Inactive" },
];

export function UsersList({ users }: UsersListProps) {
    const router = useRouter();
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null);
    const [updatingStatusUserId, setUpdatingStatusUserId] = useState<string | null>(null);

    const handleDeleteUser = async (userId: string) => {
        setDeletingUserId(userId);
        try {
            const result = await deleteUser(userId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete user");
        } finally {
            setDeletingUserId(null);
        }
    };

    const handleStatusChange = async (userId: string, status: string) => {
        setUpdatingStatusUserId(userId);
        try {
            const result = await changeUserStatus(userId, status);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update user status");
        } finally {
            setUpdatingStatusUserId(null);
        }
    };

    if (users.length === 0) {
        return (
            <Card>
                <CardContent className="pt-6">
                    <div className="text-center py-12">
                        <UserIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">No users found</h3>
                        <p className="text-muted-foreground">
                            No users match your current filters.
                        </p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {users.map((user) => (
                <Card key={user.id}>
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex items-start gap-4 flex-1">
                                <Avatar className="h-12 w-12">
                                    <AvatarImage src={user.profilePhoto || undefined} alt={user.name || ""} />
                                    <AvatarFallback>
                                        {user.name?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h3 className="text-lg font-semibold">{user.name || "No Name"}</h3>
                                        <Badge variant="outline" className="capitalize">
                                            {user.role.toLowerCase()}
                                        </Badge>
                                        <Badge
                                            variant={user.status === "ACTIVE" ? "default" : "secondary"}
                                            className="capitalize"
                                        >
                                            {user.status.toLowerCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground mb-2">{user.email}</p>
                                    {user.bio && (
                                        <p className="text-sm text-muted-foreground mb-2">{user.bio}</p>
                                    )}
                                    {user.location && (
                                        <p className="text-sm text-muted-foreground">{user.location}</p>
                                    )}
                                    {user._count && (
                                        <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                                            {user._count.joinedEvents !== undefined && (
                                                <span>Events: {user._count.joinedEvents}</span>
                                            )}
                                            {user._count.reviews !== undefined && (
                                                <span>Reviews: {user._count.reviews}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Select
                                    value={user.status}
                                    onValueChange={(value) => handleStatusChange(user.id, value)}
                                    disabled={updatingStatusUserId === user.id}
                                >
                                    <SelectTrigger className="w-[140px]">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {USER_STATUSES.map((status) => (
                                            <SelectItem key={status.value} value={status.value}>
                                                {status.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            disabled={deletingUserId === user.id}
                                        >
                                            {deletingUserId === user.id ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-4 w-4" />
                                            )}
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Delete User?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete this user? This action cannot be undone.
                                                The user will be soft-deleted and can be restored if needed.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={() => handleDeleteUser(user.id)}
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

