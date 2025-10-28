import { Sandwich2image } from "@/assets/images/svg";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import { T_SandwichB } from "./types";

const SandwichBIndex: React.FC<T_SandwichB> = ({ navigation }) => {
    const handleContinue = () => {
        navigation.navigate("SandwichC", {});
    };

    return (
        <View style={styles.root}>
            <View style={styles.container}>
                <View style={styles.topContent}>
                    <View style={styles.heroWrap}>
                        <Image source={Sandwich2image} style={styles.heroImage} />
                    </View>

                    <Text style={styles.title}>Empowering Safety, On Step at a Time</Text>

                    <Text style={styles.subtitle}>
                        Stay one step ahead in any emergency
                        with tailored  solutions that protect you and your loved ones, Safety starts here
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
                        <View style={[styles.dot]} />
                        <View style={[styles.dot, styles.dotActive]} />
                        <View style={styles.dot} />
                    </View>
                </View>
            </View>
        </View>
    );
}

export default SandwichBIndex;