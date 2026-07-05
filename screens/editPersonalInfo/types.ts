import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_EDITPERSONALINFO = NativeStackScreenProps<
    DashboardStackParamList,
    "EditPersonalInfo"
>;

export type EditPersonalInfoRouteParams = {};

export type Gender = "male" | "female" | "other";
