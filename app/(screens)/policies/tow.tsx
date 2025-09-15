// PoliciesScreen.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/lib/store/userStore";

const colorPalette = {
  primaryBlue: "#007AFF",
  primaryGold: "#FFD700",
  backgroundGray: "#F2F2F7",
  cardWhite: "#FFFFFF",
  textBlack: "#000000",
  textSecondaryGray: "#8E8E93",
};

const PoliciesScreen = () => {
  const userProfileData = useUserStore();
  const isTeacher = userProfileData.userType === "teacher";

  const policies = [
    {
      id: "1",
      title: "سياسة الخصوصية",
      icon: "lock-closed",
      description: "بيان يصف كيفية جمع بياناتك واستخدامها وحمايتها",
      link: "https://university.edu/privacy",
    },
    {
      id: "2",
      title: "شروط الاستخدام",
      icon: "document-text",
      description: "الشروط والأحكام التي تحكم استخدامك للتطبيق والخدمات",
      link: "https://university.edu/terms",
    },
    {
      id: "3",
      title: "سياسة الحضور",
      icon: "time",
      description: "القواعد والإرشادات المتعلقة بالحضور والمشاركة",
      link: "https://university.edu/attendance",
    },
    {
      id: "4",
      title: "مدونة قواعد السلوك",
      icon: "people",
      description: "المعايير المتوقعة للسلوك داخل الحرم الجامعي والمنصات الرقمية",
      link: "https://university.edu/conduct",
    },
    {
      id: "5",
      title: "سياسة التقييم",
      icon: "school",
      description: "معايير وأنظمة التقييم للطلاب وأساليب التقييم للأساتذة",
      link: "https://university.edu/grading",
    },
  ];

  return (
    <View style={[styles.screenContainer, { backgroundColor: isTeacher ? "#FFF9E6" : colorPalette.backgroundGray }]}>
      <ScrollView style={styles.scrollContainer}>
        <View style={[styles.headerCard, { backgroundColor: isTeacher ? colorPalette.primaryGold : colorPalette.primaryBlue }]}>
          <Ionicons name="shield-checkmark" size={32} color="white" />
          <Text style={styles.headerTitle}>سياسات الجامعة</Text>
          <Text style={styles.headerSubtitle}>
            {isTeacher 
              ? "السياسات والإرشادات الخاصة بأعضاء هيئة التدريس" 
              : "السياسات والإرشادات الخاصة بالطلاب"
            }
          </Text>
        </View>

        <View style={styles.policiesList}>
          {policies.map((policy) => (
            <TouchableOpacity
              key={policy.id}
              style={[styles.policyItem, { backgroundColor: isTeacher ? "#FFED4E" : "#E6F2FF" }]}
              onPress={() => Linking.openURL(policy.link)}
            >
              <View style={styles.policyIconContainer}>
                <Ionicons
                  name={policy.icon as any}
                  size={24}
                  color={isTeacher ? "#B8860B" : colorPalette.primaryBlue}
                />
              </View>
              <View style={styles.policyContent}>
                <Text style={styles.policyTitle}>{policy.title}</Text>
                <Text style={styles.policyDescription}>{policy.description}</Text>
              </View>
              <Ionicons
                name="chevron-back"
                size={16}
                color={isTeacher ? "#B8860B" : colorPalette.primaryBlue}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={[styles.importantNotice, { backgroundColor: isTeacher ? "#FFF0CC" : "#E6F2FF" }]}>
          <Text style={styles.noticeTitle}>ملاحظة هامة</Text>
          <Text style={styles.noticeText}>
            يرجى قراءة وفهم جميع السياسات المذكورة أعلاه. استمرار استخدامك للتطبيق يعني موافقتك على هذه السياسات.
            للاستفسارات، يرجى الاتصال بـ{" "}
            <Text style={styles.noticeLink} onPress={() => Linking.openURL("mailto:legal@university.edu")}>
                legal@university.edu
            </Text>
          </Text>
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
  headerCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "white",
    marginTop: 12,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "white",
    textAlign: "center",
  },
  policiesList: {
    marginBottom: 24,
  },
  policyItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  policyIconContainer: {
    marginLeft: 12,
  },
  policyContent: {
    flex: 1,
    alignItems: "flex-end",
  },
  policyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  policyDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: "right",
  },
  importantNotice: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  noticeTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "right",
  },
  noticeText: {
    fontSize: 14,
    textAlign: "right",
    lineHeight: 20,
  },
  noticeLink: {
    color: "#007AFF",
  },
});

export default PoliciesScreen;