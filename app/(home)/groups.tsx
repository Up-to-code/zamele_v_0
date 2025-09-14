import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  Platform,
  useWindowDimensions,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
 import { router } from "expo-router";
// Define TypeScript interfaces
interface Group {
  id: string;
  name: string;
  members: number;
  lastActive: string;
  image: string;
  isPrivate: boolean;
  unreadCount: number;
  memberAvatars?: string[];
}

// Mock data for groups with proper typing
const groupsData: Group[] = [
  {
    id: "1",
    name: "مطوري React Native",
    members: 128,
    lastActive: "نشط الآن",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    isPrivate: false,
    unreadCount: 3,
    memberAvatars: [
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: "2",
    name: "مصممي UI/UX",
    members: 86,
    lastActive: "نشط منذ ٢ ساعة",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    isPrivate: true,
    unreadCount: 0,
    memberAvatars: [
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: "3",
    name: "متعلمي اللغة الإنجليزية",
    members: 245,
    lastActive: "نشط منذ ٥ دقائق",
    image:
      "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    isPrivate: false,
    unreadCount: 12,
    memberAvatars: [
      "https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
    ],
  },
  {
    id: "4",
    name: "مجموعة القراءة",
    members: 72,
    lastActive: "نشط أمس",
    image:
      "https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    isPrivate: true,
    unreadCount: 0,
    // Intentionally leaving memberAvatars undefined to test error handling
  },
];

// Custom ParallaxScrollView component
const ParallaxScrollView = ({
  children,
  backgroundColor = "#FFFFFF",
}: {
  children: React.ReactNode;
  backgroundColor?: string;
}) => {
  const { height } = useWindowDimensions();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor }}
      contentContainerStyle={{
        minHeight: height,
      }}
      scrollEventThrottle={16}
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};

// Promotional banner component
const PromoBanner = () => {
  const { width } = useWindowDimensions();

  return (
    <View style={[styles.banner, { width: width - 32 }]}>
      <View style={styles.bannerContent}>
        <Text style={styles.bannerTitle}>انضم إلى مجتمعنا</Text>
        <Text style={styles.bannerText}>
          اكتشف مجموعات جديدة تناسب اهتماماتك
        </Text>
        <TouchableOpacity style={styles.bannerButton}>
          <Text style={styles.bannerButtonText}>استكشف الآن</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={{
          uri:
            "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
        }}
        style={styles.bannerImage}
      />
    </View>
  );
};

const GroupsScreen = () => {
  const [groups, setGroups] = useState<Group[]>(groupsData);
  const { width } = useWindowDimensions();

  const renderGroupItem = ({ item }: { item: Group }) => {
    // Safe handling of memberAvatars to prevent undefined errors
    const memberAvatars = item.memberAvatars || [];

    return (
      <TouchableOpacity style={styles.groupCard}
       onPress={() => router.push(`/(screens)/groups/[_id]?id=${item.id}`)}
      >
        <Image
          source={{ uri: item.image }}
          style={[
            styles.groupImage,
            { width: width * 0.14, height: width * 0.14 },
          ]}
        />
        <View style={styles.groupInfo}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.isPrivate && (
              <Ionicons
                name="lock-closed"
                size={16}
                color="#8E8E93"
                style={styles.lockIcon}
              />
            )}
          </View>

          <View style={styles.memberAvatars}>
            {memberAvatars.map((avatar, index) => (
              <Image
                key={index}
                source={{ uri: avatar }}
                style={[
                  styles.memberAvatar,
                  { marginLeft: index > 0 ? -8 : 0 },
                ]}
              />
            ))}
            <Text style={styles.memberCount}>+{item.members} أعضاء</Text>
          </View>

          <View style={styles.groupDetails}>
            <Text style={styles.groupActivity}>{item.lastActive}</Text>
          </View>
        </View>

        <View style={styles.groupRightSection}>
          {item.unreadCount > 0 && (
            <View style={styles.unreadBadge}>
              <Text style={styles.unreadText}>{item.unreadCount}</Text>
            </View>
          )}
          <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ParallaxScrollView>
        <View style={styles.listContent}>
          {/* Fixed Header */}
          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>المجموعات</Text>
          </View>
          <PromoBanner />

          <FlatList
            data={groups}
            renderItem={renderGroupItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </ParallaxScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  listHeader: {
    position: "absolute",
    top: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    left: 0,
    right: 0,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  listTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000000",
    textAlign: "right",
    fontFamily: "Cairo_Bold",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 80, // Space for the fixed header
  },
  banner: {
    flexDirection: "row",
    backgroundColor: "#F2F8FF",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    overflow: "hidden",
    marginBottom: 20,
    alignSelf: "center",
  },
  bannerContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  bannerTitle: {
    fontSize: 18,
    fontFamily: "Cairo_Bold",
    color: "#007AFF",
    marginBottom: 4,
  },
  bannerText: {
    fontSize: 14,
    fontFamily: "Cairo_Regular",
    color: "#515151",
    marginBottom: 12,
    textAlign: "right",
  },
  bannerButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  bannerButtonText: {
    color: "#FFFFFF",
    fontFamily: "Cairo_SemiBold",
    fontSize: 14,
  },
  bannerImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginLeft: 12,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
  },
  groupImage: {
    borderRadius: 12,
    marginLeft: 12,
  },
  groupInfo: {
    flex: 1,
    justifyContent: "center",
  },
  groupHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 8,
  },
  groupName: {
    fontSize: 17,
    color: "#000000",
    textAlign: "right",
    fontFamily: "Cairo_SemiBold",
  },
  lockIcon: {
    marginLeft: 6,
  },
  memberAvatars: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginBottom: 6,
  },
  memberAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  memberCount: {
    fontSize: 14,
    color: "#8E8E93",
    marginRight: 8,
    fontFamily: "Cairo_Regular",
  },
  groupDetails: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  groupActivity: {
    fontSize: 15,
    color: "#8E8E93",
    textAlign: "right",
    fontFamily: "Cairo_Regular",
  },
  groupRightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadBadge: {
    backgroundColor: "#007AFF",
    borderRadius: 16,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 8,
  },
  unreadText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "Cairo_SemiBold",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5EA",
    marginRight: 72,
  },
});

export default GroupsScreen;
