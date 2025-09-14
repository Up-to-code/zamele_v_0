import { useUserStore } from '@/lib/store/userStore';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Animated,
  Dimensions,
  Easing,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// Define user type
type UserType = 'student' | 'teacher';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

// Simple SVG-like icon components
const StudentIcon = ({ selected }: { selected: boolean }) => (
  <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
    <Text style={[styles.iconText, selected && styles.iconTextSelected]}>🎓</Text>
  </View>
);

const TeacherIcon = ({ selected }: { selected: boolean }) => (
  <View style={[styles.iconContainer, selected && styles.iconContainerSelected]}>
    <Text style={[styles.iconText, selected && styles.iconTextSelected]}>👩‍🏫</Text>
  </View>
);

const UserTypeScreen = () => {
  const [selectedType, setSelectedType] = useState<UserType | null>(null);
  const [animation] = useState(new Animated.Value(0));
  const router = useRouter();
  const { setUserType } = useUserStore();

  useEffect(() => {
    Animated.timing(animation, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [animation]);

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [50, 0],
  });

  const opacity = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });

  const handleContinue = (): void => {
    if (selectedType === 'student') {
      setUserType(selectedType);
      // Navigate to sign-up screen with user type as parameter
      // router.push({
      //   pathname: '/auth/UniversityScreen',
      //   params: { userType: selectedType }
      // });
      router.push("/(start)/universityScreen");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <Animated.View style={[styles.header, { opacity, transform: [{ translateY }] }]}>
          <Text style={styles.title}>من أنت؟</Text>
          <Text style={styles.subtitle}>اختر نوع الحساب للمتابعة</Text>
        </Animated.View>

        <View style={styles.optionsContainer}>
          {/* Student */}
          <TouchableOpacity
            style={[
              styles.optionCard,
              selectedType === 'student' && styles.optionCardSelected
            ]}
            onPress={() => setSelectedType('student')}
            activeOpacity={0.7}
          >
            <View style={styles.optionContent}>
              <StudentIcon selected={selectedType === 'student'} />
              <Text style={styles.optionTitle}>طالب</Text>
              <Text style={styles.optionDescription}>
                انضم إلى الفصول، ارفع الواجبات، وتعاون مع زملائك
              </Text>
            </View>
            
            {selectedType === 'student' && (
              <View style={styles.selectedIndicator}>
                <View style={styles.selectedIndicatorInner} />
              </View>
            )}
          </TouchableOpacity>

          {/* Teacher (Under development) */}
          <TouchableOpacity
            style={[styles.optionCard, { opacity: 0.5 }]}
            onPress={() => {}}
            activeOpacity={1}
            disabled
          >
            <View style={styles.optionContent}>
              <TeacherIcon selected={false} />
              <Text style={styles.optionTitle}>معلم</Text>
              <Text style={styles.optionDescription}>
                قريباً — إنشاء الدورات وإدارة الفصول
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View style={[styles.footer, { opacity, transform: [{ translateY }] }]}>
          <TouchableOpacity
            style={[
              styles.continueButton,
              !selectedType && styles.continueButtonDisabled
            ]}
            onPress={handleContinue}
            disabled={!selectedType}
            activeOpacity={0.8}
          >
            <Text style={styles.continueButtonText}>
              متابعة
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'space-between',
    minHeight: SCREEN_HEIGHT,
  },
  header: {
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
     color: '#000000',
    marginBottom: 8,
    fontFamily: "Cairo_Bold",
  },
  subtitle: {
    fontSize: 17,
    color: '#8E8E93',
    textAlign: 'center',
    fontFamily: "Cairo_Bold",
  },
  optionsContainer: {
    flex: 1,
    justifyContent: 'center',
    gap: 20,
    minHeight: SCREEN_HEIGHT * 0.5,
  },
  optionCard: {
    backgroundColor: '#F2F2F7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 2,
    borderColor: 'transparent',
    position: 'relative',
  },
  optionCardSelected: {
    backgroundColor: '#E6F2FF',
    borderColor: '#007AFF',
  },
  optionContent: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E5E5EA',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainerSelected: {
    backgroundColor: '#007AFF',
  },
  iconText: {
    fontSize: 32,
    fontFamily: "Cairo_Bold",
  },
  iconTextSelected: {
    color: '#FFFFFF',
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 8,
    fontFamily: "Cairo_Bold",
  },
  optionDescription: {
    fontSize: 15,
    color: '#8E8E93',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: "Cairo_Medium",
  },
  selectedIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedIndicatorInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#007AFF',
  },
  footer: {
    marginTop: 30,
    marginBottom: 40,
  },
  continueButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueButtonDisabled: {
    backgroundColor: '#C7C7CC',
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
     fontFamily: "Cairo_Bold",
  },
});

export default UserTypeScreen;
