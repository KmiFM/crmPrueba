import React, { useState } from 'react';
import { MOCK_TENANTS } from '../constants';
import { Tenant } from '../types';
import { Plus, MoreHorizontal, CheckCircle, AlertCircle, Search, DollarSign, Users, Building, Trash2, X, Mail, Phone, MapPin, CreditCard, FileText, Activity, Clock, Edit2, Save, Link2, ShieldCheck, Loader2, Briefcase, Globe, ChevronDown } from 'lucide-react';

const ResellerPortal = () => {
  const [tenants, setTenants] = useState<Tenant[]>(MOCK_TENANTS);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedTenant, setSelectedTenant] = useState<Tenant | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Tenant | null>(null);
  
  // Stripe & Payment State
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [stripeConfig, setStripeConfig] = useState({
      connected: false,
      publicKey: 'pk_test_...',
      secretKey: '',
      webhookSecret: ''
  });
  const [isConnectingStripe, setIsConnectingStripe] = useState(false);

  const [newTenant, setNewTenant] = useState<Omit<Tenant, 'id' | 'nextBilling'>>({ 
    name: '', 
    contactPerson: '', 
    email: '',
    phoneNumber: '',
    address: '',
    plan: 'basic',
    status: 'trial',
    users: 2,
    monthlyRevenue: 100
  });

  const [isSyncingWithStripe, setIsSyncingWithStripe] = useState(false);

  // Metrics Calculation
  const totalClients = tenants.length;
  const totalMRR = tenants.reduce((acc, t) => acc + t.monthlyRevenue, 0);
  const activeClients = tenants.filter(t => t.status === 'active').length;

  const handleTenantClick = (tenant: Tenant) => {
      setSelectedTenant(tenant);
      setEditFormData(tenant);
      setIsEditing(false);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to remove this client? This action cannot be undone.')) {
      setTenants(tenants.filter(t => t.id !== id));
      if (selectedTenant?.id === id) setSelectedTenant(null);
    }
  };

  const handleAddClient = () => {
    if (!newTenant.name || !newTenant.contactPerson || !newTenant.email) return;

    const tenant: Tenant = {
        id: Date.now().toString(),
        ...newTenant,
        nextBilling: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
    };
    
    setTenants([...tenants, tenant]);
    setIsAddModalOpen(false);
    // Reset form
    setNewTenant({ 
        name: '', 
        contactPerson: '', 
        email: '',
        phoneNumber: '',
        address: '',
        plan: 'basic',
        status: 'trial',
        users: 2,
        monthlyRevenue: 100
    });
  };

  const handleSaveChanges = () => {
      if (!editFormData) return;
      setTenants(tenants.map(t => t.id === editFormData.id ? editFormData : t));
      setSelectedTenant(editFormData);
      setIsEditing(false);
  };

  const handleConnectStripe = () => {
      setIsConnectingStripe(true);
      setTimeout(() => {
          setStripeConfig(prev => ({ ...prev, connected: true }));
          setIsConnectingStripe(false);
      }, 1500);
  };

  const updatePlan = (plan: 'basic' | 'pro' | 'golden') => {
      const prices = { basic: 100, pro: 200, golden: 300 };
      const agents = { basic: 2, pro: 5, golden: 10 };
      setNewTenant({ 
          ...newTenant, 
          plan, 
          monthlyRevenue: prices[plan],
          users: agents[plan]
      });
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative bg-slate-50/30">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Reseller Portal</h1>
          <p className="text-slate-500 font-medium text-sm">Panel de control de agencias y facturación SaaS.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-xl flex items-center gap-2 font-bold text-sm shadow-sm transition-all"
            >
            <CreditCard className="w-4 h-4" />
            Configurar Pasarela
            </button>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 font-bold text-sm shadow-lg shadow-blue-100 transition-all active:scale-95"
            >
            <Plus className="w-4 h-4" />
            Nueva Agencia
            </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Total Clientes</p>
                <h3 className="text-3xl font-black text-slate-800">{totalClients}</h3>
            </div>
            <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl shadow-inner">
                <Building className="w-7 h-7" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">MRR Acumulado</p>
                <h3 className="text-3xl font-black text-slate-800">${totalMRR}</h3>
            </div>
            <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl shadow-inner">
                <DollarSign className="w-7 h-7" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">Suscripciones Activas</p>
                <h3 className="text-3xl font-black text-slate-800">{activeClients}</h3>
            </div>
            <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl shadow-inner">
                <Users className="w-7 h-7" />
            </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-5 border-b border-slate-100 flex gap-4 bg-slate-50/50">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Buscar agencia..." 
                    className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm font-medium transition-all"
                />
            </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-white text-slate-400 text-[10px] font-black uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-6 py-4">Agencia / Responsable</th>
              <th className="px-6 py-4">Estado</th>
              <th className="px-6 py-4">Agentes</th>
              <th className="px-6 py-4">MRR</th>
              <th className="px-6 py-4">Plan</th>
              <th className="px-6 py-4 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer" onClick={() => handleTenantClick(tenant)}>
                <td className="px-6 py-5">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center font-bold text-slate-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                        {tenant.name.charAt(0)}
                    </div>
                    <div>
                        <div className="font-bold text-slate-900 text-sm">{tenant.name}</div>
                        <div className="text-xs text-slate-500 font-medium">{tenant.contactPerson} • {tenant.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter ${
                    tenant.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tenant.status}
                  </span>
                </td>
                <td className="px-6 py-5 text-slate-600 text-sm font-semibold">
                  {tenant.users} agentes
                </td>
                 <td className="px-6 py-5 text-slate-900 font-black text-sm">
                  ${tenant.monthlyRevenue}
                </td>
                <td className="px-6 py-5">
                   <div className="flex items-center gap-2">
                       <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                       <span className="text-xs font-bold text-slate-600 uppercase tracking-tighter">{tenant.plan}</span>
                   </div>
                </td>
                <td className="px-6 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTenantClick(tenant); }} 
                        className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(tenant.id, e)} 
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Payment Settings Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg animate-in zoom-in duration-300">
                <div className="flex justify-between items-center p-8 border-b border-slate-50">
                    <h3 className="text-xl font-black text-slate-800 flex items-center gap-3">
                        <CreditCard className="w-6 h-6 text-indigo-600" />
                        Configurar Cobros
                    </h3>
                    <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                        <X className="w-6 h-6" />
                    </button>
                </div>
                
                <div className="p-8 space-y-6">
                    <div className={`p-5 rounded-2xl border-2 flex items-center justify-between ${stripeConfig.connected ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-100 text-white font-black text-xl">
                                S
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Stripe Business</h4>
                                <p className={`text-xs font-medium ${stripeConfig.connected ? 'text-emerald-600' : 'text-slate-500'}`}>
                                    {stripeConfig.connected ? 'Conectado y listo' : 'Desconectado'}
                                </p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${stripeConfig.connected ? 'bg-emerald-600 text-white' : 'bg-slate-300 text-white'}`}>
                            {stripeConfig.connected ? 'ACTIVO' : 'OFFLINE'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Publishable Key</label>
                            <input 
                                type="text" 
                                value={stripeConfig.publicKey}
                                onChange={(e) => setStripeConfig({...stripeConfig, publicKey: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Secret Key</label>
                            <input 
                                type="password" 
                                value={stripeConfig.secretKey}
                                onChange={(e) => setStripeConfig({...stripeConfig, secretKey: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-mono"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-8 border-t border-slate-50 bg-slate-50/50 flex justify-end gap-3 rounded-b-3xl">
                    <button 
                        onClick={() => setIsPaymentModalOpen(false)}
                        className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-bold text-sm hover:bg-white transition-all"
                    >
                        Cerrar
                    </button>
                    <button 
                        onClick={handleConnectStripe}
                        disabled={isConnectingStripe || stripeConfig.connected}
                        className={`px-6 py-3 text-white rounded-xl font-bold text-sm transition-all shadow-lg ${stripeConfig.connected ? 'bg-emerald-600 shadow-emerald-100' : 'bg-indigo-600 shadow-indigo-100'}`}
                    >
                        {isConnectingStripe ? <Loader2 className="w-5 h-5 animate-spin" /> : (stripeConfig.connected ? 'Guardado' : 'Conectar Stripe')}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* COMPREHENSIVE ADD CLIENT MODAL */}
      {isAddModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4 overflow-y-auto">
              <div className="bg-white rounded-[32px] shadow-2xl w-full max-w-2xl my-8 animate-in zoom-in duration-300">
                  <div className="flex justify-between items-center p-8 border-b border-slate-100">
                      <div>
                          <h3 className="text-2xl font-black text-slate-800">Alta de Nueva Agencia</h3>
                          <p className="text-slate-500 text-sm font-medium">Configura todos los parámetros del nuevo tenant.</p>
                      </div>
                      <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors p-2 hover:bg-slate-50 rounded-full">
                          <X className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Company Info */}
                      <div className="space-y-4">
                          <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Información de Empresa</h4>
                          <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nombre de la Agencia</label>
                              <div className="relative">
                                  <Building className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <input 
                                    type="text" 
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition-all"
                                    placeholder="Ej. Acme Marketing"
                                    value={newTenant.name}
                                    onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Dirección Física</label>
                              <div className="relative">
                                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <input 
                                    type="text" 
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition-all"
                                    placeholder="Ciudad, País"
                                    value={newTenant.address}
                                    onChange={(e) => setNewTenant({...newTenant, address: e.target.value})}
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Contact Info */}
                      <div className="space-y-4">
                          <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Datos del Responsable</h4>
                          <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Nombre Completo</label>
                              <div className="relative">
                                  <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <input 
                                    type="text" 
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition-all"
                                    placeholder="Ej. Juan Pérez"
                                    value={newTenant.contactPerson}
                                    onChange={(e) => setNewTenant({...newTenant, contactPerson: e.target.value})}
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Email de Contacto</label>
                              <div className="relative">
                                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <input 
                                    type="email" 
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition-all"
                                    placeholder="admin@agencia.com"
                                    value={newTenant.email}
                                    onChange={(e) => setNewTenant({...newTenant, email: e.target.value})}
                                  />
                              </div>
                          </div>
                          <div>
                              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Teléfono</label>
                              <div className="relative">
                                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                  <input 
                                    type="text" 
                                    className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-semibold transition-all"
                                    placeholder="+1 234 567 890"
                                    value={newTenant.phoneNumber}
                                    onChange={(e) => setNewTenant({...newTenant, phoneNumber: e.target.value})}
                                  />
                              </div>
                          </div>
                      </div>

                      {/* Plan Selection */}
                      <div className="md:col-span-2 space-y-4">
                          <h4 className="text-xs font-black text-blue-600 uppercase tracking-[0.2em] mb-4">Configuración del Plan</h4>
                          <div className="grid grid-cols-3 gap-3">
                              {(['basic', 'pro', 'golden'] as const).map(p => (
                                  <button
                                    key={p}
                                    onClick={() => updatePlan(p)}
                                    className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-1 ${
                                        newTenant.plan === p 
                                        ? 'border-blue-600 bg-blue-50/50 ring-2 ring-blue-100 shadow-md' 
                                        : 'border-slate-100 hover:border-slate-300 bg-white'
                                    }`}
                                  >
                                      <span className="text-[10px] font-black uppercase tracking-widest">{p}</span>
                                      <span className="text-lg font-black">${p === 'basic' ? 100 : p === 'pro' ? 200 : 300}</span>
                                      <span className="text-[9px] text-slate-500 font-bold">{p === 'basic' ? '2' : p === 'pro' ? '5' : '10'} agentes</span>
                                  </button>
                              ))}
                          </div>
                      </div>

                      {/* Revenue Override & Sync */}
                      <div className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1.5">Ingreso Mensual Manual ($)</label>
                            <input 
                                type="number" 
                                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none text-sm font-black"
                                value={newTenant.monthlyRevenue}
                                onChange={(e) => setNewTenant({...newTenant, monthlyRevenue: parseFloat(e.target.value)})}
                            />
                        </div>
                      </div>

                      <div className="space-y-4 flex flex-col justify-end">
                         <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
                             <div className="flex items-center gap-3">
                                 <CreditCard className="w-5 h-5 text-indigo-600" />
                                 <span className="text-xs font-bold text-indigo-900 uppercase tracking-widest">Sincronizar con Stripe</span>
                             </div>
                             <label className="relative inline-flex items-center cursor-pointer">
                                <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={isSyncingWithStripe}
                                    onChange={(e) => setIsSyncingWithStripe(e.target.checked)}
                                />
                                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                             </label>
                         </div>
                      </div>
                  </div>

                  <div className="p-8 border-t border-slate-100 bg-slate-50/50 rounded-b-[32px] flex justify-end gap-4">
                        <button 
                            onClick={() => setIsAddModalOpen(false)}
                            className="px-8 py-3 text-slate-500 font-bold text-sm hover:text-slate-800 transition-all"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleAddClient}
                            disabled={!newTenant.name || !newTenant.contactPerson || !newTenant.email}
                            className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isSyncingWithStripe ? 'Crear y Cobrar con Stripe' : 'Dar de Alta Ahora'}
                        </button>
                  </div>
              </div>
          </div>
      )}

      {/* DETAILED VIEW TENANT MODAL (Updated with full editability) */}
      {selectedTenant && editFormData && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in duration-300 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-10 border-b border-slate-50 flex justify-between items-start bg-slate-50/30">
              <div className="flex-1 mr-4">
                 <div className="flex items-center gap-4 mb-2">
                    <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-blue-100">
                        {editFormData.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                        {isEditing ? (
                            <input 
                                type="text" 
                                value={editFormData.name}
                                onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                                className="text-2xl font-black text-slate-800 bg-white border border-slate-200 rounded-xl px-4 py-2 w-full focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            />
                        ) : (
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">{selectedTenant.name}</h2>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                            {isEditing ? (
                                <select 
                                    value={editFormData.status}
                                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value as any})}
                                    className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="active">Active</option>
                                    <option value="trial">Trial</option>
                                    <option value="suspended">Suspended</option>
                                </select>
                            ) : (
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                  selectedTenant.status === 'active' 
                                    ? 'bg-emerald-600 text-white' 
                                    : 'bg-amber-500 text-white'
                                }`}>
                                  {selectedTenant.status}
                                </span>
                            )}
                        </div>
                    </div>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedTenant(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-3 rounded-full transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-10 space-y-10 overflow-y-auto scrollbar-hide">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Datos del Responsable</h4>
                  <div className="space-y-5">
                    {/* Responsable */}
                    <div className="flex items-center gap-4 text-sm group">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-xl shadow-sm">
                        <Users className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        {isEditing ? (
                            <input 
                                type="text"
                                value={editFormData.contactPerson}
                                onChange={(e) => setEditFormData({...editFormData, contactPerson: e.target.value})}
                                className="font-bold text-slate-900 w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                            />
                        ) : (
                            <p className="font-bold text-slate-800">{selectedTenant.contactPerson}</p>
                        )}
                        <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Director General</p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-4 text-sm">
                       <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
                        <Mail className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                            {isEditing ? (
                                <input 
                                    type="email"
                                    value={editFormData.email}
                                    onChange={(e) => setEditFormData({...editFormData, email: e.target.value})}
                                    className="text-slate-700 font-bold w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                />
                            ) : (
                                <p className="text-slate-700 font-bold">{selectedTenant.email}</p>
                            )}
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Correo Corporativo</p>
                       </div>
                    </div>

                    {/* Teléfono */}
                    <div className="flex items-center gap-4 text-sm">
                       <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
                        <Phone className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={editFormData.phoneNumber}
                                    onChange={(e) => setEditFormData({...editFormData, phoneNumber: e.target.value})}
                                    className="text-slate-700 font-bold w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                />
                            ) : (
                                <p className="text-slate-700 font-bold">{selectedTenant.phoneNumber}</p>
                            )}
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Teléfono Principal</p>
                       </div>
                    </div>

                    {/* Dirección */}
                    <div className="flex items-center gap-4 text-sm">
                       <div className="p-3 bg-slate-50 text-slate-500 rounded-xl">
                        <MapPin className="w-5 h-5" />
                       </div>
                       <div className="flex-1">
                            {isEditing ? (
                                <input 
                                    type="text"
                                    value={editFormData.address}
                                    onChange={(e) => setEditFormData({...editFormData, address: e.target.value})}
                                    className="text-slate-700 font-bold w-full bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
                                />
                            ) : (
                                <p className="text-slate-700 font-bold">{selectedTenant.address || 'No registrada'}</p>
                            )}
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">Sede Social</p>
                       </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Facturación y Planes</h4>
                  <div className="bg-slate-900 text-white p-8 rounded-[32px] shadow-2xl relative overflow-hidden group">
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
                    
                    <div className="relative z-10 space-y-5">
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Plan Actual</span>
                          {isEditing ? (
                                <select 
                                    value={editFormData.plan}
                                    onChange={(e) => setEditFormData({...editFormData, plan: e.target.value as any})}
                                    className="font-black text-blue-400 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                >
                                    <option value="basic" className="text-slate-900">Basic</option>
                                    <option value="pro" className="text-slate-900">Pro</option>
                                    <option value="golden" className="text-slate-900">Golden</option>
                                </select>
                          ) : (
                                <span className="font-black text-blue-400 uppercase tracking-tighter text-lg">{selectedTenant.plan}</span>
                          )}
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Mensualidad</span>
                          {isEditing ? (
                               <div className="flex items-center gap-2">
                                    <input 
                                        type="number"
                                        value={editFormData.monthlyRevenue}
                                        onChange={(e) => setEditFormData({...editFormData, monthlyRevenue: Number(e.target.value)})}
                                        className="font-black text-emerald-400 w-24 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-right text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                                    />
                                    <span className="text-xs text-slate-500">USD</span>
                               </div>
                          ) : (
                              <span className="font-black text-emerald-400 text-2xl">${selectedTenant.monthlyRevenue} <span className="text-xs font-medium text-slate-500">USD</span></span>
                          )}
                        </div>
                        <div className="flex justify-between items-center pt-5 border-t border-white/10">
                          <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Próximo Cobro</span>
                          <span className="text-sm font-black text-slate-200">{selectedTenant.nextBilling}</span>
                        </div>
                        <div className="pt-3 flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                          <CreditCard className="w-4 h-4" />
                          <span>Pasarela Stripe vinculada</span>
                          {stripeConfig.connected && <Link2 className="w-3 h-3 text-emerald-400 ml-auto" />}
                        </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] mb-6 flex items-center gap-2">
                   Registro de Auditoría
                </h4>
                <div className="space-y-1">
                   {[
                     { action: `Plan ${selectedTenant.plan.toUpperCase()} Activado`, date: 'Hace 2 horas', icon: ShieldCheck, color: 'text-blue-600 bg-blue-50' },
                     { action: `Instancia WhatsApp Desplegada`, date: 'Ayer', icon: Globe, color: 'text-emerald-600 bg-emerald-50' },
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-5 p-5 hover:bg-slate-50 rounded-2xl transition-all cursor-default group">
                        <div className={`p-3 rounded-xl ${item.color} shadow-sm group-hover:scale-110 transition-transform`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{item.action}</p>
                          <p className="text-xs text-slate-400 font-medium">{item.date}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

            </div>

            <div className="p-10 border-t border-slate-50 bg-slate-50/20 flex justify-between items-center rounded-b-[40px]">
              <button className="text-slate-400 hover:text-slate-800 text-xs font-black uppercase tracking-[0.2em] transition-all">Ver Logs Completos</button>
              <div className="flex gap-4">
                 {isEditing ? (
                    <>
                        <button 
                            onClick={() => { setIsEditing(false); setEditFormData(selectedTenant); }}
                            className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={handleSaveChanges}
                            className="px-10 py-3 bg-emerald-600 rounded-2xl text-white font-black text-sm hover:bg-emerald-700 shadow-xl shadow-emerald-100 transition-all flex items-center gap-2"
                        >
                            <Save className="w-5 h-5" /> Guardar Cambios
                        </button>
                    </>
                 ) : (
                    <>
                         <button 
                          onClick={() => setSelectedTenant(null)}
                          className="px-8 py-3 bg-white border border-slate-200 rounded-2xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
                         >
                           Cerrar
                         </button>
                         <button 
                            onClick={() => setIsEditing(true)}
                            className="px-10 py-3 bg-blue-600 rounded-2xl text-white font-black text-sm hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all flex items-center gap-2"
                         >
                           <Edit2 className="w-5 h-5" /> Editar Ficha
                         </button>
                    </>
                 )}
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ResellerPortal;