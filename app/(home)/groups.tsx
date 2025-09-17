import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  useWindowDimensions,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

// TypeScript interfaces
interface Group {
  id: string;
  name: string;
  members: number;
  lastActive: string;
  image: string;
  isPrivate: boolean;
  unreadCount: number;
}

const GroupsScreen: React.FC = () => {
  const [groups] = useState<Group[]>([
    {
      id: "1",
      name: "مطوري React Native",
      members: 128,
      lastActive: "نشط الآن",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      isPrivate: false,
      unreadCount: 3,
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
    },
  ]);

  const { width } = useWindowDimensions();

  const handleGroupPress = (groupId: string) => {
    console.log("Navigating to group:", groupId);
    // Use the correct navigation method for Expo Router
    // If your group detail screen is at app/groups/[id].tsx
    router.push(`/groups/${groupId}`);
    
    // If it's in a different directory structure, adjust the path accordingly
    // For example, if it's at app/(tabs)/groups/[id].tsx, use:
    // router.push(`/(tabs)/groups/${groupId}`);
  };

  const renderGroupItem = ({ item }: { item: Group }) => {
    return (
      <TouchableOpacity 
        style={styles.groupCard} 
        activeOpacity={0.7} 
        onPress={() => handleGroupPress(item.id)}
      >
        <Image
          source={{ uri: item.image }}
          style={[
            styles.groupImage,
            { width: width * 0.14, height: width * 0.14 },
          ]}
          resizeMode="cover"
        />

        <View style={styles.groupInfo}>
          <View style={styles.groupHeader}>
            <Text style={styles.groupName} numberOfLines={1}>
              {item.name}
            </Text>
            {item.isPrivate && (
              <Ionicons
                name="lock-closed"
                size={14}
                color="#8E8E93"
                style={styles.lockIcon}
              />
            )}
          </View>

          <View style={styles.groupDetails}>
            <Text style={styles.memberCount}>{item.members} أعضاء</Text>
            <Text style={styles.groupActivity}>• {item.lastActive}</Text>
          </View>
        </View>

        <View style={styles.groupRightSection}>
          {item.unreadCount > 0 && <View style={styles.unreadDot} />}
          <Ionicons name="chevron-forward" size={16} color="#C7C7CC" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>المجموعات</Text>
        <TouchableOpacity style={styles.createButton}>
          <Ionicons name="add" size={22} color="#007AFF" />
        </TouchableOpacity> 
      </View>

      <FlatList
        data={groups}
        renderItem={renderGroupItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000000",
  },
  createButton: {
    padding: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  groupCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  groupImage: {
    borderRadius: 10,
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
    marginBottom: 4,
  },
  groupName: {
    fontSize: 16,
    color: "#000000",
    textAlign: "right",
    fontWeight: "500",
  },
  lockIcon: {
    marginLeft: 6,
  },
  groupDetails: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  memberCount: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 8,
  },
  groupActivity: {
    fontSize: 14,
    color: "#8E8E93",
  },
  groupRightSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#007AFF",
    marginHorizontal: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E5E5EA",
    marginRight: 60,
  },
});

export default GroupsScreen;