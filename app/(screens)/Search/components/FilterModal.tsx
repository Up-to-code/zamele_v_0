import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  Modal,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FilterState, FILTER_OPTIONS, colorPalette } from '../types';

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
  resetFilters,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onRequestClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>فلاتر البحث</Text>
            <TouchableOpacity onPress={onRequestClose}>
              <Ionicons name="close" size={24} color={colorPalette.textBlack} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.filtersContainer}>
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>نوع المحتوى</Text>
              <View style={styles.filterOptions}>
                {FILTER_OPTIONS.type.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      filters.type === option.value && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilterChange('type', option.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.type === option.value && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>ترتيب النتائج</Text>
              <View style={styles.filterOptions}>
                {FILTER_OPTIONS.sort.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      filters.sort === option.value && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilterChange('sort', option.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.sort === option.value && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>السعر</Text>
              <View style={styles.filterOptions}>
                {FILTER_OPTIONS.price.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      filters.price === option.value && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilterChange('price', option.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.price === option.value && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>التقييم</Text>
              <View style={styles.filterOptions}>
                {FILTER_OPTIONS.rating.map(option => (
                  <TouchableOpacity
                    key={option.value}
                    style={[
                      styles.filterOption,
                      filters.rating === option.value && styles.filterOptionActive
                    ]}
                    onPress={() => handleFilterChange('rating', option.value)}
                  >
                    <Text style={[
                      styles.filterOptionText,
                      filters.rating === option.value && styles.filterOptionTextActive
                    ]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            
            <View style={styles.filterSection}>
              <View style={styles.switchFilter}>
                <Text style={styles.switchLabel}>عرض المجاني فقط</Text>
                <Switch
                  value={filters.freeOnly}
                  onValueChange={(value) => handleFilterChange('freeOnly', value)}
                  trackColor={{ false: '#767577', true: colorPalette.primaryBlue }}
                />
              </View>
            </View>
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity style={styles.resetButton} onPress={resetFilters}>
              <Text style={styles.resetButtonText}>إعادة الضبط</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
              <Text style={styles.applyButtonText}>تطبيق الفلاتر</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: colorPalette.cardWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.borderLightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colorPalette.textBlack,
  },
  filtersContainer: {
    padding: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colorPalette.textBlack,
    marginBottom: 12,
    textAlign: 'right',
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    marginHorizontal: -4,
  },
  filterOption: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorPalette.borderLightGray,
    marginLeft: 8,
    marginBottom: 8,
  },
  filterOptionActive: {
    backgroundColor: colorPalette.primaryBlue,
    borderColor: colorPalette.primaryBlue,
  },
  filterOptionText: {
    fontSize: 14,
    color: colorPalette.textBlack,
  },
  filterOptionTextActive: {
    color: colorPalette.cardWhite,
  },
  switchFilter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 16,
    color: colorPalette.textBlack,
    textAlign: 'right',
  },
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colorPalette.borderLightGray,
  },
  resetButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colorPalette.borderLightGray,
    borderRadius: 12,
    marginRight: 12,
  },
  resetButtonText: {
    fontSize: 16,
    color: colorPalette.textBlack,
  },
  applyButton: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colorPalette.primaryBlue,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 16,
    color: colorPalette.cardWhite,
    fontWeight: 'bold',
  },
});

export default FilterModal;