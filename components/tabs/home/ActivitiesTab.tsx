import React from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  ScrollView, 
  Image, 
  TouchableOpacity 
} from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: string;
  participants: number;
  date: string;
  image: string;
}

const ActivitiesTab: React.FC = () => {
  const activities: ActivityItem[] = [
    {
      id: '1',
      title: 'رحلة تزلج',
      description: 'رحلة تزلج جماعية إلى منتجع التزلج',
      type: 'رياضة',
      participants: 25,
      date: '٢٠ أكتوبر ٢٠٢٣',
      image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '2',
      title: 'ورشة الرسم',
      description: 'ورشة تعليم الرسم للمبتدئين',
      type: 'فنون',
      participants: 15,
      date: '٢٥ أكتوبر ٢٠٢٣',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
    {
      id: '3',
      title: 'مسابقة البرمجة',
      description: 'مسابقة برمجة لطلاب الجامعة',
      type: 'تقنية',
      participants: 50,
      date: '٣٠ أكتوبر ٢٠٢٣',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80'
    },
  ];

  const activityTypes = [
    { id: '1', name: 'رياضية', icon: 'basketball', color: '#4ecdc4' },
    { id: '2', name: 'ثقافية', icon: 'library', color: '#ff6b6b' },
    { id: '3', name: 'تطوعية', icon: 'heart', color: '#ffd166' },
    { id: '4', name: 'ترفيهية', icon: 'game-controller', color: '#6a0572' },
  ];

  const handleActivityPress = (activityId: string) => {
    console.log('Activity pressed:', activityId);
  };

  const handleTypePress = (typeId: string) => {
    console.log('Activity type pressed:', typeId);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Header Card */}
        <View style={styles.headerCard}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>الأنشطة الطلابية</Text>
            <Text style={styles.headerSubtitle}>انضم إلى الأنشطة والبرامج الطلابية المتنوعة</Text>
          </View>
          <FontAwesome5 name="running" size={40} color="#1B6CB9" />
        </View>

        {/* Activity Types */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>أنواع الأنشطة</Text>
          </View>
          <View style={styles.typesGrid}>
            {activityTypes.map((type) => (
              <TouchableOpacity 
                key={type.id} 
                style={styles.typeCard}
                onPress={() => handleTypePress(type.id)}
              >
                <View style={[styles.typeIcon, { backgroundColor: type.color }]}>
                  <Ionicons name={type.icon as any} size={24} color="#fff" />
                </View>
                <Text style={styles.typeText}>{type.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Upcoming Activities */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>الأنشطة القادمة</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>عرض الكل</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.activitiesList}>
            {activities.map((activity) => (
              <TouchableOpacity 
                key={activity.id} 
                style={styles.activityCard}
                onPress={() => handleActivityPress(activity.id)}
              >
                <Image 
                  source={{ uri: activity.image }} 
                  style={styles.activityImage}
                  resizeMode="cover"
                />
                <View style={styles.activityContent}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityDescription} numberOfLines={2}>
                    {activity.description}
                  </Text>
                  <View style={styles.activityDetails}>
                    <View style={styles.detailRow}>
                      <View style={styles.detailItem}>
                        <Ionicons name="people-outline" size={14} color="#666" />
                        <Text style={styles.detailText}>{activity.participants} مشترك</Text>
                      </View>
                      <View style={styles.detailItem}>
                        <Ionicons name="calendar-outline" size={14} color="#666" />
                        <Text style={styles.detailText}>{activity.date}</Text>
                      </View>
                    </View>
                    <View style={styles.typeTag}>
                      <Text style={styles.typeTagText}>{activity.type}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.joinButton}>
                    <Text style={styles.joinButtonText}>انضم الآن</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

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
  headerCard: {
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
  headerTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Cairo_Bold',
    color: '#333',
    textAlign: 'right',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    fontFamily: 'Cairo_Regular',
    color: '#666',
    textAlign: 'right',
  },
  section: {
    marginBottom: 24,
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
  typesGrid: {
    flexDirection: 'row-reverse',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  typeCard: {
    alignItems: 'center',
    width: '45%',
    marginBottom: 20,
  },
  typeIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  typeText: {
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: '#333',
    textAlign: 'center',
  },
  activitiesList: {
    paddingHorizontal: 16,
  },
  activityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  activityImage: {
    width: '100%',
    height: 120,
  },
  activityContent: {
    padding: 16,
  },
  activityTitle: {
    fontSize: 18,
    fontFamily: 'Cairo_Bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'right',
  },
  activityDescription: {
    fontSize: 14,
    fontFamily: 'Cairo_Regular',
    color: '#666',
    marginBottom: 12,
    textAlign: 'right',
    lineHeight: 20,
  },
  activityDetails: {
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    fontFamily: 'Cairo_Regular',
    color: '#666',
    marginRight: 6,
  },
  typeTag: {
    backgroundColor: '#E8F5FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  typeTagText: {
    fontSize: 12,
    fontFamily: 'Cairo_Medium',
    color: '#1B6CB9',
  },
  joinButton: {
    backgroundColor: '#1B6CB9',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  joinButtonText: {
    color: '#fff',
    fontFamily: 'Cairo_Bold',
    fontSize: 14,
  },
  bottomSpacing: {
    height: 20,
  },
});

export default ActivitiesTab;