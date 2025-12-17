import React, { useState } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, UserCircle, Loader2, AlertCircle, Users } from 'lucide-react';
import { User } from '../types';

// MOCK DATABASE OF USERS
const USERS_DB: User[] = [
  {
    id: 'sa1',
    name: 'Super Admin IADS',
    email: 'admin@iads.com',
    password: 'superpassword',
    avatar: 'https://picsum.photos/id/1005/100/100',
    role: 'superadmin'
  },
  {
    id: 'a1',
    name: 'Roberto Agency',
    email: 'owner@agency.com',
    password: 'adminpassword',
    avatar: 'https://picsum.photos/id/1012/100/100',
    role: 'admin',
    tenantId: 't1'
  },
  {
    id: 'ag1',
    name: 'Soporte Juan',
    email: 'soporte@agency.com',
    password: 'agentpassword',
    avatar: 'https://picsum.photos/id/1027/100/100',
    role: 'agent',
    tenantId: 't1'
  }
];

interface LoginProps {
  onLogin: (user: User) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      const foundUser = USERS_DB.find(u => u.email === email && u.password === password);
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        onLogin(userWithoutPassword as User);
      } else {
        setError('Credenciales inválidas. Verifica tu email y contraseña.');
        setIsLoading(false);
      }
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-2xl text-white font-bold text-3xl shadow-lg shadow-blue-200 mb-4 animate-bounce">
            I
          </div>
          <h1 className="text-3xl font-bold text-slate-800">IADS CRM</h1>
          <p className="text-slate-500 mt-2 italic font-medium underline decoration-blue-200 decoration-4">SaaS Intelligent Delivery</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8">
            <h2 className="text-xl font-bold text-slate-800 mb-6 text-center">Acceso al Sistema</h2>
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Correo Corporativo</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="email" 
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                    placeholder="ejemplo@iads.com"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input 
                    type="password" 
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:bg-white outline-none transition-all text-sm"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-xl border border-red-100 animate-pulse">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}

              <button 
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
                  <>
                    Iniciar Sesión
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-100">
               <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center mb-4">Credenciales de Prueba</p>
               <div className="space-y-2">
                  <div className="flex justify-between text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-blue-600">Superadmin:</span>
                    <span className="text-slate-600">admin@iads.com / superpassword</span>
                  </div>
                  <div className="flex justify-between text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-indigo-600">Admin:</span>
                    <span className="text-slate-600">owner@agency.com / adminpassword</span>
                  </div>
                  <div className="flex justify-between text-[10px] bg-slate-50 p-2 rounded-lg border border-slate-100">
                    <span className="font-bold text-emerald-600">Agente:</span>
                    <span className="text-slate-600">soporte@agency.com / agentpassword</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
        
        <p className="text-center text-xs text-slate-400 mt-8">
          Sistema Seguro Multi-Tenant • Producido por IADS DevTeam
        </p>
      </div>
    </div>
  );
};

export default Login;