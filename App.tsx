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
  Bot,
  Megaphone,
  UserCircle,
  ShieldCheck
} from 'lucide-react';
import Inbox from './components/Inbox';
import Dashboard from './components/Dashboard';
import ResellerPortal from './components/ResellerPortal';
import AiAgents from './components/AiAgents';
import IntegrationSettings from './components/IntegrationSettings';
import Contacts from './components/Contacts';
import Campaigns from './components/Campaigns';
import Billing from './components/Billing';
import { CURRENT_USER as INITIAL_USER } from './constants';
import { User } from './types';

type View = 'dashboard' | 'inbox' | 'contacts' | 'reseller' | 'settings' | 'agents' | 'campaigns' | 'billing';

const App = () => {
  const [user, setUser] = useState<User>(INITIAL_USER);
  const [currentView, setCurrentView] = useState<View>('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const isSuperAdmin = user.role === 'superadmin';
  const isAdmin = user.role === 'admin' || isSuperAdmin;

  // Function to switch roles for demo purposes
  const toggleRole = () => {
    const newRole = user.role === 'superadmin' ? 'admin' : 'superadmin';
    setUser({ ...user, role: newRole });
    // If we are in reseller view and switch to admin, kick out to dashboard
    if (newRole === 'admin' && currentView === 'reseller') {
      setCurrentView('dashboard');
    }
  };

  const NavItem = ({ view, icon: Icon, label, hidden = false }: { view: View; icon: any; label: string; hidden?: boolean }) => {
    if (hidden) return null;
    return (
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
  };

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
            <NavItem view="campaigns" icon={Megaphone} label="Campaigns" />
          </div>

          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Intelligence</p>
            <NavItem view="agents" icon={Bot} label="AI Agents" />
          </div>

          {/* Conditional Sections based on Role */}
          <div className="mb-8">
            <p className="px-3 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                {isSuperAdmin ? 'Platform Management' : 'Agency Administration'}
            </p>
            {/* Solo Superadmin ve el Reseller Portal */}
            <NavItem view="reseller" icon={Building2} label="Reseller Portal" hidden={!isSuperAdmin} />
            
            {/* Ambos Admin y Superadmin ven Billing, pero con propósitos distintos */}
            <NavItem view="billing" icon={Box} label="Plans & Billing" />
            
            <NavItem view="settings" icon={Settings} label="Integration" />
          </div>
        </div>

        {/* User Profile & Role Switcher */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white border border-slate-200 shadow-sm mb-3">
            <img 
              src={user.avatar} 
              alt="User" 
              className="w-9 h-9 rounded-full object-cover border border-slate-200"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <div className="flex items-center gap-1">
                 {isSuperAdmin ? <ShieldCheck className="w-3 h-3 text-blue-600" /> : <UserCircle className="w-3 h-3 text-slate-400" />}
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter truncate">{user.role}</p>
              </div>
            </div>
          </div>
          
          {/* Demo Action: Toggle Role */}
          <button 
            onClick={toggleRole}
            className="w-full text-[10px] font-bold text-slate-400 hover:text-blue-600 border border-dashed border-slate-300 rounded py-1 px-2 transition-colors mb-2"
          >
            SWITCH TO {user.role === 'superadmin' ? 'ADMIN' : 'SUPERADMIN'} (DEMO)
          </button>

          <button className="w-full flex items-center gap-2 px-3 py-2 text-slate-500 hover:text-red-600 text-sm font-medium transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Log out</span>
          </button>
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
          {/* Safety check: strictly no reseller for non-superadmins */}
          {currentView === 'reseller' && (isSuperAdmin ? <ResellerPortal /> : <Dashboard />)}
          {currentView === 'agents' && <AiAgents />}
          {currentView === 'settings' && <IntegrationSettings />}
          {currentView === 'contacts' && <Contacts />}
          {currentView === 'campaigns' && <Campaigns />}
          {currentView === 'billing' && <Billing />}
        </div>
      </main>
    </div>
  );
};

export default App;