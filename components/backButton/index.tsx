import { GREEN } from "@/constants/theme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, TouchableOpacity, TouchableOpacityProps } from "react-native";

type Props = TouchableOpacityProps & {
    variant?: "light" | "solid";
    size?: number;
};

const BackButton: React.FC<Props> = ({ variant = "light", size = 44, style, ...rest }) => {
    const isSolid = variant === "solid";
    return (
        <TouchableOpacity
            hitSlop={12}
            style={[
                styles.base,
                { width: size, height: size, borderRadius: size / 2 },
                isSolid ? styles.solid : styles.light,
                style,
            ]}
            {...rest}
        >
            <Ionicons name="chevron-back" size={20} color={isSolid ? "#fff" : GREEN} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    base: { alignItems: "center", justifyContent: "center" },
    light: { backgroundColor: "#f3f3f3" },
    solid: { backgroundColor: GREEN },
});

export default BackButton;
