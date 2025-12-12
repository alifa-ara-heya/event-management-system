"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Field } from "@/components/ui/field";
import { Loader2, Upload, X, UserCheck } from "lucide-react";
import Image from "next/image";

interface BecomeHostFormProps {
    userProfile?: {
        name?: string | null;
        bio?: string | null;
        location?: string | null;
        profilePhoto?: string | null;
    };
}

export function BecomeHostForm({ userProfile }: BecomeHostFormProps) {
    const router = useRouter();
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(userProfile?.profilePhoto || null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: userProfile?.name || "",
        contactNumber: "",
        bio: userProfile?.bio || "",
        location: userProfile?.location || "",
    });

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Prepare FormData
            const submitFormData = new FormData();

            // Build data object with only fields that have values
            const data: any = {};
            if (formData.name) data.name = formData.name;
            if (formData.contactNumber) data.contactNumber = formData.contactNumber;
            if (formData.bio) data.bio = formData.bio;
            if (formData.location) data.location = formData.location;

            // Append data as JSON string
            submitFormData.append("data", JSON.stringify(data));

            // Append file if selected
            if (profilePhoto) {
                submitFormData.append("file", profilePhoto);
            }

            const response = await fetch("/api/host/request", {
                method: "POST",
                credentials: "include",
                body: submitFormData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.message || "Failed to submit host request");
            }

            toast.success(result.message || "Host request submitted successfully!");
            setTimeout(() => {
                router.push("/dashboard");
                router.refresh();
            }, 1500);
        } catch (error: any) {
            console.error("Error submitting host request:", error);
            toast.error(error.message || "Failed to submit host request. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error("Image size must be less than 5MB");
                return;
            }
            setProfilePhoto(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setProfilePhoto(null);
        setPhotoPreview(userProfile?.profilePhoto || null);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Become a Host</CardTitle>
                <CardDescription>
                    Fill out the form below to request host privileges. An admin will review your request.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <Field
                        label="Name"
                        required={false}
                    >
                        <Input
                            name="name"
                            type="text"
                            placeholder="Your display name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </Field>

                    <Field
                        label="Contact Number"
                        required={false}
                    >
                        <Input
                            name="contactNumber"
                            type="tel"
                            placeholder="Your contact number"
                            value={formData.contactNumber}
                            onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </Field>

                    <Field
                        label="Bio"
                        required={false}
                    >
                        <Textarea
                            name="bio"
                            placeholder="Tell us about yourself and why you want to become a host..."
                            rows={4}
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </Field>

                    <Field
                        label="Location"
                        required={false}
                    >
                        <Input
                            name="location"
                            type="text"
                            placeholder="Your location"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            disabled={isSubmitting}
                        />
                    </Field>

                    <Field
                        label="Profile Photo"
                        required={false}
                    >
                        <div className="space-y-4">
                            {photoPreview && (
                                <div className="relative w-32 h-32 rounded-lg overflow-hidden border">
                                    <Image
                                        src={photoPreview}
                                        alt="Profile preview"
                                        fill
                                        sizes="128px"
                                        className="object-cover"
                                    />
                                    <Button
                                        type="button"
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-1 right-1 h-6 w-6"
                                        onClick={handleRemovePhoto}
                                        disabled={isSubmitting}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <Label
                                    htmlFor="profile-photo"
                                    className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Upload className="h-4 w-4" />
                                    {photoPreview ? "Change Photo" : "Upload Photo"}
                                </Label>
                                <Input
                                    id="profile-photo"
                                    name="file"
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoChange}
                                    disabled={isSubmitting}
                                    className="hidden"
                                />
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Optional. Upload a profile photo (max 5MB). If not provided, your current profile photo will be used.
                            </p>
                        </div>
                    </Field>

                    <div className="flex items-center gap-4 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Submitting...
                                </>
                            ) : (
                                <>
                                    <UserCheck className="mr-2 h-4 w-4" />
                                    Submit Request
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}

