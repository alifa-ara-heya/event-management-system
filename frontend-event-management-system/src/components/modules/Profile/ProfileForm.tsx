"use client";

import { updateMyProfile } from "@/services/user/updateMyProfile";
import { UserProfile } from "@/services/user/getMyProfile";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, Loader2, Save } from "lucide-react";
import { useRouter } from "next/navigation";

const INTEREST_OPTIONS = [
    "Music",
    "Sports",
    "Gaming",
    "Art",
    "Photography",
    "Hiking",
    "Food & Dining",
    "Travel",
    "Reading",
    "Movies",
    "Technology",
    "Fitness",
];

interface ProfileFormProps {
    profile: UserProfile;
}

const ProfileForm = ({ profile }: ProfileFormProps) => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(updateMyProfile, null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>(profile.interests || []);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (state) {
            if (!state.success && state.message) {
                toast.error(state.message);
            } else if (state.success) {
                toast.success(state.message || "Profile updated successfully!");
                setPhotoPreview(null);
                router.refresh();
            }
        }
    }, [state, router]);

    const handleInterestChange = (interest: string, checked: boolean) => {
        if (checked) {
            setSelectedInterests([...selectedInterests, interest]);
        } else {
            setSelectedInterests(selectedInterests.filter((i) => i !== interest));
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            console.log("📸 Photo selected:", { name: file.name, size: file.size, type: file.type });
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        const fileInput = document.querySelector('input[type="file"][name="file"]') as HTMLInputElement;
        if (fileInput) {
            fileInput.value = '';
        }
    };

    const displayPhoto = photoPreview || profile.profilePhoto;

    return (
        <form action={formAction}>
            {/* Hidden input for interests array */}
            <input type="hidden" name="interests" value={JSON.stringify(selectedInterests)} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Profile Picture Card */}
                <Card className="lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Profile Picture</CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-col items-center space-y-4">
                        <div className="relative">
                            <Avatar className="h-32 w-32">
                                {displayPhoto ? (
                                    <AvatarImage
                                        src={displayPhoto}
                                        alt={profile.name || "User"}
                                        className="object-cover"
                                    />
                                ) : null}
                                <AvatarFallback className="text-3xl bg-primary/10 text-primary">
                                    {profile.name?.charAt(0).toUpperCase() || "U"}
                                </AvatarFallback>
                            </Avatar>
                            <label
                                htmlFor="file"
                                className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90 transition-colors"
                            >
                                <Camera className="h-4 w-4" />
                                <Input
                                    type="file"
                                    id="file"
                                    name="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handlePhotoChange}
                                    disabled={isPending}
                                />
                            </label>
                        </div>
                        {photoPreview && (
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleRemovePhoto}
                                disabled={isPending}
                            >
                                Remove Photo
                            </Button>
                        )}
                        <div className="text-center">
                            <p className="font-semibold text-lg">{profile.name || "User"}</p>
                            <p className="text-sm text-muted-foreground">{profile.email}</p>
                            <p className="text-xs text-muted-foreground mt-1 capitalize">
                                {profile.role.toLowerCase()}
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Profile Information Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <FieldGroup className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Name */}
                                <Field>
                                    <FieldLabel htmlFor="name">Full Name</FieldLabel>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        defaultValue={profile.name || ""}
                                        placeholder="John Doe"
                                        disabled={isPending}
                                    />
                                </Field>

                                {/* Email (read-only) */}
                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className="bg-muted"
                                    />
                                    <FieldDescription>Email cannot be changed</FieldDescription>
                                </Field>

                                {/* Contact Number (for HOST/ADMIN) */}
                                {(profile.role === "HOST" || profile.role === "ADMIN") && (
                                    <Field>
                                        <FieldLabel htmlFor="contactNumber">Contact Number</FieldLabel>
                                        <Input
                                            id="contactNumber"
                                            name="contactNumber"
                                            type="tel"
                                            defaultValue={profile.contactNumber || ""}
                                            placeholder="+1234567890"
                                            disabled={isPending}
                                        />
                                    </Field>
                                )}

                                {/* Location */}
                                <Field>
                                    <FieldLabel htmlFor="location">Location</FieldLabel>
                                    <Input
                                        id="location"
                                        name="location"
                                        type="text"
                                        defaultValue={profile.location || ""}
                                        placeholder="City, Country"
                                        disabled={isPending}
                                    />
                                </Field>
                            </div>

                            {/* Bio */}
                            <Field>
                                <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                <Textarea
                                    id="bio"
                                    name="bio"
                                    defaultValue={profile.bio || ""}
                                    placeholder="Tell us about yourself..."
                                    rows={4}
                                    disabled={isPending}
                                />
                            </Field>

                            {/* Interests (for USER/HOST) */}
                            {(profile.role === "USER" || profile.role === "HOST") && (
                                <Field>
                                    <FieldLabel>Interests</FieldLabel>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                                        {INTEREST_OPTIONS.map((interest) => (
                                            <div key={interest} className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`interest-${interest}`}
                                                    checked={selectedInterests.includes(interest)}
                                                    onCheckedChange={(checked) =>
                                                        handleInterestChange(interest, checked === true)
                                                    }
                                                    disabled={isPending}
                                                />
                                                <label
                                                    htmlFor={`interest-${interest}`}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                                >
                                                    {interest}
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </Field>
                            )}

                            <div className="flex justify-end pt-4">
                                <Button type="submit" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>
                        </FieldGroup>
                    </CardContent>
                </Card>
            </div>
        </form>
    );
};

export default ProfileForm;

