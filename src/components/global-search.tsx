"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Command } from "cmdk";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import {
    Home,
    Calendar,
    Image,
    Plus,
    Globe,
    Search,
    Sparkles,
    Settings,
    Users,
} from "lucide-react";
import type { Website } from "@/types/database";

interface CommandItem {
    id: string;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    action: () => void;
    category: string;
    keywords?: string[];
}

interface GlobalSearchProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function GlobalSearch({ open, onOpenChange }: GlobalSearchProps) {
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [websites, setWebsites] = useState<Website[]>([]);
    const [commands, setCommands] = useState<CommandItem[]>([]);

    // Fetch websites for dynamic indexing
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

    // Build command index
    useEffect(() => {
        const staticCommands: CommandItem[] = [
            // Navigation
            {
                id: "nav-home",
                label: "Go to Dashboard",
                icon: Home,
                action: () => router.push("/dashboard"),
                category: "Navigation",
                keywords: ["home", "dashboard", "main"],
            },
            {
                id: "nav-calendar",
                label: "Go to Calendar",
                icon: Calendar,
                action: () => router.push("/dashboard/calendar"),
                category: "Navigation",
                keywords: ["schedule", "dates", "calendar"],
            },
            {
                id: "nav-gallery",
                label: "Go to Gallery",
                icon: Image,
                action: () => router.push("/dashboard/gallery"),
                category: "Navigation",
                keywords: ["images", "media", "photos"],
            },
            {
                id: "nav-websites",
                label: "Go to Websites",
                icon: Globe,
                action: () => router.push("/dashboard/websites"),
                category: "Navigation",
                keywords: ["sites", "manage"],
            },
            {
                id: "nav-accounts",
                label: "Go to Social Accounts",
                icon: Users,
                action: () => router.push("/dashboard/accounts"),
                category: "Navigation",
                keywords: ["facebook", "instagram", "connect"],
            },
            {
                id: "nav-settings",
                label: "Go to Settings",
                icon: Settings,
                action: () => router.push("/dashboard/settings"),
                category: "Navigation",
                keywords: ["config", "preferences"],
            },

            // Actions
            {
                id: "action-create",
                label: "Create New Post",
                icon: Plus,
                action: () => router.push("/dashboard/create"),
                category: "Actions",
                keywords: ["new", "schedule", "post"],
            },
        ];

        // Dynamic website commands
        const websiteCommands: CommandItem[] = websites.flatMap((website) => [
            {
                id: `website-post-${website.id}`,
                label: `Post for ${website.name}`,
                icon: Sparkles,
                action: () => router.push(`/dashboard/create?website=${website.id}`),
                category: "Websites",
                keywords: [website.name.toLowerCase(), website.url, "post", "create"],
            },
        ]);

        setCommands([...staticCommands, ...websiteCommands]);
    }, [websites, router]);

    // Handle command selection
    const handleSelect = useCallback((commandId: string) => {
        const command = commands.find((cmd) => cmd.id === commandId);
        if (command) {
            command.action();
            onOpenChange(false);
            setSearch("");
        }
    }, [commands, onOpenChange]);

    // Group commands by category
    const groupedCommands = commands.reduce((acc, cmd) => {
        if (!acc[cmd.category]) {
            acc[cmd.category] = [];
        }
        acc[cmd.category].push(cmd);
        return acc;
    }, {} as Record<string, CommandItem[]>);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="p-0 gap-0 max-w-2xl">
                <Command className="rounded-lg border-0 shadow-none">
                    <div className="flex items-center border-b px-3">
                        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                        <Command.Input
                            value={search}
                            onValueChange={setSearch}
                            placeholder="Type a command or search..."
                            className="flex h-12 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        />
                    </div>

                    <Command.List className="max-h-[400px] overflow-y-auto p-2">
                        <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                            No results found.
                        </Command.Empty>

                        {Object.entries(groupedCommands).map(([category, items]) => (
                            <Command.Group
                                key={category}
                                heading={category}
                                className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground"
                            >
                                {items.map((command) => {
                                    const Icon = command.icon;
                                    return (
                                        <Command.Item
                                            key={command.id}
                                            value={`${command.label} ${command.keywords?.join(" ") || ""}`}
                                            onSelect={() => handleSelect(command.id)}
                                            className="flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer hover:bg-accent aria-selected:bg-accent"
                                        >
                                            <Icon className="h-4 w-4 text-muted-foreground" />
                                            <span>{command.label}</span>
                                        </Command.Item>
                                    );
                                })}
                            </Command.Group>
                        ))}
                    </Command.List>

                    {/* Footer hint */}
                    <div className="border-t px-3 py-2 text-xs text-muted-foreground">
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">↵</span>
                        </kbd>{" "}
                        to select •{" "}
                        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                            <span className="text-xs">ESC</span>
                        </kbd>{" "}
                        to close
                    </div>
                </Command>
            </DialogContent>
        </Dialog>
    );
}

// Hook for keyboard shortcut
export function useCommandPalette(onOpen: () => void) {
    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onOpen();
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, [onOpen]);
}
