import { Holiday } from "./holidays-2026";

/**
 * Generate holiday greeting caption in Indonesian
 */
export function generateHolidayGreeting(
    holiday: Holiday,
    websiteName?: string
): string {
    const name = websiteName || "{Website Name}";

    // Special templates for specific holidays
    const templates: Record<string, string> = {
        // New Year
        "Tahun Baru Masehi": `Selamat Tahun Baru ${new Date().getFullYear()}! 🎉\n\nSegenap keluarga besar ${name} mengucapkan Selamat Tahun Baru. Semoga tahun ini membawa {kebahagiaan|kesuksesan|keberkahan} bagi kita semua!\n\n#TahunBaru #HappyNewYear`,

        // Chinese New Year
        "Tahun Baru Imlek": `Gong Xi Fa Cai! 🧧🎊\n\n${name} mengucapkan Selamat Tahun Baru Imlek. Semoga tahun ini penuh dengan {kemakmuran|keberuntungan|kesuksesan}!\n\n#ImLek #ChineseNewYear #GongXiFaCai`,

        // Eid al-Fitr
        "Hari Raya Idul Fitri": `Selamat Hari Raya Idul Fitri 🌙✨\n\n${name} mengucapkan Mohon Maaf Lahir dan Batin. Semoga kita semua {diterima amal ibadahnya|mendapat keberkahan|senantiasa dalam lindungan-Nya}.\n\nTaqabbalallahu minna wa minkum! 🤲\n\n#IdulFitri #LebaranMubarak`,

        // Independence Day
        "Hari Kemerdekaan RI": `Dirgahayu Republik Indonesia ke-${new Date().getFullYear() - 1945}! 🇮🇩🎉\n\n${name} dengan bangga merayakan Hari Kemerdekaan Indonesia. Merdeka!\n\n#HUT${new Date().getFullYear() - 1945}RI #Indonesia #Merdeka`,

        // Eid al-Adha
        "Hari Raya Idul Adha": `Selamat Hari Raya Idul Adha 🐑🕌\n\n${name} mengucapkan Selamat Hari Raya Idul Adha. Semoga {amal ibadah|kurban} kita diterima di sisi-Nya.\n\nTaqabbalallahu minna wa minkum! 🤲\n\n#IdulAdha #EidMubarak`,

        // Christmas
        "Hari Raya Natal": `Selamat Hari Natal! 🎄✨\n\nSegenap keluarga besar ${name} mengucapkan Selamat Hari Natal. Semoga {kedamaian|kebahagiaan|kasih} senantiasa menyertai kita.\n\n#MerryChristmas #Natal2026`,

        // Nyepi
        "Hari Suci Nyepi": `Om Swastiastu 🙏\n\n${name} mengucapkan Selamat Hari Raya Nyepi. Semoga Hari Suci ini membawa {kedamaian|kesucian|ketenangan} bagi kita semua.\n\n#Nyepi #SakaNewYear`,
    };

    // Check if we have a specific template
    if (templates[holiday.name]) {
        return templates[holiday.name];
    }

    // Default template for other holidays
    return `Selamat ${holiday.name}! 🎊\n\nSegenap keluarga besar ${name} mengucapkan Selamat ${holiday.name}. Semoga {kebahagiaan|keberkahan|kesuksesan} menyertai kita semua.\n\n#${holiday.nameEn.replace(/\s+/g, "")}`;
}

/**
 * Generate URL parameters for pre-filled Create Post form
 */
export function getHolidayPostUrl(holiday: Holiday, date: Date): string {
    const params = new URLSearchParams({
        date: date.toISOString().split("T")[0],
        holiday: holiday.name,
        caption: generateHolidayGreeting(holiday),
    });

    return `/dashboard/create?${params.toString()}`;
}
