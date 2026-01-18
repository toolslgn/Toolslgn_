"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";

export default function UnauthorizedPage() {
    const router = useRouter();
    const supabase = createClient();

    useEffect(() => {
        // Sign out user on mount
        supabase.auth.signOut();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <div className="w-full max-w-md text-center space-y-8">
                {/* Icon */}
                <div className="mx-auto h-20 w-20 flex items-center justify-center rounded-full bg-destructive/10 text-destructive">
                    <ShieldAlert className="h-10 w-10" />
                </div>

                {/* Message */}
                <div className="space-y-4">
                    <h1 className="text-3xl font-bold tracking-tight">Access Denied</h1>
                    <p className="text-muted-foreground text-lg">
                        Your email address is not authorized to access this application.
                    </p>
                    <p className="text-sm text-muted-foreground">
                        This is a private tool with restricted access. Please contact the administrator if you believe this is an error.
                    </p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                    <Button
                        onClick={() => router.push("/login")}
                        className="w-full"
                        size="lg"
                    >
                        Back to Login
                    </Button>
                </div>

                {/* Footer */}
                <p className="text-xs text-muted-foreground">
                    Protected by email whitelist authentication
                </p>
            </div>
        </div>
    );
}
