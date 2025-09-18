import React from "react";
import {
  Animated,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { HeaderProps } from "../types";
import { COLORS, CONSTANTS } from "../constants";

export const GroupHeader: React.FC<HeaderProps> = React.memo(
  ({ name, onBack, scrollY }) => {
    const insets = useSafeAreaInsets();

    const headerHeight = scrollY.interpolate({
      inputRange: [0, CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT],
      outputRange: [CONSTANTS.HEADER_MAX_HEIGHT, CONSTANTS.HEADER_MIN_HEIGHT],
      extrapolate: "clamp",
    });

    const headerOpacity = scrollY.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={[
          styles.header,
          {
            height: headerHeight,
            paddingTop: insets.top,
            opacity: headerOpacity,
          },
        ]}
      >
        <TouchableOpacity onPress={onBack} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
        </TouchableOpacity>

        <Animated.Text
          style={[
            styles.headerTitle,
            {
              opacity: headerOpacity,
              transform: [
                {
                  translateY: scrollY.interpolate({
                    inputRange: [0, 100],
                    outputRange: [20, 0],
                    extrapolate: "clamp",
                  }),
                },
              ],
            },
          ]}
          numberOfLines={1}
        >
          {name}
        </Animated.Text>

        <TouchableOpacity style={styles.headerButton}>
          <Ionicons
            name="ellipsis-vertical"
            size={20}
            color={COLORS.text.primary}
          />
        </TouchableOpacity>
      </Animated.View>
    );
  }
);

GroupHeader.displayName = "GroupHeader";

const styles = StyleSheet.create({
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
    backgroundColor: COLORS.background.secondary,
    overflow: "hidden",
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    textAlign: "center",
    marginHorizontal: 16,
  },
});