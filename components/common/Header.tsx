import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Image, 
  I18nManager, 
  StatusBar,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { shortName } from '@/lib/shortName';

// Set RTL to true for Arabic
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

export interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackPress?: () => void;
  showSearchButton?: boolean;
  onSearchPress?: () => void;
  showNotificationsButton?: boolean;
  onNotificationsPress?: () => void;
  notificationCount?: number;
  name?: string;
  plan?: string;
  avatarUrl?: string | null;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  onBackPress,
  showSearchButton = true,
  onSearchPress,
  showNotificationsButton = true,
  onNotificationsPress,
  notificationCount = 0,
  name = 'المستخدم',
  plan,
  avatarUrl
}) => {
 

  return (
    <View style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <View style={styles.container}>
        {/* Left Area - Icons */}
        <View style={styles.leftArea}>
          {showNotificationsButton && (
            <TouchableOpacity 
              onPress={onNotificationsPress} 
              style={styles.iconButton}
            >
              <Ionicons name="notifications-outline" size={22} color="#333" />
              {notificationCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>
                    {notificationCount > 99 ? '99+' : notificationCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
          
          {showSearchButton && (
            <TouchableOpacity 
              onPress={onSearchPress} 
              style={styles.iconButton}
            >
              <Ionicons name="search" size={22} color="#333" />
            </TouchableOpacity>
          )}
        </View>

        {/* Center Area - Title */}
        <View style={styles.centerArea}>
          {!!title && (
            <Text style={styles.titleText} numberOfLines={1}>
              {title}
            </Text>
          )}
        </View>

        {/* Right Area - User Info or Back Button */}
        <View style={styles.rightArea}>
          {showBackButton ? (
            <TouchableOpacity 
              onPress={onBackPress} 
              style={styles.backButton}
            >
              <Ionicons name="chevron-forward" size={26} color="#007AFF" />
            </TouchableOpacity>
          ) : (
            <View style={styles.userInfo}>
              <View style={styles.namePlan}>
                <Text style={styles.nameText} numberOfLines={1}>
                  {shortName(name, 5)}
                </Text>
                {!!plan && (
                  <Text style={styles.planText}>{plan}</Text>
                )}
              </View>
              {avatarUrl ? (
                <Image 
                  source={{ uri: avatarUrl }} 
                  style={styles.avatar} 
                  onError={(e) => console.log('Error loading avatar:', e.nativeEvent.error)}
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarInitial}>{shortName(name, 2) || 'U'}</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#FFFFFF',
  },
  container: {
    height: 56,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5E5EA',
    marginBottom: 0,
    paddingBottom: 0,
  },
  leftArea: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  centerArea: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  rightArea: {
    alignItems: 'flex-end',
  },
  backButton: {
    padding: 8,
  },
  titleText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E5E5EA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '600',
  },
  namePlan: {
    alignItems: 'flex-end',
  },
  nameText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '600',
  },
  planText: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  iconButton: {
    padding: 6,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: '#FF3B30',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
  },
});

export default Header;