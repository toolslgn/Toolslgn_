"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { WebsiteInsert } from "@/types/database";

/**
 * Create a new website
 */
export async function createWebsite(formData: FormData) {
    const supabase = await createClient();

    // Get the current user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { error: "Not authenticated" };
    }

    // Extract form data
    const name = formData.get("name") as string;
    const url = formData.get("url") as string;
    const description = formData.get("description") as string;

    // Validate required fields
    if (!name || !url) {
        return { error: "Name and URL are required" };
    }

    // Create website object
    const newWebsite: WebsiteInsert = {
        user_id: user.id,
        name,
        url,
        description: description || null,
    };

    // Insert into database
    const { data, error } = await supabase
        .from("websites")
        .insert(newWebsite)
        .select()
        .single();

    if (error) {
        console.error("Error creating website:", error);
        return { error: error.message };
    }

    // Revalidate the websites page to show the new data
    revalidatePath("/dashboard/websites");

    return { data, error: null };
}

/**
 * Delete a website
 */
export async function deleteWebsite(websiteId: string) {
    const supabase = await createClient();

    const { error } = await supabase
        .from("websites")
        .delete()
        .eq("id", websiteId);

    if (error) {
        console.error("Error deleting website:", error);
        return { error: error.message };
    }

    revalidatePath("/dashboard/websites");
    return { error: null };
}
