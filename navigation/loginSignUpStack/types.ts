import { AddMembersRouteParams } from "@/screens/addmembers/types";
import { ChooseLocationRouteParams } from "@/screens/chooseLocation/types";
import { CreateGroupRouteParams } from "@/screens/createGroup/types";
import { GroupListingRouteParams } from "@/screens/groupListing/types";
import { GroupMemberListingRouteParams } from "@/screens/groupMemberListing/types";
import { LoginRouteParams } from "@/screens/login/types";
import { MapLocationRouteParams } from "@/screens/mapLocation/types";
import { TestRouteParams } from "@/screens/test/types";
import { VerifyOTPRouteParams } from "@/screens/verifyOTP/types";

export type LoginSignupStackParamList = {
    Login: LoginRouteParams;
    VerifyOTP: VerifyOTPRouteParams;
    SandwichA: {},
    SandwichB: {},
    SandwichC: {},
    ChooseLocation: ChooseLocationRouteParams;
    MapLocation: MapLocationRouteParams;
    GroupListing: GroupListingRouteParams;
    CreateGroup: CreateGroupRouteParams;
    AddMembers: AddMembersRouteParams;
   // GroupInfo: GroupInfoRouteParams;
   GroupInfo: { id: string; name?: string; members?: number; avatar?: string } | undefined;
   GroupMemberListing: GroupMemberListingRouteParams;
    Test: TestRouteParams
};
