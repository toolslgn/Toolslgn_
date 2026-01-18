/**
 * Indonesian Public Holidays 2026
 * 
 * Source: Official Indonesian Government Calendar
 */

export interface Holiday {
    date: string; // YYYY-MM-DD format
    name: string;
    nameEn: string;
    type: "national" | "religious" | "regional";
}

export const INDONESIAN_HOLIDAYS_2026: Holiday[] = [
    // January
    {
        date: "2026-01-01",
        name: "Tahun Baru Masehi",
        nameEn: "New Year's Day",
        type: "national",
    },

    // February
    {
        date: "2026-02-17",
        name: "Tahun Baru Imlek",
        nameEn: "Chinese New Year",
        type: "national",
    },

    // March
    {
        date: "2026-03-22",
        name: "Isra Mikraj",
        nameEn: "Isra and Mi'raj",
        type: "religious",
    },
    {
        date: "2026-03-25",
        name: "Hari Suci Nyepi",
        nameEn: "Nyepi (Balinese New Year)",
        type: "national",
    },

    // April
    {
        date: "2026-04-03",
        name: "Wafat Isa Al-Masih",
        nameEn: "Good Friday",
        type: "religious",
    },

    // May
    {
        date: "2026-05-01",
        name: "Hari Buruh",
        nameEn: "Labour Day",
        type: "national",
    },
    {
        date: "2026-05-02",
        name: "Hari Raya Idul Fitri",
        nameEn: "Eid al-Fitr (Day 1)",
        type: "religious",
    },
    {
        date: "2026-05-03",
        name: "Hari Raya Idul Fitri",
        nameEn: "Eid al-Fitr (Day 2)",
        type: "religious",
    },
    {
        date: "2026-05-04",
        name: "Cuti Bersama Idul Fitri",
        nameEn: "Eid al-Fitr Joint Holiday",
        type: "national",
    },
    {
        date: "2026-05-05",
        name: "Cuti Bersama Idul Fitri",
        nameEn: "Eid al-Fitr Joint Holiday",
        type: "national",
    },
    {
        date: "2026-05-14",
        name: "Kenaikan Isa Al-Masih",
        nameEn: "Ascension Day",
        type: "religious",
    },

    // June
    {
        date: "2026-06-01",
        name: "Hari Lahir Pancasila",
        nameEn: "Pancasila Day",
        type: "national",
    },

    // July
    {
        date: "2026-07-09",
        name: "Hari Raya Idul Adha",
        nameEn: "Eid al-Adha",
        type: "religious",
    },
    {
        date: "2026-07-29",
        name: "Tahun Baru Islam",
        nameEn: "Islamic New Year",
        type: "religious",
    },

    // August
    {
        date: "2026-08-17",
        name: "Hari Kemerdekaan RI",
        nameEn: "Independence Day",
        type: "national",
    },

    // October
    {
        date: "2026-10-07",
        name: "Maulid Nabi Muhammad SAW",
        nameEn: "Prophet Muhammad's Birthday",
        type: "religious",
    },

    // December
    {
        date: "2026-12-25",
        name: "Hari Raya Natal",
        nameEn: "Christmas Day",
        type: "national",
    },
    {
        date: "2026-12-26",
        name: "Cuti Bersama Natal",
        nameEn: "Christmas Joint Holiday",
        type: "national",
    },
];

/**
 * Check if a date is an Indonesian holiday
 */
export function isHoliday(date: Date | string): Holiday | null {
    const dateStr =
        typeof date === "string"
            ? date
            : date.toISOString().split("T")[0];

    return (
        INDONESIAN_HOLIDAYS_2026.find((holiday) => holiday.date === dateStr) || null
    );
}

/**
 * Get all holidays in a specific month
 */
export function getHolidaysInMonth(year: number, month: number): Holiday[] {
    return INDONESIAN_HOLIDAYS_2026.filter((holiday) => {
        const [y, m] = holiday.date.split("-").map(Number);
        return y === year && m === month;
    });
}

/**
 * Get holiday color class for styling
 */
export function getHolidayColor(type: Holiday["type"]): string {
    switch (type) {
        case "national":
            return "text-red-600 dark:text-red-400";
        case "religious":
            return "text-orange-600 dark:text-orange-400";
        case "regional":
            return "text-yellow-600 dark:text-yellow-400";
        default:
            return "text-red-600 dark:text-red-400";
    }
}
