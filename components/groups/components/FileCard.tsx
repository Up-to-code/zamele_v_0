import React, { useMemo } from "react";
import {
  View,
  Text,
  Pressable,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { FileCardProps, FileType } from "../types";
import { COLORS } from "../constants";
import { AnimatedImage } from "./AnimatedImage";

const getFileIconAndColor = (type: FileType): { icon: keyof typeof Ionicons.glyphMap; color: string } => {
  const fileTypeMap: Record<FileType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
    pdf: { icon: "document-text", color: COLORS.error },
    image: { icon: "image", color: COLORS.secondary },
    pin: { icon: "pin", color: COLORS.accent },
    other: { icon: "document", color: COLORS.text.tertiary },
  };
  return fileTypeMap[type];
};

export const FileCard: React.FC<FileCardProps> = React.memo(({ file, scrollY }) => {
  const { icon, color } = useMemo(() => getFileIconAndColor(file.type), [file.type]);

  return (
    <Pressable 
      style={({ pressed }) => [styles.fileCard, pressed && styles.pressedCard]} 
      accessibilityRole="button"
      accessibilityLabel={`ملف: ${file.name} - ${file.size}`}
    >
      <View style={styles.fileHeader}>
        {file.thumbnail ? (
          <AnimatedImage
            source={{ uri: file.thumbnail }}
            style={styles.fileThumbnail}
            scrollY={scrollY}
            accessibilityIgnoresInvertColors
          />
        ) : (
          <View style={[styles.fileIcon, { backgroundColor: `${color}15` }]}>
            <Ionicons name={icon} size={20} color={color} />
          </View>
        )}
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">
            {file.name}
          </Text>
          <Text style={styles.fileMeta}>
            {file.size} • {file.uploadDate}
          </Text>
        </View>
      </View>
      
      <TouchableOpacity 
        accessibilityRole="button"
        accessibilityLabel="تحميل الملف"
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Ionicons name="download-outline" size={20} color={COLORS.primary} />
      </TouchableOpacity>
    </Pressable>
  );
});

FileCard.displayName = 'FileCard';

const styles = StyleSheet.create({
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  pressedCard: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  fileHeader: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    flex: 1,
  },
  fileThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.text.primary,
    marginBottom: 4,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  fileMeta: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
});