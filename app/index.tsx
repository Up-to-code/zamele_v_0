import colors from "@/config/color";
import { useAuth } from "@clerk/clerk-expo";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  useFocusEffect(
    useCallback(() => {
      if (!isLoaded) return;
      if (isSignedIn) {
        router.replace("/(home)");
      } else {
        router.replace("/(start)");
      }
    }, [isLoaded, isSignedIn, router])
  );
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
