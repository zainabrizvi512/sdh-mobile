import { Sandwich1image } from "@/assets/images/svg";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import { T_SandwichA } from "./types";

const SandwichAIndex: React.FC<T_SandwichA> = ({ navigation }) => {
    const handleContinue = () => {
        navigation.navigate("SandwichB", {});
    };

    return (
        <View style={styles.root}>
            <View style={styles.container}>
                <View style={styles.topContent}>
                    <View style={styles.heroWrap}>
                        <Image source={Sandwich1image} style={styles.heroImage} />
                    </View>

                    <Text style={styles.title}>Your Trusted Guide in Times of Disaster</Text>

                    <Text style={styles.subtitle}>
                        Discover peace of mind with real-time guidance and resources designed
                        to keep you safe. Prepare, act and recover with ease.
                    </Text>
                </View>
                <View style={styles.footer}>
                    <Pressable
                        onPress={handleContinue}
                        style={({ pressed }) => [
                            styles.button,
                            pressed && { transform: [{ scale: 0.97 }], opacity: 0.9 },
                        ]}
                    >
                        <Text style={styles.buttonText}>Continue</Text>
                    </Pressable>

                    <View style={styles.dotsRow}>
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                        <View style={styles.dot} />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default SandwichAIndex;
