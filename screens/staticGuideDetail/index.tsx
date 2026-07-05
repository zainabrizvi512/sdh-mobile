import GuideDetailView from "@/screens/safetyGuideDetail/GuideDetailView";
import { STATIC_GUIDES } from "./data";
import { T_STATICGUIDEDETAIL } from "./types";

const StaticGuideDetail: React.FC<T_STATICGUIDEDETAIL> = ({ navigation, route }) => {
    const { guideKey } = route.params;
    const meta = STATIC_GUIDES[guideKey];

    return (
        <GuideDetailView
            guide={meta.guide}
            heroIcon={meta.heroIcon}
            heroTint={meta.heroTint}
            onBack={() => navigation.goBack()}
        />
    );
};

export default StaticGuideDetail;
