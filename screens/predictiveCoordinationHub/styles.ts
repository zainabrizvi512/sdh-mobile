import { StyleSheet } from "react-native";

export const COLORS = {
  bg: "#FFFFFF",
  text: "#0F172A",
  subText: "#6B7280",
  border: "#E5E7EB",
  card: "#FFFFFF",

  // badges
  badgeBlueBg: "#E6F0FF",
  badgeYellowBg: "#FFF3B0",
  badgeRedBg: "#F6E3E1",

  // quick replies
  replyBg: "#F9FAFB",
};

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  header: {
    paddingTop: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  burger: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  burgerLines: {
    fontSize: 22,
  },
  headerTitle: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
  },

  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },

  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontSize: 13,
    letterSpacing: 0.3,
    fontWeight: "800",
    color: COLORS.text,
  },

  card: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  rowTitle: {
    fontSize: 16,
    color: COLORS.text,
  },

  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    alignSelf: "flex-start",
  },
  badgeText: {
    fontWeight: "700",
    color: "#111827",
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginHorizontal: -12,
    opacity: 0.65,
  },

  actionsBox: {
    paddingLeft: 8,
    paddingTop: 4,
  },
  bulletRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  bulletDot: {
    fontSize: 18,
    lineHeight: 22,
    marginRight: 8,
  },
  bulletText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
  },

  repliesBox: {
    marginTop: 8,
    gap: 8,
  },
  replyRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.replyBg,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  replyPrefix: {
    width: 20,
    marginRight: 8,
    textAlign: "center",
  },
  replyAvatar: {
    width: 20,
    marginRight: 8,
    textAlign: "center",
    fontSize: 16,
  },
  replyText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
