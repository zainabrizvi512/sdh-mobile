import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type EngagementTabKey = "dashboard" | "activities" | "history" | "opportunities";

export type T_USERENGAGEMENTHUB = NativeStackScreenProps<DashboardStackParamList, "UserEnagagementHub">;

export type EngagementDashboardState = {
  displayName: string;
  rank: string;
  level: number;
  currentXp: number;
  maxXp: number;
  totalXp: number;
  xpToNextLevel: number;
  missions: number;
  livesImpacted: number;
};
