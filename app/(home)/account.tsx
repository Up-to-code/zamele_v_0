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
  systemOrange: "#FF9500",
};

const ProfileScreen = () => {
  const userProfileData = useUserStore();

  // Simple email shortening function
  const shortName = (email: string) => {
    return email.split('@')[0];
  };

  const profileMenuOptions = [
    {
      id: "1",
      title: "مجموعاتي",
      icon: "people-outline",
      color: colorPalette.primaryBlue,
    },
    {
      id: "2",
      title: "الأصدقاء",
      icon: "person-outline",
      color: colorPalette.primaryBlue,
    },
    {
      id: "3",
      title: "الإعدادات",
      icon: "settings-outline",
      color: colorPalette.primaryBlue,
      path: "/(screens)/settings",
    },
    {
      id: "4",
      title: "تعديل الملف",
      icon: "create-outline",
      color: colorPalette.primaryBlue,
      path: "/(screens)/account/EditAccountScreen",
    },
    {
      id: "5",
      title: "المساعدة",
      icon: "help-circle-outline",
      color: colorPalette.primaryBlue,
      path: "/(screens)/help/",
    },
    {
      id: "6",
      title: "السياسات",
      color: colorPalette.primaryBlue,
      path: "/(screens)/policies",
      icon: "document-text-outline",
    },
  ];

  const handleEmailCopy = async () => {
    await Clipboard.setStringAsync(userProfileData.email);
  };

  const handleEmailSend = () => {
    Linking.openURL(`mailto:${userProfileData.email}`);
  };

  const navigateToScreen = (menuItem: any) => {

    
    if (menuItem.path) {
      router.push(menuItem.path as any);
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
        contentInsetAdjustmentBehavior="automatic"
      >
        {/* Profile Header Section */}
        <View style={styles.profileHeaderSection}>
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
          
          <View style={styles.userInformation}>
            <Text style={styles.userNameText}>{userProfileData.name}</Text>
            <TouchableOpacity 
              style={styles.emailContainer}
              onPress={handleEmailCopy}
            >
              <Text style={styles.userEmailText}>
                {shortName(userProfileData.email)}
              </Text>
              <Ionicons name="copy-outline" size={14} color={colorPalette.textSecondaryGray} />
            </TouchableOpacity>
            
            {/* Verification Status Badge */}
            {!userProfileData.isVerified && (
              <TouchableOpacity 
                style={styles.verificationBadge}
                onPress={() => router.push("/(screens)/policies")}
              >
                <Ionicons name="warning" size={14} color={colorPalette.systemOrange} />
                <Text style={styles.verificationText}>حساب غير موثق</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.quickActionsContainer}>
          <View style={styles.quickActionsRow}>
            <TouchableOpacity style={styles.quickActionButton}>
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: `${colorPalette.primaryBlue}15` },
                ]}
              >
                <Ionicons name="share-outline" size={20} color={colorPalette.primaryBlue} />
              </View>
              <Text style={styles.quickActionText}>مشاركة</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.quickActionButton}>
              <View
                style={[
                  styles.quickActionIcon,
                  { backgroundColor: `${colorPalette.primaryBlue}15` },
                ]}
              >
                <Ionicons name="person-add-outline" size={20} color={colorPalette.primaryBlue} />
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
                  { backgroundColor: `${colorPalette.primaryBlue}15` },
                ]}
              >
                <Ionicons name="mail-outline" size={20} color={colorPalette.primaryBlue} />
              </View>
              <Text style={styles.quickActionText}>بريد</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Menu Options Section */}
        <View style={styles.menuOptionsContainer}>
          {profileMenuOptions.map((menuItem) => (
            <TouchableOpacity
              key={menuItem.id}
              style={styles.menuOptionItem}
              onPress={() => navigateToScreen(menuItem)}
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
    paddingTop: Platform.OS === "ios" ? 0 : (StatusBar.currentHeight || 0) + 20,
  },
  profileHeaderSection: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 20,
    marginBottom: 16,
    backgroundColor: colorPalette.cardWhite,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.borderLightGray,
  },
  profileImageContainer: {
    position: "relative",
    marginLeft: 16,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 0.5,
    borderColor: colorPalette.borderLightGray,
  },
  profileImageEditButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
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
    fontWeight: "600",
    color: colorPalette.textBlack,
    marginBottom: 4,
    fontFamily: "Cairo-Bold",
  },
  emailContainer: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  userEmailText: {
    fontSize: 15,
    color: colorPalette.textSecondaryGray,
    marginLeft: 4,
    fontFamily: "Cairo-Regular",
  },
  verificationBadge: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#FFF4E5",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 8,
  },
  verificationText: {
    fontSize: 12,
    color: colorPalette.systemOrange,
    marginRight: 4,
    fontFamily: "Cairo-SemiBold",
  },
  menuOptionsContainer: {
    backgroundColor: colorPalette.cardWhite,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
    overflow: "hidden",
  },
  menuOptionItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 0.5,
    borderBottomColor: colorPalette.borderLightGray,
  },
  menuOptionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  menuOptionText: {
    fontSize: 16,
    color: colorPalette.textBlack,
    marginRight: 12,
    fontFamily: "Cairo-Regular",
  },
  flexSpacer: {
    flex: 1,
  },
  quickActionsContainer: {
    backgroundColor: colorPalette.cardWhite,
    paddingVertical: 16,
    marginBottom: 16,
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
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  quickActionText: {
    fontSize: 12,
    color: colorPalette.textSecondaryGray,
    fontFamily: "Cairo-Regular",
  },
});

export default ProfileScreen;