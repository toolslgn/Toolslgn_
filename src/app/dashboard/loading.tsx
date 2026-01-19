import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardLoading() {
    return (
        <div className="page-container">
            {/* Header Skeleton */}
            <div>
                <Skeleton className="h-9 w-64 mb-2 skeleton-shimmer" />
                <Skeleton className="h-5 w-96 skeleton-shimmer" />
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-3">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <Skeleton className="h-4 w-20 skeleton-shimmer" />
                            <Skeleton className="h-4 w-4 rounded-full skeleton-shimmer" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-8 w-12 mb-2 skeleton-shimmer" />
                            <Skeleton className="h-3 w-32 skeleton-shimmer" />
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Up Next Section Skeleton */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-6 w-24 skeleton-shimmer" />
                        <Skeleton className="h-9 w-32 skeleton-shimmer" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Card key={i} className="overflow-hidden">
                                <div className="flex gap-4 p-4">
                                    {/* Image Skeleton */}
                                    <Skeleton className="w-24 h-24 rounded-lg flex-shrink-0 skeleton-shimmer" />

                                    {/* Content Skeleton */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Skeleton className="h-5 w-20 skeleton-shimmer" />
                                                <Skeleton className="h-4 w-24 skeleton-shimmer" />
                                            </div>
                                            <Skeleton className="h-8 w-24 skeleton-shimmer" />
                                        </div>
                                        <Skeleton className="h-4 w-full skeleton-shimmer" />
                                        <Skeleton className="h-4 w-3/4 skeleton-shimmer" />
                                        <Skeleton className="h-3 w-32 skeleton-shimmer" />
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Quick Actions Skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card key={i}>
                        <CardHeader>
                            <Skeleton className="h-5 w-32 skeleton-shimmer" />
                        </CardHeader>
                        <CardContent>
                            <Skeleton className="h-4 w-full mb-4 skeleton-shimmer" />
                            <Skeleton className="h-10 w-full skeleton-shimmer" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
