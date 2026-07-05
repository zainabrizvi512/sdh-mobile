import { DashboardStackParamList } from "@/navigation/dashboardStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_FAMILYLIVELOCATION = NativeStackScreenProps<
    DashboardStackParamList,
    "FamilyLiveLocation"
>;

export type FamilyLiveLocationRouteParams = {};

export type MemberLocation = {
    userId: string;
    username: string;
    picture?: string | null;
    lat: number;
    lng: number;
    updatedAt: string;
};
