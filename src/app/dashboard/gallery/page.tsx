"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Trash2, Image as ImageIcon, Upload } from "lucide-react";
import { toast } from "sonner";
import { EmptyGallery } from "@/components/empty-state";

interface GalleryImage {
    name: string;
    url: string;
    createdAt: string;
    size: number;
}

export default function GalleryPage() {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleteImage, setDeleteImage] = useState<GalleryImage | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Fetch images
    useEffect(() => {
        fetchImages();
    }, []);

    async function fetchImages() {
        const supabase = createClient();

        const { data, error } = await supabase.storage
            .from("post-images")
            .list(undefined, {
                limit: 100,
                offset: 0,
                sortBy: { column: "created_at", order: "desc" },
            });

        if (error) {
            console.error("Error fetching images:", error);
            toast.error("Failed to load gallery");
            setLoading(false);
            return;
        }

        if (data) {
            const imageUrls = data
                .filter((file) => file.name !== ".emptyFolderPlaceholder")
                .map((file) => {
                    const {
                        data: { publicUrl },
                    } = supabase.storage.from("post-images").getPublicUrl(file.name);

                    return {
                        name: file.name,
                        url: publicUrl,
                        createdAt: file.created_at || "",
                        size: file.metadata?.size || 0,
                    };
                });

            setImages(imageUrls);
        }

        setLoading(false);
    }

    async function handleDelete(image: GalleryImage) {
        setDeleting(true);
        const supabase = createClient();

        const { error } = await supabase.storage
            .from("post-images")
            .remove([image.name]);

        if (error) {
            console.error("Error deleting image:", error);
            toast.error("Failed to delete image");
        } else {
            toast.success("Image deleted successfully");
            // Remove from state
            setImages((prev) => prev.filter((img) => img.name !== image.name));
        }

        setDeleting(false);
        setDeleteImage(null);
    }

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return bytes + " B";
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
        return (bytes / (1024 * 1024)).toFixed(1) + " MB";
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <p className="text-muted-foreground">Loading gallery...</p>
            </div>
        );
    }

    return (
        <div className="page-container">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Media Gallery</h2>
                    <p className="text-muted-foreground mt-2">
                        Manage and reuse images across all your websites
                    </p>
                </div>
                <Button asChild>
                    <a href="/dashboard/create">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload New
                    </a>
                </Button>
            </div>

            {/* Stats */}
            <Card>
                <CardContent className="pt-6">
                    <div className="flex gap-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Total Images</p>
                            <p className="text-2xl font-bold">{images.length}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Size</p>
                            <p className="text-2xl font-bold">
                                {formatFileSize(images.reduce((acc, img) => acc + img.size, 0))}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Gallery Grid */}
            {images.length === 0 ? (
                <EmptyGallery />
            ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {images.map((image) => (
                        <Card
                            key={image.name}
                            className="group relative overflow-hidden hover:shadow-lg transition-all duration-200"
                        >
                            <div className="aspect-square relative">
                                <Image
                                    src={image.url}
                                    alt={image.name}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
                                    loading="lazy"
                                />

                                {/* Overlay on Hover */}
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button
                                        variant="destructive"
                                        size="icon"
                                        onClick={() => setDeleteImage(image)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Image Info */}
                            <CardContent className="p-2">
                                <p className="text-xs text-muted-foreground truncate">
                                    {formatFileSize(image.size)}
                                </p>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={!!deleteImage}
                onOpenChange={(open: boolean) => !open && setDeleteImage(null)}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Image?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete this image from storage. This action
                            cannot be undone.
                            {deleteImage && (
                                <div className="mt-2 rounded-md border p-2 text-xs text-muted-foreground break-all bg-muted/50">
                                    {deleteImage.name}
                                </div>
                            )}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteImage(null)} disabled={deleting}>Cancel</Button>
                        <Button
                            onClick={() => deleteImage && handleDelete(deleteImage)}
                            variant="destructive"
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
