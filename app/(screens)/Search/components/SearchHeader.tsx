import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/config/constants/colors';
import { ArabicTranslations } from '@/config/constants/translations';
import { ResultType } from '../types';

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  setShowFilters: (show: boolean) => void;
  activeType: ResultType;
  setActiveType: (type: ResultType) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  setShowFilters,
  activeType,
  setActiveType,
}) => {
  const types: {key: ResultType, label: string}[] = [
    { key: 'all', label: ArabicTranslations.all },
    { key: 'account', label: ArabicTranslations.accounts },
    { key: 'group', label: ArabicTranslations.groups },
    { key: 'course', label: ArabicTranslations.courses },
    { key: 'event', label: ArabicTranslations.events },
  ];

  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={colors.gray} 
            style={styles.searchIcon} 
            accessibilityLabel="بحث"
          />
          <TextInput
            style={styles.searchInput}
            placeholder={ArabicTranslations.searchPlaceholder}
            placeholderTextColor={colors.gray}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            accessibilityLabel="حقل البحث"
            accessibilityHint="اكتب كلمات البحث هنا"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              accessibilityLabel="مسح البحث"
              accessibilityRole="button"
            >
              <Ionicons name="close-circle" size={20} color={colors.gray} />
            </TouchableOpacity>
          )}
        </View>
        
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowFilters(true)}
          accessibilityLabel="فتح الفلاتر"
          accessibilityRole="button"
        >
          <Ionicons name="filter" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.tabContainer}
        contentContainerStyle={styles.tabContent}
      >
        {types.map((type) => (
          <TouchableOpacity
            key={type.key}
            style={[
              styles.tab,
              activeType === type.key && styles.activeTab
            ]}
            onPress={() => setActiveType(type.key)}
            accessibilityLabel={type.label}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeType === type.key }}
          >
            <Text style={[
              styles.tabText,
              activeType === type.key && styles.activeTabText
            ]}>
              {type.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    backgroundColor: colors.white,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginLeft: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    textAlign: 'right',
    fontFamily: 'Cairo_Medium',
    paddingVertical: 8,
  },
  filterButton: {
    marginRight: 12,
    padding: 10,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 10,
  },
  tabContainer: {
    maxHeight: 40,
  },
  tabContent: {
    paddingHorizontal: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.lightGray,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
  },
  activeTabText: {
    color: colors.white,
    fontFamily: 'Cairo_Bold',
  },
});

export default SearchHeader;