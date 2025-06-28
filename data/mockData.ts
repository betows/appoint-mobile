export interface User {
  id: string;
  name: string;
  email: string;
  type: 'customer' | 'provider';
  avatar: string;
  phone?: string;
  rating?: number;
  services?: string[];
  categories?: string[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
  category: string;
  description: string;
  image: string;
  providerId: string;
  rating: number;
  reviews: number;
}

export interface Professional {
  id: string;
  name: string;
  rating: number;
  services: number;
  category: string;
  avatar: string;
  description: string;
  address: string;
  backgroundImage: string;
}

export interface Appointment {
  id: string;
  service: string;
  client: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  location?: string;
}

export interface Chat {
  id: string;
  customer?: {
    name: string;
    avatar: string;
    isOnline: boolean;
  };
  provider?: {
    name: string;
    service: string;
    avatar: string;
    isOnline: boolean;
  };
  lastMessage: {
    text: string;
    time: string;
    isFromCustomer?: boolean;
    isFromProvider?: boolean;
  };
  unreadCount: number;
  bookingStatus?: string;
  service?: string;
}

// Mock Users
export const mockUsers: User[] = [
  {
    id: 'customer-1',
    name: 'João Silva',
    email: 'customer@example.com',
    type: 'customer',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    phone: '+55 (11) 88888-8888',
  },
  {
    id: 'provider-1',
    name: 'Serviços Elétricos',
    email: 'eletricista@example.com',
    type: 'provider',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    phone: '+55 (11) 99999-9999',
    rating: 4.8,
    services: ['Instalação Elétrica', 'Reparo Elétrico'],
    categories: ['Eletricista'],
  },
];

// Mock Services
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Limpeza Completa',
    price: 120,
    duration: '2h',
    category: 'Faxina',
    description: 'Limpeza completa da casa incluindo todos os cômodos, banheiros e cozinha.',
    image: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-2',
    rating: 5.0,
    reviews: 24,
  },
  {
    id: '2',
    name: 'Reparo de Encanamento',
    price: 80,
    duration: '1h30min',
    category: 'Encanador',
    description: 'Conserto de vazamentos e tubos danificados com garantia de 6 meses.',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-3',
    rating: 4.8,
    reviews: 15,
  },
  {
    id: '3',
    name: 'Instalação Elétrica',
    price: 150,
    duration: '2h30min',
    category: 'Eletricista',
    description: 'Instalação de pontos elétricos, tomadas e interruptores com material incluso.',
    image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-1',
    rating: 4.9,
    reviews: 32,
  },
];

// Mock Professionals
export const mockProfessionals: Professional[] = [
  {
    id: 'provider-1',
    name: 'Encanadores Rápidos',
    rating: 4.8,
    services: 3,
    category: 'Encanador',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Serviços de encanamento eficientes com mais de 10 anos de experiência.',
    address: 'São Paulo, SP',
    backgroundImage: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  },
  {
    id: 'provider-2',
    name: 'Casa Brilhante',
    rating: 5.0,
    services: 2,
    category: 'Faxina',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Limpeza residencial e comercial com produtos ecológicos.',
    address: 'Rio de Janeiro, RJ',
    backgroundImage: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  },
  {
    id: 'provider-3',
    name: 'Beto Encanamentos',
    rating: 4.6,
    services: 4,
    category: 'Encanador',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Especialista em reparos hidráulicos e instalações.',
    address: 'Belo Horizonte, MG',
    backgroundImage: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  },
];

// Mock Appointments
export const mockAppointments: Appointment[] = [
  {
    id: '1',
    service: 'Instalação Elétrica',
    client: 'João Silva',
    date: '11/06/2025',
    time: '10:30',
    status: 'pending',
    notes: 'Instalação de tomadas na sala',
    location: 'Rua das Flores, 123',
  },
  {
    id: '2',
    service: 'Instalação Elétrica',
    client: 'Maria Santos',
    date: '05/06/2025',
    time: '06:30',
    status: 'confirmed',
    notes: 'Troca de disjuntores',
    location: 'Av. Paulista, 456',
  },
  {
    id: '3',
    service: 'Reparo Elétrico',
    client: 'Carlos Lima',
    date: '15/06/2025',
    time: '14:00',
    status: 'completed',
    notes: 'Reparo em tomada queimada',
    location: 'Rua Augusta, 789',
  },
];

// Mock Chats for Customer
export const mockCustomerChats: Chat[] = [
  {
    id: '1',
    provider: {
      name: 'Mike Wilson',
      service: 'Plumbing',
      avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isOnline: true,
    },
    lastMessage: {
      text: 'Estarei aí em 30 minutos',
      time: '14:30',
      isFromProvider: true,
    },
    unreadCount: 2,
    bookingStatus: 'confirmed',
  },
  {
    id: '2',
    provider: {
      name: 'Sarah Johnson',
      service: 'House Cleaning',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isOnline: false,
    },
    lastMessage: {
      text: 'Obrigada por escolher nosso serviço!',
      time: '12:45',
      isFromProvider: true,
    },
    unreadCount: 0,
    bookingStatus: 'completed',
  },
];

// Mock Chats for Provider
export const mockProviderChats: Chat[] = [
  {
    id: '1',
    customer: {
      name: 'Sarah Johnson',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isOnline: true,
    },
    service: 'Kitchen Plumbing',
    lastMessage: {
      text: 'Obrigada! A pia está funcionando perfeitamente agora.',
      time: '14:30',
      isFromCustomer: true,
    },
    unreadCount: 0,
    bookingStatus: 'completed',
  },
  {
    id: '2',
    customer: {
      name: 'Mike Chen',
      avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
      isOnline: false,
    },
    service: 'Bathroom Repair',
    lastMessage: {
      text: 'Que horário funciona melhor para você amanhã?',
      time: '12:45',
      isFromCustomer: true,
    },
    unreadCount: 2,
    bookingStatus: 'confirmed',
  },
];

// Categories
export const categories = [
  {
    id: '1',
    name: 'Eletricista',
    icon: '⚡',
  },
  {
    id: '2',
    name: 'Faxina',
    icon: '🧹',
  },
  {
    id: '3',
    name: 'Encanador',
    icon: '🔧',
  },
  {
    id: '4',
    name: 'Jardinagem',
    icon: '🌱',
  },
];