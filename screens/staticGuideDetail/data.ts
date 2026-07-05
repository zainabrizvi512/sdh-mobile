import { SafetyGuide } from "@/api/getSafetyGuides";
import { Ionicons } from "@expo/vector-icons";

export type StaticGuideKey = "flood" | "earthquake" | "fire";

export type StaticGuideMeta = {
    heroIcon: keyof typeof Ionicons.glyphMap;
    heroTint: string;
    guide: SafetyGuide;
};

export const STATIC_GUIDES: Record<StaticGuideKey, StaticGuideMeta> = {
    flood: {
        heroIcon: "water",
        heroTint: "#2563EB",
        guide: {
            id: "static-flood",
            title: "Flood Safety: Before, During & After",
            locale: "en",
            regionCity: "Islamabad",
            regionProvince: null,
            published: true,
            disasterType: { id: "static-flood-type", slug: "flood", name: "Flood" },
            createdAt: "",
            updatedAt: "",
            steps: [
                { id: "f1", phase: "BEFORE", order: 1, title: "Pack an emergency kit", body: "Keep water, non-perishable food, a torch, first-aid supplies, medicines, and a charged power bank ready in a waterproof bag." },
                { id: "f2", phase: "BEFORE", order: 2, title: "Move valuables to higher ground", body: "Shift important documents, electronics, and valuables to upper floors or elevated shelves before water levels rise." },
                { id: "f3", phase: "BEFORE", order: 3, title: "Know your evacuation route", body: "Identify the nearest relief camp or high ground and agree on a family meeting point in case you're separated." },
                { id: "f4", phase: "DURING", order: 4, title: "Avoid moving water", body: "Just 6 inches of fast-moving water can knock you down, and 2 feet can sweep away a vehicle. Never walk or drive through it." },
                { id: "f5", phase: "DURING", order: 5, title: "Turn off utilities", body: "If water is entering your home, switch off electricity and gas at the mains to prevent shocks and fires." },
                { id: "f6", phase: "AFTER", order: 6, title: "Treat all flood water as contaminated", body: "Avoid contact where possible, and boil or treat drinking water until local authorities confirm it's safe." },
            ],
            checklist: [
                { id: "fc1", order: 1, label: "Emergency kit packed and accessible", recommended: true },
                { id: "fc2", order: 2, label: "Important documents in a waterproof bag", recommended: true },
                { id: "fc3", order: 3, label: "Family knows the meeting point", recommended: true },
                { id: "fc4", order: 4, label: "Mobile phones fully charged", recommended: false },
            ],
            actions: [
                { id: "fa1", order: 1, type: "CALL", label: "Rescue 1122", payload: "1122" },
                { id: "fa2", order: 2, type: "CALL", label: "Police", payload: "15" },
            ],
            resources: [],
        },
    },
    earthquake: {
        heroIcon: "warning",
        heroTint: "#B45309",
        guide: {
            id: "static-earthquake",
            title: "Earthquake Response: Drop, Cover, Hold",
            locale: "en",
            regionCity: "Islamabad",
            regionProvince: null,
            published: true,
            disasterType: { id: "static-earthquake-type", slug: "earthquake", name: "Earthquake" },
            createdAt: "",
            updatedAt: "",
            steps: [
                { id: "e1", phase: "BEFORE", order: 1, title: "Secure heavy furniture", body: "Anchor bookshelves, cabinets, and appliances to walls so they can't topple during shaking." },
                { id: "e2", phase: "BEFORE", order: 2, title: "Identify safe spots", body: "In each room, know a spot under sturdy furniture or against an interior wall, away from windows and heavy objects." },
                { id: "e3", phase: "DURING", order: 3, title: "Drop, Cover, and Hold On", body: "Drop to your hands and knees, take cover under sturdy furniture, and hold on until the shaking completely stops." },
                { id: "e4", phase: "DURING", order: 4, title: "If outdoors, move to open ground", body: "Move away from buildings, trees, and power lines, and stay in the open until the shaking stops." },
                { id: "e5", phase: "AFTER", order: 5, title: "Check for injuries before helping others", body: "Check yourself first, then carefully assist others. Expect aftershocks and be ready to Drop, Cover, and Hold On again." },
            ],
            checklist: [
                { id: "ec1", order: 1, label: "Heavy furniture anchored to walls", recommended: true },
                { id: "ec2", order: 2, label: "Safe spot identified in each room", recommended: true },
                { id: "ec3", order: 3, label: "Emergency kit accessible", recommended: false },
            ],
            actions: [
                { id: "ea1", order: 1, type: "CALL", label: "Rescue 1122", payload: "1122" },
                { id: "ea2", order: 2, type: "CALL", label: "Ambulance", payload: "1122" },
            ],
            resources: [],
        },
    },
    fire: {
        heroIcon: "flame",
        heroTint: "#C0392B",
        guide: {
            id: "static-fire",
            title: "Fire Emergency: Evacuation Basics",
            locale: "en",
            regionCity: "Islamabad",
            regionProvince: null,
            published: true,
            disasterType: { id: "static-fire-type", slug: "fire", name: "Fire" },
            createdAt: "",
            updatedAt: "",
            steps: [
                { id: "fi1", phase: "BEFORE", order: 1, title: "Install and test smoke detectors", body: "Fit smoke detectors in key rooms and test them monthly so you get an early warning." },
                { id: "fi2", phase: "DURING", order: 2, title: "Get low and go", body: "Smoke rises, so crawl low under it toward your exit to reduce smoke inhalation." },
                { id: "fi3", phase: "DURING", order: 3, title: "Feel doors before opening", body: "If a door feels hot, don't open it — use your alternate escape route instead." },
                { id: "fi4", phase: "AFTER", order: 4, title: "Call for help and stay out", body: "Once outside, call the fire brigade immediately and never go back inside for belongings." },
            ],
            checklist: [
                { id: "fic1", order: 1, label: "Smoke detectors installed and tested", recommended: true },
                { id: "fic2", order: 2, label: "Two escape routes known per room", recommended: true },
                { id: "fic3", order: 3, label: "Fire extinguisher accessible", recommended: false },
            ],
            actions: [
                { id: "fia1", order: 1, type: "CALL", label: "Fire Brigade", payload: "16" },
                { id: "fia2", order: 2, type: "CALL", label: "Rescue 1122", payload: "1122" },
            ],
            resources: [],
        },
    },
};
