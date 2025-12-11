"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import { HostEvent } from "@/services/event/getHostEvents";
import { updateEventStatus, deleteEvent } from "@/services/event/updateEvent";
import { Edit, Trash2, MoreVertical, Calendar, MapPin, Users, Loader2 } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const EVENT_TYPES = [
    { value: "CONCERT", label: "Concert" },
    { value: "HIKE", label: "Hike" },
    { value: "DINNER", label: "Dinner" },
    { value: "GAMING", label: "Gaming" },
    { value: "SPORTS", label: "Sports" },
    { value: "ART", label: "Art" },
    { value: "TECH_MEETUP", label: "Tech Meetup" },
    { value: "OTHER", label: "Other" },
];

const EVENT_STATUSES = [
    { value: "OPEN", label: "Open" },
    { value: "FULL", label: "Full" },
    { value: "CANCELLED", label: "Cancelled" },
    { value: "COMPLETED", label: "Completed" },
];

interface ManageEventsClientProps {
    events: HostEvent[];
}

export default function ManageEventsClient({ events }: ManageEventsClientProps) {
    const router = useRouter();
    const [editingEvent, setEditingEvent] = useState<HostEvent | null>(null);
    const [editType, setEditType] = useState<string>("");
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updatingStatusEventId, setUpdatingStatusEventId] = useState<string | null>(null);
    const [deletingEventId, setDeletingEventId] = useState<string | null>(null);

    const handleUpdateStatus = async (eventId: string, status: string) => {
        setUpdatingStatusEventId(eventId);
        try {
            const result = await updateEventStatus(eventId, status);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update event status");
        } finally {
            setUpdatingStatusEventId(null);
        }
    };

    const handleDelete = async (eventId: string) => {
        setDeletingEventId(eventId);
        try {
            const result = await deleteEvent(eventId);
            if (result.success) {
                toast.success(result.message);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to delete event");
        } finally {
            setDeletingEventId(null);
        }
    };

    const handleEdit = (event: HostEvent) => {
        setEditingEvent(event);
        setEditType(event.type);
        setIsEditDialogOpen(true);
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingEvent) return;

        setIsUpdating(true);
        try {
            const formData = new FormData(e.currentTarget);
            
            // Create FormData for API route
            const uploadFormData = new FormData();
            
            // Only include fields that have values
            const name = formData.get("name") as string;
            const type = formData.get("type") as string;
            const description = formData.get("description") as string;
            const date = formData.get("date") as string;
            const location = formData.get("location") as string;
            const minParticipants = formData.get("minParticipants") as string;
            const maxParticipants = formData.get("maxParticipants") as string;
            const joiningFee = formData.get("joiningFee") as string;
            const file = formData.get("file") as File | null;

            const payload: any = {};
            if (name && name !== editingEvent.name) payload.name = name;
            if (type && type !== editingEvent.type) payload.type = type;
            if (description !== null) payload.description = description || undefined;
            if (date) {
                const newDate = new Date(date);
                const oldDate = new Date(editingEvent.date);
                if (newDate.getTime() !== oldDate.getTime()) {
                    payload.date = date;
                }
            }
            if (location && location !== editingEvent.location) payload.location = location;
            if (minParticipants && parseInt(minParticipants) !== editingEvent.minParticipants) {
                payload.minParticipants = parseInt(minParticipants);
            }
            if (maxParticipants && parseInt(maxParticipants) !== editingEvent.maxParticipants) {
                payload.maxParticipants = parseInt(maxParticipants);
            }
            if (joiningFee && parseFloat(joiningFee) !== editingEvent.joiningFee) {
                payload.joiningFee = parseFloat(joiningFee);
            }

            uploadFormData.append("data", JSON.stringify(payload));
            
            if (file && file instanceof File && file.size > 0) {
                uploadFormData.append("file", file);
            }

            const response = await fetch(`/api/events/${editingEvent.id}`, {
                method: "PATCH",
                body: uploadFormData,
                credentials: "include",
            });

            const result = await response.json();
            
            if (result.success) {
                toast.success(result.message);
                setIsEditDialogOpen(false);
                setEditingEvent(null);
                router.refresh();
            } else {
                toast.error(result.message);
            }
        } catch (error: any) {
            toast.error(error.message || "Failed to update event");
        } finally {
            setIsUpdating(false);
        }
    };

    // Format date for datetime-local input
    const formatDateForInput = (dateString: string) => {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    return (
        <>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {events.map((event) => (
                    <Card key={event.id} className="group relative overflow-hidden transition-all hover:shadow-lg h-full flex flex-col">
                        {event.image && (
                            <div className="relative h-48 w-full overflow-hidden">
                                <Image
                                    src={event.image}
                                    alt={event.name}
                                    fill
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="object-cover transition-transform group-hover:scale-105"
                                />
                                <div className="absolute top-2 right-2">
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="secondary" size="icon" className="h-8 w-8 bg-background/80 backdrop-blur-sm hover:bg-background/90">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/events/${event.id}`}>View Event</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEdit(event)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Event
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateStatus(event.id, event.status === "OPEN" ? "CANCELLED" : "OPEN")}
                                                disabled={updatingStatusEventId === event.id}
                                            >
                                                {event.status === "OPEN" ? "Cancel Event" : "Reopen Event"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    setDeletingEventId(event.id);
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Event
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        )}
                        <CardHeader className="flex-1">
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="line-clamp-2 group-hover:text-primary transition-colors flex-1">
                                    {event.name}
                                </CardTitle>
                                {!event.image && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem asChild>
                                                <Link href={`/events/${event.id}`}>View Event</Link>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => handleEdit(event)}>
                                                <Edit className="mr-2 h-4 w-4" />
                                                Edit Event
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => handleUpdateStatus(event.id, event.status === "OPEN" ? "CANCELLED" : "OPEN")}
                                                disabled={updatingStatusEventId === event.id}
                                            >
                                                {event.status === "OPEN" ? "Cancel Event" : "Reopen Event"}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                className="text-destructive focus:text-destructive"
                                                onSelect={(e) => {
                                                    e.preventDefault();
                                                    setDeletingEventId(event.id);
                                                }}
                                            >
                                                <Trash2 className="mr-2 h-4 w-4" />
                                                Delete Event
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-wrap mt-2">
                                <Badge variant="outline" className="capitalize">
                                    {event.status.toLowerCase()}
                                </Badge>
                                <Badge variant="secondary" className="capitalize">
                                    {event.type.toLowerCase().replace("_", " ")}
                                </Badge>
                            </div>
                            {event.description && (
                                <CardDescription className="line-clamp-2 mt-2">
                                    {event.description}
                                </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                    {new Date(event.date).toLocaleDateString("en-US", {
                                        weekday: "short",
                                        year: "numeric",
                                        month: "short",
                                        day: "numeric",
                                    })}
                                </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span className="truncate">{event.location}</span>
                            </div>
                            <div className="pt-2 border-t space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {event.currentParticipants}/{event.maxParticipants} participants
                                        </span>
                                    </div>
                                    {event.joiningFee > 0 && (
                                        <span className="font-semibold text-primary">
                                            ${event.joiningFee.toFixed(2)}
                                        </span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2">
                                    <Select
                                        value={event.status}
                                        onValueChange={(value) => handleUpdateStatus(event.id, value)}
                                        disabled={updatingStatusEventId === event.id}
                                    >
                                        <SelectTrigger className="w-full">
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
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => handleEdit(event)}
                                        className="shrink-0"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </div>
                                {updatingStatusEventId === event.id && (
                                    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Updating status...</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Edit Event Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Edit Event</DialogTitle>
                        <DialogDescription>
                            Update the event details. Leave fields empty to keep current values.
                        </DialogDescription>
                    </DialogHeader>
                    {editingEvent && (
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <FieldGroup>
                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="edit-name">Event Name</FieldLabel>
                                    <Input
                                        id="edit-name"
                                        name="name"
                                        type="text"
                                        defaultValue={editingEvent.name}
                                        disabled={isUpdating}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="edit-type">Event Type</FieldLabel>
                                    <Select value={editType} onValueChange={setEditType} disabled={isUpdating}>
                                        <SelectTrigger id="edit-type">
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
                                    <input type="hidden" name="type" value={editType} />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="edit-date">Event Date</FieldLabel>
                                    <Input
                                        id="edit-date"
                                        name="date"
                                        type="datetime-local"
                                        defaultValue={formatDateForInput(editingEvent.date)}
                                        disabled={isUpdating}
                                    />
                                </Field>

                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="edit-location">Location</FieldLabel>
                                    <Input
                                        id="edit-location"
                                        name="location"
                                        type="text"
                                        defaultValue={editingEvent.location}
                                        disabled={isUpdating}
                                    />
                                </Field>

                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="edit-description">Description</FieldLabel>
                                    <Textarea
                                        id="edit-description"
                                        name="description"
                                        rows={4}
                                        defaultValue={editingEvent.description || ""}
                                        disabled={isUpdating}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="edit-minParticipants">Min Participants</FieldLabel>
                                    <Input
                                        id="edit-minParticipants"
                                        name="minParticipants"
                                        type="number"
                                        min="1"
                                        defaultValue={editingEvent.minParticipants}
                                        disabled={isUpdating}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="edit-maxParticipants">Max Participants</FieldLabel>
                                    <Input
                                        id="edit-maxParticipants"
                                        name="maxParticipants"
                                        type="number"
                                        min="1"
                                        defaultValue={editingEvent.maxParticipants}
                                        disabled={isUpdating}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="edit-joiningFee">Joining Fee ($)</FieldLabel>
                                    <Input
                                        id="edit-joiningFee"
                                        name="joiningFee"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        defaultValue={editingEvent.joiningFee}
                                        disabled={isUpdating}
                                    />
                                </Field>

                                <Field className="md:col-span-2">
                                    <FieldLabel htmlFor="edit-file">Event Image (Optional)</FieldLabel>
                                    <FieldDescription className="mb-3">
                                        Upload a new image to replace the current one
                                    </FieldDescription>
                                    <Input
                                        id="edit-file"
                                        name="file"
                                        type="file"
                                        accept="image/*"
                                        disabled={isUpdating}
                                    />
                                </Field>
                            </FieldGroup>

                            <DialogFooter>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setIsEditDialogOpen(false)}
                                    disabled={isUpdating}
                                >
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        "Update Event"
                                    )}
                                </Button>
                            </DialogFooter>
                        </form>
                    )}
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <AlertDialog open={!!deletingEventId} onOpenChange={(open) => !open && setDeletingEventId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will permanently delete the event. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={!!deletingEventId}>
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={() => {
                                if (deletingEventId) {
                                    handleDelete(deletingEventId);
                                }
                            }}
                            disabled={!deletingEventId}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deletingEventId ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Deleting...
                                </>
                            ) : (
                                "Delete"
                            )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
