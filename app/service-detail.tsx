import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Clock, Star } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockServices, mockProfessionals } from '@/data/mockData';

export default function ServiceDetail() {
  const [activeTab, setActiveTab] = useState('Descrição');
  
  const service = mockServices[0]; // Featured service
  const provider = mockProfessionals.find(p => p.id === service.providerId);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header with service image */}
        <View style={styles.headerContainer}>
          <Image
            source={{ uri: service.image }}
            style={styles.serviceImage}
          />
          <View style={styles.headerOverlay}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <ArrowLeft size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{service.category}</Text>
          </View>
        </View>

        {/* Service Info */}
        <View style={styles.serviceSection}>
          <Text style={styles.serviceName}>{service.name}</Text>
          <Text style={styles.serviceDuration}>Tempo: {service.duration}</Text>
          <Text style={styles.servicePrice}>Preço: R$ {service.price}</Text>
          <Text style={styles.serviceProvider}>Prestador: {provider?.name}</Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.ratingLabel}>Avaliações: </Text>
            <Star size={16} color="#F59E0B" fill="#F59E0B" />
            <Text style={styles.ratingText}>{service.rating} ({service.reviews} avaliações)</Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Descrição' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Descrição')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Descrição' && styles.activeTabText,
              ]}
            >
              Descrição
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === 'Avaliações' && styles.activeTab,
            ]}
            onPress={() => setActiveTab('Avaliações')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'Avaliações' && styles.activeTabText,
              ]}
            >
              Avaliações
            </Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeTab === 'Descrição' && (
          <View style={styles.descriptionSection}>
            <Text style={styles.description}>{service.description}</Text>
          </View>
        )}

        {activeTab === 'Avaliações' && (
          <View style={styles.reviewsSection}>
            <View style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <Image
                  source={{ uri: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=50&h=50&dpr=2' }}
                  style={styles.reviewAvatar}
                />
                <View style={styles.reviewInfo}>
                  <Text style={styles.reviewerName}>João Silva</Text>
                  <View style={styles.reviewRating}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} size={12} color="#F59E0B" fill="#F59E0B" />
                    ))}
                  </View>
                </View>
              </View>
              <Text style={styles.reviewText}>
                Excelente serviço! Muito profissional e pontual. Recomendo!
              </Text>
            </View>
          </View>
        )}

        {/* Related Services */}
        <View style={styles.relatedSection}>
          <Text style={styles.sectionTitle}>Outros serviços do prestador</Text>
          {mockServices.filter(s => s.providerId === service.providerId && s.id !== service.id).map((relatedService) => (
            <TouchableOpacity key={relatedService.id} style={styles.relatedServiceCard}>
              <Image
                source={{ uri: relatedService.image }}
                style={styles.relatedServiceImage}
              />
              <View style={styles.relatedServiceInfo}>
                <Text style={styles.relatedServiceName}>{relatedService.name}</Text>
                <Text style={styles.relatedServicePrice}>R$ {relatedService.price}</Text>
                <Text style={styles.relatedServiceDuration}>{relatedService.duration}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Book Button */}
      <View style={styles.bookingSection}>
        <TouchableOpacity
          style={styles.bookButton}
          onPress={() => router.push('/booking-calendar')}
        >
          <Text style={styles.bookButtonText}>Agendar Serviço</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    height: 250,
    position: 'relative',
  },
  serviceImage: {
    width: '100%',
    height: '100%',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryBadge: {
    position: 'absolute',
    top: 16,
    right: 24,
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  serviceSection: {
    padding: 24,
  },
  serviceName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  serviceDuration: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  serviceProvider: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  ratingText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginLeft: 4,
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingHorizontal: 24,
  },
  tab: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#10B981',
  },
  descriptionSection: {
    padding: 24,
  },
  description: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 24,
  },
  reviewsSection: {
    padding: 24,
  },
  reviewCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  reviewInfo: {
    flex: 1,
  },
  reviewerName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  reviewRating: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    lineHeight: 20,
  },
  relatedSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  relatedServiceCard: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  relatedServiceImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  relatedServiceInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  relatedServiceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  relatedServicePrice: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 2,
  },
  relatedServiceDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  bookingSection: {
    padding: 24,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  bookButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  bookButtonText: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});