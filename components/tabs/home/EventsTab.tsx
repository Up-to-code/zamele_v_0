import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  useWindowDimensions,
  TouchableOpacity
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Define types for our data
interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: string;
}

interface CourseItem {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: number;
  image: string;
}

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Event Card Component Props
interface EventCardProps {
  event: EventItem;
  cardWidth: number;
  onPress: () => void;
}

// Course Card Component Props
interface CourseCardProps {
  course: CourseItem;
  cardWidth: number;
  onPress: () => void;
}

// Event Card Component
const EventCard: React.FC<EventCardProps> = ({ event, cardWidth, onPress }) => (
  <TouchableOpacity 
    style={[styles.card, { width: cardWidth }]} 
    onPress={onPress}
    activeOpacity={0.9}
  >
    <Image 
      source={{ uri: event.image }} 
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <View style={styles.priceTag}>
        <Text style={styles.priceText}>{event.price}</Text>
      </View>
      <Text style={styles.cardTitle}>{event.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {event.description}
      </Text>
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="calendar-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{event.date}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{event.location}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.primaryButton}>
        <Text style={styles.buttonText}>سجل الآن</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

// Course Card Component
const CourseCard: React.FC<CourseCardProps> = ({ course, cardWidth, onPress }) => (
  <TouchableOpacity 
    style={[styles.card, { width: cardWidth }]} 
    onPress={onPress}
    activeOpacity={0.9}
  >
    <Image 
      source={{ uri: course.image }} 
      style={styles.cardImage}
      resizeMode="cover"
    />
    <View style={styles.cardContent}>
      <Text style={styles.cardTitle}>{course.title}</Text>
      <Text style={styles.cardDescription} numberOfLines={2}>
        {course.description}
      </Text>
      <View style={styles.cardDetails}>
        <View style={styles.detailItem}>
          <Ionicons name="time-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{course.duration}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="people-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{course.students} طالب</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.secondaryButton}>
        <Text style={styles.buttonText}>إنضم الآن</Text>
      </TouchableOpacity>
    </View>
  </TouchableOpacity>
);

const EventsTab: React.FC = () => {
  const { width } = useWindowDimensions();

  // Sample data for events
  const events: EventItem[] = [
    {
      id: '1',
      title: 'ندوة التكنولوجيا',
      description: 'ندوة حول أحدث اتجاهات التكنولوجيا والابتكار',
      date: '١٥ أكتوبر ٢٠٢٣',
      location: 'الرياض، المملكة العربية السعودية',
      image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      price: 'مجاني'
    },
    {
      id: '2',
      title: 'مهرجان الثقافة',
      description: 'احتفال بالتراث الثقافي والفنون التقليدية',
      date: '٢٢ أكتوبر ٢٠٢٣',
      location: 'جدة، المملكة العربية السعودية',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      price: '٣٥ ريال'
    },
    {
      id: '3',
      title: 'ورشة عمل ريادة الأعمال',
      description: 'تعلم أساسيات بدء وتنمية مشروعك الخاص',
      date: '٣٠ أكتوبر ٢٠٢٣',
      location: 'الدوحة، قطر',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      price: '٥٠ ريال'
    },
  ];

  // Sample data for courses
  const courses: CourseItem[] = [
    {
      id: '1',
      title: 'دورة تطوير التطبيقات',
      description: 'تعلم كيفية بناء تطبيقات الجوال باستخدام React Native',
      duration: '٦ أسابيع',
      students: 125,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '2',
      title: 'دورة تصميم UI/UX',
      description: 'أساسيات تصميم واجهات المستخدم وتجربة المستخدم',
      duration: '٨ أسابيع',
      students: 89,
      image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '3',
      title: 'دورة التسويق الرقمي',
      description: 'تعلم استراتيجيات التسويق الرقمي الفعالة',
      duration: '٤ أسابيع',
      students: 210,
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
  ];

  // Categories data
  const categories: CategoryItem[] = [
    { id: '1', name: 'موسيقى', icon: 'musical-notes', color: '#ff6b6b' },
    { id: '2', name: 'أعمال', icon: 'business', color: '#4ecdc4' },
    { id: '3', name: 'تعليم', icon: 'school', color: '#ffd166' },
    { id: '4', name: 'طعام', icon: 'restaurant', color: '#6a0572' },
    { id: '5', name: 'رياضة', icon: 'basketball', color: '#118ab2' },
    { id: '6', name: 'فنون', icon: 'color-palette', color: '#ef476f' },
  ];

  const handleEventPress = (eventId: string) => {
    console.log('Event pressed:', eventId);
  };

  const handleCoursePress = (courseId: string) => {
    console.log('Course pressed:', courseId);
  };

  const handleCategoryPress = (categoryId: string) => {
    console.log('Category pressed:', categoryId);
  };

  const handleMapPress = () => {
    console.log('Map pressed');
  };

  const handleSeeAllEvents = () => {
    console.log('See all events');
  };

  const handleSeeAllCourses = () => {
    console.log('See all courses');
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>مرحبًا بك في منصة الفعاليات</Text>
            <Text style={styles.welcomeSubtitle}>استكشف الفعاليات القادمة والدورات المتاحة</Text>
          </View>
          <Ionicons name="calendar" size={40} color="#1B6CB9" />
        </View>

        {/* Events Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الفعاليات القادمة</Text>
            <TouchableOpacity onPress={handleSeeAllEvents}>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {events.map((event) => (
              <EventCard 
                key={event.id} 
                event={event} 
                cardWidth={width * 0.8} 
                onPress={() => handleEventPress(event.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Courses Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الدورات المتاحة</Text>
            <TouchableOpacity onPress={handleSeeAllCourses}>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.horizontalScroll}
          >
            {courses.map((course) => (
              <CourseCard 
                key={course.id} 
                course={course} 
                cardWidth={width * 0.8}
                onPress={() => handleCoursePress(course.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Map Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الخريطة</Text>
          </View>
          <TouchableOpacity style={styles.mapContainer} onPress={handleMapPress}>
            <View style={styles.mapPlaceholder}>
              <MaterialIcons name="location-on" size={40} color="#1B6CB9" />
              <Text style={styles.mapText}>الخريطة التفاعلية</Text>
              <Text style={styles.mapSubText}>انقر لعرض الفعاليات على الخريطة</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Categories Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>التصنيفات</Text>
          </View>
          <View style={styles.categoriesGrid}>
            {categories.map((category) => (
              <TouchableOpacity 
                key={category.id} 
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category.id)}
              >
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Ionicons name={category.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
  },
  section: {
    marginBottom: 8,
  },
  welcomeCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    margin: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  welcomeTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  welcomeTitle: {
    fontSize: 20,
    fontFamily: 'Cairo_Bold',
    color: '#333',
    textAlign: 'right',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    fontFamily: 'Cairo_Regular',
    color: '#666',
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Cairo_Bold',
    color: '#333',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: '#1B6CB9',
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginLeft: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  priceTag: {
    position: 'absolute',
    top: -40,
    left: 16,
    backgroundColor: '#1B6CB9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  priceText: {
    color: '#fff',
    fontFamily: 'Cairo_Bold',
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontFamily: 'Cairo_Bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  cardDescription: {
    fontSize: 14,
    fontFamily: 'Cairo_Regular',
    color: '#666',
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 20,
  },
  cardDetails: {
    flexDirection: 'column',
    marginBottom: 16,
  },
  detailItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Cairo_Regular',
    color: '#666',
    marginRight: 6,
  },
  primaryButton: {
    backgroundColor: '#1B6CB9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#4a6fa5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontFamily: 'Cairo_Bold',
    fontSize: 14,
  },
  mapContainer: {
    marginHorizontal: 16,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#dee2e6',
    borderStyle: 'dashed',
  },
  mapText: {
    fontSize: 16,
    fontFamily: 'Cairo_Bold',
    color: '#1B6CB9',
    marginTop: 8,
  },
  mapSubText: {
    fontSize: 12,
    fontFamily: 'Cairo_Regular',
    color: '#999',
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  categoryCard: {
    alignItems: 'center',
    width: '30%',
    marginBottom: 20,
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Cairo_Medium',
    color: '#333',
    textAlign: 'center',
  },
  bottomSpacing: {
    height: 20,
  },
});

export default EventsTab;