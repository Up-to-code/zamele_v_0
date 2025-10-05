import { useUserStore } from "@/lib/store/userStore";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import {
  I18nManager,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Import Convex hooks
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useAuth } from "@clerk/clerk-expo";

// Force RTL layout for Arabic
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const colorPalette = {
  primary: "#007AFF",
  background: "#FFFFFF",
  card: "#F8F9FA",
  text: "#1C1C1E",
  textSecondary: "#8E8E93",
  border: "#E5E5EA",
  error: "#FF3B30", // Red color for unverified badge
};

const ProfileScreen = () => {
  const { userId } = useAuth();
  const userProfileData = useUserStore();

  // Fetch user data from Convex
  const userData = useQuery(
    api.users.getByClerkId, 
    userId ? { clerkUserId: userId } : "skip"
  );

  // Or use the comprehensive profile query
  const userProfile = useQuery(
    api.users.getUserProfile,
    userId ? { clerkUserId: userId } : "skip"
  );

  // Mutation for updating user points (example)
  const addPoints = useMutation(api.users.addUserPoints);

  const shortName = (email: string) => {
    const username = email.split('@')[0];
    // Limit to 20 characters and add ellipsis if longer
    return username.length > 20 ? username.substring(0, 20) + '...' : username;
  };

  const menuItems = [
    {
      id: "1",
      title: "مجموعاتي",
      icon: "people-outline",
      path: "/(screens)/groups",
    },
    {
      id: "2",
      title: "الأصدقاء",
      icon: "person-outline",
      path: "/(screens)/friends",
    },
    {
      id: "3",
      title: "الإعدادات",
      icon: "settings-outline",
      path: "/(screens)/settings",
    },
    {
      id: "4",
      title: "تعديل الملف",
      icon: "create-outline",
      path: "/(screens)/account/EditAccountScreen",
    },
    {
      id: "5",
      title: "المساعدة",
      icon: "help-circle-outline",
      path: "/(screens)/help/",
    },
    {
      id: "6",
      title: "السياسات",
      icon: "document-text-outline",
      path: "/(screens)/policies",
    },
  ];

  const handleEmailCopy = async () => {
    const email = userData?.email || userProfileData.email;
    await Clipboard.setStringAsync(email);
  };

  const navigateToScreen = (menuItem: any) => {
    if (menuItem.path) {
      router.push(menuItem.path as any);
    }
  };

  // Use Convex data if available, fallback to local store
  const displayName = userData?.name || userProfileData.name;
  const displayEmail = userData?.email || userProfileData.email;
  const displayAvatar = userData?.avatarUrl || userProfileData.avatarUrl;
  const isVerified = userData?.isVerified || userProfileData.isVerified;
  const userPoints = userData?.points || 0;
  const userTags = userData?.tags || [];

  // Handle adding points (example function)
  const handleAddPoints = async () => {
    if (userId) {
      try {
        await addPoints({ clerkUserId: userId, pointsToAdd: 10 });
      } catch (error) {
        console.error("Error adding points:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colorPalette.background} />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            {displayAvatar ? (
              <Image
                source={{ uri: displayAvatar }}
                style={styles.avatar}
              />
            ) : (
              <Image
                source={require("@/assets/images/avatar.png")}
                style={styles.avatar}
              />
            )}
            <TouchableOpacity style={styles.editIcon}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
          
          <Text style={styles.name}>{displayName}</Text>
          
          {/* Display user points if available */}
          {userPoints > 0 && (
            <View style={styles.pointsContainer}>
              <Ionicons name="trophy" size={16} color="#FFD700" />
              <Text style={styles.pointsText}>{userPoints} نقطة</Text>
            </View>
          )}

          <TouchableOpacity style={styles.emailRow} onPress={handleEmailCopy}>
            <Text style={styles.email}>{shortName(displayEmail)}</Text>
            <Ionicons name="copy-outline" size={16} color={colorPalette.textSecondary} />
          </TouchableOpacity>

          {!isVerified && (
            <TouchableOpacity style={styles.verifyBadge}>
              <Ionicons name="warning" size={14} color={colorPalette.error} />
              <Text style={styles.verifyText}>حساب غير موثق</Text>
            </TouchableOpacity>
          )}

          {/* Display user tags if available */}
          {userTags.length > 0 && (
            <View style={styles.tagsContainer}>
              {userTags.slice(0, 3).map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>{tag}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="share-outline" size={22} color={colorPalette.primary} />
            </View>
            <Text style={styles.actionText}>مشاركة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton}>
            <View style={styles.actionIcon}>
              <Ionicons name="person-add-outline" size={22} color={colorPalette.primary} />
            </View>
            <Text style={styles.actionText}>إضافة</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={() => Linking.openURL(`mailto:${displayEmail}`)}>
            <View style={styles.actionIcon}>
              <Ionicons name="mail-outline" size={22} color={colorPalette.primary} />
            </View>
            <Text style={styles.actionText}>بريد</Text>
          </TouchableOpacity>

          {/* Example: Add points button */}
          <TouchableOpacity style={styles.actionButton} onPress={handleAddPoints}>
            <View style={styles.actionIcon}>
              <Ionicons name="add-circle-outline" size={22} color={colorPalette.primary} />
            </View>
            <Text style={styles.actionText}>نقاط</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section - Show if userProfile data is available */}
        {userProfile?.stats && (
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.stats.postCount}</Text>
              <Text style={styles.statLabel}>منشور</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.stats.commentCount}</Text>
              <Text style={styles.statLabel}>تعليق</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userProfile.stats.communityCount}</Text>
              <Text style={styles.statLabel}>مجموعة</Text>
            </View>
          </View>
        )}

        {/* Menu Items */}
        <View style={styles.menu}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigateToScreen(item)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.menuIcon}>
                  <Ionicons name={item.icon as any} size={20} color={colorPalette.primary} />
                </View>
                <Text style={styles.menuText}>{item.title}</Text>
              </View>
              <Ionicons name="chevron-back" size={16} color={colorPalette.border} />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorPalette.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    padding: 24,
    backgroundColor: colorPalette.background,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 1,
    borderColor: colorPalette.border,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colorPalette.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colorPalette.background,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    color: colorPalette.text,
    marginBottom: 8,
    fontFamily: "Cairo-Bold",
  },
  pointsContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF9E6",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 8,
  },
  pointsText: {
    fontSize: 14,
    color: "#E6B800",
    marginRight: 4,
    fontFamily: "Cairo-SemiBold",
  },
  emailRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 12,
  },
  email: {
    fontSize: 16,
    color: colorPalette.textSecondary,
    marginLeft: 6,
    fontFamily: "Cairo-Regular",
    maxWidth: 200, // Ensure it doesn't overflow
  },
  verifyBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFE5E5", // Light red background
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#FFCDD2", // Slightly darker red border
  },
  verifyText: {
    fontSize: 12,
    color: colorPalette.error, // Red text color
    marginRight: 4,
    fontFamily: "Cairo-SemiBold",
  },
  tagsContainer: {
    flexDirection: "row-reverse",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 8,
  },
  tag: {
    backgroundColor: "#007AFF15",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 6,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: colorPalette.primary,
    fontFamily: "Cairo-Regular",
  },
  actions: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    padding: 16,
    backgroundColor: colorPalette.background,
  },
  actionButton: {
    alignItems: "center",
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#007AFF15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  actionText: {
    fontSize: 12,
    color: colorPalette.textSecondary,
    fontFamily: "Cairo-Regular",
  },
  statsContainer: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: colorPalette.card,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 16,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    color: colorPalette.primary,
    fontFamily: "Cairo-Bold",
  },
  statLabel: {
    fontSize: 14,
    color: colorPalette.textSecondary,
    marginTop: 4,
    fontFamily: "Cairo-Regular",
  },
  menu: {
    backgroundColor: colorPalette.background,
    marginTop: 8,
  },
  menuItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.border,
  },
  menuLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  menuIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: "#007AFF15",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  menuText: {
    fontSize: 16,
    color: colorPalette.text,
    fontFamily: "Cairo-Regular",
  },
});

export default ProfileScreen;