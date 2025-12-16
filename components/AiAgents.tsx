import React, { useState } from 'react';
import { MOCK_AGENTS } from '../constants';
import { AiAgent } from '../types';
import { Bot, Edit2, Plus, Power, Save, Trash2 } from 'lucide-react';

const AiAgents = () => {
  const [agents, setAgents] = useState<AiAgent[]>(MOCK_AGENTS);
  const [editingId, setEditingId] = useState<string | null>(null);

  const toggleAgent = (id: string) => {
    setAgents(prevAgents => prevAgents.map(a => {
      if (a.id === id) {
        const newStatus = !a.isActive;
        console.log(`[System Event] Agent "${a.name}" status updated to: ${newStatus ? 'ACTIVE' : 'INACTIVE'}`);
        return { ...a, isActive: newStatus };
      }
      return a;
    }));
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Agents</h1>
          <p className="text-slate-500">Configure your intelligent workforce. Define personas and instructions.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Create New Agent
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {agents.map((agent) => (
          <div key={agent.id} className={`bg-white rounded-xl border transition-all ${agent.isActive ? 'border-slate-200 shadow-sm' : 'border-slate-100 opacity-75'}`}>
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <img src={agent.avatar} alt={agent.name} className="w-12 h-12 rounded-full bg-slate-100 p-1" />
                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${agent.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 text-lg">{agent.name}</h3>
                    <span className="inline-block bg-slate-100 text-slate-600 text-xs px-2 py-0.5 rounded-full font-medium">
                      {agent.role}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                   <button 
                    onClick={() => toggleAgent(agent.id)}
                    className={`p-2 rounded-lg transition-colors ${agent.isActive ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-400 bg-slate-100 hover:bg-slate-200'}`}
                    title={agent.isActive ? "Deactivate" : "Activate"}
                   >
                     <Power className="w-4 h-4" />
                   </button>
                   <button 
                    onClick={() => setEditingId(editingId === agent.id ? null : agent.id)}
                    className="p-2 text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                   >
                     {editingId === agent.id ? <Save className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                   </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                   <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-1">Description</label>
                   <p className="text-sm text-slate-600">{agent.description}</p>
                </div>
                
                <div>
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2">System Instruction (Prompt)</label>
                    {editingId === agent.id ? (
                        <textarea 
                            className="w-full text-sm p-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                            rows={4}
                            defaultValue={agent.systemInstruction}
                        />
                    ) : (
                        <div className="bg-slate-50 border border-slate-100 p-3 rounded-lg">
                            <p className="text-sm text-slate-600 font-mono leading-relaxed line-clamp-3">
                                {agent.systemInstruction}
                            </p>
                        </div>
                    )}
                </div>
              </div>
            </div>
            {editingId === agent.id && (
                <div className="bg-slate-50 p-4 rounded-b-xl border-t border-slate-100 flex justify-end gap-3">
                    <button className="text-sm text-red-500 hover:text-red-700 font-medium flex items-center gap-1">
                        <Trash2 className="w-4 h-4" /> Delete
                    </button>
                    <button 
                        onClick={() => setEditingId(null)}
                        className="text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                    >
                        Save Changes
                    </button>
                </div>
            )}
          </div>
        ))}
        
        {/* Add Agent Placeholder */}
        <button className="border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-slate-400 hover:border-blue-300 hover:text-blue-500 hover:bg-blue-50/50 transition-all group h-[340px]">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 group-hover:bg-white transition-colors">
                <Bot className="w-8 h-8" />
            </div>
            <span className="font-semibold">Add Custom Agent</span>
            <span className="text-sm mt-1">Configure a new AI persona</span>
        </button>
      </div>
    </div>
  );
};

export default AiAgents;