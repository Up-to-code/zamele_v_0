import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  StatusBar,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
  I18nManager,
  Platform,
  Animated,
  LayoutAnimation,
  UIManager,
  Pressable,
  RefreshControl
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, router } from "expo-router";

// Enable RTL for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

// Enable LayoutAnimation for Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// TypeScript interfaces
interface Group {
  id: string;
  name: string;
  members: number;
  description: string;
  image: string;
  isPrivate: boolean;
  bannerImage?: string;
}

interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  time: string;
  likes: number;
  comments: number;
  isLiked?: boolean;
}

interface Classroom {
  id: string;
  title: string;
  progress: number;
  instructor: string;
  completed: boolean;
  students: number;
  assignments: number;
  thumbnail: string;
  shortDescription: string;
}

interface FileItem {
  id: string;
  name: string;
  type: 'pdf' | 'image' | 'pin' | 'other';
  url: string;
  uploadDate: string;
  size: string;
  thumbnail?: string;
}

interface LeaderboardEntry {
  id: string;
  rank: number;
  name: string;
  avatar: string;
  points: number;
  progress: number;
}

// Header Component
const GroupHeader = ({ name, onBack, scrollY }: { 
  name: string; 
  onBack: () => void;
  scrollY: Animated.Value;
}) => {
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const headerTranslateY = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [20, 0],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View style={[styles.header, { 
      opacity: headerOpacity, 
      transform: [{ translateY: headerTranslateY }] 
    }]}>
      <TouchableOpacity onPress={onBack} style={styles.backButton} accessibilityLabel="رجوع">
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">{name}</Text>
      <TouchableOpacity style={styles.menuButton} accessibilityLabel="المزيد من الخيارات">
        <Ionicons name="ellipsis-vertical" size={20} color="#000" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// Banner Component
const GroupBanner = ({ image, scrollY }: { image: string; scrollY: Animated.Value }) => {
  const bannerHeight = scrollY.interpolate({
    inputRange: [-300, 0, 300],
    outputRange: [300, 200, 100],
    extrapolate: 'clamp'
  });

  return (
    <Animated.View style={{ height: bannerHeight, overflow: 'hidden' }}>
      <Image 
        source={{ uri: image }} 
        style={styles.banner} 
        resizeMode="cover" 
        accessibilityLabel="صورة بانر المجموعة"
      />
    </Animated.View>
  );
};

// Tab Navigation Component
const TabNavigation = ({ tabs, activeTab, onTabChange }: { 
  tabs: string[]; 
  activeTab: string; 
  onTabChange: (tab: string) => void 
}) => {
  return (
    <View style={styles.tabContainer}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabScrollContent}
      >
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
              onTabChange(tab);
            }}
            accessibilityLabel={`تبويب ${tab}`}
            accessibilityRole="tab"
          >
            <Text 
              style={[styles.tabText, activeTab === tab && styles.activeTabText]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {tab}
            </Text>
            {activeTab === tab && <View style={styles.tabIndicator} />}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

// Post Card Component
const PostCard = ({ post, onLike }: { post: Post; onLike: (id: string) => void }) => {
  const handleLike = useCallback(() => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onLike(post.id);
  }, [post.id, onLike]);

  return (
    <View style={styles.card}>
      <View style={[styles.postHeader, I18nManager.isRTL && styles.rtlPostHeader]}>
        <Image source={{ uri: post.userAvatar }} style={styles.avatar} />
        <View style={[styles.postInfo, I18nManager.isRTL && styles.rtlPostInfo]}>
          <Text style={styles.userName}>{post.userName}</Text>
          <Text style={styles.postTime}>{post.time}</Text>
        </View>
      </View>
      <Text style={styles.postContent}>{post.content}</Text>
      <View style={[styles.postActions, I18nManager.isRTL && styles.rtlPostActions]}>
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleLike}
          accessibilityLabel="إعجاب بالمنشور"
        >
          <Ionicons 
            name={post.isLiked ? "heart" : "heart-outline"} 
            size={18} 
            color={post.isLiked ? "#FF3B30" : "#8E8E93"} 
          />
          <Text style={[styles.actionText, post.isLiked && styles.likedActionText]}>
            {post.likes}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} accessibilityLabel="التعليق على المنشور">
          <Ionicons name="chatbubble-outline" size={18} color="#8E8E93" />
          <Text style={styles.actionText}>{post.comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton} accessibilityLabel="مشاركة المنشور">
          <Ionicons name="share-social-outline" size={18} color="#8E8E93" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Classroom Card Component
const ClassroomCard = ({ classroom }: { classroom: Classroom }) => (
  <Pressable 
    style={({ pressed }) => [styles.card, pressed && styles.pressedCard]} 
    accessibilityLabel={`فصل دراسي: ${classroom.title}`}
  >
    <View style={[styles.classroomHeader, I18nManager.isRTL && styles.rtlClassroomHeader]}>
      <Image source={{ uri: classroom.thumbnail }} style={styles.classroomThumbnail} />
      <View style={styles.classroomInfo}>
        <Text style={styles.classroomTitle}>{classroom.title}</Text>
        <Text style={styles.classroomInstructor}>{classroom.instructor}</Text>
        <Text style={styles.classroomDescription} numberOfLines={2}>
          {classroom.shortDescription}
        </Text>
        <View style={[styles.classroomStats, I18nManager.isRTL && styles.rtlClassroomStats]}>
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
            { width: `${classroom.progress}%` },
            classroom.completed && styles.completedProgress
          ]} 
        />
      </View>
      <Text style={styles.progressText}>{classroom.progress}% مكتمل</Text>
    </View>
  </Pressable>
);

// File Card Component
const FileCard = ({ file }: { file: FileItem }) => {
  const getFileIcon = () => {
    switch(file.type) {
      case 'pdf': return 'document-text';
      case 'image': return 'image';
      case 'pin': return 'pin';
      default: return 'document';
    }
  };

  const getFileColor = () => {
    switch(file.type) {
      case 'pdf': return '#FF2D55';
      case 'image': return '#34C759';
      case 'pin': return '#FF9500';
      default: return '#8E8E93';
    }
  };

  return (
    <Pressable 
      style={({ pressed }) => [styles.card, styles.fileCard, pressed && styles.pressedCard]} 
      accessibilityLabel={`ملف: ${file.name}`}
    >
      <View style={[styles.fileHeader, I18nManager.isRTL && styles.rtlFileHeader]}>
        {file.thumbnail ? (
          <Image source={{ uri: file.thumbnail }} style={styles.fileThumbnail} />
        ) : (
          <View style={[styles.fileIcon, { backgroundColor: `${getFileColor()}15` }]}>
            <Ionicons name={getFileIcon()} size={20} color={getFileColor()} />
          </View>
        )}
        <View style={styles.fileInfo}>
          <Text style={styles.fileName} numberOfLines={1} ellipsizeMode="middle">{file.name}</Text>
          <Text style={styles.fileMeta}>{file.size} • {file.uploadDate}</Text>
        </View>
      </View>
      <TouchableOpacity accessibilityLabel="تحميل الملف">
        <Ionicons name="download-outline" size={20} color="#007AFF" />
      </TouchableOpacity>
    </Pressable>
  );
};

// Leaderboard Card Component
const LeaderboardCard = ({ entry, index }: { entry: LeaderboardEntry; index: number }) => (
  <View 
    style={[styles.leaderboardCard, index < 3 && styles.topLeaderboardCard]} 
    accessibilityLabel={`المركز ${entry.rank} في لوحة المتصدرين: ${entry.name}`}
  >
    <View style={[styles.leaderboardRank, I18nManager.isRTL && styles.rtlLeaderboardRank]}>
      <Text style={[styles.rankText, index < 3 && styles.topRankText]}>{entry.rank}</Text>
    </View>
    <Image source={{ uri: entry.avatar }} style={styles.leaderboardAvatar} />
    <View style={styles.leaderboardInfo}>
      <Text style={styles.leaderboardName}>{entry.name}</Text>
      <Text style={styles.leaderboardPoints}>{entry.points} نقطة</Text>
    </View>
    <View style={[styles.leaderboardProgress, entry.progress > 0 ? styles.positiveProgress : styles.negativeProgress]}>
      <Ionicons 
        name={entry.progress > 0 ? "trending-up" : "trending-down"} 
        size={14} 
        color="#FFFFFF" 
      />
      <Text style={styles.leaderboardProgressText}>{Math.abs(entry.progress)}%</Text>
    </View>
  </View>
);

// Info Section Component
const InfoSection = ({ group }: { group: Group }) => (
  <View style={styles.card} accessibilityLabel="معلومات المجموعة">
    <Text style={styles.sectionTitle}>حول</Text>
    <Text style={styles.description}>{group.description}</Text>
    
    <View style={[styles.statsContainer, I18nManager.isRTL && styles.rtlStatsContainer]}>
      <View style={styles.stat}>
        <Ionicons name="people" size={20} color="#007AFF" />
        <Text style={styles.statValue}>{group.members}</Text>
        <Text style={styles.statLabel}>عضو</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons name="wifi" size={20} color="#34C759" />
        <Text style={styles.statValue}>24</Text>
        <Text style={styles.statLabel}>متصل الآن</Text>
      </View>
      <View style={styles.stat}>
        <Ionicons name="school" size={20} color="#FF9500" />
        <Text style={styles.statValue}>15</Text>
        <Text style={styles.statLabel}>فصل دراسي</Text>
      </View>
    </View>
  </View>
);

// File Filter Component
const FileFilter = ({ activeFilter, onFilterChange }: { 
  activeFilter: string; 
  onFilterChange: (filter: string) => void 
}) => {
  const filters = ['الكل', 'PDF', 'صورة', 'مثبت'];
  
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.filterContainer}
      contentContainerStyle={styles.filterContent}
      directionalLockEnabled={true}
      alwaysBounceHorizontal={false}
    >
      {filters.map((item) => (
        <TouchableOpacity
          key={item}
          style={[styles.filterPill, activeFilter === item && styles.activeFilterPill]}
          onPress={() => {
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            onFilterChange(item);
          }}
          accessibilityLabel={`تصفية حسب ${item}`}
        >
          <Text style={[styles.filterText, activeFilter === item && styles.activeFilterText]}>
            {item}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

// Empty State Component
const EmptyState = ({ tab }: { tab: string }) => (
  <View style={styles.emptyState}>
    <Ionicons name="document-text-outline" size={48} color="#C7C7CC" />
    <Text style={styles.emptyStateText}>لا يوجد {tab} حتى الآن</Text>
  </View>
);

// Loading Skeleton Component
const SkeletonLoader = () => (
  <View style={styles.card}>
    <View style={[styles.postHeader, I18nManager.isRTL && styles.rtlPostHeader]}>
      <View style={[styles.avatar, styles.skeleton]} />
      <View style={styles.postInfo}>
        <View style={[styles.skeleton, styles.skeletonText, { width: 120, height: 16 }]} />
        <View style={[styles.skeleton, styles.skeletonText, { width: 80, height: 14, marginTop: 4 }]} />
      </View>
    </View>
    <View style={[styles.skeleton, styles.skeletonText, { width: '100%', height: 16, marginTop: 12 }]} />
    <View style={[styles.skeleton, styles.skeletonText, { width: '80%', height: 16, marginTop: 8 }]} />
  </View>
);

// Scroll to Top Button Component
const ScrollToTopButton = ({ isVisible, onPress }: { isVisible: boolean; onPress: () => void }) => {
  return (
    <TouchableOpacity
      style={[styles.scrollToTopButton, { opacity: isVisible ? 1 : 0 }]}
      onPress={onPress}
      accessibilityLabel="الانتقال إلى الأعلى"
    >
      <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
    </TouchableOpacity>
  );
};

// Main Group Screen Component
const GroupScreen: React.FC = () => {
  const params = useLocalSearchParams();
  const groupId = params.id as string;
  const { width, height } = useWindowDimensions();
  
  const [activeTab, setActiveTab] = useState("المشاركات");
  const [fileFilter, setFileFilter] = useState("الكل");
  const [refreshing, setRefreshing] = useState(false);
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const scrollY = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList>(null);
  
  const tabs = ["المشاركات", "الفصول", "الملفات", "المتصدرين", "معلومات"];
  
  // Mock data
  const group: Group = {
    id: groupId,
    name: "مطورو React Native",
    members: 128,
    description: "مجتمع لمطوري React Native لمشاركة المعرفة والتعاون في المشاريع. نستضيف ورش عمل منتظمة ومراجعات للكود وفعاليات شبكة لمساعدة المطورين على تنمية مهاراتهم وحياتهم المهنية.",
    image: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
    isPrivate: false,
    bannerImage: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1000&q=80"
  };

  const [posts, setPosts] = useState<Post[]>([
    {
      id: "1",
      userName: "أليكس جونسون",
      userAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      content: "نشرت للتو برنامجًا تعليميًا جديدًا حول animotions في React Native. تحقق من ذلك! يغطي هذا كل شيء من التحويلات الأساسية إلى الرسوم المتحركة المعقدة القائمة على الإيماءات.",
      time: "منذ ساعتين",
      likes: 12,
      comments: 3,
      isLiked: false
    },
    {
      id: "2",
      userName: "سارة ميلر",
      userAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      content: "هل لدى أي شخص خبرة مع React Native Web؟ أبحث عن أفضل الممارسات حول مشاركة المكونات بين منصات الجوال والويب.",
      time: "منذ 5 ساعات",
      likes: 8,
      comments: 5,
      isLiked: true
    }
  ]);

  const classrooms: Classroom[] = [
    {
      id: "1",
      title: "أساسيات React Native",
      progress: 75,
      instructor: "مايكل تشن",
      completed: false,
      students: 42,
      assignments: 5,
      thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      shortDescription: "تعلم المفاهيم الأساسية لتطوير React Native بما في ذلك المكونات والحالة والخصائص."
    },
    {
      id: "2",
      title: "إدارة الحالة مع Redux",
      progress: 100,
      instructor: "إيميلي رودريغيز",
      completed: true,
      students: 38,
      assignments: 7,
      thumbnail: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=200&q=80",
      shortDescription: "إتقان إدارة الحالة في تطبيقات React Native المعقدة باستخدام Redux والبرمجيات الوسيطة."
    }
  ]

  const files: FileItem[] = [
    {
      id: "1",
      name: "React_Native_Cheat_Sheet.pdf",
      type: "pdf",
      url: "#",
      uploadDate: "قبل يومين",
      size: "2.4 ميجابايت",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    },
    {
      id: "2",
      name: "App_Design_Mockup.png",
      type: "image",
      url: "#",
      uploadDate: "قبل أسبوع",
      size: "1.2 ميجابايت",
      thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80"
    }
  ]

  const leaderboard: LeaderboardEntry[] = [
    {
      id: "1",
      rank: 1,
      name: "أليكس جونسون",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      points: 1245,
      progress: 12
    },
    {
      id: "2",
      rank: 2,
      name: "سارة ميلر",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=100&q=80",
      points: 1120,
      progress: 8
    }
  ]

  // Handle like action
  const handleLike = useCallback((postId: string) => {
    setPosts(prevPosts => 
      prevPosts.map(post => 
        post.id === postId 
          ? { 
              ...post, 
              isLiked: !post.isLiked, 
              likes: post.isLiked ? post.likes - 1 : post.likes + 1 
            } 
          : post
      )
    );
  }, []);

  // Filter files based on selected filter
  const filteredFiles = useMemo(() => {
    if (fileFilter === 'الكل') return files;
    const filterMap: Record<string, string> = {
      'PDF': 'pdf',
      'صورة': 'image',
      'مثبت': 'pin'
    };
    return files.filter(file => file.type === filterMap[fileFilter]);
  }, [fileFilter, files]);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ offset: 0, animated: true });
    }
  }, []);

  // Handle scroll to show/hide scroll to top button
  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    scrollY.setValue(offsetY);
    setShowScrollToTop(offsetY > 300);
  }, [scrollY]);

  // Render content based on active tab
  const renderContent = () => {
    const commonProps = {
      ref: flatListRef,
      showsVerticalScrollIndicator: false,
      onScroll: handleScroll,
      scrollEventThrottle: 16,
      refreshing: refreshing,
      onRefresh: handleRefresh,
      refreshControl: (
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          colors={['#007AFF']}
          tintColor="#007AFF"
          title="جاري التحديث..."
          titleColor="#8E8E93"
        />
      )
    };

    switch(activeTab) {
      case "المشاركات":
        return (
          <FlatList
            {...commonProps}
            data={posts}
            renderItem={({ item }) => <PostCard post={item} onLike={handleLike} />}
            keyExtractor={item => item.id}
            style={styles.tabContent}
            ListEmptyComponent={<EmptyState tab="منشورات" />}
          />
        );
      case "الفصول":
        return (
          <FlatList
            {...commonProps}
            data={classrooms}
            renderItem={({ item }) => <ClassroomCard classroom={item} />}
            keyExtractor={item => item.id}
            style={styles.tabContent}
            ListEmptyComponent={<EmptyState tab="فصول" />}
          />
        );
      case "الملفات":
        return (
          <View style={styles.tabContent}>
            <FileFilter activeFilter={fileFilter} onFilterChange={setFileFilter} />
            <FlatList
              {...commonProps}
              data={filteredFiles}
              renderItem={({ item }) => <FileCard file={item} />}
              keyExtractor={item => item.id}
              style={styles.filesList}
              ListEmptyComponent={<EmptyState tab="ملفات" />}
            />
          </View>
        );
      case "المتصدرين":
        return (
          <FlatList
            {...commonProps}
            data={leaderboard}
            renderItem={({ item, index }) => <LeaderboardCard entry={item} index={index} />}
            keyExtractor={item => item.id}
            style={styles.tabContent}
            ListEmptyComponent={<EmptyState tab="متصدرين" />}
          />
        );
      case "معلومات":
        return (
          <FlatList
            {...commonProps}
            data={[1]} // Single item to render the InfoSection
            renderItem={() => <InfoSection group={group} />}
            keyExtractor={() => "info"}
            style={styles.tabContent}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <GroupHeader name={group.name} onBack={() => router.back()} scrollY={scrollY} />
      
      <View style={styles.content}>
        <GroupBanner image={group.bannerImage || group.image} scrollY={scrollY} />
        
        <TabNavigation 
          tabs={tabs} 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
        />
        
        <View style={styles.tabContentContainer}>
          {renderContent()}
        </View>
      </View>

      {activeTab === "المشاركات" && (
        <TouchableOpacity 
          style={[styles.createButton, I18nManager.isRTL && styles.rtlCreateButton]}
          accessibilityLabel="إنشاء منشور جديد"
          activeOpacity={0.7}
        >
          <Ionicons name="create" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      <ScrollToTopButton isVisible={showScrollToTop} onPress={scrollToTop} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F7",
  },
  content: {
    flex: 1,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 16 : StatusBar.currentHeight,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  backButton: {
    padding: 4,
    marginRight: 16,
  },
  headerTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    textAlign: "center",
  },
  menuButton: {
    padding: 4,
  },
  banner: {
    height: '100%',
    width: "100%",
  },
  tabContainer: {
    backgroundColor: "#FFFFFF",
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E5E5EA",
  },
  tabScrollContent: {
    flexGrow: 1,
    justifyContent: 'space-around',
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 80,
  },
  activeTab: {
    position: 'relative',
  },
  tabText: {
    fontSize: 15,
    color: "#8E8E93",
    fontWeight: "500",
  },
  activeTabText: {
    color: "#007AFF",
  },
  tabIndicator: {
    position: 'absolute',
    bottom: 0,
    height: 2,
    width: '50%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  tabContentContainer: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 16,
  },
  filesList: {
    marginTop: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  pressedCard: {
    opacity: 0.7,
    transform: [{ scale: 0.99 }],
  },
  fileCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  rtlPostHeader: {
    flexDirection: "row-reverse",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  postInfo: {
    flex: 1,
  },
  rtlPostInfo: {
    alignItems: "flex-end",
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  postTime: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  postContent: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 22,
    marginBottom: 12,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  postActions: {
    flexDirection: "row",
  },
  rtlPostActions: {
    flexDirection: "row-reverse",
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
    padding: 4,
  },
  actionText: {
    fontSize: 14,
    color: "#8E8E93",
    marginLeft: 4,
  },
  likedActionText: {
    color: "#FF3B30",
  },
  classroomHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 12,
  },
  rtlClassroomHeader: {
    flexDirection: "row-reverse",
  },
  classroomThumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  classroomInfo: {
    flex: 1,
  },
  classroomTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  classroomInstructor: {
    fontSize: 14,
    color: "#8E8E93",
    marginBottom: 4,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  classroomDescription: {
    fontSize: 14,
    color: "#000000",
    marginBottom: 8,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  classroomStats: {
    flexDirection: "row",
  },
  rtlClassroomStats: {
    flexDirection: "row-reverse",
  },
  classroomStat: {
    fontSize: 12,
    color: "#8E8E93",
    marginRight: 12,
  },
  progressContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E5EA",
    borderRadius: 3,
    marginRight: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 3,
  },
  completedProgress: {
    backgroundColor: "#34C759",
  },
  progressText: {
    fontSize: 14,
    color: "#8E8E93",
    minWidth: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 12,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  description: {
    fontSize: 16,
    color: "#000000",
    lineHeight: 22,
    marginBottom: 16,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  rtlStatsContainer: {
    flexDirection: "row-reverse",
  },
  stat: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#007AFF",
    marginBottom: 4,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#8E8E93",
  },
  createButton: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  rtlCreateButton: {
    right: undefined,
    left: 24,
  },
  fileHeader: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },
  rtlFileHeader: {
    flexDirection: "row-reverse",
  },
  fileThumbnail: {
    width: 40,
    height: 40,
    borderRadius: 8,
    marginRight: 12,
  },
  fileIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#000000",
    marginBottom: 4,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  fileMeta: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  filterContainer: {
    marginBottom: 16,
    maxHeight: 40,
  },
  filterContent: {
    paddingHorizontal: 4,
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    marginRight: 8,
  },
  activeFilterPill: {
    backgroundColor: "#007AFF",
  },
  filterText: {
    fontSize: 14,
    color: "#8E8E93",
    fontWeight: "500",
  },
  activeFilterText: {
    color: "#FFFFFF",
  },
  leaderboardCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  topLeaderboardCard: {
    backgroundColor: "#FFF9E6",
  },
  leaderboardRank: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F2F2F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  rtlLeaderboardRank: {
    marginRight: 0,
    marginLeft: 12,
  },
  rankText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#8E8E93",
  },
  topRankText: {
    color: "#FF9500",
  },
  leaderboardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  leaderboardInfo: {
    flex: 1,
  },
  leaderboardName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
    marginBottom: 2,
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  leaderboardPoints: {
    fontSize: 14,
    color: "#8E8E93",
    textAlign: I18nManager.isRTL ? "right" : "left",
  },
  leaderboardProgress: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  positiveProgress: {
    backgroundColor: "#34C759",
  },
  negativeProgress: {
    backgroundColor: "#FF3B30",
  },
  leaderboardProgressText: {
    fontSize: 12,
    color: "#FFFFFF",
    fontWeight: "600",
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    textAlign: 'center',
  },
  skeleton: {
    backgroundColor: '#E5E5EA',
    borderRadius: 4,
  },
  skeletonText: {
    height: 14,
    marginBottom: 6,
  },
  scrollToTopButton: {
    position: "absolute",
    bottom: 90,
    right: 24,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default GroupScreen;