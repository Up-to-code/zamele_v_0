import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

// Import tabs
import HomeTab from '@/components/tabs/home/HomeTab';
import EventsTab from '@/components/tabs/home/EventsTab';
import ActivitiesTab from '@/components/tabs/home/ActivitiesTab';
const Tab = createMaterialTopTabNavigator();

const Index = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Tab.Navigator
        screenOptions={{
          tabBarLabelStyle: styles.tabLabel,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarStyle: styles.tabBar,
        }}
        direction="rtl"
      >
        <Tab.Screen 
          name="Home" 
          component={HomeTab}
          options={{ title: 'الرئيسية' }}
        />
        <Tab.Screen 
          name="Events" 
          component={EventsTab}
          options={{ title: 'الأحداث' }}
        />
        <Tab.Screen 
          name="Activities" 
          component={ActivitiesTab}
          options={{ title: 'الأنشطة' }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
  tabBar: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  tabLabel: {
    fontSize: 14,
    fontFamily: 'Cairo_Bold',
    textTransform: 'none',
  },
  tabIndicator: {
    backgroundColor: '#1B6CB9',
    height: 3,
  },
});

export default Index;