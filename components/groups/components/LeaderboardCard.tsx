import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LeaderboardCardProps } from "../types";
import { COLORS } from "../constants";

export const LeaderboardCard: React.FC<LeaderboardCardProps> = React.memo(({ 
  entry, 
  index 
}) => {
  const isTopThree = index < 3;
  
  return (
    <View 
      style={[styles.leaderboardCard, isTopThree && styles.topLeaderboardCard]}
      accessibilityRole="button"
      accessibilityLabel={`المركز ${entry.rank}: ${entry.name} - ${entry.points} نقطة`}
    >
      <View style={styles.leaderboardRank}>
        <Text style={[styles.rankText, isTopThree && styles.topRankText]}>
          {entry.rank}
        </Text>
      </View>
      <Image 
        source={{ uri: entry.avatar }} 
        style={styles.leaderboardAvatar}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{entry.name}</Text>
        <Text style={styles.leaderboardPoints}>{entry.points} نقطة</Text>
      </View>
      <View style={[
        styles.progressBadge, 
        entry.progress > 0 ? styles.positiveProgress : styles.negativeProgress
      ]}>
        <Ionicons
          name={entry.progress > 0 ? "trending-up" : "trending-down"}
          size={12}
          color="#FFFFFF"
        />
        <Text style={styles.progressBadgeText}>
          {Math.abs(entry.progress)}%
        </Text>
      </View>
    </View>
  );
});

LeaderboardCard.displayName = 'LeaderboardCard';

const styles = StyleSheet.create({
  leaderboardCard: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  topLeaderboardCard: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FFD60A",
  },
  leaderboardRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.tertiary,
  },
  topRankText: {
    color: COLORS.accent,
  },
  leaderboardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  leaderboardPoints: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  positiveProgress: {
    backgroundColor: COLORS.secondary,
  },
  negativeProgress: {
    backgroundColor: COLORS.error,
  },
  progressBadgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 2,
  },
});