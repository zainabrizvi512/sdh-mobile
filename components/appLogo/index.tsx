import React from "react";
import Svg, { Path, Rect } from "react-native-svg";

const GREEN = "#0f4c3a";
const PINK = "#ec4899";

type AppLogoProps = {
  size?: number;
};

/**
 * SDH mark: a shelter (house) holding a heart — "Shelter Disaster Help" in one shape.
 * Matches the app's green + pink color scheme so it can double as the splash/login mark.
 */
export default function AppLogo({ size = 96 }: AppLogoProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Rect x={0} y={0} width={100} height={100} rx={24} fill={GREEN} />
      <Path d="M50 18 L82 48 L82 82 L18 82 L18 48 Z" fill="#FFFFFF" />
      <Path
        d="M50 72
           C50 72 34 60 34 50
           C34 44 38 40 43 40
           C46.5 40 49 42 50 45
           C51 42 53.5 40 57 40
           C62 40 66 44 66 50
           C66 60 50 72 50 72 Z"
        fill={PINK}
      />
    </Svg>
  );
}
