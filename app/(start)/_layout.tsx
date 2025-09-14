import colors from "@/config/color";
import { Stack } from "expo-router";

export default function StartLayout() {
  return (
    <Stack
      screenOptions={{
        animation: "fade",
        headerShown: false,
        headerStyle: {
          backgroundColor: colors.background,
        },
        headerTitle: "",
        headerShadowVisible: false,
        contentStyle: {
          backgroundColor: colors.background,
        },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="choiceScreen" />
    </Stack>
  );
}
