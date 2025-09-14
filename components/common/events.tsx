import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  useWindowDimensions,
  SafeAreaView,
  TouchableOpacity
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Define types for our data
type EventCard = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  image: string;
  price: string;
};

type CourseCard = {
  id: string;
  title: string;
  description: string;
  duration: string;
  students: number;
  image: string;
};

export default function Events() {
  const { width } = useWindowDimensions();

  // Sample data for events with URL images
  const events: EventCard[] = [
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

  // Sample data for courses with URL images
  const courses: CourseCard[] = [
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeTextContainer}>
            <Text style={styles.welcomeTitle}>مرحبًا بك في منصة الفعاليات</Text>
            <Text style={styles.welcomeSubtitle}>استكشف الفعاليات القادمة والدورات المتاحة</Text>
          </View>
          <Ionicons name="calendar" size={40} color="#4a6fa5" />
        </View>

        {/* Horizontal Scroll View for Events */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>الفعاليات القادمة</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>عرض الكل</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          // RTL direction - start from right
        >
          {events.map((event) => (
            <EventCard key={event.id} event={event} cardWidth={width * 0.8} />
          ))}
        </ScrollView>

        {/* Courses Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>الدورات المتاحة</Text>
          <TouchableOpacity>
            <Text style={styles.seeAll}>عرض الكل</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalScroll}
          // RTL direction - start from right
        >
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} cardWidth={width * 0.8} />
          ))}
        </ScrollView>

        {/* Maps Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>الخريطة</Text>
        </View>
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <MaterialIcons name="location-on" size={40} color="#4a6fa5" />
            <Text style={styles.mapText}>الخريطة التفاعلية</Text>
            <Text style={styles.mapSubText}>انقر لعرض الفعاليات على الخريطة</Text>
          </View>
        </View>

        {/* Categories Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>التصنيفات</Text>
        </View>
        <View style={styles.categoriesContainer}>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryIcon, { backgroundColor: '#ff6b6b' }]}>
              <Ionicons name="musical-notes" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>موسيقى</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryIcon, { backgroundColor: '#4ecdc4' }]}>
              <Ionicons name="business" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>أعمال</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryIcon, { backgroundColor: '#ffd166' }]}>
              <Ionicons name="school" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>تعليم</Text>
          </View>
          <View style={styles.categoryItem}>
            <View style={[styles.categoryIcon, { backgroundColor: '#6a0572' }]}>
              <Ionicons name="restaurant" size={24} color="#fff" />
            </View>
            <Text style={styles.categoryText}>طعام</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Event Card Component
const EventCard = ({ event, cardWidth }: { event: EventCard; cardWidth: number }) => (
  <View style={[styles.card, { width: cardWidth }]}>
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
      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>سجل الآن</Text>
      </TouchableOpacity>
    </View>
  </View>
);

// Course Card Component
const CourseCard = ({ course, cardWidth }: { course: CourseCard; cardWidth: number }) => (
  <View style={[styles.card, { width: cardWidth }]}>
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
      <TouchableOpacity style={[styles.button, { backgroundColor: '#4a6fa5' }]}>
        <Text style={styles.buttonText}>إنضم الآن</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContainer: {
    flex: 1,
    paddingTop: 16,
  },
  welcomeCard: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'right',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'right',
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#4a6fa5',
  },
  horizontalScroll: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginLeft: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
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
    backgroundColor: '#4a6fa5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  priceText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  cardDescription: {
    fontSize: 14,
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
    color: '#666',
    marginRight: 6,
  },
  button: {
    backgroundColor: '#ff6b6b',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  mapContainer: {
    marginHorizontal: 16,
    marginBottom: 24,
  },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#e9ecef',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4a6fa5',
    marginTop: 8,
  },
  mapSubText: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  categoriesContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  categoryItem: {
    alignItems: 'center',
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
    color: '#333',
  },
});