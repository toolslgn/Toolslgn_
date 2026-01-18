"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Home } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error("Websites Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10">
                <AlertCircle className="h-10 w-10 text-destructive" />
            </div>

            <h2 className="mb-2 text-2xl font-bold">Failed to Load Websites</h2>

            <p className="mb-6 max-w-md text-muted-foreground">
                We couldn't load your websites. Please try again.
            </p>

            <div className="flex gap-4">
                <Button onClick={reset}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Try Again
                </Button>
                <Button variant="outline" asChild>
                    <a href="/dashboard">
                        <Home className="mr-2 h-4 w-4" />
                        Dashboard
                    </a>
                </Button>
            </div>
        </div>
    );
}
