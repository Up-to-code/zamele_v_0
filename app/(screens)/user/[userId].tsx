import { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  I18nManager,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

// Force RTL layout for Arabic
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

// PayPal Color System
const colors = {
  primary: "#0070BA",
  primaryDark: "#003087", 
  primaryLight: "#009CDE",
  background: "#FFFFFF",
  surface: "#F5F7FA",
  text: "#2C2E30",
  textSecondary: "#6C7378",
  border: "#E6E8EB",
  success: "#00A650",
  warning: "#FF5F00",
  error: "#D0021B",
};

const OtherUserProfileScreen = () => {
  const { userId } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setUserData({
        name: "أحمد محمد",
        role: "طالب",
        university: "جامعة الملك سعود",
        joinDate: "يناير 2024",
        isVerified: true,
        points: "1.2K",
        posts: "24",
        comments: "156",
      });
      setIsLoading(false);
    }, 800);
  }, [userId]);

  // Quick Actions Data
  const quickActions = [
    { id: "1", title: "مراسلة", icon: "chatbubble", color: colors.primary },
    { id: "2", title: "مشاركة", icon: "share", color: colors.primary },
    { id: "3", title: "إضافة", icon: "person-add", color: colors.primary },
  ];

  // Menu Items Data
  const menuItems = [
    { id: "1", title: "المجموعات", icon: "people", count: "3" },
    { id: "2", title: "المنشورات", icon: "document-text", count: "12" },
    { id: "3", title: "التعليقات", icon: "chatbubble", count: "24" },
  ];

  // Loading State
  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>جاري تحميل البيانات...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      <ScrollView 
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Header Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle} accessibilityRole="header">
              الملف الشخصي
            </Text>
            <Text style={styles.bannerSubtitle}>
              عرض معلومات العضو
            </Text>
          </View>
        </View>

        {/* Main Profile Card */}
        <View style={styles.card}>
          {/* Avatar & Basic Info */}
          <View style={styles.profileHeader}>
            <View 
              style={styles.avatar}
              accessibilityLabel={`صورة ${userData.name}`}
            >
              <Ionicons name="person" size={36} color={colors.textSecondary} />
            </View>
            
            <View style={styles.userInfo}>
              <Text style={styles.userName} accessibilityRole="text">
                {userData.name}
              </Text>
              <Text style={styles.userRole}>
                {userData.role}
              </Text>
              
              {/* Verification Badge */}
              <View style={styles.verificationRow}>
                <Ionicons 
                  name="checkmark-circle" 
                  size={18} 
                  color={colors.success} 
                  accessibilityLabel="حساب موثق"
                />
                <Text style={styles.verificationText}>
                  حساب موثق
                </Text>
              </View>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* User Details */}
          <View style={styles.details}>
            <DetailRow 
              icon="business" 
              text={userData.university}
            />
            <DetailRow 
              icon="calendar" 
              text={`منضم منذ ${userData.joinDate}`}
            />
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>أدوات سريعة</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action) => (
              <ActionButton
                key={action.id}
                icon={action.icon}
                title={action.title}
                color={action.color}
                onPress={() => console.log(action.title)}
              />
            ))}
          </View>
        </View>

        {/* Activity Menu */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>النشاط</Text>
          <View style={styles.menuList}>
            {menuItems.map((item, index) => (
              <MenuItem
                key={item.id}
                icon={item.icon}
                title={item.title}
                count={item.count}
                isLast={index === menuItems.length - 1}
                onPress={() => console.log(item.title)}
              />
            ))}
          </View>
        </View>

        {/* Statistics */}
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>الإحصائيات</Text>
          <View style={styles.statsGrid}>
            <StatItem value={userData.points} label="نقطة" />
            <StatItem value={userData.posts} label="مشاركة" />
            <StatItem value={userData.comments} label="تعليق" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// Reusable Components
const DetailRow = ({ icon, text }: { icon: string; text: string }) => (
  <View style={styles.detailRow}>
    <Ionicons name={icon as any} size={20} color={colors.textSecondary} />
    <Text style={styles.detailText}>{text}</Text>
  </View>
);

const ActionButton = ({ 
  icon, 
  title, 
  color, 
  onPress 
}: { 
  icon: string; 
  title: string; 
  color: string;
  onPress: () => void;
}) => (
  <TouchableOpacity 
    style={styles.actionButton}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={title}
  >
    <View style={[styles.actionIcon, { backgroundColor: `${color}15` }]}>
      <Ionicons name={icon as any} size={24} color={color} />
    </View>
    <Text style={styles.actionText}>{title}</Text>
  </TouchableOpacity>
);

const MenuItem = ({ 
  icon, 
  title, 
  count, 
  isLast, 
  onPress 
}: { 
  icon: string; 
  title: string; 
  count: string;
  isLast: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.menuItem, !isLast && styles.menuItemBorder]}
    onPress={onPress}
    accessibilityRole="button"
    accessibilityLabel={`${title}، ${count} عنصر`}
  >
    <View style={styles.menuLeft}>
      <View style={styles.menuIcon}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <Text style={styles.menuText}>{title}</Text>
    </View>
    
    <View style={styles.menuRight}>
      <Text style={styles.menuCount}>{count}</Text>
      <Ionicons name="chevron-forward" size={16} color={colors.border} />
    </View>
  </TouchableOpacity>
);

const StatItem = ({ value, label }: { value: string; label: string }) => (
  <View style={styles.statItem} accessibilityLabel={`${value} ${label}`}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// Styles
const styles = StyleSheet.create({
  // Layout
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },

  // Typography
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: "Cairo-Regular",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colors.text,
    fontFamily: "Cairo-SemiBold",
    marginBottom: 16,
  },

  // Banner
  banner: {
    backgroundColor: colors.primary,
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  bannerContent: {
    alignItems: "flex-end",
  },
  bannerTitle: {
    fontSize: 24,
    fontWeight: "600",
    color: colors.background,
    fontFamily: "Cairo-Bold",
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: colors.background,
    opacity: 0.9,
    fontFamily: "Cairo-Regular",
  },

  // Cards
  card: {
    backgroundColor: colors.background,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Profile Section
  profileHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: colors.surface,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 16,
  },
  userInfo: {
    flex: 1,
    alignItems: "flex-end",
  },
  userName: {
    fontSize: 22,
    fontWeight: "600",
    color: colors.text,
    fontFamily: "Cairo-Bold",
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    color: colors.textSecondary,
    fontFamily: "Cairo-Regular",
    marginBottom: 8,
  },
  verificationRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  verificationText: {
    fontSize: 14,
    color: colors.success,
    marginRight: 6,
    fontFamily: "Cairo-SemiBold",
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },

  // Details
  details: {
    gap: 12,
  },
  detailRow: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  detailText: {
    fontSize: 16,
    color: colors.text,
    marginRight: 12,
    fontFamily: "Cairo-Regular",
  },

  // Actions
  actionsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  actionButton: {
    alignItems: "center",
    minWidth: 80,
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    color: colors.text,
    fontFamily: "Cairo-Regular",
    textAlign: "center",
  },

  // Menu
  menuList: {
    // No additional styles needed
  },
  menuItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: `${colors.primary}15`,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  menuText: {
    fontSize: 16,
    color: colors.text,
    fontFamily: "Cairo-Regular",
  },
  menuRight: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  menuCount: {
    fontSize: 14,
    color: colors.textSecondary,
    marginLeft: 8,
    fontFamily: "Cairo-Regular",
  },

  // Stats
  statsGrid: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "600",
    color: colors.primary,
    fontFamily: "Cairo-Bold",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    fontFamily: "Cairo-Regular",
  },
});

export default OtherUserProfileScreen;