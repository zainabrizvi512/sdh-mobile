import { DashboardStackParamList } from "@/navigation/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_PREDICVIVECOORDINATIONHUB = NativeStackScreenProps<
    DashboardStackParamList,
    "PredictiveHub"
>;

export type PredictiveHubRouteParams = {
};

export type Severity = "low" | "medium" | "high" | "critical";

export interface RiskItem {
  hazard: string;
  severity: Severity;
  badgeValue?: string;
}

export interface SuggestedAction {
  text: string;
}

export interface QuickReply {
  id: string;
  text: string;
  /** Optional little prefix icon/emoji */
  prefix?: string;
  /** Or a small avatar emoji */
  avatar?: string;
}
