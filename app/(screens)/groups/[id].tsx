import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, {
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Animated,
  FlatList,
  I18nManager,
  Image,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

// Constants
const CONSTANTS = {
  HEADER_MAX_HEIGHT: 200,
  HEADER_MIN_HEIGHT: 90,
  SCROLL_THRESHOLD: 300,
  ANIMATION_THROTTLE: 16,
  REFRESH_TIMEOUT: 1000,
  MAX_RENDER_BATCH: 10,
  WINDOW_SIZE: 10,
  IMAGE_FADE_THRESHOLD: 150,
} as const;

const COLORS = {
  primary: "#007AFF",
  secondary: "#34C759",
  accent: "#FF9500",
  error: "#FF3B30",
  text: {
    primary: "#1C1C1E",
    secondary: "#3C3C43",
    tertiary: "#8E8E93",
  },
  background: {
    primary: "#F5F5F7",
    secondary: "#FFFFFF",
    tertiary: "#F2F2F7",
  },
  border: "rgba(0,0,0,0.05)",
  overlay: "rgba(0,0,0,0.1)",
} as const;

// Types
interface BaseEntity {
  readonly id: string;
}

interface Group extends BaseEntity {
  readonly name: string;
  readonly members: number;
  readonly description: string;
  readonly image: string;
  readonly isPrivate: boolean;
  readonly bannerImage?: string;
}

interface Post extends BaseEntity {
  readonly userName: string;
  readonly userAvatar: string;
  readonly content: string;
  readonly time: string;
  readonly likes: number;
  readonly comments: number;
  readonly isLiked: boolean;
}

interface Classroom extends BaseEntity {
  readonly title: string;
  readonly progress: number;
  readonly instructor: string;
  readonly completed: boolean;
  readonly students: number;
  readonly assignments: number;
  readonly thumbnail: string;
  readonly shortDescription: string;
}

type FileType = "pdf" | "image" | "pin" | "other";

interface FileItem extends BaseEntity {
  readonly name: string;
  readonly type: FileType;
  readonly url: string;
  readonly uploadDate: string;
  readonly size: string;
  readonly thumbnail?: string;
}

interface LeaderboardEntry extends BaseEntity {
  readonly rank: number;
  readonly name: string;
  readonly avatar: string;
  readonly points: number;
  readonly progress: number;
}

type TabKey = "المشاركات" | "الفصول" | "الملفات" | "المتصدرين" | "معلومات";
type FileFilter = "الكل" | "PDF" | "صورة" | "مثبت";

// Enable RTL and LayoutAnimation
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// Header Component
const GroupHeader = React.memo(({
  name,
  onBack,
  scrollY,
}: {
  name: string;
  onBack: () => void;
  scrollY: Animated.Value;
}) => {
  const insets = useSafeAreaInsets();

  // Calculate header height based on scroll position
  const headerHeight = scrollY.interpolate({
    inputRange: [0, CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT],
    outputRange: [CONSTANTS.HEADER_MAX_HEIGHT, CONSTANTS.HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  // Calculate header opacity based on scroll position
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  // Calculate header background opacity based on scroll position
  const headerBackgroundOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  // Calculate button opacity based on scroll position
  const buttonOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.7, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={[
        styles.header,
        {
          height: headerHeight,
          paddingTop: insets.top,
          backgroundColor: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: ['transparent', COLORS.background.secondary],
            extrapolate: "clamp",
          }),
          borderBottomWidth: scrollY.interpolate({
            inputRange: [0, 100],
            outputRange: [0, StyleSheet.hairlineWidth],
            extrapolate: "clamp",
          }),
        },
      ]}
    >
      <View style={styles.headerContent}>
        <Animated.View style={{ opacity: buttonOpacity }}>
          <TouchableOpacity onPress={onBack} style={styles.headerButton}>
            <Ionicons name="arrow-back" size={24} color={COLORS.text.primary} />
          </TouchableOpacity>
        </Animated.View>

        <Animated.Text 
          style={[
            styles.headerTitle, 
            {
              opacity: headerOpacity,
              transform: [{
                translateY: scrollY.interpolate({
                  inputRange: [0, 100],
                  outputRange: [20, 0],
                  extrapolate: "clamp",
                })
              }]
            }
          ]} 
          numberOfLines={1}
        >
          {name}
        </Animated.Text>

        <Animated.View style={{ opacity: buttonOpacity }}>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="ellipsis-vertical" size={20} color={COLORS.text.primary} />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Animated.View>
  );
});

GroupHeader.displayName = 'GroupHeader';

// Banner Component
const GroupBanner = React.memo(({ image, scrollY }: { image: string; scrollY: Animated.Value }) => {
  const bannerHeight = scrollY.interpolate({
    inputRange: [0, CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT],
    outputRange: [CONSTANTS.HEADER_MAX_HEIGHT, CONSTANTS.HEADER_MIN_HEIGHT],
    extrapolate: "clamp",
  });

  const bannerTranslateY = scrollY.interpolate({
    inputRange: [0, CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT],
    outputRange: [0, - (CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT) / 2],
    extrapolate: "clamp",
  });

  const bannerOpacity = scrollY.interpolate({
    inputRange: [0, CONSTANTS.HEADER_MAX_HEIGHT - CONSTANTS.HEADER_MIN_HEIGHT],
    outputRange: [1, 0.8],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        height: bannerHeight,
        transform: [{ translateY: bannerTranslateY }],
        opacity: bannerOpacity,
        overflow: "hidden",
      }}
    >
      <Image source={{ uri: image }} style={styles.banner} resizeMode="cover" />
      <View style={styles.bannerOverlay} />
    </Animated.View>
  );
});

GroupBanner.displayName = 'GroupBanner';

// Tab Navigation Component
const TabNavigation = React.memo(({
  tabs,
  activeTab,
  onTabChange,
  scrollY,
}: {
  tabs: readonly TabKey[];
  activeTab: TabKey;
  onTabChange: (tab: TabKey) => void;
  scrollY: Animated.Value;
}) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleTabPress = useCallback((tab: TabTabKey) => {
    onTabChange(tab);
  }, [onTabChange]);

  const tabOpacity = scrollY.interpolate({
    inputRange: [0, 50, 100],
    outputRange: [0, 0.5, 1],
    extrapolate: "clamp",
  });

  return (
    <Animated.View style={{ opacity: tabOpacity }}>
      <SafeAreaView edges={['right', 'left']} style={styles.tabContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabScrollContent}
          bounces={false}
          scrollEventThrottle={CONSTANTS.ANIMATION_THROTTLE}
          decelerationRate="fast"
        >
          {tabs.map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.activeTab]}
              onPress={() => handleTabPress(tab)}
              accessibilityRole="tab"
              accessibilityState={{ selected: activeTab === tab }}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
              {activeTab === tab && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </SafeAreaView>
    </Animated.View>
  );
});

TabNavigation.displayName = 'TabNavigation';

// Animated Image Component
const AnimatedImage = React.memo(({ 
  source, 
  style, 
  scrollY, 
  accessibilityIgnoresInvertColors 
}: {
  source: { uri: string };
  style: any;
  scrollY: Animated.Value;
  accessibilityIgnoresInvertColors?: boolean;
}) => {
  const imageOpacity = scrollY.interpolate({
    inputRange: [0, CONSTANTS.IMAGE_FADE_THRESHOLD],
    outputRange: [1, 0.3],
    extrapolate: "clamp",
  });

  const imageScale = scrollY.interpolate({
    inputRange: [0, CONSTANTS.IMAGE_FADE_THRESHOLD],
    outputRange: [1, 0.9],
    extrapolate: "clamp",
  });

  return (
    <Animated.View
      style={{
        opacity: imageOpacity,
        transform: [{ scale: imageScale }],
      }}
    >
      <Image
        source={source}
        style={style}
        resizeMode="cover"
        accessibilityIgnoresInvertColors={accessibilityIgnoresInvertColors}
      />
    </Animated.View>
  );
});

AnimatedImage.displayName = 'AnimatedImage';

// Post Card Component
const PostCard = React.memo(({
  post,
  onLike,
  scrollY,
}: {
  post: Post;
  onLike: (id: string) => void;
  scrollY: Animated.Value;
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

// Classroom Card Component
const ClassroomCard = React.memo(({ classroom, scrollY }: { classroom: Classroom; scrollY: Animated.Value }) => (
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

// File Card Component
const FileCard = React.memo(({ file, scrollY }: { file: FileItem; scrollY: Animated.Value }) => {
  const getFileIconAndColor = (type: FileType): { icon: keyof typeof Ionicons.glyphMap; color: string } => {
    const fileTypeMap: Record<FileType, { icon: keyof typeof Ionicons.glyphMap; color: string }> = {
      pdf: { icon: "document-text", color: COLORS.error },
      image: { icon: "image", color: COLORS.secondary },
      pin: { icon: "pin", color: COLORS.accent },
      other: { icon: "document", color: COLORS.text.tertiary },
    };
    return fileTypeMap[type];
  };

  const { icon, color } = getFileIconAndColor(file.type);

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

// Leaderboard Card Component
const LeaderboardCard = React.memo(({ 
  entry, 
  index 
}: {
  entry: LeaderboardEntry;
  index: number;
}) => {
  const isTopThree = index < 3;
  
  return (
    <View 
      style={[styles.leaderboardCard, isTopThree && styles.topLeaderboardCard]}
      accessibilityRole="button"
      accessibilityLabel={`المركز ${entry.rank}: ${entry.name} - ${entry.points} نقطة`}
    >
      <View style={styles.leaderboardRank}>
        <Text style={[styles.rankText, isTopThree && styles.topRankText]}>
          {entry.rank}
        </Text>
      </View>
      <Image 
        source={{ uri: entry.avatar }} 
        style={styles.leaderboardAvatar}
        accessibilityIgnoresInvertColors
      />
      <View style={styles.leaderboardInfo}>
        <Text style={styles.leaderboardName}>{entry.name}</Text>
        <Text style={styles.leaderboardPoints}>{entry.points} نقطة</Text>
      </View>
      <View style={[
        styles.progressBadge, 
        entry.progress > 0 ? styles.positiveProgress : styles.negativeProgress
      ]}>
        <Ionicons
          name={entry.progress > 0 ? "trending-up" : "trending-down"}
          size={12}
          color="#FFFFFF"
        />
        <Text style={styles.progressBadgeText}>
          {Math.abs(entry.progress)}%
        </Text>
      </View>
    </View>
  );
});

LeaderboardCard.displayName = 'LeaderboardCard';

// Info Section Component
const InfoSection = React.memo(({ group }: { group: Group }) => (
  <View style={styles.card}>
    <Text style={styles.sectionTitle}>حول</Text>
    <Text style={styles.description}>{group.description}</Text>

    <View style={styles.statsContainer}>
      <View style={styles.stat}>
        <Ionicons name="people" size={20} color={COLORS.primary} />
        <Text style={styles.statValue}>{group.members.toLocaleString()}</Text>
        <Text style={styles.statLabel}>عضو</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons name="wifi" size={20} color={COLORS.secondary} />
        <Text style={styles.statValue}>24</Text>
        <Text style={styles.statLabel}>متصل الآن</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons name="school" size={20} color={COLORS.accent} />
        <Text style={styles.statValue}>15</Text>
        <Text style={styles.statLabel}>فصل دراسي</Text>
      </View>
    </View>
  </View>
));

InfoSection.displayName = 'InfoSection';

// File Filter Component
const FileFilter = React.memo(({
  activeFilter,
  onFilterChange,
}: {
  activeFilter: FileFilter;
  onFilterChange: (filter: FileFilter) => void;
}) => {
  const filters: readonly FileFilter[] = ["الكل", "PDF", "صورة", "مثبت"] as const;

  const handleFilterPress = useCallback((filter: FileFilter) => {
    onFilterChange(filter);
  }, [onFilterChange]);

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
      bounces={false}
      decelerationRate="fast"
    >
      {filters.map((filter) => (
        <TouchableOpacity
          key={filter}
          style={[styles.filterPill, activeFilter === filter && styles.activeFilterPill]}
          onPress={() => handleFilterPress(filter)}
          accessibilityRole="button"
          accessibilityState={{ selected: activeFilter === filter }}
        >
          <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
});

FileFilter.displayName = 'FileFilter';

// Empty State Component
const EmptyState = React.memo(({ tab }: { tab: string }) => (
  <View style={styles.emptyState}>
    <Ionicons name="document-text-outline" size={48} color={COLORS.text.tertiary} />
    <Text style={styles.emptyStateText}>لا يوجد {tab} حتى الآن</Text>
  </View>
));

EmptyState.displayName = 'EmptyState';

// Scroll to Top Button Component
const ScrollToTopButton = React.memo(({
  isVisible,
  onPress,
}: {
  isVisible: boolean;
  onPress: () => void;
}) => {
  const insets = useSafeAreaInsets();
  
  if (!isVisible) return null;
  
  return (
    <TouchableOpacity
      style={[styles.scrollToTopButton, { bottom: 90 + insets.bottom }]}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel="الانتقال إلى الأعلى"
      activeOpacity={0.8}
    >
      <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
});

ScrollToTopButton.displayName = 'ScrollToTopButton';

// Main Component
const GroupScreen: React.FC = () => {
  const params = useLocalSearchParams<{ id: string }>();
  const groupId = params.id!;
  const insets = useSafeAreaInsets();

  // State
  const [activeTab, setActiveTab] = useState<TabKey>("المشاركات");
  const [fileFilter, setFileFilter] = useState<FileFilter>("الكل");
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  
  // Refs
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);

  // Constants
  const tabs = useMemo<readonly TabKey[]>(() => 
    ["المشاركات", "الفصول", "الملفات", "المتصدرين", "معلومات"] as const, []
  );

  // Mock Data
  const group = useMemo<Group>(() => ({
    id: groupId,
    name: "مطورو React Native",
    members: 128,
    description: "مجتمع لمطوري React Native لمشاركة المعرفة والتعاون في المشاريع. نستضيف ورش عمل منتظمة ومراجعات للكود وفعاليات شبكة لمساعدة المطورين على تنمية مهاراتهم وحياتهم المهنية.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    isPrivate: false,
    bannerImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
  }), [groupId]);

  const [posts, setPosts] = useState<readonly Post[]>([
    {
      id: "1",
      userName: "أليكس جونسون",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      content: "نشرت للتو برنامجًا تعليميًا جديدًا حول animations في React Native. يغطي كل شيء من التحويلات الأساسية إلى الرسوم المتحركة المعقدة القائمة على الإيماءات.",
      time: "منذ ساعتين",
      likes: 12,
      comments: 3,
      isLiked: false,
    },
    {
      id: "2",
      userName: "سارة ميلر",
      userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      content: "هل لدى أي شخص خبرة مع React Native Web؟ أبحث عن أفضل الممارسات حول مشاركة المكونات بين منصات الجوال والويب.",
      time: "منذ 5 ساعات",
      likes: 8,
      comments: 5,
      isLiked: true,
    }, 
    {
      id: "3",
      userName: "محمد أحمد",
      userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      content: "أبحث عن مساعدة في مشروعي الحالي باستخدام React Native و Firebase.",
      time: "منذ 6 ساعات",
      likes: 5,
      comments: 2,
      isLiked: false,
    },
    {
      id: "4",
      userName: "فاطمة علي",
      userAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      content: "شاركت للتو مشروعي الجديد على GitHub. يرجى إبداء الملاحظات!",
      time: "منذ 7 ساعات",
      likes: 15,
      comments: 7,
      isLiked: true,
    },
    {
      id: "5",
      userName: "خالد حسن",
      userAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",     
      content: "ما هي أفضل الممارسات لتحسين أداء تطبيقات React Native?",
      time: "منذ 8 ساعات",
      likes: 10,
      comments: 4,
      isLiked: false,
    },
  ]);

  const classrooms = useMemo<readonly Classroom[]>(() => [
    {
      id: "1",
      title: "أساسيات React Native",
      progress: 75,
      instructor: "مايكل تشن",
      completed: false,
      students: 42,
      assignments: 5,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
      shortDescription: "تعلم المفاهيم الأساسية لتطوير React Native بما في ذلك المكونات والحالة والخصائص.",
    },
    {
      id: "2",
      title: "التصميم المتجاوب في React Native",
      progress: 30,
      instructor: "سارة أحمد",
      completed: false,
      students: 35,
      assignments: 3,
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&auto{format&fit=crop&w=200&q=80",
      shortDescription: "تعلم كيفية إنشاء تطبيقات تتكيف مع مختلف أحجام الشاشات.",
    },
  ], []);

  const files = useMemo<readonly FileItem[]>(() => [
    {
      id: "1",
      name: "React_Native_Cheat_Sheet.pdf",
      type: "pdf",
      url: "#",
      uploadDate: "قبل يومين",
      size: "2.4 ميجابايت",
    },
    {
      id: "2",
      name: "Design_Patterns.png",
      type: "image",
      url: "#",
      uploadDate: "قبل 3 أيام",
      size: "1.8 ميجابايت",
      thumbnail: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80",
    },
    {
      id: "3",
      name: "Important_Links.pin",
      type: "pin",
      url: "#",
      uploadDate: "قبل أسبوع",
      size: "0.2 ميجابايت",
    },
  ], []);

  const leaderboard = useMemo<readonly LeaderboardEntry[]>(() => [
    {
      id: "1",
      rank: 1,
      name: "أليكس جونسون",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      points: 1245,
      progress: 12,
    },
    {
      id: "2",
      rank: 2,
      name: "سارة ميلر",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w{100&q=80",
      points: 1120,
      progress: 8,
    },
    {
      id: "3",
      rank: 3,
      name: "محمد أحمد",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80",
      points: 980,
      progress: -5,
    },
  ], []);

  // Handlers
  const handleLike = useCallback((postId: string) => {
    setPosts(prevPosts => prevPosts.map(post =>
      post.id === postId
        ? {
            ...post,
            isLiked: !post.isLiked,
            likes: post.isLiked ? Math.max(0, post.likes - 1) : post.likes + 1,
          }
        : post
    ));
  }, []);

  const handleTabChange = useCallback((tab: TabKey) => {
    setActiveTab(tab);
  }, []);

  const handleFilterChange = useCallback((filter: FileFilter) => {
    setFileFilter(filter);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await new Promise(resolve => setTimeout(resolve, CONSTANTS.REFRESH_TIMEOUT));
    } finally {
      setRefreshing(false);
    }
  }, []);

  const scrollToTop = useCallback(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, []);

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
    setShowScrollToTop(offsetY > CONSTANTS.SCROLL_THRESHOLD);
  }, [scrollY]);

  const handleBack = useCallback(() => {
    router.back();
  }, []);

  // Computed values
  const filteredFiles = useMemo(() => {
    if (fileFilter === "الكل") return files;
    const filterMap: Record<Exclude<FileFilter, "الكل">, FileType> = {
      PDF: "pdf",
      صورة: "image",
      مثبت: "pin",
    };
    const targetType = filterMap[fileFilter as Exclude<FileFilter, "الكل">];
    return targetType ? files.filter(file => file.type === targetType) : files;
  }, [fileFilter, files]);

  // Render functions
  const keyExtractor = useCallback((item: BaseEntity) => item.id, []);

  const renderPost: ListRenderItem<Post> = useCallback(({ item }) => (
    <PostCard post={item} onLike={handleLike} scrollY={scrollY} />
  ), [handleLike, scrollY]);

  const renderClassroom: ListRenderItem<Classroom> = useCallback(({ item }) => (
    <ClassroomCard classroom={item} scrollY={scrollY} />
  ), [scrollY]);

  const renderFile: ListRenderItem<FileItem> = useCallback(({ item }) => (
    <FileCard file={item} scrollY={scrollY} />
  ), [scrollY]);

  const renderLeaderboard: ListRenderItem<LeaderboardEntry> = useCallback(({ item, index }) => (
    <LeaderboardCard entry={item} index={index} />
  ), []);

  // Memoized components
  const refreshControl = useMemo(() => (
    <RefreshControl
      refreshing={refreshing}
      onRefresh={handleRefresh}
      colors={[COLORS.primary]}
      tintColor={COLORS.primary}
      progressBackgroundColor={COLORS.background.secondary}
    />
  ), [refreshing, handleRefresh]);

  // Modify the content container style
  const contentContainerStyle = useMemo(() => ({
    paddingBottom: insets.bottom + 80,
  }), [insets.bottom]);

  // Update the commonFlatListProps
  const commonFlatListProps = useMemo(() => ({
    ref: flatListRef,
    showsVerticalScrollIndicator: false,
    onScroll: handleScroll,
    scrollEventThrottle: CONSTANTS.ANIMATION_THROTTLE,
    refreshControl,
    contentContainerStyle,
    removeClippedSubviews: true,
    maxToRenderPerBatch: CONSTANTS.MAX_RENDER_BATCH,
    windowSize: CONSTANTS.WINDOW_SIZE,
    keyExtractor,
    initialNumToRender: 10,
    maintainVisibleContentPosition: { minIndexForVisible: 0 },
  }), [handleScroll, refreshControl, contentContainerStyle, keyExtractor]);

  const renderContent = useCallback(() => {
    switch (activeTab) {
      case "المشاركات":
        return (
          <FlatList
            {...commonFlatListProps}
            data={posts}
            renderItem={renderPost}
            ListEmptyComponent={<EmptyState tab="منشورات" />}
          />
        );
      case "الفصول":
        return (
          <FlatList
            {...commonFlatListProps}
            data={classrooms}
            renderItem={renderClassroom}
            ListEmptyComponent={<EmptyState tab="فصول" />}
          />
        );
      case "الملفات":
        return (
          <View style={styles.flex}>
            <FileFilter activeFilter={fileFilter} onFilterChange={handleFilterChange} />
            <FlatList
              {...commonFlatListProps}
              data={filteredFiles}
              renderItem={renderFile}
              ListEmptyComponent={<EmptyState tab="ملفات" />}
            />
          </View>
        );
      case "المتصدرين":
        return (
          <FlatList
            {...commonFlatListProps}
            data={leaderboard}
            renderItem={renderLeaderboard}
            ListEmptyComponent={<EmptyState tab="متصدرين" />}
          />
        );
      case "معلومات":
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={CONSTANTS.ANIMATION_THROTTLE}
            refreshControl={refreshControl}
            contentContainerStyle={{ paddingBottom: insets.bottom + 80 }}
          >
            <InfoSection group={group} />
          </ScrollView>
        );
      default:
        return null;
    }
  }, [activeTab, commonFlatListProps, posts, classrooms, filteredFiles, leaderboard, group, renderPost, renderClassroom, renderFile, renderLeaderboard, fileFilter, handleFilterChange, handleScroll, refreshControl, insets.bottom]);

  return (
    <SafeAreaView style={styles.container} edges={['right', 'left', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />

      <View style={styles.content}>
        <GroupBanner image={group.bannerImage ?? group.image} scrollY={scrollY} />
        <GroupHeader name={group.name} onBack={handleBack} scrollY={scrollY} />
        <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={handleTabChange} scrollY={scrollY} />
        <View style={styles.tabContentContainer}>
          {renderContent()}
        </View>
      </View>

      {activeTab === "المشاركات" && (
        <TouchableOpacity
          style={[styles.createButton, { bottom: 24 + insets.bottom }]}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="إنشاء منشور جديد"
        >
          <Ionicons name="create" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <ScrollToTopButton isVisible={showScrollToTop} onPress={scrollToTop} />
    </SafeAreaView>
  );
};

// Update the styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background.primary,
  },
  content: {
    flex: 1,
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    overflow: "hidden",
    borderBottomColor: COLORS.border,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    flex: 1,
  },
  headerButton: {
    padding: 8,
    borderRadius: 8,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: COLORS.text.primary,
    textAlign: "center",
    marginHorizontal: 16,
  },
  banner: {
    flex: 1,
    width: "100%",
  },
  bannerOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay,
  },
  tabContainer: {
    backgroundColor: COLORS.background.secondary,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  tabScrollContent: {
    paddingHorizontal: 16,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginRight: 8,
    position: "relative",
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: `${COLORS.primary}08`,
  },
  tabText: {
    fontSize: 15,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
  activeTabText: {
    color: COLORS.primary,
    fontWeight: "600",
  },
  tabIndicator: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: COLORS.primary,
    borderRadius: 1,
  },
  tabContentContainer: {
    flex: 1,
  },
  flex: {
    flex: 1,
  },
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
  filterContainer: {
    maxHeight: 50,
    marginBottom: 8,
  },
  filterContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: COLORS.background.tertiary,
    marginRight: 8,
  },
  activeFilterPill: {
    backgroundColor: COLORS.primary,
  },
  filterText: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  leaderboardCard: {
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    alignItems: "center",
    backgroundColor: COLORS.background.secondary,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 8,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: COLORS.border,
  },
  topLeaderboardCard: {
    backgroundColor: "#FFF9E6",
    borderColor: "#FFD60A",
  },
  leaderboardRank: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.background.tertiary,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "600",
    color: COLORS.text.tertiary,
  },
  topRankText: {
    color: COLORS.accent,
  },
  leaderboardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginHorizontal: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text.primary,
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  leaderboardPoints: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  progressBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  positiveProgress: {
    backgroundColor: COLORS.secondary,
  },
  negativeProgress: {
    backgroundColor: COLORS.error,
  },
  progressBadgeText: {
    fontSize: 10,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 2,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text.primary,
    marginBottom: 12,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  description: {
    fontSize: 16,
    color: COLORS.text.secondary,
    lineHeight: 24,
    marginBottom: 24,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.primary,
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 14,
    color: COLORS.text.tertiary,
    fontWeight: "500",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: COLORS.text.tertiary,
    marginTop: 16,
    textAlign: "center",
  },
  createButton: {
    position: "absolute",
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollToTopButton: {
    position: "absolute",
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default GroupScreen;