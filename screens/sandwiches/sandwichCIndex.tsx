import { Sandwich3image } from "@/assets/images/svg";
import { Image, Pressable, Text, View } from "react-native";
import { styles } from "./styles";
import { T_SandwichC } from "./types";

const SandwichCIndex: React.FC<T_SandwichC> = ({ navigation }) => {
    const handleContinue = () => {
        navigation.navigate("Login", {});
    };

    return (
        <View style={styles.root}>
            <View style={styles.container}>
                <View style={styles.topContent}>
                    <View style={styles.heroWrap}>
                        <Image source={Sandwich3image} style={styles.heroImage} />
                    </View>

                    <Text style={styles.title}>Preparedness at your Fingertips </Text>

                    <Text style={styles.subtitle}>
                        Take charge of your safety with expert tools and advice that prepare you for the unexpected. Confidence is key
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
                        <Text style={styles.buttonText}>Get Started</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    );
}

export default SandwichCIndex;