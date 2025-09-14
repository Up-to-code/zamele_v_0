import React, { useRef, useMemo, useCallback, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  SafeAreaView, 
  I18nManager, 
  Linking,
  Platform,
  Animated,
  Dimensions,
  TouchableWithoutFeedback,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Force RTL layout for Arabic
I18nManager.forceRTL(true);
I18nManager.allowRTL(true);

// Minimal color palette
const colors = {
  primary: "#0070BA",  // PayPal blue
  secondary: "#003087", // Darker blue
  tertiary: "#2C2C2C",  // Dark text
  light: "#F5F7FA",     // Light background
  background: "#FFFFFF", // White background
  border: "#E6E8EB",    // Border color
}

// Define event interface
interface Event {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  image: string;
  category: string;
  url: string;
  description: string;
}

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const BOTTOM_SHEET_MAX_HEIGHT = SCREEN_HEIGHT * 0.6;
const BOTTOM_SHEET_MIN_HEIGHT = 100;

const EventsScreen = () => {
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const bottomSheetAnimation = useRef(new Animated.Value(0)).current;
  
  // Sample events data with URLs
  const events: Event[] = [
    {
      id: '1',
      title: 'ندوة التكنولوجيا الحديثة',
      date: '١٥ أكتوبر ٢٠٢٣',
      time: '٥:٠٠ مساءً',
      location: 'القاعة الرئيسية',
      image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'أكاديمي',
      url: 'https://example.com/event1',
      description: 'ندوة حول أحدث التطورات التكنولوجية في مجال التعليم والبحث العلمي'
    },
    {
      id: '2',
      title: 'معرض الابتكار الطلابي',
      date: '١٧ أكتوبر ٢٠٢٣',
      time: '١٠:٠٠ صباحاً',
      location: 'الساحة الجامعية',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'طلابي',
      url: 'https://example.com/event2',
      description: 'معرض يقدم مشاريع طلابية مبتكرة في مختلف المجالات العلمية والتقنية'
    },
    {
      id: '3',
      title: 'مسابقة كرة السلة',
      date: '٢٠ أكتوبر ٢٠٢٣',
      time: '٤:٠٠ عصراً',
      location: 'ملعب الجامعة',
      image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
      category: 'رياضي',
      url: 'https://example.com/event3',
      description: 'مسابقة كرة السلة بين كليات الجامعة مع جوائز قيمة للفائزين'
    },
  ];

  // Function to open event URL
  const openEventURL = (url: string) => {
    Linking.openURL(url).catch(err => 
      console.error('Failed to open URL:', err)
    );
  };

  // Function to show bottom sheet
  const showBottomSheet = useCallback((event: Event) => {
    setSelectedEvent(event);
    Animated.timing(bottomSheetAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [bottomSheetAnimation]);

  // Function to hide bottom sheet
  const hideBottomSheet = useCallback(() => {
    Animated.timing(bottomSheetAnimation, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setSelectedEvent(null);
    });
  }, [bottomSheetAnimation]);

  // Bottom sheet animation
  const bottomSheetStyle = useMemo(() => {
    const translateY = bottomSheetAnimation.interpolate({
      inputRange: [0, 1],
      outputRange: [BOTTOM_SHEET_MAX_HEIGHT, 0],
    });

    return {
      transform: [{ translateY }],
    };
  }, [bottomSheetAnimation]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>الفعاليات</Text>
        <TouchableOpacity style={styles.filterButton}>
          <Ionicons name="options-outline" size={20} color={colors.tertiary} />
        </TouchableOpacity>
      </View>

      {/* Events List */}
      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        {events.map((event) => (
          <TouchableOpacity 
            key={event.id} 
            style={styles.eventCard}
            onPress={() => showBottomSheet(event)}
          >
            {/* Image at the top */}
            <Image 
              source={{ uri: event.image }} 
              style={styles.eventImage}
              resizeMode="cover"
            />
            
            {/* Content below image */}
            <View style={styles.cardContent}>
              <View style={styles.categoryContainer}>
                <Text style={styles.categoryText}>{event.category}</Text>
              </View>
              
              <Text style={styles.eventTitle}>{event.title}</Text>
              
              <View style={styles.eventDetails}>
                <View style={styles.detailRow}>
                  <Ionicons name="calendar-outline" size={14} color={colors.tertiary} />
                  <Text style={styles.detailText}>{event.date}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="time-outline" size={14} color={colors.tertiary} />
                  <Text style={styles.detailText}>{event.time}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Ionicons name="location-outline" size={14} color={colors.tertiary} />
                  <Text style={styles.detailText}>{event.location}</Text>
                </View>
              </View>
              
              <View style={styles.footer}>
                <TouchableOpacity 
                  style={styles.registerButton}
                  onPress={() => showBottomSheet(event)}
                >
                  <Text style={styles.registerText}>سجل الآن</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Bottom Sheet for Event Details */}
      {selectedEvent && (
        <>
          <TouchableWithoutFeedback onPress={hideBottomSheet}>
            <View style={styles.overlay} />
          </TouchableWithoutFeedback>
          <Animated.View style={[styles.bottomSheet, bottomSheetStyle]}>
            <View style={styles.bottomSheetHeader}>
              <View style={styles.handle} />
            </View>
            
            <ScrollView style={styles.bottomSheetContent}>
              <Image 
                source={{ uri: selectedEvent.image }} 
                style={styles.bottomSheetImage}
                resizeMode="cover"
              />
              
              <View style={styles.bottomSheetCategoryContainer}>
                <Text style={styles.bottomSheetCategoryText}>{selectedEvent.category}</Text>
              </View>
              
              <Text style={styles.bottomSheetTitle}>{selectedEvent.title}</Text>
              
              <Text style={styles.bottomSheetDescription}>
                {selectedEvent.description}
              </Text>
              
              <View style={styles.bottomSheetDetails}>
                <View style={styles.bottomSheetDetailRow}>
                  <Ionicons name="calendar-outline" size={16} color={colors.tertiary} />
                  <Text style={styles.bottomSheetDetailText}>{selectedEvent.date}</Text>
                </View>
                <View style={styles.bottomSheetDetailRow}>
                  <Ionicons name="time-outline" size={16} color={colors.tertiary} />
                  <Text style={styles.bottomSheetDetailText}>{selectedEvent.time}</Text>
                </View>
                <View style={styles.bottomSheetDetailRow}>
                  <Ionicons name="location-outline" size={16} color={colors.tertiary} />
                  <Text style={styles.bottomSheetDetailText}>{selectedEvent.location}</Text>
                </View>
              </View>
            </ScrollView>
            
            <View style={styles.bottomSheetActions}>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={hideBottomSheet}
              >
                <Text style={styles.closeButtonText}>إغلاق</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.urlButton}
                onPress={() => openEventURL(selectedEvent.url)}
              >
                <Text style={styles.urlButtonText}>فتح رابط الفعالية</Text>
                <Ionicons name="open-outline" size={16} color="#FFF" />
              </TouchableOpacity>
            </View>
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.tertiary,
  },
  filterButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
    padding: 12,
  },
  eventCard: {
    backgroundColor: colors.background,
    borderRadius: 8,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  eventImage: {
    width: '100%',
    height: 160,
  },
  cardContent: {
    padding: 16,
  },
  categoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '500',
    color: colors.primary,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.tertiary,
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 24,
  },
  eventDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.tertiary,
    marginRight: 8,
    textAlign: 'right',
  },
  footer: {
    flexDirection: 'row-reverse',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  registerButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  registerText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 13,
  },
  // Bottom Sheet Styles
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  bottomSheet: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.background,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: BOTTOM_SHEET_MAX_HEIGHT,
    minHeight: BOTTOM_SHEET_MIN_HEIGHT,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  bottomSheetHeader: {
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: colors.border,
    borderRadius: 3,
  },
  bottomSheetContent: {
    padding: 16,
  },
  bottomSheetImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 16,
  },
  bottomSheetCategoryContainer: {
    alignSelf: 'flex-start',
    backgroundColor: colors.light,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginBottom: 12,
  },
  bottomSheetCategoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.primary,
  },
  bottomSheetTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.tertiary,
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 28,
  },
  bottomSheetDescription: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.tertiary,
    marginBottom: 16,
    textAlign: 'right',
    lineHeight: 22,
  },
  bottomSheetDetails: {
    marginBottom: 16,
  },
  bottomSheetDetailRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginBottom: 12,
  },
  bottomSheetDetailText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.tertiary,
    marginRight: 8,
    textAlign: 'right',
  },
  bottomSheetActions: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  closeButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  closeButtonText: {
    color: colors.tertiary,
    fontWeight: '500',
    fontSize: 14,
  },
  urlButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
  },
  urlButtonText: {
    color: '#FFF',
    fontWeight: '500',
    fontSize: 14,
    marginRight: 8,
  },
});

export default EventsScreen;