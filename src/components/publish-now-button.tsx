"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";
import { toast } from "sonner";
import { publishNow } from "@/app/dashboard/actions";

interface PublishNowButtonProps {
    scheduleId: string;
}

export function PublishNowButton({ scheduleId }: PublishNowButtonProps) {
    const [loading, setLoading] = useState(false);

    const handlePublish = async () => {
        if (!confirm("Publish this post immediately? This cannot be undone.")) {
            return;
        }

        setLoading(true);

        try {
            const result = await publishNow(scheduleId);

            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success(result.message || "Post published!");
            }
        } catch (error) {
            console.error("Publish error:", error);
            toast.error("Failed to publish post");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            size="sm"
            onClick={handlePublish}
            disabled={loading}
            className="flex-shrink-0"
        >
            <Zap className="h-3 w-3 mr-1" />
            {loading ? "Publishing..." : "Post Now"}
        </Button>
    );
}
