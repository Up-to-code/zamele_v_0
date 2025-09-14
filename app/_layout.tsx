import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import { ConvexProvider } from "convex/react";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { convex } from "../lib/convexClient";
import { usePersistUserStore } from "../lib/hooks/usePersistUserStore";
import { useSyncUser } from "../lib/hooks/useSyncUser";

// إعداد شاشة البداية (Splash)
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

SplashScreen.preventAutoHideAsync();

const CLERK_PUBLISHABLE_KEY = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

export default function RootLayout() {
  const [loaded] = useFonts({
    Cairo_Bold: require("../assets/fonts/Cairo-Bold.ttf"),
    Cairo_Medium: require("../assets/fonts/Cairo-Medium.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hide();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ClerkProvider tokenCache={tokenCache} publishableKey={CLERK_PUBLISHABLE_KEY!}>
      <ConvexProvider client={convex}>
        <SyncWrapper />
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: {
              backgroundColor: "#fff",
            },
          }}
        />
      </ConvexProvider>
    </ClerkProvider>
  );
}

function SyncWrapper() {
  useSyncUser();
  usePersistUserStore();
  return null;
}
