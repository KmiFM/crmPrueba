import React, { useState, useRef, useEffect } from 'react';
import { MOCK_CONVERSATIONS, MOCK_CONTACTS, MOCK_AGENTS } from '../constants';
import { Conversation, Message } from '../types';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, CheckCheck, Sparkles, Bot } from 'lucide-react';
import { getSmartReply, analyzeSentiment } from '../services/geminiService';

const Inbox = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [sentiment, setSentiment] = useState<string>('Analyzing...');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(MOCK_AGENTS[0].id);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConvId);
  const selectedContact = selectedConversation ? MOCK_CONTACTS[selectedConversation.contactId] : null;
  const activeAgent = MOCK_AGENTS.find(a => a.id === selectedAgentId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    if (selectedConversation) {
        setSentiment("Analyzing...");
        analyzeSentiment(selectedConversation.messages).then(setSentiment);
    }
  }, [selectedConversation]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedConvId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent'
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: inputText,
          lastMessageTime: 'Now'
        };
      }
      return c;
    }));

    setInputText('');
  };

  const generateAIResponse = async () => {
    if (!selectedConversation || !selectedContact || !activeAgent) return;
    setIsAiLoading(true);
    
    // Pass the active agent's specific instruction
    const suggestion = await getSmartReply(
        selectedConversation.messages, 
        selectedContact.notes, 
        activeAgent.systemInstruction
    );
    
    setInputText(suggestion);
    setIsAiLoading(false);
  };

  return (
    <div className="flex h-full bg-white border-t border-slate-200">
      {/* Sidebar: Chat List */}
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Inbox</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search conversations..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg bg-slate-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all text-sm outline-none"
                />
            </div>
            <div className="flex gap-2 mt-4">
                <button className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-700">All</button>
                <button className="px-3 py-1 text-xs font-medium rounded-full hover:bg-slate-100 text-slate-600">Unread</button>
                <button className="px-3 py-1 text-xs font-medium rounded-full hover:bg-slate-100 text-slate-600">Groups</button>
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => {
                const contact = MOCK_CONTACTS[conv.contactId];
                return (
                    <div 
                        key={conv.id}
                        onClick={() => setSelectedConvId(conv.id)}
                        className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConvId === conv.id ? 'bg-blue-50/50 border-l-4 border-l-blue-500' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-3">
                                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover" />
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-sm">{contact.name}</h3>
                                    <span className="text-xs text-slate-400 capitalize">{conv.channel} • {contact.isGroup ? 'Group' : 'Direct'}</span>
                                </div>
                            </div>
                            <span className="text-xs text-slate-400 whitespace-nowrap">{conv.lastMessageTime}</span>
                        </div>
                        <div className="flex justify-between items-center pl-14">
                            <p className="text-sm text-slate-500 truncate max-w-[180px]">{conv.lastMessage}</p>
                            {conv.unreadCount > 0 && (
                                <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[1.25rem] text-center">
                                    {conv.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/50">
        {selectedConversation && selectedContact ? (
            <>
                <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                         <img src={selectedContact.avatar} alt={selectedContact.name} className="w-9 h-9 rounded-full object-cover" />
                         <div>
                            <h3 className="font-semibold text-slate-800 leading-tight">{selectedContact.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-500">
                                    {selectedContact.isGroup ? `${selectedContact.tags.length + 1} participants` : selectedContact.phoneNumber}
                                </span>
                                <span className={`text-[10px] px-1.5 rounded-md border ${sentiment === 'Negative' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                    Sentiment: {sentiment}
                                </span>
                            </div>
                         </div>
                    </div>
                    <div className="flex items-center gap-4 text-slate-400">
                        <button className="hover:text-slate-600"><Phone className="w-5 h-5" /></button>
                        <button className="hover:text-slate-600"><Search className="w-5 h-5" /></button>
                        <button className="hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50">
                    {selectedConversation.messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.senderId === 'me' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm text-sm ${
                                msg.senderId === 'me' 
                                    ? 'bg-blue-600 text-white rounded-br-none' 
                                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                            }`}>
                                <p>{msg.content}</p>
                                <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${msg.senderId === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>
                                    <span>{msg.timestamp}</span>
                                    {msg.senderId === 'me' && <CheckCheck className="w-3 h-3" />}
                                </div>
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex items-center gap-2 mb-2 px-1">
                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">AI Assistant:</span>
                        <div className="flex gap-2">
                             {MOCK_AGENTS.filter(a => a.isActive).map(agent => (
                                 <button
                                    key={agent.id}
                                    onClick={() => setSelectedAgentId(agent.id)}
                                    className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs transition-colors border ${
                                        selectedAgentId === agent.id 
                                        ? 'bg-purple-50 text-purple-700 border-purple-200 font-medium' 
                                        : 'bg-white text-slate-500 border-slate-200 hover:border-purple-200'
                                    }`}
                                 >
                                    <img src={agent.avatar} alt="" className="w-4 h-4 rounded-full" />
                                    {agent.name}
                                 </button>
                             ))}
                        </div>
                    </div>
                    <div className="relative flex items-end gap-2 bg-slate-100 rounded-xl p-2 border border-slate-200 focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-400 transition-all">
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors">
                            <Smile className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-lg transition-colors">
                            <Paperclip className="w-5 h-5" />
                        </button>
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder={`Message as ${activeAgent?.name || 'Agent'}...`}
                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none max-h-32 min-h-[44px] py-3 text-sm text-slate-800 placeholder-slate-400"
                            rows={1}
                        />
                         <button 
                            onClick={generateAIResponse}
                            disabled={isAiLoading}
                            className={`p-2 rounded-lg transition-colors flex items-center gap-1 ${isAiLoading ? 'text-purple-300 bg-purple-50' : 'text-purple-600 bg-purple-50 hover:bg-purple-100'}`}
                            title={`Generate reply using ${activeAgent?.name}`}
                        >
                            <Sparkles className={`w-5 h-5 ${isAiLoading ? 'animate-pulse' : ''}`} />
                            <span className="text-xs font-semibold hidden lg:inline">AI Draft</span>
                        </button>
                        <button 
                            onClick={handleSendMessage}
                            disabled={!inputText.trim()}
                            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex justify-between items-center mt-2 px-1">
                        <span className="text-[10px] text-slate-400">Press Enter to send, Shift + Enter for new line</span>
                         <span className="text-[10px] text-slate-400 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> WhatsApp Business API Connected
                         </span>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-slate-300" />
                </div>
                <p>Select a conversation to start messaging</p>
            </div>
        )}
      </div>

      {/* Right Sidebar: Contact Details (CRM Info) */}
      {selectedContact && (
          <div className="w-80 border-l border-slate-200 bg-white h-full overflow-y-auto hidden xl:block">
            <div className="p-6 text-center border-b border-slate-100">
                <img src={selectedContact.avatar} alt={selectedContact.name} className="w-24 h-24 rounded-full mx-auto mb-4 object-cover" />
                <h2 className="text-lg font-bold text-slate-800">{selectedContact.name}</h2>
                <p className="text-sm text-slate-500">{selectedContact.company || 'Individual Customer'}</p>
                <div className="flex justify-center gap-2 mt-4">
                    <button className="flex-1 bg-blue-50 text-blue-600 text-xs font-medium py-2 rounded-lg hover:bg-blue-100 transition">Profile</button>
                    <button className="flex-1 border border-slate-200 text-slate-600 text-xs font-medium py-2 rounded-lg hover:bg-slate-50 transition">Tickets</button>
                </div>
            </div>
            
            <div className="p-6 space-y-6">
                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Contact Info</h4>
                    <div className="space-y-3">
                        <div className="flex items-start gap-3">
                             <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                             <div>
                                 <p className="text-sm text-slate-800 font-medium">{selectedContact.phoneNumber}</p>
                                 <p className="text-xs text-slate-400">Mobile</p>
                             </div>
                        </div>
                        {selectedContact.email && (
                            <div className="flex items-start gap-3">
                                <Send className="w-4 h-4 text-slate-400 mt-0.5" />
                                <div>
                                    <p className="text-sm text-slate-800 font-medium">{selectedContact.email}</p>
                                    <p className="text-xs text-slate-400">Email</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                        {selectedContact.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                                {tag}
                            </span>
                        ))}
                        <button className="px-2.5 py-1 rounded-md border border-dashed border-slate-300 text-slate-400 text-xs hover:border-slate-400 hover:text-slate-600 transition">+ Add</button>
                    </div>
                </div>

                <div>
                    <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Notes</h4>
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100">
                        <p className="text-sm text-yellow-800 leading-relaxed">{selectedContact.notes}</p>
                    </div>
                </div>
            </div>
          </div>
      )}
    </div>
  );
};

export default Inbox;