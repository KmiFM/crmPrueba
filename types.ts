
export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar: string;
  role: 'agent' | 'admin' | 'superadmin';
  tenantId?: string; 
  phone?: string; // New: Contact method
}

export interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: string;
  type: 'text' | 'image' | 'audio';
  status: 'sent' | 'delivered' | 'read' | 'scheduled';
  aiAgentId?: string;
  isAutoReplied?: boolean;
  scheduledAt?: string;
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
  email: string;
  phoneNumber: string;
  address?: string;
  plan: 'basic' | 'pro' | 'golden';
  status: 'active' | 'trial' | 'suspended';
  users: number;
  monthlyRevenue: number;
  nextBilling: string;
  adminEmail?: string;
  adminPassword?: string;
  logoUrl?: string; // New: White label logo
}

export interface AiAgent {
  id: string;
  name: string;
  role: string;
  description: string;
  systemInstruction: string;
  avatar: string;
  isActive: boolean;
  isAutoReplyEnabled: boolean;
}

export interface WhatsAppConfig {
  provider: 'cloud' | 'evolution';
  phoneNumberId?: string;
  businessAccountId?: string;
  accessToken?: string;
  baseUrl?: string;
  apiKey?: string;
  instanceName?: string;
  webhookUrl: string;
  verifyToken: string;
  status: 'connected' | 'disconnected' | 'validating' | 'qr_ready';
}
