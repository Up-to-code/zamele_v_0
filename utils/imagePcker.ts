// utils/imagePicker.ts
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

/**
 * Request permission and select image from gallery
 * @returns Promise<string | null> - Image URI or null if canceled/failed
 */
export const selectImageFromGallery = async (): Promise<string | null> => {
  try {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("الإذن مطلوب", "يجب منح الإذن للوصول إلى معرض الصور");
      return null;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    return pickerResult.canceled ? null : pickerResult.assets[0].uri;
  } catch (error) {
    console.error('Error selecting image:', error);
    Alert.alert("خطأ", "فشل في اختيار الصورة");
    return null;
  }
};

/**
 * Request permission and take photo with camera
 * @returns Promise<string | null> - Image URI or null if canceled/failed
 */
export const takePhotoWithCamera = async (): Promise<string | null> => {
  try {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert("الإذن مطلوب", "يجب منح الإذن للوصول إلى الكاميرا");
      return null;
    }

    const pickerResult = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    return pickerResult.canceled ? null : pickerResult.assets[0].uri;
  } catch (error) {
    console.error('Error taking photo:', error);
    Alert.alert("خطأ", "فشل في التقاط الصورة");
    return null;
  }
};