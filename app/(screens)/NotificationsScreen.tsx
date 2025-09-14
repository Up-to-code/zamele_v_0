import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

// Force RTL layout for Arabic
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

const colors = {
  primary: "#1B6CB9",
  secondary: "#0E4E8C",
  tertiary: "#434343",
  background: "#F8FBFF",
  card: "#FFFFFF",
  border: "#E8ECF0",
  textSecondary: "#6B7280",
  success: "#10B981",
  warning: "#F59E0B",
  error: "#EF4444",
  info: "#3B82F6",
};

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
  type: "info" | "success" | "warning" | "error";
}

const NotificationsScreen = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      title: "طلب الصداقة الجديد",
      message: "عمر محمد أرسل لك طلب صداقة",
      time: "الآن",
      isRead: false,
      type: "info",
    },
    {
      id: "2",
      title: "تمت الموافقة على طلبك",
      message: "تمت الموافقة على انضمامك إلى مجموعة المطورين",
      time: "١٠ دقائق",
      isRead: false,
      type: "success",
    },
    {
      id: "3",
      title: "اجتماع قريب",
      message: "سيبدأ اجتماع فريق العمل خلال ٣٠ دقيقة",
      time: "ساعة",
      isRead: true,
      type: "warning",
    },
    {
      id: "4",
      title: "تذكير بالحدث",
      message: "حدث نادي التكنولوجيا يبدأ غداً الساعة ٥ مساءً",
      time: "يوم",
      isRead: true,
      type: "info",
    },
  ]);

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === id ? { ...notification, isRead: true } : notification
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ 
      ...notification, 
      isRead: true 
    })));
  };

  const getIconName = (type: string) => {
    switch (type) {
      case "success":
        return "checkmark-circle";
      case "warning":
        return "alert-circle";
      case "error":
        return "close-circle";
      default:
        return "information-circle";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "success":
        return colors.success;
      case "warning":
        return colors.warning;
      case "error":
        return colors.error;
      default:
        return colors.info;
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الإشعارات</Text>
        {unreadCount > 0 && (
          <TouchableOpacity onPress={markAllAsRead}>
            <Text style={styles.markAllText}>تعيين الكل كمقروء</Text>
          </TouchableOpacity>
        )}
      </View>

      {unreadCount > 0 && (
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>{unreadCount} غير مقروء</Text>
        </View>
      )}

      {notifications.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={64} color={colors.border} />
          <Text style={styles.emptyStateTitle}>لا توجد إشعارات</Text>
          <Text style={styles.emptyStateText}>سيظهر هنا أي إشعارات جديدة تتلقاها</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          {notifications.map((notification) => (
            <View 
              key={notification.id} 
              style={[
                styles.notificationCard,
                !notification.isRead && styles.unreadCard
              ]}
            >
              <View style={styles.notificationHeader}>
                <View style={styles.iconContainer}>
                  <Ionicons 
                    name={getIconName(notification.type)} 
                    size={20} 
                    color={getIconColor(notification.type)} 
                  />
                </View>
                <Text style={styles.timeText}>{notification.time}</Text>
              </View>
              
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
              </View>
              
              {!notification.isRead && (
                <TouchableOpacity 
                  style={styles.readButton}
                  onPress={() => markAsRead(notification.id)}
                >
                  <Text style={styles.readButtonText}>تم القراءة</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? (StatusBar.currentHeight || 0) + 20 : 60,
    paddingBottom: 16,
    backgroundColor: colors.background,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.tertiary,
  },
  markAllText: {
    color: colors.primary,
    fontWeight: "500",
    fontSize: 14,
  },
  unreadBadge: {
    backgroundColor: colors.primary + "15",
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 20,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 16,
  },
  unreadText: {
    color: colors.primary,
    fontWeight: "500",
    fontSize: 12,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  notificationCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  unreadCard: {
    borderWidth: 1,
    borderColor: colors.primary + "30",
  },
  notificationHeader: {
    flexDirection: "row-reverse",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
  },
  timeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  notificationContent: {
    marginBottom: 12,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.tertiary,
    marginBottom: 4,
    textAlign: "right",
  },
  notificationMessage: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "right",
    lineHeight: 20,
  },
  readButton: {
    alignSelf: "flex-end",
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colors.primary + "10",
    borderRadius: 12,
  },
  readButtonText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: "500",
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.tertiary,
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});

export default NotificationsScreen;