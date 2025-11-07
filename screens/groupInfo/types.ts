import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_GROUPINFO = NativeStackScreenProps<
    DashboardStackParamList,
    "GroupInfo"
>;

export type GroupInfoRouteParams = {
    name: string;
    members: number;
    avatar: string;
    id: string;
};