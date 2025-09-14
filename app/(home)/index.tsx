import UniversityPostCard from '@/components/common/UniversityPostCard';
import TopTabs from '@/components/layout/TopTabs';
import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import Events from '@/components/common/events';
import CategoriesContainer from '@/components/common/categoriesContainer';

// Define the type for our mock posts to match the UniversityPostCard expectations
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

const Index = () => {
  const [active, setActive] = useState(0);
  const tabs = ['الرئيسية', 'الأحداث', 'الأنشطة'];

  // Mock data for posts with proper typing
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
    {
      id: '3',
      user: { id: 'user3', name: 'د. أحمد محمد', verified: false },
      createdAt: 'منذ 6 ساعات',
      text: 'يرجى الاطلاع على الملفات المرفقة لمادة الخوارزميات.',
      files: [
        {
          uri: 'https://example.com/files/algorithm-lecture.pdf',
          name: 'محاضرة الخوارزميات.pdf',
          type: 'pdf',
          size: 2500000,
        },
        {
          uri: 'https://example.com/files/code-examples.zip',
          name: 'أمثلة برمجية.zip',
          type: 'zip',
          size: 5000000,
        }
      ],
      likesCount: 8,
      commentsCount: 4,
      likedByMe: false,
    },
    {
      id: '4',
      user: { id: 'user4', name: 'نادي التصميم', verified: true },
      createdAt: 'منذ يوم',
      text: 'ورشة عمل التصميم الجرافيكي ستقام يوم السبت القادم. سجلوا أسماءكم الآن!',
      images: [
        'https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=1600&auto=format&fit=crop',
      ],
      files: [
        {
          uri: 'https://example.com/files/workshop-details.docx',
          name: 'تفاصيل الورشة.docx',
          type: 'word',
          size: 1500000,
        }
      ],
      likesCount: 23,
      commentsCount: 7,
      likedByMe: true,
    },
    {
      id: '5',
      user: { id: 'user5', name: 'عمادة شؤون الطلاب', verified: true },
      createdAt: 'منذ يومين',
      text: 'إعلان هام: سيتم تعليق الدراسة يوم الأحد القادم بسبب الاحتفال باليوم الوطني.',
      files: [
        {
          uri: 'https://example.com/files/holiday-announcement.pdf',
          name: 'إعلان العطلة الرسمية.pdf',
          type: 'pdf',
          size: 800000,
        }
      ],
      likesCount: 45,
      commentsCount: 12,
      likedByMe: false,
    },
    {
      id: '6',
      user: { id: 'user6', name: 'فريق البرمجة', verified: true },
      createdAt: 'منذ 3 أيام',
      text: 'كود المثال الذي ناقشناه في آخر جلسة:',
      files: [
        {
          uri: 'https://example.com/files/example-code.js',
          name: 'مثال-الكود.js',
          type: 'code',
          size: 120000,
        }
      ],
      likesCount: 15,
      commentsCount: 6,
      likedByMe: true,
    }
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
    <SafeAreaView style={styles.container}>
      <TopTabs tabs={tabs} activeIndex={active} onChange={setActive} />
      <FlashList
        ListHeaderComponent={ <CategoriesContainer />}
        data={posts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
               contentContainerStyle={styles.listContent}
        ListFooterComponent={
          <View style={styles.endOfFeed}>
            <Text style={styles.endOfFeedText}>لا يوجد المزيد من المنشورات</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F2F2F7' 
  },
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

export default Index;