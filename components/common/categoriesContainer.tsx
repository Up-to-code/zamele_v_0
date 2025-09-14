import React from 'react';
import { StyleSheet, View, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { Text } from 'react-native';
import { router } from 'expo-router';

// Color constants
const colors = {
    primary: "#1B6CB9",
    secondary: "#1B6CB9",
    tertiary: "#434343",
    background: "#E8F5FF",
}

const CategoriesContainer = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.sectionTitle}>فئات الفعاليات</Text>
            <ScrollView 
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.scrollContainer}
                // Enable RTL behavior
                style={{direction: 'rtl'}}
            >
                <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/(home)/groups')}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="school" size={24} color={colors.primary} />
                    </View>
                    <Text style={styles.categoryText}>أكاديمي</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.categoryItem} onPress={() => router.push('/(screens)/EventsScreen')}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="people" size={24} color={colors.primary} />
                    </View>
                    <Text style={styles.categoryText}>طلابي</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.categoryItem}>
                    <View style={styles.categoryIcon}>
                        <MaterialIcons name="sports-basketball" size={24} color={colors.primary} />
                    </View>
                    <Text style={styles.categoryText}>رياضي</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.categoryItem}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="musical-notes" size={24} color={colors.primary} />
                    </View>
                    <Text style={styles.categoryText}>فني</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.categoryItem}>
                    <View style={styles.categoryIcon}>
                        <FontAwesome5 name="handshake" size={20} color={colors.primary} />
                    </View>
                    <Text style={styles.categoryText}>ورش</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.categoryItem}>
                    <View style={styles.categoryIcon}>
                        <Ionicons name="business" size={24} color={colors.primary} />
                    </View>
                    <Text style={styles.categoryText}>مؤتمرات</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFF',
        padding: 16,
    },
    sectionTitle: {
        fontSize: 18,
         color: colors.tertiary,
        textAlign: 'right',
        marginBottom: 12,
        fontFamily: 'Cairo_Bold',
    },
    scrollContainer: {
        paddingHorizontal: 8,
        flexDirection: 'row-reverse', // Ensure RTL layout
    },
    categoryItem: {
        alignItems: 'center',
        marginHorizontal: 12,
        width: 70,
    },
    categoryIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
        backgroundColor: colors.background,
    },
    categoryText: {
        fontSize: 12,
        color: colors.tertiary,
        textAlign: 'center',
        fontFamily: 'Cairo_Medium',
    },
});

export default CategoriesContainer;