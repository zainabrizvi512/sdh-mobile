import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { fancyHeaderStyles as s, HEADER_GREEN } from "./styles";
import { FancyAppHeaderProps } from "./types";

const FancyAppHeader: React.FC<FancyAppHeaderProps> = ({
  title,
  subtitle,
  badge,
  rightIcon,
  rightIconColor = "#fce7f3",
  rightElement,
  leftElement,
  showBack = true,
  onBack,
  tabs,
  activeTab,
  onTabChange,
  footer,
  headerContent,
}) => {
  const renderRight = () => {
    if (rightElement) return <View style={s.rightSlot}>{rightElement}</View>;
    if (rightIcon) {
      return (
        <View style={s.rightSlot}>
          <Ionicons name={rightIcon} size={26} color={rightIconColor} />
        </View>
      );
    }
    return <View style={s.leftSlot} />;
  };

  return (
    <View style={s.header}>
      <View style={s.headerGlow} />
      <View style={s.headerGlow2} />

      {headerContent ? (
        headerContent
      ) : (
        <>
          <View style={s.headerTop}>
            {leftElement ? (
              <View style={s.leftSlot}>{leftElement}</View>
            ) : showBack ? (
              <TouchableOpacity style={s.backBtn} onPress={onBack}>
                <Ionicons name="chevron-back" size={20} color="#FFF" />
              </TouchableOpacity>
            ) : (
              <View style={s.leftSlot} />
            )}

            {title ? <Text style={s.headerTitle}>{title}</Text> : <View style={{ flex: 1 }} />}

            {renderRight()}
          </View>

          {subtitle ? <Text style={s.headerSub}>{subtitle}</Text> : null}

          {badge ? (
            <View style={s.badge}>
              <Ionicons name={badge.icon} size={12} color="#fce7f3" />
              <Text style={s.badgeText}>{badge.label}</Text>
            </View>
          ) : null}
        </>
      )}

      {tabs && tabs.length > 0 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={s.tabsRow}>
          {tabs.map((t) => {
            const active = activeTab === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                onPress={() => onTabChange?.(t.id)}
                style={[s.tabBtn, active && s.tabBtnActive]}
              >
                {t.icon ? (
                  <Ionicons
                    name={t.icon}
                    size={13}
                    color={active ? HEADER_GREEN : "rgba(255,255,255,0.72)"}
                  />
                ) : null}
                <Text style={[s.tabText, active && s.tabTextActive]}>{t.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}

      {footer ? <View style={s.footer}>{footer}</View> : null}
    </View>
  );
};

export default FancyAppHeader;
export { fancyHeaderStyles, HEADER_GREEN, HEADER_ACCENT } from "./styles";
