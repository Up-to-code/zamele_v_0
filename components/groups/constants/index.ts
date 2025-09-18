export const CONSTANTS = {
    HEADER_MAX_HEIGHT: 200,
    HEADER_MIN_HEIGHT: 60,
    SCROLL_THRESHOLD: 300,
    ANIMATION_THROTTLE: 16,
    REFRESH_TIMEOUT: 1000,
    MAX_RENDER_BATCH: 10,
    WINDOW_SIZE: 10,
    IMAGE_FADE_THRESHOLD: 150,
  } as const;
  
  export const COLORS = {
    primary: "#007AFF",
    secondary: "#34C759",
    accent: "#FF9500",
    error: "#FF3B30",
    text: {
      primary: "#1C1C1E",
      secondary: "#3C3C43",
      tertiary: "#8E8E93",
    },
    background: {
      primary: "#F5F5F7",
      secondary: "#FFFFFF",
      tertiary: "#F2F2F7",
    },
    border: "rgba(0,0,0,0.05)",
    overlay: "rgba(0,0,0,0.1)",
  } as const;