import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  LayoutAnimation,
  Platform,
  UIManager,
  Linking,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Enable LayoutAnimation for Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const FAQScreen: React.FC = () => {
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>({});

  const faqData: FAQItem[] = [
    {
      id: 1,
      question: "كيف يمكنني إعادة تعيين كلمة المرور؟",
      answer: "يمكنك إعادة تعيين كلمة المرور من خلال النقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول. ستصلك رسالة بريد إلكتروني تحتوي على رابط لإعادة التعيين."
    },
    {
      id: 2,
      question: "كيف أعدل في بياناتي الشخصية؟",
      answer: "يمكنك تعديل بياناتك الشخصية من خلال الذهاب إلى 'الملف الشخصي' ثم النقر على 'تعديل المعلومات'. لا تنسى حفظ التغييرات بعد الانتهاء."
    },
    {
      id: 3,
      question: "ما هي ساعات عمل الدعم الفني؟",
      answer: "فريق الدعم الفني متاح من الأحد إلى الخميس، من الساعة 8 صباحاً حتى 4 عصراً."
    },
    {
      id: 4,
      question: "كيف يمكنني تحميل الملفات على النظام؟",
      answer: "لتحميل الملفات، انتقل إلى القسم المطلوب وانقر على زر 'رفع ملف'."
    }
  ];

  const toggleItem = (id: number): void => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleContactSupport = (): void => {
    Linking.openURL("mailto:support@example.com");
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>الأسئلة الشائعة</Text>
        </View>

        {/* FAQ List */}
        <View style={styles.faqContainer}>
          {faqData.map((item) => (
            <View key={item.id} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.questionContainer}
                onPress={() => toggleItem(item.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <Ionicons
                  name={expandedItems[item.id] ? "remove" : "add"}
                  size={20}
                  color="#007AFF"
                />
              </TouchableOpacity>
              
              {expandedItems[item.id] && (
                <View style={styles.answerContainer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Support */}
        <View style={styles.supportSection}>
          <Text style={styles.supportText}>لا تجد إجابتك؟</Text>
          <TouchableOpacity
            style={styles.supportButton}
            onPress={handleContactSupport}
          >
            <Text style={styles.supportButtonText}>اتصل بالدعم</Text>
          </TouchableOpacity>
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
    paddingVertical: 24,
    paddingHorizontal: 8,
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#000",
    fontFamily: "Cairo_Bold",
  },
  faqContainer: {
    marginBottom: 24,
  },
  faqItem: {
    backgroundColor: "#FFF",
    marginBottom: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    color: "#000",
    flex: 1,
    textAlign: "right",
    marginRight: 12,
      fontFamily: "Cairo_Medium",
  },
  answerContainer: {
    padding: 16,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 15,
    color: "#3A3A3C",
    lineHeight: 22,
    textAlign: "right",
    fontFamily: "Cairo_Regular",
  },
  supportSection: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
  },
  supportText: {
    fontSize: 16,
    color: "#000",
    marginBottom: 16,
    textAlign: "center",
    fontFamily: "Cairo_Regular",
  },
  supportButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    width: "100%",
    alignItems: "center",
  },
  supportButtonText: {
    color: "#FFF",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "Cairo_Medium",
  },
});

export default FAQScreen;