import { LoginSignupStackParamList } from "@/navigation/loginSignUpStack/types";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export type T_NEWSDETAILS= NativeStackScreenProps<
    LoginSignupStackParamList,
    "NewsDetails"
>;

export type NewsDetailsListingRouteParams = {
  title?: string;
  sourceName?: string;
  timeAgo?: string;
  imageUrl?: string;
  body?: string;
};