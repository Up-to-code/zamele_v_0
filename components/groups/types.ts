import { Animated } from 'react-native';

export interface BaseEntity {
  readonly id: string;
}

export interface Group extends BaseEntity {
  readonly name: string;
  readonly members: number;
  readonly description: string;
  readonly image: string;
  readonly isPrivate: boolean;
  readonly bannerImage?: string;
}

export interface Post extends BaseEntity {
  readonly userName: string;
  readonly userAvatar: string;
  readonly content: string;
  readonly time: string;
  readonly likes: number;
  readonly comments: number;
  readonly isLiked: boolean;
}

export interface Classroom extends BaseEntity {
  readonly title: string;
  readonly progress: number;
  readonly instructor: string;
  readonly completed: boolean;
  readonly students: number;
  readonly assignments: number;
  readonly thumbnail: string;
  readonly shortDescription: string;
}

export type FileType = "pdf" | "image" | "pin" | "other";

export interface FileItem extends BaseEntity {
  readonly name: string;
  readonly type: FileType;
  readonly url: string;
  readonly uploadDate: string;
  readonly size: string;
  readonly thumbnail?: string;
}

export interface LeaderboardEntry extends BaseEntity {
  readonly rank: number;
  readonly name: string;
  readonly avatar: string;
  readonly points: number;
  readonly progress: number;
}

export type TabKey = "المشاركات" | "الفصول" | "الملفات" | "المتصدرين" | "معلومات";
export type FileFilter = "الكل" | "PDF" | "صورة" | "مثبت";

export interface HeaderProps {
  readonly name: string;
  readonly onBack: () => void;
  readonly scrollY: Animated.Value;
}

export interface BannerProps {
  readonly image: string;
  readonly scrollY: Animated.Value;
}

export interface TabNavigationProps {
  readonly tabs: readonly TabKey[];
  readonly activeTab: TabKey;
  readonly onTabChange: (tab: TabKey) => void;
}

export interface PostCardProps {
  readonly post: Post;
  readonly onLike: (id: string) => void;
  readonly scrollY: Animated.Value;
}

export interface ClassroomCardProps {
  readonly classroom: Classroom;
  readonly scrollY: Animated.Value;
}

export interface FileCardProps {
  readonly file: FileItem;
  readonly scrollY: Animated.Value;
}

export interface LeaderboardCardProps {
  readonly entry: LeaderboardEntry;
  readonly index: number;
}

export interface InfoSectionProps {
  readonly group: Group;
}

export interface FileFilterProps {
  readonly activeFilter: FileFilter;
  readonly onFilterChange: (filter: FileFilter) => void;
}

export interface EmptyStateProps {
  readonly tab: string;
}

export interface ScrollToTopButtonProps {
  readonly isVisible: boolean;
  readonly onPress: () => void;
}

export interface AnimatedImageProps {
  readonly source: { uri: string };
  readonly style: any;
  readonly scrollY: Animated.Value;
  readonly accessibilityIgnoresInvertColors?: boolean;
}