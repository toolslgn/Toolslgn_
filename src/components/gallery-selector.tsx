"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { toast } from "sonner";

interface GalleryImage {
    name: string;
    url: string;
}

interface GallerySelectorProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSelectImage: (url: string) => void;
}

export function GallerySelector({
    open,
    onOpenChange,
    onSelectImage,
}: GallerySelectorProps) {
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedUrl, setSelectedUrl] = useState<string>("");

    // Fetch images when dialog opens
    useState(() => {
        if (open && images.length === 0) {
            fetchImages();
        }
    });

    async function fetchImages() {
        setLoading(true);
        const supabase = createClient();

        const { data, error } = await supabase.storage
            .from("post-images")
            .list(undefined, {
                limit: 50,
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
                    };
                });

            setImages(imageUrls);
        }

        setLoading(false);
    }

    const handleSelect = () => {
        if (selectedUrl) {
            onSelectImage(selectedUrl);
            onOpenChange(false);
            setSelectedUrl("");
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Select from Gallery</DialogTitle>
                </DialogHeader>

                <div className="space-y-4">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <p className="text-muted-foreground">Loading gallery...</p>
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground mb-4">
                                No images in gallery yet
                            </p>
                            <Button asChild variant="outline">
                                <a href="/dashboard/gallery">Go to Gallery</a>
                            </Button>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((image) => (
                                    <button
                                        key={image.name}
                                        onClick={() => setSelectedUrl(image.url)}
                                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedUrl === image.url
                                                ? "border-primary ring-2 ring-primary ring-offset-2"
                                                : "border-border hover:border-primary/50"
                                            }`}
                                    >
                                        <Image
                                            src={image.url}
                                            alt={image.name}
                                            fill
                                            className="object-cover"
                                            sizes="(max-width: 768px) 33vw, 25vw"
                                            loading="lazy"
                                        />

                                        {selectedUrl === image.url && (
                                            <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                                                <div className="bg-primary rounded-full p-2">
                                                    <Check className="h-4 w-4 text-primary-foreground" />
                                                </div>
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>

                            <div className="flex justify-end gap-2 pt-4 border-t">
                                <Button variant="outline" onClick={() => onOpenChange(false)}>
                                    Cancel
                                </Button>
                                <Button onClick={handleSelect} disabled={!selectedUrl}>
                                    Select Image
                                </Button>
                            </div>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
