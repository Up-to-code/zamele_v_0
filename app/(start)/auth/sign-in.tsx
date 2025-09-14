import { useOAuth, useSignIn } from '@clerk/clerk-expo';
import { AntDesign, FontAwesome, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
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

const SignInScreen = () => {
  const { isLoaded, signIn, setActive } = useSignIn();
  const router = useRouter();
  
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetCode, setResetCode] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // OAuth for Google
  const { startOAuthFlow: startGoogleOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  // OAuth for Apple
  const { startOAuthFlow: startAppleOAuthFlow } = useOAuth({ strategy: 'oauth_apple' });

  const onGooglePress = async () => {
    try {
      const { createdSessionId, setActive } = await startGoogleOAuthFlow();
      
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/(home)');
      }
    } catch (err) {
      console.error('OAuth error', err);
      Alert.alert('خطأ', 'فشل تسجيل الدخول باستخدام Google');
    }
  };

  const onApplePress = async () => {
    try {
      const { createdSessionId, setActive } = await startAppleOAuthFlow();
      
      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace('/(home)');
      }
    } catch (err) {
      console.error('OAuth error', err);
      Alert.alert('خطأ', 'فشل تسجيل الدخول باستخدام Apple');
    }
  };

  const onSignInPress = async () => {
    if (!isLoaded || isLoading) return;
    
    // Validate inputs
    if (!emailAddress.trim() || !password.trim()) {
      Alert.alert('خطأ', 'الرجاء تعبئة جميع الحقول');
      return;
    }

    setIsLoading(true);
    
    try {
      // Attempt to sign in
      const signInAttempt = await signIn.create({
        identifier: emailAddress.trim(),
        password,
      });

      if (signInAttempt.status === 'complete') {
        // Set the active session and redirect
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace('/(home)');
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
        Alert.alert('خطأ', 'فشل تسجيل الدخول. الرجاء المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('خطأ', err.errors?.[0]?.message || 'فشل تسجيل الدخول. الرجاء التحقق من بيانات الاعتماد الخاصة بك.');
    } finally {
      setIsLoading(false);
    }
  };

  // Forgot password flow moved to a dedicated screen

  const onResetPasswordPress = async () => {
    if (!isLoaded || isLoading) return;
    
    if (!resetCode.trim() || !newPassword.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال رمز إعادة التعيين وكلمة المرور الجديدة');
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert('خطأ', 'يجب أن تتكون كلمة المرور من 8 أحرف على الأقل');
      return;
    }

    setIsLoading(true);
    
    try {
      // Attempt to reset the password
      const result = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: resetCode,
        password: newPassword,
      });

      if (result.status === 'complete') {
        Alert.alert('تمت العملية', 'تم إعادة تعيين كلمة المرور بنجاح.');
        setResetPasswordMode(false);
        setResetCode('');
        setNewPassword('');
      } else {
        console.error(JSON.stringify(result, null, 2));
        Alert.alert('خطأ', 'فشل إعادة تعيين كلمة المرور. الرجاء المحاولة مرة أخرى.');
      }
    } catch (err: any) {
      console.error(JSON.stringify(err, null, 2));
      Alert.alert('خطأ', err.errors?.[0]?.message || 'فشل إعادة تعيين كلمة المرور. الرجاء المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = emailAddress.trim() !== '' && password.trim() !== '';
  const isResetFormValid = resetCode.trim() !== '' && newPassword.trim() !== '' && newPassword.length >= 8;

  if (resetPasswordMode) {
    return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.content}>
              <View style={styles.header}>
                <Text style={styles.title}>إعادة تعيين كلمة المرور</Text>
                <Text style={styles.subtitle}>
                  أدخل الرمز المرسل إلى {emailAddress} وكلمة المرور الجديدة
                </Text>
              </View>

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
                    placeholder="رمز إعادة التعيين"
                    placeholderTextColor={COLORS.gray600}
                    value={resetCode}
                    onChangeText={setResetCode}
                    autoCapitalize="none"
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
                    placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)"
                    placeholderTextColor={COLORS.gray600}
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                </View>

                <TouchableOpacity
                  style={[
                    styles.primaryButton,
                    (!isResetFormValid || isLoading) && styles.buttonDisabled
                  ]}
                  onPress={onResetPasswordPress}
                  disabled={!isResetFormValid || isLoading}
                >
                  {isLoading ? (
                    <ActivityIndicator color={COLORS.white} />
                  ) : (
                    <Text style={styles.buttonText}>إعادة تعيين كلمة المرور</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.backButton}
                  onPress={() => setResetPasswordMode(false)}
                >
                  <Text style={styles.backButtonText}>العودة إلى تسجيل الدخول</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>مرحبًا بعودتك</Text>
              <Text style={styles.subtitle}>
                سجل الدخول لمتابعة رحلة التعلم الخاصة بك
              </Text>
            </View>

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
                  placeholder="البريد الإلكتروني"
                  placeholderTextColor={COLORS.gray600}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={emailAddress}
                  onChangeText={setEmailAddress}
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
                  placeholder="كلمة المرور"
                  placeholderTextColor={COLORS.gray600}
                  secureTextEntry
                  value={password}
                  onChangeText={setPassword}
                />
              </View>

              <TouchableOpacity 
                style={styles.forgotPasswordButton}
                onPress={() => router.push('/(start)/auth/forgot-password' as any)}
              >
                <Text style={styles.forgotPasswordText}>نسيت كلمة المرور؟</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.primaryButton,
                  (!isFormValid || isLoading) && styles.buttonDisabled
                ]}
                onPress={onSignInPress}
                disabled={!isFormValid || isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator color={COLORS.white} />
                ) : (
                  <Text style={styles.buttonText}>تسجيل الدخول</Text>
                )}
              </TouchableOpacity>

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>أو متابعة باستخدام</Text>
                <View style={styles.dividerLine} />
              </View>

              <View style={styles.socialButtons}>
                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={[styles.socialButton, styles.appleButton]}
                    onPress={onApplePress}
                  >
                    <FontAwesome name="apple" size={20} color={COLORS.white} />
                    <Text style={[styles.socialButtonText, { color: COLORS.white }]}>
                      Apple
                    </Text>
                  </TouchableOpacity>
                )}
                
                <TouchableOpacity 
                  style={[styles.socialButton, styles.googleButton]}
                  onPress={onGooglePress}
                >
                  <AntDesign name="google" size={20} color={COLORS.gray800} />
                  <Text style={[styles.socialButtonText, { color: COLORS.gray800 }]}>
                    Google
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.footer}>
                <Text style={styles.footerText}>
                  ليس لديك حساب؟{' '}
                  <Text 
                    style={styles.footerLink}
                    onPress={() => router.push('/(start)/choiceScreen')}
                  >
                    سجل الآن
                  </Text>
                </Text>
              </View>
            </View>
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
  },
  title: {
    fontSize: 28,
    color: COLORS.black,
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: "Cairo_Bold",
  },
  subtitle: {
    fontSize: 16,
    color: COLORS.gray600,
    textAlign: 'center',
    lineHeight: 22,
    fontFamily: "Cairo_Bold",
    },
  form: {
    gap: 16,
  },
  inputContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 56,
  },
  inputIcon: {
    marginLeft: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: COLORS.black,
    height: '100%',
    textAlign: 'right',
    fontFamily: "Cairo_Medium",
  },
  forgotPasswordButton: {
    alignSelf: 'flex-start',
    marginTop: -8,
    marginBottom: 8,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    fontSize: 14,
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
  backButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  backButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontFamily: "Cairo_Medium",
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
  socialButtons: {
    flexDirection: 'row-reverse',
    justifyContent: 'center',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: COLORS.gray200,
  },
  appleButton: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  googleButton: {
    backgroundColor: COLORS.white,
  },
  socialButtonText: {
    fontSize: 16,
    fontFamily: "Cairo_Medium",
  },
  footer: {
    marginTop: 24,
    alignItems: 'center',
  },
  footerText: {
    color: COLORS.gray600,
    fontSize: 15,
    fontFamily: "Cairo_Medium",
  },
  footerLink: {
    color: COLORS.primary,
    fontFamily: "Cairo_Bold",
  },
});

export default SignInScreen;