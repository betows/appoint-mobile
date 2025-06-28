import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Image } from 'react-native';
import { useAuth } from '@/contexts/AuthContext';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// Placeholder for API calls
const API_BASE_URL = 'http://localhost:5000/api/v1';

const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/marketplace/categories`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

const fetchProviders = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/marketplace/providers?${query}`);
    const data = await response.json();
    return data.result;
  } catch (error) {
    console.error("Error fetching providers:", error);
    return [];
  }
};

const fetchServices = async (params = {}) => {
  try {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/marketplace/services?${query}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching services:", error);
    return [];
  }
};

export default function Home() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [providerResults, serviceResults, categoryResults] = await Promise.all([
        fetchProviders({ sortBy: "RATING", limit: 10 }),
        fetchServices({ limit: 10 }),
        fetchCategories(),
      ]);
      setProviders(providerResults);
      setServices(serviceResults);
      setCategories(categoryResults);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const providerResults = await fetchProviders({ search: searchQuery });
      const serviceResults = await fetchServices({ search: searchQuery });
      setProviders(providerResults);
      setServices(serviceResults);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryName) => {
    if (selectedCategory === categoryName) {
      setSelectedCategory(null);
      fetchData(); // Fetch all data if category is unselected
    } else {
      setSelectedCategory(categoryName);
      setLoading(true);
      try {
        const providerRes = await fetchProviders({ category: categoryName });
        const serviceRes = await fetchServices({ category: categoryName });
        setProviders(providerRes);
        setServices(serviceRes);
      } catch (error) {
        console.error("Error fetching data by category:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('../assets/images/logoWhite.png')} style={styles.logo} />
        <TouchableOpacity style={styles.notificationIcon}>
          <Ionicons name="notifications" size={24} color="white" />
          {/* Notification count can be added here */}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Procure por serviços ou profissionais..."
          placeholderTextColor="#6B7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onFocus={() => setIsSearching(true)}
          onBlur={() => {
            if (!searchQuery) setIsSearching(false);
          }}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchIcon} onPress={() => {
          if (isSearching && searchQuery) {
            setSearchQuery('');
            setIsSearching(false);
            fetchData(); // Reset search results
          } else if (!isSearching) {
            setIsSearching(true);
          }
        }}>
          <Ionicons name={isSearching && searchQuery ? "close-circle" : "search"} size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {isSearching && searchQuery ? (
          <View>
            <Text style={styles.sectionTitle}>Resultados da Busca</Text>
            {providers.length > 0 && (
              <View>
                <Text style={styles.subSectionTitle}>Profissionais</Text>
                {providers.map((provider) => (
                  <Link href={`/professional-detail?id=${provider.id}`} key={provider.id} style={styles.card}>
                    <Text>{provider.name}</Text>
                  </Link>
                ))}
              </View>
            )}
            {services.length > 0 && (
              <View>
                <Text style={styles.subSectionTitle}>Serviços</Text>
                {services.map((service) => (
                  <Link href={`/service-detail?id=${service.id}`} key={service.id} style={styles.card}>
                    <Text>{service.title}</Text>
                  </Link>
                ))}
              </View>
            )}
            {providers.length === 0 && services.length === 0 && (
              <Text style={styles.noResults}>Nenhum resultado encontrado.</Text>
            )}
          </View>
        ) : (
          <View>
            {/* Service Swiper - Placeholder for now, will integrate a proper swiper component */}
            <Text style={styles.sectionTitle}>Serviços em Destaque</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {services.map((service) => (
                <Link href={`/service-detail?id=${service.id}`} key={service.id} style={styles.serviceCard}>
                  <Image source={{ uri: service.image || 'https://via.placeholder.com/150' }} style={styles.serviceImage} />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.servicePrice}>R$ {service.price}</Text>
                    <Text style={styles.serviceRating}>Avaliação: {service.rating} ⭐</Text>
                  </View>
                </Link>
              ))}
            </ScrollView>

            {/* Categories */}
            <Text style={styles.sectionTitle}>Categorias</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {categories.map((category) => (
                <TouchableOpacity key={category.name} style={styles.categoryItem} onPress={() => handleCategorySelect(category.name)}>
                  <Image source={{ uri: category.icon || 'https://via.placeholder.com/50' }} style={[styles.categoryImage, selectedCategory === category.name && styles.selectedCategory]} />
                  <Text style={styles.categoryText}>{category.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Top Professionals */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Melhores profissionais</Text>
              <Link href="/providers" style={styles.viewMore}>Ver mais</Link>
            </View>
            {providers.map((provider) => (
              <Link href={`/professional-detail?id=${provider.id}`} key={provider.id} style={styles.providerCard}>
                <Image source={{ uri: provider.avatar || 'https://via.placeholder.com/50' }} style={styles.providerAvatar} />
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.name}</Text>
                  <Text style={styles.providerRating}>Avaliação: {provider.rating} ⭐</Text>
                </View>
              </Link>
            ))}

            {/* Trending Services */}
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Serviços em alta</Text>
              <Link href="/services" style={styles.viewMore}>Ver mais</Link>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
              {services.map((service) => (
                <Link href={`/service-detail?id=${service.id}`} key={service.id} style={styles.serviceCard}>
                  <Image source={{ uri: service.image || 'https://via.placeholder.com/150' }} style={styles.serviceImage} />
                  <View style={styles.serviceInfo}>
                    <Text style={styles.serviceTitle}>{service.title}</Text>
                    <Text style={styles.servicePrice}>R$ {service.price}</Text>
                    <Text style={styles.serviceRating}>Avaliação: {service.rating} ⭐</Text>
                  </View>
                </Link>
              ))}
            </ScrollView>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#10B981',
    padding: 16,
    paddingTop: 48,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  notificationIcon: {
    padding: 8,
  },
  searchContainer: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingBottom: 20,
    position: 'relative',
    zIndex: 1,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchIcon: {
    position: 'absolute',
    right: 30,
    top: 32,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
    marginTop: 16,
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  horizontalScroll: {
    marginBottom: 16,
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    overflow: 'hidden',
    marginRight: 12,
    width: 200, // Adjust as needed
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  serviceImage: {
    width: '100%',
    height: 100,
    resizeMode: 'cover',
  },
  serviceInfo: {
    padding: 10,
  },
  serviceTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  servicePrice: {
    fontSize: 14,
    color: '#4B5563',
  },
  serviceRating: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 15,
  },
  categoryImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginBottom: 5,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCategory: {
    borderColor: '#10B981',
  },
  categoryText: {
    fontSize: 12,
    color: '#374151',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    marginTop: 16,
  },
  viewMore: {
    color: '#10B981',
    fontWeight: '600',
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 12,
    marginBottom: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  providerRating: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
  },
});
