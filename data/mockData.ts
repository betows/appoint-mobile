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

// Mock Services - Expanded with more variety
export const mockServices: Service[] = [
  {
    id: '1',
    name: 'Limpeza Completa Residencial',
    price: 120,
    duration: '2h',
    category: 'Faxina',
    description: 'Limpeza completa da casa incluindo todos os cômodos, banheiros e cozinha com produtos ecológicos.',
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
    name: 'Instalação Elétrica Completa',
    price: 150,
    duration: '2h30min',
    category: 'Eletricista',
    description: 'Instalação de pontos elétricos, tomadas e interruptores com material incluso.',
    image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-1',
    rating: 4.9,
    reviews: 32,
  },
  {
    id: '4',
    name: 'Manutenção de Jardim',
    price: 90,
    duration: '2h',
    category: 'Jardinagem',
    description: 'Poda, limpeza e manutenção geral do jardim com ferramentas profissionais.',
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-4',
    rating: 4.7,
    reviews: 18,
  },
  {
    id: '5',
    name: 'Limpeza Pós-Obra',
    price: 200,
    duration: '4h',
    category: 'Faxina',
    description: 'Limpeza especializada após reformas e construções.',
    image: 'https://images.pexels.com/photos/4239013/pexels-photo-4239013.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-2',
    rating: 4.9,
    reviews: 12,
  },
  {
    id: '6',
    name: 'Reparo Elétrico Emergencial',
    price: 100,
    duration: '1h',
    category: 'Eletricista',
    description: 'Atendimento 24h para emergências elétricas.',
    image: 'https://images.pexels.com/photos/162553/keys-workshop-mechanic-tools-162553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-1',
    rating: 4.6,
    reviews: 28,
  },
  {
    id: '7',
    name: 'Desentupimento de Pia',
    price: 60,
    duration: '45min',
    category: 'Encanador',
    description: 'Desentupimento rápido e eficiente de pias e ralos.',
    image: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-3',
    rating: 4.5,
    reviews: 22,
  },
  {
    id: '8',
    name: 'Plantio e Paisagismo',
    price: 180,
    duration: '3h',
    category: 'Jardinagem',
    description: 'Criação e implementação de projetos paisagísticos.',
    image: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    providerId: 'provider-4',
    rating: 4.8,
    reviews: 15,
  },
];

// Mock Professionals - Expanded
export const mockProfessionals: Professional[] = [
  {
    id: 'provider-1',
    name: 'ElétricaPro Serviços',
    rating: 4.9,
    services: 5,
    category: 'Eletricista',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Serviços elétricos profissionais com mais de 15 anos de experiência.',
    address: 'São Paulo, SP',
    backgroundImage: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  },
  {
    id: 'provider-2',
    name: 'Casa Brilhante Limpeza',
    rating: 5.0,
    services: 4,
    category: 'Faxina',
    avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Limpeza residencial e comercial com produtos ecológicos e equipe treinada.',
    address: 'Rio de Janeiro, RJ',
    backgroundImage: 'https://images.pexels.com/photos/4239146/pexels-photo-4239146.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  },
  {
    id: 'provider-3',
    name: 'Hidráulica Express',
    rating: 4.7,
    services: 6,
    category: 'Encanador',
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Especialista em reparos hidráulicos e instalações com atendimento 24h.',
    address: 'Belo Horizonte, MG',
    backgroundImage: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  },
  {
    id: 'provider-4',
    name: 'Verde Vida Jardinagem',
    rating: 4.8,
    services: 3,
    category: 'Jardinagem',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Cuidados especializados para jardins e áreas verdes.',
    address: 'Curitiba, PR',
    backgroundImage: 'https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  },
  {
    id: 'provider-5',
    name: 'Encanadores Rápidos',
    rating: 4.6,
    services: 4,
    category: 'Encanador',
    avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Serviços de encanamento rápidos e eficientes.',
    address: 'Porto Alegre, RS',
    backgroundImage: 'https://images.pexels.com/photos/1108572/pexels-photo-1108572.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
  },
  {
    id: 'provider-6',
    name: 'TechEletric Solutions',
    rating: 4.8,
    services: 7,
    category: 'Eletricista',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=2',
    description: 'Soluções elétricas modernas e sustentáveis.',
    address: 'Brasília, DF',
    backgroundImage: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
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