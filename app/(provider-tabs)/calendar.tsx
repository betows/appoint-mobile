import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, ArrowRight, Bell, X, Clock, Ban, CircleCheck as CheckCircle, Settings } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const monthDays = [
  [null, 2, 3, 4, 5, 6, 7],
  [8, 9, 10, 11, 12, 13, 14],
  [15, 16, 17, 18, 19, 20, 21],
  [22, 23, 24, 25, 26, 27, 28],
  [29, 30, 1, 2, 3, 4, 5],
];

const initialDayStatus = {
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

const initialWorkingHours = {
  sunday: { enabled: false, start: '09:00', lunch: '12:00', lunchEnd: '13:00', end: '18:00' },
  monday: { enabled: true, start: '09:00', lunch: '12:00', lunchEnd: '13:00', end: '20:00' },
  tuesday: { enabled: true, start: '09:00', lunch: '12:00', lunchEnd: '13:00', end: '20:00' },
  wednesday: { enabled: true, start: '09:00', lunch: '12:00', lunchEnd: '13:00', end: '20:00' },
  thursday: { enabled: true, start: '09:00', lunch: '12:00', lunchEnd: '13:00', end: '20:00' },
  friday: { enabled: true, start: '09:00', lunch: '12:00', lunchEnd: '13:00', end: '20:00' },
  saturday: { enabled: true, start: '09:00', lunch: '12:00', lunchEnd: '13:00', end: '20:00' },
};

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
  '19:00', '19:30', '20:00'
];

export default function ProviderCalendar() {
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [currentMonth, setCurrentMonth] = useState('junho 2025');
  const [dayStatus, setDayStatus] = useState(initialDayStatus);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [workingHoursModal, setWorkingHoursModal] = useState(false);
  const [workingHours, setWorkingHours] = useState(initialWorkingHours);
  const [blockTimeModal, setBlockTimeModal] = useState(false);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);

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

  const handleDayPress = (day: number) => {
    setSelectedDay(day);
    setDrawerVisible(true);
  };

  const handleBlockDay = () => {
    if (!selectedDay) return;
    
    Alert.alert(
      'Bloquear Dia',
      `Deseja bloquear o dia ${selectedDay} de junho?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          style: 'destructive',
          onPress: () => {
            setDayStatus(prev => ({
              ...prev,
              [selectedDay]: 'blocked'
            }));
            setDrawerVisible(false);
          }
        }
      ]
    );
  };

  const handleBlockTime = () => {
    setBlockTimeModal(true);
  };

  const handleConfirmTimeBlock = () => {
    if (selectedTimeSlots.length === 0) {
      Alert.alert('Erro', 'Selecione pelo menos um horário para bloquear.');
      return;
    }

    Alert.alert(
      'Bloquear Horários',
      `Deseja bloquear ${selectedTimeSlots.length} horário(s) no dia ${selectedDay}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Bloquear',
          onPress: () => {
            // Aqui você salvaria os horários bloqueados
            Alert.alert('Sucesso', 'Horários bloqueados com sucesso!');
            setSelectedTimeSlots([]);
            setBlockTimeModal(false);
            setDrawerVisible(false);
          }
        }
      ]
    );
  };

  const handleConfirmAppointment = () => {
    setDayStatus(prev => ({
      ...prev,
      [selectedDay!]: 'booked'
    }));
    
    Alert.alert('Sucesso', 'Agendamento confirmado!');
    setDrawerVisible(false);
  };

  const handleCancelAppointment = () => {
    setDayStatus(prev => ({
      ...prev,
      [selectedDay!]: 'available'
    }));
    
    Alert.alert('Agendamento Cancelado', 'O agendamento foi cancelado.');
    setDrawerVisible(false);
  };

  const handleUnblockDay = () => {
    setDayStatus(prev => ({
      ...prev,
      [selectedDay!]: 'available'
    }));
    
    Alert.alert('Dia Desbloqueado', 'O dia foi desbloqueado e está disponível novamente.');
    setDrawerVisible(false);
  };

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value
      }
    }));
  };

  const saveWorkingHours = () => {
    Alert.alert('Sucesso', 'Horários de trabalho atualizados!');
    setWorkingHoursModal(false);
  };

  const toggleTimeSlot = (time: string) => {
    setSelectedTimeSlots(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const getDayName = (day: number) => {
    const dayNames = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
    // Simulando que dia 11 é uma quarta-feira
    return dayNames[3]; // quarta-feira
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
            <Text style={styles.appName}>Calendário</Text>
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
            Toque em um dia para gerenciar agendamentos
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
                    onPress={() => day && handleDayPress(day)}
                    disabled={!day}
                  >
                    {renderDayContent(day)}
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>

          {/* Working Hours Section */}
          <View style={styles.workingHoursSection}>
            <View style={styles.workingHoursHeader}>
              <Text style={styles.workingHoursTitle}>
                Horário de Trabalho
              </Text>
              <TouchableOpacity 
                style={styles.changeHoursButton}
                onPress={() => setWorkingHoursModal(true)}
              >
                <Settings size={16} color="#10B981" />
                <Text style={styles.changeHoursText}>Alterar</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.workingHoursSubtitle}>
              Segunda a Sábado: 09:00 às 20:00 (pausa 12:00 - 13:00)
            </Text>
            <Text style={styles.workingHoursSubtitle}>
              Domingo: Fechado
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>

      {/* Drawer */}
      <Modal
        visible={drawerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDrawerVisible(false)}
      >
        <View style={styles.drawerOverlay}>
          <TouchableOpacity 
            style={styles.drawerBackdrop}
            onPress={() => setDrawerVisible(false)}
          />
          <View style={styles.drawer}>
            <View style={styles.drawerHeader}>
              <Text style={styles.drawerTitle}>
                {selectedDay && getDayName(selectedDay)}, {selectedDay} de junho
              </Text>
              <TouchableOpacity onPress={() => setDrawerVisible(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.drawerContent}>
              {/* Quick Actions */}
              <View style={styles.drawerSection}>
                <Text style={styles.drawerSectionTitle}>Ações Rápidas</Text>
                <View style={styles.quickActions}>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={handleBlockDay}
                  >
                    <Ban size={20} color="#EF4444" />
                    <Text style={styles.quickActionText}>Bloquear Dia</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.quickActionButton}
                    onPress={handleBlockTime}
                  >
                    <Clock size={20} color="#F59E0B" />
                    <Text style={styles.quickActionText}>Bloquear Horário</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Pending Appointments */}
              {selectedDay === 11 && dayStatus[11] === 'pending' && (
                <View style={styles.drawerSection}>
                  <Text style={styles.drawerSectionTitle}>Agendamentos Pendentes</Text>
                  <View style={styles.appointmentCard}>
                    <View style={styles.appointmentIndicator} />
                    <View style={styles.appointmentContent}>
                      <Text style={styles.appointmentService}>Instalação Elétrica</Text>
                      <Text style={styles.appointmentClient}>Cliente: João Silva</Text>
                      <Text style={styles.appointmentTime}>Horário: 13:30</Text>
                      <View style={styles.appointmentActions}>
                        <TouchableOpacity 
                          style={styles.confirmButton}
                          onPress={handleConfirmAppointment}
                        >
                          <CheckCircle size={16} color="#FFFFFF" />
                          <Text style={styles.confirmButtonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          style={styles.cancelButton}
                          onPress={handleCancelAppointment}
                        >
                          <X size={16} color="#FFFFFF" />
                          <Text style={styles.cancelButtonText}>Cancelar</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              )}

              {/* Blocked Day */}
              {selectedDay === 6 && dayStatus[6] === 'blocked' && (
                <View style={styles.drawerSection}>
                  <Text style={styles.drawerSectionTitle}>Bloqueios</Text>
                  <View style={styles.blockedCard}>
                    <View style={styles.blockedIndicator} />
                    <View style={styles.blockedContent}>
                      <Text style={styles.blockedText}>Dia Bloqueado</Text>
                      <Text style={styles.blockedTime}>Bloqueado das 08:00 às 23:00</Text>
                      <TouchableOpacity 
                        style={styles.unblockButton}
                        onPress={handleUnblockDay}
                      >
                        <Text style={styles.unblockButtonText}>Desbloquear</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* Available Day */}
              {selectedDay && dayStatus[selectedDay] === 'available' && (
                <View style={styles.drawerSection}>
                  <Text style={styles.drawerSectionTitle}>Status</Text>
                  <View style={styles.statusCard}>
                    <Text style={styles.statusText}>✅ Dia disponível para agendamentos</Text>
                  </View>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Working Hours Modal */}
      <Modal
        visible={workingHoursModal}
        transparent
        animationType="slide"
        onRequestClose={() => setWorkingHoursModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Horários de Trabalho</Text>
              <TouchableOpacity onPress={() => setWorkingHoursModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              {Object.entries(workingHours).map(([dayKey, dayData]) => {
                const dayNames = {
                  sunday: 'Domingo',
                  monday: 'Segunda',
                  tuesday: 'Terça',
                  wednesday: 'Quarta',
                  thursday: 'Quinta',
                  friday: 'Sexta',
                  saturday: 'Sábado'
                };

                return (
                  <View key={dayKey} style={styles.daySchedule}>
                    <View style={styles.dayHeader}>
                      <Text style={styles.dayName}>{dayNames[dayKey]}</Text>
                      <TouchableOpacity
                        style={[
                          styles.enableToggle,
                          dayData.enabled && styles.enableToggleActive
                        ]}
                        onPress={() => updateWorkingHours(dayKey, 'enabled', !dayData.enabled)}
                      >
                        <Text style={[
                          styles.enableToggleText,
                          dayData.enabled && styles.enableToggleTextActive
                        ]}>
                          {dayData.enabled ? 'Ativo' : 'Inativo'}
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {dayData.enabled && (
                      <View style={styles.timeInputs}>
                        <View style={styles.timeRow}>
                          <View style={styles.timeInput}>
                            <Text style={styles.timeLabel}>Início</Text>
                            <TextInput
                              style={styles.timeField}
                              value={dayData.start}
                              onChangeText={(value) => updateWorkingHours(dayKey, 'start', value)}
                              placeholder="09:00"
                            />
                          </View>
                          <View style={styles.timeInput}>
                            <Text style={styles.timeLabel}>Pausa</Text>
                            <TextInput
                              style={styles.timeField}
                              value={dayData.lunch}
                              onChangeText={(value) => updateWorkingHours(dayKey, 'lunch', value)}
                              placeholder="12:00"
                            />
                          </View>
                        </View>
                        <View style={styles.timeRow}>
                          <View style={styles.timeInput}>
                            <Text style={styles.timeLabel}>Retorno</Text>
                            <TextInput
                              style={styles.timeField}
                              value={dayData.lunchEnd}
                              onChangeText={(value) => updateWorkingHours(dayKey, 'lunchEnd', value)}
                              placeholder="13:00"
                            />
                          </View>
                          <View style={styles.timeInput}>
                            <Text style={styles.timeLabel}>Fim</Text>
                            <TextInput
                              style={styles.timeField}
                              value={dayData.end}
                              onChangeText={(value) => updateWorkingHours(dayKey, 'end', value)}
                              placeholder="20:00"
                            />
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                );
              })}
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => setWorkingHoursModal(false)}
              >
                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveModalButton}
                onPress={saveWorkingHours}
              >
                <Text style={styles.saveModalButtonText}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Block Time Modal */}
      <Modal
        visible={blockTimeModal}
        transparent
        animationType="slide"
        onRequestClose={() => setBlockTimeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Bloquear Horários</Text>
              <TouchableOpacity onPress={() => setBlockTimeModal(false)}>
                <X size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalContent}>
              <Text style={styles.modalSubtitle}>
                Selecione os horários que deseja bloquear no dia {selectedDay}:
              </Text>
              
              <View style={styles.timeSlotsGrid}>
                {timeSlots.map((time) => (
                  <TouchableOpacity
                    key={time}
                    style={[
                      styles.timeSlot,
                      selectedTimeSlots.includes(time) && styles.selectedTimeSlot
                    ]}
                    onPress={() => toggleTimeSlot(time)}
                  >
                    <Text style={[
                      styles.timeSlotText,
                      selectedTimeSlots.includes(time) && styles.selectedTimeSlotText
                    ]}>
                      {time}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelModalButton}
                onPress={() => {
                  setSelectedTimeSlots([]);
                  setBlockTimeModal(false);
                }}
              >
                <Text style={styles.cancelModalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveModalButton}
                onPress={handleConfirmTimeBlock}
              >
                <Text style={styles.saveModalButtonText}>
                  Bloquear ({selectedTimeSlots.length})
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  workingHoursSection: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    backgroundColor: '#F9FAFB',
    marginHorizontal: 24,
    borderRadius: 12,
  },
  workingHoursHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  workingHoursTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  changeHoursButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  changeHoursText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#10B981',
  },
  workingHoursSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 4,
  },
  // Drawer Styles
  drawerOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  drawerBackdrop: {
    flex: 1,
  },
  drawer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  drawerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  drawerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  drawerContent: {
    flex: 1,
  },
  drawerSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  drawerSectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
    marginBottom: 12,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  appointmentCard: {
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
  appointmentIndicator: {
    width: 4,
    backgroundColor: '#F59E0B',
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
  appointmentTime: {
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
  statusCard: {
    backgroundColor: '#F0FDF4',
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#10B981',
  },
  statusText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#059669',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modal: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    marginBottom: 20,
  },
  daySchedule: {
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dayName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  enableToggle: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  enableToggleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  enableToggleText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  enableToggleTextActive: {
    color: '#FFFFFF',
  },
  timeInputs: {
    gap: 12,
  },
  timeRow: {
    flexDirection: 'row',
    gap: 12,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
    marginBottom: 4,
  },
  timeField: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  timeSlot: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minWidth: '30%',
    alignItems: 'center',
  },
  selectedTimeSlot: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  timeSlotText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  selectedTimeSlotText: {
    color: '#FFFFFF',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 12,
  },
  cancelModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
  },
  cancelModalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#6B7280',
  },
  saveModalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#10B981',
    alignItems: 'center',
  },
  saveModalButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#FFFFFF',
  },
});