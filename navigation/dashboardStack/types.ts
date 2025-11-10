import { AddMembersRouteParams } from "@/screens/addMembers/types";
import { EmergencyContactsListingRouteParams } from "@/screens/emergencyContactsListing/types";
import { GroupChatRouteParams } from "@/screens/groupChat/types";
import { GroupInfoRouteParams } from "@/screens/groupInfo/types";
import { GroupListingRouteParams } from "@/screens/groupListing/types";
import { GroupMemberListingRouteParams } from "@/screens/groupMemberListing/types";

export type DashboardStackParamList = {
    Dashboard: {};
    GroupListing: GroupListingRouteParams;
    AddMembers: AddMembersRouteParams;
    GroupInfo: GroupInfoRouteParams;
    GroupMemberListing: GroupMemberListingRouteParams;
    GroupChat: GroupChatRouteParams;
    EmergencyContactsListing: EmergencyContactsListingRouteParams;
};
