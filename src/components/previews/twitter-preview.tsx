import { MessageCircle, Repeat2, Heart, BarChart, Share } from "lucide-react";
import { Card } from "@/components/ui/card";

interface TwitterPreviewProps {
    accountName?: string;
    caption: string;
    imageUrl?: string;
}

export function TwitterPreview({
    accountName = "yourusername",
    caption,
    imageUrl,
}: TwitterPreviewProps) {
    return (
        <Card className="w-full max-w-md mx-auto overflow-hidden">
            {/* Twitter Header */}
            <div className="p-3">
                <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0">
                        <span className="text-white font-bold">
                            {accountName[0]?.toUpperCase() || "Y"}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                            <span className="font-bold text-sm">Your Account</span>
                            <span className="text-muted-foreground text-sm">
                                @{accountName}
                            </span>
                            <span className="text-muted-foreground text-sm">· 2h</span>
                        </div>

                        {/* Tweet Text */}
                        {caption && (
                            <div className="mt-2 text-sm whitespace-pre-wrap break-words">
                                {caption}
                            </div>
                        )}

                        {/* Tweet Image */}
                        {imageUrl && (
                            <div className="mt-3 rounded-2xl overflow-hidden border border-border">
                                <img
                                    src={imageUrl}
                                    alt="Tweet image"
                                    className="w-full object-cover max-h-96"
                                />
                            </div>
                        )}

                        {/* Tweet Actions */}
                        <div className="mt-3 flex items-center justify-between max-w-md text-muted-foreground">
                            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                <MessageCircle className="h-4 w-4" />
                                <span className="text-xs">42</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-green-500 transition-colors">
                                <Repeat2 className="h-4 w-4" />
                                <span className="text-xs">18</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-pink-500 transition-colors">
                                <Heart className="h-4 w-4" />
                                <span className="text-xs">234</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                <BarChart className="h-4 w-4" />
                                <span className="text-xs">1.2K</span>
                            </button>
                            <button className="flex items-center gap-2 hover:text-blue-500 transition-colors">
                                <Share className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
