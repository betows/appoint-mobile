import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Star, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockProfessionals } from '@/data/mockData';

export default function Professionals() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profissionais</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {mockProfessionals.map((professional) => (
          <TouchableOpacity
            key={professional.id}
            style={styles.professionalCard}
            onPress={() => router.push('/professional-detail')}
          >
            <Image
              source={{ uri: professional.avatar }}
              style={styles.professionalAvatar}
            />
            <View style={styles.professionalInfo}>
              <Text style={styles.professionalName}>{professional.name}</Text>
              <View style={styles.professionalRating}>
                <Star size={14} color="#F59E0B" fill="#F59E0B" />
                <Text style={styles.professionalRatingText}>
                  {professional.rating} • {professional.services} serviços
                </Text>
              </View>
              <Text style={styles.professionalCategory}>{professional.category}</Text>
              <Text style={styles.professionalAddress}>{professional.address}</Text>
            </View>
            <View style={styles.professionalActions}>
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  content: {
    flex: 1,
    padding: 24,
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },
  professionalAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 16,
  },
  professionalInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  professionalRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  professionalRatingText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  professionalCategory: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#10B981',
    marginBottom: 2,
  },
  professionalAddress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  professionalActions: {
    marginLeft: 12,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
});