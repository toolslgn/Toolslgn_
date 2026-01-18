import { ThumbsUp, MessageCircle, Share2, Globe } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FacebookPreviewProps {
    accountName?: string;
    caption: string;
    imageUrl?: string;
}

export function FacebookPreview({
    accountName = "Your Page",
    caption,
    imageUrl,
}: FacebookPreviewProps) {
    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden">
            {/* Facebook Header */}
            <div className="p-3 border-b">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                        <span className="text-white text-sm font-bold">
                            {accountName[0]?.toUpperCase() || "Y"}
                        </span>
                    </div>
                    <div className="flex-1">
                        <div className="font-semibold text-sm">{accountName}</div>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <span>2h</span>
                            <span>·</span>
                            <Globe className="h-3 w-3" />
                        </div>
                    </div>
                    <div className="flex gap-1">
                        <div className="w-1 h-1 rounded-full bg-foreground"></div>
                        <div className="w-1 h-1 rounded-full bg-foreground"></div>
                        <div className="w-1 h-1 rounded-full bg-foreground"></div>
                    </div>
                </div>

                {/* Caption */}
                {caption && (
                    <div className="mt-3 text-sm whitespace-pre-wrap">{caption}</div>
                )}
            </div>

            {/* Facebook Image */}
            {imageUrl ? (
                <div className="relative bg-muted">
                    <img
                        src={imageUrl}
                        alt="Post preview"
                        className="w-full object-contain max-h-96"
                    />
                </div>
            ) : (
                <div className="aspect-video bg-muted flex items-center justify-center">
                    <div className="text-muted-foreground text-sm">No image</div>
                </div>
            )}

            {/* Facebook Reactions & Stats */}
            <div className="px-3 py-2 border-b text-xs text-muted-foreground flex items-center justify-between">
                <div className="flex items-center gap-1">
                    <div className="flex -space-x-1">
                        <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white text-[10px]">
                            👍
                        </div>
                        <div className="w-4 h-4 rounded-full bg-red-500 flex items-center justify-center text-white text-[10px]">
                            ❤️
                        </div>
                    </div>
                    <span>1.2K</span>
                </div>
                <div className="flex gap-2">
                    <span>42 comments</span>
                    <span>18 shares</span>
                </div>
            </div>

            {/* Facebook Actions */}
            <div className="p-2 grid grid-cols-3 gap-1">
                <button className="flex items-center justify-center gap-2 py-2 rounded-md hover:bg-accent transition-colors">
                    <ThumbsUp className="h-4 w-4" />
                    <span className="text-sm font-medium">Like</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 rounded-md hover:bg-accent transition-colors">
                    <MessageCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">Comment</span>
                </button>
                <button className="flex items-center justify-center gap-2 py-2 rounded-md hover:bg-accent transition-colors">
                    <Share2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Share</span>
                </button>
            </div>
        </Card>
    );
}
