"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Dashboard Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            {/* Icon */}
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>

            {/* Title */}
            <h2 className="mb-2 text-2xl font-bold">Something went wrong!</h2>

            {/* Description */}
            <p className="mb-6 max-w-md text-muted-foreground">
                We encountered an error while loading this page. This is usually
                temporary - please try again.
            </p>

            {/* Error Details (Development Only) */}
            {process.env.NODE_ENV === "development" && (
                <div className="mb-6 max-w-md p-4 bg-muted rounded-lg text-left">
                    <p className="text-xs font-mono text-muted-foreground break-all">
                        {error.message}
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className="flex gap-4">
                <Button onClick={reset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
                <Button variant="outline" asChild>
                    <a href="/dashboard">Go to Dashboard</a>
                </Button>
            </div>
        </div>
    );
}
