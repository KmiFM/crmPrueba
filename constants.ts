
import { Contact, Conversation, Tenant, User, AiAgent } from './types';

export const CURRENT_USER: User = {
  id: 'me',
  name: 'Agent Smith',
  email: 'agent.smith@iads.com',
  avatar: 'https://picsum.photos/id/1005/100/100',
  role: 'superadmin', 
};

export const MOCK_CONTACTS: Record<string, Contact> = {
  'c1': {
    id: 'c1',
    name: 'Tech Support Group',
    phoneNumber: 'N/A',
    avatar: 'https://picsum.photos/id/1/200/200',
    tags: ['support', 'high-priority'],
    notes: 'Internal dev group for quick resolution.',
    isGroup: true,
  },
  'c2': {
    id: 'c2',
    name: 'Maria Rodriguez',
    phoneNumber: '+54 9 11 1234 5678',
    email: 'maria.r@example.com',
    avatar: 'https://picsum.photos/id/64/200/200',
    tags: ['sales', 'lead'],
    notes: 'Interested in the Enterprise plan. Need to follow up next Tuesday.',
    company: 'Logistics SA',
    isGroup: false,
  },
  'c3': {
    id: 'c3',
    name: 'John Doe',
    phoneNumber: '+1 555 0199',
    avatar: 'https://picsum.photos/id/103/200/200',
    tags: ['complaint'],
    notes: 'Reporting an issue with the API integration.',
    isGroup: false,
  }
};

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: 'conv1',
    contactId: 'c1',
    lastMessage: 'Server is down, checking logs...',
    lastMessageTime: '10:30 AM',
    unreadCount: 2,
    status: 'open',
    channel: 'whatsapp',
    messages: [
      { id: 'm1', content: 'Hey team, anyone seeing 500 errors?', senderId: 'c1', timestamp: '10:28 AM', type: 'text', status: 'read' },
      { id: 'm2', content: 'Checking now.', senderId: 'me', timestamp: '10:29 AM', type: 'text', status: 'read' },
      { id: 'm3', content: 'Server is down, checking logs...', senderId: 'c1', timestamp: '10:30 AM', type: 'text', status: 'read' },
    ]
  },
  {
    id: 'conv2',
    contactId: 'c2',
    lastMessage: 'Is the pricing flexible?',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    status: 'open',
    channel: 'whatsapp',
    messages: [
      { id: 'm4', content: 'Hello! I saw your ad for the CRM.', senderId: 'c2', timestamp: 'Yesterday', type: 'text', status: 'read' },
      { id: 'm5', content: 'Hi Maria! Yes, how can I help you today?', senderId: 'me', timestamp: 'Yesterday', type: 'text', status: 'read' },
      { id: 'm6', content: 'Is the pricing flexible?', senderId: 'c2', timestamp: 'Yesterday', type: 'text', status: 'read' },
    ]
  }
];

export const MOCK_TENANTS: Tenant[] = [
  { 
    id: 't1', 
    name: 'Alpha Agency', 
    contactPerson: 'Alice Vancity', 
    email: 'alice@alpha.com',
    phoneNumber: '+1 555 1234',
    address: 'Vancouver, BC',
    plan: 'pro',
    status: 'active', 
    users: 5, 
    monthlyRevenue: 200, 
    nextBilling: '2023-11-01' 
  }
];

export const MOCK_AGENTS: AiAgent[] = [
  {
    id: 'a1',
    name: 'Cierre Maestro',
    role: 'Ventas',
    description: 'Enfocado en persuasión y agendar demos.',
    systemInstruction: 'Eres un experto en ventas. Tu objetivo es convencer al cliente de que nuestro CRM es la mejor opción y agendar una llamada. Sé amable pero directo.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    isActive: true,
    isAutoReplyEnabled: true
  },
  {
    id: 'a2',
    name: 'Soporte 24/7',
    role: 'Soporte',
    description: 'Resuelve dudas técnicas y problemas comunes.',
    systemInstruction: 'Eres un técnico de soporte. Ayuda al usuario con paciencia. Si el problema es grave, pide sus datos para escalarlo.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    isActive: true,
    isAutoReplyEnabled: false
  }
];
