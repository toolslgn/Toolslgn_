"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
    LayoutDashboard,
    Globe,
    Share2,
    PlusSquare,
    Calendar,
    Settings,
    Menu,
    X,
    LogOut
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/components/bottom-nav";
import { cn } from "@/lib/utils";

const navItems = [
    {
        title: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        description: "Overview and analytics"
    },
    {
        title: "My Websites",
        href: "/dashboard/websites",
        icon: Globe,
        description: "Manage your 20+ websites"
    },
    {
        title: "Social Accounts",
        href: "/dashboard/accounts",
        icon: Share2,
        description: "Connect social platforms"
    },
    {
        title: "Create Post",
        href: "/dashboard/create",
        icon: PlusSquare,
        description: "Create and schedule content"
    },
    {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
        description: "View scheduled posts"
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
        description: "Account preferences"
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    return (
        <div className="flex h-screen bg-background">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar - Hidden on mobile, visible on desktop */}
            <aside className="hidden md:flex fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-border bg-card md:relative md:translate-x-0">
                {/* Logo/Brand */}
                <div className="flex h-16 items-center justify-between px-6">
                    <Link href="/dashboard" className="flex items-center space-x-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                            <span className="text-lg font-bold">T</span>
                        </div>
                        <span className="text-xl font-bold">ToolsLiguns</span>
                    </Link>
                </div>

                <Separator />

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-3 py-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                                    isActive
                                        ? "bg-primary text-primary-foreground"
                                        : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                                )}
                            >
                                <item.icon className="h-5 w-5" />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}
                </nav>

                <Separator />

                {/* User Profile & Logout (Bottom) */}
                <div className="p-4 border-t border-border mt-auto">
                    <div className="flex items-center gap-3 rounded-lg px-3 py-2 mb-2">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src="/avatar-placeholder.png" alt="User" />
                            <AvatarFallback className="bg-primary text-primary-foreground">
                                TL
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col overflow-hidden">
                            <span className="text-sm font-medium truncate">ToolsLiguns Admin</span>
                            <span className="text-xs text-muted-foreground truncate">Online</span>
                        </div>
                    </div>

                    <Button
                        variant="destructive"
                        size="sm"
                        className="w-full justify-start mt-2"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Log Out
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex flex-1 flex-col overflow-hidden">
                {/* Header (Mobile Toggle, etc) - optional if needed, keeping simple for now */}

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 pb-20 md:pb-6">
                    {children}
                </main>
            </div>

            {/* Bottom Navigation - Mobile only */}
            <BottomNav />
        </div>
    );
}
