import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_NEWSDETAILS= NativeStackScreenProps<
    DashboardStackParamList,
    "NewsDetails"
>;

export type NewsDetailsListingRouteParams = {
  title?: string;
  sourceName?: string;
  timeAgo?: string;
  imageUrl?: string;
  body?: string;
};