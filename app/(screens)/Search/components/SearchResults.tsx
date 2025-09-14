import React from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchResult , colorPalette } from '../types';
import SearchResultItem from './SearchResultItem';
 

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
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colorPalette.primaryBlue} />
        <Text style={styles.loadingText}>جاري البحث...</Text>
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
      />
    );
  }

  if (searchQuery) {
    return (
      <View style={styles.centered}>
        <Ionicons name="search" size={60} color={colorPalette.textSecondaryGray} />
        <Text style={styles.noResultsText}>لا توجد نتائج لبحثك</Text>
        <Text style={styles.noResultsSubtext}>جرب استخدام كلمات أخرى أو تغيير الفلاتر</Text>
      </View>
    );
  }

  return (
    <View style={styles.centered}>
      <Ionicons name="search" size={60} color={colorPalette.textSecondaryGray} />
      <Text style={styles.initialText}>ابحث عن المحتوى الذي تريد تعلمه</Text>
      <Text style={styles.initialSubtext}>كورسات، مجموعات، مناقشات، وغيرها</Text>
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
    color: colorPalette.textSecondaryGray,
  },
  noResultsText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: colorPalette.textBlack,
  },
  noResultsSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colorPalette.textSecondaryGray,
    textAlign: 'center',
  },
  initialText: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: colorPalette.textBlack,
  },
  initialSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: colorPalette.textSecondaryGray,
    textAlign: 'center',
  },
  resultsList: {
    padding: 16,
  },
});

export default SearchResults;