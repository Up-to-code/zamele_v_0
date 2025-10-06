// screens/account/EditAccountScreen.tsx
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useAuth } from "@clerk/clerk-expo";
import { useUserStore } from "@/lib/store/userStore";
import { router } from "expo-router";
import { 
  University, 
  Section, 
  FormData, 
  UserType, 
  PlanType, 
  PickerOption 
} from "@/types";
import { colors, YEAR_OPTIONS, PLAN_OPTIONS } from "@/constants";
import { PickerModal } from "@/components";
import { selectImageFromGallery, takePhotoWithCamera, uploadImageToConvex } from "@/utils";
 

const EditAccountScreen: React.FC = () => {
  const { userId } = useAuth();
  const userStore = useUserStore();
  
  // Convex queries and mutations
  const userData = useQuery(
    api.users.getByClerkId, 
    userId ? { clerkUserId: userId } : "skip"
  );
  
  const universities = useQuery(api.universities.list) || [];
  const sections = useQuery(api.sections.list) || [];
  const updateProfile = useMutation(api.users.updateProfile);
  const generateUploadUrl = useMutation(api.users.generateUploadUrl);

  // State management
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState(false);
  const [pickerType, setPickerType] = useState<"university" | "section" | "year" | "plan" | null>(null);

  // Get user data with fallbacks
  const displayName = userData?.name || userStore.name || "";
  const displayAvatar = userData?.avatarUrl || userStore.avatarUrl;
  const isVerified = userData?.isVerified || userStore.isVerified || false;
  const userType = (userData?.userType || userStore.userType || "student") as UserType;
  const universityId = userData?.universityId || userStore.universityId || null;
  const sectionId = userData?.sectionId || userStore.sectionId || null;
  const year = userData?.year || userStore.year || "1";
  const plan = (userData?.plan || userStore.plan || "free") as PlanType;

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: displayName,
    userType,
    universityId,
    sectionId,
    year,
    isVerified,
    plan,
  });

  // Update form when data changes
  useEffect(() => {
    setFormData({
      name: displayName,
      userType,
      universityId,
      sectionId,
      year,
      isVerified,
      plan,
    });
  }, [userData, userStore]);

  // Handle form input changes
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev: FormData) => ({ ...prev, [field]: value }));
  };

  // Handle image selection
  const handleSelectImage = async () => {
    const imageUri = await selectImageFromGallery();
    if (imageUri) {
      setSelectedImage(imageUri);
    }
  };

  // Handle photo capture
  const handleTakePhoto = async () => {
    const imageUri = await takePhotoWithCamera();
    if (imageUri) {
      setSelectedImage(imageUri);
    }
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    if (!userId) {
      Alert.alert("خطأ", "لم يتم العثور على معرف المستخدم");
      return;
    }

    if (!formData.name.trim()) {
      Alert.alert("خطأ", "الاسم مطلوب");
      return;
    }

    setIsUpdating(true);
    
    try {
      let avatarStorageId: Id<"_storage"> | undefined = undefined;

      // Upload new image if selected
      if (selectedImage) {
        const storageId = await uploadImageToConvex(
          () => generateUploadUrl(),
          selectedImage
        );
        if (storageId) {
          avatarStorageId = storageId;
        } else {
          Alert.alert("خطأ", "فشل في رفع الصورة");
          return;
        }
      }

      // Prepare update data
      const updateData = {
        clerkUserId: userId,
        name: formData.name,
        userType: formData.userType,
        year: formData.year,
        isVerified: formData.isVerified,
        plan: formData.plan,
        ...(formData.universityId && { universityId: formData.universityId as Id<"universities"> }),
        ...(formData.sectionId && { sectionId: formData.sectionId as Id<"sections"> }),
        ...(avatarStorageId && { avatarStorageId }),
      };

      // Update profile in Convex
      await updateProfile(updateData);
      
      Alert.alert("تم الحفظ", "تم تحديث بياناتك الشخصية بنجاح", [
        { text: "حسناً", onPress: () => router.back() }
      ]);
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert("خطأ", "فشل في حفظ التغييرات. يرجى المحاولة مرة أخرى.");
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    router.back();
  };

  // Open picker
  const openPicker = (type: "university" | "section" | "year" | "plan") => {
    setPickerType(type);
    setShowPicker(true);
  };

  // Handle picker selection
  const handlePickerSelect = (value: string) => {
    if (!pickerType) return;

    const fieldMap = {
      university: "universityId",
      section: "sectionId", 
      year: "year",
      plan: "plan"
    } as const;

    const field = fieldMap[pickerType];
    handleInputChange(field, pickerType === "plan" ? value as PlanType : value);
  };

  // Get picker data
  const getPickerData = (): PickerOption[] => {
    switch (pickerType) {
      case "university": 
        return universities.map((uni: University) => ({ 
          label: uni.nameAr || uni.nameEn || "", 
          value: uni._id 
        }));
      case "section": 
        return sections.map((sec: Section) => ({ 
          label: sec.nameAr || sec.nameEn || "", 
          value: sec._id 
        }));
      case "year": 
        return YEAR_OPTIONS;
      case "plan": 
        return PLAN_OPTIONS;
      default: 
        return [];
    }
  };

  // Get picker title
  const getPickerTitle = (): string => {
    switch (pickerType) {
      case "university": return "اختر الجامعة";
      case "section": return "اختر القسم";
      case "year": return "اختر السنة الدراسية";
      case "plan": return "اختر الخطة";
      default: return "اختر";
    }
  };

  // Get selected label
  const getSelectedLabel = (type: "university" | "section" | "year" | "plan"): string => {
    const data = getPickerData();
    const selectedValue = formData[`${type}Id` as keyof FormData] || formData[type as keyof FormData];
    const selected = data.find((item: PickerOption) => item.value === selectedValue);
    return selected?.label || `اختر ${getPickerTitle().split(' ')[1]}`;
  };

  // Close picker
  const handleClosePicker = useCallback(() => {
    setShowPicker(false);
    setPickerType(null);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>
        <TouchableOpacity 
          onPress={handleSaveChanges} 
          style={[styles.saveButton, isUpdating && styles.disabledButton]}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color={colors.card} />
          ) : (
            <Text style={styles.saveButtonText}>حفظ</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior="padding"
        style={styles.keyboardView}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* Profile Image Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                {selectedImage || displayAvatar ? (
                  <Image 
                    source={{ uri: selectedImage || displayAvatar || undefined }} 
                    style={styles.avatar} 
                  />
                ) : (
                  <View style={styles.defaultAvatar}>
                    <Ionicons name="person" size={40} color={colors.textSecondary} />
                  </View>
                )}
                <TouchableOpacity style={styles.editAvatarButton} onPress={handleSelectImage}>
                  <Ionicons name="camera" size={16} color={colors.card} />
                </TouchableOpacity>
              </View>

              <Text style={styles.userName}>{formData.name}</Text>
              <Text style={styles.userEmail}>{userData?.email || ""}</Text>

              <View style={styles.imageButtons}>
                <TouchableOpacity style={styles.imageButton} onPress={handleSelectImage}>
                  <Ionicons name="image-outline" size={18} color={colors.primary} />
                  <Text style={styles.imageButtonText}>معرض الصور</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.imageButton} onPress={handleTakePhoto}>
                  <Ionicons name="camera-outline" size={18} color={colors.primary} />
                  <Text style={styles.imageButtonText}>الكاميرا</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.formSection}>
              <Text style={styles.sectionTitle}>المعلومات الأساسية</Text>

              {/* Name Input */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>الاسم الكامل</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="أدخل اسمك الكامل"
                  placeholderTextColor={colors.textSecondary}
                />
              </View>

              {/* User Type Selection */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>نوع المستخدم</Text>
                <View style={styles.userTypeButtons}>
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      formData.userType === "student" && styles.userTypeButtonActive
                    ]}
                    onPress={() => handleInputChange("userType", "student")}
                  >
                    <Text style={[
                      styles.userTypeText,
                      formData.userType === "student" && styles.userTypeTextActive
                    ]}>
                      طالب
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[
                      styles.userTypeButton,
                      formData.userType === "teacher" && styles.userTypeButtonActive
                    ]}
                    onPress={() => handleInputChange("userType", "teacher")}
                  >
                    <Text style={[
                      styles.userTypeText,
                      formData.userType === "teacher" && styles.userTypeTextActive
                    ]}>
                      مدرس
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={styles.sectionTitle}>المعلومات الأكاديمية</Text>

              {/* University Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>الجامعة</Text>
                <TouchableOpacity onPress={() => openPicker("university")} style={styles.picker}>
                  <Text style={[
                    styles.pickerText,
                    !formData.universityId && styles.pickerPlaceholder
                  ]}>
                    {getSelectedLabel("university")}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Section Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>القسم</Text>
                <TouchableOpacity onPress={() => openPicker("section")} style={styles.picker}>
                  <Text style={[
                    styles.pickerText,
                    !formData.sectionId && styles.pickerPlaceholder
                  ]}>
                    {getSelectedLabel("section")}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Year Picker (only for students) */}
              {formData.userType === "student" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>السنة الدراسية</Text>
                  <TouchableOpacity onPress={() => openPicker("year")} style={styles.picker}>
                    <Text style={[
                      styles.pickerText,
                      !formData.year && styles.pickerPlaceholder
                    ]}>
                      {getSelectedLabel("year")}
                    </Text>
                    <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                  </TouchableOpacity>
                </View>
              )}

              <Text style={styles.sectionTitle}>الإعدادات</Text>

              {/* Plan Picker */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>الخطة</Text>
                <TouchableOpacity onPress={() => openPicker("plan")} style={styles.picker}>
                  <Text style={[
                    styles.pickerText,
                    !formData.plan && styles.pickerPlaceholder
                  ]}>
                    {getSelectedLabel("plan")}
                  </Text>
                  <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Verification Switch */}
              <View style={styles.switchGroup}>
                <View style={styles.switchRow}>
                  <Text style={styles.switchLabel}>الحساب موثق</Text>
                  <Switch
                    value={formData.isVerified}
                    onValueChange={(value) => handleInputChange("isVerified", value)}
                    trackColor={{ false: colors.border, true: colors.primary }}
                  />
                </View>
                <Text style={styles.switchDescription}>
                  الحساب الموثق يحصل على ميزات إضافية
                </Text>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Picker Modal */}
      <PickerModal
        visible={showPicker}
        title={getPickerTitle()}
        options={getPickerData()}
        selectedValue={
          pickerType === "university" ? formData.universityId ?? undefined :
          pickerType === "section" ? formData.sectionId ?? undefined :
          pickerType === "year" ? formData.year ?? undefined :
          pickerType === "plan" ? formData.plan ?? undefined :
          undefined
        }
        onSelect={handlePickerSelect}
        onClose={handleClosePicker}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.textPrimary,
  },
  headerButton: {
    padding: 8,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: colors.card,
    fontWeight: "600",
  },
  disabledButton: {
    opacity: 0.6,
  },
  profileSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: colors.card,
    marginBottom: 16,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 16,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: colors.primary,
  },
  defaultAvatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.primary,
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: colors.card,
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  imageButtons: {
    flexDirection: "row",
    gap: 16,
  },
  imageButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: `${colors.primary}15`,
    borderRadius: 8,
  },
  imageButtonText: {
    color: colors.primary,
    fontWeight: "500",
  },
  formSection: {
    backgroundColor: colors.card,
    padding: 16,
    marginHorizontal: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.textPrimary,
    marginBottom: 16,
    marginTop: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
    marginBottom: 8,
    textAlign: "right",
  },
  input: {
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    textAlign: "right",
    color: colors.textPrimary,
  },
  userTypeButtons: {
    flexDirection: "row",
    backgroundColor: colors.background,
    borderRadius: 8,
    overflow: "hidden",
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  userTypeButtonActive: {
    backgroundColor: colors.primary,
  },
  userTypeText: {
    fontWeight: "500",
    color: colors.textSecondary,
  },
  userTypeTextActive: {
    color: colors.card,
  },
  picker: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colors.background,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  pickerText: {
    color: colors.textPrimary,
    textAlign: "right",
  },
  pickerPlaceholder: {
    color: colors.textSecondary,
  },
  switchGroup: {
    marginTop: 8,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textPrimary,
  },
  switchDescription: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: "right",
  },
});

export default EditAccountScreen;