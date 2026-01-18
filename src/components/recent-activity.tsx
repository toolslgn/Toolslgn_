"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ActivityLog {
    id: string;
    status: "PUBLISHED" | "FAILED" | "QUEUED";
    platform: string;
    account_name: string;
    scheduled_at: string;
    published_at?: string;
    error_log?: string;
    retry_count: number;
    platform_post_id?: string;
}

export function RecentActivity() {
    const [logs, setLogs] = useState<ActivityLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();

        // Refresh every 30 seconds
        const interval = setInterval(fetchLogs, 30000);
        return () => clearInterval(interval);
    }, []);

    async function fetchLogs() {
        const supabase = createClient();

        const { data, error } = await supabase
            .from("post_schedules")
            .select(
                `
        id,
        status,
        scheduled_at,
        published_at,
        error_log,
        retry_count,
        platform_post_id,
        accounts (
          platform,
          account_name
        )
      `
            )
            .order("updated_at", { ascending: false })
            .limit(5);

        if (!error && data) {
            const formattedLogs = data.map((item: any) => ({
                id: item.id,
                status: item.status,
                platform: item.accounts?.platform || "unknown",
                account_name: item.accounts?.account_name || "Unknown Account",
                scheduled_at: item.scheduled_at,
                published_at: item.published_at,
                error_log: item.error_log,
                retry_count: item.retry_count || 0,
                platform_post_id: item.platform_post_id,
            }));
            setLogs(formattedLogs);
        }

        setLoading(false);
    }

    const getStatusConfig = (log: ActivityLog) => {
        if (log.status === "PUBLISHED") {
            return {
                icon: CheckCircle2,
                color: "text-green-500",
                bgColor: "bg-green-500/10",
                label: "Published",
                badgeVariant: "default" as const,
            };
        } else if (log.status === "FAILED") {
            return {
                icon: XCircle,
                color: "text-red-500",
                bgColor: "bg-red-500/10",
                label: "Failed",
                badgeVariant: "destructive" as const,
            };
        } else if (log.retry_count > 0) {
            return {
                icon: AlertCircle,
                color: "text-yellow-500",
                bgColor: "bg-yellow-500/10",
                label: `Retrying (${log.retry_count}/3)`,
                badgeVariant: "secondary" as const,
            };
        } else {
            return {
                icon: Clock,
                color: "text-blue-500",
                bgColor: "bg-blue-500/10",
                label: "Queued",
                badgeVariant: "outline" as const,
            };
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
                {loading ? (
                    <div className="text-sm text-muted-foreground">Loading...</div>
                ) : logs.length === 0 ? (
                    <div className="text-sm text-muted-foreground">
                        No recent activity
                    </div>
                ) : (
                    <div className="space-y-3">
                        {logs.map((log) => {
                            const config = getStatusConfig(log);
                            const Icon = config.icon;

                            return (
                                <div
                                    key={log.id}
                                    className="flex items-start gap-3 rounded-lg border border-border p-3 hover:bg-accent/50 transition-colors"
                                >
                                    {/* Status Icon */}
                                    <div className={`rounded-full p-2 ${config.bgColor}`}>
                                        <Icon className={`h-4 w-4 ${config.color}`} />
                                    </div>

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-sm font-medium capitalize">
                                                {log.platform}
                                            </span>
                                            <Badge variant={config.badgeVariant} className="text-xs">
                                                {config.label}
                                            </Badge>
                                        </div>

                                        <p className="text-sm text-muted-foreground truncate">
                                            {log.account_name}
                                        </p>

                                        {log.error_log && (
                                            <p className="text-xs text-red-500 mt-1 line-clamp-2">
                                                {log.error_log}
                                            </p>
                                        )}

                                        <p className="text-xs text-muted-foreground mt-1">
                                            {log.published_at
                                                ? `Published ${formatDistanceToNow(new Date(log.published_at), { addSuffix: true })}`
                                                : `Scheduled ${formatDistanceToNow(new Date(log.scheduled_at), { addSuffix: true })}`}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
