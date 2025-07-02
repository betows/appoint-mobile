import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { X, Star } from 'lucide-react-native';
import api from '@/services/api';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewModalProps {
  isVisible: boolean;
  onClose: () => void;
  onReviewSubmitted: () => void;
  serviceId: string;
  providerId: string;
}

export default function ReviewModal({ isVisible, onClose, onReviewSubmitted, serviceId, providerId }: ReviewModalProps) {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmitReview = async () => {
    if (!user?.token) {
      Alert.alert('Erro', 'Usuário não autenticado.');
      return;
    }
    if (rating === 0) {
      Alert.alert('Erro', 'Por favor, selecione uma avaliação.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/ratings', {
        serviceId,
        providerId,
        rating,
        comment,
      }, user.token);
      Alert.alert('Sucesso', 'Avaliação enviada com sucesso!');
      onReviewSubmitted();
      onClose();
    } catch (error) {
      console.error('Failed to submit review:', error);
      Alert.alert('Erro', 'Falha ao enviar avaliação. Tente novamente.');
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
            <Text style={styles.modalTitle}>Avaliar Serviço</Text>
            <TouchableOpacity onPress={onClose}>
              <X size={24} color="#111827" />
            </TouchableOpacity>
          </View>

          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Star
                  size={40}
                  color={star <= rating ? '#F59E0B' : '#D1D5DB'}
                  fill={star <= rating ? '#F59E0B' : 'none'}
                />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            style={styles.commentInput}
            placeholder="Deixe seu comentário (opcional)"
            placeholderTextColor="#9CA3AF"
            multiline
            numberOfLines={4}
            value={comment}
            onChangeText={setComment}
          />

          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmitReview}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.submitButtonText}>Enviar Avaliação</Text>
            )}
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
  ratingContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  commentInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 20,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#111827',
  },
  submitButton: {
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    width: '100%',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#FFFFFF',
  },
});
