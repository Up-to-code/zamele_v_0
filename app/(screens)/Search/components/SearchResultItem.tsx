import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SearchResult, colorPalette } from '../types';

interface SearchResultItemProps {
  item: SearchResult;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ item }) => {
  return (
    <TouchableOpacity style={styles.resultCard}>
      <Image source={{ uri: item.image }} style={styles.resultImage} />
      <View style={styles.resultContent}>
        <Text style={styles.resultTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={styles.resultDescription} numberOfLines={2}>
          {item.description}
        </Text>
        
        <View style={styles.resultMeta}>
          {item.type === 'course' && (
            <>
              <View style={styles.metaRow}>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                  <Text style={styles.reviewsText}>({item.reviews})</Text>
                </View>
                <Text style={styles.priceText}>
                  {item.price ? `${item.price} ر.س` : 'مجاني'}
                </Text>
              </View>
              <Text style={styles.instructorText}>بواسطة {item.instructor}</Text>
            </>
          )}
          
          {item.type === 'group' && (
            <Text style={styles.membersText}>
              {item.members} عضو
            </Text>
          )}
          
          {item.type === 'discussion' && (
            <Text style={styles.commentsText}>
              {item.comments} تعليق • {item.author}
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  resultCard: {
    backgroundColor: colorPalette.cardWhite,
    borderRadius: 8,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: 'row',
    height: 100,
  },
  resultImage: {
    width: 100,
    height: '100%',
  },
  resultContent: {
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
  },
  resultTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colorPalette.textBlack,
    textAlign: 'right',
  },
  resultDescription: {
    fontSize: 12,
    color: colorPalette.textSecondaryGray,
    textAlign: 'right',
    marginVertical: 4,
  },
  resultMeta: {
    marginTop: 4,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    marginLeft: 4,
    fontSize: 12,
    fontWeight: 'bold',
    color: colorPalette.textBlack,
  },
  reviewsText: {
    marginLeft: 4,
    fontSize: 12,
    color: colorPalette.textSecondaryGray,
  },
  instructorText: {
    fontSize: 12,
    color: colorPalette.textSecondaryGray,
    textAlign: 'right',
    marginTop: 2,
  },
  priceText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colorPalette.primaryBlue,
  },
  membersText: {
    fontSize: 12,
    color: colorPalette.textSecondaryGray,
    textAlign: 'right',
  },
  commentsText: {
    fontSize: 12,
    color: colorPalette.textSecondaryGray,
    textAlign: 'right',
  },
});

export default SearchResultItem;