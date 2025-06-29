import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { format, addDays, parseISO, isToday, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const API_URL = 'http://localhost:5000/api/v1';

interface TimeSlot {
  hour: string;
  date: string;
}

interface DayData {
  day: string;
  date: string;
  fullDate: Date;
  isToday: boolean;
}

export default function BookingCalendar() {
  const { serviceId, providerId, appointmentId, reschedule } = useLocalSearchParams<{ 
    serviceId: string; 
    providerId: string; 
    appointmentId?: string; 
    reschedule?: string; 
  }>();
  
  const { user } = useAuth();
  const [availableTimeSlots, setAvailableTimeSlots] = useState<TimeSlot[]>([]);
  const [weekDays, setWeekDays] = useState<DayData[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [loading, setLoading] = useState(true);

  const isRescheduling = reschedule === 'true';

  const generateWeekDays = useCallback(() => {
    const days: DayData[] = [];
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const date = addDays(today, i);
      days.push({
        day: format(date, 'EEEE', { locale: ptBR }),
        date: format(date, 'dd'),
        fullDate: date,
        isToday: isToday(date),
      });
    }
    setWeekDays(days);
    setSelectedDay(format(today, 'dd')); // Select today by default
  }, []);

  const fetchAvailableHours = useCallback(async () => {
    if (!providerId || !user?.token) return;
    setLoading(true);
    try {
      const startDate = format(new Date(), 'yyyy-MM-dd');
      const endDate = format(addDays(new Date(), 6), 'yyyy-MM-dd'); // Fetch for 7 days

      const response = await fetch(`${API_URL}/marketplace/services/${providerId}/available?startDate=${startDate}&endDate=${endDate}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch available hours');
      }
      setAvailableTimeSlots(data);
    } catch (error) {
      console.error('Failed to fetch available hours:', error);
      Alert.alert('Erro', 'Falha ao carregar horários disponíveis.');
    } finally {
      setLoading(false);
    }
  }, [providerId, user?.token]);

  useEffect(() => {
    generateWeekDays();
    fetchAvailableHours();
  }, [generateWeekDays, fetchAvailableHours]);

  const handleConfirmBooking = async () => {
    if (!selectedTime || !selectedDay || !serviceId || !user?.token) {
      Alert.alert('Erro', 'Por favor, selecione um dia e horário.');
      return;
    }

    const selectedFullDate = weekDays.find(day => day.date === selectedDay)?.fullDate;
    if (!selectedFullDate) {
      Alert.alert('Erro', 'Data selecionada inválida.');
      return;
    }

    const [hour, minute] = selectedTime.split(':').map(Number);
    const appointmentDateTime = new Date(selectedFullDate);
    appointmentDateTime.setHours(hour, minute, 0, 0);

    try {
      // Assuming you have a way to get the cardId, for now, it's hardcoded or fetched elsewhere
      const cardId = "your_customer_card_id"; // Replace with actual card ID

      const bookingPayload = {
        serviceId,
        cardId,
        scheduledAt: appointmentDateTime.toISOString(),
        // Add other necessary fields like providerId if needed by the backend
      };

      const response = await fetch(`${API_URL}/payments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
        body: JSON.stringify(bookingPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Booking failed');
      }

      const message = isRescheduling 
        ? 'Agendamento reagendado com sucesso!'
        : 'Agendamento confirmado com sucesso!';

      Alert.alert(
        'Sucesso',
        message,
        [
          {
            text: 'OK',
            onPress: () => {
              router.back();
            }
          }
        ]
      );
    } catch (error) {
      console.error('Booking error:', error);
      Alert.alert('Erro', 'Falha ao confirmar agendamento. Tente novamente.');
    }
  };

  const filteredTimeSlots = availableTimeSlots.filter(slot => {
    const slotDate = parseISO(slot.date);
    const selectedDate = weekDays.find(day => day.date === selectedDay)?.fullDate;
    return selectedDate && isSameDay(slotDate, selectedDate);
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={styles.loadingText}>Carregando horários...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.appName}>Appoint</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.title}>
            {isRescheduling ? 'Reagendar Serviço' : 'Agendar Serviço'}
          </Text>
          <Text style={styles.subtitle}>
            Selecione o dia e horário desejado
          </Text>
        </View>

        {/* Week Calendar */}
        <View style={styles.calendarSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.weekContainer}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day.date}
                  style={[
                    styles.dayCard,
                    day.isToday && styles.todayCard,
                    selectedDay === day.date && styles.selectedDayCard,
                  ]}
                  onPress={() => setSelectedDay(day.date)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      day.isToday && styles.todayText,
                      selectedDay === day.date && styles.selectedDayText,
                    ]}
                  >
                    {day.day.substring(0, 3)}.
                  </Text>
                  <Text
                    style={[
                      styles.dateText,
                      day.isToday && styles.todayDateText,
                      selectedDay === day.date && styles.selectedDateText,
                    ]}
                  >
                    {day.date}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Available Times */}
        <View style={styles.timesSection}>
          <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
          <View style={styles.timesGrid}>
            {filteredTimeSlots.length === 0 ? (
              <Text style={styles.emptyText}>Nenhum horário disponível para este dia.</Text>
            ) : (
              filteredTimeSlots.map((slot) => (
                <TouchableOpacity
                  key={slot.hour}
                  style={[
                    styles.timeSlot,
                    selectedTime === slot.hour && styles.selectedTimeSlot,
                  ]}
                  onPress={() => setSelectedTime(slot.hour)}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === slot.hour && styles.selectedTimeText,
                    ]}
                  >
                    {slot.hour}
                  </Text>
                </TouchableOpacity>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      {selectedTime && (
        <View style={styles.bookingSection}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleConfirmBooking}
          >
            <Text style={styles.bookButtonText}>
              {isRescheduling ? 'Confirmar Reagendamento' : 'Confirmar Agendamento'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  placeholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  titleSection: {
    padding: 24,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  calendarSection: {
    paddingVertical: 24,
  },
  weekContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
  },
  dayCard: {
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    minWidth: 70,
  },
  todayCard: {
    backgroundColor: '#10B981',
  },
  selectedDayCard: {
    backgroundColor: '#10B981',
  },
  dayText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  todayText: {
    color: '#FFFFFF',
  },
  selectedDayText: {
    color: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  todayDateText: {
    color: '#FFFFFF',
  },
  selectedDateText: {
    color: '#FFFFFF',
  },
  periodSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  periodContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  periodButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#F9FAFB',
  },
  activePeriodButton: {
    backgroundColor: '#10B981',
  },
  periodText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  activePeriodText: {
    color: '#FFFFFF',
  },
  timesSection: {
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  timesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  timeSlot: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedTimeSlot: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  timeText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  selectedTimeText: {
    color: '#FFFFFF',
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
  emptyText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
  },
});