import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_SAFETYGUIDEDETAIL = NativeStackScreenProps<
    DashboardStackParamList,
    "SafetyGuideDetail"
>;

export type SafetyGuideDetailRouteParams = {
    id: string;
    title: string;
};