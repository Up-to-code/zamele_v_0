import { useSignIn } from '@clerk/clerk-expo';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const COLORS = {
  primary: '#007AFF',
  white: '#FFFFFF',
  black: '#000000',
  gray100: '#F2F2F7',
  gray200: '#E5E5EA',
  gray300: '#D1D1D6',
  gray600: '#8E8E93',
};

export default function ForgotPasswordScreen() {
  const { isLoaded, signIn } = useSignIn();
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [stage, setStage] = useState<'request' | 'verify'>('request');

  const requestReset = async () => {
    if (!isLoaded) return;
    if (!email.trim()) {
      Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني');
      return;
    }
    setIsLoading(true);
    try {
      await signIn.create({
        strategy: 'reset_password_email_code',
        identifier: email.trim(),
      });
      setStage('verify');
      Alert.alert('تحقق من بريدك', 'تم إرسال رمز إعادة التعيين إلى بريدك.');
    } catch (err: any) {
      Alert.alert('خطأ', err.errors?.[0]?.message || 'تعذر إرسال رمز إعادة التعيين');
    } finally {
      setIsLoading(false);
    }
  };

  const verifyReset = async () => {
    if (!isLoaded) return;
    if (!code.trim() || !newPassword.trim()) {
      Alert.alert('خطأ', 'أدخل الرمز وكلمة المرور الجديدة');
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert('خطأ', 'كلمة المرور 8 أحرف على الأقل');
      return;
    }
    setIsLoading(true);
    try {
      const res = await signIn.attemptFirstFactor({
        strategy: 'reset_password_email_code',
        code: code.trim(),
        password: newPassword,
      });
      if (res.status === 'complete') {
        Alert.alert('تم', 'تم تغيير كلمة المرور، يمكنك تسجيل الدخول الآن', [
          { text: 'موافق', onPress: () => router.replace('/(start)/auth/sign-in') },
        ]);
      } else {
        Alert.alert('خطأ', 'فشل التحقق، حاول مجددًا');
      }
    } catch (err: any) {
      Alert.alert('خطأ', err.errors?.[0]?.message || 'فشل إعادة التعيين');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.content}>
            <View style={styles.header}>
              <Text style={styles.title}>{stage === 'request' ? 'إعادة تعيين كلمة المرور' : 'أدخل رمز التحقق'}</Text>
              <Text style={styles.subtitle}>
                {stage === 'request' ? 'أدخل بريدك الإلكتروني لإرسال رمز إعادة التعيين' : `أدخل الرمز المرسل إلى ${email}`}
              </Text>
            </View>

            {stage === 'request' ? (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="email" size={20} color={COLORS.gray600} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="البريد الإلكتروني"
                    placeholderTextColor={COLORS.gray600}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                  />
                </View>
                <TouchableOpacity style={[styles.primaryButton, (!email.trim() || isLoading) && styles.buttonDisabled]} onPress={requestReset} disabled={!email.trim() || isLoading}>
                  {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>إرسال الرمز</Text>}
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="vpn-key" size={20} color={COLORS.gray600} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="رمز التحقق"
                    placeholderTextColor={COLORS.gray600}
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="none"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <MaterialIcons name="lock" size={20} color={COLORS.gray600} style={styles.inputIcon} />
                  <TextInput
                    style={styles.input}
                    placeholder="كلمة المرور الجديدة (8 أحرف على الأقل)"
                    placeholderTextColor={COLORS.gray600}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    secureTextEntry
                  />
                </View>
                <TouchableOpacity style={[styles.primaryButton, (isLoading || !code.trim() || newPassword.length < 8) && styles.buttonDisabled]} onPress={verifyReset} disabled={isLoading || !code.trim() || newPassword.length < 8}>
                  {isLoading ? <ActivityIndicator color={COLORS.white} /> : <Text style={styles.buttonText}>تأكيد</Text>}
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Text style={styles.backButtonText}>رجوع</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  keyboardView: { flex: 1 },
  scrollContent: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  content: { width: '100%', maxWidth: 400, alignSelf: 'center' },
  header: { alignItems: 'center', marginBottom: 26, fontFamily: "Cairo_Bold" },
  title: { fontSize: 26, fontFamily: "Cairo_Bold", color: COLORS.black, marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: COLORS.gray600, textAlign: 'center', fontFamily: "Cairo_Medium" },
  form: { gap: 16 },
  inputContainer: { flexDirection: 'row-reverse', alignItems: 'center', backgroundColor: COLORS.gray100, borderRadius: 12, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginLeft: 12, fontFamily: "Cairo_Medium" },
  input: { flex: 1, fontSize: 16, color: COLORS.black, height: '100%', textAlign: 'right', fontFamily: "Cairo_Medium"        },
  primaryButton: { backgroundColor: COLORS.primary, height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  buttonDisabled: { backgroundColor: COLORS.gray300 },
  buttonText: { color: COLORS.white, fontSize: 17, fontFamily: "Cairo_Bold" },
  backButton: { alignItems: 'center', marginTop: 16 },
  backButtonText: { color: COLORS.primary, fontSize: 16, fontFamily: "Cairo_Medium" },
});


