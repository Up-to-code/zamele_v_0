import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/config/constants/colors";
import { ArabicTranslations } from "@/config/constants/translations";
import { FilterState } from "./types";

interface FilterModalProps {
  visible: boolean;
  onRequestClose: () => void;
  filters: FilterState;
  handleFilterChange: (
    category: keyof FilterState,
    value: string | boolean
  ) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onRequestClose,
  filters,
  handleFilterChange,
  applyFilters,
  resetFilters,
}) => {
  // Apple-style color system
  const appleColors = {
    systemBlue: "#007AFF",
    systemGray: "#8E8E93",
    systemGray2: "#AEAEB2",
    systemGray3: "#C7C7CC",
    systemGray4: "#D1D1D6",
    systemGray5: "#E5E5EA",
    systemGray6: "#F2F2F7",
    systemBackground: "#FFFFFF",
    label: "#000000",
    secondaryLabel: "#3C3C4399",
  };

  const getSortLabel = (sort: string) => {
    const sortLabels: { [key: string]: string } = {
      relevance: ArabicTranslations.relevance,
      rating: ArabicTranslations.rating,
      newest: ArabicTranslations.newest,
      price_low: ArabicTranslations.priceLow,
      price_high: ArabicTranslations.priceHigh,
    };
    return sortLabels[sort] || sort;
  };

  const getTypeLabel = (type: string) => {
    const typeLabels: { [key: string]: string } = {
      all: ArabicTranslations.all,
      account: ArabicTranslations.accounts,
      group: ArabicTranslations.groups,
      course: ArabicTranslations.courses,
      event: ArabicTranslations.events,
    };
    return typeLabels[type] || type;
  };

  const getPriceLabel = (price: string) => {
    const priceLabels: { [key: string]: string } = {
      any: ArabicTranslations.any,
      free: ArabicTranslations.free,
      paid: ArabicTranslations.paid,
    };
    return priceLabels[price] || price;
  };

  const FilterSection = ({ 
    title, 
    children 
  }: { 
    title: string; 
    children: React.ReactNode;
  }) => (
    <View style={styles.filterSection}>
      <Text style={styles.sectionHeader}>{title}</Text>
      <View style={styles.sectionContent}>
        {children}
      </View>
    </View>
  );

  const FilterOption = ({ 
    label, 
    isSelected, 
    onPress 
  }: { 
    label: string; 
    isSelected: boolean; 
    onPress: () => void;
  }) => (
    <TouchableOpacity
      style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ checked: isSelected }}
    >
      <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
        {label}
      </Text>
      {isSelected && (
        <Ionicons 
          name="checkmark" 
          size={20} 
          color={appleColors.systemBlue} 
          style={styles.checkmark}
        />
      )}
    </TouchableOpacity>
  );

  const SwitchOption = ({ 
    label, 
    value, 
    onToggle 
  }: { 
    label: string; 
    value: boolean; 
    onToggle: () => void;
  }) => (
    <View style={styles.switchContainer}>
      <Text style={styles.switchLabel}>{label}</Text>
      <TouchableOpacity
        style={[styles.switch, value && styles.switchOn]}
        onPress={onToggle}
        accessibilityRole="switch"
        accessibilityState={{ checked: value }}
      >
        <View style={[styles.switchThumb, value && styles.switchThumbOn]} />
      </TouchableOpacity>
    </View>
  );

  return (
    <Modal
      animationType="slide"
      presentationStyle="pageSheet"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
      accessibilityViewIsModal={true}
    >
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerDragHandle} />
          <View style={styles.headerContent}>
            <Text style={styles.title} accessibilityRole="header">
              {ArabicTranslations.filters}
            </Text>
            <TouchableOpacity
              onPress={onRequestClose}
              style={styles.closeButton}
              accessibilityLabel="إغلاق"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={appleColors.systemBlue} />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView 
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentInsetAdjustmentBehavior="automatic"
        >
          {/* Type Filter */}
          <FilterSection title={ArabicTranslations.type}>
            <View style={styles.optionsGrid}>
              {["all", "account", "group", "course", "event"].map((type) => (
                <FilterOption
                  key={type}
                  label={getTypeLabel(type)}
                  isSelected={filters.type === type}
                  onPress={() => handleFilterChange("type", type)}
                />
              ))}
            </View>
          </FilterSection>

          {/* Sort Filter */}
          <FilterSection title={ArabicTranslations.sortBy}>
            <View style={styles.optionsList}>
              {["relevance", "rating", "newest", "price_low", "price_high"].map((sort) => (
                <FilterOption
                  key={sort}
                  label={getSortLabel(sort)}
                  isSelected={filters.sort === sort}
                  onPress={() => handleFilterChange("sort", sort)}
                />
              ))}
            </View>
          </FilterSection>

          {/* Price Filter */}
          <FilterSection title={ArabicTranslations.price}>
            <View style={styles.optionsGrid}>
              {["any", "free", "paid"].map((price) => (
                <FilterOption
                  key={price}
                  label={getPriceLabel(price)}
                  isSelected={filters.price === price}
                  onPress={() => handleFilterChange("price", price)}
                />
              ))}
            </View>
          </FilterSection>

          {/* Rating Filter */}
          <FilterSection title={ArabicTranslations.minimumRating}>
            <View style={styles.optionsGrid}>
              {["any", "4", "3", "2"].map((rating) => (
                <FilterOption
                  key={rating}
                  label={
                    rating === "any" 
                      ? ArabicTranslations.any 
                      : `${rating}+ ${ArabicTranslations.stars}`
                  }
                  isSelected={filters.rating === rating}
                  onPress={() => handleFilterChange("rating", rating)}
                />
              ))}
            </View>
          </FilterSection>

          {/* Free Only Toggle */}
          <View style={styles.toggleSection}>
            <SwitchOption
              label={ArabicTranslations.freeOnly}
              value={filters.freeOnly}
              onToggle={() => handleFilterChange("freeOnly", !filters.freeOnly)}
            />
          </View>
        </ScrollView>

        {/* Action Buttons */}
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.resetButton}
            onPress={resetFilters}
            accessibilityLabel={ArabicTranslations.reset}
            accessibilityRole="button"
          >
            <Text style={styles.resetButtonText}>{ArabicTranslations.reset}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.applyButton}
            onPress={applyFilters}
            accessibilityLabel={ArabicTranslations.applyFilters}
            accessibilityRole="button"
          >
            <Text style={styles.applyButtonText}>{ArabicTranslations.applyFilters}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
    marginTop: Platform.OS === 'ios' ? 44 : 0,
  },
  header: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerDragHandle: {
    width: 36,
    height: 5,
    backgroundColor: "#C6C6C8",
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: 12,
  },
  headerContent: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000000",
    fontFamily: "Cairo_Bold",
  },
  closeButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  filterSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    paddingVertical: 8,
  },
  sectionHeader: {
    fontSize: 17,
    fontWeight: "600",
    color: "#000000",
    fontFamily: "Cairo_SemiBold",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
  },
  sectionContent: {
    backgroundColor: "#FFFFFF",
  },
  optionsGrid: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    gap: 8,
  },
  optionsList: {
    paddingHorizontal: 8,
  },
  optionButton: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: "transparent",
    marginHorizontal: 8,
  },
  optionButtonSelected: {
    backgroundColor: "#007AFF15",
  },
  optionText: {
    fontSize: 17,
    color: "#000000",
    fontFamily: "Cairo_Regular",
    flex: 1,
    textAlign: "right",
  },
  optionTextSelected: {
    color: "#007AFF",
    fontFamily: "Cairo_SemiBold",
  },
  checkmark: {
    marginLeft: 8,
  },
  toggleSection: {
    backgroundColor: "#FFFFFF",
    marginTop: 16,
    paddingVertical: 12,
  },
  switchContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 17,
    color: "#000000",
    fontFamily: "Cairo_Regular",
    flex: 1,
    textAlign: "right",
  },
  switch: {
    width: 51,
    height: 31,
    borderRadius: 16,
    backgroundColor: "#E9E9EA",
    padding: 2,
    justifyContent: "center",
  },
  switchOn: {
    backgroundColor: "#007AFF",
  },
  switchThumb: {
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 1,
  },
  switchThumbOn: {
    alignSelf: "flex-end",
  },
  footer: {
    flexDirection: "row-reverse",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 12,
    borderTopWidth: 1,
    borderTopColor: "#C6C6C8",
    gap: 12,
  },
  resetButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "transparent",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#C6C6C8",
  },
  resetButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#007AFF",
    fontFamily: "Cairo_SemiBold",
  },
  applyButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#007AFF",
    borderRadius: 10,
  },
  applyButtonText: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "Cairo_SemiBold",
  },
});

export default FilterModal;