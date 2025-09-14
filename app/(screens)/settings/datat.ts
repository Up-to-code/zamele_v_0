import { useState } from "react";
import colors from "@/config/color";
import { SettingsSection } from "./type";

export const useSettings = () => {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [wifiOnly, setWifiOnly] = useState(false);

  const settingsSections: SettingsSection[] = [
    {
      title: "الحساب",
      items: [
        {
          id: "1",
          title: "معلومات الحساب",
          icon: "person",
          color: colors.primary,
          type: "link",
        },
        {
          id: "2",
          title: "خصوصية الحساب",
          icon: "lock-closed",
          color: colors.primary,
          type: "link",
        },
        {
          id: "3",
          title: "تغيير كلمة المرور",
          icon: "key",
          color: colors.primary,
          type: "link",
        },
      ],
    },
    {
      title: "التفضيلات",
      items: [
        {
          id: "4",
          title: "الإشعارات",
          icon: "notifications",
          color: colors.success,
          type: "toggle",
          value: notifications,
          onValueChange: setNotifications,
        },
        {
          id: "5",
          title: "الوضع الليلي",
          icon: "moon",
          color: colors.tertiary,
          type: "toggle",
          value: darkMode,
          onValueChange: setDarkMode,
        },
        {
          id: "6",
          title: "التحديث التلقائي",
          icon: "refresh",
          color: colors.warning,
          type: "toggle",
          value: autoUpdate,
          onValueChange: setAutoUpdate,
        },
        {
          id: "13",
          title: "التحديث عبر Wi-Fi فقط",
          icon: "wifi",
          color: colors.primary,
          type: "toggle",
          value: wifiOnly,
          onValueChange: setWifiOnly,
        },
      ],
    },
    {
      title: "عام",
      items: [
        {
          id: "7",
          title: "المساعدة والدعم",
          icon: "help-circle",
          color: colors.primary,
          type: "link",
        },
        {
          id: "8",
          title: "عن التطبيق",
          icon: "information",
          color: colors.primary,
          type: "link",
        },
        {
          id: "9",
          title: "شارك التطبيق",
          icon: "share",
          color: colors.primary,
          type: "link",
        },
        {
          id: "10",
          title: "تقييم التطبيق",
          icon: "star",
          color: colors.warning,
          type: "link",
        },
      ],
    },
    {
      title: "الإجراءات",
      items: [
        {
          id: "11",
          title: "تسجيل الخروج",
          icon: "log-out",
          color: colors.danger,
          type: "action",
        },
        {
          id: "12",
          title: "حذف الحساب",
          icon: "trash",
          color: colors.danger,
          type: "action",
        },
      ],
    },
  ];

  return { settingsSections };
};
