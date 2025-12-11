"use client";

import { registerUser } from "@/services/auth/registerUser";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";
import InputFieldError from "@/components/shared/InputFieldError";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, Upload, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

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

const RegisterForm = () => {
    const router = useRouter();
    const [state, formAction, isPending] = useActionState(registerUser, null);
    const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);

    useEffect(() => {
        if (state) {
            if (!state.success && state.message) {
                toast.error(state.message);
            } else if (state.success) {
                // Show success toast first
                toast.success(state.message || "Account created successfully! Redirecting to login...");
                // Then redirect after a short delay to allow toast to be visible
                if (state.redirectTo) {
                    setTimeout(() => {
                        router.push(state.redirectTo);
                    }, 2000); // 2 second delay to show toast
                }
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
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRemovePhoto = () => {
        setPhotoPreview(null);
        // Reset file input
        const fileInputs = document.querySelectorAll('input[type="file"][name="file"]') as NodeListOf<HTMLInputElement>;
        fileInputs.forEach(input => {
            input.value = '';
        });
    };

    return (
        <form action={formAction}>
            {/* Hidden input for interests array */}
            <input type="hidden" name="interests" value={JSON.stringify(selectedInterests)} />
            <FieldGroup>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Name */}
                    <Field>
                        <FieldLabel htmlFor="name">Full Name</FieldLabel>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="John Doe"
                            required
                        />
                        <InputFieldError field="name" state={state} />
                    </Field>

                    {/* Email */}
                    <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="john@example.com"
                            required
                        />
                        <InputFieldError field="email" state={state} />
                    </Field>

                    {/* Password */}
                    <Field>
                        <FieldLabel htmlFor="password">Password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <InputFieldError field="password" state={state} />
                    </Field>

                    {/* Confirm Password */}
                    <Field>
                        <FieldLabel htmlFor="confirmPassword">Confirm Password</FieldLabel>
                        <div className="relative">
                            <Input
                                id="confirmPassword"
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                required
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4" />
                                ) : (
                                    <Eye className="h-4 w-4" />
                                )}
                            </button>
                        </div>
                        <InputFieldError field="confirmPassword" state={state} />
                    </Field>

                    {/* Bio */}
                    <Field className="md:col-span-2">
                        <FieldLabel htmlFor="bio">Bio (Optional)</FieldLabel>
                        <Input
                            id="bio"
                            name="bio"
                            type="text"
                            placeholder="Tell us about yourself..."
                        />
                        <InputFieldError field="bio" state={state} />
                    </Field>

                    {/* Location */}
                    <Field className="md:col-span-2">
                        <FieldLabel htmlFor="location">Location (Optional)</FieldLabel>
                        <Input
                            id="location"
                            name="location"
                            type="text"
                            placeholder="City, Country"
                        />
                        <InputFieldError field="location" state={state} />
                    </Field>

                    {/* Profile Photo */}
                    <Field className="md:col-span-2">
                        <FieldLabel htmlFor="file">Profile Photo (Optional)</FieldLabel>
                        <FieldDescription className="mb-3">
                            Upload a profile photo to help others recognize you
                        </FieldDescription>
                        {/* Single file input that persists */}
                        <input
                            type="file"
                            id="file"
                            name="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                        />

                        {photoPreview ? (
                            <div className="relative inline-block">
                                <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-border">
                                    <Image
                                        src={photoPreview}
                                        alt="Profile preview"
                                        fill
                                        sizes="128px"
                                        className="object-cover"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    className="absolute -top-2 -right-2 rounded-full bg-destructive text-destructive-foreground p-1 hover:bg-destructive/90 transition-colors"
                                    aria-label="Remove photo"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <label
                                    htmlFor="file"
                                    className="absolute inset-0 cursor-pointer rounded-full opacity-0"
                                    aria-label="Change photo"
                                />
                            </div>
                        ) : (
                            <div>
                                <label
                                    htmlFor="file"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                        <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                                        <p className="mb-2 text-sm text-muted-foreground">
                                            <span className="font-semibold">Click to upload</span> or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                </label>
                            </div>
                        )}
                        <InputFieldError field="file" state={state} />
                    </Field>

                    {/* Interests */}
                    <Field className="md:col-span-2">
                        <FieldLabel>Interests (Optional)</FieldLabel>
                        <FieldDescription className="mb-3">
                            Select your interests to help us match you with like-minded people
                        </FieldDescription>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {INTEREST_OPTIONS.map((interest) => (
                                <div key={interest} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={`interest-${interest}`}
                                        checked={selectedInterests.includes(interest)}
                                        onCheckedChange={(checked) =>
                                            handleInterestChange(interest, checked === true)
                                        }
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
                        <InputFieldError field="interests" state={state} />
                    </Field>
                </div>

                <FieldGroup className="mt-4">
                    <Field>
                        <Button type="submit" disabled={isPending} className="w-full">
                            {isPending ? "Creating Account..." : "Create Account"}
                        </Button>

                        <FieldDescription className="px-6 text-center mt-4">
                            Already have an account?{" "}
                            <Link href="/login" className="text-primary hover:underline font-medium">
                                Sign in
                            </Link>
                        </FieldDescription>
                    </Field>
                </FieldGroup>
            </FieldGroup>
        </form>
    );
};

export default RegisterForm;

