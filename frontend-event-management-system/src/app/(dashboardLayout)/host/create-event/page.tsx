"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, X, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createEventValidationZodSchema } from "@/zod/event.validation";
import { zodValidator } from "@/lib/zodValidator";

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

const CreateEventForm = () => {
    const router = useRouter();
    const [isPending, setIsPending] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [selectedType, setSelectedType] = useState<string>("");
    const [errors, setErrors] = useState<Record<string, string>>({});

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setErrors({});

        const formData = new FormData(e.currentTarget);
        
        // Extract form data
        const name = formData.get("name") as string;
        const type = formData.get("type") as string;
        const description = formData.get("description") as string;
        const date = formData.get("date") as string;
        const location = formData.get("location") as string;
        const minParticipants = formData.get("minParticipants") ? parseInt(formData.get("minParticipants") as string) : 1;
        const maxParticipants = parseInt(formData.get("maxParticipants") as string);
        const joiningFee = formData.get("joiningFee") ? parseFloat(formData.get("joiningFee") as string) : 0;
        const status = "OPEN";
        const file = formData.get("file") as File | null;

        // Prepare payload
        const payload = {
            name,
            type,
            description: description || undefined,
            date,
            location,
            minParticipants,
            maxParticipants,
            joiningFee,
            status,
        };

        // Validate payload
        const validationResult = zodValidator(payload, createEventValidationZodSchema);
        if (!validationResult.success) {
            const fieldErrors: Record<string, string> = {};
            validationResult.errors?.forEach((error) => {
                if (error.field) {
                    fieldErrors[error.field] = error.message;
                }
            });
            setErrors(fieldErrors);
            setIsPending(false);
            toast.error(validationResult.errors?.[0]?.message || "Validation failed");
            return;
        }

        // Use validated data
        const validatedPayload = validationResult.data;

        try {
            // Create FormData for API route
            const uploadFormData = new FormData();
            uploadFormData.append("data", JSON.stringify(validatedPayload));

            // Only append file if it's a valid File object with size > 0
            if (file && file instanceof File && file.size > 0) {
                uploadFormData.append("file", file);
                console.log("📸 Appending file to FormData:", {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                });
            }

            console.log("🚀 Creating event via API route with payload:", validatedPayload);

            const response = await fetch("/api/events/create", {
                method: "POST",
                body: uploadFormData,
                credentials: "include",
            });

            const result = await response.json();

            console.log("📥 Create event response:", result);

            if (!result.success) {
                toast.error(result.message || "Failed to create event");
                setIsPending(false);
                return;
            }

            console.log("✅ Event created successfully:", result.data);
            toast.success("Event created successfully!");
            
            // Redirect immediately
            router.push(`/events/${result.data.id}`);
            router.refresh(); // Refresh to ensure data is loaded
        } catch (error: any) {
            console.error("❌ Error creating event:", error);
            toast.error(error.message || "An error occurred while creating the event");
            setIsPending(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        const fileInput = document.getElementById("file") as HTMLInputElement;
        if (fileInput) {
            fileInput.value = "";
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Create Event</h1>
                <p className="text-muted-foreground">
                    Create a new event for others to join
                </p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <FieldGroup>
                            {/* Event Name */}
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="name">Event Name *</FieldLabel>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter event name"
                                    required
                                    disabled={isPending}
                                    aria-invalid={errors.name ? "true" : "false"}
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive mt-1">{errors.name}</p>
                                )}
                            </Field>

                            {/* Event Type */}
                            <Field>
                                <FieldLabel htmlFor="type">Event Type *</FieldLabel>
                                <Select
                                    value={selectedType}
                                    onValueChange={setSelectedType}
                                    required
                                    disabled={isPending}
                                >
                                    <SelectTrigger id="type" className="w-full">
                                        <SelectValue placeholder="Select event type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {EVENT_TYPES.map((type) => (
                                            <SelectItem key={type.value} value={type.value}>
                                                {type.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <input type="hidden" name="type" value={selectedType} required />
                                {errors.type && (
                                    <p className="text-sm text-destructive mt-1">{errors.type}</p>
                                )}
                            </Field>

                            {/* Date */}
                            <Field>
                                <FieldLabel htmlFor="date">Event Date *</FieldLabel>
                                <Input
                                    id="date"
                                    name="date"
                                    type="datetime-local"
                                    required
                                    disabled={isPending}
                                    aria-invalid={errors.date ? "true" : "false"}
                                />
                                {errors.date && (
                                    <p className="text-sm text-destructive mt-1">{errors.date}</p>
                                )}
                            </Field>

                            {/* Location */}
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="location">Location *</FieldLabel>
                                <Input
                                    id="location"
                                    name="location"
                                    type="text"
                                    placeholder="City, Country or specific address"
                                    required
                                    disabled={isPending}
                                    aria-invalid={errors.location ? "true" : "false"}
                                />
                                {errors.location && (
                                    <p className="text-sm text-destructive mt-1">{errors.location}</p>
                                )}
                            </Field>

                            {/* Description */}
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="description">Description</FieldLabel>
                                <Textarea
                                    id="description"
                                    name="description"
                                    placeholder="Describe your event..."
                                    rows={4}
                                    disabled={isPending}
                                />
                            </Field>

                            {/* Min Participants */}
                            <Field>
                                <FieldLabel htmlFor="minParticipants">Min Participants</FieldLabel>
                                <Input
                                    id="minParticipants"
                                    name="minParticipants"
                                    type="number"
                                    min="1"
                                    defaultValue="1"
                                    disabled={isPending}
                                />
                            </Field>

                            {/* Max Participants */}
                            <Field>
                                <FieldLabel htmlFor="maxParticipants">Max Participants *</FieldLabel>
                                <Input
                                    id="maxParticipants"
                                    name="maxParticipants"
                                    type="number"
                                    min="1"
                                    required
                                    disabled={isPending}
                                    aria-invalid={errors.maxParticipants ? "true" : "false"}
                                />
                                {errors.maxParticipants && (
                                    <p className="text-sm text-destructive mt-1">{errors.maxParticipants}</p>
                                )}
                            </Field>

                            {/* Joining Fee */}
                            <Field>
                                <FieldLabel htmlFor="joiningFee">Joining Fee ($)</FieldLabel>
                                <Input
                                    id="joiningFee"
                                    name="joiningFee"
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    defaultValue="0"
                                    disabled={isPending}
                                />
                            </Field>

                            {/* Event Image */}
                            <Field className="md:col-span-2">
                                <FieldLabel htmlFor="file">Event Image (Optional)</FieldLabel>
                                <FieldDescription className="mb-3">
                                    Upload an image to showcase your event
                                </FieldDescription>
                                <input
                                    type="file"
                                    id="file"
                                    name="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    className="hidden"
                                    disabled={isPending}
                                />

                                {photoPreview ? (
                                    <div className="relative inline-block">
                                        <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-border">
                                            <Image
                                                src={photoPreview}
                                                alt="Event preview"
                                                fill
                                                sizes="192px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={handleRemovePhoto}
                                            className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1 hover:bg-destructive/90 transition-colors"
                                            aria-label="Remove image"
                                            disabled={isPending}
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <label
                                            htmlFor="file"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-accent transition-colors"
                                        >
                                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                                <p className="mb-2 text-sm text-muted-foreground">
                                                    <span className="font-semibold">Click to upload</span> or drag and drop
                                                </p>
                                                <p className="text-xs text-muted-foreground">PNG, JPG, GIF up to 10MB</p>
                                            </div>
                                        </label>
                                    </div>
                                )}
                            </Field>
                        </FieldGroup>

                        <div className="flex items-center gap-4 pt-4">
                            <Button type="submit" disabled={isPending}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating...
                                    </>
                                ) : (
                                    "Create Event"
                                )}
                            </Button>
                            <Button type="button" variant="outline" asChild disabled={isPending}>
                                <Link href="/host/my-events">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default CreateEventForm;
