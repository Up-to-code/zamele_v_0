import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  StyleSheet, 
  Linking,
  SafeAreaView,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/config/constants/colors';
  

const PoliciesScreen = ({ navigation }: any) => {
  const [activeSection, setActiveSection] = useState('terms');

  const renderContent = () => {
    switch(activeSection) {
      case 'terms':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.paragraph}>
              مرحبًا بك في منصتنا التعليمية. من خلال استخدامك لهذه المنصة، فإنك توافق على الالتزام بالشروط والأحكام التالية.
            </Text>
            
            <Text style={styles.subTitle}>1. قبول الشروط</Text>
            <Text style={styles.paragraph}>
              باستخدامك لهذه المنصة، فإنك تقر بأنك قد قرأت وفهمت ووافقت على الالتزام بهذه الشروط والأحكام.
            </Text>
            
            <Text style={styles.subTitle}>2. حساب المستخدم</Text>
            <Text style={styles.paragraph}>
              - يجب أن تكون 13 عامًا على الأقل لإنشاء حساب{"\n"}
              - أنت مسؤول عن الحفاظ على سرية حسابك وكلمة المرور{"\n"}
              - توافق على تقديم معلومات دقيقة وحديثة{"\n"}
              - تحتفظ المنصة بالحق في تعليق أو إنهاء الحساب في حالة انتهاك الشروط
            </Text>
            
            <Text style={styles.subTitle}>3. المحتوى والسلوك</Text>
            <Text style={styles.paragraph}>
              - لا تنشر محتوى غير قانوني أو ضار أو عنيف أو تحريضي{"\n"}
              - احترم حقوق الملكية الفكرية للآخرين{"\n"}
              - لا تنشر محتوى دعائي أو غير مرغوب فيه{"\n"}
              - حافظ على بيئة تعليمية محترمة للجميع
            </Text>
            
            <Text style={styles.subTitle}>4. الملكية الفكرية</Text>
            <Text style={styles.paragraph}>
              جميع المحتويات التعليمية مقدمة حصريًا للاستخدام الشخصي. لا يسمح بإعادة توزيع أو نسخ أو تعديل المحتوى دون إذن صريح.
            </Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>آخر تحديث:</Text> ١ يناير ٢٠٢٤
            </Text>
          </View>
        );
      
      case 'privacy':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.paragraph}>
              نحن نحرص على حماية خصوصيتك. توضح سياسة الخصوصية هذه كيفية جمعنا واستخدامنا ومشاركتنا لمعلوماتك.
            </Text>
            
            <Text style={styles.subTitle}>1. المعلومات التي نجمعها</Text>
            <Text style={styles.paragraph}>
              - المعلومات التي تقدمها عند إنشاء الحساب{"\n"}
              - معلومات الاستخدام وتفاعلاتك مع المنصة{"\n"}
              - معلومات الجهاز والاتصال{"\n"}
              - ملفات تعريف الارتباط والتقنيات المشابهة
            </Text>
            
            <Text style={styles.subTitle}>2. كيفية استخدامنا للمعلومات</Text>
            <Text style={styles.paragraph}>
              - توفير وتحسين خدماتنا{"\n"}
              - تخصيص تجربتك التعليمية{"\n"}
              - التواصل معك حول التحديثات والعروض{"\n"}
              - تحليل استخدام المنصة وأدائها
            </Text>
            
            <Text style={styles.subTitle}>3. مشاركة المعلومات</Text>
            <Text style={styles.paragraph}>
              نحن لا نبيع معلوماتك الشخصية. قد نشارك معلومات مع:
              - مقدمي الخدمات الذين يعملون نيابة عنا{"\n"}
              - السلطات القانونية عند الاقتضاء{"\n"}
              - في حال اندماج أو استحواذ على الشركة
            </Text>
            
            <Text style={styles.subTitle}>4. أمان المعلومات</Text>
            <Text style={styles.paragraph}>
              نستخدم إجراءات أمان تقنية وإدارية معقولة لحماية معلوماتك من الوصول غير المصرح به أو الاستخدام أو الكشف.
            </Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>آخر تحديث:</Text> ١ يناير ٢٠٢٤
            </Text>
          </View>
        );
      
      case 'community':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.paragraph}>
              إرشادات المجتمع تساعدنا في الحفاظ على بيئة تعليمية إيجابية وآمنة للجميع. نطلب من جميع الأعضاء الالتزام بهذه الإرشادات.
            </Text>
            
            <Text style={styles.subTitle}>1. الاحترام المتبادل</Text>
            <Text style={styles.paragraph}>
              - عامل الآخرين باحترام وتقدير{"\n"}
              - لا تستخدم لغة مسيئة أو تحريضية{"\n"}
              - تقبل الاختلافات في الرأي والخلفيات{"\n"}
              - قدم نقدًا بناءً بدلاً من الهجوم الشخصي
            </Text>
            
            <Text style={styles.subTitle}>2. المحتوى المناسب</Text>
            <Text style={styles.paragraph}>
              - شارك محتوى تعليمي ذو صلة{"\n"}
              - تجنب المحتوى غير القانوني أو غير الأخلاقي{"\n"}
              - لا تنشر معلومات مضللة أو خاطئة{"\n"}
              - احترم حقوق النشر والملكية الفكرية
            </Text>
            
            <Text style={styles.subTitle}>3. التفاعلات الإيجابية</Text>
            <Text style={styles.paragraph}>
              - شجع الآخرين على التعلم والنمو{"\n"}
              - شارك معرفتك وخبراتك بشكل بنّاء{"\n"}
              - قدم المساعدة عندما تستطيع{"\n"}
              - احتفل بإنجازات الآخرين وتقدمهم
            </Text>
            
            <Text style={styles.subTitle}>4. الإبلاغ عن الانتهاكات</Text>
            <Text style={styles.paragraph}>
              إذا لاحظت أي انتهاك لهذه الإرشادات، يرجى الإبلاغ عنه باستخدام أدوات الإبلاغ المتاحة في المنصة.
            </Text>
            
            <Text style={styles.paragraph}>
              <Text style={styles.bold}>آخر تحديث:</Text> ١ يناير ٢٠٢٤
            </Text>
          </View>
        );
      
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    switch(activeSection) {
      case 'terms': return 'شروط الخدمة';
      case 'privacy': return 'سياسة الخصوصية';
      case 'community': return 'إرشادات المجتمع';
      default: return '';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.white} />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={colors.darkGray} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>السياسات والشروط</Text>
        <View style={styles.headerRight} />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'terms' && styles.activeTab]}
          onPress={() => setActiveSection('terms')}
        >
          <Text style={[styles.tabText, activeSection === 'terms' && styles.activeTabText]}>
            الشروط
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'privacy' && styles.activeTab]}
          onPress={() => setActiveSection('privacy')}
        >
          <Text style={[styles.tabText, activeSection === 'privacy' && styles.activeTabText]}>
            الخصوصية
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.tab, activeSection === 'community' && styles.activeTab]}
          onPress={() => setActiveSection('community')}
        >
          <Text style={[styles.tabText, activeSection === 'community' && styles.activeTabText]}>
            المجتمع
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>{getSectionTitle()}</Text>
        
        {renderContent()}
        
        <View style={styles.contactSection}>
          <Text style={styles.contactTitle}>هل لديك استفسارات؟</Text>
          <Text style={styles.contactText}>
            إذا كان لديك أي أسئلة حول سياساتنا، لا تتردد في التواصل معنا.
          </Text>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL('mailto:support@eduplatform.com')}
          >
            <Ionicons name="mail" size={18} color={colors.white} />
            <Text style={styles.contactButtonText}>اتصل بنا</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Cairo_Bold',
    color: colors.darkGray,
  },
  headerRight: {
    width: 32,
  },
  tabContainer: {
    flexDirection: 'row-reverse',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
  },
  activeTabText: {
    color: colors.primary,
    fontFamily: 'Cairo_Bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Cairo_Bold',
    color: colors.darkGray,
    marginBottom: 16,
    textAlign: 'right',
  },
  sectionContent: {
    marginBottom: 24,
  },
  subTitle: {
    fontSize: 16,
    fontFamily: 'Cairo_Bold',
    color: colors.darkGray,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'right',
  },
  paragraph: {
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    lineHeight: 22,
    marginBottom: 12,
    textAlign: 'right',
  },
  bold: {
    fontFamily: 'Cairo_Bold',
    color: colors.darkGray,
  },
  contactSection: {
    backgroundColor: colors.lightGray,
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
  },
  contactTitle: {
    fontSize: 18,
    fontFamily: 'Cairo_Bold',
    color: colors.darkGray,
    marginBottom: 8,
    textAlign: 'right',
  },
  contactText: {
    fontSize: 14,
    fontFamily: 'Cairo_Medium',
    color: colors.gray,
    marginBottom: 16,
    lineHeight: 20,
    textAlign: 'right',
  },
  contactButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  contactButtonText: {
    fontSize: 14,
    fontFamily: 'Cairo_Bold',
    color: colors.white,
    marginRight: 8,
  },
});

export default PoliciesScreen;