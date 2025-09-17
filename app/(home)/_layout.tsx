import { Header } from "@/components/common";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { router, Tabs } from "expo-router";
import React from "react";
import { View, Platform, StatusBar } from "react-native";
import { useUserStore } from "@/lib/store/userStore";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RootLayout() {
  const { name, plan, avatarUrl } = useUserStore();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <Tabs
        screenOptions={{
          headerShown: true,
          header: () => (
            <View style={{ backgroundColor: "#fff" }}>
              <Header
                onNotificationsPress={() =>
                  router.push("/(screens)/NotificationsScreen")
                }
                onSearchPress={() => router.push("/(screens)/Search")}
                name={name}
                plan={plan}
                avatarUrl={avatarUrl}
              />
            </View>
          ),
          tabBarStyle: { 
            display: "none", 
            backgroundColor: "#fff",
            height: Platform.OS === "ios" ? 90 : 70,
            paddingBottom: Platform.OS === "ios" ? 25 : 10,
          },
        }}
        tabBar={(props) => <BottomTabBar {...props} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "الرئيسية",
          }}
        />
        <Tabs.Screen
          name="groups"
          options={{
            title: "المجموعات",
          }}
        />
        <Tabs.Screen
          name="account"
          options={{
            title: "الحساب",
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}