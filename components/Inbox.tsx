import React, { useState, useRef, useEffect } from 'react';
import { MOCK_CONVERSATIONS, MOCK_CONTACTS, MOCK_AGENTS } from '../constants';
import { Conversation, Message } from '../types';
import { Search, Send, Paperclip, Smile, MoreVertical, Phone, CheckCheck, Sparkles, Bot, X, Clock, Calendar, ChevronDown } from 'lucide-react';
import { getSmartReply, analyzeSentiment } from '../services/geminiService';

const Inbox = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [sentiment, setSentiment] = useState<string>('Analyzing...');
  const [selectedAgentId, setSelectedAgentId] = useState<string>(MOCK_AGENTS[0].id);
  const [draftAgentId, setDraftAgentId] = useState<string | null>(null);
  
  // Scheduling State
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [scheduleDateTime, setScheduleDateTime] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedConversation = conversations.find(c => c.id === selectedConvId);
  const selectedContact = selectedConversation ? MOCK_CONTACTS[selectedConversation.contactId] : null;
  const activeAgent = MOCK_AGENTS.find(a => a.id === selectedAgentId);
  const draftAgent = draftAgentId ? MOCK_AGENTS.find(a => a.id === draftAgentId) : null;

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

  const handleSendMessage = (scheduledTime?: string) => {
    if (!inputText.trim() || !selectedConvId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: scheduledTime ? 'scheduled' : 'sent',
      aiAgentId: draftAgentId || undefined,
      scheduledAt: scheduledTime
    };

    setConversations(prev => prev.map(c => {
      if (c.id === selectedConvId) {
        return {
          ...c,
          messages: [...c.messages, newMessage],
          lastMessage: scheduledTime ? `Scheduled: ${inputText}` : inputText,
          lastMessageTime: 'Now'
        };
      }
      return c;
    }));

    setInputText('');
    setDraftAgentId(null);
    setIsScheduleModalOpen(false);
    setScheduleDateTime('');
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
    setDraftAgentId(activeAgent.id);
    setIsAiLoading(false);
  };

  return (
    <div className="flex h-full bg-white border-t border-slate-200 relative">
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
      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/50 relative">
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
                    {selectedConversation.messages.map((msg) => {
                        const messageAgent = msg.aiAgentId ? MOCK_AGENTS.find(a => a.id === msg.aiAgentId) : null;
                        const isScheduled = msg.status === 'scheduled';
                        
                        return (
                            <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                                {messageAgent && msg.senderId === 'me' && (
                                    <div className="flex items-center gap-1.5 mb-1 mr-1">
                                        <span className="text-[10px] text-slate-400 font-medium">{messageAgent.name}</span>
                                        <img src={messageAgent.avatar} alt={messageAgent.name} className="w-4 h-4 rounded-full border border-slate-200" />
                                    </div>
                                )}
                                <div className={`max-w-[70%] rounded-2xl px-4 py-3 shadow-sm text-sm relative ${
                                    isScheduled
                                        ? 'bg-amber-50 border border-amber-200 border-dashed text-slate-800 rounded-br-none'
                                        : msg.senderId === 'me' 
                                            ? 'bg-blue-600 text-white rounded-br-none' 
                                            : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                }`}>
                                    <p>{msg.content}</p>
                                    <div className={`flex items-center justify-end gap-1 mt-1 text-[10px] ${
                                        isScheduled ? 'text-amber-600' : msg.senderId === 'me' ? 'text-blue-200' : 'text-slate-400'
                                    }`}>
                                        {isScheduled && <Clock className="w-3 h-3 mr-1" />}
                                        <span>
                                            {isScheduled && msg.scheduledAt 
                                                ? `Scheduled: ${new Date(msg.scheduledAt).toLocaleDateString()} ${new Date(msg.scheduledAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`
                                                : msg.timestamp
                                            }
                                        </span>
                                        {!isScheduled && msg.senderId === 'me' && <CheckCheck className="w-3 h-3" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-200 relative z-10">
                    <div className="flex items-center gap-2 mb-2 px-1 justify-between">
                         <div className="flex items-center gap-2">
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
                         {draftAgentId && inputText && (
                             <div className="flex items-center gap-2 text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-100 animate-in fade-in slide-in-from-bottom-2">
                                 <Bot className="w-3 h-3" />
                                 <span>Draft by {draftAgent?.name}</span>
                                 <button onClick={() => setDraftAgentId(null)} className="hover:text-emerald-900"><X className="w-3 h-3" /></button>
                             </div>
                         )}
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
                            onChange={(e) => {
                                setInputText(e.target.value);
                                if (e.target.value === '') setDraftAgentId(null);
                            }}
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
                        
                        {/* Schedule Button */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsScheduleModalOpen(!isScheduleModalOpen)}
                                className={`p-2 rounded-lg transition-colors ${isScheduleModalOpen ? 'bg-amber-100 text-amber-600' : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'}`}
                                title="Schedule Message"
                            >
                                <Clock className="w-5 h-5" />
                            </button>
                        </div>

                        <button 
                            onClick={() => handleSendMessage()}
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

                {/* Schedule Modal/Popover */}
                {isScheduleModalOpen && (
                    <div className="absolute bottom-24 right-8 z-50 bg-white p-4 rounded-xl shadow-xl border border-slate-200 w-72 animate-in slide-in-from-bottom-5 fade-in">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="font-semibold text-slate-800 text-sm flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-amber-500" /> Schedule Message
                            </h4>
                            <button onClick={() => setIsScheduleModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">Pick Date & Time</label>
                                <input 
                                    type="datetime-local" 
                                    value={scheduleDateTime}
                                    onChange={(e) => setScheduleDateTime(e.target.value)}
                                    className="w-full text-sm border border-slate-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-amber-500"
                                />
                            </div>
                            <button 
                                onClick={() => handleSendMessage(scheduleDateTime)}
                                disabled={!inputText.trim() || !scheduleDateTime}
                                className="w-full bg-amber-500 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Clock className="w-4 h-4" /> Confirm Schedule
                            </button>
                        </div>
                        <div className="mt-3 pt-3 border-t border-slate-100">
                             <p className="text-[10px] text-slate-400 text-center">Message will be sent automatically at the selected time.</p>
                        </div>
                    </div>
                )}
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