import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Switch,
  I18nManager
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from '@/config/color';
import styles from './styles';
import { SettingsItem, SettingsSection, ToggleSettingsItem } from './type';
import { useSettings } from './datat';
import { useHandleAction } from './Action/handleAction';  // 👈 استدعاء الهوك

// Force RTL layout for Arabic
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const SettingsScreen = () => {
  const { settingsSections } = useSettings();
  const { handleAction } = useHandleAction(); // 👈 نجيب الدالة هنا

  // Type guard to check if an item is a toggle item
  const isToggleItem = (item: SettingsItem): item is ToggleSettingsItem => {
    return item.type === 'toggle';
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإعدادات</Text>
      </View>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {settingsSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.sectionContainer}>
            {section.title && <Text style={styles.sectionTitle}>{section.title}</Text>}
            <View style={styles.menuContainer}>
              {section.items.map((item, itemIndex) => (
                <View key={item.id}>
                  <TouchableOpacity 
                    style={styles.menuItem}
                    onPress={() => {
                      if (item.type === 'link' || item.type === 'action') {
                        handleAction(item.id); // 👈 استدعاء الدالة
                      }
                    }}
                  >
                    <View style={[styles.menuIconContainer, {backgroundColor: `${item.color}15`}]}>
                      <Ionicons name={item.icon as any} size={20} color={item.color} />
                    </View>
                    
                    <Text style={styles.menuText}>{item.title}</Text>
                    
                    <View style={styles.spacer} />
                    
                    {isToggleItem(item) ? (
                      <Switch
                        value={item.value}
                        onValueChange={item.onValueChange}
                        trackColor={{ false: "#E5E7EB", true: `${item.color}` }}
                        thumbColor={"#FFFFFF"}
                      />
                    ) : (
                      <Ionicons name="chevron-back" size={16} color={colors.border} />
                    )}
                  </TouchableOpacity>
                  
                  {/* Separator line - don't show after last item */}
                  {itemIndex < section.items.length - 1 && (
                    <View style={styles.separator} />
                  )}
                </View>
              ))}
            </View>
          </View>
        ))}
        
        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>الإصدار 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default SettingsScreen;
