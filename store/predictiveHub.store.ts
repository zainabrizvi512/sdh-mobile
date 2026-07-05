// ✅ FIXED IMPORTS
import { getDashboardSummary } from '@/api/getDashboardSummary';
import { getDecisionsByRegion } from '@/api/getDecisionsByRegion';
import { getLatestRisk, RiskSnapshot } from '@/api/getLatestRisk';
import type { Socket } from 'socket.io-client';
import { create, type StateCreator } from 'zustand';

type HubState = {
  region?: string;
  socket?: Socket;
  risk: Record<string, RiskSnapshot>;
  decisions: any[];
  hazards: any[];
  volume: { h: string; c: number }[];
  messages: any[];
  setSocket: (s: Socket) => void;
  setRegion: (r: string) => void;
  loadInitial: (region: string) => Promise<void>;
  onRiskUpdate: (snap: { disasterTypeId: string; score: number; features: any; at: string }) => void;
  pushMessage: (m: any) => void;
};

// ✅ Optional: type the creator so set/get are inferred (prevents “implicitly any”)
const creator: StateCreator<HubState> = (set, get) => ({
  region: undefined,
  socket: undefined,
  risk: {},
  decisions: [],
  hazards: [],
  volume: [],
  messages: [],

  setSocket: (s) => set({ socket: s }),
  setRegion: (r) => set({ region: r }),

  async loadInitial(region) {
    const [latest, decisions, dash] = await Promise.all([
      getLatestRisk(region),
      getDecisionsByRegion(region),
      getDashboardSummary(region),
    ]);
    const riskMap = Object.fromEntries(latest.map((r) => [r.disasterTypeId, r]));
    set({
      region,
      risk: riskMap,
      decisions,
      hazards: dash.hazards ?? [],
      volume: (dash.volume ?? []).map((v: { h: string; c: number | string }) => ({
        h: v.h,
        c: Number(v.c),
      })),
    });
  },

  onRiskUpdate: (snap) => {
    set((s) => ({
      risk: {
        ...s.risk,
        [snap.disasterTypeId]: {
          disasterTypeId: snap.disasterTypeId,
          score: snap.score,
          features: snap.features,
          createdAt: snap.at,
        },
      },
    }));
  },

  pushMessage: (m) => set((s) => ({ messages: [m, ...s.messages] })),
});

// ✅ Create the store
export const usePredictiveHub = create<HubState>(creator);
