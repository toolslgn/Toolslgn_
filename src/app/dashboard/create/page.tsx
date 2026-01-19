"use client";

import { useState, useRef, ChangeEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Upload, X, Calendar as CalendarIcon, Clock, Check, ChevronsUpDown, Wand2 } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command";
import { PhoneMockup } from "@/components/phone-mockup";
import { GallerySelector } from "@/components/gallery-selector";
import { toast } from "sonner";
import { schedulePost } from "./actions";
import type { Website, Account } from "@/types/database";
import { cn } from "@/lib/utils";
import { isHoliday } from "@/lib/holidays-2026";
import { AlertCircle } from "lucide-react";

// Mock accounts
const mockAccounts: Account[] = [
    {
        id: "mock-fb-1",
        user_id: "mock",
        platform: "facebook",
        account_name: "@LigunsEntertainment",
        account_id: "fb_123",
        access_token: "mock",
        refresh_token: null,
        token_expires_at: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
    {
        id: "mock-ig-1",
        user_id: "mock",
        platform: "instagram",
        account_name: "@ligunsofficial",
        account_id: "ig_456",
        access_token: "mock",
        refresh_token: null,
        token_expires_at: null,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
    },
];

export default function CreatePostPage() {
    const router = useRouter();
    const [websites, setWebsites] = useState<Website[]>([]);
    const [selectedWebsiteIds, setSelectedWebsiteIds] = useState<string[]>([]);
    const [websitesOpen, setWebsitesOpen] = useState(false);
    const [caption, setCaption] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>("");
    const [galleryOpen, setGalleryOpen] = useState(false);
    const [date, setDate] = useState<Date>();
    const [time, setTime] = useState<string>("12:00");
    const [selectedAccounts, setSelectedAccounts] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isGeneratingAI, setIsGeneratingAI] = useState(false);
    const [isEvergreen, setIsEvergreen] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Field-level error state
    const [errors, setErrors] = useState<{
        websites?: string;
        caption?: string;
        date?: string;
        accounts?: string;
    }>({});

    // Parse URL params for pre-filled data (holiday posts)
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const dateParam = params.get("date");
        const captionParam = params.get("caption");
        const holidayParam = params.get("holiday");

        if (dateParam) {
            setDate(new Date(dateParam));
        }

        if (captionParam) {
            setCaption(decodeURIComponent(captionParam));
        }

        if (holidayParam) {
            // Show success toast for holiday post
            toast.success(`Creating post for ${decodeURIComponent(holidayParam)}!`, {
                description: "Caption pre-filled with greeting template",
            });
        }
    }, []);

    // Fetch websites
    useEffect(() => {
        async function fetchWebsites() {
            const supabase = createClient();
            const { data } = await supabase
                .from("websites")
                .select("*")
                .order("name", { ascending: true });

            if (data) {
                setWebsites(data);
            }
        }
        fetchWebsites();
    }, []);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageRemove = () => {
        setImageFile(null);
        setImagePreview("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleWebsiteToggle = (websiteId: string) => {
        // Clear website error when user selects
        if (errors.websites) {
            setErrors(prev => ({ ...prev, websites: undefined }));
        }
        setSelectedWebsiteIds((prev) =>
            prev.includes(websiteId)
                ? prev.filter((id) => id !== websiteId)
                : [...prev, websiteId]
        );
    };

    const handleAccountToggle = (accountId: string) => {
        setSelectedAccounts((prev) =>
            prev.includes(accountId)
                ? prev.filter((id) => id !== accountId)
                : [...prev, accountId]
        );
    };

    const handleSchedulePost = async () => {
        // Clear previous errors
        setErrors({});

        // Validation with field-level errors
        const newErrors: typeof errors = {};

        if (selectedWebsiteIds.length === 0) {
            newErrors.websites = "Please select at least one website";
            toast.error("Please select at least one website");
        }
        if (!caption.trim()) {
            newErrors.caption = "Caption is required";
            toast.error("Please enter a caption");
        }
        if (!date) {
            newErrors.date = "Please select a schedule date";
            toast.error("Please select a date");
        }
        if (selectedAccounts.length === 0) {
            newErrors.accounts = "Please select at least one account";
            toast.error("Please select at least one account");
        }

        // If there are errors, set them and return
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Combine date and time
        const [hours, minutes] = time.split(":").map(Number);
        const scheduledDateTime = new Date(date!);
        scheduledDateTime.setHours(hours, minutes, 0, 0);

        if (scheduledDateTime < new Date()) {
            toast.error("Scheduled time cannot be in the past");
            setErrors({ date: "Scheduled time cannot be in the past" });
            return;
        }

        setIsSubmitting(true);

        try {
            const result = await schedulePost({
                websiteIds: selectedWebsiteIds,
                caption,
                imageFile: imageFile || undefined,
                scheduledDate: scheduledDateTime,
                accountIds: selectedAccounts,
                isEvergreen,
            });

            if (result.error) {
                toast.error(result.error);
                setIsSubmitting(false);
                return;
            }

            if (result.warnings && result.warnings.length > 0) {
                toast.warning(result.message || "Some posts failed", {
                    description: result.warnings.join("\n"),
                });
            } else {
                toast.success(result.message || "Posts scheduled successfully!");
            }

            setTimeout(() => {
                router.push("/dashboard/calendar");
            }, 1500);
        } catch (error) {
            console.error("Schedule post error:", error);
            toast.error("Failed to schedule posts");
            setIsSubmitting(false);
        }
    };

    const selectedWebsiteNames = websites
        .filter((w) => selectedWebsiteIds.includes(w.id))
        .map((w) => w.name)
        .join(", ");

    const maxChars = 2200;
    const charCount = caption.length;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Bulk Clone Post</h2>
                <p className="text-muted-foreground mt-2">
                    Schedule the same content across multiple websites with unique variations.
                </p>
            </div>

            {/* Split View Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Side - Form */}
                <div className="space-y-6">
                    <div className="rounded-lg border border-border bg-card p-6 space-y-6">
                        {/* Multi-Website Selector */}
                        <div className="space-y-2">
                            <Label>Select Websites * (Bulk Clone)</Label>
                            <Popover open={websitesOpen} onOpenChange={setWebsitesOpen}>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="outline"
                                        role="combobox"
                                        aria-expanded={websitesOpen}
                                        className="w-full justify-between"
                                    >
                                        {selectedWebsiteIds.length === 0
                                            ? "Select websites..."
                                            : `${selectedWebsiteIds.length} website(s) selected`}
                                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-full p-0">
                                    <Command>
                                        <CommandInput placeholder="Search websites..." />
                                        <CommandEmpty>No websites found.</CommandEmpty>
                                        <CommandGroup>
                                            {websites.map((website) => (
                                                <CommandItem
                                                    key={website.id}
                                                    onSelect={() => handleWebsiteToggle(website.id)}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedWebsiteIds.includes(website.id)
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                    {website.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            {selectedWebsiteIds.length > 0 && (
                                <p className="text-xs text-muted-foreground">
                                    Selected: {selectedWebsiteNames}
                                </p>
                            )}
                            {errors.websites && (
                                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.websites}
                                </p>
                            )}
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-2">
                            <Label>Post Image</Label>
                            {imagePreview ? (
                                <div className="relative rounded-lg overflow-hidden border border-border">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="w-full h-64 object-cover"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        className="absolute top-2 right-2"
                                        onClick={handleImageRemove}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                </div>
                            ) : (
                                <div
                                    className="relative border-2 border-dashed border-border rounded-lg p-8 hover:border-primary transition-colors cursor-pointer"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <div className="text-center">
                                        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <p className="text-sm font-medium mb-1">
                                            Click to upload or drag and drop
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Caption with Spintax Info */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="caption">Caption * (Spintax Supported)</Label>
                                <Button
                                    type="button"
                                    size="sm"
                                    onClick={async () => {
                                        if (selectedWebsiteIds.length === 0) {
                                            toast.error("Select a website first to give AI some context!");
                                            return;
                                        }

                                        if (!caption.trim()) {
                                            toast.error("Please type a short topic first (e.g., 'Promo Merdeka')");
                                            return;
                                        }

                                        setIsGeneratingAI(true);
                                        try {
                                            // Get context from selected websites
                                            const context = selectedWebsiteIds.map(id =>
                                                websites.find(w => w.id === id)?.name
                                            ).filter(Boolean).join(", ");

                                            const prompt = `Improve and expand this caption: "${caption}"`;

                                            const response = await fetch("/api/ai/generate", {
                                                method: "POST",
                                                headers: { "Content-Type": "application/json" },
                                                body: JSON.stringify({
                                                    prompt,
                                                    websiteContext: context
                                                }),
                                            });

                                            const data = await response.json();

                                            if (!response.ok) {
                                                throw new Error(data.error || "Failed to generate");
                                            }

                                            setCaption(data.caption);
                                            toast.success("✨ Caption generated by AI!");
                                        } catch (error) {
                                            console.error(error);
                                            // Fallback error toast
                                            toast.error("Failed to generate caption. Please check your API key.");
                                        } finally {
                                            setIsGeneratingAI(false);
                                        }
                                    }}
                                    disabled={isGeneratingAI}
                                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white hover:from-purple-600 hover:to-pink-700 border-0"
                                >
                                    {isGeneratingAI ? (
                                        <>
                                            <span className="animate-spin mr-2">💫</span>
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <Wand2 className="h-3 w-3 mr-1" />
                                            ✨ AI Magic
                                        </>
                                    )}
                                </Button>
                            </div>
                            <div className="relative">
                                <Textarea
                                    id="caption"
                                    placeholder="{Great|Awesome|Amazing} news! Check out our {new|latest} product! Use {brackets|curly braces} for variations."
                                    value={caption}
                                    onChange={(e) => {
                                        setCaption(e.target.value);
                                        // Clear caption error when user types
                                        if (errors.caption) {
                                            setErrors(prev => ({ ...prev, caption: undefined }));
                                        }
                                    }}
                                    rows={6}
                                    className="resize-none"
                                />
                                <div className="flex justify-end mt-1">
                                    <span
                                        className={`text-xs ${charCount > maxChars
                                            ? "text-destructive"
                                            : "text-muted-foreground"
                                            }`}
                                    >
                                        {charCount} / {maxChars}
                                    </span>
                                </div>
                            </div>
                            {errors.caption && (
                                <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                                    <AlertCircle className="h-3 w-3" />
                                    {errors.caption}
                                </p>
                            )}
                            <p className="text-xs text-muted-foreground">
                                💡 Use spintax {"{word1|word2}"} to create unique variations for each website
                            </p>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Schedule Date *</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !date && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {date ? format(date, "PPP") : "Pick a date"}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={(newDate) => {
                                                setDate(newDate);
                                                // Clear date error when user selects
                                                if (errors.date) {
                                                    setErrors(prev => ({ ...prev, date: undefined }));
                                                }
                                            }}
                                            disabled={(date) =>
                                                date < new Date(new Date().setHours(0, 0, 0, 0))
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                {errors.date && (
                                    <p className="text-sm text-destructive mt-1 flex items-center gap-1">
                                        <AlertCircle className="h-3 w-3" />
                                        {errors.date}
                                    </p>
                                )}

                                {/* Holiday Warning */}
                                {date && (() => {
                                    const holiday = isHoliday(date);
                                    if (holiday) {
                                        return (
                                            <div className="rounded-lg border border-orange-500/50 bg-orange-50 dark:bg-orange-950/20 p-4 flex gap-3 text-orange-900 dark:text-orange-100">
                                                <AlertCircle className="h-5 w-5 text-orange-600 shrink-0" />
                                                <div className="text-sm">
                                                    <strong>Heads up!</strong> This date is{" "}
                                                    <strong>{holiday.name}</strong>. Ensure your content is
                                                    relevant.
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="time">Schedule Time *</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        id="time"
                                        type="time"
                                        value={time}
                                        onChange={(e) => setTime(e.target.value)}
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                            </div>
                        </div>


                        {/* Evergreen Option */}
                        <div className="flex items-center space-x-2 rounded-lg border border-border p-4 bg-secondary/10">
                            <Checkbox
                                id="evergreen"
                                checked={isEvergreen}
                                onCheckedChange={(checked) => setIsEvergreen(checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                                <label
                                    htmlFor="evergreen"
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                >
                                    ♻️ Evergreen Content (Auto-Recycle)
                                </label>
                                <p className="text-xs text-muted-foreground">
                                    Check this if the content is timeless (e.g., General Tips, Brand Awareness). The system may repost this automatically if your schedule is empty.
                                </p>
                            </div>
                        </div>

                        {/* Account Selection */}
                        <div className="space-y-2">
                            <Label>Post to Accounts *</Label>
                            <div className="rounded-lg border border-border p-4 space-y-3">
                                {mockAccounts.map((account) => (
                                    <div key={account.id} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={account.id}
                                            checked={selectedAccounts.includes(account.id)}
                                            onCheckedChange={() => {
                                                handleAccountToggle(account.id);
                                                // Clear account error when user selects
                                                if (errors.accounts) {
                                                    setErrors(prev => ({ ...prev, accounts: undefined }));
                                                }
                                            }}
                                        />
                                        <label
                                            htmlFor={account.id}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1"
                                        >
                                            <span className="capitalize">{account.platform}</span> -{" "}
                                            {account.account_name}
                                        </label>
                                    </div>
                                ))}
                                {selectedAccounts.length > 0 && (
                                    <p className="text-xs text-muted-foreground mt-2">
                                        {selectedAccounts.length} account(s) selected
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-border">
                            <Button
                                className="flex-1"
                                onClick={handleSchedulePost}
                                disabled={
                                    isSubmitting ||
                                    selectedWebsiteIds.length === 0 ||
                                    !caption ||
                                    !date ||
                                    selectedAccounts.length === 0
                                }
                            >
                                {isSubmitting
                                    ? "Scheduling..."
                                    : `Schedule to ${selectedWebsiteIds.length} Website(s)`}
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Right Side - Preview */}
                <div className="lg:sticky lg:top-6 lg:h-fit">
                    <PhoneMockup
                        websiteName={
                            selectedWebsiteIds.length > 0
                                ? `${selectedWebsiteIds.length} websites selected`
                                : undefined
                        }
                        caption={caption}
                        imageUrl={imagePreview}
                    />
                </div>
            </div>
        </div>
    );
}
