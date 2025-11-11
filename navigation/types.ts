import { AddMembersRouteParams } from "@/screens/addMembers/types";
import { EmergencyContactsListingRouteParams } from "@/screens/emergencyContactsListing/types";
import { GroupChatRouteParams } from "@/screens/groupChat/types";
import { GroupInfoRouteParams } from "@/screens/groupInfo/types";
import { GroupListingRouteParams } from "@/screens/groupListing/types";
import { GroupMemberListingRouteParams } from "@/screens/groupMemberListing/types";
import { NewsDetailsListingRouteParams } from "@/screens/newsDetails/types";
import { NewsListingRouteParams } from "@/screens/newsListing/types";
import { SafetyGuideDetailRouteParams } from "@/screens/safetyGuideDetail/types";
import { SafetyGuidesRouteParams } from "@/screens/safetyGuides/types";
import type { NavigatorScreenParams } from "@react-navigation/native";

export type DashboardStackParamList = {
    Dashboard: undefined;
    GroupListing: GroupListingRouteParams;
    AddMembers: AddMembersRouteParams;
    GroupInfo: GroupInfoRouteParams;
    GroupMemberListing: GroupMemberListingRouteParams;
    GroupChat: GroupChatRouteParams;
    EmergencyContactsListing: EmergencyContactsListingRouteParams;
    SafetyGuides: SafetyGuidesRouteParams;
    SafetyGuideDetail: SafetyGuideDetailRouteParams;
    NewsListing: NewsListingRouteParams;
    NewsDetails: NewsDetailsListingRouteParams;
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