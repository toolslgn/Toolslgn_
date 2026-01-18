import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.GOOGLE_AI_API_KEY) {
    console.warn("Missing GOOGLE_AI_API_KEY environment variable");
}

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY || "");

/**
 * Generates a social media caption based on the context and prompt.
 * 
 * @param context - Information about the website or product (e.g., name, description, target audience).
 * @param prompt - Specific instruction for the caption (e.g., "Write a promotional post about a winter sale").
 * @returns The generated caption text.
 */
export async function generateCaption(context: string, prompt: string): Promise<string> {
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        const fullPrompt = `
      You are an expert social media manager.
      
      CONTEXT about the website/brand:
      ${context}
      
      TASK:
      ${prompt}
      
      REQUIREMENTS:
      1. Write a catchy, engaging social media caption.
      2. Include relevant hashtags at the end.
      3. Use emojis where appropriate to make it visually appealing.
      4. Keep the tone professional yet friendly, unless specified otherwise.
      5. Output ONLY the caption text, no explanations.
    `;

        const result = await model.generateContent(fullPrompt);
        const response = await result.response;
        const text = response.text();

        return text.trim();
    } catch (error) {
        console.error("Error generating caption with Gemini:", error);
        throw new Error("Failed to generate caption. Please try again later.");
    }
}
