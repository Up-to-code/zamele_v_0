import React, { useState, useCallback } from 'react';
import { SafeAreaView, StatusBar, StyleSheet } from 'react-native';
import SearchHeader from './components/SearchHeader';
import SearchResults from './components/SearchResults';
import FilterModal from './components/FilterModal';
import { MOCK_SEARCH_RESULTS, FilterState, SearchResult, colorPalette } from './types';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [filters, setFilters] = useState<FilterState>({
    type: 'all',
    sort: 'relevance',
    price: 'any',
    rating: 'any',
    freeOnly: false,
  });

  const handleSearch = useCallback(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsSearching(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      const filteredResults = MOCK_SEARCH_RESULTS.filter(item => {
        // Filter by search query
        const matchesQuery = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
        
        // Filter by type
        const matchesType = filters.type === 'all' || item.type === filters.type;
        
        // Filter by price
        let matchesPrice = true;
        if (filters.price === 'free') {
          matchesPrice = !item.price || item.price === 0;
        } else if (filters.price === 'paid') {
          matchesPrice = !!item.price && item.price > 0;
        }
        
        // Filter by rating
        let matchesRating = true;
        if (filters.rating !== 'any' && item.rating) {
          matchesRating = item.rating >= parseInt(filters.rating);
        }
        
        // Filter by free only
        const matchesFreeOnly = !filters.freeOnly || !item.price || item.price === 0;
        
        return matchesQuery && matchesType && matchesPrice && matchesRating && matchesFreeOnly;
      });
      
      // Sort results
      let sortedResults = [...filteredResults];
      if (filters.sort === 'rating') {
        sortedResults.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      } else if (filters.sort === 'newest') {
        sortedResults.reverse();
      } else if (filters.sort === 'price_low') {
        sortedResults.sort((a, b) => (a.price || 0) - (b.price || 0));
      } else if (filters.sort === 'price_high') {
        sortedResults.sort((a, b) => (b.price || 0) - (a.price || 0));
      }
      
      setResults(sortedResults);
      setIsSearching(false);
    }, 1000);
  }, [searchQuery, filters]);

  const handleFilterChange = (category: keyof FilterState, value: string | boolean) => {
    setFilters(prev => ({ ...prev, [category]: value }));
  };

  const applyFilters = () => {
    setShowFilters(false);
    handleSearch();
  };

  const resetFilters = () => {
    setFilters({
      type: 'all',
      sort: 'relevance',
      price: 'any',
      rating: 'any',
      freeOnly: false,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colorPalette.backgroundGray} />
      
      <SearchHeader
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        handleSearch={handleSearch}
        setShowFilters={setShowFilters}
      />
      
      <SearchResults
        isSearching={isSearching}
        results={results}
        searchQuery={searchQuery}
      />
      
      <FilterModal
        visible={showFilters}
        onRequestClose={() => setShowFilters(false)}
        filters={filters}
        handleFilterChange={handleFilterChange}
        applyFilters={applyFilters}
        resetFilters={resetFilters}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.backgroundGray,
  },
});

export default SearchScreen;