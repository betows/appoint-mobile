import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { router, useLocalSearchParams } from 'expo-router';

const weekDays = [
  { day: 'segunda', date: '16', isToday: false },
  { day: 'terça', date: '17', isToday: true },
  { day: 'quarta', date: '18', isToday: false },
  { day: 'quinta', date: '19', isToday: false },
  { day: 'sexta', date: '20', isToday: false },
  { day: 'sábado', date: '21', isToday: false },
];

const timeSlots = [
  { time: '13:00', available: true },
  { time: '13:30', available: true },
  { time: '14:00', available: true },
  { time: '14:30', available: true },
  { time: '15:00', available: true },
  { time: '15:30', available: true },
];

const periods = [
  { name: 'Manhã', active: false },
  { name: 'Tarde', active: true },
  { name: 'Noite', active: false },
];

export default function BookingCalendar() {
  const { serviceId, appointmentId, reschedule } = useLocalSearchParams<{ 
    serviceId?: string; 
    appointmentId?: string; 
    reschedule?: string; 
  }>();
  
  const [selectedDay, setSelectedDay] = useState('17');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('Tarde');

  const isRescheduling = reschedule === 'true';

  const handleConfirmBooking = () => {
    if (!selectedTime) {
      Alert.alert('Erro', 'Por favor, selecione um horário.');
      return;
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
  };

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
                    {day.day}
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
            {timeSlots.map((slot) => (
              <TouchableOpacity
                key={slot.time}
                style={[
                  styles.timeSlot,
                  selectedTime === slot.time && styles.selectedTimeSlot,
                ]}
                onPress={() => setSelectedTime(slot.time)}
              >
                <Text
                  style={[
                    styles.timeText,
                    selectedTime === slot.time && styles.selectedTimeText,
                  ]}
                >
                  {slot.time}
                </Text>
              </TouchableOpacity>
            ))}
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
});