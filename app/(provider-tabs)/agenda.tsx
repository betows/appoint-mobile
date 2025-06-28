import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Calendar, CalendarList, DateData } from 'react-native-calendars';
import { Clock, MapPin, User, CircleCheck as CheckCircle, X, Calendar as CalendarIcon } from 'lucide-react-native';

const appointments = {
  '2024-01-15': [
    {
      id: '1',
      customer: 'Sarah Johnson',
      service: 'Kitchen Plumbing',
      time: '10:00 AM - 12:00 PM',
      location: '123 Main St',
      status: 'confirmed',
      notes: 'Kitchen sink repair',
    },
    {
      id: '2',
      customer: 'Mike Chen',
      service: 'Bathroom Repair',
      time: '2:00 PM - 4:00 PM',
      location: '456 Oak Ave',
      status: 'pending',
      notes: 'Toilet installation',
    },
  ],
  '2024-01-18': [
    {
      id: '3',
      customer: 'Emma Wilson',
      service: 'General Plumbing',
      time: '9:00 AM - 11:00 AM',
      location: '789 Pine St',
      status: 'confirmed',
      notes: 'Pipe leak repair',
    },
  ],
};

const blockedDates = {
  '2024-01-20': { disabled: true, disableTouchEvent: true },
  '2024-01-21': { disabled: true, disableTouchEvent: true },
};

export default function ProviderAgenda() {
  const [selectedDate, setSelectedDate] = useState('2024-01-15');
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');

  const onDayPress = (day: DateData) => {
    setSelectedDate(day.dateString);
  };

  const getMarkedDates = () => {
    const marked: any = { ...blockedDates };
    
    Object.keys(appointments).forEach(date => {
      marked[date] = {
        ...marked[date],
        marked: true,
        dotColor: '#059669',
      };
    });

    marked[selectedDate] = {
      ...marked[selectedDate],
      selected: true,
      selectedColor: '#2563EB',
    };

    return marked;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return '#F59E0B';
      case 'confirmed':
        return '#059669';
      case 'cancelled':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const selectedAppointments = appointments[selectedDate] || [];

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Agenda</Text>
        <View style={styles.viewToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'calendar' && styles.activeToggle,
            ]}
            onPress={() => setViewMode('calendar')}
          >
            <CalendarIcon size={16} color={viewMode === 'calendar' ? '#FFFFFF' : '#6B7280'} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              viewMode === 'list' && styles.activeToggle,
            ]}
            onPress={() => setViewMode('list')}
          >
            <Text style={[
              styles.toggleText,
              { color: viewMode === 'list' ? '#FFFFFF' : '#6B7280' }
            ]}>
              List
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <View style={styles.calendarContainer}>
            <Calendar
              current={selectedDate}
              onDayPress={onDayPress}
              markedDates={getMarkedDates()}
              theme={{
                backgroundColor: '#FFFFFF',
                calendarBackground: '#FFFFFF',
                textSectionTitleColor: '#6B7280',
                selectedDayBackgroundColor: '#2563EB',
                selectedDayTextColor: '#FFFFFF',
                todayTextColor: '#2563EB',
                dayTextColor: '#111827',
                textDisabledColor: '#D1D5DB',
                dotColor: '#059669',
                selectedDotColor: '#FFFFFF',
                arrowColor: '#2563EB',
                monthTextColor: '#111827',
                indicatorColor: '#2563EB',
                textDayFontFamily: 'Inter-Regular',
                textMonthFontFamily: 'Inter-SemiBold',
                textDayHeaderFontFamily: 'Inter-Medium',
                textDayFontSize: 16,
                textMonthFontSize: 18,
                textDayHeaderFontSize: 14,
              }}
            />
          </View>
        )}

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Block Time</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, styles.primaryButton]}>
              <Text style={[styles.actionButtonText, styles.primaryButtonText]}>
                Add Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Selected Date Appointments */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {new Date(selectedDate).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
          
          {selectedAppointments.length === 0 ? (
            <View style={styles.emptyState}>
              <CalendarIcon size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No appointments</Text>
              <Text style={styles.emptySubtitle}>
                You have no appointments scheduled for this day
              </Text>
            </View>
          ) : (
            selectedAppointments.map((appointment) => (
              <View key={appointment.id} style={styles.appointmentCard}>
                <View style={styles.appointmentHeader}>
                  <View style={styles.appointmentInfo}>
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
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.appointmentActions}>
                    <TouchableOpacity style={styles.actionIcon}>
                      <CheckCircle size={20} color="#059669" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon}>
                      <X size={20} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.appointmentDetails}>
                  <View style={styles.detailRow}>
                    <User size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{appointment.customer}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Clock size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{appointment.time}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <MapPin size={16} color="#6B7280" />
                    <Text style={styles.detailText}>{appointment.location}</Text>
                  </View>
                  {appointment.notes && (
                    <View style={styles.notesContainer}>
                      <Text style={styles.notesLabel}>Notes:</Text>
                      <Text style={styles.notesText}>{appointment.notes}</Text>
                    </View>
                  )}
                </View>
              </View>
            ))
          )}
        </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  viewToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    padding: 2,
  },
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignItems: 'center',
  },
  activeToggle: {
    backgroundColor: '#059669',
  },
  toggleText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
  },
  calendarContainer: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    overflow: 'hidden',
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#111827',
    marginBottom: 16,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  actionButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  primaryButtonText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#374151',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#6B7280',
    textAlign: 'center',
  },
  appointmentCard: {
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
  },
  appointmentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  appointmentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  serviceName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#111827',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
  },
  appointmentActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    padding: 4,
  },
  appointmentDetails: {
    padding: 16,
    gap: 12,
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
    paddingTop: 12,
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
});