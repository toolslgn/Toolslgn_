/**
 * Spintax Parser Utility
 * 
 * Parses spintax (spin syntax) to generate unique variations of text.
 * Useful for avoiding duplicate content penalties when posting to multiple platforms.
 * 
 * Syntax: {option1|option2|option3}
 * Example: "{Great|Awesome|Amazing} post!" → "Amazing post!"
 */

/**
 * Parse spintax and return a random variation
 * 
 * Supports nested spintax patterns:
 * - Single level: {word1|word2}
 * - Nested: {word1|{word2a|word2b}}
 * 
 * @param text - Text containing spintax patterns
 * @returns Parsed text with random selections
 * 
 * @example
 * parseSpintax("{Great|Awesome} news!")
 * // Returns: "Great news!" or "Awesome news!"
 * 
 * @example
 * parseSpintax("{Check out|See} our {new|latest} {product|service}!")
 * // Returns random combination like: "See our latest product!"
 */
export function parseSpintax(text: string): string {
    // Handle empty or null input
    if (!text || typeof text !== "string") {
        return text || "";
    }

    let result = text;
    let iterations = 0;
    const maxIterations = 100; // Prevent infinite loops

    // Keep parsing until no more spintax patterns are found
    while (result.includes("{") && iterations < maxIterations) {
        iterations++;

        // Find the innermost spintax pattern (handles nesting)
        // Regex: Find { followed by text without { or }, then options separated by |, then }
        const spintaxPattern = /{([^{}|]+(?:\|[^{}|]+)+)}/;
        const match = result.match(spintaxPattern);

        if (!match) {
            // No more valid spintax patterns
            break;
        }

        // Extract the options from the pattern
        const fullMatch = match[0]; // e.g., "{word1|word2|word3}"
        const optionsString = match[1]; // e.g., "word1|word2|word3"

        // Split by pipe to get individual options
        const options = optionsString.split("|").map((opt) => opt.trim());

        // Filter out empty options
        const validOptions = options.filter((opt) => opt.length > 0);

        if (validOptions.length === 0) {
            // No valid options, remove the pattern
            result = result.replace(fullMatch, "");
            continue;
        }

        // Randomly select one option
        const selectedOption =
            validOptions[Math.floor(Math.random() * validOptions.length)];

        // Replace the spintax pattern with the selected option
        result = result.replace(fullMatch, selectedOption);
    }

    // Clean up any remaining invalid patterns
    result = result.replace(/{[^}]*}/g, "");

    return result.trim();
}

/**
 * Generate multiple unique variations from spintax text
 * 
 * @param text - Text containing spintax patterns
 * @param count - Number of variations to generate
 * @returns Array of unique variations
 * 
 * @example
 * generateVariations("{Hi|Hello} {world|everyone}!", 3)
 * // Returns: ["Hi world!", "Hello everyone!", "Hi everyone!"]
 */
export function generateVariations(text: string, count: number): string[] {
    const variations = new Set<string>();

    // Generate variations until we have enough unique ones
    // or we've tried enough times
    let attempts = 0;
    const maxAttempts = count * 10;

    while (variations.size < count && attempts < maxAttempts) {
        attempts++;
        const variation = parseSpintax(text);
        variations.add(variation);
    }

    return Array.from(variations);
}

/**
 * Check if text contains spintax patterns
 * 
 * @param text - Text to check
 * @returns True if spintax patterns are found
 */
export function hasSpintax(text: string): boolean {
    if (!text || typeof text !== "string") {
        return false;
    }

    // Check for basic spintax pattern
    const spintaxPattern = /{[^{}|]+(?:\|[^{}|]+)+}/;
    return spintaxPattern.test(text);
}

/**
 * Count the number of possible variations
 * 
 * Calculates the total number of unique combinations possible
 * from the spintax patterns in the text.
 * 
 * @param text - Text containing spintax patterns
 * @returns Number of possible unique variations
 * 
 * @example
 * countVariations("{A|B} {1|2|3}")
 * // Returns: 6 (A1, A2, A3, B1, B2, B3)
 */
export function countVariations(text: string): number {
    if (!text || typeof text !== "string") {
        return 1;
    }

    let count = 1;
    const spintaxPattern = /{([^{}|]+(?:\|[^{}|]+)+)}/g;
    const matches = text.matchAll(spintaxPattern);

    for (const match of matches) {
        const optionsString = match[1];
        const options = optionsString.split("|").filter((opt) => opt.trim().length > 0);
        count *= options.length;
    }

    return count;
}
