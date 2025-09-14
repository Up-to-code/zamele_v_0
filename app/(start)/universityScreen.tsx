import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
  FlatList,
  TextInput,
  I18nManager,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useUserStore } from "@/lib/store/userStore";

// دعم الـ RTL
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

const universities = [
  { id: "1", name: "جامعة القاهرة" },
  { id: "2", name: "جامعة عين شمس" },
  { id: "3", name: "جامعة الإسكندرية" },
  { id: "4", name: "جامعة أسيوط" },
  { id: "5", name: "جامعة طنطا" },
  { id: "6", name: "جامعة المنصورة" },
  { id: "7", name: "جامعة الزقازيق" },
  { id: "8", name: "جامعة بنها" },
  { id: "9", name: "جامعة حلوان" },
  { id: "10", name: "جامعة سوهاج" },
];

export default function UniversityScreen() {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const { setUniversity } = useUserStore();
  const filtered = universities.filter((u) =>
    u.name.toLowerCase().includes(search.toLowerCase())
  );

  const renderItem = ({ item }: { item: { id: string; name: string } }) => {
    const selected = item.id === selectedId;
    return (
      <TouchableOpacity
        style={[styles.card, selected && styles.cardSelected]}
        onPress={() => {
          setSelectedId(item.id);
          setUniversity(item.id);
        }}
        activeOpacity={0.8}
      >
        <Text style={[styles.cardText, selected && styles.cardTextSelected]}>
          {item.name}
        </Text>
        {selected && (
          <Ionicons name="checkmark-circle" size={24} color="#007AFF" />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* الهيدر */}
      <View style={styles.header}>
        <Text style={styles.title}>اختر جامعتك</Text>
        <Text style={styles.subtitle}>حدد الجامعة التي تنتمي إليها للمتابعة</Text>
      </View>

      {/* البحث */}
      <View style={styles.searchBox}>
        <Ionicons name="search" size={20} color="#8E8E93" />
        <TextInput
          style={styles.searchInput}
          placeholder="ابحث عن جامعة..."
          placeholderTextColor="#8E8E93"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* القائمة */}
      <FlatList
        data={filtered}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />

      {/* زر متابعة */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.button, !selectedId && styles.buttonDisabled]}
          disabled={!selectedId}
          onPress={() => router.push("/(start)/SectionScreen")}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>متابعة</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 10,
    paddingBottom: 8,
  },
  title: {
    fontSize: 28,
    
    color: "#000",
    textAlign: "right",
    marginBottom: 6,
    fontFamily: "Cairo_Bold",
  },
  subtitle: {
    fontSize: 16,
    color: "#8E8E93",
    textAlign: "right",
    marginBottom: 20,
    fontFamily: "Cairo_Bold",
  },
  searchBox: {
    flexDirection: "row-reverse",
    alignItems: "center",
    backgroundColor: "#F2F2F7",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginHorizontal: 20,
    height: 50,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 8,
    textAlign: "right",
    color: "#000",
    fontFamily: "Cairo_Bold",
   },
  listContainer: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  card: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    marginBottom: 10,
    borderRadius: 16,
    backgroundColor: "#FAFAFA",
    borderWidth: 1,
    borderColor: "#E5E5EA",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardSelected: {
    backgroundColor: "#EAF2FF",
    borderColor: "#007AFF",
  },
  cardText: {
    fontSize: 17,
    color: "#1C1C1E",
    fontFamily: "Cairo_Bold",
  },
  cardTextSelected: {
    color: "#007AFF",
    fontFamily: "Cairo_Bold",
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
    backgroundColor: "#fff",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  buttonDisabled: {
    backgroundColor: "#C7C7CC",
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: "Cairo_Bold",
  },
});
