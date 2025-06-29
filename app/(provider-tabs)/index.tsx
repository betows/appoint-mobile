import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, CircleCheck as CheckCircle, X, MessageCircle } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockUsers, mockAppointments, mockProviderChats } from '@/data/mockData';

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [appointments, setAppointments] = useState(mockAppointments);
  
  const provider = mockUsers.find(user => user.type === 'provider');
  const pendingAppointments = appointments.filter(apt => apt.status === 'pending');
  const confirmedAppointments = appointments.filter(apt => apt.status === 'confirmed');

  const handleConfirmAppointment = (appointmentId: string) => {
    Alert.alert(
      'Confirmar Agendamento',
      'Deseja confirmar este agendamento?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: () => {
            setAppointments(prev =>
              prev.map(apt =>
                apt.id === appointmentId
                  ? { ...apt, status: 'confirmed' as const }
                  : apt
              )
            );
            Alert.alert('Sucesso', 'Agendamento confirmado!');
          }
        }
      ]
    );
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Deseja cancelar este agendamento?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim',
          style: 'destructive',
          onPress: () => {
            setAppointments(prev =>
              prev.map(apt =>
                apt.id === appointmentId
                  ? { ...apt, status: 'cancelled' as const }
                  : apt
              )
            );
            Alert.alert('Agendamento Cancelado', 'O agendamento foi cancelado.');
          }
        }
      ]
    );
  };

  const handleChatPress = (chatId: string) => {
    router.push({
      pathname: '/chat-detail',
      params: { chatId }
    });
  };

  const renderDashboard = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Pending Appointments */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agendamentos Pendentes</Text>
          <TouchableOpacity onPress={() => router.push('/(provider-tabs)/calendar')}>
            <Text style={styles.calendarLink}>Ver calendário</Text>
          </TouchableOpacity>
        </View>

        {pendingAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum agendamento pendente</Text>
          </View>
        ) : (
          pendingAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View style={styles.appointmentIndicator} />
              <View style={styles.appointmentContent}>
                <Text style={styles.appointmentService}>{appointment.service}</Text>
                <Text style={styles.appointmentClient}>Cliente: {appointment.client}</Text>
                <Text style={styles.appointmentDateTime}>
                  Data: {appointment.date}, {appointment.time}
                </Text>
                <View style={styles.appointmentActions}>
                  <TouchableOpacity 
                    style={styles.confirmButton}
                    onPress={() => handleConfirmAppointment(appointment.id)}
                  >
                    <CheckCircle size={16} color="#FFFFFF" />
                    <Text style={styles.confirmButtonText}>Confirmar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancelAppointment(appointment.id)}
                  >
                    <X size={16} color="#FFFFFF" />
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
      </View>

      {/* Confirmed Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Agendamentos Confirmados</Text>
        
        {confirmedAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhum agendamento confirmado</Text>
          </View>
        ) : (
          confirmedAppointments.map((appointment) => (
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
          ))
        )}
      </View>

      {/* Quick Stats */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Estatísticas Rápidas</Text>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{pendingAppointments.length}</Text>
            <Text style={styles.statLabel}>Pendentes</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{confirmedAppointments.length}</Text>
            <Text style={styles.statLabel}>Confirmados</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Avaliação</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );

  const renderConversas = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Conversas Ativas</Text>
        
        {mockProviderChats.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyText}>Nenhuma conversa ativa</Text>
            <Text style={styles.emptySubtext}>
              Suas conversas com clientes aparecerão aqui
            </Text>
          </View>
        ) : (
          mockProviderChats.map((chat) => (
            <TouchableOpacity
              key={chat.id}
              style={styles.chatCard}
              onPress={() => handleChatPress(chat.id)}
            >
              <View style={styles.chatAvatar}>
                <Image
                  source={{ uri: chat.customer?.avatar }}
                  style={styles.avatarImage}
                />
                {chat.customer?.isOnline && <View style={styles.onlineIndicator} />}
              </View>
              
              <View style={styles.chatInfo}>
                <View style={styles.chatHeader}>
                  <Text style={styles.chatName}>{chat.customer?.name}</Text>
                  <Text style={styles.chatTime}>{chat.lastMessage.time}</Text>
                </View>
                
                <Text style={styles.chatService}>{chat.service}</Text>
                <Text style={styles.chatLastMessage} numberOfLines={1}>
                  {chat.lastMessage.text}
                </Text>
                
                {chat.bookingStatus && (
                  <View style={[
                    styles.statusBadge,
                    chat.bookingStatus === 'confirmed' && styles.confirmedBadge,
                    chat.bookingStatus === 'completed' && styles.completedBadge
                  ]}>
                    <Text style={[
                      styles.statusText,
                      chat.bookingStatus === 'confirmed' && styles.confirmedText,
                      chat.bookingStatus === 'completed' && styles.completedText
                    ]}>
                      {chat.bookingStatus === 'confirmed' ? 'Confirmado' : 'Concluído'}
                    </Text>
                  </View>
                )}
              </View>
              
              {chat.unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadText}>{chat.unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          ))
        )}
      </View>
    </ScrollView>
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
              <View style={styles.profileSection}>
                <Image
                  source={{ uri: provider?.avatar }}
                  style={styles.avatar}
                />
                <View style={styles.profileInfo}>
                  <Text style={styles.serviceName}>{provider?.name}</Text>
                  <Text style={styles.email}>{provider?.email}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => router.push('/edit-profile')}
                >
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
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Dashboard' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Dashboard')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Dashboard' && styles.activeTabText,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.tab,
            activeTab === 'Conversas' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Conversas')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Conversas' && styles.activeTabText,
            ]}
          >
            Conversas
          </Text>
        </TouchableOpacity>
      </View>

      <SafeAreaView edges={['bottom']} style={styles.contentContainer}>
        {activeTab === 'Dashboard' ? renderDashboard() : renderConversas()}
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
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
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
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  statNumber: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  chatCard: {
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
  chatAvatar: {
    position: 'relative',
    marginRight: 12,
  },
  avatarImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  chatInfo: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  chatTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
  },
  chatService: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginBottom: 4,
  },
  chatLastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
  },
  confirmedBadge: {
    backgroundColor: '#F0FDF4',
  },
  completedBadge: {
    backgroundColor: '#F0F9FF',
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  confirmedText: {
    color: '#10B981',
  },
  completedText: {
    color: '#0EA5E9',
  },
  unreadBadge: {
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});