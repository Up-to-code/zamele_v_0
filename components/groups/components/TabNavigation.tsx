import React, { useRef, useCallback } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  I18nManager,
} from "react-native";
import { TabNavigationProps } from "../types";
import { COLORS } from "../constants";

export const TabNavigation: React.FC<TabNavigationProps> = React.memo(({
  tabs,
  activeTab,
  onTabChange,
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabPress = useCallback((tab: string) => {
    onTabChange(tab as any);
  }, [onTabChange]);

  return (
    <View style={styles.tabContainer}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
        bounces={false}
        decelerationRate="fast"
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => handleTabPress(tab)}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab }}
            activeOpacity={0.7}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
});

TabNavigation.displayName = 'TabNavigation';

const styles = StyleSheet.create({
  tabContainer: {
    backgroundColor: COLORS.background.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 8,
    position: "relative",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: `${COLORS.primary}08`,
  },
  tabText: {
    fontSize: 15,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
});