import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  MessageSquare, 
  Users, 
  Settings, 
  LogOut, 
  Menu,
  Building2,
  Box,
  Bot
} from 'lucide-react';
import Inbox from './components/Inbox';
import Dashboard from './components/Dashboard';
import ResellerPortal from './components/ResellerPortal';
import AiAgents from './components/AiAgents';
import { CURRENT_USER } from './constants';

type View = 'dashboard' | 'inbox' | 'contacts' | 'reseller' | 'settings' | 'agents';

const App = () => {
  const [currentView, setCurrentView] = useState<View>('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const NavItem = ({ view, icon: Icon, label }: { view: View; icon: any; label: string }) => (
    <button
      onClick={() => {
        setCurrentView(view);
        setIsSidebarOpen(false);
      }}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-colors ${
        currentView === view 
          ? 'bg-blue-600 text-white shadow-sm' 
          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span className="font-medium text-sm">{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Sidebar Navigation */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30 w-64 bg-white border-r border-slate-200 transform transition-transform duration-200 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="text-xl font-bold text-slate-800 tracking-tight">IADS CRM</span>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Platform</p>
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="inbox" icon={MessageSquare} label="Inbox" />
            <NavItem view="contacts" icon={Users} label="Contacts" />
          </div>

          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Intelligence</p>
            <NavItem view="agents" icon={Bot} label="AI Agents" />
          </div>

          {CURRENT_USER.role === 'superadmin' && (
             <div className="mb-8">
                <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Agency Admin</p>
                <NavItem view="reseller" icon={Building2} label="Reseller Portal" />
                <NavItem view="settings" icon={Box} label="Plans & Billing" />
             </div>
          )}

          <div>
             <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Settings</p>
             <NavItem view="settings" icon={Settings} label="Integration" />
          </div>
        </div>

        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer">
            <img 
              src={CURRENT_USER.avatar} 
              alt="User" 
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{CURRENT_USER.name}</p>
              <p className="text-xs text-slate-500 truncate capitalize">{CURRENT_USER.role}</p>
            </div>
            <LogOut className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden h-16 bg-white border-b border-slate-200 flex items-center px-4 justify-between">
           <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold">
              I
            </div>
            <span className="text-lg font-bold text-slate-800">IADS CRM</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-slate-600">
            <Menu className="w-6 h-6" />
          </button>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden relative">
          {currentView === 'inbox' && <Inbox />}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'reseller' && <ResellerPortal />}
          {currentView === 'agents' && <AiAgents />}
          {(currentView === 'contacts' || currentView === 'settings') && (
            <div className="flex items-center justify-center h-full text-slate-400 bg-slate-50">
              <div className="text-center">
                <Settings className="w-12 h-12 mx-auto mb-4 text-slate-300" />
                <h3 className="text-lg font-medium text-slate-600">Work in Progress</h3>
                <p>This module is under development.</p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default App;