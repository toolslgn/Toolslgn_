"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Facebook, Instagram, Twitter, Linkedin, MessageCircle, MapPin, Music } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";
import type { Platform } from "@/types/database";

// Platform configuration
interface PlatformConfig {
    id: Platform;
    name: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    description: string;
}

const platforms: PlatformConfig[] = [
    {
        id: "facebook",
        name: "Facebook",
        icon: Facebook,
        color: "text-[#1877F2]",
        description: "Connect your Facebook Page to schedule posts",
    },
    {
        id: "instagram",
        name: "Instagram",
        icon: Instagram,
        color: "text-[#E4405F]",
        description: "Connect your Instagram Business account",
    },
    {
        id: "twitter",
        name: "Twitter / X",
        icon: Twitter,
        color: "text-[#1DA1F2]",
        description: "Connect your Twitter/X account",
    },
    {
        id: "linkedin",
        name: "LinkedIn",
        icon: Linkedin,
        color: "text-[#0A66C2]",
        description: "Connect your LinkedIn Page or Profile",
    },
    {
        id: "pinterest",
        name: "Pinterest",
        icon: MapPin,
        color: "text-[#BD081C]",
        description: "Connect your Pinterest account",
    },
    {
        id: "gmb",
        name: "Google My Business",
        icon: MessageCircle,
        color: "text-[#4285F4]",
        description: "Connect your Google Business Profile",
    },
    {
        id: "tiktok",
        name: "TikTok",
        icon: Music,
        color: "text-[#000000] dark:text-white",
        description: "Connect your TikTok account",
    },
];

export default function AccountsPage() {
    const searchParams = useSearchParams();
    const [isConnecting, setIsConnecting] = useState(false);

    // Handle OAuth callback messages
    useEffect(() => {
        const success = searchParams.get("success");
        const error = searchParams.get("error");
        const warning = searchParams.get("warning");

        if (success) {
            toast.success(success);
            // Clear URL params
            window.history.replaceState({}, "", "/dashboard/accounts");
        }

        if (error) {
            toast.error(`Connection failed: ${error}`);
            window.history.replaceState({}, "", "/dashboard/accounts");
        }

        if (warning) {
            toast.warning(warning);
            window.history.replaceState({}, "", "/dashboard/accounts");
        }
    }, [searchParams]);

    const handleConnectFacebook = () => {
        const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;

        if (!appId) {
            toast.error("Facebook App ID not configured");
            return;
        }

        setIsConnecting(true);

        const redirectUri = `${window.location.origin}/api/auth/callback/facebook`;
        const scopes = [
            "pages_show_list",
            "pages_read_engagement",
            "pages_manage_posts",
            "instagram_basic",
            "instagram_content_publish",
        ].join(",");

        const authUrl = new URL("https://www.facebook.com/v19.0/dialog/oauth");
        authUrl.searchParams.set("client_id", appId);
        authUrl.searchParams.set("redirect_uri", redirectUri);
        authUrl.searchParams.set("scope", scopes);
        authUrl.searchParams.set("response_type", "code");
        authUrl.searchParams.set("state", Math.random().toString(36).substring(7)); // CSRF protection

        // Redirect to Facebook OAuth
        window.location.href = authUrl.toString();
    };

    const handleConnect = (platformId: Platform) => {
        if (platformId === "facebook" || platformId === "instagram") {
            handleConnectFacebook();
        } else {
            toast.info(`${platformId} integration coming soon`);
        }
    };

    const handleDisconnect = (platformId: Platform) => {
        console.log(`Disconnect ${platformId}`);
        toast.info("Disconnect functionality coming soon");
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Social Accounts</h2>
                <p className="text-muted-foreground mt-2">
                    Connect and manage your social media platform accounts.
                </p>
            </div>

            {/* Stats */}
            <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Connected Platforms</p>
                        <p className="text-2xl font-bold">0 / {platforms.length}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        {/* Show connected platform icons here */}
                    </div>
                </div>
            </div>

            {/* Platforms Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {platforms.map((platform) => {
                    const isConnected = false; // TODO: Fetch from database

                    return (
                        <Card key={platform.id} className={isConnected ? "border-primary/50" : ""}>
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        <div
                                            className={`flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 ${platform.color}`}
                                        >
                                            <platform.icon className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{platform.name}</CardTitle>
                                        </div>
                                    </div>
                                    {isConnected && (
                                        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
                                            Connected
                                        </Badge>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground">{platform.description}</p>
                            </CardContent>
                            <CardFooter>
                                {isConnected ? (
                                    <div className="flex w-full gap-2">
                                        <Button
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => handleConnect(platform.id)}
                                        >
                                            Settings
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            className="flex-1"
                                            onClick={() => handleDisconnect(platform.id)}
                                        >
                                            Disconnect
                                        </Button>
                                    </div>
                                ) : (
                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => handleConnect(platform.id)}
                                        disabled={isConnecting && (platform.id === "facebook" || platform.id === "instagram")}
                                    >
                                        {isConnecting && (platform.id === "facebook" || platform.id === "instagram")
                                            ? "Connecting..."
                                            : `Connect ${platform.name}`}
                                    </Button>
                                )}
                            </CardFooter>
                        </Card>
                    );
                })}
            </div>

            {/* Help Text */}
            <div className="rounded-lg border-2 border-dashed border-border p-6">
                <h3 className="text-sm font-semibold mb-2">🔗 How to Connect</h3>
                <ol className="text-sm text-muted-foreground space-y-2 list-decimal list-inside">
                    <li>Click "Connect" on the platform you want to link</li>
                    <li>You'll be redirected to the platform's authorization page</li>
                    <li>Grant the requested permissions</li>
                    <li>You'll be redirected back with your accounts connected</li>
                </ol>
                <p className="text-sm text-muted-foreground mt-4">
                    <strong>Note:</strong> For Instagram, you need a Business or Creator account linked to a Facebook Page.
                </p>
            </div>
        </div>
    );
}
