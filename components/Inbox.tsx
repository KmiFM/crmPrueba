
import React, { useState, useRef, useEffect } from 'react';
import { MOCK_CONVERSATIONS, MOCK_CONTACTS, MOCK_AGENTS } from '../constants';
import { Conversation, Message, AiAgent } from '../types';
import { Search, Send, Paperclip, Smile, Phone, CheckCheck, Sparkles, Bot, X, Clock, AlertCircle, Cpu, Loader2 } from 'lucide-react';
import { getSmartReply, analyzeSentiment } from '../services/geminiService';

const Inbox = () => {
  const [conversations, setConversations] = useState<Conversation[]>(MOCK_CONVERSATIONS);
  const [selectedConvId, setSelectedConvId] = useState<string | null>(MOCK_CONVERSATIONS[0].id);
  const [inputText, setInputText] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAutoTyping, setIsAutoTyping] = useState(false);
  const [sentiment, setSentiment] = useState<string>('Analyzing...');
  
  const activeAgents = MOCK_AGENTS.filter(a => a.isActive);
  const autoAgent = MOCK_AGENTS.find(a => a.isActive && a.isAutoReplyEnabled);
  
  const [selectedAgentId, setSelectedAgentId] = useState<string>(activeAgents.length > 0 ? activeAgents[0].id : '');
  const [draftAgentId, setDraftAgentId] = useState<string | null>(null);
  
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
        
        // AUTO-REPLY LOGIC SIMULATION
        // If the last message is from the customer and autoAgent is enabled
        const lastMsg = selectedConversation.messages[selectedConversation.messages.length - 1];
        if (lastMsg && lastMsg.senderId !== 'me' && autoAgent && !isAutoTyping) {
            triggerAutoReply(selectedConversation, autoAgent);
        }
    }
  }, [selectedConversation]);

  const triggerAutoReply = async (conv: Conversation, agent: AiAgent) => {
    setIsAutoTyping(true);
    
    // Simulate thinking delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const contact = MOCK_CONTACTS[conv.contactId];
    const suggestion = await getSmartReply(
        conv.messages, 
        contact.notes, 
        agent.systemInstruction
    );

    const autoMessage: Message = {
        id: 'auto-' + Date.now(),
        content: suggestion,
        senderId: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'sent',
        aiAgentId: agent.id,
        isAutoReplied: true
    };

    setConversations(prev => prev.map(c => {
        if (c.id === conv.id) {
            return {
                ...c,
                messages: [...c.messages, autoMessage],
                lastMessage: suggestion,
                lastMessageTime: 'Ahora'
            };
        }
        return c;
    }));

    setIsAutoTyping(false);
  };

  const handleSendMessage = () => {
    if (!inputText.trim() || !selectedConvId) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputText,
      senderId: 'me',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'text',
      status: 'sent',
      aiAgentId: draftAgentId || undefined
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
    setDraftAgentId(null);
  };

  const generateAIResponse = async () => {
    if (!selectedConversation || !selectedContact || !activeAgent || !activeAgent.isActive) return;
    setIsAiLoading(true);
    
    const suggestion = await getSmartReply(
        selectedConversation.messages, 
        selectedContact.notes, 
        activeAgent.systemInstruction
    );
    
    setInputText(suggestion);
    setDraftAgentId(activeAgent.id);
    setIsAiLoading(false);
  };

  // Function to simulate a customer message for testing auto-reply
  const simulateCustomerMessage = () => {
    if (!selectedConvId) return;
    const incoming: Message = {
        id: 'sim-' + Date.now(),
        content: "Hola, ¿podrías darme más información sobre los precios?",
        senderId: 'customer',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'text',
        status: 'read'
    };
    setConversations(prev => prev.map(c => {
        if (c.id === selectedConvId) {
            return { ...c, messages: [...c.messages, incoming], lastMessage: incoming.content, lastMessageTime: 'Ahora' };
        }
        return c;
    }));
  };

  return (
    <div className="flex h-full bg-white border-t border-slate-200 relative">
      <div className="w-full md:w-80 lg:w-96 border-r border-slate-200 flex flex-col h-full">
        <div className="p-4 border-b border-slate-200">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-slate-800 tracking-tight">Inbox</h2>
                <button 
                    onClick={simulateCustomerMessage}
                    className="text-[10px] font-black bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded-md uppercase tracking-widest text-slate-500"
                >
                    Simular Cliente
                </button>
            </div>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Buscar chats..." 
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border-transparent focus:bg-white focus:border-blue-500 transition-all text-sm outline-none"
                />
            </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
            {conversations.map(conv => {
                const contact = MOCK_CONTACTS[conv.contactId];
                return (
                    <div 
                        key={conv.id}
                        onClick={() => setSelectedConvId(conv.id)}
                        className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition-colors ${selectedConvId === conv.id ? 'bg-blue-50/50 border-l-4 border-l-blue-600' : 'border-l-4 border-l-transparent'}`}
                    >
                        <div className="flex justify-between items-start mb-1">
                            <div className="flex items-center gap-3">
                                <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                                <div>
                                    <h3 className="font-bold text-slate-800 text-sm leading-tight">{contact.name}</h3>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{conv.channel}</span>
                                </div>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">{conv.lastMessageTime}</span>
                        </div>
                        <p className="text-xs text-slate-500 truncate ml-13 pl-13">{conv.lastMessage}</p>
                    </div>
                );
            })}
        </div>
      </div>

      <div className="flex-1 flex flex-col h-full min-w-0 bg-slate-50/30 relative">
        {selectedConversation && selectedContact ? (
            <>
                <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
                    <div className="flex items-center gap-3">
                         <img src={selectedContact.avatar} alt={selectedContact.name} className="w-10 h-10 rounded-full object-cover shadow-sm" />
                         <div>
                            <h3 className="font-bold text-slate-800 text-sm">{selectedContact.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-1.5 rounded bg-slate-100 text-slate-500 uppercase`}>
                                    Sentiment: {sentiment}
                                </span>
                            </div>
                         </div>
                    </div>
                    {isAutoTyping && (
                        <div className="flex items-center gap-2 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-100 animate-pulse">
                            <Cpu className="w-4 h-4 text-purple-600" />
                            <span className="text-xs font-bold text-purple-700 italic">IA escribiendo...</span>
                        </div>
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {selectedConversation.messages.map((msg) => {
                        const messageAgent = msg.aiAgentId ? MOCK_AGENTS.find(a => a.id === msg.aiAgentId) : null;
                        return (
                            <div key={msg.id} className={`flex flex-col ${msg.senderId === 'me' ? 'items-end' : 'items-start'}`}>
                                {messageAgent && msg.senderId === 'me' && (
                                    <div className="flex items-center gap-1.5 mb-1.5 mr-1">
                                        <span className="text-[9px] text-slate-400 font-black uppercase tracking-widest">
                                            {messageAgent.name} {msg.isAutoReplied && " (Auto)"}
                                        </span>
                                        <img src={messageAgent.avatar} alt="" className="w-4 h-4 rounded-full border border-slate-200" />
                                    </div>
                                )}
                                <div className={`max-w-[75%] rounded-2xl px-4 py-3 text-sm shadow-sm relative ${
                                    msg.senderId === 'me' 
                                    ? (msg.isAutoReplied ? 'bg-purple-600 text-white rounded-br-none border-b-4 border-purple-800' : 'bg-blue-600 text-white rounded-br-none') 
                                    : 'bg-white text-slate-800 border border-slate-200 rounded-bl-none'
                                }`}>
                                    <p>{msg.content}</p>
                                    <div className={`text-[9px] mt-1 text-right ${msg.senderId === 'me' ? 'text-blue-200' : 'text-slate-400'}`}>
                                        {msg.timestamp}
                                    </div>
                                    {msg.isAutoReplied && (
                                        <div className="absolute -left-8 top-1/2 -translate-y-1/2 p-1 bg-purple-100 rounded-full text-purple-600 shadow-sm border border-purple-200">
                                            <Cpu className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                <div className="p-4 bg-white border-t border-slate-200">
                    <div className="flex items-center gap-3 mb-3 px-1 overflow-x-auto pb-1">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">Modelos Activos:</span>
                        {activeAgents.length > 0 ? (
                            activeAgents.map(agent => (
                                <button
                                    key={agent.id}
                                    onClick={() => setSelectedAgentId(agent.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all whitespace-nowrap ${
                                        selectedAgentId === agent.id 
                                        ? 'bg-blue-600 text-white border-blue-600 shadow-md' 
                                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                                    }`}
                                >
                                    <img src={agent.avatar} alt="" className="w-4 h-4 rounded-full" />
                                    {agent.name}
                                    {agent.isAutoReplyEnabled && <Cpu className="w-3 h-3 ml-1" />}
                                </button>
                            ))
                        ) : (
                            <div className="flex items-center gap-2 text-[10px] font-black text-red-500 uppercase tracking-widest animate-pulse">
                                <AlertCircle className="w-3 h-3" />
                                Sin agentes activos.
                            </div>
                        )}
                    </div>
                    
                    <div className="relative flex items-end gap-2 bg-slate-50 border border-slate-200 rounded-2xl p-2 focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <textarea
                            value={inputText}
                            onChange={(e) => setInputText(e.target.value)}
                            placeholder={activeAgents.length > 0 ? `Responder con ${activeAgent?.name}...` : 'Escribe un mensaje...'}
                            className="flex-1 bg-transparent border-none focus:ring-0 resize-none py-3 px-2 text-sm text-slate-700 min-h-[44px]"
                            rows={1}
                        />
                        <button 
                            onClick={generateAIResponse}
                            disabled={isAiLoading || activeAgents.length === 0}
                            className={`p-2.5 rounded-xl transition-all ${isAiLoading ? 'bg-purple-100 text-purple-400' : 'bg-purple-600 text-white shadow-lg shadow-purple-100'} disabled:opacity-20`}
                        >
                            <Sparkles className={`w-5 h-5 ${isAiLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <button 
                            onClick={() => handleSendMessage()}
                            disabled={!inputText.trim()}
                            className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </>
        ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <Bot className="w-20 h-20 mb-4 opacity-10" />
                <p className="font-bold uppercase text-xs tracking-widest">Selecciona una conversación</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Inbox;
