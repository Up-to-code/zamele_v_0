import React from "react";
import { Animated, Image } from "react-native";
import { AnimatedImageProps } from "../types";
import { CONSTANTS } from "../constants";

export const AnimatedImage: React.FC<AnimatedImageProps> = React.memo(({ 
  source, 
  style, 
  scrollY, 
  accessibilityIgnoresInvertColors 
}) => {
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, CONSTANTS.IMAGE_FADE_THRESHOLD],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, CONSTANTS.IMAGE_FADE_THRESHOLD],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        opacity: imageOpacity,
        transform: [{ scale: imageScale }],
      }}
    >
      <Image
        source={source}
        style={style}
        resizeMode="cover"
        accessibilityIgnoresInvertColors={accessibilityIgnoresInvertColors}
      />
    </Animated.View>
  );
});

AnimatedImage.displayName = 'AnimatedImage';