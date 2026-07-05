import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StaticGuideKey } from "./data";

export type T_STATICGUIDEDETAIL = NativeStackScreenProps<
    DashboardStackParamList,
    "StaticGuideDetail"
>;

export type StaticGuideDetailRouteParams = {
    guideKey: StaticGuideKey;
};
