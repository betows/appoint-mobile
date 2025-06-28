import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { format, addDays, isToday, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = 'http://localhost:5000/api/v1';

interface TimeSlot {
  time: string;
  available: boolean;
}

interface DaySlot {
  date: string;
  dayOfWeek: string;
  isToday: boolean;
  timeSlots: TimeSlot[];
}

export default function BookingCalendar() {
  const { providerId, serviceId, averageTime } = useLocalSearchParams();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [weekDays, setWeekDays] = useState<DaySlot[]>([]);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState('Tarde'); // Default to Tarde

  useEffect(() => {
    if (providerId && serviceId && averageTime) {
      fetchAvailableSlots(providerId as string, serviceId as string, averageTime as string);
    }
  }, [providerId, serviceId, averageTime]);

  const fetchAvailableSlots = async (pId: string, sId: string, avgTime: string) => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/marketplace/providers/${pId}/available-slots?serviceId=${sId}&averageTime=${avgTime}`);
      const data = await response.json();

      const formattedWeekDays: DaySlot[] = data.map((dayData: any) => {
        const date = parseISO(dayData.date);
        return {
          date: format(date, 'dd'),
          dayOfWeek: format(date, 'EEE', { locale: ptBR }).slice(0, 3).toLowerCase(),
          isToday: isToday(date),
          fullDate: dayData.date,
          timeSlots: dayData.timeSlots.map((slot: string) => ({ time: slot, available: true })),
        };
      });
      setWeekDays(formattedWeekDays);
      if (formattedWeekDays.length > 0) {
        setSelectedDay(formattedWeekDays[0].date);
      }
    } catch (error) {
      console.error("Error fetching available slots:", error);
      Alert.alert("Erro", "Não foi possível carregar os horários disponíveis.");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async () => {
    if (!selectedDay || !selectedTime || !user || !providerId || !serviceId) {
      Alert.alert("Erro", "Por favor, selecione um dia e horário e certifique-se de estar logado.");
      return;
    }

    const selectedFullDate = weekDays.find(day => day.date === selectedDay)?.fullDate;
    if (!selectedFullDate) {
      Alert.alert("Erro", "Data selecionada inválida.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`, // Assuming token is stored in user object
        },
        body: JSON.stringify({
          providerId: providerId,
          serviceId: serviceId,
          date: selectedFullDate,
          time: selectedTime,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Falha ao agendar.');
      }

      Alert.alert("Sucesso", "Agendamento realizado com sucesso!");
      router.back();
    } catch (error) {
      console.error("Error booking appointment:", error);
      Alert.alert("Erro", `Falha ao agendar: ${(error as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  const currentDaySlots = weekDays.find(day => day.date === selectedDay)?.timeSlots || [];

  const filterTimeSlotsByPeriod = (slots: TimeSlot[]) => {
    const morning = ['08:00', '08:30', '09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
    const afternoon = ['12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30'];
    const night = ['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'];

    if (selectedPeriod === 'Manhã') {
      return slots.filter(slot => morning.includes(slot.time));
    } else if (selectedPeriod === 'Tarde') {
      return slots.filter(slot => afternoon.includes(slot.time));
    } else if (selectedPeriod === 'Noite') {
      return slots.filter(slot => night.includes(slot.time));
    }
    return slots; // Should not happen
  };

  const periods = [
    { name: 'Manhã', active: false },
    { name: 'Tarde', active: true },
    { name: 'Noite', active: false },
  ];

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2563EB" />
      </View>
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
        {/* Week Calendar */}
        <View style={styles.calendarSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.weekContainer}>
              {weekDays.map((day) => (
                <TouchableOpacity
                  key={day.fullDate}
                  style={[
                    styles.dayCard,
                    day.isToday && styles.todayCard,
                    selectedDay === day.date && styles.selectedDayCard,
                  ]}
                  onPress={() => {
                    setSelectedDay(day.date);
                    setSelectedTime(null); // Reset selected time when day changes
                  }}
                >
                  <Text
                    style={[
                      styles.dayText,
                      day.isToday && styles.todayText,
                      selectedDay === day.date && styles.selectedDayText,
                    ]}
                  >
                    {day.dayOfWeek}
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

        {/* Period Selection */}
        <View style={styles.periodSection}>
          <View style={styles.periodContainer}>
            {periods.map((period) => (
              <TouchableOpacity
                key={period.name}
                style={[
                  styles.periodButton,
                  selectedPeriod === period.name && styles.activePeriodButton,
                ]}
                onPress={() => setSelectedPeriod(period.name)}
              >
                <Text
                  style={[
                    styles.periodText,
                    selectedPeriod === period.name && styles.activePeriodText,
                  ]}
                >
                  {period.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Available Times */}
        <View style={styles.timesSection}>
          <Text style={styles.sectionTitle}>Horários Disponíveis</Text>
          <View style={styles.timesGrid}>
            {filterTimeSlotsByPeriod(currentDaySlots).length > 0 ? (
              filterTimeSlotsByPeriod(currentDaySlots).map((slot) => (
                <TouchableOpacity
                  key={slot.time}
                  style={[
                    styles.timeSlot,
                    selectedTime === slot.time && styles.selectedTimeSlot,
                    !slot.available && styles.unavailableTimeSlot,
                  ]}
                  onPress={() => slot.available && setSelectedTime(slot.time)}
                  disabled={!slot.available}
                >
                  <Text
                    style={[
                      styles.timeText,
                      selectedTime === slot.time && styles.selectedTimeText,
                      !slot.available && styles.unavailableTimeText,
                    ]}
                  >
                    {slot.time}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.noSlotsText}>Nenhum horário disponível para este período.</Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Book Button */}
      {selectedTime && (
        <View style={styles.bookingSection}>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={handleBooking}
          >
            <Text style={styles.bookButtonText}>Confirmar Agendamento</Text>
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
  unavailableTimeSlot: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
  },
  unavailableTimeText: {
    color: '#9CA3AF',
  },
  noSlotsText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 20,
    width: '100%',
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
