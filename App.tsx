import React, { useState, useEffect } from 'react';
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
  UserPlus,
  BookOpen
} from 'lucide-react';
import Inbox from './components/Inbox';
import Dashboard from './components/Dashboard';
import ResellerPortal from './components/ResellerPortal';
import AiAgents from './components/AiAgents';
import IntegrationSettings from './components/IntegrationSettings';
import Contacts from './components/Contacts';
import Campaigns from './components/Campaigns';
import Billing from './components/Billing';
import Documentation from './components/Documentation';
import TeamManagement from './components/TeamManagement';
import Profile from './components/Profile';
import Login from './components/Login';
import { User, Tenant } from './types';
import { MOCK_USERS, MOCK_TENANTS } from './constants';

export type View = 'dashboard' | 'inbox' | 'contacts' | 'reseller' | 'settings' | 'agents' | 'campaigns' | 'billing' | 'team' | 'documentation' | 'profile';

const App = () => {
  // Database Simulation State
  const [dbUsers, setDbUsers] = useState<User[]>([]);
  const [dbTenants, setDbTenants] = useState<Tenant[]>([]);
  const [platformLogo, setPlatformLogo] = useState('https://picsum.photos/id/1/200/200'); // Default platform logo
  const [user, setUser] = useState<User | null>(null);
  const [currentView, setCurrentView] = useState<View>('inbox');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Initialize DB from LocalStorage or Mocks
  useEffect(() => {
    const savedUsers = localStorage.getItem('iads_users');
    const savedTenants = localStorage.getItem('iads_tenants');
    const savedLogo = localStorage.getItem('iads_platform_logo');

    if (savedUsers) setDbUsers(JSON.parse(savedUsers));
    else {
      setDbUsers(MOCK_USERS);
      localStorage.setItem('iads_users', JSON.stringify(MOCK_USERS));
    }

    if (savedTenants) setDbTenants(JSON.parse(savedTenants));
    else {
      setDbTenants(MOCK_TENANTS);
      localStorage.setItem('iads_tenants', JSON.stringify(MOCK_TENANTS));
    }

    if (savedLogo) setPlatformLogo(savedLogo);
  }, []);

  // Update LocalStorage whenever DB changes
  const updateUsers = (newUsers: User[]) => {
    setDbUsers(newUsers);
    localStorage.setItem('iads_users', JSON.stringify(newUsers));
    // If current user is updated, update the local user state too
    if (user) {
      const updatedMe = newUsers.find(u => u.id === user.id);
      if (updatedMe) setUser(updatedMe);
    }
  };

  const updateTenants = (newTenants: Tenant[]) => {
    setDbTenants(newTenants);
    localStorage.setItem('iads_tenants', JSON.stringify(newTenants));
  };

  const updatePlatformLogo = (newLogo: string) => {
    setPlatformLogo(newLogo);
    localStorage.setItem('iads_platform_logo', newLogo);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentView('inbox');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('inbox');
    setIsSidebarOpen(false);
  };

  if (!user) {
    return <Login onLogin={handleLogin} users={dbUsers} />;
  }

  const isSuperAdmin = user.role === 'superadmin';
  const isAdmin = user.role === 'admin';
  const isAgent = user.role === 'agent';

  // Get current branding logo
  const currentTenant = dbTenants.find(t => t.id === user.tenantId);
  const brandingLogo = (isAdmin || isAgent) && currentTenant?.logoUrl
    ? currentTenant.logoUrl
    : platformLogo;

  const NavItem = ({ view, icon: Icon, label, hidden = false }: { view: View; icon: any; label: string; hidden?: boolean }) => {
    if (hidden) return null;
    return (
      <button
        type="button"
        onClick={() => {
          setCurrentView(view);
          setIsSidebarOpen(false);
        }}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-1 transition-all ${currentView === view
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
    <div className="flex h-screen overflow-hidden bg-slate-50 animate-in fade-in duration-700">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside className={`
        fixed md:static inset-y-0 left-0 z-40 w-64 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="h-20 flex items-center px-6 border-b border-slate-100 overflow-hidden">
          <div className="flex items-center gap-3">
            <img
              src={brandingLogo}
              alt="Logo"
              className="w-10 h-10 rounded-xl object-cover shadow-sm bg-slate-50 border border-slate-100"
            />
            <div className="min-w-0">
              <span className="text-lg font-black text-slate-800 tracking-tight block leading-none truncate">
                {currentTenant && (isAdmin || isAgent) ? currentTenant.name : 'IADS'}
              </span>
              <span className="text-[10px] text-blue-500 font-bold uppercase tracking-widest truncate block">
                {currentTenant && (isAdmin || isAgent) ? 'Agency Portal' : 'Platform'}
              </span>
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
              <NavItem view="reseller" icon={Building2} label="Reseller Portal" hidden={!isSuperAdmin} />
              <NavItem view="team" icon={UserPlus} label="Gestionar Equipo" hidden={!isAdmin} />
              <NavItem view="billing" icon={Box} label="Planes y Pagos" hidden={isSuperAdmin} />
              <NavItem view="settings" icon={Settings} label="Configuración" />
              <NavItem view="documentation" icon={BookOpen} label="Documentación" />
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setCurrentView('profile')}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-2xl border transition-all mb-3 text-left ${currentView === 'profile' ? 'bg-blue-50 border-blue-200' : 'bg-white border-slate-200 shadow-sm hover:border-blue-300'
              }`}
          >
            <img
              src={user.avatar}
              alt="User"
              className="w-10 h-10 rounded-full object-cover border-2 border-slate-100"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-slate-800 truncate">{user.name}</p>
              <div className="flex items-center gap-1">
                {isSuperAdmin ? <ShieldCheck className="w-3 h-3 text-blue-600" /> : <UserCircle className="w-3 h-3 text-slate-400" />}
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-tighter truncate">{user.role}</p>
              </div>
            </div>
          </button>

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

      <main className="flex-1 flex flex-col h-full min-w-0">
        <div className="h-16 border-b border-slate-200 bg-white flex items-center px-4 md:hidden">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="ml-4 font-bold text-slate-800 uppercase tracking-widest text-sm">{currentView}</span>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {currentView === 'inbox' && <Inbox />}
          {currentView === 'dashboard' && <Dashboard />}
          {currentView === 'reseller' && (isSuperAdmin ? (
            <ResellerPortal
              tenants={dbTenants}
              onUpdateTenants={updateTenants}
              users={dbUsers}
              onUpdateUsers={updateUsers}
              platformLogo={platformLogo}
              onUpdatePlatformLogo={updatePlatformLogo}
            />
          ) : <Dashboard />)}
          {currentView === 'agents' && <AiAgents />}
          {currentView === 'settings' && (
            <IntegrationSettings
              onNavigateDocs={() => setCurrentView('documentation')}
              currentTenant={currentTenant}
              onUpdateTenant={(t) => updateTenants(dbTenants.map(item => item.id === t.id ? t : item))}
            />
          )}
          {currentView === 'contacts' && <Contacts />}
          {currentView === 'campaigns' && <Campaigns />}
          {currentView === 'billing' && <Billing />}
          {currentView === 'documentation' && <Documentation />}
          {currentView === 'team' && (
            <TeamManagement
              currentUser={user}
              users={dbUsers}
              onUpdateUsers={updateUsers}
            />
          )}
          {currentView === 'profile' && (
            <Profile
              user={user}
              onUpdateUser={(updated) => updateUsers(dbUsers.map(u => u.id === updated.id ? updated : u))}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default App;
