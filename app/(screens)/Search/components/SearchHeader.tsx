import React from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colorPalette } from '../types';

interface SearchHeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  handleSearch: () => void;
  setShowFilters: (show: boolean) => void;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({
  searchQuery,
  setSearchQuery,
  handleSearch,
  setShowFilters,
}) => {
  return (
    <View style={styles.searchHeader}>
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color={colorPalette.textSecondaryGray} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن كورسات، مجموعات، مناقشات..."
          placeholderTextColor={colorPalette.textSecondaryGray}
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color={colorPalette.textSecondaryGray} />
          </TouchableOpacity>
        )}
      </View>
      
      <TouchableOpacity style={styles.filterButton} onPress={() => setShowFilters(true)}>
        <Ionicons name="filter" size={20} color={colorPalette.primaryBlue} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colorPalette.cardWhite,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.borderLightGray,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorPalette.backgroundGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginRight: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    textAlign: 'right',
  },
  filterButton: {
    padding: 8,
    backgroundColor: `${colorPalette.primaryBlue}10`,
    borderRadius: 8,
  },
});

export default SearchHeader;