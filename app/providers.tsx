import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Image } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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

export default function ProvidersScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [categoryResults, providerResults] = await Promise.all([
        fetchCategories(),
        fetchProviders({}),
      ]);
      setCategories(categoryResults);
      setProviders(providerResults);
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const query: { [key: string]: any } = {};
      if (searchQuery.trim()) {
        query.search = searchQuery.trim();
      }
      if (selectedCategory) {
        query.category = selectedCategory;
      }
      const providerResults = await fetchProviders(query);
      setProviders(providerResults);
    } catch (error) {
      console.error("Error during search:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = async (categoryName: string) => {
    const newSelectedCategory = selectedCategory === categoryName ? null : categoryName;
    setSelectedCategory(newSelectedCategory);
    setSearchQuery(''); // Clear search query when category changes

    setLoading(true);
    try {
      const query: { [key: string]: any } = {};
      if (newSelectedCategory) {
        query.category = newSelectedCategory;
      }
      const providerResults = await fetchProviders(query);
      setProviders(providerResults);
    } catch (error) {
      console.error("Error fetching providers by category:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="white" />
        </TouchableOpacity>
        <Image source={require('../assets/images/logoWhite.png')} style={styles.logo} />
        <View style={styles.placeholder} />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Procure por profissionais..."
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
            fetchInitialData(); // Reset search results
          } else if (!isSearching) {
            setIsSearching(true);
          }
        }}>
          <Ionicons name={isSearching && searchQuery ? "close-circle" : "search"} size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.categorySection}>
          <Text style={styles.sectionTitle}>Categorias</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {categories.map((category: any) => (
              <TouchableOpacity key={category.name} style={styles.categoryItem} onPress={() => handleCategorySelect(category.name)}>
                <Image source={{ uri: category.icon || 'https://via.placeholder.com/50' }} style={[styles.categoryImage, selectedCategory === category.name && styles.selectedCategory]} />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.providerList}>
          {loading ? (
            <ActivityIndicator size="large" color="#2563EB" />
          ) : providers.length > 0 ? (
            providers.map((provider: any) => (
              <Link href={`/professional-detail?id=${provider.id}`} key={provider.id} style={styles.providerCard}>
                <Image source={{ uri: provider.avatar || 'https://via.placeholder.com/50' }} style={styles.providerAvatar} />
                <View style={styles.providerInfo}>
                  <Text style={styles.providerName}>{provider.legalName}</Text>
                  <Text style={styles.providerRating}>Avaliação: {provider.rating?.toFixed(1)} ⭐</Text>
                  <Text style={styles.providerServicesCount}>{provider.servicesCount} serviços</Text>
                  <View style={styles.providerCategories}>
                    {provider.categories?.map((cat: string) => (
                      <Text key={cat} style={styles.providerCategoryText}>{cat || 'Serviços Gerais'}</Text>
                    ))}
                  </View>
                </View>
              </Link>
            ))
          ) : (
            <Text style={styles.noResultsText}>Nenhum prestador encontrado.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
  backButton: {
    padding: 8,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  placeholder: {
    width: 40,
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
  categorySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 12,
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
  providerList: {
    marginTop: 10,
  },
  providerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  providerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  providerRating: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
  },
  providerServicesCount: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  providerCategories: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 4,
  },
  providerCategoryText: {
    fontSize: 12,
    color: '#10B981',
    marginRight: 8,
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#6B7280',
  },
});
