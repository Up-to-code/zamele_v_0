import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useUserStore } from "../../lib/store/userStore";

const YEARS = [
  { id: "1", label: "السنة الأولى" },
  { id: "2", label: "السنة الثانية" },
  { id: "3", label: "السنة الثالثة" },
  { id: "4", label: "السنة الرابعة" },
  { id: "5", label: "السنة الخامسة" },
];

export default function YearScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ next?: string }>();
  const { setYear } = useUserStore();
  const [selected, setSelected] = useState<string | null>(null);



  const onContinue = () => {
    if (!selected) return;
    setYear(selected);
        router.push("/(start)/auth/sign-up");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.largeTitle}>السنة الدراسية</Text>
        <Text style={styles.subtitle}>اختر السنة المناسبة لك</Text>
      </View>

      <View style={styles.card}>
        <FlatList
          data={YEARS}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const active = selected === item.id;
            return (
              <TouchableOpacity
                style={styles.cell}
                onPress={() => setSelected(item.id)}
                activeOpacity={0.9}
              >
                <Text style={[styles.cellTitle, active && styles.cellTitleActive]}> {item.label}</Text>
                <View style={[styles.checkmark, active && styles.checkmarkActive]} />
              </TouchableOpacity>
            );
          }}
        />
      </View>

      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.cta, !selected && styles.ctaDisabled]}
          onPress={onContinue}
          disabled={!selected}
        >
          <Text style={styles.ctaText}>متابعة</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F2F2F7" },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 6 , alignItems: "center" },
  largeTitle: { fontSize: 28, color: "#000", fontFamily: "Cairo_Bold" },
  subtitle: { fontSize: 15, color: "#8E8E93", marginTop: 4, fontFamily: "Cairo_Medium" },
  card: {
    marginTop: 12,
    marginHorizontal: 16,
    backgroundColor: "#fff",
    borderRadius: 14,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  separator: { height: StyleSheet.hairlineWidth, backgroundColor: "#E5E5EA" },
  cell: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    flexDirection: "row-reverse",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cellTitle: { fontSize: 17, color: "#1C1C1E", fontFamily: "Cairo_Medium" },
  cellTitleActive: { color: "#007AFF" },
  checkmark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#C7C7CC",
  },
  checkmarkActive: {
    borderColor: "#007AFF",
    backgroundColor: "#007AFF",
  },
  bottomBar: { padding: 16 },
  cta: {
    backgroundColor: "#007AFF",
    height: 52,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaDisabled: { backgroundColor: "#B0B0B5" },
  ctaText: { color: "#fff", fontSize: 17, fontFamily: "Cairo_Bold" },
});


