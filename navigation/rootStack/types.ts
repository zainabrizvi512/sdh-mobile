import { DashboardStackParamList } from "../dashboardStack/types";
import { LoginSignupStackParamList } from "../loginSignUpStack/types";


export type RootStackParamList = {
    LoginSignupStack: LoginSignupStackParamList;
    DashboardStack: DashboardStackParamList;
};
