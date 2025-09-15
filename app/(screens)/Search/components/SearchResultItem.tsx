import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/config/constants/colors';
import { ArabicTranslations } from '@/config/constants/translations';
import { SearchResult } from '../types';

interface SearchResultItemProps {
  item: SearchResult;
  onPress?: (item: SearchResult) => void;
  onFollowPress?: (item: SearchResult) => void;
}

const SearchResultItem: React.FC<SearchResultItemProps> = ({ 
  item, 
  onPress, 
  onFollowPress 
}) => {
  const [imageError, setImageError] = useState(false);
  
  const handleImageError = () => {
    setImageError(true);
  };

  const handlePress = () => {
    if (onPress) {
      onPress(item);
    }
  };

  const handleFollowPress = () => {
    if (onFollowPress) {
      onFollowPress(item);
    }
  };

  const renderMetaData = () => {
    switch (item.type) {
      case 'course':
        return (
          <View style={styles.metaRow}>
            <View style={styles.rating}>
              <Ionicons name="star" size={14} color={colors.gold} />
              <Text style={styles.metaText}>{item.rating}</Text>
              {item.reviews && (
                <Text style={styles.metaTextLight}>({item.reviews})</Text>
              )}
            </View>
            <Text style={[
              styles.price,
              !item.price && styles.freeText
            ]}>
              {item.price ? `${item.price} ر.س` : ArabicTranslations.free}
            </Text>
          </View>
        );
      
      case 'group':
        return (
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="people" size={14} color={colors.gray} />
              <Text style={styles.metaText}>{item.members} {ArabicTranslations.members}</Text>
            </View>
            <View style={[
              styles.privacyBadge,
              { backgroundColor: colors.lightGray }
            ]}>
              <Text style={styles.privacyText}>عام</Text>
            </View>
          </View>
        );
      
      case 'account':
        return (
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="people" size={14} color={colors.gray} />
              <Text style={styles.metaText}>{item.followers} {ArabicTranslations.followers}</Text>
            </View>
            {item.isVerified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="checkmark" size={12} color={colors.white} />
                <Text style={styles.verifiedText}>{ArabicTranslations.verified}</Text>
              </View>
            )}
          </View>
        );
      
      case 'event':
        return (
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Ionicons name="calendar" size={14} color={colors.gray} />
              <Text style={styles.metaText}>{item.date}</Text>
            </View>
            {item.attendees && (
              <View style={styles.metaItem}>
                <Ionicons name="people" size={14} color={colors.gray} />
                <Text style={styles.metaText}>{item.attendees} {ArabicTranslations.attending}</Text>
              </View>
            )}
          </View>
        );
      
      default:
        return null;
    }
  };

  const getAccessibilityLabel = () => {
    switch (item.type) {
      case 'course':
        return `دورة: ${item.title}، ${item.rating} تقييم، ${item.price ? `${item.price} ريال` : 'مجاني'}`;
      case 'group':
        return `مجموعة: ${item.title}، ${item.members} عضو`;
      case 'account':
        return `حساب: ${item.title}، ${item.followers} متابع${item.isVerified ? '، موثق' : ''}`;
      case 'event':
        return `حدث: ${item.title}، ${item.date}`;
      default:
        return item.title;
    }
  };

  return (
    <TouchableOpacity 
      style={styles.card}
      onPress={handlePress}
      accessibilityLabel={getAccessibilityLabel()}
      accessibilityRole="button"
    >
      {imageError ? (
        <View style={[
          styles.imagePlaceholder,
          item.type === 'account' ? styles.circleImage : styles.roundedImage
        ]}>
          <Ionicons 
            name={item.type === 'account' ? 'person' : 'image'} 
            size={24} 
            color={colors.gray} 
          />
        </View>
      ) : (
        <Image 
          source={{ uri: item.image }} 
          style={[
            styles.image,
            item.type === 'account' ? styles.circleImage : styles.roundedImage
          ]}
          onError={handleImageError}
          accessibilityIgnoresInvertColors
        />
      )}
      
      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={[
            styles.typeBadge,
            { backgroundColor: colors.lightGray }
          ]}>
            <Text style={styles.typeText}>
              {item.type === 'account' ? ArabicTranslations.accounts : 
               item.type === 'group' ? ArabicTranslations.groups :
               item.type === 'course' ? ArabicTranslations.courses :
               ArabicTranslations.events}
            </Text>
          </View>
        </View>
        
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
        
        {renderMetaData()}
        
        {item.type === 'course' && item.instructor && (
          <Text style={styles.instructor}>{ArabicTranslations.by} {item.instructor}</Text>
        )}
        
        {item.type === 'account' && (
          <TouchableOpacity 
            style={[
              styles.followButton,
              item.isFollowing ? styles.followingButton : styles.notFollowingButton
            ]}
            onPress={handleFollowPress}
            accessibilityLabel={item.isFollowing ? 'إلغاء متابعة' : 'متابعة'}
            accessibilityRole="button"
          >
            <Text style={[
              styles.followButtonText,
              item.isFollowing ? styles.followingButtonText : styles.notFollowingButtonText
            ]}>
              {item.isFollowing ? ArabicTranslations.following : ArabicTranslations.follow}
            </Text>
          </TouchableOpacity>
        )}
        
        {item.type === 'event' && item.location && (
          <View style={styles.location}>
            <Ionicons name="location" size={12} color={colors.gray} />
            <Text style={styles.locationText}>{item.location}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.white,
    borderRadius: 16,
    marginBottom: 16,
    marginHorizontal: 16,
    flexDirection: 'row-reverse',
    padding: 16,
    borderWidth: 1,
    borderColor: colors.lightGray,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    marginLeft: 12,
  },
  imagePlaceholder: {
    marginLeft: 12,
    backgroundColor: colors.lightGray,
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  roundedImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontFamily: 'Cairo_Bold',
    color: colors.darkGray,
    flex: 1,
    marginLeft: 8,
    textAlign: 'right',
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  typeText: {
    fontSize: 12,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    marginBottom: 12,
    lineHeight: 20,
    textAlign: 'right',
  },
  metaRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  rating: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  metaText: {
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: colors.darkGray,
    marginRight: 4,
  },
  metaTextLight: {
    fontSize: 12,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    marginRight: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: 'Cairo_Bold',
    color: colors.primary,
  },
  freeText: {
    color: colors.green,
  },
  privacyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  privacyText: {
    fontSize: 12,
    fontFamily: 'Cairo_Medium',
    color: colors.darkGray,
  },
  verifiedBadge: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedText: {
    fontSize: 12,
    fontFamily: 'Cairo_Medium',
    color: colors.white,
    marginRight: 4,
  },
  instructor: {
    fontSize: 12,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    marginTop: 4,
    textAlign: 'right',
  },
  followButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  followingButton: {
    backgroundColor: colors.lightGray,
  },
  notFollowingButton: {
    backgroundColor: colors.primary,
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo_Bold',
  },
  followingButtonText: {
    color: colors.darkGray,
  },
  notFollowingButtonText: {
    color: colors.white,
  },
  location: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginTop: 8,
  },
  locationText: {
    fontSize: 12,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    marginRight: 4,
  },
});

export default SearchResultItem;