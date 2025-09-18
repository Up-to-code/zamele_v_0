import React from "react";
import {
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { EmptyStateProps } from "../types";
import { COLORS } from "../constants";

export const EmptyState: React.FC<EmptyStateProps> = React.memo(({ tab }) => (
  <View style={styles.emptyState}>
    <Ionicons name="document-text-outline" size={48} color={COLORS.text.tertiary} />
    <Text style={styles.emptyStateText}>لا يوجد {tab} حتى الآن</Text>
  </View>
));

EmptyState.displayName = 'EmptyState';

const styles = StyleSheet.create({
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.text.tertiary,
    marginTop: 16,
    textAlign: "center",
  },
});