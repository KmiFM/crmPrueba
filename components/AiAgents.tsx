
import React, { useState } from 'react';
import { MOCK_AGENTS } from '../constants';
import { AiAgent } from '../types';
import { Bot, Plus, Power, Trash2, X, Zap, Activity, Cpu } from 'lucide-react';

const AiAgents = () => {
  const [agents, setAgents] = useState<AiAgent[]>(MOCK_AGENTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const activeCount = agents.filter(a => a.isActive).length;
  const autoCount = agents.filter(a => a.isAutoReplyEnabled).length;

  const [newAgent, setNewAgent] = useState<Omit<AiAgent, 'id'>>({
    name: '',
    role: 'Ventas',
    description: '',
    systemInstruction: '',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + Math.random(),
    isActive: true,
    isAutoReplyEnabled: false
  });

  const toggleStatus = (id: string, property: 'isActive' | 'isAutoReplyEnabled') => {
    setAgents(prev => prev.map(a => {
      if (a.id === id) {
        // Only allow enabling auto-reply if the agent is active
        if (property === 'isAutoReplyEnabled' && !a.isActive && !a.isAutoReplyEnabled) return a;
        return { ...a, [property]: !a[property] };
      }
      return a;
    }));
  };

  const handleCreateAgent = () => {
    if (!newAgent.name || !newAgent.systemInstruction) return;
    const id = 'a' + Date.now();
    setAgents([...agents, { ...newAgent, id }]);
    setIsAddModalOpen(false);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/30">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Cerebros de IA</h1>
          <div className="flex items-center gap-3 mt-1">
             <div className="flex items-center gap-1.5 bg-blue-100 px-2.5 py-1 rounded-full border border-blue-200">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                <span className="text-[10px] font-black text-blue-700 uppercase">{activeCount} Disponibles</span>
             </div>
             <div className="flex items-center gap-1.5 bg-purple-100 px-2.5 py-1 rounded-full border border-purple-200">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-pulse"></div>
                <span className="text-[10px] font-black text-purple-700 uppercase">{autoCount} Autómatas</span>
             </div>
          </div>
        </div>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <Plus className="w-5 h-5" />
          Nuevo Miembro IA
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {agents.map((agent) => (
          <div 
            key={agent.id} 
            className={`group bg-white rounded-[32px] border-2 transition-all duration-500 relative overflow-hidden ${
              agent.isActive 
                ? 'border-slate-100 shadow-sm hover:shadow-2xl hover:border-blue-100' 
                : 'border-slate-200 grayscale opacity-40 shadow-none'
            }`}
          >
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={agent.avatar} alt={agent.name} className="w-14 h-14 rounded-2xl bg-slate-50 p-1 border border-slate-100" />
                    {agent.isAutoReplyEnabled && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-purple-600 rounded-full flex items-center justify-center border-2 border-white shadow-lg animate-bounce">
                            <Cpu className="w-2.5 h-2.5 text-white" />
                        </div>
                    )}
                  </div>
                  <div>
                    <h3 className="font-black text-slate-800 text-lg leading-tight">{agent.name}</h3>
                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest">{agent.role}</span>
                  </div>
                </div>
                
                {/* Switch Principal: Encendido/Apagado */}
                <button 
                  onClick={() => toggleStatus(agent.id, 'isActive')}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${agent.isActive ? 'bg-blue-600' : 'bg-slate-300'}`}
                >
                  <span className={`${agent.isActive ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                  <div className={`p-4 rounded-2xl transition-all border ${agent.isAutoReplyEnabled ? 'bg-purple-50 border-purple-100' : 'bg-slate-50 border-slate-100'}`}>
                      <div className="flex items-center justify-between mb-2">
                          <label className="text-[10px] font-black text-slate-400 uppercase flex items-center gap-1.5">
                              <Cpu className={`w-3 h-3 ${agent.isAutoReplyEnabled ? 'text-purple-600' : 'text-slate-400'}`} />
                              Piloto Automático
                          </label>
                          <button 
                            disabled={!agent.isActive}
                            onClick={() => toggleStatus(agent.id, 'isAutoReplyEnabled')}
                            className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-30 ${agent.isAutoReplyEnabled ? 'bg-purple-600' : 'bg-slate-200'}`}
                          >
                            <span className={`${agent.isAutoReplyEnabled ? 'translate-x-5' : 'translate-x-1'} inline-block h-3 w-3 transform rounded-full bg-white transition`} />
                          </button>
                      </div>
                      <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                          {agent.isAutoReplyEnabled 
                            ? "Contesta mensajes entrantes sin intervención humana." 
                            : "La IA solo sugerirá borradores para aprobación manual."}
                      </p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-400 uppercase block mb-1">Descripción</label>
                    <p className="text-xs text-slate-600 line-clamp-2">{agent.description}</p>
                  </div>
              </div>

              <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
                 <button onClick={() => setAgents(agents.filter(a => a.id !== agent.id))} className="text-slate-300 hover:text-red-500 p-2">
                    <Trash2 className="w-4 h-4" />
                 </button>
                 <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${agent.isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                    <span className="text-[9px] font-black uppercase text-slate-400">
                        {agent.isActive ? (agent.isAutoReplyEnabled ? 'Full Auto' : 'Asistente') : 'Offline'}
                    </span>
                 </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4">
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl animate-in zoom-in duration-300">
                  <div className="p-10 border-b border-slate-50 flex justify-between items-center">
                      <h3 className="text-2xl font-black text-slate-800">Crear Nueva Inteligencia</h3>
                      <button onClick={() => setIsAddModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                          <X className="w-6 h-6 text-slate-400" />
                      </button>
                  </div>
                  
                  <div className="p-10 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nombre</label>
                            <input 
                                type="text" 
                                value={newAgent.name}
                                onChange={(e) => setNewAgent({...newAgent, name: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                                placeholder="Ej. Bot de Reservas"
                            />
                        </div>
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Rol</label>
                            <select 
                                value={newAgent.role}
                                onChange={(e) => setNewAgent({...newAgent, role: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-sm"
                            >
                                <option>Ventas</option>
                                <option>Soporte</option>
                                <option>Concierge</option>
                            </select>
                        </div>
                      </div>

                      <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">System Prompt (Instrucciones de comportamiento)</label>
                          <textarea 
                            value={newAgent.systemInstruction}
                            onChange={(e) => setNewAgent({...newAgent, systemInstruction: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-blue-100 h-40 resize-none leading-relaxed"
                            placeholder="Eres un agente de ventas amable..."
                          />
                      </div>

                      <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl border border-purple-100">
                          <div className="flex items-center gap-3">
                              <Cpu className="w-5 h-5 text-purple-600" />
                              <div>
                                  <p className="text-xs font-black text-purple-800 uppercase">Activar Piloto Automático</p>
                                  <p className="text-[10px] text-purple-600">Responderá solo apenas sea creado.</p>
                              </div>
                          </div>
                          <button 
                            onClick={() => setNewAgent({...newAgent, isAutoReplyEnabled: !newAgent.isAutoReplyEnabled})}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newAgent.isAutoReplyEnabled ? 'bg-purple-600' : 'bg-slate-300'}`}
                          >
                             <span className={`${newAgent.isAutoReplyEnabled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition`} />
                          </button>
                      </div>
                  </div>

                  <div className="p-10 pt-0 flex justify-end gap-3">
                      <button onClick={() => setIsAddModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm">Cancelar</button>
                      <button 
                        onClick={handleCreateAgent}
                        className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-100"
                      >
                        Dar de Alta
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default AiAgents;
