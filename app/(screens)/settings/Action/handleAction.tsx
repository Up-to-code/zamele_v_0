import { useAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";

export const useHandleAction = () => {
  const { signOut } = useAuth();

  const handleAction = (itemId: string) => {
    switch (itemId) {
      case "1":
        console.log("🔑 فتح معلومات الحساب");
        break;

      case "2":
        console.log("🔒 فتح إعدادات الخصوصية");
        break;

      case "3":
        console.log("✏️ تغيير كلمة المرور");
        break;

      case "7":
        console.log("📞 فتح المساعدة والدعم");
        break;

      case "8":
        console.log("ℹ️ عرض معلومات عن التطبيق");
        break;

      case "9":
        console.log("📤 مشاركة التطبيق");
        break;

      case "10":
        console.log("⭐ تقييم التطبيق");
        break;

      case "11":
        console.log("🚪 تسجيل الخروج");

        signOut(); // 👈 هنا بيعمل تسجيل خروج فعلي
             router.push('/'); // 👈 هنا بيعمل تسجيل خروج فعلي
   
        break;

      case "12":
        console.log("🗑️ حذف الحساب");
        // TODO: ممكن تضيف استدعاء API لحذف الحساب من Clerk
        break;

      default:
        console.warn(`⚠️ لا يوجد إجراء معرف للعنصر: ${itemId}`);
    }
  };

  return { handleAction };
};
