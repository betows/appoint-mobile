import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, Clock, MapPin } from 'lucide-react-native';
import { mockAppointments } from '@/data/mockData';
import { router } from 'expo-router';
<<<<<<< HEAD
import ReviewModal from '@/components/ReviewModal';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface Appointment {
  id: string;
  title: string;
  date: Date;
  time: string;
  provider: string;
  providerId: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  cancelable: boolean;
  alert: boolean;
  service: { id: string; title: string; provider?: { id: string; legalName: string; }; };
  location?: string;
  notes?: string;
  serviceId: string;
}

export default function CustomerBookings() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [currentReviewDetails, setCurrentReviewDetails] = useState<{ serviceId: string; providerId: string; } | null>(null);

  const isCancelable = (date: Date) => {
    const now = new Date();
    const diffMinutes = (date.getTime() - now.getTime()) / (1000 * 60);
    return diffMinutes > 120; // Cancelable if more than 2 hours before
  };

  const minutesUntil = (date: Date) => {
    const now = new Date();
    return (date.getTime() - now.getTime()) / (1000 * 60);
  };

  const fetchAppointments = useCallback(async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      const { data } = await api.get('/user/customer/appointments', user.token);
      const mappedAppointments = data.map((appt: any) => {
        const date = new Date(appt.scheduledAt * 1000);
        return {
          id: appt.id,
          title: appt.service.title,
          date,
          time: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
          provider: appt.service.provider?.legalName || 'Prestador não identificado',
          providerId: appt.service.provider?.id || null,
          status: appt.status.toLowerCase(),
          cancelable: isCancelable(date),
          alert: minutesUntil(date) <= 90 && minutesUntil(date) > 60,
          service: appt.service,
          location: appt.location,
          notes: appt.notes,
          serviceId: appt.service.id,
        };
      });
      setAppointments(mappedAppointments);
    } catch (error) {
      console.error('Failed to fetch appointments:', error);
      Alert.alert('Erro', 'Falha ao carregar agendamentos.');
    } finally {
      setLoading(false);
    }
  }, [user?.token]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);
=======

export default function CustomerBookings() {
  const [appointments, setAppointments] = useState(mockAppointments.filter(apt => apt.client === 'João Silva'));
>>>>>>> parent of b97bf83 (fetching services and providers)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'confirmed':
        return '#10B981';
      case 'completed':
        return '#059669';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'confirmed':
        return 'Confirmado';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  const handleCancelAppointment = (appointmentId: string) => {
    Alert.alert(
      'Cancelar Agendamento',
      'Tem certeza que deseja cancelar este agendamento?',
      [
        {
          text: 'Não',
          style: 'cancel',
        },
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
          },
        },
      ]
    );
  };

  const handleRescheduleAppointment = (appointmentId: string) => {
    router.push({
      pathname: '/booking-calendar',
      params: { appointmentId, reschedule: 'true' }
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Agendamentos</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {appointments.length === 0 ? (
          <View style={styles.emptyState}>
            <Calendar size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>Nenhum agendamento</Text>
            <Text style={styles.emptySubtitle}>
              Seus agendamentos aparecerão aqui quando você contratar um serviço
            </Text>
          </View>
        ) : (
          appointments.map((appointment) => (
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
                    <Calendar size={16} color="#6B7280" />
                    <Text style={styles.detailText}>
                      {appointment.date} às {appointment.time}
                    </Text>
                  </View>
<<<<<<< HEAD
                  <View style={styles.detailRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.detailText}>Prestador: {appointment.provider}</Text>
                  </View>
=======
>>>>>>> parent of b97bf83 (fetching services and providers)
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

                {appointment.status === 'pending' && (
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity 
                      style={styles.cancelButton}
                      onPress={() => handleCancelAppointment(appointment.id)}
                    >
                      <Text style={styles.cancelButtonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity 
                      style={styles.rescheduleButton}
                      onPress={() => handleRescheduleAppointment(appointment.id)}
                    >
                      <Text style={styles.rescheduleButtonText}>Reagendar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {appointment.status === 'confirmed' && (
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity 
                      style={styles.rescheduleButton}
                      onPress={() => handleRescheduleAppointment(appointment.id)}
                    >
                      <Text style={styles.rescheduleButtonText}>Reagendar</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))
        )}
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
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  appointmentCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 12,
<<<<<<< HEAD
    elevation: 2,
=======
>>>>>>> parent of b97bf83 (fetching services and providers)
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
<<<<<<< HEAD
=======
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
>>>>>>> parent of b97bf83 (fetching services and providers)
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
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  appointmentDetails: {
    gap: 8,
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
    marginTop: 12,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
  },
  rescheduleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  rescheduleButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});