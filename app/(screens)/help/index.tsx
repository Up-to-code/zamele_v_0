import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

const HelpCenterScreen = () => {
  const helpOptions = [
    {
      id: 1,
      title: "الدعم الفني",
      icon: "headset-outline",
      action: () => Linking.openURL("tel:+966112345678"),
    },
    {
      id: 2,
      title: "الأسئلة الشائعة",
      icon: "help-circle-outline",
      action: () => router.push("/(screens)/help/FAQScreen"),
    },
    {
      id: 3,
      title: "الدليل الإرشادي",
      icon: "book-outline",
      action: () => Linking.openURL("https://example.com/guide"),
    },
    {
      id: 4,
      title: "اتصل بنا",
      icon: "mail-outline",
      action: () => Linking.openURL("mailto:support@example.com"),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Ionicons name="help-buoy" size={32} color="#007AFF" />
          <Text style={styles.headerTitle}>مركز المساعدة</Text>
          <Text style={styles.headerSubtitle}>كيف يمكننا مساعدتك؟</Text>
        </View>

        {/* Help Options */}
        <View style={styles.section}>
          {helpOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={styles.optionCard}
              onPress={option.action}
            >
              <View style={styles.optionContent}>
              <Text style={styles.optionTitle}>{option.title}</Text>

                <View style={styles.optionIcon}>
                  <Ionicons
                    name={option.icon as any}
                    size={22}
                    color="#007AFF"
                  />
                </View>
              </View>
              <Ionicons name="chevron-back" size={18} color="#C7C7CC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Emergency Section */}
        <View style={styles.emergencySection}>
          <View style={styles.emergencyHeader}>
            <Ionicons name="warning" size={20} color="#FF3B30" />
            <Text style={styles.emergencyTitle}>
              الاتصال في الحالات الطارئة
            </Text>
          </View>
          <TouchableOpacity
            style={styles.emergencyButton}
            onPress={() => Linking.openURL("tel:1990")}
          >
            <Ionicons name="call-outline" size={18} color="#FFF" />
            <Text style={styles.emergencyButtonText}>اتصال طارئ: 1990</Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>التطبيق الجامعي • الإصدار 1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    alignItems: "center",
    paddingVertical: 32,
  },
  headerTitle: {
    fontSize: 28,
    fontFamily: "Cairo_Bold",
    color: "#000",
    marginTop: 16,
    marginBottom: 4,
    textAlign: "center",
  },
  headerSubtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "center",
    fontFamily: "Cairo_Regular",
  },
  section: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    marginBottom: 24,
    overflow: "hidden",
  },
  optionCard: {
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F7",
  },
  optionContent: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  optionIcon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 12,
  },
  optionTitle: {
    fontSize: 16,
    color: "#000",
    fontFamily: "Cairo_Medium",
  },
  emergencySection: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 24,
  },
  emergencyHeader: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  emergencyTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 6,
    fontFamily: "Cairo_Medium",

  },
  emergencyButton: {
    flexDirection: "row",
    backgroundColor: "#FF3B30",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",

  },
  emergencyButtonText: {
    color: "#FFF",
    fontWeight: "600",
    marginLeft: 6,
    fontFamily: "Cairo_Bold",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 24,
  },
  footerText: {
    fontSize: 13,
    color: "#8E8E93",
    fontFamily: "Cairo_Regular",
  },
});

export default HelpCenterScreen;
