"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Plus, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createWebsite } from "./actions";

// Form validation schema
const websiteFormSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    url: z.string().url("Please enter a valid URL"),
    description: z.string().max(500, "Description must be less than 500 characters").optional(),
});

type WebsiteFormValues = z.infer<typeof websiteFormSchema>;

export function AddWebsiteDialog() {
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const form = useForm<WebsiteFormValues>({
        resolver: zodResolver(websiteFormSchema),
        defaultValues: {
            name: "",
            url: "",
            description: "",
        },
    });

    async function onSubmit(values: WebsiteFormValues) {
        setIsSubmitting(true);

        const formData = new FormData();
        formData.append("name", values.name);
        formData.append("url", values.url);
        formData.append("description", values.description || "");

        const result = await createWebsite(formData);

        setIsSubmitting(false);

        if (result.error) {
            // Handle error (you could add toast notification here)
            console.error(result.error);
            return;
        }

        // Success - close dialog and reset form
        setOpen(false);
        form.reset();
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Website
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add New Website</DialogTitle>
                    <DialogDescription>
                        Add a website to manage through your social media campaigns.
                    </DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Beras Polos" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        The name of your website or business.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Website URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="url"
                                            placeholder="https://beraspolos.online"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        The full URL of your website.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description (Optional)</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            placeholder="Premium organic rice delivery service"
                                            className="resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        A brief description of your website.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Button>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Add Website
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
