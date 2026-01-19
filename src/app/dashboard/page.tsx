import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Clock,
    CheckCircle2,
    XCircle,
    Calendar,
    AlertTriangle,
    Zap,
} from "lucide-react";
import { formatWIB } from "@/lib/timezone";
import Link from "next/link";
import { PublishNowButton } from "@/components/publish-now-button";

export default async function DashboardPage() {
    const supabase = await createClient();

    // Fetch stats
    const now = new Date().toISOString();
    const monthStart = new Date();
    monthStart.setDate(1);
    monthStart.setHours(0, 0, 0, 0);

    const [scheduledResult, publishedResult, failedResult] = await Promise.all([
        supabase
            .from("post_schedules")
            .select("id", { count: "exact", head: true })
            .eq("status", "QUEUED"),
        supabase
            .from("post_schedules")
            .select("id", { count: "exact", head: true })
            .eq("status", "PUBLISHED")
            .gte("published_at", monthStart.toISOString()),
        supabase
            .from("post_schedules")
            .select("id", { count: "exact", head: true })
            .eq("status", "FAILED"),
    ]);

    const stats = {
        scheduled: scheduledResult.count || 0,
        published: publishedResult.count || 0,
        failed: failedResult.count || 0,
    };

    // Fetch upcoming posts
    const { data: upcomingPosts } = await supabase
        .from("post_schedules")
        .select(
            `
      id,
      scheduled_at,
      posts (
        caption,
        image_url
      ),
      accounts (
        platform,
        account_name
      )
    `
        )
        .eq("status", "QUEUED")
        .gte("scheduled_at", now)
        .order("scheduled_at", { ascending: true })
        .limit(3);

    // Check token health
    const sevenDaysFromNow = new Date();
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

    const { data: expiringAccounts } = await supabase
        .from("accounts")
        .select("platform, account_name, token_expires_at")
        .not("token_expires_at", "is", null)
        .lte("token_expires_at", sevenDaysFromNow.toISOString());

    const hasExpiringTokens = expiringAccounts && expiringAccounts.length > 0;

    return (
        <div className="page-container">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard Cockpit</h2>
                <p className="text-muted-foreground mt-2">
                    Monitor and manage your social media automation
                </p>
            </div>

            {/* Token Health Alert */}
            {hasExpiringTokens && (
                <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Re-connection Required</AlertTitle>
                    <AlertDescription>
                        {expiringAccounts.length} account(s) have tokens expiring within 7
                        days. Please reconnect to avoid publishing failures.
                        <ul className="mt-2 list-disc list-inside">
                            {expiringAccounts.map((account, i) => (
                                <li key={i} className="text-sm">
                                    <span className="capitalize font-medium">
                                        {account.platform}
                                    </span>
                                    : {account.account_name} (
                                    {account.token_expires_at &&
                                        formatWIB(account.token_expires_at, true)}
                                    )
                                </li>
                            ))}
                        </ul>
                        <Button asChild variant="outline" size="sm" className="mt-3">
                            <Link href="/dashboard/accounts">Manage Accounts</Link>
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Scheduled</CardTitle>
                        <Clock className="h-4 w-4 text-amber-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.scheduled}</div>
                        <p className="text-xs text-muted-foreground">
                            Posts queued for publishing
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Published (This Month)
                        </CardTitle>
                        <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.published}</div>
                        <p className="text-xs text-muted-foreground">
                            Successfully posted in {new Date().toLocaleDateString('en-US', { month: 'long' })}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Failed</CardTitle>
                        <XCircle className="h-4 w-4 text-rose-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.failed}</div>
                        <p className="text-xs text-muted-foreground">
                            Posts requiring attention
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Up Next Section */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Up Next</CardTitle>
                        <Button asChild variant="outline" size="sm">
                            <Link href="/dashboard/calendar">
                                <Calendar className="h-4 w-4 mr-2" />
                                View Calendar
                            </Link>
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {!upcomingPosts || upcomingPosts.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Clock className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p className="mb-2">No upcoming posts scheduled</p>
                            <Button asChild>
                                <Link href="/dashboard/create">Schedule a Post</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {upcomingPosts.map((schedule: any) => {
                                const post = Array.isArray(schedule.posts)
                                    ? schedule.posts[0]
                                    : schedule.posts;
                                const account = Array.isArray(schedule.accounts)
                                    ? schedule.accounts[0]
                                    : schedule.accounts;

                                return (
                                    <Card key={schedule.id} className="overflow-hidden">
                                        <div className="flex gap-4 p-4">
                                            {/* Image Preview */}
                                            {post?.image_url && (
                                                <div className="w-24 h-24 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                    <img
                                                        src={post.image_url}
                                                        alt="Post preview"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2 mb-2">
                                                    <div className="flex items-center gap-2">
                                                        <Badge variant="secondary" className="capitalize">
                                                            {account?.platform || "Unknown"}
                                                        </Badge>
                                                        <span className="text-sm text-muted-foreground">
                                                            {account?.account_name}
                                                        </span>
                                                    </div>
                                                    <PublishNowButton scheduleId={schedule.id} />
                                                </div>

                                                <p className="text-sm line-clamp-2 mb-2">
                                                    {post?.caption}
                                                </p>

                                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                                    <Clock className="h-3 w-3" />
                                                    <span>
                                                        {formatWIB(schedule.scheduled_at, true)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-2">
                <Card className="border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">Create New Post</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Schedule content across multiple platforms with unique variations
                        </p>
                        <Button asChild className="w-full">
                            <Link href="/dashboard/create">
                                <Zap className="h-4 w-4 mr-2" />
                                Create Post
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card className="border-primary/20 hover:border-primary/40 transition-all duration-200 hover:shadow-lg">
                    <CardHeader>
                        <CardTitle className="text-lg">View All Schedules</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">
                            Browse your content calendar and manage all scheduled posts
                        </p>
                        <Button asChild variant="outline" className="w-full">
                            <Link href="/dashboard/calendar">
                                <Calendar className="h-4 w-4 mr-2" />
                                Open Calendar
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
