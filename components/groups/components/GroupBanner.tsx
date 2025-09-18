import React from "react";
import { Animated, Image, View, StyleSheet } from "react-native";
import { BannerProps } from "../types";
import { COLORS, CONSTANTS } from "../constants";

export const GroupBanner: React.FC<BannerProps> = React.memo(
  ({ image, scrollY }) => {
    const bannerHeight = scrollY.interpolate({
      inputRange: [0, CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT],
      outputRange: [CONSTANTS.HEADER_MAX_HEIGHT, CONSTANTS.HEADER_MIN_HEIGHT],
      extrapolate: "clamp",
    });

    const bannerTranslateY = scrollY.interpolate({
      inputRange: [0, CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT],
      outputRange: [0, -(CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT) / 2],
      extrapolate: "clamp",
    });

    return (
      <Animated.View
        style={{
          height: bannerHeight,
          transform: [{ translateY: bannerTranslateY }],
          overflow: "hidden",
        }}
      >
        <Image source={{ uri: image }} style={styles.banner} resizeMode="cover" />
        <View style={styles.bannerOverlay} />
      </Animated.View>
    );
  }
);

GroupBanner.displayName = "GroupBanner";

const styles = StyleSheet.create({
  banner: {
    flex: 1,
    width: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
});