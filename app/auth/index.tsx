import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Users, Wrench } from 'lucide-react-native';

export default function AuthWelcome() {
  const handleCustomerAccess = () => {
    router.replace('/(customer-tabs)');
  };

  const handleProviderAccess = () => {
    router.replace('/(provider-tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/4792509/pexels-photo-4792509.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2' }}
            style={styles.heroImage}
            resizeMode="cover"
          />
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>Appoint</Text>
            <Text style={styles.subtitle}>
              Conecte-se com prestadores de serviços confiáveis ou faça seu negócio crescer
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.customerButton]}
              onPress={handleCustomerAccess}
            >
              <Users size={24} color="#10B981" />
              <Text style={[styles.buttonText, styles.customerButtonText]}>
                Preciso de serviços
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.providerButton]}
              onPress={handleProviderAccess}
            >
              <Wrench size={24} color="#FFFFFF" />
              <Text style={[styles.buttonText, styles.providerButtonText]}>
                Ofereço serviços
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroImage: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 32,
    borderWidth: 4,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 48,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    gap: 12,
  },
  customerButton: {
    backgroundColor: '#FFFFFF',
  },
  providerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  buttonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  customerButtonText: {
    color: '#10B981',
  },
  providerButtonText: {
    color: '#FFFFFF',
  },
});