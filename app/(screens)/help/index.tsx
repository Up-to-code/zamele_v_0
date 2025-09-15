// HelpScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUserStore } from "@/lib/store/userStore";

const colorPalette = {
  primaryBlue: "#007AFF",
  primaryGold: "#FFD700",
  backgroundGray: "#F2F2F7",
  cardWhite: "#FFFFFF",
  textBlack: "#000000",
  textSecondaryGray: "#8E8E93",
};

const HelpScreen = () => {
  const userProfileData = useUserStore();
  const isTeacher = userProfileData.userType === "teacher"; // Assuming you have a role field

  const contactOptions = [
    {
      id: "1",
      title: "الاتصال بالدعم الفني",
      icon: "headset",
      action: () => Linking.openURL("tel:+1234567890"),
    },
    {
      id: "2",
      title: "البريد الإلكتروني",
      icon: "mail",
      action: () => Linking.openURL("mailto:support@university.edu"),
    },
    {
      id: "3",
      title: "الأسئلة الشائعة",
      icon: "help-circle",
      action: () => router.push("/(screens)/help/FAQScreen") ,
    },
    {
      id: "4",
      title: "الدليل الإرشادي",
      icon: "book",
      action: () => Linking.openURL("https://university.edu/guide"),
    },
  ];

  return (
    <View style={[styles.screenContainer, { backgroundColor: isTeacher ? "#FFF9E6" : colorPalette.backgroundGray }]}>
      <ScrollView style={styles.scrollContainer}>
        {/* ID Card Section */}
        <View style={[styles.idCard, { backgroundColor: isTeacher ? colorPalette.primaryGold : colorPalette.primaryBlue }]}>
          <View style={styles.idCardContent}>
            <View style={styles.idCardHeader}>
              <Text style={styles.universityName}>جامعة التقنية</Text>
              <Image
                source={{uri: "https://bcassetcdn.com/public/blog/wp-content/uploads/2022/05/11161506/Harvard-University-Logo.png"}}
                style={styles.universityLogo}
              />
            </View>
            
            
            <View style={styles.idCardBody}>
              <Image
                source={userProfileData.avatarUrl ? { uri: userProfileData.avatarUrl } : require("@/assets/images/avatar.png")}
                style={styles.idPhoto}
              />
              
              <View style={styles.idDetails}>
                <Text style={styles.idName}>{userProfileData.name}</Text>
                <Text style={styles.idRole}>{isTeacher ? "أستاذ" : "طالب"}</Text>
                <Text style={styles.idNumber}>ID: {userProfileData.clerkUserId || "123456"}</Text>
              </View>
            </View>
            
            <View style={styles.idCardFooter}>
              <Text style={styles.idFooterText}>
                {isTeacher ? "قسم الهندسة - كلية التقنية" : "كلية علوم الحاسوب - السنة الثالثة"}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Options */}
        <View style={styles.contactSection}>
          <Text style={styles.sectionTitle}>خيارات المساعدة والاتصال</Text>
          
          {contactOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[styles.contactOption, { backgroundColor: isTeacher ? "#FFED4E" : "#E6F2FF" }]}
              onPress={option.action}
            >
              <View style={styles.contactOptionLeft}>
                <Ionicons
                  name={option.icon as any}
                  size={24}
                  color={isTeacher ? "#B8860B" : colorPalette.primaryBlue}
                />
                <Text style={styles.contactOptionText}>{option.title}</Text>
              </View>
              <Ionicons
                name="chevron-back"
                size={16}
                color={isTeacher ? "#B8860B" : colorPalette.primaryBlue}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Contact */}
        <View style={[styles.emergencySection, { backgroundColor: isTeacher ? "#FFF0CC" : "#E6F2FF" }]}>
          <Text style={styles.emergencyTitle}>الاتصال في الحالات الطارئة</Text>
          <Text style={styles.emergencyText}>
            للاستفسارات العاجلة يرجى الاتصال على الرقم: <Text style={styles.emergencyNumber}>911</Text>
          </Text>
          <TouchableOpacity
            style={[styles.emergencyButton, { backgroundColor: isTeacher ? colorPalette.primaryGold : colorPalette.primaryBlue }]}
            onPress={() => Linking.openURL("tel:911")}
          >
            <Ionicons name="call" size={20} color="white" />
            <Text style={styles.emergencyButtonText}>اتصال طارئ</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
    padding: 16,
  },
  idCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  idCardContent: {
    flex: 1,
  },
  idCardHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.3)",
    paddingBottom: 10,
  },
  universityName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  universityLogo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "white",
  },
  idCardBody: {
    flexDirection: "row-reverse",
    alignItems: "center",
    marginBottom: 20,
  },
  idPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "white",
    marginLeft: 15,
  },
  idDetails: {
    flex: 1,
    alignItems: "flex-end",
  },
  idName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 4,
  },
  idRole: {
    fontSize: 16,
    color: "#000",
    marginBottom: 4,
  },
  idNumber: {
    fontSize: 14,
    color: "#000",
  },
  idCardFooter: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.3)",
    paddingTop: 10,
  },
  idFooterText: {
    fontSize: 14,
    color: "#000",
    textAlign: "center",
  },
  contactSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "right",
  },
  contactOption: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  contactOptionLeft: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  contactOptionText: {
    fontSize: 16,
    marginRight: 12,
  },
  emergencySection: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  emergencyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "right",
  },
  emergencyText: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "right",
  },
  emergencyNumber: {
    fontWeight: "bold",
  },
  emergencyButton: {
    flexDirection: "row-reverse",
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
  },
  emergencyButtonText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 8,
  },
});

export default HelpScreen;