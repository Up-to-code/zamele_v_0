// constants/colors.ts
/**
 * App color palette
 */
export const colors = {
    // Primary colors
    primary: "#007AFF",
    primaryDark: "#0056CC",
    primaryLight: "#4DA6FF",
    
    // Background colors
    background: "#F8F9FA",
    card: "#FFFFFF",
    modal: "#FFFFFF",
    
    // Text colors
    textPrimary: "#1C1C1E",
    textSecondary: "#8E8E93",
    textTertiary: "#C7C7CC",
    
    // Border colors
    border: "#E5E5EA",
    borderLight: "#F0F0F0",
    
    // Status colors
    error: "#FF3B30",
    success: "#34C759",
    warning: "#FF9500",
    info: "#5AC8FA",
    
    // Grayscale
    gray50: "#F8F9FA",
    gray100: "#E9ECEF",
    gray200: "#DEE2E6",
    gray300: "#CED4DA",
    gray400: "#ADB5BD",
    gray500: "#6C757D",
    gray600: "#495057",
    gray700: "#343A40",
    gray800: "#212529",
    gray900: "#000000",
    
    // Semantic colors
    shadow: "rgba(0, 0, 0, 0.1)",
    overlay: "rgba(0, 0, 0, 0.5)",
  };
  
  /**
   * Theme colors object for easy access
   */
  export const theme = {
    light: {
      ...colors,
      isDark: false,
    },
    dark: {
      ...colors,
      background: "#000000",
      card: "#1C1C1E",
      textPrimary: "#FFFFFF",
      textSecondary: "#AEAEB2",
      border: "#38383A",
      isDark: true,
    },
  };