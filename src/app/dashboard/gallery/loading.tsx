import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function GalleryLoading() {
    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-40 mb-2 skeleton-shimmer" />
                    <Skeleton className="h-5 w-48 skeleton-shimmer" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-10 w-24 skeleton-shimmer" />
                    <Skeleton className="h-10 w-10 skeleton-shimmer" />
                </div>
            </div>

            {/* Stats */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-6">
                        <div>
                            <Skeleton className="h-4 w-24 mb-2 skeleton-shimmer" />
                            <Skeleton className="h-8 w-12 skeleton-shimmer" />
                        </div>
                        <div>
                            <Skeleton className="h-4 w-24 mb-2 skeleton-shimmer" />
                            <Skeleton className="h-8 w-20 skeleton-shimmer" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Image Grid Skeleton */}
            <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {Array.from({ length: 18 }).map((_, i) => (
                    <Card key={i} className="overflow-hidden">
                        <div className="aspect-square relative">
                            <Skeleton className="absolute inset-0 skeleton-shimmer" />
                        </div>
                        <CardContent className="p-2">
                            <Skeleton className="h-3 w-16 skeleton-shimmer" />
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
