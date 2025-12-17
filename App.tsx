
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
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Analytics } from '@vercel/analytics/react';
import Inbox from './components/Inbox';
import Dashboard from './components/Dashboard';
import ResellerPortal from './components/ResellerPortal';
import AiAgents from './components/AiAgents';
import IntegrationSettings from './components/IntegrationSettings';
import Contacts from './components/Contacts';
import Campaigns from './components/Campaigns';
import Billing from './components/Billing';
import Login from './components/Login';
import { User } from './types';

type View = 'dashboard' | 'inbox' | 'contacts' | 'reseller' | 'settings' | 'agents' | 'campaigns' | 'billing' | 'team';

const App = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogin = (userData: User) => {
    setUser(userData);
    // Redirigir según rol si es necesario, pero inbox es buena por defecto
    setCurrentView('inbox');
  };

  const handleLogout = () => {
    // Limpiamos el estado del usuario y reseteamos la vista
    setUser(null);
    setCurrentView('inbox');
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const isSuperAdmin = user.role === 'superadmin';
  const isAdmin = user.role === 'admin';
  const isAgent = user.role === 'agent';

  const NavItem = ({ view, icon: Icon, label, hidden = false }: { view: View; icon: any; label: string; hidden?: boolean }) => {
    if (hidden) return null;
    return (
      <button
        type="button"
        onClick={() => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${
          currentView === view 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-200 translate-x-1' 
            : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'
        }`}
      >
        <Icon className="w-5 h-5" />
        <span className="font-semibold text-sm">{label}</span>
      </button>
    );
  };

  return (
    <>
      <Analytics />
      <div className="flex h-screen overflow-hidden bg-slate-50 animate-in fade-in duration-700">
        {/* Sidebar Overlay for Mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              I
            </div>
            <div>
              <span className="text-lg font-black text-slate-800 tracking-tight block leading-none">IADS</span>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest">Platform</span>
            </div>
          </div>
        </div>

        <div className="flex-1 px-4 py-6 overflow-y-auto scrollbar-hide">
          <div className="mb-8">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Módulos</p>
            <NavItem view="dashboard" icon={LayoutDashboard} label="Dashboard" />
            <NavItem view="inbox" icon={MessageSquare} label="Inbox" />
            <NavItem view="contacts" icon={Users} label="Contactos" />
            <NavItem view="campaigns" icon={Megaphone} label="Campañas" hidden={isAgent} />
          </div>

          <div className="mb-8">
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Inteligencia</p>
            <NavItem view="agents" icon={Bot} label="Agentes AI" hidden={isAgent} />
          </div>

          {(isSuperAdmin || isAdmin) && (
            <div className="mb-8">
                <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">Administración</p>
                {/* Solo para el dueño del SaaS */}
                <NavItem view="reseller" icon={Building2} label="Reseller Portal" hidden={!isSuperAdmin} />
                
                {/* Para dueño de agencia */}
                <NavItem view="team" icon={UserPlus} label="Gestionar Equipo" hidden={!isAdmin} />
                <NavItem view="billing" icon={Box} label="Planes y Pagos" hidden={isSuperAdmin} />
                
                <NavItem view="settings" icon={Settings} label="Integración" />
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3 px-3 py-3 rounded-2xl bg-white border border-slate-200 shadow-sm mb-3">
            <img 
              src={user.avatar} 
              alt="User" 
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-100 shadow-sm"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <div className="flex items-center gap-1">
                 {isSuperAdmin ? <ShieldCheck className="w-3 h-3 text-blue-600" /> : <UserCircle className="w-3 h-3 text-slate-400" />}
                 <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter truncate">{user.role}</p>
              </div>
            </div>
          </div>
          
          <button 
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl text-sm font-bold transition-all group"
          >
            <LogOut className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full min-w-0">
        {/* Mobile Header */}
        <div className="h-16 border-b border-slate-200 bg-white flex items-center px-4 md:hidden">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-slate-800 uppercase tracking-widest text-sm">{currentView}</span>
        </div>

        {/* Dynamic Content */}
        <div className="flex-1 overflow-hidden relative">
          {currentView === 'inbox' && <Inbox />}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'reseller' && (isSuperAdmin ? <ResellerPortal /> : <Dashboard />)}
          {currentView === 'agents' && <AiAgents />}
          {currentView === 'settings' && <IntegrationSettings />}
          {currentView === 'contacts' && <Contacts />}
          {currentView === 'campaigns' && <Campaigns />}
          {currentView === 'billing' && <Billing />}
          {currentView === 'team' && (
              <div className="p-8 h-full bg-white flex flex-col items-center justify-center text-center">
                  <Users className="w-16 h-16 text-slate-200 mb-4" />
                  <h2 className="text-2xl font-bold text-slate-800">Gestión de Equipo</h2>
                  <p className="text-slate-500 max-w-md mt-2">Como Admin de la agencia, aquí podrás crear las cuentas de tus agentes de soporte y ventas.</p>
                  <button className="mt-6 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-100">Añadir Agente</button>
              </div>
          )}
        </div>
      </main>
    </div>
    </>
  );
};

export default App;
