import React, { useMemo } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export interface TopTabsProps {
  tabs: string[];
  activeIndex: number;
  onChange: (index: number) => void;
}

const TopTabs: React.FC<TopTabsProps> = ({ tabs, activeIndex, onChange }) => {
  const items = useMemo(() => tabs, [tabs]);

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {items.map((label, idx) => {
          const isActive = activeIndex === idx;
          return (
            <TouchableOpacity
              key={`${label}-${idx}`}
              style={styles.tab}
              onPress={() => onChange(idx)}
              accessibilityRole="tab"
              accessibilityState={isActive ? { selected: true } : {}}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>{label}</Text>
              <View style={[styles.indicator, isActive && styles.indicatorActive]} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'flex-start', // Aligns tabs to the right
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    flexDirection: 'row-reverse', // Ensure normal row direction for proper alignment

  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabText: {
    fontSize: 14,
    color: '#6B7280',
    fontFamily: 'Cairo_Medium',
  },
  tabTextActive: {
    color: '#007AFF',
  },
  indicator: {
    marginTop: 6,
    height: 2,
    width: '100%',
    backgroundColor: 'transparent',
    borderRadius: 1,
  },
  indicatorActive: {
    backgroundColor: '#007AFF',
  },
});

export default TopTabs;