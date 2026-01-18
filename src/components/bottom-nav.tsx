"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Globe, PlusCircle, Calendar, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    {
        title: "Home",
        href: "/dashboard",
        icon: Home,
    },
    {
        title: "Websites",
        href: "/dashboard/websites",
        icon: Globe,
    },
    {
        title: "Create",
        href: "/dashboard/create",
        icon: PlusCircle,
        isCenter: true,
    },
    {
        title: "Calendar",
        href: "/dashboard/calendar",
        icon: Calendar,
    },
    {
        title: "Settings",
        href: "/dashboard/settings",
        icon: Settings,
    },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-t border-border safe-area-bottom">
            <div className="flex items-center justify-around h-16 px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 flex-1 h-full min-w-[44px] transition-colors",
                                item.isCenter && "relative -mt-6"
                            )}
                        >
                            {item.isCenter ? (
                                // Center "Create" button - large and prominent
                                <div className="flex flex-col items-center">
                                    <div
                                        className={cn(
                                            "flex items-center justify-center w-14 h-14 rounded-full shadow-lg transition-colors",
                                            isActive
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-primary text-primary-foreground"
                                        )}
                                    >
                                        <item.icon className="h-7 w-7" />
                                    </div>
                                    <span className="text-[10px] mt-1 font-medium">
                                        {item.title}
                                    </span>
                                </div>
                            ) : (
                                // Regular nav items
                                <>
                                    <div
                                        className={cn(
                                            "flex items-center justify-center w-11 h-11 rounded-lg transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground"
                                        )}
                                    >
                                        <item.icon className="h-6 w-6" />
                                    </div>
                                    <span
                                        className={cn(
                                            "text-[10px] font-medium",
                                            isActive ? "text-primary" : "text-muted-foreground"
                                        )}
                                    >
                                        {item.title}
                                    </span>
                                </>
                            )}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
