import { Ionicons } from "@expo/vector-icons";

export type NewsCategoryStyle = {
    category: string;
    icon: keyof typeof Ionicons.glyphMap;
    tint: string;
};

// Cycled by index so consecutive articles always look visually distinct,
// regardless of what (if anything) the backend provides for images.
export const NEWS_CATEGORY_STYLES: NewsCategoryStyle[] = [
    { category: "Advisory", icon: "megaphone", tint: "#2563EB" },
    { category: "Community", icon: "people", tint: "#16A34A" },
    { category: "Update", icon: "boat", tint: "#E67E22" },
    { category: "Donation", icon: "heart", tint: "#9333EA" },
];

export const getNewsCategoryStyle = (index: number): NewsCategoryStyle =>
    NEWS_CATEGORY_STYLES[index % NEWS_CATEGORY_STYLES.length];

export type StaticNewsItem = {
    id: string;
    title: string;
    description: string;
    meta: string;
};

// Shown whenever the backend has no news yet — one source of truth so the
// dashboard preview and the full "More Updates" list never disagree.
export const STATIC_NEWS_FEED: StaticNewsItem[] = [
    {
        id: "static-news-1",
        title: "NDMA Issues Flood Advisory for Islamabad Zones",
        description: "Residents near E-11 and F-10 advised to relocate temporarily as water levels rise.",
        meta: "2h ago",
    },
    {
        id: "static-news-2",
        title: "Volunteer Drive Launched for Relief Camps",
        description: "Three NGOs are coordinating supply drops across flood-hit sectors this week.",
        meta: "5h ago",
    },
    {
        id: "static-news-3",
        title: "New Rescue Boats Deployed in Flood-Hit Areas",
        description: "Rescue 1122 has added 12 new boats to speed up evacuations in low-lying zones.",
        meta: "Yesterday",
    },
    {
        id: "static-news-4",
        title: "Red Crescent Opens Donation Camp in E-11",
        description: "Cash, food, and blankets are being accepted at the new relief collection point.",
        meta: "2 days ago",
    },
    {
        id: "static-news-5",
        title: "PDMA Warns of Heavy Monsoon Rains This Week",
        description: "Punjab's disaster authority has issued a province-wide alert ahead of expected heavy rainfall.",
        meta: "2 days ago",
    },
    {
        id: "static-news-6",
        title: "Local Mosques Open Doors as Emergency Shelters",
        description: "Several community centers in F-10 and G-9 are now accepting displaced families overnight.",
        meta: "3 days ago",
    },
    {
        id: "static-news-7",
        title: "Power Restored to E-11 After Overnight Outage",
        description: "IESCO crews completed repairs to flood-damaged lines, restoring electricity to the sector.",
        meta: "3 days ago",
    },
    {
        id: "static-news-8",
        title: "Citizens Donate Over 500 Blankets in 24 Hours",
        description: "A community donation drive at G-9 Markaz exceeded its target within a single day.",
        meta: "4 days ago",
    },
];
