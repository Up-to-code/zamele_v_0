import React, { useCallback } from "react";
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import { FileFilterProps, FileFilter as FilterType } from "../types";
import { COLORS } from "../constants";

export const FileFilter: React.FC<FileFilterProps> = React.memo(({
  activeFilter,
  onFilterChange,
}) => {
  const filters: readonly FilterType[] = ["الكل", "PDF", "صورة", "مثبت"] as const;

  const handleFilterPress = useCallback((filter: FilterType) => {
    onFilterChange(filter);
  }, [onFilterChange]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
      bounces={false}
      decelerationRate="fast"
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filterPill, activeFilter === filter && styles.activeFilterPill]}
          onPress={() => handleFilterPress(filter)}
          accessibilityRole="button"
          accessibilityState={{ selected: activeFilter === filter }}
        >
          <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

FileFilter.displayName = 'FileFilter';

const styles = StyleSheet.create({
  filterContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background.tertiary,
    marginRight: 8,
  },
  activeFilterPill: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
});