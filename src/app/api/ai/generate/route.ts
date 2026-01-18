import { createClient } from "@/lib/supabase/server";
import { generateCaption } from "@/lib/ai-service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        // 1. Authenticate user
        const supabase = await createClient();
        const {
            data: { user },
            error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // 2. Parse request body
        const { prompt, websiteContext } = await request.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        if (!websiteContext) {
            return NextResponse.json(
                { error: "Website context is required" },
                { status: 400 }
            );
        }

        // 3. Call AI Service
        const generatedText = await generateCaption(websiteContext, prompt);

        return NextResponse.json({ caption: generatedText });
    } catch (error) {
        console.error("API Error generating caption:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
