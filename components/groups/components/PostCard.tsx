import React, { useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PostCardProps } from "../types";
import { COLORS } from "../constants";
import { AnimatedImage } from "./AnimatedImage";

export const PostCard: React.FC<PostCardProps> = React.memo(({
  post,
  onLike,
  scrollY,
}) => {
  const handleLikePress = useCallback(() => {
    onLike(post.id);
  }, [post.id, onLike]);

  return (
    <View style={styles.card}>
      <View style={styles.postHeader}>
        <AnimatedImage
          source={{ uri: post.userAvatar }}
          style={styles.avatar}
          scrollY={scrollY}
          accessibilityIgnoresInvertColors
        />
        <View style={styles.postInfo}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
      </View>
      
      <Text style={styles.postContent}>{post.content}</Text>
      
      <View style={styles.postActions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={handleLikePress}
          accessibilityRole="button"
          accessibilityLabel={`${post.isLiked ? 'إلغاء الإعجاب' : 'إعجاب'} - ${post.likes} إعجاب`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={post.isLiked ? "heart" : "heart-outline"}
            size={18}
            color={post.isLiked ? COLORS.error : COLORS.text.tertiary}
          />
          <Text style={[styles.actionText, post.isLiked && styles.likedText]}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel={`${post.comments} تعليق`}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="chatbubble-outline" size={18} color={COLORS.text.tertiary} />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.actionButton}
          accessibilityRole="button"
          accessibilityLabel="مشاركة"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="share-social-outline" size={18} color={COLORS.text.tertiary} />
        </TouchableOpacity>
      </View>
    </View>
  );
});

PostCard.displayName = 'PostCard';

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  postHeader: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 12,
  },
  postInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  postTime: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  postContent: {
    fontSize: 16,
    color: COLORS.text.primary,
    lineHeight: 24,
    marginBottom: 16,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  postActions: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 24,
    paddingVertical: 4,
    borderRadius: 6,
  },
  actionText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    marginLeft: 6,
    fontWeight: "500",
  },
  likedText: {
    color: COLORS.error,
  },
});