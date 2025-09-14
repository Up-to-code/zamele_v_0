import { useOAuth, useSignUp } from '@clerk/clerk-expo';
import { AntDesign, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  I18nManager,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

// Force RTL layout for Arabic
I18nManager.allowRTL(true);
I18nManager.forceRTL(true);

type UserType = 'student' | 'teacher';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Modern iOS color palette
const COLORS = {
  primary: '#007AFF',
  primaryDark: '#0056CC',
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F2F2F7',
  gray200: '#E5E5EA',
  gray300: '#D1D1D6',
  gray600: '#8E8E93',
  gray800: '#3A3A3C',
  error: '#FF3B30',
};

// Handle OAuth redirects
WebBrowser.maybeCompleteAuthSession();

// Email validation function
const validateEmail = (email: string) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// Password strength indicator
const getPasswordStrength = (password: string) => {
  if (password.length === 0) return { strength: 0, label: '' };
  if (password.length < 4) return { strength: 1, label: 'ضعيف' };
  if (password.length < 8) return { strength: 2, label: 'مقبول' };
  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/.test(password)) return { strength: 3, label: 'جيد' };
  return { strength: 4, label: 'قوي' };
};

// Define strength bar colors
const STRENGTH_BAR_COLORS = {
  1: COLORS.error,
  2: '#FF9500',
  3: '#FFCC00',
  4: '#34C759',
};

const SignUpScreen = () => {
  const { isLoaded, signUp, setActive } = useSignUp();
  const { userType } = useLocalSearchParams();
  const router = useRouter();
  
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<'google' | 'apple' | null>(null);

  // OAuth for Google
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  // OAuth for Apple
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });

  const onGoogleSignInPress = async () => {
    try {
      setOauthLoading('google');
      const { createdSessionId, setActive } = await startGoogleOAuthFlow({
        redirectUrl: `yourapp://oauth?userType=${userType}`
      });
      
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/(home)');
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === 'oauth_callback_error') {
        // User canceled the flow, no need to show error
      } else {
        Alert.alert('خطأ', 'فشل تسجيل الدخول باستخدام Google');
      }
    } finally {
      setOauthLoading(null);
    }
  };

  const onAppleSignInPress = async () => {
    try {
      setOauthLoading('apple');
      const { createdSessionId, setActive } = await startAppleOAuthFlow({
        redirectUrl: `yourapp://oauth?userType=${userType}`
      });
      
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/(home)');
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === 'oauth_callback_error') {
        // User canceled the flow, no need to show error
      } else {
        Alert.alert('خطأ', 'فشل تسجيل الدخول باستخدام Apple');
      }
    } finally {
      setOauthLoading(null);
    }
  };

  const onSignUpPress = async () => {
    if (!isLoaded || isLoading) return;
    
    // Validate inputs
    if (!firstName.trim() || !lastName.trim() || !emailAddress.trim() || !password.trim()) {
      Alert.alert('خطأ', 'الرجاء تعبئة جميع الحقول');
      return;
    }
    
    if (!validateEmail(emailAddress.trim())) {
      Alert.alert('خطأ', 'الرجاء إدخال بريد إلكتروني صحيح');
      return;
    }
    
    if (password.length < 8) {
      Alert.alert('خطأ', 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    
    try {
      // Create the user with only email and password
      await signUp.create({
        emailAddress: emailAddress.trim(),
        password,
      });

      // Set user metadata including first and last name
      await signUp.update({
        unsafeMetadata: {
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          userType: userType || 'student',
        },
      });

      // Send verification email
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      
      setPendingVerification(true);
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('خطأ', err.errors?.[0]?.message || 'فشل التسجيل. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded || isLoading) return;
    
    if (!code.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال رمز التحقق');
      return;
    }

    setIsLoading(true);
    
    try {
      const completeSignUp = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (completeSignUp.status === 'complete') {
        await setActive({ session: completeSignUp.createdSessionId });
        router.replace('/(home)');
      } else {
        console.error(JSON.stringify(completeSignUp, null, 2));
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('خطأ', err.errors?.[0]?.message || 'فشل التحقق. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = firstName.trim() !== '' && 
                     lastName.trim() !== '' && 
                     emailAddress.trim() !== '' && 
                     password.trim() !== '' &&
                     password.length >= 8;
  
  const isCodeValid = code.trim() !== '';
  
  const passwordStrength = getPasswordStrength(password);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>
                {pendingVerification ? 'تحقق من بريدك الإلكتروني' : `إنشاء حساب ${userType === 'student' ? 'طالب' : 'معلم'}`}
              </Text>
              <Text style={styles.subtitle}>
                {pendingVerification 
                  ? `أدخل الرمز المرسل إلى ${emailAddress}` 
                  : 'سجّل للبدء'
                }
              </Text>
            </View>

            {pendingVerification ? (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <MaterialIcons 
                    name="email" 
                    size={20} 
                    color={COLORS.gray600} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="رمز التحقق"
                    placeholderTextColor={COLORS.gray600}
                    keyboardType="number-pad"
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="none"
                    accessibilityLabel="رمز التحقق"
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!isCodeValid || isLoading) && styles.buttonDisabled
                  ]}
                  onPress={onVerifyPress}
                  disabled={!isCodeValid || isLoading}
                  accessibilityLabel="تحقق من البريد الإلكتروني"
                  accessibilityRole="button"
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>تحقق من البريد الإلكتروني</Text>
                  )}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.nameContainer}>
                  <View style={[styles.inputContainer, styles.nameInput]}>
                    <Ionicons 
                      name="person-outline" 
                      size={20} 
                      color={COLORS.gray600} 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="الاسم الأول"
                      placeholderTextColor={COLORS.gray600}
                      value={firstName}
                      onChangeText={setFirstName}
                      autoCapitalize="words"
                      accessibilityLabel="الاسم الأول"
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.nameInput]}>
                    <Ionicons 
                      name="people-outline" 
                      size={20} 
                      color={COLORS.gray600} 
                      style={styles.inputIcon} 
                    />
                    <TextInput
                      style={styles.input}
                      placeholder="اسم العائلة"
                      placeholderTextColor={COLORS.gray600}
                      value={lastName}
                      onChangeText={setLastName}
                      autoCapitalize="words"
                      accessibilityLabel="اسم العائلة"
                    />
                  </View>
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons 
                    name="email" 
                    size={20} 
                    color={COLORS.gray600} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="البريد الإلكتروني"
                    placeholderTextColor={COLORS.gray600}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    value={emailAddress}
                    onChangeText={setEmailAddress}
                    accessibilityLabel="البريد الإلكتروني"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <MaterialIcons 
                    name="lock" 
                    size={20} 
                    color={COLORS.gray600} 
                    style={styles.inputIcon} 
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="كلمة المرور (8 أحرف على الأقل)"
                    placeholderTextColor={COLORS.gray600}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                    accessibilityLabel="كلمة المرور"
                  />
                </View>

                {password.length > 0 && (
                  <View style={styles.passwordStrengthContainer}>
                    <View style={styles.strengthBarContainer}>
                      {[1, 2, 3, 4].map((i) => (
                        <View
                          key={i}
                          style={[
                            styles.strengthBar,
                            i <= passwordStrength.strength && {
                              backgroundColor: STRENGTH_BAR_COLORS[i as keyof typeof STRENGTH_BAR_COLORS]
                            },
                          ]}
                        />
                      ))}
                    </View>
                    <Text style={styles.strengthText}>{passwordStrength.label}</Text>
                  </View>
                )}

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!isFormValid || isLoading) && styles.buttonDisabled
                  ]}
                  onPress={onSignUpPress}
                  disabled={!isFormValid || isLoading}
                  accessibilityLabel="إنشاء حساب"
                  accessibilityRole="button"
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>إنشاء حساب</Text>
                  )}
                </TouchableOpacity>

                <View style={styles.divider}>
                  <View style={styles.dividerLine} />
                  <Text style={styles.dividerText}>أو متابعة باستخدام</Text>
                  <View style={styles.dividerLine} />
                </View>

                {/* Social Sign-in Buttons */}
                <View style={styles.socialButtonsContainer}>
                  <TouchableOpacity
                    style={[styles.socialButton, styles.googleButton]}
                    onPress={onGoogleSignInPress}
                    disabled={!!oauthLoading}
                    accessibilityLabel="سجل باستخدام Google"
                    accessibilityRole="button"
                  >
                    {oauthLoading === 'google' ? (
                      <ActivityIndicator size="small" color="#000" />
                    ) : (
                      <>
                        <AntDesign name="google" size={20} color="#000" />
                        <Text style={[styles.socialButtonText, { color: '#000' }]}>
                          Google
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.socialButton, styles.appleButton]}
                    onPress={onAppleSignInPress}
                    disabled={!!oauthLoading}
                    accessibilityLabel="سجل باستخدام Apple"
                    accessibilityRole="button"
                  >
                    {oauthLoading === 'apple' ? (
                      <ActivityIndicator size="small" color={COLORS.black} />
                    ) : (
                      <>
                        <AntDesign name="apple1" size={20} color={COLORS.black} />
                        <Text style={[styles.socialButtonText, { color: COLORS.black }]}>
                          Apple
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>

                <View style={styles.footer}>
                  <Text style={styles.footerText}>
                    لديك حساب بالفعل؟{' '}
                    <Text 
                      style={styles.footerLink}
                      onPress={() => router.push('/auth/sign-in')}
                      accessibilityLabel="تسجيل الدخول"
                      accessibilityRole="link"
                    >
                      تسجيل الدخول
                    </Text>
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignSelf: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    fontFamily: "Cairo_Bold",
  },
  title: {
    fontSize: 28,
    fontFamily: "Cairo_Bold",
    color: COLORS.black,
    marginBottom: 8,
    textAlign: 'center',
   },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: "Cairo_Medium",
  },
  form: {
    gap: 20,
  },
  nameContainer: {
    flexDirection: 'row-reverse',
    gap: 12,
    fontFamily: "Cairo_Medium",
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  nameInput: {
    flex: 1,
    fontFamily: "Cairo_Medium",
  },
  inputIcon: {
    marginLeft: 12,
    fontFamily: "Cairo_Medium",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    height: '100%',
    textAlign: 'right',
    fontFamily: "Cairo_Medium",
  },
  primaryButton: {
    backgroundColor: COLORS.primary,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonDisabled: {
    backgroundColor: COLORS.gray300,
    shadowOpacity: 0,
    elevation: 0,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 17,
    fontFamily: "Cairo_Bold",
  },
  divider: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.gray200,
  },
  dividerText: {
    marginHorizontal: 16,
    color: COLORS.gray600,
    fontSize: 14,
    fontFamily: "Cairo_Medium",
   
    },
  socialButtonsContainer: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    gap: 8,
  },
  googleButton: {
    backgroundColor: COLORS.white,
  },
  appleButton: {
    backgroundColor: COLORS.white,
  },
  socialButtonText: {
    fontSize: 16,
      fontFamily: "Cairo_Medium",
  },
  footer: {
    marginTop: 16,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.gray600,
    fontSize: 15,
    fontFamily: "Cairo_Medium",
   },
  footerLink: {
    color: COLORS.primary,
    fontFamily: "Cairo_Medium", 
   },
  passwordStrengthContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: -10,
  },
  strengthBarContainer: {
    flexDirection: 'row-reverse',
    gap: 4,
    flex: 1,
  },
  strengthBar: {
    height: 4,
    flex: 1,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    color: COLORS.gray600,
    marginRight: 8,
  },
});

export default SignUpScreen;