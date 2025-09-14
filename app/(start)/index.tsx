import { router } from "expo-router";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Start() {
  return (
    <SafeAreaView style={styles.container}>
      {/* الصورة في الوسط */}
      <View style={styles.centerContent}>
        <Image
          source={require("@/assets/images/s1.png")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      {/* الأزرار في الأسفل */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.8}
          onPress={() => {
            router.push("/(start)/auth/sign-in");
          }}
        >
          <Text style={styles.loginButtonText}>تسجيل الدخول</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.createButton}
          activeOpacity={0.8}
          onPress={() => {
            router.push("/(start)/choiceScreen");
          }}
        >
          <Text style={styles.createButtonText}>إنشاء حساب</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f9fafb" },
  centerContent: { flex: 1, justifyContent: "center", alignItems: "center" },
  image: { width: "70%", height: 250 },
  footer: { padding: 20, gap: 14 },
  loginButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  loginButtonText: { color: "#fff", fontSize: 18,  fontFamily: "Cairo_Bold"},
  createButton: {
    backgroundColor: "#e5e7eb",
    paddingVertical: 8,
    borderRadius: 18,
    alignItems: "center",
  },
  createButtonText: { color: "#111827", fontSize: 18,   fontFamily: "Cairo_Bold"},
});
