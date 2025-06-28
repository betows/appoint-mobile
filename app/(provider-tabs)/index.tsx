import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, CircleCheck as CheckCircle, X } from 'lucide-react-native';
import { mockUsers, mockAppointments } from '@/data/mockData';

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('Agendamentos');
  
  const provider = mockUsers.find(user => user.type === 'provider');
  const pendingAppointments = mockAppointments.filter(apt => apt.status === 'pending');
  const confirmedAppointments = mockAppointments.filter(apt => apt.status === 'confirmed');

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
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: provider?.avatar }}
                  style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.serviceName}>{provider?.name}</Text>
                  <Text style={styles.email}>{provider?.email}</Text>
                </View>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Editar</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>

      {/* Navigation Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.tab, styles.activeTab]}>
          <Text style={[styles.tabText, styles.activeTabText]}>Agendamentos</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tab}>
          <Text style={styles.tabText}>Conversas</Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.contentContainer}>
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Pending Appointments */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Agendamentos Pendentes</Text>
              <TouchableOpacity>
                <Text style={styles.calendarLink}>Ver calendário</Text>
              </TouchableOpacity>
            </View>

            {pendingAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentIndicator} />
                <View style={styles.appointmentContent}>
                  <Text style={styles.appointmentService}>{appointment.service}</Text>
                  <Text style={styles.appointmentClient}>Cliente: {appointment.client}</Text>
                  <Text style={styles.appointmentDateTime}>
                    Data: {appointment.date}, {appointment.time}
                  </Text>
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity style={styles.confirmButton}>
                      <CheckCircle size={16} color="#FFFFFF" />
                      <Text style={styles.confirmButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton}>
                      <X size={16} color="#FFFFFF" />
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Confirmed Appointments */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Agendamentos Confirmados</Text>
            
            {confirmedAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={[styles.appointmentIndicator, styles.confirmedIndicator]} />
                <View style={styles.appointmentContent}>
                  <Text style={styles.appointmentService}>{appointment.service}</Text>
                  <Text style={styles.appointmentClient}>Cliente: {appointment.client}</Text>
                  <Text style={styles.appointmentDateTime}>
                    Data: {appointment.date}, {appointment.time}
                  </Text>
                </View>
              </View>
            ))}
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
    paddingBottom: 24,
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
    alignItems: 'flex-start',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  profileInfo: {
    flex: 1,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  email: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
  },
  editButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  editButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  notificationButton: {
    padding: 4,
    marginLeft: 12,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#10B981',
  },
  tabText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#10B981',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  section: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  calendarLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  appointmentIndicator: {
    width: 4,
    backgroundColor: '#F59E0B',
  },
  confirmedIndicator: {
    backgroundColor: '#10B981',
  },
  appointmentContent: {
    flex: 1,
    padding: 16,
  },
  appointmentService: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  appointmentClient: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7C3AED',
    marginBottom: 2,
  },
  appointmentDateTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  confirmButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cancelButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  cancelButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});