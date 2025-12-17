import { Contact, Conversation, Tenant, User, AiAgent } from './types';

// Fix: Added missing 'email' property required by the User interface
export const CURRENT_USER: User = {
  id: 'me',
  name: 'Agent Smith',
  email: 'agent.smith@iads.com',
  avatar: 'https://picsum.photos/id/1005/100/100',
  role: 'superadmin', // Set to superadmin to see reseller view
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
  },
  {
    id: 'conv3',
    contactId: 'c3',
    lastMessage: 'Thanks for the help.',
    lastMessageTime: 'Mon',
    unreadCount: 0,
    status: 'resolved',
    channel: 'whatsapp',
    messages: [
      { id: 'm7', content: 'My API key is not working.', senderId: 'c3', timestamp: 'Mon', type: 'text', status: 'read' },
      { id: 'm8', content: 'Let me reset it for you.', senderId: 'me', timestamp: 'Mon', type: 'text', status: 'read' },
      { id: 'm9', content: 'Thanks for the help.', senderId: 'c3', timestamp: 'Mon', type: 'text', status: 'read' },
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
  },
  { 
    id: 't2', 
    name: 'Beta Marketing', 
    contactPerson: 'Bob Builder', 
    email: 'bob@beta.io',
    phoneNumber: '+1 555 5678',
    address: 'Austin, TX',
    plan: 'golden',
    status: 'active', 
    users: 12, 
    monthlyRevenue: 300, 
    nextBilling: '2023-11-05' 
  },
  { 
    id: 't3', 
    name: 'Gamma Sales', 
    contactPerson: 'Charlie Brown', 
    email: 'charlie@gamma.net',
    phoneNumber: '+44 20 7123 4567',
    address: 'London, UK',
    plan: 'basic',
    status: 'trial', 
    users: 2, 
    monthlyRevenue: 0, 
    nextBilling: '2023-11-15' 
  },
];

export const MOCK_AGENTS: AiAgent[] = [
  {
    id: 'a1',
    name: 'Sales Expert',
    role: 'Sales',
    description: 'Persuasive, focuses on closing deals and highlighting value.',
    systemInstruction: 'You are a top-tier Sales Representative. Your goal is to close the deal. Be persuasive, professional, and focus on the value proposition. Always try to move the conversation towards a meeting or a sale. Keep responses concise.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    isActive: true
  },
  {
    id: 'a2',
    name: 'Tech Support',
    role: 'Support',
    description: 'Patient, technical, and solution-oriented.',
    systemInstruction: 'You are a Technical Support Engineer. Be patient, clear, and step-by-step. Avoid jargon unless the user is technical. Focus on solving the problem efficiently. Empathize with the user frustration.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka',
    isActive: true
  },
  {
    id: 'a3',
    name: 'Concierge',
    role: 'General',
    description: 'Friendly, helpful, general purpose assistant.',
    systemInstruction: 'You are a friendly Concierge. Be polite, warm, and helpful. You can assist with scheduling, general questions, and providing information about the company.',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Scooby',
    isActive: true
  }
];