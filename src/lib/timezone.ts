/**
 * Timezone Utility Functions
 * 
 * Handles timezone conversions for Asia/Jakarta (WIB, GMT+7)
 */

import { formatInTimeZone, toZonedTime } from "date-fns-tz";
import { format } from "date-fns";

export const TIMEZONE = "Asia/Jakarta";
export const TIMEZONE_LABEL = "WIB";

/**
 * Convert local WIB datetime to UTC ISO string for database storage
 * 
 * @param localDate - Local date (user's timezone)
 * @param localTime - Local time string (HH:mm)
 * @returns ISO string in UTC
 */
export function localToUTC(localDate: Date, localTime: string): string {
    const [hours, minutes] = localTime.split(":").map(Number);

    // Create date with local time
    const localDateTime = new Date(localDate);
    localDateTime.setHours(hours, minutes, 0, 0);

    // Convert to UTC ISO string
    return localDateTime.toISOString();
}

/**
 * Convert UTC ISO string to WIB display format
 * 
 * @param utcString - UTC ISO string from database
 * @param formatString - Output format (default: "dd MMM yyyy, HH:mm")
 * @returns Formatted WIB time string
 */
export function utcToWIB(
    utcString: string,
    formatString: string = "dd MMM yyyy, HH:mm"
): string {
    const date = new Date(utcString);
    return formatInTimeZone(date, TIMEZONE, formatString);
}

/**
 * Get current time in WIB
 * 
 * @returns Current WIB datetime
 */
export function getCurrentWIB(): Date {
    return toZonedTime(new Date(), TIMEZONE);
}

/**
 * Format date for WIB display with timezone label
 * 
 * @param date - Date to format (can be UTC or local)
 * @param showTimezone - Whether to append "WIB" label
 * @returns Formatted string
 */
export function formatWIB(date: Date | string, showTimezone: boolean = true): string {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const formatted = formatInTimeZone(dateObj, TIMEZONE, "dd MMM yyyy, HH:mm");
    return showTimezone ? `${formatted} ${TIMEZONE_LABEL}` : formatted;
}

/**
 * Check if scheduled time is in the past (WIB comparison)
 * 
 * @param scheduledDate - Scheduled date
 * @param scheduledTime - Scheduled time (HH:mm)
 * @returns True if in the past
 */
export function isScheduledInPast(scheduledDate: Date, scheduledTime: string): boolean {
    const [hours, minutes] = scheduledTime.split(":").map(Number);
    const scheduledDateTime = new Date(scheduledDate);
    scheduledDateTime.setHours(hours, minutes, 0, 0);

    return scheduledDateTime < new Date();
}
