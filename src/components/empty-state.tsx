import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    Globe,
    Calendar,
    Image,
    PlusCircle,
    FileText,
    Users,
    LucideIcon,
} from "lucide-react";

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    actionHref?: string;
    onAction?: () => void;
    children?: ReactNode;
}

// Preset configurations for common empty states
const presets = {
    websites: {
        icon: Globe,
        title: "No websites yet",
        description: "Add your first website to start managing your social media presence.",
        actionLabel: "Add Website",
        actionHref: "/dashboard/websites",
    },
    calendar: {
        icon: Calendar,
        title: "No posts scheduled",
        description: "Your calendar is empty. Create a post to see it appear here.",
        actionLabel: "Create Post",
        actionHref: "/dashboard/create",
    },
    gallery: {
        icon: Image,
        title: "No images uploaded",
        description: "Upload images when creating posts to build your media library.",
        actionLabel: "Create Post",
        actionHref: "/dashboard/create",
    },
    posts: {
        icon: FileText,
        title: "No posts yet",
        description: "You haven't created any posts yet. Start scheduling content now.",
        actionLabel: "Create Post",
        actionHref: "/dashboard/create",
    },
    accounts: {
        icon: Users,
        title: "No accounts connected",
        description: "Connect your social media accounts to start publishing.",
        actionLabel: "Connect Account",
        actionHref: "/dashboard/accounts",
    },
};

export function EmptyState({
    icon: Icon = PlusCircle,
    title,
    description,
    actionLabel,
    actionHref,
    onAction,
    children,
}: EmptyStateProps) {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                <Icon className="h-10 w-10 text-muted-foreground" />
            </div>

            {/* Title */}
            <h3 className="mb-2 text-xl font-semibold">{title}</h3>

            {/* Description */}
            <p className="mb-6 max-w-sm text-muted-foreground">{description}</p>

            {/* Action Button */}
            {actionLabel && actionHref && (
                <Button asChild>
                    <Link href={actionHref}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        {actionLabel}
                    </Link>
                </Button>
            )}

            {actionLabel && onAction && (
                <Button onClick={onAction}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {actionLabel}
                </Button>
            )}

            {/* Custom children */}
            {children}
        </div>
    );
}

// Convenience components for common empty states
export function EmptyWebsites() {
    return <EmptyState {...presets.websites} />;
}

export function EmptyCalendar() {
    return <EmptyState {...presets.calendar} />;
}

export function EmptyGallery() {
    return <EmptyState {...presets.gallery} />;
}

export function EmptyPosts() {
    return <EmptyState {...presets.posts} />;
}

export function EmptyAccounts() {
    return <EmptyState {...presets.accounts} />;
}
