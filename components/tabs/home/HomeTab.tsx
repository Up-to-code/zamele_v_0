import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import UniversityPostCard from '@/components/common/UniversityPostCard';
import CategoriesContainer from '@/components/common/categoriesContainer';

// Types
interface MockPost {
  id: string;
  user: {
    id: string;
    name: string;
    verified: boolean;
    avatarUrl?: string;
  };
  createdAt: string;
  text: string;
  images?: string[];
  files?: Array<{
    uri: string;
    name: string;
    type: string;
    size?: number;
  }>;
  likesCount: number;
  commentsCount: number;
  likedByMe: boolean;
}

const HomeTab = () => {
  // Mock data
  const posts: MockPost[] = [
    {
      id: '1',
      user: { id: 'user1', name: 'جامعة المستقبل', verified: true },
      createdAt: 'منذ 2 ساعة',
      text: 'صور من فعالية الأمس في الحرم الجامعي.',
      images: [
        'https://images.unsplash.com/photo-1503428593586-e225b39bddfe?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1462536943532-57a629f6cc60?q=80&w=1600&auto=format&fit=crop',
      ],
      likesCount: 12,
      commentsCount: 3,
      likedByMe: false,
    },
    {
      id: '2',
      user: { id: 'user2', name: 'جامعة السلام', verified: true },
      createdAt: 'منذ 5 ساعات',
      text: 'مهرجان طلابي رائع!',
      images: [
        'https://images.unsplash.com/photo-1531266752426-501a7e8a38ac?q=80&w=1600&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop',
      ],
      likesCount: 5,
      commentsCount: 1,
      likedByMe: true,
    },
    // Add more posts as needed
  ];

  const handleLikePress = (postId: string) => {
    console.log('Like pressed for post:', postId);
  };

  const handleCommentPress = (postId: string) => {
    console.log('Comment pressed for post:', postId);
  };

  const handleFilePress = (fileUrl: string, fileName: string) => {
    console.log('File pressed:', fileName, 'URL:', fileUrl);
  };

  const renderItem = ({ item }: { item: MockPost }) => (
    <UniversityPostCard
      post={item}
      onLikePress={handleLikePress}
      onCommentPress={handleCommentPress}
      onFilePress={handleFilePress}
    />
  );

  return (
    <FlashList
      data={posts}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
       ListFooterComponent={
        <View style={styles.endOfFeed}>
          <Text style={styles.endOfFeedText}>لا يوجد المزيد من المنشورات</Text>
        </View>
      }
       contentContainerStyle={styles.listContent}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingHorizontal: 4,
  },
  endOfFeed: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  endOfFeedText: {
    fontSize: 14,
    color: '#8E8E93',
    fontFamily: 'Cairo_Regular',
  },
});

export default HomeTab;