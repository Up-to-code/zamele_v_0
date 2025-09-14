import colors from "@/config/color";
import { Platform, StatusBar, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      paddingHorizontal: 16,
      paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 0) + 20 : 60,
      paddingBottom: 16,
      backgroundColor: colors.background,
    },
    headerTitle: {
      fontSize: 34,
      color: colors.tertiary,
      textAlign: 'right',
      fontWeight: '700',
      fontFamily: 'Cairo_Bold',
    },
    scrollView: {
      flex: 1,
    },
    sectionContainer: {
      marginBottom: 28,
    },
    sectionTitle: {
      fontSize: 15,
      color: colors.textSecondary,
      marginBottom: 8,
      paddingHorizontal: 20,
      textAlign: 'right',
      fontWeight: '500',
      letterSpacing: -0.2,
      fontFamily: 'Cairo_Medium',
    },
    menuContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginHorizontal: 16,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row-reverse',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      minHeight: 44,
    },
    menuIconContainer: {
      width: 32,
      height: 32,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: 12,
    },
    menuText: {
      fontSize: 17,
      color: colors.tertiary,
      textAlign: 'right',
      fontFamily: 'Cairo_Medium',
    },
    spacer: {
      flex: 1,
    },
    separator: {
      height: 0.5,
      backgroundColor: colors.border,
      marginLeft: 60, // Align with text
    },
    versionContainer: {
      alignItems: 'center',
      marginVertical: 24,
      marginBottom: 40,
    },
    versionText: {
      fontSize: 14,
      color: colors.textSecondary,
    },
  });

  export default styles;