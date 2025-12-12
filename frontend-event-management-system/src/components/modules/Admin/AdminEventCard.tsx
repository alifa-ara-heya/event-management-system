"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import { Calendar, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteAdminEvent } from "@/services/admin/deleteAdminEvent";
import { AdminEvent } from "@/services/admin/getAdminEvents";

interface AdminEventCardProps {
    event: AdminEvent;
}

export function AdminEventCard({ event }: AdminEventCardProps) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            const result = await deleteAdminEvent(event.id);
            
            if (result.success) {
                toast.success(result.message);
                setIsDialogOpen(false);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            console.error("Error deleting event:", error);
            toast.error("Failed to delete event. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <div className="group relative">
            <Link
                href={`/events/${event.id}`}
                className="block"
            >
                <Card className="h-full transition-all hover:shadow-md">
                    {event.image && (
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                            <Image
                                src={event.image}
                                alt={event.name}
                                fill
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                className="object-cover transition-transform group-hover:scale-105"
                            />
                        </div>
                    )}
                    <CardHeader>
                        <div className="flex items-start justify-between gap-2">
                            <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors">
                                {event.name}
                            </CardTitle>
                            <Badge variant="outline" className="shrink-0 capitalize">
                                {event.status.toLowerCase()}
                            </Badge>
                        </div>
                        <CardDescription className="line-clamp-2">
                            {event.description || "No description available"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 shrink-0" />
                            <span>{new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">Location:</span>
                            <span className="truncate">{event.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span className="font-medium">Host:</span>
                            <span className="truncate">{event.host.name}</span>
                        </div>
                        <div className="pt-2 border-t">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    {event._count.participants}/{event.maxParticipants} participants
                                </span>
                                {event.joiningFee > 0 && (
                                    <span className="font-semibold text-primary">
                                        ${event.joiningFee.toFixed(2)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
            
            {/* Delete Button */}
            <div className="absolute top-2 right-2 z-10">
                <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <AlertDialogTrigger asChild>
                        <Button
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 shadow-lg"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setIsDialogOpen(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently delete the event "{event.name}". This action cannot be undone.
                                All participants and related data will be affected.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleDelete();
                                }}
                                disabled={isDeleting}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete Event"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

