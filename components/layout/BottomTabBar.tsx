import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { I18nManager, Platform, SafeAreaView, StyleSheet, TouchableOpacity, View } from "react-native";

export interface BottomTabBarProps {
  state: any;
  descriptors: any;
  navigation: any;
}

export const BottomTabBar: React.FC<BottomTabBarProps> = ({ state, descriptors, navigation }) => {
  return (
    <SafeAreaView>
      <View style={[styles.tabBarContainer, I18nManager.isRTL && styles.rtlRow]}>
        {Array.isArray(state?.routes) && state.routes.filter(Boolean).map((route: any, index: number) => {
          const descriptor = descriptors?.[route?.key];
          const options = descriptor?.options ?? {};
          const isFocused = state.index === index;

          if (route.name === "create") {
            return (
              <TouchableOpacity
                key={route.key}
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarTestID}
                onPress={() => navigation.navigate(route.name)}
                style={styles.centerButtonWrapper}
                activeOpacity={0.85}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              >
                <Ionicons name={isFocused ? "add" : "add-outline"} size={Platform.select({ ios: 26, default: 24 })} color="#007AFF" />
              </TouchableOpacity>
            );
          }

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const iconName = getIconName(route.name as string, isFocused);

          return (
            <TouchableOpacity
              key={route?.key ?? String(index)}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabItem}
              activeOpacity={0.7}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons name={iconName as any} size={Platform.select({ ios: 26, default: 24 })} color={isFocused ? "#007AFF" : "#8E8E93"} />
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

function getIconName(routeName: string, focused: boolean): string {
  switch (routeName) {
    case "index":
      return focused ? "home" : "home-outline";
    case "account":
      return focused ? "person" : "person-outline";
    case "groups":
      return focused ? "people" : "people-outline";
    default:
      return focused ? "ellipse" : "ellipse-outline";
  }
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#FFFFFF",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: "#E5E5EA",
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 2,
    minHeight: 44,
  },
  centerButtonWrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  rtlRow: { flexDirection: 'row-reverse' },
});

export default BottomTabBar;


