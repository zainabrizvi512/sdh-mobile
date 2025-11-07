export function isoToTime(iso?: string) {
    if (!iso) return "";
    const d = new Date(iso); // already has Z → UTC
    if (isNaN(d.getTime())) return "";
    return new Intl.DateTimeFormat(undefined, {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,            // set false for 24h
        // timeZone: "Asia/Karachi", // uncomment to force a specific TZ
    }).format(d);
}