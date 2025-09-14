import React, { useState, useEffect, useCallback, JSX } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  StatusBar,
  Platform,
  TextInput,
  Alert,
  ActivityIndicator,
  Switch,
  Modal,
  FlatList,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  ImageSourcePropType,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";

const { width, height } = Dimensions.get("window");

const colorPalette = {
  primaryBlue: "#007AFF",
  secondaryPurple: "#5856D6",
  textBlack: "#000000",
  backgroundGray: "#F2F2F7",
  cardWhite: "#FFFFFF",
  borderLightGray: "#C6C6C8",
  textSecondaryGray: "#8E8E93",
  errorRed: "#FF3B30",
  successGreen: "#34C759",
};

// Mock data for universities and sections
interface Option {
  label: string;
  value: string;
}

const MOCK_UNIVERSITIES: Option[] = [
  { label: "جامعة الملك سعود", value: "uni_1" },
  { label: "جامعة الملك فهد", value: "uni_2" },
  { label: "جامعة الأميرة نورة", value: "uni_3" },
];

const MOCK_SECTIONS: Option[] = [
  { label: "قسم علوم الحاسب", value: "sec_1" },
  { label: "قسم الهندسة", value: "sec_2" },
  { label: "قسم إدارة الأعمال", value: "sec_3" },
];

const YEAR_OPTIONS: Option[] = [
  { label: "السنة الأولى", value: "1" },
  { label: "السنة الثانية", value: "2" },
  { label: "السنة الثالثة", value: "3" },
  { label: "السنة الرابعة", value: "4" },
  { label: "خريج", value: "5" },
];

const PLAN_OPTIONS: Option[] = [
  { label: "مجاني", value: "free" },
  { label: "مميز", value: "pro" },
  { label: "الأقصى", value: "max" },
];

type UserType = "student" | "teacher";
type PlanType = "free" | "pro" | "max";

interface FormData {
  name: string;
  userType: UserType;
  universityId: string | null;
  sectionId: string | null;
  year: string;
  isVerified: boolean;
  plan: PlanType;
}

interface UserProfileData {
  name: string;
  userType: UserType;
  universityId: string | null;
  sectionId: string | null;
  year: string;
  isVerified: boolean;
  plan: PlanType;
  avatarUrl: string | null;
}

const EditAccountScreen: React.FC = () => {
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showPicker, setShowPicker] = useState<boolean>(false);
  const [pickerType, setPickerType] = useState<"university" | "section" | "year" | "plan" | null>(null);
  
  // Mock user data
  const [userProfileData, setUserProfileData] = useState<UserProfileData>({
    name: "أحمد محمد",
    userType: "student",
    universityId: "uni_1",
    sectionId: "sec_1",
    year: "3",
    isVerified: true,
    plan: "free",
    avatarUrl: null,
  });

  // Form state
  const [formData, setFormData] = useState<FormData>({
    name: userProfileData.name,
    userType: userProfileData.userType,
    universityId: userProfileData.universityId,
    sectionId: userProfileData.sectionId,
    year: userProfileData.year,
    isVerified: userProfileData.isVerified,
    plan: userProfileData.plan,
  });

  useEffect(() => {
    setFormData({
      name: userProfileData.name,
      userType: userProfileData.userType,
      universityId: userProfileData.universityId,
      sectionId: userProfileData.sectionId,
      year: userProfileData.year,
      isVerified: userProfileData.isVerified,
      plan: userProfileData.plan,
    });
  }, [userProfileData]);

  const handleInputChange = (field: keyof FormData, value: string | boolean | UserType) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectProfileImage = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("يجب منح الإذن للوصول إلى الصور");
        return;
      }

      const pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setSelectedImage(pickerResult.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("خطأ", "فشل في اختيار الصورة");
    }
  };

  const takeProfilePhoto = async (): Promise<void> => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert("يجب منح الإذن للوصول إلى الكاميرا");
        return;
      }

      const pickerResult = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!pickerResult.canceled) {
        setSelectedImage(pickerResult.assets[0].uri);
      }
    } catch (error) {
      Alert.alert("خطأ", "فشل في التقاط الصورة");
    }
  };

  const handleSaveChanges = async (): Promise<void> => {
    setIsUpdating(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update user data
      setUserProfileData({
        ...userProfileData,
        name: formData.name,
        userType: formData.userType,
        universityId: formData.universityId,
        sectionId: formData.sectionId,
        year: formData.year,
        isVerified: formData.isVerified,
        plan: formData.plan,
        avatarUrl: selectedImage || userProfileData.avatarUrl,
      });
      
      Alert.alert("تم الحفظ", "تم تحديث بياناتك بنجاح");
    } catch (error) {
      Alert.alert("خطأ", "فشل في حفظ التغييرات");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = (): void => {
    // Navigate back or close modal
  };

  const openPicker = (type: "university" | "section" | "year" | "plan"): void => {
    setPickerType(type);
    setShowPicker(true);
  };

  const handlePickerSelect = (value: string): void => {
    if (pickerType === "university") {
      handleInputChange("universityId", value);
    } else if (pickerType === "section") {
      handleInputChange("sectionId", value);
    } else if (pickerType === "year") {
      handleInputChange("year", value);
    } else if (pickerType === "plan") {
      handleInputChange("plan", value as PlanType);
    }
    setShowPicker(false);
    setPickerType(null);
  };

  const getPickerData = (): Option[] => {
    switch (pickerType) {
      case "university":
        return MOCK_UNIVERSITIES;
      case "section":
        return MOCK_SECTIONS;
      case "year":
        return YEAR_OPTIONS;
      case "plan":
        return PLAN_OPTIONS;
      default:
        return [];
    }
  };

  const getPickerTitle = (): string => {
    switch (pickerType) {
      case "university":
        return "اختر الجامعة";
      case "section":
        return "اختر القسم";
      case "year":
        return "اختر السنة الدراسية";
      case "plan":
        return "اختر الخطة";
      default:
        return "اختر";
    }
  };

  const renderPickerItem = ({ item }: { item: Option }): JSX.Element => (
    <TouchableOpacity
      style={styles.pickerItem}
      onPress={() => handlePickerSelect(item.value)}
    >
      <Text style={styles.pickerItemText}>{item.label}</Text>
      {((pickerType === "university" && formData.universityId === item.value) ||
        (pickerType === "section" && formData.sectionId === item.value) ||
        (pickerType === "year" && formData.year === item.value) ||
        (pickerType === "plan" && formData.plan === item.value)) && (
        <Ionicons name="checkmark" size={20} color={colorPalette.primaryBlue} />
      )}
    </TouchableOpacity>
  );

  const handleClosePicker = useCallback((): void => {
    setShowPicker(false);
    setPickerType(null);
  }, []);

  return (
    <SafeAreaView style={styles.screenContainer} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={colorPalette.backgroundGray} />
      
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={handleCancel} style={styles.headerButton}>
          <Ionicons name="close" size={24} color={colorPalette.textBlack} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>تعديل الملف الشخصي</Text>
        <TouchableOpacity 
          onPress={handleSaveChanges} 
          style={[styles.headerButton, isUpdating && styles.disabledButton]}
          disabled={isUpdating}
        >
          {isUpdating ? (
            <ActivityIndicator size="small" color={colorPalette.primaryBlue} />
          ) : (
            <Text style={styles.saveButtonText}>حفظ</Text>
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView 
            style={styles.scrollContainer} 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
            keyboardShouldPersistTaps="handled"
          >
            {/* Profile Image Section */}
            <View style={styles.profileImageSection}>
              <View style={styles.profileImageContainer}>
                {selectedImage ? (
                  <Image source={{ uri: selectedImage }} style={styles.profileImage} />
                ) : userProfileData.avatarUrl ? (
                  <Image source={{ uri: userProfileData.avatarUrl }} style={styles.profileImage} />
                ) : (
                  <View style={styles.defaultAvatar}>
                    <Ionicons name="person" size={50} color={colorPalette.textSecondaryGray} />
                  </View>
                )}
              </View>

              <View style={styles.imageButtonsContainer}>
                <TouchableOpacity 
                  style={styles.imageActionButton}
                  onPress={selectProfileImage}
                >
                  <Ionicons name="image" size={20} color={colorPalette.primaryBlue} />
                  <Text style={styles.imageActionText}>اختر صورة</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.imageActionButton}
                  onPress={takeProfilePhoto}
                >
                  <Ionicons name="camera" size={20} color={colorPalette.primaryBlue} />
                  <Text style={styles.imageActionText}>التقط صورة</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Form Section */}
            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الاسم الكامل</Text>
                <TextInput
                  style={styles.textInput}
                  value={formData.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                  placeholder="أدخل اسمك الكامل"
                  placeholderTextColor={colorPalette.textSecondaryGray}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>نوع المستخدم</Text>
                <View style={styles.userTypeContainer}>
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

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الجامعة</Text>
                <TouchableOpacity onPress={() => openPicker("university")} style={styles.pickerTouchable}>
                  <View style={styles.pickerContainer}>
                    <Text style={[
                      styles.pickerText,
                      !formData.universityId && styles.pickerPlaceholder
                    ]}>
                      {MOCK_UNIVERSITIES.find(u => u.value === formData.universityId)?.label || "اختر الجامعة"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colorPalette.textSecondaryGray} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>القسم</Text>
                <TouchableOpacity onPress={() => openPicker("section")} style={styles.pickerTouchable}>
                  <View style={styles.pickerContainer}>
                    <Text style={[
                      styles.pickerText,
                      !formData.sectionId && styles.pickerPlaceholder
                    ]}>
                      {MOCK_SECTIONS.find(s => s.value === formData.sectionId)?.label || "اختر القسم"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colorPalette.textSecondaryGray} />
                  </View>
                </TouchableOpacity>
              </View>

              {formData.userType === "student" && (
                <View style={styles.inputGroup}>
                  <Text style={styles.inputLabel}>السنة الدراسية</Text>
                  <TouchableOpacity onPress={() => openPicker("year")} style={styles.pickerTouchable}>
                    <View style={styles.pickerContainer}>
                      <Text style={[
                        styles.pickerText,
                        !formData.year && styles.pickerPlaceholder
                      ]}>
                        {YEAR_OPTIONS.find(y => y.value === formData.year)?.label || "اختر السنة"}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color={colorPalette.textSecondaryGray} />
                    </View>
                  </TouchableOpacity>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>الخطة</Text>
                <TouchableOpacity onPress={() => openPicker("plan")} style={styles.pickerTouchable}>
                  <View style={styles.pickerContainer}>
                    <Text style={[
                      styles.pickerText,
                      !formData.plan && styles.pickerPlaceholder
                    ]}>
                      {PLAN_OPTIONS.find(p => p.value === formData.plan)?.label || "اختر الخطة"}
                    </Text>
                    <Ionicons name="chevron-down" size={20} color={colorPalette.textSecondaryGray} />
                  </View>
                </TouchableOpacity>
              </View>

              <View style={styles.switchGroup}>
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>الحساب موثق</Text>
                  <Switch
                    value={formData.isVerified}
                    onValueChange={(value) => handleInputChange("isVerified", value)}
                    trackColor={{ false: "#767577", true: colorPalette.primaryBlue }}
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

      {/* Picker Modal with iOS-style bottom sheet */}
      <Modal
        visible={showPicker}
        transparent={true}
        animationType="slide"
        onRequestClose={handleClosePicker}
      >
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback onPress={handleClosePicker}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          
          <View style={styles.modalContent}>
            {/* Handle bar for iOS-style bottom sheet */}
            <View style={styles.handleBar} />
            
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{getPickerTitle()}</Text>
              <TouchableOpacity onPress={handleClosePicker} style={styles.modalCloseButton}>
                <Text style={styles.modalCloseText}>تم</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={getPickerData()}
              renderItem={renderPickerItem}
              keyExtractor={(item) => item.value}
              style={styles.pickerList}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: colorPalette.backgroundGray,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: colorPalette.cardWhite,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.borderLightGray,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colorPalette.textBlack,
  },
  headerButton: {
    padding: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colorPalette.primaryBlue,
    fontSize: 16,
    fontWeight: "600",
  },
  profileImageSection: {
    alignItems: "center",
    paddingVertical: 24,
    backgroundColor: colorPalette.cardWhite,
    marginBottom: 16,
  },
  profileImageContainer: {
    position: "relative",
    marginBottom: 16,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: colorPalette.primaryBlue,
  },
  defaultAvatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colorPalette.backgroundGray,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colorPalette.primaryBlue,
  },
  imageButtonsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 24,
  },
  imageActionButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: `${colorPalette.primaryBlue}10`,
    borderRadius: 8,
  },
  imageActionText: {
    color: colorPalette.primaryBlue,
    fontWeight: "500",
  },
  formContainer: {
    backgroundColor: colorPalette.cardWhite,
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 24,
    borderRadius: 12,
    marginHorizontal: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: colorPalette.textBlack,
    fontWeight: "600",
    textAlign: "right",
  },
  textInput: {
    backgroundColor: colorPalette.backgroundGray,
    padding: 12,
    borderRadius: 8,
    fontSize: 16,
    textAlign: "right",
    borderWidth: 1,
    borderColor: colorPalette.borderLightGray,
  },
  userTypeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: colorPalette.backgroundGray,
    borderRadius: 8,
    overflow: "hidden",
  },
  userTypeButton: {
    flex: 1,
    padding: 12,
    alignItems: "center",
  },
  userTypeButtonActive: {
    backgroundColor: colorPalette.primaryBlue,
  },
  userTypeText: {
    fontWeight: "500",
    color: colorPalette.textSecondaryGray,
  },
  userTypeTextActive: {
    color: colorPalette.cardWhite,
  },
  pickerTouchable: {
    marginTop: 4,
  },
  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: colorPalette.backgroundGray,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colorPalette.borderLightGray,
  },
  pickerText: {
    fontSize: 16,
    color: colorPalette.textBlack,
    textAlign: "right",
  },
  pickerPlaceholder: {
    color: colorPalette.textSecondaryGray,
  },
  switchGroup: {
    marginTop: 16,
  },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  switchLabel: {
    fontSize: 16,
    color: colorPalette.textBlack,
    fontWeight: "500",
    textAlign: "right",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContent: {
    backgroundColor: colorPalette.cardWhite,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: "50%",
    paddingBottom: 34,
  },
  handleBar: {
    width: 40,
    height: 5,
    backgroundColor: colorPalette.borderLightGray,
    borderRadius: 3,
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.borderLightGray,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: colorPalette.textBlack,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalCloseText: {
    color: colorPalette.primaryBlue,
    fontSize: 17,
    fontWeight: "600",
  },
  pickerList: {
    maxHeight: height * 0.4,
  },
  pickerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colorPalette.borderLightGray,
  },
  pickerItemText: {
    fontSize: 16,
    fontWeight: "500",
    color: colorPalette.textBlack,
    textAlign: "right",
  },
});

export default EditAccountScreen;