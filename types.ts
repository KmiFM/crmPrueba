
export interface User {
  id: string;
  name: string;
  avatar: string;
  role: 'agent' | 'admin' | 'superadmin';
}

export interface Message {
  id: string;
  content: string;
  senderId: string; // 'me' or contactId
  timestamp: string;
  type: 'text' | 'image' | 'audio';
  status: 'sent' | 'delivered' | 'read' | 'scheduled';
  aiAgentId?: string;
  scheduledAt?: string; // ISO Date string for scheduled messages
}

export interface Contact {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  avatar: string;
  tags: string[];
  notes: string;
  company?: string;
  isGroup: boolean;
}

export interface Conversation {
  id: string;
  contactId: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  status: 'open' | 'snoozed' | 'resolved';
  channel: 'whatsapp';
  messages: Message[];
}

export interface Tenant {
  id: string;
  name: string;
  contactPerson: string;
  status: 'active' | 'trial' | 'suspended';
  users: number;
  monthlyRevenue: number;
  nextBilling: string;
}

export interface AiAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemInstruction: string;
  avatar: string;
  isActive: boolean;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface WhatsAppConfig {
  provider: 'cloud' | 'evolution';
  // Cloud API Specifics
  phoneNumberId?: string;
  businessAccountId?: string;
  accessToken?: string;
  // Evolution API Specifics
  baseUrl?: string;
  apiKey?: string;
  instanceName?: string;
  // Common
  webhookUrl: string;
  verifyToken: string;
  status: 'connected' | 'disconnected' | 'validating' | 'qr_ready';
}
