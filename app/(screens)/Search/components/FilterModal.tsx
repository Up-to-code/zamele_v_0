import React from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/config/constants/colors';
import { ArabicTranslations } from '@/config/constants/translations';
import { FilterState, ResultType } from '../types';

interface FilterModalProps {
  visible: boolean;
  onRequestClose: () => void;
  filters: FilterState;
  handleFilterChange: (category: keyof FilterState, value: string | boolean) => void;
  applyFilters: () => void;
  resetFilters: () => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  visible,
  onRequestClose,
  filters,
  handleFilterChange,
  applyFilters,
  resetFilters
}) => {
  const getSortLabel = (sort: string) => {
    switch(sort) {
      case 'relevance': return ArabicTranslations.relevance;
      case 'rating': return ArabicTranslations.rating;
      case 'newest': return ArabicTranslations.newest;
      case 'price_low': return ArabicTranslations.priceLow;
      case 'price_high': return ArabicTranslations.priceHigh;
      default: return sort;
    }
  };

  const getTypeLabel = (type: string) => {
    switch(type) {
      case 'all': return ArabicTranslations.all;
      case 'account': return ArabicTranslations.accounts;
      case 'group': return ArabicTranslations.groups;
      case 'course': return ArabicTranslations.courses;
      case 'event': return ArabicTranslations.events;
      default: return type;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{ArabicTranslations.filters}</Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Ionicons name="close" size={24} color={colors.darkGray} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filterOptions}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>{ArabicTranslations.type}</Text>
              <View style={styles.filterOptionsRow}>
                {['all', 'account', 'group', 'course', 'event'].map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterOption,
                      filters.type === type && styles.selectedFilterOption
                    ]}
                    onPress={() => handleFilterChange('type', type)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.type === type && styles.selectedFilterOptionText
                    ]}>
                      {getTypeLabel(type)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>{ArabicTranslations.sortBy}</Text>
              <View style={styles.filterOptionsColumn}>
                {['relevance', 'rating', 'newest', 'price_low', 'price_high'].map((sort) => (
                  <TouchableOpacity
                    key={sort}
                    style={[
                      styles.filterOption,
                      filters.sort === sort && styles.selectedFilterOption
                    ]}
                    onPress={() => handleFilterChange('sort', sort)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.sort === sort && styles.selectedFilterOptionText
                    ]}>
                      {getSortLabel(sort)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>{ArabicTranslations.price}</Text>
              <View style={styles.filterOptionsRow}>
                {['any', 'free', 'paid'].map((price) => (
                  <TouchableOpacity
                    key={price}
                    style={[
                      styles.filterOption,
                      filters.price === price && styles.selectedFilterOption
                    ]}
                    onPress={() => handleFilterChange('price', price)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.price === price && styles.selectedFilterOptionText
                    ]}>
                      {price === 'any' ? ArabicTranslations.any : 
                       price === 'free' ? ArabicTranslations.free : 
                       ArabicTranslations.paid}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalActions}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>{ArabicTranslations.reset}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>{ArabicTranslations.applyFilters}</Text>
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Cairo_600SemiBold',
    color: colors.darkGray,
    textAlign: 'right',
  },
  filterOptions: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
    color: colors.darkGray,
    marginBottom: 12,
    textAlign: 'right',
  },
  filterOptionsRow: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterOptionsColumn: {
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
  },
  selectedFilterOption: {
    backgroundColor: colors.primary,
  },
  filterOptionText: {
    fontSize: 14,
    fontFamily: 'Cairo_400Regular',
    color: colors.darkGray,
    textAlign: 'right',
  },
  selectedFilterOptionText: {
    color: colors.white,
  },
  modalActions: {
    flexDirection: 'row-reverse',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.lightGray,
  },
  resetButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderBottomRightRadius: 16,
  },
  resetButtonText: {
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
    color: colors.darkGray,
  },
  applyButton: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 16,
  },
  applyButtonText: {
    fontSize: 16,
    fontFamily: 'Cairo_600SemiBold',
    color: colors.white,
  },
});

export default FilterModal;