"use client";

import { InstagramPreview } from "./instagram-preview";
import { FacebookPreview } from "./facebook-preview";
import { TwitterPreview } from "./twitter-preview";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PlatformPreviewProps {
    caption: string;
    imageUrl?: string;
    accountName?: string;
    platforms?: string[]; // Selected platforms
}

export function PlatformPreview({
    caption,
    imageUrl,
    accountName,
    platforms = ["instagram"],
}: PlatformPreviewProps) {
    // Determine active tab based on selected platforms
    const activeTab = platforms.includes("instagram")
        ? "instagram"
        : platforms.includes("facebook")
            ? "facebook"
            : platforms.includes("twitter")
                ? "twitter"
                : "instagram";

    return (
        <Card className="sticky top-6">
            <CardHeader>
                <CardTitle className="text-lg">Preview</CardTitle>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue={activeTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="instagram">Instagram</TabsTrigger>
                        <TabsTrigger value="facebook">Facebook</TabsTrigger>
                        <TabsTrigger value="twitter">Twitter</TabsTrigger>
                    </TabsList>

                    <TabsContent value="instagram" className="mt-4">
                        <InstagramPreview
                            accountName={accountName}
                            caption={caption}
                            imageUrl={imageUrl}
                        />
                    </TabsContent>

                    <TabsContent value="facebook" className="mt-4">
                        <FacebookPreview
                            accountName={accountName}
                            caption={caption}
                            imageUrl={imageUrl}
                        />
                    </TabsContent>

                    <TabsContent value="twitter" className="mt-4">
                        <TwitterPreview
                            accountName={accountName}
                            caption={caption}
                            imageUrl={imageUrl}
                        />
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
