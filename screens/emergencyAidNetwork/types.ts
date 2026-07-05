import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type TabKey = "alerts" | "reporting" | "tracking";

export type StockRow = {
  item: string;
  available: number;
};

export type Incident = {
  id: string;
  text: string;
  location_lat: number;
  location_lng: number;
  createdAt: string;
  sender?: {
    username: string;
  };
};

export type T_EMERGENCYAIDNETWORK = NativeStackScreenProps<
    DashboardStackParamList,
    "EmergencyAidNetwork"
>;