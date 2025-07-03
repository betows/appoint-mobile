import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Bell, TrendingUp, TrendingDown, DollarSign, Star, Users, Calendar, MessageCircle, Wrench, CircleCheck as CheckCircle, X, User, MapPin, Filter } from 'lucide-react-native';
import { router } from 'expo-router';
import { mockUsers, mockAppointments, mockProviderChats } from '@/data/mockData';

export default function ProviderDashboard() {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [appointments, setAppointments] = useState(mockAppointments);
  const [appointmentFilter, setAppointmentFilter] = useState('all');
  const provider = mockUsers.find(user => user.type === 'provider');
  
  // Dados simulados para dashboard
  const dashboardData = {
    monthlyRevenue: 3240,
    revenueGrowth: 12.5,
    totalBookings: 24,
    bookingsGrowth: 8.3,
    averageRating: 4.8,
    ratingGrowth: 2.1,
    completionRate: 96,
    completionGrowth: -1.2,
    pendingAppointments: mockAppointments.filter(apt => apt.status === 'pending').length,
    confirmedAppointments: mockAppointments.filter(apt => apt.status === 'confirmed').length,
    completedAppointments: mockAppointments.filter(apt => apt.status === 'completed').length,
    cancelledAppointments: mockAppointments.filter(apt => apt.status === 'cancelled').length,
  };

  const recentActivity = [
    { id: '1', type: 'booking', message: 'Novo agendamento de João Silva', time: '2h atrás', icon: Calendar },
    { id: '2', type: 'review', message: 'Nova avaliação 5 estrelas', time: '4h atrás', icon: Star },
    { id: '3', type: 'message', message: 'Nova mensagem de Maria Santos', time: '6h atrás', icon: MessageCircle },
    { id: '4', type: 'payment', message: 'Pagamento de R$ 150 recebido', time: '1d atrás', icon: DollarSign },
  ];

  const appointmentFilters = [
    { id: 'all', label: 'Todos', count: appointments.length },
    { id: 'pending', label: 'Pendentes', count: appointments.filter(apt => apt.status === 'pending').length },
    { id: 'confirmed', label: 'Confirmados', count: appointments.filter(apt => apt.status === 'confirmed').length },
    { id: 'completed', label: 'Concluídos', count: appointments.filter(apt => apt.status === 'completed').length },
  ];

  const filteredAppointments = appointmentFilter === 'all' 
    ? appointments 
    : appointments.filter(apt => apt.status === appointmentFilter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return '#F59E0B';
      case 'confirmed': return '#10B981';
      case 'completed': return '#059669';
      case 'cancelled': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendente';
      case 'confirmed': return 'Confirmado';
      case 'completed': return 'Concluído';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

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

  const handleCompleteAppointment = (appointmentId: string) => {
    Alert.alert(
      'Marcar como Concluído',
      'Deseja marcar este agendamento como concluído?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Concluir',
          onPress: () => {
            setAppointments(prev =>
              prev.map(apt =>
                apt.id === appointmentId
                  ? { ...apt, status: 'completed' as const }
                  : apt
              )
            );
            Alert.alert('Sucesso', 'Agendamento marcado como concluído!');
          }
        }
      ]
    );
  };

  const renderStatCard = (title: string, value: string | number, growth: number, icon: any, color: string) => {
    const IconComponent = icon;
    const isPositive = growth > 0;
    
    return (
      <View style={styles.statCard}>
        <View style={styles.statHeader}>
          <View style={[styles.statIcon, { backgroundColor: `${color}20` }]}>
            <IconComponent size={20} color={color} />
          </View>
          <View style={[styles.growthBadge, isPositive ? styles.positiveGrowth : styles.negativeGrowth]}>
            {isPositive ? <TrendingUp size={12} color="#10B981" /> : <TrendingDown size={12} color="#EF4444" />}
            <Text style={[styles.growthText, isPositive ? styles.positiveGrowthText : styles.negativeGrowthText]}>
              {Math.abs(growth)}%
            </Text>
          </View>
        </View>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statTitle}>{title}</Text>
      </View>
    );
  };

  const renderDashboard = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Stats Grid */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visão Geral</Text>
        <View style={styles.statsGrid}>
          {renderStatCard(
            'Receita Mensal',
            `R$ ${dashboardData.monthlyRevenue}`,
            dashboardData.revenueGrowth,
            DollarSign,
            '#10B981'
          )}
          {renderStatCard(
            'Agendamentos',
            dashboardData.totalBookings,
            dashboardData.bookingsGrowth,
            Calendar,
            '#3B82F6'
          )}
          {renderStatCard(
            'Avaliação Média',
            dashboardData.averageRating,
            dashboardData.ratingGrowth,
            Star,
            '#F59E0B'
          )}
          {renderStatCard(
            'Taxa de Conclusão',
            `${dashboardData.completionRate}%`,
            dashboardData.completionGrowth,
            Users,
            '#8B5CF6'
          )}
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ações Rápidas</Text>
        <View style={styles.quickActions}>
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => setActiveTab('Agendamentos')}
          >
            <Calendar size={24} color="#10B981" />
            <Text style={styles.quickActionText}>Ver Agendamentos</Text>
            <Text style={styles.quickActionSubtext}>{dashboardData.pendingAppointments} pendentes</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => setActiveTab('Conversas')}
          >
            <MessageCircle size={24} color="#3B82F6" />
            <Text style={styles.quickActionText}>Conversas</Text>
            <Text style={styles.quickActionSubtext}>{mockProviderChats.length} ativas</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionCard}
            onPress={() => router.push('/(provider-tabs)/services')}
          >
            <Wrench size={24} color="#F59E0B" />
            <Text style={styles.quickActionText}>Meus Serviços</Text>
            <Text style={styles.quickActionSubtext}>Gerenciar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Status dos Agendamentos */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Status dos Agendamentos</Text>
        <View style={styles.appointmentStats}>
          <View style={styles.appointmentStatItem}>
            <View style={[styles.appointmentStatDot, { backgroundColor: '#F59E0B' }]} />
            <Text style={styles.appointmentStatLabel}>Pendentes</Text>
            <Text style={styles.appointmentStatValue}>{dashboardData.pendingAppointments}</Text>
          </View>
          <View style={styles.appointmentStatItem}>
            <View style={[styles.appointmentStatDot, { backgroundColor: '#10B981' }]} />
            <Text style={styles.appointmentStatLabel}>Confirmados</Text>
            <Text style={styles.appointmentStatValue}>{dashboardData.confirmedAppointments}</Text>
          </View>
          <View style={styles.appointmentStatItem}>
            <View style={[styles.appointmentStatDot, { backgroundColor: '#059669' }]} />
            <Text style={styles.appointmentStatLabel}>Concluídos</Text>
            <Text style={styles.appointmentStatValue}>{dashboardData.completedAppointments}</Text>
          </View>
          <View style={styles.appointmentStatItem}>
            <View style={[styles.appointmentStatDot, { backgroundColor: '#EF4444' }]} />
            <Text style={styles.appointmentStatLabel}>Cancelados</Text>
            <Text style={styles.appointmentStatValue}>{dashboardData.cancelledAppointments}</Text>
          </View>
        </View>
      </View>

      {/* Atividade Recente */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Atividade Recente</Text>
        {recentActivity.map((activity) => {
          const IconComponent = activity.icon;
          return (
            <View key={activity.id} style={styles.activityItem}>
              <View style={styles.activityIcon}>
                <IconComponent size={16} color="#6B7280" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityMessage}>{activity.message}</Text>
                <Text style={styles.activityTime}>{activity.time}</Text>
              </View>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );

  const renderAgendamentos = () => (
    <ScrollView 
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Filters */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Agendamentos</Text>
          <TouchableOpacity style={styles.filterButton}>
            <Filter size={16} color="#10B981" />
          </TouchableOpacity>
        </View>
        
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.filtersContainer}
          contentContainerStyle={styles.filtersContent}
        >
          {appointmentFilters.map((filter) => (
            <TouchableOpacity
              key={filter.id}
              style={[
                styles.filterChip,
                appointmentFilter === filter.id && styles.activeFilterChip
              ]}
              onPress={() => setAppointmentFilter(filter.id)}
            >
              <Text
                style={[
                  styles.filterText,
                  appointmentFilter === filter.id && styles.activeFilterText
                ]}
              >
                {filter.label}
              </Text>
              <View
                style={[
                  styles.filterBadge,
                  appointmentFilter === filter.id && styles.activeFilterBadge
                ]}
              >
                <Text
                  style={[
                    styles.filterBadgeText,
                    appointmentFilter === filter.id && styles.activeFilterBadgeText
                  ]}
                >
                  {filter.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Appointments List */}
      <View style={styles.section}>
        {filteredAppointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Nenhum agendamento</Text>
            <Text style={styles.emptySubtitle}>
              {appointmentFilter === 'all' 
                ? 'Você não tem agendamentos no momento'
                : `Nenhum agendamento ${getStatusText(appointmentFilter).toLowerCase()}`
              }
            </Text>
          </View>
        ) : (
          filteredAppointments.map((appointment) => (
            <View key={appointment.id} style={styles.appointmentCard}>
              <View
                style={[
                  styles.statusIndicator,
                  { backgroundColor: getStatusColor(appointment.status) },
                ]}
              />
              <View style={styles.appointmentContent}>
                <View style={styles.appointmentHeader}>
                  <Text style={styles.serviceName}>{appointment.service}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      { backgroundColor: `${getStatusColor(appointment.status)}20` },
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusText,
                        { color: getStatusColor(appointment.status) },
                      ]}
                    >
                      {getStatusText(appointment.status)}
                    </Text>
                  </View>
                </View>

                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <User size={16} color="#6B7280" />
                    <Text style={styles.detailText}>Cliente: {appointment.client}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {appointment.date} às {appointment.time}
                    </Text>
                  </View>
                  {appointment.location && (
                    <View style={styles.detailRow}>
                      <MapPin size={16} color="#6B7280" />
                      <Text style={styles.detailText}>{appointment.location}</Text>
                    </View>
                  )}
                  {appointment.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Observações:</Text>
                      <Text style={styles.notesText}>{appointment.notes}</Text>
                    </View>
                  )}
                </View>

                {/* Actions based on status */}
                {appointment.status === 'pending' && (
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => handleCancelAppointment(appointment.id)}
                    >
                      <X size={16} color="#FFFFFF" />
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.confirmButton}
                      onPress={() => handleConfirmAppointment(appointment.id)}
                    >
                      <CheckCircle size={16} color="#FFFFFF" />
                      <Text style={styles.confirmButtonText}>Confirmar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {appointment.status === 'confirmed' && (
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => handleCancelAppointment(appointment.id)}
                    >
                      <X size={16} color="#FFFFFF" />
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.completeButton}
                      onPress={() => handleCompleteAppointment(appointment.id)}
                    >
                      <CheckCircle size={16} color="#FFFFFF" />
                      <Text style={styles.completeButtonText}>Concluir</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
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
            <MessageCircle size={48} color="#D1D5DB" />
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
              onPress={() => router.push({
                pathname: '/chat-detail',
                params: { chatId: chat.id }
              })}
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
            activeTab === 'Agendamentos' && styles.activeTab,
          ]}
          onPress={() => setActiveTab('Agendamentos')}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'Agendamentos' && styles.activeTabText,
            ]}
          >
            Agendamentos
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
        {activeTab === 'Dashboard' && renderDashboard()}
        {activeTab === 'Agendamentos' && renderAgendamentos()}
        {activeTab === 'Conversas' && renderConversas()}
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
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F0FDF4',
  },
  filtersContainer: {
    maxHeight: 60,
  },
  filtersContent: {
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 6,
  },
  activeFilterChip: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  filterBadge: {
    backgroundColor: '#E5E7EB',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeFilterBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  filterBadgeText: {
    fontSize: 12,
    fontFamily: 'Inter-Bold',
    color: '#6B7280',
  },
  activeFilterBadgeText: {
    color: '#FFFFFF',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 2,
  },
  positiveGrowth: {
    backgroundColor: '#F0FDF4',
  },
  negativeGrowth: {
    backgroundColor: '#FEF2F2',
  },
  growthText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
  },
  positiveGrowthText: {
    color: '#10B981',
  },
  negativeGrowthText: {
    color: '#EF4444',
  },
  statValue: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionCard: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginTop: 8,
    textAlign: 'center',
  },
  quickActionSubtext: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  appointmentStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  appointmentStatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    minWidth: '45%',
  },
  appointmentStatDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  appointmentStatLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    flex: 1,
  },
  appointmentStatValue: {
    fontSize: 14,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  activityIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  emptyState: {
    padding: 32,
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 12,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtext: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 8,
  },
  emptySubtitle: {
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
  statusIndicator: {
    width: 4,
  },
  appointmentContent: {
    flex: 1,
    padding: 16,
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  confirmedBadge: {
    backgroundColor: '#F0FDF4',
  },
  completedBadge: {
    backgroundColor: '#F0F9FF',
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  confirmedText: {
    color: '#10B981',
  },
  completedText: {
    color: '#0EA5E9',
  },
  appointmentDetails: {
    gap: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  notesContainer: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  notesLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    justifyContent: 'center',
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
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#EF4444',
    justifyContent: 'center',
    gap: 4,
  },
  cancelButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  completeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#059669',
    justifyContent: 'center',
    gap: 4,
  },
  completeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
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