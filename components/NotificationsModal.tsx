import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Circle as XCircle, CircleCheck as CheckCircle, Info } from 'lucide-react-native';
import { useNotification } from '@/contexts/NotificationContext';

export default function NotificationsModal() {
  const { notifications, removeNotification } = useNotification();

  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={notifications.length > 0}
    >
      <View style={styles.modalContainer}>
        <View style={styles.notificationContainer}>
          {notifications.map((notif) => (
            <View
              key={notif.id}
              style={[
                styles.notificationCard,
                notif.type === 'success' && styles.successCard,
                notif.type === 'error' && styles.errorCard,
                notif.type === 'info' && styles.infoCard,
              ]}
            >
              {notif.type === 'success' && <CheckCircle size={20} color="#10B981" />}
              {notif.type === 'error' && <XCircle size={20} color="#EF4444" />}
              {notif.type === 'info' && <Info size={20} color="#3B82F6" />}
              <Text style={styles.notificationText}>{notif.message}</Text>
              <TouchableOpacity onPress={() => removeNotification(notif.id)} style={styles.closeButton}>
                <XCircle size={16} color="#9CA3AF" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  notificationContainer: {
    width: '90%',
    marginBottom: 20,
  },
  notificationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  successCard: {
    borderLeftColor: '#10B981',
    borderLeftWidth: 4,
  },
  errorCard: {
    borderLeftColor: '#EF4444',
    borderLeftWidth: 4,
  },
  infoCard: {
    borderLeftColor: '#3B82F6',
    borderLeftWidth: 4,
  },
  notificationText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  closeButton: {
    marginLeft: 10,
    padding: 5,
  },
});