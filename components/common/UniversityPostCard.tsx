import type { FeedPost } from "@/types/feed";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Linking,
} from "react-native";

// Define the FileAttachment type
export interface FileAttachment {
  uri: string;
  name: string;
  type: string;
  size?: number;
}

// Extend the FeedPost type to include files
interface ExtendedFeedPost extends FeedPost {
  files?: FileAttachment[];
}

export interface UniversityPostCardProps {
  post: ExtendedFeedPost;
  onLikePress?: (postId: string) => void;
  onCommentPress?: (postId: string) => void;
  onFilePress?: (fileUrl: string, fileName: string) => void;
}

// Helper to get file icon based on type
const getFileIcon = (fileType: string): keyof typeof Ionicons.glyphMap => {
  const type = fileType.toLowerCase();
  if (type.includes("pdf")) return "document-text";
  if (type.includes("word") || type.includes("doc")) return "document";
  if (type.includes("code") || type.includes("txt")) return "code";
  if (type.includes("sheet") || type.includes("excel")) return "stats-chart";
  if (type.includes("zip") || type.includes("rar")) return "archive";
  if (type.includes("image")) return "image";
  if (type.includes("video")) return "videocam";
  if (type.includes("audio")) return "musical-notes";
  return "document";
};

// Helper to format file size
const formatFileSize = (bytes: number): string => {
  if (!bytes || bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// File attachment component
const FileAttachmentItem: React.FC<{
  file: FileAttachment;
  onPress: (uri: string, name: string) => void;
}> = ({ file, onPress }) => {
  const iconName = getFileIcon(file.type);

  return (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => onPress(file.uri, file.name)}
      activeOpacity={0.7}
    >
      <View style={styles.fileIconContainer}>
        <Ionicons name={iconName} size={20} color="#007AFF" />
      </View>
      <View style={styles.fileInfo}>
        <Text style={styles.fileName} numberOfLines={1}>
          {file.name}
        </Text>
        <Text style={styles.fileMeta} numberOfLines={1}>
          {file.type.toUpperCase()}{" "}
          {file.size ? `• ${formatFileSize(file.size)}` : ""}
        </Text>
      </View>
      <Ionicons name="download-outline" size={18} color="#8E8E93" />
    </TouchableOpacity>
  );
};

const UniversityPostCard: React.FC<UniversityPostCardProps> = ({
  post,
  onLikePress,
  onCommentPress,
  onFilePress,
}) => {
  const {
    id,
    user,
    text,
    images = [],
    files = [],
    likesCount = 0,
    commentsCount = 0,
    likedByMe,
    createdAt,
  } = post;

  const handleFilePress = (uri: string, name: string) => {
    if (onFilePress) {
      onFilePress(uri, name);
    } else {
      // Default behavior: try to open the file
      Linking.openURL(uri).catch((err) =>
        console.error("Failed to open file:", err)
      );
    }
  };

  return (
    <View style={styles.card}>
      <View style={[styles.headerRow, styles.rtlRow]}>
        {user.avatarUrl ? (
          <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
        ) : (
          <View style={styles.avatarPlaceholder}>
            <Ionicons name="school" size={18} color="#007AFF" />
          </View>
        )}
        <View style={styles.titleWrap}>
          <View style={[styles.nameRow, styles.rtlRow]}>
            <Text style={[styles.name, styles.rtlText]} numberOfLines={1}>
              {user.name}
            </Text>
            {user.verified && (
              <Ionicons
                name="checkmark-circle"
                size={16}
                color="#34C759"
                style={styles.verifiedIcon}
              />
            )}
          </View>
          <Text style={[styles.subtitle, styles.rtlText]} numberOfLines={1}>
            {createdAt}
          </Text>
        </View>
      </View>

      {!!text && <Text style={[styles.text, styles.rtlText]}>{text}</Text>}

      {images.length > 0 && (
        <View style={[styles.imagesGrid, styles.rtlRow]}>
          {images.slice(0, 4).map((uri, idx) => (
            <Image
              key={`${id}-image-${idx}`}
              source={{ uri }}
              style={[
                styles.image,
                images.length === 1 && styles.singleImage,
                images.length >= 3 && idx === 0 && styles.wideImage,
              ]}
              resizeMode="cover"
            />
          ))}
        </View>
      )}

      {files && files.length > 0 && (
        <View style={styles.filesContainer}>
          {files.map((file, index) => (
            <FileAttachmentItem
              key={`${id}-file-${index}`}
              file={file}
              onPress={handleFilePress}
            />
          ))}
        </View>
      )}

      <View style={[styles.actionsRow, styles.rtlRow]}>
        <TouchableOpacity
          onPress={() => onLikePress?.(id)}
          style={styles.actionBtn}
          activeOpacity={0.7}
        >
          <Ionicons
            name={likedByMe ? "heart" : "heart-outline"}
            size={18}
            color={likedByMe ? "#FF2D55" : "#8E8E93"}
          />
          <Text style={styles.actionText}>{likesCount}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onCommentPress?.(id)}
          style={styles.actionBtn}
          activeOpacity={0.7}
        >
          <Ionicons name="chatbubble-outline" size={18} color="#8E8E93" />
          <Text style={styles.actionText}>{commentsCount}</Text>
        </TouchableOpacity>

        {/* Share button */}
        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="share-social-outline" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF",
    padding: 15,

    gap: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  avatarPlaceholder: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5F1FF",
    alignItems: "center",
    justifyContent: "center",
  },
  titleWrap: {
    flex: 1,
    justifyContent: "center",
  },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  name: {
    fontSize: 15,
    color: "#111",
    fontFamily: "Cairo_Bold",
    flexShrink: 1,
  },
  verifiedIcon: {
    marginLeft: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: "Cairo_Medium",
    marginTop: 2,
  },
  text: {
    fontSize: 14,
    color: "#111",
    fontFamily: "Cairo_Medium",
    lineHeight: 22,
  },
  imagesGrid: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  image: {
    height: 120,
    borderRadius: 10,
    backgroundColor: "#F2F2F7",
    flex: 1,
    minWidth: 100,
    maxWidth: "100%",
  },
  singleImage: {
    flex: 1,
    height: 200,
  },
  wideImage: {
    flex: 2,
  },
  filesContainer: {
    gap: 10,
  },
  fileItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  fileIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#E7F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginEnd: 12,
  },
  fileInfo: {
    flex: 1,
    gap: 4,
    marginEnd: 8,
  },
  fileName: {
    fontSize: 14,
    color: "#111",
    fontFamily: "Cairo_Medium",
  },
  fileMeta: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: "Cairo_Regular",
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: "#F2F2F7",
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    fontSize: 13,
    color: "#6B7280",
    fontFamily: "Cairo_Medium",
    minWidth: 20,
    textAlign: "center",
  },
  rtlRow: { flexDirection: "row-reverse" },
  rtlText: { textAlign: "right" },
});

export default UniversityPostCard;
