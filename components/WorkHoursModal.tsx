import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { X } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/services/api';

interface WorkHoursModalProps {
  isVisible: boolean;
  onClose: () => void;
  onSave: () => void;
}

interface WorkingHours {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const daysOfWeek = [
  { id: 0, name: 'Domingo' },
  { id: 1, name: 'Segunda' },
  { id: 2, name: 'Terça' },
  { id: 3, name: 'Quarta' },
  { id: 4, name: 'Quinta' },
  { id: 5, name: 'Sexta' },
  { id: 6, name: 'Sábado' },
];

export default function WorkHoursModal({ isVisible, onClose, onSave }: WorkHoursModalProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [workingHours, setWorkingHours] = useState<WorkingHours[]>([]);

  useEffect(() => {
    if (isVisible && user?.token) {
      fetchWorkingHours();
    }
  }, [isVisible, user?.token, fetchWorkingHours]);

  const fetchWorkingHours = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get(`/providers/working-hours`, user.token);
      setWorkingHours(response.workingHours || []);
    } catch (error) {
      console.error('Failed to fetch working hours:', error);
      Alert.alert('Erro', 'Falha ao carregar horários de trabalho.');
    } finally {
      setLoading(false);
    }
  }, [user?.token, setLoading, setWorkingHours]);

  const handleTimeChange = (dayId: number, type: 'start' | 'end', time: string) => {
    setWorkingHours(prev => {
      const existing = prev.find(wh => wh.dayOfWeek === dayId);
      if (existing) {
        return prev.map(wh =>
          wh.dayOfWeek === dayId
            ? { ...wh, [type === 'start' ? 'startTime' : 'endTime']: time }
            : wh
        );
      } else {
        return [
          ...prev,
          {
            dayOfWeek: dayId,
            startTime: type === 'start' ? time : '',
            endTime: type === 'end' ? time : '',
          },
        ];
      }
    });
  };

  const handleSave = async () => {
    if (!user?.token) return;
    setLoading(true);
    try {
      await api.post(`/providers/working-hours`, { workingHours }, user.token);
      Alert.alert('Sucesso', 'Horários de trabalho salvos com sucesso!');
      onSave();
      onClose();
    } catch (error) {
      console.error('Failed to save working hours:', error);
      Alert.alert('Erro', 'Falha ao salvar horários de trabalho.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Definir Horários de Trabalho</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#10B981" style={{ marginVertical: 20 }} />
          ) : (
            <View style={styles.hoursContainer}>
              {daysOfWeek.map((day) => {
                const currentHours = workingHours.find(wh => wh.dayOfWeek === day.id);
                return (
                  <View key={day.id} style={styles.dayRow}>
                    <Text style={styles.dayName}>{day.name}</Text>
                    <View style={styles.timeInputs}>
                      <TextInput
                        style={styles.timeInput}
                        placeholder="09:00"
                        value={currentHours?.startTime || ''}
                        onChangeText={(text) => handleTimeChange(day.id, 'start', text)}
                        keyboardType="numbers-and-punctuation"
                      />
                      <Text style={styles.timeSeparator}>-</Text>
                      <TextInput
                        style={styles.timeInput}
                        placeholder="18:00"
                        value={currentHours?.endTime || ''}
                        onChangeText={(text) => handleTimeChange(day.id, 'end', text)}
                        keyboardType="numbers-and-punctuation"
                      />
                    </View>
                  </View>
                );
              })}
            </View>
          )}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
            <Text style={styles.saveButtonText}>Salvar Horários</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.25)',
    elevation: 5,
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#111827',
  },
  hoursContainer: {
    width: '100%',
    marginBottom: 20,
  },
  dayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  dayName: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#374151',
  },
  timeInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  timeInput: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    width: 70,
    textAlign: 'center',
    fontSize: 16,
    fontFamily: 'Inter-Regular',
  },
  timeSeparator: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#6B7280',
  },
  saveButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});
