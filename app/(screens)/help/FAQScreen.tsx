import React, { useState } from "react";
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
import { useUserStore } from "@/lib/store/userStore";

const colorPalette = {
  primaryBlue: "#007AFF",
  primaryGold: "#FFD700",
  backgroundGray: "#F2F2F7",
  cardWhite: "#FFFFFF",
  textBlack: "#000000",
  textSecondaryGray: "#8E8E93",
};

const FAQScreen = () => {
  const userProfileData = useUserStore();
  const isTeacher = userProfileData.userType === "teacher";
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleItem = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  const faqData = isTeacher
    ? [
        {
          question: "كيف يمكنني إضافة مواد جديدة؟",
          answer: "يمكنك إضافة مواد جديدة من خلال الذهاب إلى قسم المواد في لوحة التحكم والنقر على زر 'إضافة مادة جديد'.",
        },
        {
          question: "ما هي طريقة رفع المحاضرات؟",
          answer: "يمكنك رفع المحاضرات من خلال صفحة المادة، ثم النقر على 'إضافة محتوى' واختيار نوع المحتوى الذي تريد رفعه.",
        },
        {
          question: "كيف يمكنني التواصل مع الطلاب؟",
          answer: "يتوفر نظام رسائل داخلي يمكنك الوصول إليه من خلال أيقونة الرسائل في التطبيق، كما يمكنك إرسال إشعارات جماعية للطلاب.",
        },
        {
          question: "كيفية إنشاء الاختبارات الإلكترونية؟",
          answer: "يمكنك إنشاء اختبارات إلكترونية من خلال قسم 'الاختبارات' في لوحة التحكم، ثم اختيار 'إنشاء اختبار جديد' واتباع الخطوات.",
        },
        {
          question: "ما هي سياسة التقييم في المنصة؟",
          answer: "يمكنك تقييم الطلاب من خلال قسم 'التقييمات'، حيث يمكنك إضافة درجات للاختبارات والواجبات والمشاركة الصفية وفقًا للمعايير المحددة.",
        },
      ]
    : [
        {
          question: "كيف يمكنني التسجيل في المواد؟",
          answer: "يمكنك التسجيل في المواد من خلال الذهاب إلى قسم 'الجدول الدراسي' ثم النقر على 'إضافة مادة' واختيار المواد المتاحة.",
        },
        {
          question: "كيف يمكنني الوصول إلى المحاضرات المسجلة؟",
          answer: "المحاضرات المسجلة متاحة في صفحة كل مادة تحت قسم 'المحاضرات'، ويمكنك مشاهدتها في أي وقت.",
        },
        {
          question: "كيف يمكنني التواصل مع الأساتذة؟",
          answer: "يمكنك التواصل مع الأساتذة من خلال نظام الرسائل الداخلية أو عن طريق البريد الإلكتروني الجامعي الموجود في معلومات الاتصال بكل أستاذ.",
        },
        {
          question: "ما هو موعد الامتحانات النهائية؟",
          answer: "يتم نشر جدول الامتحانات النهائية قبل موعدها بشهر على الأقل، ويمكنك الاطلاع عليها من خلال قسم 'الجدول الدراسي'.",
        },
        {
          question: "كيف يمكنني استرجاع كلمة المرور؟",
          answer: "يمكنك استرجاع كلمة المرور من خلال النقر على 'نسيت كلمة المرور' في صفحة تسجيل الدخول ومتابعة الخطوات التي سيتم إرسالها إلى بريدك الإلكتروني.",
        },
      ];

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
      title: "الدردشة المباشرة",
      icon: "chatbubbles",
      action: () => Linking.openURL("https://university.edu/chat"),
    },
  ];

  return (
    <View style={[styles.screenContainer, { backgroundColor: isTeacher ? "#FFF9E6" : colorPalette.backgroundGray }]}>
      <ScrollView style={styles.scrollContainer}>
        {/* Header Section */}
        <View style={[styles.headerCard, { backgroundColor: isTeacher ? colorPalette.primaryGold : colorPalette.primaryBlue }]}>
          <Ionicons name="help-circle" size={32} color="white" />
          <Text style={styles.headerTitle}>الأسئلة الشائعة</Text>
          <Text style={styles.headerSubtitle}>
            {isTeacher 
              ? "إجابات على الأسئلة الأكثر شيوعاً لدى الأساتذة" 
              : "إجابات على الأسئلة الأكثر شيوعاً لدى الطلاب"
            }
          </Text>
        </View>

        {/* FAQ List */}
        <View style={styles.faqContainer}>
          {faqData.map((item, index) => (
            <View key={index} style={[styles.faqItem, { backgroundColor: isTeacher ? "#FFED4E" : "#E6F2FF" }]}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => toggleItem(index)}
              >
                <Text style={styles.questionText}>{item.question}</Text>
                <Ionicons
                  name={expandedItems.has(index) ? "chevron-up" : "chevron-down"}
                  size={20}
                  color={isTeacher ? "#B8860B" : colorPalette.primaryBlue}
                />
              </TouchableOpacity>
              
              {expandedItems.has(index) && (
                <View style={styles.faqAnswer}>
                  <Text style={styles.answerText}>{item.answer}</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        {/* Contact Support Section */}
        <View style={[styles.contactSection, { backgroundColor: isTeacher ? "#FFF0CC" : "#E6F2FF" }]}>
          <Text style={styles.contactTitle}>لا تزال لديك أسئلة؟</Text>
          <Text style={styles.contactSubtitle}>فريق الدعم متاح لمساعدتك على مدار الساعة</Text>
          
          <View style={styles.contactOptions}>
            {contactOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.contactOption, { backgroundColor: isTeacher ? colorPalette.primaryGold : colorPalette.primaryBlue }]}
                onPress={option.action}
              >
                <Ionicons name={option.icon as any} size={20} color="white" />
                <Text style={styles.contactOptionText}>{option.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Additional Help */}
        <View style={[styles.additionalHelp, { backgroundColor: isTeacher ? "#FFED4E" : "#E6F2FF" }]}>
          <Text style={styles.helpTitle}>طرق إضافية للحصول على المساعدة</Text>
          <View style={styles.helpItems}>
            <View style={styles.helpItem}>
              <Ionicons name="library" size={20} color={isTeacher ? "#B8860B" : colorPalette.primaryBlue} />
              <Text style={styles.helpItemText}>مركز المساعدة على الموقع الإلكتروني</Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="people" size={20} color={isTeacher ? "#B8860B" : colorPalette.primaryBlue} />
              <Text style={styles.helpItemText}>مجتمع المستخدمين في المنتدى</Text>
            </View>
            <View style={styles.helpItem}>
              <Ionicons name="videocam" size={20} color={isTeacher ? "#B8860B" : colorPalette.primaryBlue} />
              <Text style={styles.helpItemText}>فيديوهات تعليمية على قناتنا</Text>
            </View>
          </View>
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
  faqContainer: {
    marginBottom: 24,
  },
  faqItem: {
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
  },
  faqQuestion: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    marginRight: 12,
    textAlign: "right",
  },
  faqAnswer: {
    padding: 16,
    paddingTop: 0,
  },
  answerText: {
    fontSize: 14,
    lineHeight: 22,
    textAlign: "right",
  },
  contactSection: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "right",
  },
  contactSubtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign: "right",
  },
  contactOptions: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
  },
  contactOption: {
    flexDirection: "row-reverse",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
  },
  contactOptionText: {
    color: "white",
    marginRight: 8,
    fontSize: 12,
  },
  additionalHelp: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "right",
  },
  helpItems: {
    gap: 12,
  },
  helpItem: {
    flexDirection: "row-reverse",
    alignItems: "center",
  },
  helpItemText: {
    marginRight: 8,
    fontSize: 14,
  },
});

export default FAQScreen;