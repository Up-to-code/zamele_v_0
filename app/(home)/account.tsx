import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  I18nManager,
  Alert,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { shortName } from "@/lib/shortName";
import { router } from "expo-router";
import { useUserStore } from "@/lib/store/userStore";

// Force RTL layout for Arabic
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const colorPalette = {
  primaryBlue: "#007AFF",
  secondaryPurple: "#5856D6",
  textBlack: "#000000",
  backgroundGray: "#F2F2F7",
  cardWhite: "#FFFFFF",
  borderLightGray: "#C6C6C8",
  textSecondaryGray: "#8E8E93",
};

const ProfileScreen = () => {
  const userProfileData = useUserStore();

  const profileMenuOptions = [
    {
      id: "1",
      title: "مجموعاتي",
      icon: "people",
      color: colorPalette.primaryBlue,
    },
    {
      id: "2",
      title: "الأصدقاء",
      icon: "person",
      color: colorPalette.primaryBlue,
    },
    {
      id: "3",
      title: "الإعدادات",
      icon: "settings",
      color: colorPalette.primaryBlue,
      path: "/(screens)/settings",
    },
    {
      id: "4",
      title: "تعديل الملف",
      icon: "pencil",
      color: colorPalette.primaryBlue,
      path: "/(screens)/account/EditAccountScreen",
    },
    {
      id: "5",
      title: "المساعدة",
      icon: "help-circle",
      color: colorPalette.primaryBlue,
      path: "/(screens)/help",
    },
    {
      id: "6",
      title: "السياسات",
      color: colorPalette.primaryBlue,
      path: "/(screens)/policies",
      icon: "document-text", // Changed to a valid icon
    },
  ];

  const handleEmailCopy = async () => {
    await Clipboard.setStringAsync(userProfileData.email);
    Alert.alert("تم النسخ", "تم نسخ البريد الإلكتروني إلى الحافظة");
  };

  const handleEmailSend = () => {
    Linking.openURL(`mailto:${userProfileData.email}`);
  };

  const navigateToScreen = (path: string | undefined) => {
    if (path) {
      router.push(path as any);
    }
  };

  return (
    <View style={styles.screenContainer}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colorPalette.backgroundGray}
      />

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeaderSection}>
          <View style={styles.userInformation}>
            <Text style={styles.userNameText}>{userProfileData.name}</Text>
            <TouchableOpacity onPress={handleEmailCopy}>
              <Text style={styles.userEmailText}>
                {shortName(userProfileData.email)}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.profileImageContainer}>
            {userProfileData.avatarUrl ? (
              <Image
                source={{ uri: userProfileData.avatarUrl }}
                style={styles.profileImage}
              />
            ) : (
              <Image
                source={require("@/assets/images/avatar.png")}
                style={styles.profileImage}
              />
            )}

            <TouchableOpacity style={styles.profileImageEditButton}>
              <Ionicons name="camera" size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options Section */}
        <View style={styles.menuOptionsContainer}>
          {profileMenuOptions.map((menuItem) => (
            <TouchableOpacity
              key={menuItem.id}
              style={styles.menuOptionItem}
              onPress={() => navigateToScreen(menuItem.path)}
            >
              <View
                style={[
                  styles.menuOptionIconContainer,
                  { backgroundColor: `${menuItem.color}15` },
                ]}
              >
                <Ionicons
                  name={menuItem.icon as any}
                  size={20}
                  color={menuItem.color}
                />
              </View>
              <Text style={styles.menuOptionText}>{menuItem.title}</Text>
              <View style={styles.flexSpacer} />
              <Ionicons
                name="chevron-back"
                size={16}
                color={colorPalette.borderLightGray}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsContainer}>
          <Text style={styles.sectionHeaderText}>الإجراءات السريعة</Text>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colorPalette.primaryBlue },
                ]}
              >
                <Ionicons name="share" size={20} color="white" />
              </View>
              <Text style={styles.quickActionText}>مشاركة</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colorPalette.primaryBlue },
                ]}
              >
                <Ionicons name="person-add" size={20} color="white" />
              </View>
              <Text style={styles.quickActionText}>إضافة</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionButton}
              onPress={handleEmailSend}
            >
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: colorPalette.primaryBlue },
                ]}
              >
                <Ionicons name="mail" size={20} color="white" />
              </View>
              <Text style={styles.quickActionText}>بريد</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colorPalette.backgroundGray,
  },
  scrollContainer: {
    flex: 1,
    paddingTop:
      Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 20 : 60,
  },
  profileHeaderSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  profileImageContainer: {
    position: "relative",
    marginLeft: 16,
  },
  profileImage: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 3,
    borderColor: colorPalette.primaryBlue,
  },
  profileImageEditButton: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: colorPalette.primaryBlue,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colorPalette.cardWhite,
  },
  userInformation: {
    flex: 1,
    alignItems: "flex-end",
  },
  userNameText: {
    fontSize: 22,
    color: colorPalette.textBlack,
    marginBottom: 4,
    fontFamily: "Cairo_Bold",
  },
  userEmailText: {
    fontSize: 15,
    color: colorPalette.textSecondaryGray,
    fontFamily: "Cairo_Medium",
  },

  menuOptionsContainer: {
    backgroundColor: colorPalette.cardWhite,
    borderRadius: 12,
    marginHorizontal: 20,
    paddingVertical: 8,
    marginBottom: 24,
  },
  menuOptionItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: colorPalette.borderLightGray,
  },
  menuOptionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  menuOptionText: {
    fontSize: 16,
    color: colorPalette.textBlack,
    marginRight: 12,
    fontFamily: "Cairo_Medium",
  },
  flexSpacer: {
    flex: 1,
  },
  quickActionsContainer: {
    backgroundColor: colorPalette.cardWhite,
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 20,
    marginBottom: 40,
  },
  sectionHeaderText: {
    fontSize: 18,
    color: colorPalette.textBlack,
    marginBottom: 16,
    textAlign: "right",
    fontFamily: "Cairo_Bold",
  },
  quickActionsRow: {
    flexDirection: "row-reverse",
    justifyContent: "space-around",
  },
  quickActionButton: {
    alignItems: "center",
  },
  quickActionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 14,
    color: colorPalette.textBlack,
    fontFamily: "Cairo_Medium",
  },
});

export default ProfileScreen;
