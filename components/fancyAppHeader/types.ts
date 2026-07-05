import { Ionicons } from "@expo/vector-icons";
import { ReactNode } from "react";

export type FancyHeaderTab = {
  id: string;
  label: string;
  icon?: keyof typeof Ionicons.glyphMap;
};

export type FancyAppHeaderProps = {
  title?: string;
  subtitle?: string;
  badge?: { icon: keyof typeof Ionicons.glyphMap; label: string };
  rightIcon?: keyof typeof Ionicons.glyphMap;
  rightIconColor?: string;
  rightElement?: ReactNode;
  leftElement?: ReactNode;
  showBack?: boolean;
  onBack?: () => void;
  tabs?: FancyHeaderTab[];
  activeTab?: string;
  onTabChange?: (id: string) => void;
  footer?: ReactNode;
  headerContent?: ReactNode;
};
