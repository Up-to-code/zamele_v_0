import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  FlatList,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";

// Force RTL layout
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

// Modern theme
const theme = {
  colors: {
    primary: "#0070BA",
    secondary: "#003087",
    accent: "#009CDE",
    neutral: "#2C2E2F",
    gray: "#6C7378",
    lightGray: "#F6F7F9",
    white: "#FFFFFF",
    success: "#007E33",
    warning: "#FF8800",
    border: "#DADDE1",
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
  },
  typography: {
    h1: {
      fontSize: 24,
      fontWeight: "700",
    },
    h2: {
      fontSize: 20,
      fontWeight: "600",
    },
    body: {
      fontSize: 16,
      fontWeight: "400",
    },
    caption: {
      fontSize: 14,
      fontWeight: "400",
    },
  },
};

// Types
interface User {
  id: string;
  name: string;
  avatar: string;
}

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  online: number;
  image: string;
  isMember: boolean;
}

interface Post {
  id: string;
  user: User;
  content: string;
  time: string;
  likes: number;
  comments: number;
  isLiked: boolean;
}

// Header Component
const GroupHeader = ({ group, onBack }: { group: Group; onBack: () => void }) => (
  <View style={styles.groupHeader}>
    <Image source={{ uri: group.image }} style={styles.groupCover} />
    
    <View style={styles.headerOverlay}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={24} color={theme.colors.white} />
      </TouchableOpacity>
    </View>

    <View style={styles.groupInfo}>
      <Text style={styles.groupName}>{group.name}</Text>
      <Text style={styles.groupDescription}>{group.description}</Text>
      
      <View style={styles.groupStats}>
        <View style={styles.statItem}>
          <Ionicons name="people" size={16} color={theme.colors.gray} />
          <Text style={styles.statText}>{group.members} أعضاء</Text>
        </View>
        <View style={styles.statItem}>
          <Ionicons name="ellipse" size={12} color={theme.colors.success} />
          <Text style={styles.statText}>{group.online} متصل الآن</Text>
        </View>
      </View>

      <View style={styles.groupActions}>
        {group.isMember ? (
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>المحادثة</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
            <Text style={styles.primaryButtonText}>انضم إلى المجموعة</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
);

// Tab Navigation Component
const TabNavigation = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (tab: string) => void }) => {
  const tabs = [
    { id: "posts", label: "المنشورات", icon: "document-text" },
    { id: "members", label: "الأعضاء", icon: "people" },
    { id: "info", label: "المعلومات", icon: "information-circle" },
  ];

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
        >
          <Ionicons 
            name={tab.icon as any}
            size={20} 
            color={activeTab === tab.id ? theme.colors.primary : theme.colors.gray} 
          />
          <Text style={[styles.tabText, activeTab === tab.id && styles.activeTabText]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// Post Item Component
const PostItem = ({ item, onToggleLike }: { item: Post; onToggleLike: (id: string) => void }) => (
  <View style={styles.postCard}>
    <View style={styles.postHeader}>
      <Image source={{ uri: item.user.avatar }} style={styles.postAvatar} />
      <View style={styles.postUserInfo}>
        <Text style={styles.postUserName}>{item.user.name}</Text>
        <Text style={styles.postTime}>{item.time}</Text>
      </View>
    </View>

    <Text style={styles.postContent}>{item.content}</Text>

    <View style={styles.postActions}>
      <TouchableOpacity
        style={styles.postAction}
        onPress={() => onToggleLike(item.id)}
      >
        <Ionicons
          name={item.isLiked ? "heart" : "heart-outline"}
          size={20}
          color={item.isLiked ? theme.colors.warning : theme.colors.gray}
        />
        <Text style={styles.postActionText}>{item.likes}</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.postAction}>
        <Ionicons name="chatbubble-outline" size={20} color={theme.colors.gray} />
        <Text style={styles.postActionText}>{item.comments}</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Main Component
const GroupDetailScreen = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [group, setGroup] = useState(groupData);
  const [posts, setPosts] = useState(postsData);
  const [activeTab, setActiveTab] = useState("posts");

  const toggleLike = (postId: string) => {
    setPosts(
      posts.map((post) =>
        post.id === postId
          ? { ...post, isLiked: !post.isLiked, likes: post.likes + (post.isLiked ? -1 : 1) }
          : post
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        <GroupHeader group={group} onBack={() => router.back()} />
        <TabNavigation activeTab={activeTab} onTabChange={setActiveTab} />
        
        {activeTab === "posts" && (
          <View style={styles.postsContainer}>
            {posts.map((item) => (
              <PostItem key={item.id} item={item} onToggleLike={toggleLike} />
            ))}
          </View>
        )}
        
        {activeTab !== "posts" && (
          <View style={styles.tabContent}>
            <Ionicons name={activeTab === "members" ? "people" : "information-circle"} size={48} color={theme.colors.gray} />
            <Text style={styles.tabPlaceholder}>
              {activeTab === "members" ? "قائمة الأعضاء ستظهر هنا" : "معلومات المجموعة ستظهر هنا"}
            </Text>
          </View>
        )}
      </ScrollView>

      {activeTab === "posts" && group.isMember && (
        <TouchableOpacity style={styles.createPostButton}>
          <Ionicons name="create" size={24} color="white" />
        </TouchableOpacity>
      )}
    </View>
  );
};

// Mock data
const groupData: Group = {
  id: "1",
  name: "مطوري React Native",
  description: "مجموعة مخصصة لمطوري React Native لمشاركة المعرفة والخبرات",
  members: 128,
  online: 23,
  image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80",
  isMember: true,
};

const postsData: Post[] = [
  {
    id: "1",
    user: {
      id: "2",
      name: "سارة عبدالله",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: "ما هي أفضل المكتبات لإدارة الحالة في React Native؟",
    time: "منذ ساعتين",
    likes: 24,
    comments: 8,
    isLiked: false,
  },
  {
    id: "2",
    user: {
      id: "3",
      name: "محمد علي",
      avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
    },
    content: "شاركني تجربتك مع React Native في تطبيقات الإنتاج الكبيرة",
    time: "منذ ٥ ساعات",
    likes: 42,
    comments: 12,
    isLiked: true,
  },
];

// Clean, modern styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.lightGray,
  },
  scrollView: {
    flex: 1,
  },
  groupHeader: {
    position: "relative",
    marginBottom: theme.spacing.md,
  },
  groupCover: {
    width: "100%",
    height: 200,
  },
  headerOverlay: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight : 50,
    left: theme.spacing.md,
    right: theme.spacing.md,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  groupInfo: {
    backgroundColor: theme.colors.white,
    padding: theme.spacing.md,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
    marginTop: -theme.borderRadius.lg,
  },
  groupName: {
    fontSize: 24,
    fontWeight: "700",
    color: theme.colors.neutral,
    marginBottom: theme.spacing.sm,
    textAlign: "right",
  },
  groupDescription: {
    fontSize: 16,
    color: theme.colors.gray,
    marginBottom: theme.spacing.md,
    textAlign: "right",
    lineHeight: 24,
  },
  groupStats: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginBottom: theme.spacing.md,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: theme.spacing.md,
  },
  statText: {
    fontSize: 14,
    color: theme.colors.gray,
    marginRight: theme.spacing.xs,
  },
  groupActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  actionButton: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontWeight: "600",
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: theme.colors.white,
    marginHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    padding: theme.spacing.xs,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  activeTab: {
    backgroundColor: `${theme.colors.primary}10`,
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.gray,
    fontWeight: "600",
    marginRight: theme.spacing.xs,
  },
  activeTabText: {
    color: theme.colors.primary,
  },
  postsContainer: {
    marginHorizontal: theme.spacing.md,
  },
  postCard: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  postHeader: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: theme.spacing.md,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: theme.spacing.sm,
  },
  postUserInfo: {
    alignItems: "flex-end",
  },
  postUserName: {
    fontSize: 16,
    fontWeight: "600",
    color: theme.colors.neutral,
  },
  postTime: {
    fontSize: 14,
    color: theme.colors.gray,
  },
  postContent: {
    fontSize: 16,
    color: theme.colors.neutral,
    lineHeight: 24,
    textAlign: "right",
    marginBottom: theme.spacing.md,
  },
  postActions: {
    flexDirection: "row-reverse",
    justifyContent: "flex-start",
  },
  postAction: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginLeft: theme.spacing.lg,
  },
  postActionText: {
    fontSize: 14,
    color: theme.colors.gray,
    marginRight: theme.spacing.xs,
  },
  tabContent: {
    backgroundColor: theme.colors.white,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.xl,
    marginHorizontal: theme.spacing.md,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 300,
  },
  tabPlaceholder: {
    fontSize: 16,
    color: theme.colors.gray,
    textAlign: "center",
    marginTop: theme.spacing.md,
  },
  createPostButton: {
    position: "absolute",
    bottom: theme.spacing.lg,
    left: theme.spacing.lg,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default GroupDetailScreen;