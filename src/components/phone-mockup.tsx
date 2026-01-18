"use client";

import { useState } from "react";
import { Image, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from "lucide-react";

interface PhoneMockupProps {
    websiteName?: string;
    caption: string;
    imageUrl?: string;
}

export function PhoneMockup({ websiteName = "Your Website", caption, imageUrl }: PhoneMockupProps) {
    const [isLiked, setIsLiked] = useState(false);

    return (
        <div className="w-full max-w-sm mx-auto">
            {/* Phone Frame */}
            <div className="relative rounded-[3rem] border-[14px] border-gray-800 bg-gray-900 p-2 shadow-2xl">
                {/* Phone Notch */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/3 h-6 bg-gray-800 rounded-b-3xl z-10"></div>

                {/* Phone Screen */}
                <div className="relative bg-white dark:bg-gray-950 rounded-[2.3rem] overflow-hidden">
                    {/* Status Bar */}
                    <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
                        <span className="text-xs font-medium">9:41</span>
                        <span className="text-xs">📶 ⚡ 100%</span>
                    </div>

                    {/* App Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold">
                                {websiteName.charAt(0)}
                            </div>
                            <span className="text-sm font-semibold">{websiteName}</span>
                        </div>
                        <MoreHorizontal className="h-5 w-5" />
                    </div>

                    {/* Post Content Container */}
                    <div className="h-[500px] overflow-y-auto">
                        {/* Post Image */}
                        <div className="relative aspect-square bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                            {imageUrl ? (
                                <img
                                    src={imageUrl}
                                    alt="Post preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-center p-8">
                                    <Image className="h-16 w-16 mx-auto text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-400">Upload an image to see preview</p>
                                </div>
                            )}
                        </div>

                        {/* Post Actions */}
                        <div className="px-4 py-3">
                            <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-4">
                                    <button onClick={() => setIsLiked(!isLiked)}>
                                        <Heart
                                            className={`h-6 w-6 ${isLiked ? 'fill-red-500 text-red-500' : ''}`}
                                        />
                                    </button>
                                    <MessageCircle className="h-6 w-6" />
                                    <Send className="h-6 w-6" />
                                </div>
                                <Bookmark className="h-6 w-6" />
                            </div>

                            {/* Likes Count */}
                            <p className="text-sm font-semibold mb-2">
                                {isLiked ? '1,234 likes' : '1,233 likes'}
                            </p>

                            {/* Caption */}
                            {caption && (
                                <div className="text-sm">
                                    <span className="font-semibold mr-2">{websiteName}</span>
                                    <span className="whitespace-pre-wrap">{caption}</span>
                                </div>
                            )}

                            {!caption && (
                                <p className="text-sm text-gray-400 italic">
                                    Your caption will appear here...
                                </p>
                            )}

                            {/* Post Meta */}
                            <p className="text-xs text-gray-400 mt-2">2 minutes ago</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Phone Label */}
            <p className="text-center text-sm text-muted-foreground mt-4">
                Live Preview
            </p>
        </div>
    );
}
