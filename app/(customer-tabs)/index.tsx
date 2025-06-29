import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Search, Bell, Star, ChevronRight } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockServices, mockProfessionals, categories } from '@/data/mockData';

export default function CustomerHome() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get top 6 services based on rating, price, and bookings
  const topServices = mockServices
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 6);

  // Get services by lowest price in selected category
  const lowPriceServices = selectedCategory 
    ? mockServices.filter(s => s.category === selectedCategory).sort((a, b) => a.price - b.price)
    : mockServices.sort((a, b) => a.price - b.price);

  // Get top 4 professionals
  const topProfessionals = selectedCategory
    ? mockProfessionals.filter(p => p.category === selectedCategory).slice(0, 4)
    : mockProfessionals.slice(0, 4);

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push({
        pathname: '/(customer-tabs)/professionals',
        params: { search: searchQuery }
      });
    }
  };

  const renderServiceCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.serviceSliderCard}
      onPress={() => router.push({
        pathname: '/service-detail',
        params: { serviceId: item.id }
      })}
    >
      <Image source={{ uri: item.image }} style={styles.serviceSliderImage} />
      <View style={styles.serviceSliderInfo}>
        <Text style={styles.serviceSliderName} numberOfLines={2}>{item.name}</Text>
        <Text style={styles.serviceSliderPrice}>R$ {item.price}</Text>
        <View style={styles.serviceSliderRating}>
          <Star size={12} color="#F59E0B" fill="#F59E0B" />
          <Text style={styles.serviceSliderRatingText}>{item.rating}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <View style={styles.headerTop}>
              <Text style={styles.appName}>Appoint</Text>
              <TouchableOpacity 
                style={styles.notificationButton}
                onPress={() => {
                  // Navigate to notifications
                  console.log('Navigate to notifications');
                }}
              >
                <Bell size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            
            {/* Search Bar */}
            <View style={styles.searchContainer}>
              <View style={styles.searchBar}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Procure por serviços ou profissionais..."
                  placeholderTextColor="#9CA3AF"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  onSubmitEditing={handleSearch}
                />
                <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
                  <Search size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <SafeAreaView edges={['bottom']} style={styles.contentContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top Services Slider */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Principais Serviços</Text>
              <Text style={styles.sectionSubtitle}>Melhor avaliação • Melhor preço • Mais contratações</Text>
            </View>
            <FlatList
              data={topServices}
              renderItem={renderServiceCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sliderContainer}
            />
          </View>

          {/* Categories */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Categorias</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.categoriesContainer}>
                <TouchableOpacity
                  style={[
                    styles.categoryCard,
                    !selectedCategory && styles.categoryCardActive
                  ]}
                  onPress={() => setSelectedCategory(null)}
                >
                  <Text style={styles.categoryIcon}>🏠</Text>
                  <Text style={[
                    styles.categoryName,
                    !selectedCategory && styles.categoryNameActive
                  ]}>Todos</Text>
                </TouchableOpacity>
                {categories.map((category) => (
                  <TouchableOpacity
                    key={category.id}
                    style={[
                      styles.categoryCard,
                      selectedCategory === category.name && styles.categoryCardActive
                    ]}
                    onPress={() => setSelectedCategory(category.name)}
                  >
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                    <Text style={[
                      styles.categoryName,
                      selectedCategory === category.name && styles.categoryNameActive
                    ]}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Best Professionals */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory ? `Melhores ${selectedCategory}s` : 'Melhores Profissionais'}
              </Text>
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={() => router.push('/(customer-tabs)/professionals')}
              >
                <Text style={styles.seeMore}>Ver mais</Text>
                <ChevronRight size={16} color="#10B981" />
              </TouchableOpacity>
            </View>
            
            {topProfessionals.map((professional) => (
              <TouchableOpacity
                key={professional.id}
                style={styles.professionalCard}
                onPress={() => router.push({
                  pathname: '/professional-detail',
                  params: { professionalId: professional.id }
                })}
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
                <View style={styles.professionalBadge}>
                  <Text style={styles.professionalBadgeText}>Verificado</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Low Price Services Slider */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {selectedCategory ? `${selectedCategory} - Menor Preço` : 'Serviços - Menor Preço'}
              </Text>
              <TouchableOpacity 
                style={styles.seeMoreButton}
                onPress={() => router.push('/(customer-tabs)/professionals')}
              >
                <Text style={styles.seeMore}>Ver mais</Text>
                <ChevronRight size={16} color="#10B981" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={lowPriceServices.slice(0, 6)}
              renderItem={renderServiceCard}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.sliderContainer}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingBottom: 32,
  },
  headerSafeArea: {
    paddingHorizontal: 24,
  },
  headerContent: {
    marginTop: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  appName: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 4,
  },
  searchContainer: {
    marginTop: -8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  searchButton: {
    padding: 4,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
    flex: 1,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  seeMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeMore: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
  sliderContainer: {
    paddingLeft: 24,
    paddingRight: 8,
  },
  serviceSliderCard: {
    width: 160,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  serviceSliderImage: {
    width: '100%',
    height: 100,
  },
  serviceSliderInfo: {
    padding: 12,
  },
  serviceSliderName: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 6,
    height: 36,
  },
  serviceSliderPrice: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  serviceSliderRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  serviceSliderRatingText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  categoriesContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 16,
  },
  categoryCard: {
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: 'transparent',
    minWidth: 80,
  },
  categoryCardActive: {
    backgroundColor: '#F0FDF4',
    borderColor: '#10B981',
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    textAlign: 'center',
  },
  categoryNameActive: {
    color: '#10B981',
    fontFamily: 'Inter-SemiBold',
  },
  professionalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 24,
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
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginBottom: 2,
  },
  professionalAddress: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  professionalBadge: {
    backgroundColor: '#F0FDF4',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  professionalBadgeText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#10B981',
  },
});