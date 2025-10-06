// utils/imageUpload.ts
import { Id } from "@/convex/_generated/dataModel";
import { Alert } from "react-native";

/**
 * Upload image to Convex storage
 * @param generateUploadUrl - Convex mutation to generate upload URL
 * @param imageUri - Local URI of the image to upload
 * @returns Promise<Id<"_storage"> | null> - Storage ID or null if failed
 */
export const uploadImageToConvex = async (
  generateUploadUrl: () => Promise<string>,
  imageUri: string
): Promise<Id<"_storage"> | null> => {
  try {
    if (!imageUri) {
      console.error('No image URI provided');
      return null;
    }

    const uploadUrl = await generateUploadUrl();
    
    const formData = new FormData();
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1];
    
    formData.append('file', {
      uri: imageUri,
      type: `image/${fileType}`,
      name: `profile.${fileType}`,
    } as any);

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Upload failed:', response.status, errorText);
      throw new Error(`Upload failed: ${response.status}`);
    }

    const result = await response.json();
    console.log('Upload successful:', result);
    
    return result.storageId as Id<"_storage">;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};