import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_GROUPMEMBERLISTING = NativeStackScreenProps<
    DashboardStackParamList,
    "GroupMemberListing"
>;

export type GroupMemberListingRouteParams = {
    id: string
};