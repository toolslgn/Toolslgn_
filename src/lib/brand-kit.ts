/**
 * Brand Kit Utilities
 * Helper functions for brand colors and styling
 */

/**
 * Validate if a string is a valid hex color
 */
export function isValidHexColor(color: string): boolean {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Get contrasting text color (black or white) based on background
 * Uses relative luminance calculation
 */
export function getContrastColor(hexColor: string): string {
    if (!isValidHexColor(hexColor)) {
        return "#000000";
    }

    // Remove # and convert to RGB
    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calculate relative luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

    // Return black or white based on luminance
    return luminance > 0.5 ? "#000000" : "#FFFFFF";
}

/**
 * Generate lighter shade of a color
 */
export function lightenColor(hexColor: string, percent: number): string {
    if (!isValidHexColor(hexColor)) {
        return hexColor;
    }

    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.min(255, Math.floor(r + (255 - r) * (percent / 100)));
    const newG = Math.min(255, Math.floor(g + (255 - g) * (percent / 100)));
    const newB = Math.min(255, Math.floor(b + (255 - b) * (percent / 100)));

    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

/**
 * Generate darker shade of a color
 */
export function darkenColor(hexColor: string, percent: number): string {
    if (!isValidHexColor(hexColor)) {
        return hexColor;
    }

    const hex = hexColor.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    const newR = Math.max(0, Math.floor(r * (1 - percent / 100)));
    const newG = Math.max(0, Math.floor(g * (1 - percent / 100)));
    const newB = Math.max(0, Math.floor(b * (1 - percent / 100)));

    return `#${newR.toString(16).padStart(2, "0")}${newG.toString(16).padStart(2, "0")}${newB.toString(16).padStart(2, "0")}`;
}

/**
 * Generate color variants (lighter and darker shades)
 */
export function generateColorVariants(hexColor: string) {
    return {
        original: hexColor,
        light: lightenColor(hexColor, 20),
        lighter: lightenColor(hexColor, 40),
        dark: darkenColor(hexColor, 20),
        darker: darkenColor(hexColor, 40),
        contrast: getContrastColor(hexColor),
    };
}

/**
 * Get CSS variables for a brand color
 */
export function getBrandColorCSS(hexColor: string) {
    const variants = generateColorVariants(hexColor);

    return {
        "--brand-primary": variants.original,
        "--brand-light": variants.light,
        "--brand-lighter": variants.lighter,
        "--brand-dark": variants.dark,
        "--brand-darker": variants.darker,
        "--brand-contrast": variants.contrast,
    };
}

/**
 * Preset brand colors for quick selection
 */
export const PRESET_COLORS = [
    { name: "Blue", color: "#3B82F6" },
    { name: "Red", color: "#EF4444" },
    { name: "Green", color: "#10B981" },
    { name: "Yellow", color: "#F59E0B" },
    { name: "Purple", color: "#8B5CF6" },
    { name: "Pink", color: "#EC4899" },
    { name: "Indigo", color: "#6366F1" },
    { name: "Orange", color: "#F97316" },
    { name: "Teal", color: "#14B8A6" },
    { name: "Cyan", color: "#06B6D4" },
];
