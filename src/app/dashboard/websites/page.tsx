import { createClient } from "@/lib/supabase/server";
import { Globe, ExternalLink } from "lucide-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AddWebsiteDialog } from "./add-website-dialog";
import type { Website } from "@/types/database";

export default async function WebsitesPage() {
    const supabase = await createClient();

    // Fetch websites for the current user
    const { data: websites, error } = await supabase
        .from("websites")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching websites:", error);
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">My Websites</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage up to 20 websites for your social media campaigns.
                    </p>
                </div>
                <AddWebsiteDialog />
            </div>

            {/* Stats */}
            <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-muted-foreground">Total Websites</p>
                        <p className="text-2xl font-bold">{websites?.length || 0} / 20</p>
                    </div>
                    <Globe className="h-8 w-8 text-muted-foreground" />
                </div>
            </div>

            {/* Websites Grid */}
            {websites && websites.length > 0 ? (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {websites.map((website: Website) => (
                        <Card key={website.id} className="hover:border-primary transition-colors">
                            <CardHeader>
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-3">
                                        {/* Website Logo Placeholder */}
                                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                                            <Globe className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <CardTitle className="text-lg">{website.name}</CardTitle>
                                            <CardDescription className="flex items-center gap-1 mt-1">
                                                <a
                                                    href={website.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 hover:text-primary transition-colors"
                                                >
                                                    <span className="text-xs truncate max-w-[200px]">
                                                        {website.url}
                                                    </span>
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            </CardDescription>
                                        </div>
                                    </div>
                                </div>
                            </CardHeader>
                            {website.description && (
                                <CardContent>
                                    <p className="text-sm text-muted-foreground line-clamp-2">
                                        {website.description}
                                    </p>
                                </CardContent>
                            )}
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="rounded-lg border-2 border-dashed border-border p-12 text-center">
                    <Globe className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No websites yet</h3>
                    <p className="text-muted-foreground mb-4">
                        Get started by adding your first website to manage.
                    </p>
                    <AddWebsiteDialog />
                </div>
            )}
        </div>
    );
}
