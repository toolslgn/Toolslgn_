import { Heart, MessageCircle, Send, Bookmark } from "lucide-react";
import { Card } from "@/components/ui/card";

interface InstagramPreviewProps {
    accountName?: string;
    caption: string;
    imageUrl?: string;
}

export function InstagramPreview({
    accountName = "youraccount",
    caption,
    imageUrl,
}: InstagramPreviewProps) {
    // Truncate caption to 2 lines
    const truncatedCaption =
        caption.length > 80 ? caption.substring(0, 80) + "..." : caption;
    const showMore = caption.length > 80;

    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden">
            {/* Instagram Header */}
            <div className="flex items-center gap-3 p-3 border-b">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center">
                    <div className="w-7 h-7 rounded-full bg-background flex items-center justify-center">
                        <span className="text-xs font-semibold">
                            {accountName[0]?.toUpperCase() || "Y"}
                        </span>
                    </div>
                </div>
                <span className="text-sm font-semibold">{accountName}</span>
                <div className="ml-auto">
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-foreground"></div>
                        <div className="w-1 h-1 rounded-full bg-foreground"></div>
                        <div className="w-1 h-1 rounded-full bg-foreground"></div>
                    </div>
                </div>
            </div>

            {/* Instagram Image (Square) */}
            <div className="aspect-square relative bg-muted flex items-center justify-center">
                {imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Post preview"
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="text-muted-foreground text-sm">No image</div>
                )}
            </div>

            {/* Instagram Actions */}
            <div className="p-3 space-y-2">
                <div className="flex items-center gap-4">
                    <Heart className="h-6 w-6" />
                    <MessageCircle className="h-6 w-6" />
                    <Send className="h-6 w-6" />
                    <Bookmark className="h-6 w-6 ml-auto" />
                </div>

                <div className="text-sm font-semibold">1,234 likes</div>

                {/* Caption */}
                {caption && (
                    <div className="text-sm">
                        <span className="font-semibold mr-2">{accountName}</span>
                        <span className="whitespace-pre-wrap">
                            {truncatedCaption}
                            {showMore && (
                                <span className="text-muted-foreground ml-1">more</span>
                            )}
                        </span>
                    </div>
                )}

                <div className="text-xs text-muted-foreground">2 HOURS AGO</div>
            </div>
        </Card>
    );
}
