import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Ionicons } from "@expo/vector-icons";

export type T_NEWSDETAILS= NativeStackScreenProps<
    DashboardStackParamList,
    "NewsDetails"
>;

export type NewsDetailsListingRouteParams = {
  title?: string;
  sourceName?: string;
  timeAgo?: string;
  body?: string;
  category?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  tint?: string;
};