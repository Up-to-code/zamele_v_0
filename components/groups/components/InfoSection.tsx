import React from "react";
import {
  View,
  Text,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { InfoSectionProps } from "../types";
import { COLORS } from "../constants";

export const InfoSection: React.FC<InfoSectionProps> = React.memo(({ group }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>حول</Text>
    <Text style={styles.description}>{group.description}</Text>

    <View style={styles.statsContainer}>
      <View style={styles.stat}>
        <Ionicons name="people" size={20} color={COLORS.primary} />
        <Text style={styles.statValue}>{group.members.toLocaleString()}</Text>
        <Text style={styles.statLabel}>عضو</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons name="wifi" size={20} color={COLORS.secondary} />
        <Text style={styles.statValue}>24</Text>
        <Text style={styles.statLabel}>متصل الآن</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons name="school" size={20} color={COLORS.accent} />
        <Text style={styles.statValue}>15</Text>
        <Text style={styles.statLabel}>فصل دراسي</Text>
      </View>
    </View>
  </View>
));

InfoSection.displayName = 'InfoSection';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
});