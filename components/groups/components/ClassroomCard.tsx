import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ClassroomCardProps } from "../types";
import { COLORS } from "../constants";
import { AnimatedImage } from "./AnimatedImage";

export const ClassroomCard: React.FC<ClassroomCardProps> = React.memo(({ classroom, scrollY }) => (
  <Pressable 
    style={({ pressed }) => [styles.card, pressed && styles.pressedCard]} 
    accessibilityRole="button"
    accessibilityLabel={`فصل دراسي: ${classroom.title} - ${classroom.progress}% مكتمل`}
  >
    <View style={styles.classroomHeader}>
      <AnimatedImage
        source={{ uri: classroom.thumbnail }}
        style={styles.classroomThumbnail}
        scrollY={scrollY}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.classroomInfo}>
        <Text style={styles.classroomTitle}>{classroom.title}</Text>
        <Text style={styles.classroomInstructor}>{classroom.instructor}</Text>
        <Text style={styles.classroomDescription} numberOfLines={2}>
          {classroom.shortDescription}
        </Text>
        <View style={styles.classroomStats}>
          <Text style={styles.classroomStat}>{classroom.students} طالب</Text>
          <Text style={styles.classroomStat}>{classroom.assignments} واجب</Text>
        </View>
      </View>
    </View>
    
    <View style={styles.progressContainer}>
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            { width: `${Math.min(100, Math.max(0, classroom.progress))}%` },
            classroom.completed && styles.completedProgress,
          ]}
        />
      </View>
      <Text style={styles.progressText}>{classroom.progress}% مكتمل</Text>
    </View>
  </Pressable>
));

ClassroomCard.displayName = 'ClassroomCard';

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
  pressedCard: {
    opacity: 0.8,
    transform: [{ scale: 0.99 }],
  },
  classroomHeader: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    marginBottom: 16,
  },
  classroomThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginHorizontal: 12,
  },
  classroomInfo: {
    flex: 1,
  },
  classroomTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 4,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  classroomInstructor: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    marginBottom: 6,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  classroomDescription: {
    fontSize: 14,
    color: COLORS.text.secondary,
    lineHeight: 20,
    marginBottom: 8,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  classroomStats: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
  },
  classroomStat: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    marginRight: 16,
    fontWeight: "500",
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 4,
    backgroundColor: COLORS.background.tertiary,
    borderRadius: 2,
    marginRight: 12,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  completedProgress: {
    backgroundColor: COLORS.secondary,
  },
  progressText: {
    fontSize: 12,
    color: COLORS.text.tertiary,
    fontWeight: "500",
    minWidth: 60,
  },
});