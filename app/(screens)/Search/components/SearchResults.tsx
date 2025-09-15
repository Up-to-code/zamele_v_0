import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchResult } from '../types';
import SearchResultItem from './SearchResultItem';
import { colors } from '@/config/constants/colors';
import { ArabicTranslations } from '@/config/constants/translations';
 
interface SearchResultsProps {
  isSearching: boolean;
  results: SearchResult[];
  searchQuery: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({
  isSearching,
  results,
  searchQuery,
}) => {
  if (isSearching) {
    return (
      <View style={styles.centered} accessibilityLabel="جاري البحث">
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>{ArabicTranslations.searching}</Text>
      </View>
    );
  }

  if (results.length > 0) {
    return (
      <FlatList
        data={results}
        renderItem={({ item }) => <SearchResultItem item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.resultsList}
        showsVerticalScrollIndicator={false}
        accessibilityLabel="نتائج البحث"
      />
    );
  }

  if (searchQuery) {
    return (
      <View style={styles.centered} accessibilityLabel="لا توجد نتائج">
        <Ionicons name="search" size={60} color={colors.gray} />
        <Text style={styles.noResultsText}>{ArabicTranslations.noResults}</Text>
        <Text style={styles.noResultsSubtext}>{ArabicTranslations.tryDifferent}</Text>
      </View>
    );
  }

  return (
    <View style={styles.centered} accessibilityLabel="شاشة البحث">
      <Ionicons name="search" size={60} color={colors.gray} />
      <Text style={styles.initialText}>{ArabicTranslations.initialText}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    textAlign: 'right',
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 18,
    fontFamily: 'Cairo_Bold',
    color: colors.darkGray,
    textAlign: 'right',
  },
  noResultsSubtext: {
    marginTop: 8,
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
  },
  initialText: {
    marginTop: 16,
    fontSize: 16,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    textAlign: 'center',
  },
  resultsList: {
    padding: 16,
  },
});

export default SearchResults;