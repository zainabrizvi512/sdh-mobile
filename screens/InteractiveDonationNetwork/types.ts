import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type DonationTabKey = "campaigns" | "portal" | "chat" | "stories";

export type T_INTERACTIVEDONATION = NativeStackScreenProps<
  DashboardStackParamList,
  "InteractiveDonationNetwork"
>;
