"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
    label: string;
    href: string;
}

const pathLabels: Record<string, string> = {
    dashboard: "Dashboard",
    websites: "My Websites",
    accounts: "Social Accounts",
    create: "Create Post",
    calendar: "Calendar",
    gallery: "Gallery",
    settings: "Settings",
};

export function Breadcrumbs() {
    const pathname = usePathname();

    // Skip breadcrumbs on dashboard home
    if (pathname === "/dashboard") return null;

    // Build breadcrumb items from path
    const segments = pathname.split("/").filter(Boolean);
    const items: BreadcrumbItem[] = [];

    let currentPath = "";
    segments.forEach((segment, index) => {
        currentPath += `/${segment}`;
        const label = pathLabels[segment] || segment;

        // Skip adding dashboard as it's represented by Home icon
        if (segment !== "dashboard") {
            items.push({
                label,
                href: currentPath,
            });
        }
    });

    return (
        <nav className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
            {/* Home */}
            <Link
                href="/dashboard"
                className="flex items-center gap-1 hover:text-foreground transition-colors"
            >
                <Home className="h-4 w-4" />
                <span className="sr-only">Dashboard</span>
            </Link>

            {items.map((item, index) => (
                <span key={item.href} className="flex items-center gap-1">
                    <ChevronRight className="h-4 w-4" />
                    {index === items.length - 1 ? (
                        // Current page - not clickable
                        <span className="font-medium text-foreground">{item.label}</span>
                    ) : (
                        // Parent page - clickable
                        <Link
                            href={item.href}
                            className="hover:text-foreground transition-colors"
                        >
                            {item.label}
                        </Link>
                    )}
                </span>
            ))}
        </nav>
    );
}
