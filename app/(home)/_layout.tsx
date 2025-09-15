import { Header } from "@/components/common";
import { BottomTabBar } from "@/components/layout/BottomTabBar";
import { router, Tabs } from "expo-router";
import React from "react";
import { SafeAreaView, View } from "react-native";
import { useUserStore } from "@/lib/store/userStore";
export default function RootLayout() {
  const { name, plan, avatarUrl } = useUserStore();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        header: () => (
          <SafeAreaView style={{ backgroundColor: "#fff" }}>
            <View>
              <Header
                onNotificationsPress={() =>
                  router.push("/(screens)/NotificationsScreen")
                }
                onSearchPress={() => router.push("/(screens)/Search")}
                name={name}
                plan={plan}
                // avatarUrl={avatarUrl}
              />
            </View>
          </SafeAreaView>
        ),
        tabBarStyle: { display: "none", backgroundColor: "#fff" },
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
  );
}
