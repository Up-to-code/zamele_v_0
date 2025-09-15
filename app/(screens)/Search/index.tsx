import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/config/constants/colors";
import { ArabicTranslations } from "@/config/constants/translations";
import { FilterState, ResultType } from "./types";

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
  const getSortLabel = (sort: string) => {
    switch (sort) {
      case "relevance":
        return ArabicTranslations.relevance;
      case "rating":
        return ArabicTranslations.rating;
      case "newest":
        return ArabicTranslations.newest;
      case "price_low":
        return ArabicTranslations.priceLow;
      case "price_high":
        return ArabicTranslations.priceHigh;
      default:
        return sort;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "all":
        return ArabicTranslations.all;
      case "account":
        return ArabicTranslations.accounts;
      case "group":
        return ArabicTranslations.groups;
      case "course":
        return ArabicTranslations.courses;
      case "event":
        return ArabicTranslations.events;
      default:
        return type;
    }
  };

  const getPriceLabel = (price: string) => {
    switch (price) {
      case "any":
        return ArabicTranslations.any;
      case "free":
        return ArabicTranslations.free;
      case "paid":
        return ArabicTranslations.paid;
      default:
        return price;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
      accessibilityViewIsModal={true}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} accessibilityRole="header">
              {ArabicTranslations.filters}
            </Text>
            <TouchableOpacity
              onPress={onRequestClose}
              accessibilityLabel="إغلاق الفلاتر"
              accessibilityRole="button"
            >
              <Ionicons name="close" size={24} color={colors.darkGray} />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.filterOptions}>
            <View style={styles.filterSection}>
              <Text
                style={styles.filterSectionTitle}
                accessibilityRole="header"
              >
                {ArabicTranslations.type}
              </Text>
              <View style={styles.filterOptionsRow}>
                {["all", "account", "group", "course", "event"].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filters.type === type && styles.selectedFilterOption,
                    ]}
                    onPress={() => handleFilterChange("type", type)}
                    accessibilityLabel={getTypeLabel(type)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: filters.type === type }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.type === type &&
                          styles.selectedFilterOptionText,
                      ]}
                    >
                      {getTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text
                style={styles.filterSectionTitle}
                accessibilityRole="header"
              >
                {ArabicTranslations.sortBy}
              </Text>
              <View style={styles.filterOptionsColumn}>
                {[
                  "relevance",
                  "rating",
                  "newest",
                  "price_low",
                  "price_high",
                ].map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      styles.filterOption,
                      filters.sort === sort && styles.selectedFilterOption,
                    ]}
                    onPress={() => handleFilterChange("sort", sort)}
                    accessibilityLabel={getSortLabel(sort)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: filters.sort === sort }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.sort === sort &&
                          styles.selectedFilterOptionText,
                      ]}
                    >
                      {getSortLabel(sort)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text
                style={styles.filterSectionTitle}
                accessibilityRole="header"
              >
                {ArabicTranslations.price}
              </Text>
              <View style={styles.filterOptionsRow}>
                {["any", "free", "paid"].map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.filterOption,
                      filters.price === price && styles.selectedFilterOption,
                    ]}
                    onPress={() => handleFilterChange("price", price)}
                    accessibilityLabel={getPriceLabel(price)}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: filters.price === price }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.price === price &&
                          styles.selectedFilterOptionText,
                      ]}
                    >
                      {getPriceLabel(price)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <Text
                style={styles.filterSectionTitle}
                accessibilityRole="header"
              >
                {ArabicTranslations.minimumRating}
              </Text>
              <View style={styles.filterOptionsRow}>
                {["any", "4", "3", "2"].map((rating) => (
                  <TouchableOpacity
                    key={rating}
                    style={[
                      styles.filterOption,
                      filters.rating === rating && styles.selectedFilterOption,
                    ]}
                    onPress={() => handleFilterChange("rating", rating)}
                    accessibilityLabel={
                      rating === "any"
                        ? ArabicTranslations.any
                        : `${rating}+ ${ArabicTranslations.stars}`
                    }
                    accessibilityRole="radio"
                    accessibilityState={{ checked: filters.rating === rating }}
                  >
                    <Text
                      style={[
                        styles.filterOptionText,
                        filters.rating === rating &&
                          styles.selectedFilterOptionText,
                      ]}
                    >
                      {rating === "any"
                        ? ArabicTranslations.any
                        : `${rating}+ ${ArabicTranslations.stars}`}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.filterSection}>
              <View style={styles.switchOption}>
                <Text style={styles.switchOptionText}>
                  {ArabicTranslations.freeOnly}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.toggleSwitch,
                    filters.freeOnly && styles.toggleSwitchActive,
                  ]}
                  onPress={() =>
                    handleFilterChange("freeOnly", !filters.freeOnly)
                  }
                  accessibilityLabel={ArabicTranslations.freeOnly}
                  accessibilityRole="switch"
                  accessibilityState={{ checked: filters.freeOnly }}
                >
                  <View
                    style={[
                      styles.toggleKnob,
                      filters.freeOnly && styles.toggleKnobActive,
                    ]}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.modalActions}>
            <TouchableOpacity
              style={styles.resetButton}
              onPress={resetFilters}
              accessibilityLabel={ArabicTranslations.reset}
              accessibilityRole="button"
            >
              <Text style={styles.resetButtonText}>
                {ArabicTranslations.reset}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={applyFilters}
              accessibilityLabel={ArabicTranslations.applyFilters}
              accessibilityRole="button"
            >
              <Text style={styles.applyButtonText}>
                {ArabicTranslations.applyFilters}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "80%",
  },
  modalHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "Cairo_Bold",
    color: colors.darkGray,
    textAlign: "right",
  },
  filterOptions: {
    padding: 20,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: "Cairo_Bold",
    color: colors.darkGray,
    marginBottom: 12,
    textAlign: "right",
  },
  filterOptionsRow: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOptionsColumn: {
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: colors.lightGray,
    minWidth: 80,
    alignItems: "center",
  },
  selectedFilterOption: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: "Cairo_Medium",
    color: colors.darkGray,
    textAlign: "center",
  },
  selectedFilterOptionText: {
    color: colors.white,
  },
  switchOption: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  switchOptionText: {
    fontSize: 16,
    fontFamily: "Cairo_Medium",
    color: colors.darkGray,
    textAlign: "right",
  },
  toggleSwitch: {
    width: 50,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.lightGray,
    padding: 2,
    justifyContent: "center",
  },
  toggleSwitchActive: {
    backgroundColor: colors.primary,
  },
  toggleKnob: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  toggleKnobActive: {
    alignSelf: "flex-end",
  },
  modalActions: {
    flexDirection: "row-reverse",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
    gap: 12,
  },
  resetButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_Bold",
    color: colors.darkGray,
  },
  applyButton: {
    flex: 1,
    padding: 16,
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_Bold",
    color: colors.white,
  },
});

export default FilterModal;
