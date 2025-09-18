import React from "react";
import {
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { ScrollToTopButtonProps } from "../types";
import { COLORS } from "../constants";

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = React.memo(({
  isVisible,
  onPress,
}) => {
  const insets = useSafeAreaInsets();
  
  if (!isVisible) return null;
  
  return (
    <TouchableOpacity
      style={[styles.scrollToTopButton, { bottom: 90 + insets.bottom }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="الانتقال إلى الأعلى"
      activeOpacity={0.8}
    >
      <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
});

ScrollToTopButton.displayName = 'ScrollToTopButton';

const styles = StyleSheet.create({
  scrollToTopButton: {
    position: "absolute",
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});