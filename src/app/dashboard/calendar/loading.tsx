import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function CalendarLoading() {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Skeleton className="h-9 w-48 mb-2" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <Skeleton className="h-10 w-32" />
            </div>

            {/* Legend Skeleton */}
            <div className="flex items-center gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-3 w-3 rounded-full" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>

            {/* Calendar Grid Skeleton */}
            <Card>
                <CardContent className="pt-6">
                    <div className="space-y-2">
                        {/* Day Headers */}
                        <div className="grid grid-cols-7 gap-1">
                            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                                <div key={day} className="text-center py-2">
                                    <Skeleton className="h-4 w-8 mx-auto" />
                                </div>
                            ))}
                        </div>

                        {/* Calendar Cells */}
                        {[1, 2, 3, 4, 5].map((week) => (
                            <div key={week} className="grid grid-cols-7 gap-1">
                                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                    <div
                                        key={day}
                                        className="aspect-square p-2 border rounded-md"
                                    >
                                        <Skeleton className="h-4 w-4 mb-2" />
                                        {Math.random() > 0.7 && (
                                            <Skeleton className="h-3 w-full mt-1" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
