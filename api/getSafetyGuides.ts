import { envConfig } from "@/config/envConfig";
import axios from "axios";

export type GuidePhase = 'BEFORE' | 'DURING' | 'AFTER';
export type ActionType = 'CALL' | 'SMS' | 'URL' | 'MAP';

export interface DisasterType {
    id: string;
    slug: string;
    name: string;
}

export interface GuideStep {
    id: string;
    phase: GuidePhase;
    order: number;
    title: string;
    body: string;
    icon?: string | null;
}

export interface ChecklistItem {
    id: string;
    order: number;
    label: string;
    recommended: boolean;
}

export interface QuickAction {
    id: string;
    order: number;
    type: ActionType;
    label: string;
    payload?: string | null;
    icon?: string | null;
}

export interface ResourceLink {
    id: string;
    order: number;
    title: string;
    url: string;
    source?: string | null;
}

export interface SafetyGuide {
    id: string;
    title: string;
    locale: string;
    regionCity: string | null;
    regionProvince: string | null;
    published: boolean;
    disasterType: DisasterType;
    steps: GuideStep[];
    checklist: ChecklistItem[];
    actions: QuickAction[];
    resources: ResourceLink[];
    createdAt: string;
    updatedAt: string;
}

const API = axios.create({
    baseURL: envConfig.EXPO_PUBLIC_BASE_URL || 'http://localhost:3000',
    timeout: 10000,
});

export async function getSafetyGuides(params: {
    city?: string;
    province?: string;
    locale?: string;
    disaster?: string; // slug
    q?: string;
    published?: boolean;
}) {
    const res = await API.get<SafetyGuide[]>('/safety/guides', { params });
    return res.data;
}