import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_ADDMEMBERS = NativeStackScreenProps<
    DashboardStackParamList,
    "AddMembers"
>;

export type AddMembersRouteParams = {
    id: string
};