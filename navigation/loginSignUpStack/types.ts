import { ChooseLocationRouteParams } from "@/screens/chooseLocation/types";
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
    Test: TestRouteParams
};
