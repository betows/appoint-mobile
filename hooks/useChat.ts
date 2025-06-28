import { useState, useEffect, useRef, useCallback } from 'react';
import io, { Socket } from 'socket.io-client';
import { useAuth } from '@/contexts/AuthContext';

interface ChatMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text: string;
  roomId: string;
  timestamp?: string;
  files?: string[];
}

interface Room {
  _id: string;
  users: string[];
  createdAt: string;
}

const API_BASE_URL = 'http://localhost:5000'; // Socket.IO server URL

export const useChat = () => {
  const { user } = useAuth();
  const socketRef = useRef<Socket | null>(null);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  const setupListeners = useCallback(() => {
    if (!socketRef.current) return;

    socketRef.current.on('connect', () => {
      console.log('✅ Socket connected');
      if (userId) {
        socketRef.current?.emit('getRooms');
      }
    });

    socketRef.current.on('roomList', (list: Room[]) => {
      console.log('📦 Rooms received:', list);
      setRooms(list);
    });

    socketRef.current.on('roomCreated', (room: Room) => {
      console.log('🎉 Room created:', room);
      setRooms((prevRooms) => [...prevRooms, room]);
    });

    socketRef.current.on('previousMessages', (msgs: ChatMessage[]) => {
      const roomId = msgs[0]?.roomId;
      if (!roomId) return;

      setMessages((prevMessages) => {
        const filteredMessages = prevMessages.filter((m) => m.roomId !== roomId);
        return [...filteredMessages, ...msgs];
      });
    });

    socketRef.current.on('newMessage', (msg: ChatMessage) => {
      console.log('📩 New message:', msg);
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    socketRef.current.on('connect_error', (err) => {
      console.error('🚨 Socket connection failed:', err);
    });

    socketRef.current.on('disconnect', () => {
      console.log('🔌 Socket disconnected');
    });
  }, [userId]);

  const connect = useCallback(() => {
    if (socketRef.current && socketRef.current.connected) return;

    if (!user || !user.token || !user.id) {
      console.warn('User or token not available for chat connection.');
      return;
    }

    setUserId(user.id);

    socketRef.current = io(API_BASE_URL, {
      transports: ['websocket'],
      auth: { token: `Bearer ${user.token}` },
    });

    setupListeners();
  }, [user, setupListeners]);

  const joinRoom = useCallback((roomId: string) => {
    if (!socketRef.current) return;

    if (currentRoomId && currentRoomId !== roomId) {
      leaveRoom();
    }

    setCurrentRoomId(roomId);
    socketRef.current.emit('joinRoom', { roomId });
  }, [currentRoomId]);

  const sendMessage = useCallback((receiverId: string, text: string, files: string[] = []) => {
    if (!socketRef.current || !currentRoomId || !text.trim()) return;

    socketRef.current.emit(
      'sendMessage',
      {
        roomId: currentRoomId,
        receiverId,
        text,
        files,
      },
      (response: any) => {
        if (response?.status === 'success') {
          console.log('✅ Message acknowledged');
        } else if (response?.message) {
          console.warn('❌ Message failed:', response.message);
        }
      }
    );
  }, [currentRoomId]);

  const fetchPreviousMessagesAsync = useCallback((roomId: string): Promise<ChatMessage[]> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve([]);

      const handler = (msgs: ChatMessage[]) => {
        const matchingRoomId = msgs[0]?.roomId;
        if (matchingRoomId === roomId) {
          socketRef.current?.off('previousMessages', handler);
          setMessages((prevMessages) => {
            const filteredMessages = prevMessages.filter((m) => m.roomId !== roomId);
            return [...filteredMessages, ...msgs];
          });
          resolve(msgs);
        }
      };

      socketRef.current.on('previousMessages', handler);
      socketRef.current.emit('joinRoom', { roomId });
    });
  }, []);

  const createRoom = useCallback((targetUserId: string): Promise<Room | null> => {
    return new Promise((resolve) => {
      if (!socketRef.current) return resolve(null);
      socketRef.current.emit('createRoom', { targetUserId });
      socketRef.current.once('roomCreated', (room: Room) => resolve(room));
    });
  }, []);

  const leaveRoom = useCallback(() => {
    if (!socketRef.current || !currentRoomId) return;

    console.log('🚪 Leaving room:', currentRoomId);
    socketRef.current.emit('leaveRoom', { roomId: currentRoomId });

    setCurrentRoomId(null);
  }, [currentRoomId]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  return {
    connect,
    joinRoom,
    sendMessage,
    createRoom,
    leaveRoom,
    fetchPreviousMessagesAsync,
    rooms,
    messages,
    currentRoomId,
    userId,
  };
};
