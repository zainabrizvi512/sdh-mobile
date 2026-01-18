import { NavigatorScreenParams } from "@react-navigation/native";
import { DashboardStackParamList } from "../dashboardStack/types";
import { LoginSignupStackParamList } from "../loginSignUpStack/types";
EmergencyAidNetwork: undefined;



export type RootStackParamList = {
    LoginSignupStack: LoginSignupStackParamList;
    DashboardStack: NavigatorScreenParams<DashboardStackParamList>
}
