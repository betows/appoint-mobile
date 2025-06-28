import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Bell } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthDays = [
  [null, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 1, 2, 3, 4, 5],
];

const dayStatus = {
  2: 'available',
  3: 'available', 
  4: 'booked',
  5: 'available',
  6: 'blocked',
  11: 'pending',
  12: 'available',
  13: 'available',
  16: 'available',
  17: 'available',
  18: 'available',
  19: 'available',
  20: 'available',
  23: 'available',
  24: 'available',
  25: 'available',
  26: 'available',
  27: 'available',
  30: 'available',
};

const workingHours = [
  { day: 'Dom', status: 'closed' },
  { day: 'Seg', hours: 'Das 09:00 às 20:00', pause: '(pausa 12:00 - 13:00)' },
  { day: 'Ter', hours: 'Das 09:00 às 20:00', pause: '(pausa 12:00 - 13:00)' },
  { day: 'Qua', hours: 'Das 09:00 às 20:00', pause: '(pausa 12:00 - 13:00)' },
  { day: 'Qui', hours: 'Das 09:00 às 20:00', pause: '(pausa 12:00 - 13:00)' },
  { day: 'Sex', hours: 'Das 09:00 às 20:00', pause: '(pausa 12:00 - 13:00)' },
  { day: 'Sáb', hours: 'Das 09:00 às 20:00', pause: '(pausa 12:00 - 13:00)' },
];

export default function ProviderCalendar() {
  const [selectedDay, setSelectedDay] = useState(11);
  const [currentMonth, setCurrentMonth] = useState('junho 2025');

  const getDayStyle = (day: number | null) => {
    if (!day) return styles.emptyDay;
    
    const status = dayStatus[day];
    const isSelected = day === selectedDay;
    
    if (isSelected) return [styles.day, styles.selectedDay];
    
    switch (status) {
      case 'booked':
        return [styles.day, styles.bookedDay];
      case 'available':
        return [styles.day, styles.availableDay];
      case 'blocked':
        return [styles.day, styles.blockedDay];
      case 'pending':
        return [styles.day, styles.pendingDay];
      default:
        return styles.day;
    }
  };

  const getDayTextStyle = (day: number | null) => {
    if (!day) return styles.emptyDayText;
    
    const status = dayStatus[day];
    const isSelected = day === selectedDay;
    
    if (isSelected) return styles.selectedDayText;
    
    switch (status) {
      case 'booked':
      case 'available':
      case 'blocked':
      case 'pending':
        return styles.dayText;
      default:
        return styles.dayText;
    }
  };

  const renderDayContent = (day: number | null) => {
    if (!day) return null;
    
    const status = dayStatus[day];
    const isSelected = day === selectedDay;
    
    return (
      <View style={styles.dayContent}>
        <Text style={getDayTextStyle(day)}>{day}</Text>
        {status && !isSelected && (
          <View style={[styles.statusDot, getStatusDotStyle(status)]} />
        )}
      </View>
    );
  };

  const getStatusDotStyle = (status: string) => {
    switch (status) {
      case 'booked':
        return { backgroundColor: '#EF4444' };
      case 'available':
        return { backgroundColor: '#10B981' };
      case 'blocked':
        return { backgroundColor: '#EF4444' };
      case 'pending':
        return { backgroundColor: '#F59E0B' };
      default:
        return {};
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={['#10B981', '#059669']}
        style={styles.header}
      >
        <SafeAreaView edges={['top']} style={styles.headerSafeArea}>
          <View style={styles.headerContent}>
            <Text style={styles.appName}>Appoint</Text>
            <TouchableOpacity>
              <Bell size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </LinearGradient>

      <SafeAreaView edges={['bottom']} style={styles.contentContainer}>
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Calendar Navigation */}
          <View style={styles.calendarHeader}>
            <TouchableOpacity>
              <ArrowLeft size={24} color="#10B981" />
            </TouchableOpacity>
            <Text style={styles.monthTitle}>{currentMonth}</Text>
            <TouchableOpacity>
              <ArrowRight size={24} color="#10B981" />
            </TouchableOpacity>
          </View>

          <Text style={styles.calendarSubtitle}>
            Toque em um dia para fechar um horário ou manusear agendamento
          </Text>

          {/* Calendar Grid */}
          <View style={styles.calendar}>
            {/* Week Days Header */}
            <View style={styles.weekHeader}>
              {weekDays.map((day) => (
                <Text key={day} style={styles.weekDay}>{day}</Text>
              ))}
            </View>

            {/* Calendar Days */}
            {monthDays.map((week, weekIndex) => (
              <View key={weekIndex} style={styles.week}>
                {week.map((day, dayIndex) => (
                  <TouchableOpacity
                    key={dayIndex}
                    style={getDayStyle(day)}
                    onPress={() => day && setSelectedDay(day)}
                    disabled={!day}
                  >
                    {renderDayContent(day)}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Selected Day Info */}
          {selectedDay && (
            <View style={styles.selectedDayInfo}>
              <Text style={styles.selectedDayTitle}>
                quarta-feira, {selectedDay} de junho
              </Text>
              <View style={styles.dayActions}>
                <TouchableOpacity style={styles.blockDayButton}>
                  <Text style={styles.blockDayButtonText}>Bloquear o dia inteiro</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.blockTimeButton}>
                  <Text style={styles.blockTimeButtonText}>Bloquear horário</Text>
                </TouchableOpacity>
              </View>

              {selectedDay === 11 && (
                <View style={styles.pendingSection}>
                  <Text style={styles.pendingTitle}>Pendentes</Text>
                  <View style={styles.pendingCard}>
                    <View style={styles.pendingIndicator} />
                    <View style={styles.pendingContent}>
                      <Text style={styles.pendingService}>Instalação Elétrica</Text>
                      <Text style={styles.pendingClient}>Cliente: João Silva</Text>
                      <Text style={styles.pendingTime}>Horário: 13:30</Text>
                      <View style={styles.pendingActions}>
                        <TouchableOpacity style={styles.confirmButton}>
                          <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton}>
                          <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {selectedDay === 6 && (
                <View style={styles.blockedSection}>
                  <Text style={styles.blockedTitle}>Bloqueios</Text>
                  <View style={styles.blockedCard}>
                    <View style={styles.blockedIndicator} />
                    <View style={styles.blockedContent}>
                      <Text style={styles.blockedText}>Bloqueado</Text>
                      <Text style={styles.blockedTime}>Bloqueado das 08:00 às 23:00</Text>
                      <TouchableOpacity style={styles.unblockButton}>
                        <Text style={styles.unblockButtonText}>Desbloquear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          {/* Working Hours */}
          <View style={styles.workingHoursSection}>
            <Text style={styles.workingHoursTitle}>
              Seu horário de trabalho definido para esta semana é das 09:00 às 20:00 (pausa 12:00 - 13:00)
            </Text>
            <TouchableOpacity>
              <Text style={styles.changeHoursLink}>Clique aqui para alterar</Text>
            </TouchableOpacity>

            <View style={styles.hoursGrid}>
              {workingHours.map((item) => (
                <View key={item.day} style={styles.hourCard}>
                  <Text style={[styles.hourDay, item.status === 'closed' && styles.closedDay]}>
                    {item.day}
                  </Text>
                  {item.status === 'closed' ? (
                    <Text style={styles.closedText}>fechado</Text>
                  ) : (
                    <>
                      <Text style={styles.hourTime}>{item.hours}</Text>
                      <Text style={styles.hourPause}>{item.pause}</Text>
                    </>
                  )}
                </View>
              ))}
            </View>
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
    paddingBottom: 16,
  },
  headerSafeArea: {
    paddingHorizontal: 24,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  appName: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  monthTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#10B981',
  },
  calendarSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  calendar: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  weekHeader: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDay: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    paddingVertical: 8,
  },
  week: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  day: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  emptyDay: {
    flex: 1,
    aspectRatio: 1,
  },
  selectedDay: {
    backgroundColor: '#10B981',
  },
  availableDay: {
    backgroundColor: '#F9FAFB',
  },
  bookedDay: {
    backgroundColor: '#F9FAFB',
  },
  blockedDay: {
    backgroundColor: '#F9FAFB',
  },
  pendingDay: {
    backgroundColor: '#F9FAFB',
  },
  dayContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#111827',
  },
  selectedDayText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
  emptyDayText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#D1D5DB',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  selectedDayInfo: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  selectedDayTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  dayActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  blockDayButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#EF4444',
    alignItems: 'center',
  },
  blockDayButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#EF4444',
  },
  blockTimeButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F59E0B',
    alignItems: 'center',
  },
  blockTimeButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#F59E0B',
  },
  pendingSection: {
    marginTop: 16,
  },
  pendingTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  pendingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  pendingIndicator: {
    width: 4,
    backgroundColor: '#F59E0B',
  },
  pendingContent: {
    flex: 1,
    padding: 16,
  },
  pendingService: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  pendingClient: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7C3AED',
    marginBottom: 2,
  },
  pendingTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  pendingActions: {
    flexDirection: 'row',
    gap: 8,
  },
  confirmButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  confirmButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  cancelButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  blockedSection: {
    marginTop: 16,
  },
  blockedTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  blockedCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F3F4F6',
    overflow: 'hidden',
  },
  blockedIndicator: {
    width: 4,
    backgroundColor: '#EF4444',
  },
  blockedContent: {
    flex: 1,
    padding: 16,
  },
  blockedText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#EF4444',
    marginBottom: 4,
  },
  blockedTime: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 12,
  },
  unblockButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  unblockButtonText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
  workingHoursSection: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  workingHoursTitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  changeHoursLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
    marginBottom: 16,
  },
  hoursGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  hourCard: {
    width: '48%',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  hourDay: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 4,
  },
  closedDay: {
    color: '#EF4444',
  },
  hourTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 2,
  },
  hourPause: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
  },
  closedText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#EF4444',
  },
});