import { useRouter } from "expo-router";
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Animated,
  Easing,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useUserStore } from "@/lib/store/userStore";
type Section = {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Ionicons.glyphMap;
};

const SectionScreen = () => {
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const { setSection } = useUserStore();
  // Animation values
  const fadeAnim = useState(new Animated.Value(0))[0];
  const slideAnim = useState(new Animated.Value(30))[0];

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  const sections: Section[] = [
    { id: "cs", name: "علوم الحاسوب", description: "برمجة وذكاء اصطناعي", icon: "laptop-outline" },
    { id: "bus", name: "إدارة الأعمال", description: "إدارة وتسويق", icon: "briefcase-outline" },
    { id: "eng", name: "الهندسة", description: "مدنية، ميكانيكية، كهربائية", icon: "construct-outline" },
    { id: "med", name: "الطب", description: "صحة وجراحة", icon: "medkit-outline" },
    { id: "law", name: "القانون", description: "مدني ودولي", icon: "school-outline" },
    { id: "art", name: "الآداب", description: "تاريخ، لغات وفلسفة", icon: "book-outline" },
    { id: "sci", name: "العلوم", description: "فيزياء وكيمياء وأحياء", icon: "planet-outline" },
  ];

  const router = useRouter();

  const handleContinue = () => {
    console.log("القسم المختار:", selectedSection);
    // router.push("/next-screen");
    router.push("/(start)/yearScreen");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* المحتوى القابل للتمرير */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Animated.View
          style={[
            styles.header,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          <Text style={styles.title}>اختر القسم</Text>
          <Text style={styles.subtitle}>حدد قسمك الأكاديمي</Text>
        </Animated.View>

        <Animated.View
          style={[
            styles.optionsContainer,
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
          ]}
        >
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={[
                styles.sectionOption,
                selectedSection === section.id && styles.sectionOptionSelected,
              ]}
              onPress={() => {
                setSelectedSection(section.id);
                setSection(section.id);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.sectionContent}>
                <Ionicons
                  name={section.icon}
                  size={28}
                  color={selectedSection === section.id ? "#007AFF" : "#8E8E93"}
                  style={styles.icon}
                />
                <View style={styles.textContainer}>
                  <Text
                    style={[
                      styles.sectionName,
                      selectedSection === section.id && styles.sectionNameSelected,
                    ]}
                  >
                    {section.name}
                  </Text>
                  <Text style={styles.sectionDescription}>
                    {section.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </Animated.View>
      </ScrollView>

      {/* زر المتابعة ثابت أسفل الشاشة */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            !selectedSection && styles.continueButtonDisabled,
          ]}
          onPress={handleContinue}
          disabled={!selectedSection}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>متابعة</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollContainer: { padding: 24, paddingBottom: 100 }, // مسافة إضافية عشان الزر ما يغطي القائمة
  header: { alignItems: "center", marginBottom: 30 },
    title: { fontSize: 26, color: "#000", marginBottom: 6, fontFamily: "Cairo_Bold" },
  subtitle: { fontSize: 16, color: "#8E8E93", textAlign: "center", fontFamily: "Cairo_Bold" },
  optionsContainer: { gap: 16, marginBottom: 20 },
  sectionOption: {
    backgroundColor: "#F2F2F7",
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: "transparent",
  },
  sectionOptionSelected: {
    backgroundColor: "#E6F0FF",
    borderColor: "#007AFF",
  },
  sectionContent: { flexDirection: "row", alignItems: "center" },
  icon: { marginRight: 16 },
  textContainer: { flex: 1 },
  sectionName: { fontSize: 18, color: "#000", fontFamily: "Cairo_Bold" },
  sectionNameSelected: { color: "#007AFF" },
  sectionDescription: { fontSize: 14, color: "#8E8E93", marginTop: 2, fontFamily: "Cairo_Bold" },
  footer: {
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    backgroundColor: "#fff",
    padding: 16,
  },
  continueButton: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  continueButtonDisabled: { backgroundColor: "#C7C7CC" },
    continueButtonText: { color: "#fff", fontSize: 17, fontFamily: "Cairo_Bold"},
});

export default SectionScreen;
