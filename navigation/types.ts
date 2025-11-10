import type { NavigatorScreenParams } from "@react-navigation/native";

export type DashboardStackParamList = {
    Dashboard: undefined;
    GroupListing: undefined;
    AddMembers: undefined;
    GroupInfo: undefined;
    GroupMemberListing: undefined;
    GroupChat: { groupId: string } | undefined;
};

export type LoginSignupStackParamList = {
    SandwichA: undefined;
    SandwichB: undefined;
    SandwichC: undefined;
    Login: undefined;
    VerifyOTP: undefined;
    ChooseLocation: undefined;
    MapLocation: undefined;
    Test: undefined;
};

export type RootStackParamList = {
    LoginSignupStack: NavigatorScreenParams<LoginSignupStackParamList>;
    DashboardStack: NavigatorScreenParams<DashboardStackParamList>;
};