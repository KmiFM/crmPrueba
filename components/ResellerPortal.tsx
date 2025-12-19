
import React, { useState } from 'react';
import { Tenant, User } from '../types';
import { Plus, Building, DollarSign, Users, Trash2, X, Edit2, Palette, Image, Save, CheckCircle2 } from 'lucide-react';

interface Props {
    tenants: Tenant[];
    onUpdateTenants: (tenants: Tenant[]) => void;
    users: User[];
    onUpdateUsers: (users: User[]) => void;
    platformLogo: string;
    onUpdatePlatformLogo: (logo: string) => void;
}

const ResellerPortal: React.FC<Props> = ({ tenants, onUpdateTenants, users, onUpdateUsers, platformLogo, onUpdatePlatformLogo }) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newLogoUrl, setNewLogoUrl] = useState(platformLogo);

  const [newTenant, setNewTenant] = useState<Omit<Tenant, 'id' | 'nextBilling'>>({ 
    name: '', 
    contactPerson: '', 
    email: '',
    phoneNumber: '',
    address: '',
    plan: 'basic',
    status: 'trial',
    users: 2,
    monthlyRevenue: 100,
    adminEmail: '',
    adminPassword: '',
    logoUrl: ''
  });

  const totalClients = tenants.length;
  const totalMRR = tenants.reduce((acc, t) => acc + t.monthlyRevenue, 0);
  const activeClients = tenants.filter(t => t.status === 'active').length;

  const handleUpdateGlobalLogo = () => {
    onUpdatePlatformLogo(newLogoUrl);
    alert("Logo global de la plataforma actualizado.");
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Estás seguro de que deseas eliminar esta agencia? Perderá acceso a sus datos.')) {
      onUpdateTenants(tenants.filter(t => t.id !== id));
      onUpdateUsers(users.filter(u => u.tenantId !== id));
      if (selectedTenant?.id === id) setSelectedTenant(null);
    }
  };

  const handleAddClient = () => {
    const newErrors: Record<string, string> = {};
    if (!newTenant.name) newErrors.name = 'Obligatorio';
    if (!validateEmail(newTenant.email)) newErrors.email = 'Email inválido';
    if (!validateEmail(newTenant.adminEmail)) newErrors.adminEmail = 'Email inválido';
    if (newTenant.adminPassword.length < 6) newErrors.adminPassword = 'Mínimo 6 caracteres';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const tenantId = 't-' + Date.now();
    const tenant: Tenant = {
        id: tenantId,
        ...newTenant,
        nextBilling: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
    };

    const adminUser: User = {
        id: 'u-' + Date.now(),
        name: newTenant.contactPerson,
        email: newTenant.adminEmail,
        password: newTenant.adminPassword,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${newTenant.contactPerson}`,
        role: 'admin',
        tenantId: tenantId
    };
    
    onUpdateTenants([...tenants, tenant]);
    onUpdateUsers([...users, adminUser]);
    setIsAddModalOpen(false);
    setErrors({});
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/30 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Portal Superadmin</h1>
          <p className="text-slate-500 font-medium text-sm">Control total de la infraestructura y marca global.</p>
        </div>
        <button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold shadow-lg shadow-blue-100 transition-all active:scale-95"
        >
        <Plus className="w-4 h-4" />
        Nueva Agencia
        </button>
      </div>

      {/* Global Branding Personalization */}
      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden p-8 flex flex-col md:flex-row gap-8 items-center border-l-8 border-l-blue-600">
          <div className="flex-shrink-0 text-center">
             <div className="w-20 h-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-2 overflow-hidden mx-auto">
                 {newLogoUrl ? <img src={newLogoUrl} className="w-full h-full object-cover" /> : <Image className="w-6 h-6 text-slate-300" />}
             </div>
             <span className="text-[9px] font-black uppercase text-blue-600">Logo del Sistema</span>
          </div>
          <div className="flex-1 w-full space-y-4">
             <div className="flex items-center gap-2 text-slate-800 mb-1">
                <Palette className="w-4 h-4" />
                <h3 className="font-bold text-sm uppercase tracking-widest">Personalizar Marca de la Plataforma</h3>
             </div>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                  className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                  placeholder="https://tuempresa.com/logo.png"
                />
                <button 
                  onClick={handleUpdateGlobalLogo}
                  className="bg-slate-800 text-white px-6 py-3 rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all shadow-lg"
                >
                  Cambiar Logo Global
                </button>
             </div>
             <p className="text-[10px] text-slate-500 font-medium italic">Este logo lo verán todas las agencias que no hayan configurado su propia marca blanca.</p>
          </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Agencias Totales</p>
                <h3 className="text-3xl font-black text-slate-800">{totalClients}</h3>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl"><Building className="w-7 h-7" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Ingreso Mensual (MRR)</p>
                <h3 className="text-3xl font-black text-slate-800">${totalMRR}</h3>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl"><DollarSign className="w-7 h-7" /></div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mb-1">Cuentas Activas</p>
                <h3 className="text-3xl font-black text-slate-800">{activeClients}</h3>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl"><Users className="w-7 h-7" /></div>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Agencia / Branding</th>
              <th className="px-8 py-5">Estado</th>
              <th className="px-8 py-5">Ingresos</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-black overflow-hidden border border-slate-100">
                        {tenant.logoUrl ? <img src={tenant.logoUrl} className="w-full h-full object-cover" /> : tenant.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-sm">{tenant.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{tenant.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                    tenant.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tenant.status}
                  </span>
                </td>
                <td className="px-8 py-5 text-slate-900 font-black text-sm">${tenant.monthlyRevenue}</td>
                <td className="px-8 py-5 text-right">
                  <button 
                    onClick={(e) => handleDelete(tenant.id, e)} 
                    className="p-2 text-slate-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4">
              <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-xl animate-in zoom-in duration-300 overflow-hidden">
                  <div className="flex justify-between items-center p-10 border-b border-slate-50 bg-slate-50/30">
                      <div>
                          <h3 className="text-2xl font-black text-slate-800">Nueva Agencia</h3>
                          <p className="text-slate-500 text-sm font-medium">Registra un nuevo cliente de Marca Blanca.</p>
                      </div>
                      <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="p-10 space-y-6">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nombre Agencia</label>
                          <input type="text" value={newTenant.name} onChange={(e) => setNewTenant({...newTenant, name: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl" placeholder="Ej. Agencia Digital" />
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Email Admin</label>
                          <input type="email" value={newTenant.adminEmail} onChange={(e) => setNewTenant({...newTenant, adminEmail: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl" placeholder="admin@agencia.com" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Password Inicial</label>
                        <input type="text" value={newTenant.adminPassword} onChange={(e) => setNewTenant({...newTenant, adminPassword: e.target.value})} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl" placeholder="••••••••" />
                      </div>
                  </div>

                  <div className="p-10 bg-slate-50/50 flex justify-end gap-4">
                        <button onClick={() => setIsAddModalOpen(false)} className="px-8 py-3 text-slate-500 font-bold">Cancelar</button>
                        <button onClick={handleAddClient} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black shadow-lg shadow-blue-100">Crear Acceso</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default ResellerPortal;
