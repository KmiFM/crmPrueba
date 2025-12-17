import React, { useState } from 'react';
import { MOCK_TENANTS } from '../constants';
import { Tenant } from '../types';
import { Plus, MoreHorizontal, CheckCircle, AlertCircle, Search, DollarSign, Users, Building, Trash2, X, Mail, Phone, MapPin, CreditCard, FileText, Activity, Clock, Edit2, Save, Link2, ShieldCheck, Loader2 } from 'lucide-react';

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

  const [newTenant, setNewTenant] = useState({ name: '', contactPerson: '', monthlyRevenue: 0, syncStripe: false });

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
    if (!newTenant.name || !newTenant.contactPerson) return;

    const tenant: Tenant = {
        id: Date.now().toString(),
        name: newTenant.name,
        contactPerson: newTenant.contactPerson,
        status: 'trial',
        users: 1,
        monthlyRevenue: Number(newTenant.monthlyRevenue) || 0,
        nextBilling: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0]
    };
    
    // Simulate Stripe Sync
    if (newTenant.syncStripe && stripeConfig.connected) {
        console.log(`[Stripe Mock] Creating Customer ${tenant.name} and Subscription...`);
    }

    setTenants([...tenants, tenant]);
    setIsAddModalOpen(false);
    setNewTenant({ name: '', contactPerson: '', monthlyRevenue: 0, syncStripe: false });
  };

  const handleSaveChanges = () => {
      if (!editFormData) return;
      setTenants(tenants.map(t => t.id === editFormData.id ? editFormData : t));
      setSelectedTenant(editFormData);
      setIsEditing(false);
  };

  const handleConnectStripe = () => {
      setIsConnectingStripe(true);
      // Simulate API verification
      setTimeout(() => {
          setStripeConfig(prev => ({ ...prev, connected: true }));
          setIsConnectingStripe(false);
      }, 1500);
  };

  return (
    <div className="p-8 h-full overflow-y-auto relative">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reseller Portal</h1>
          <p className="text-slate-500">Manage your client instances, subscriptions, and revenue.</p>
        </div>
        <div className="flex gap-3">
            <button 
                onClick={() => setIsPaymentModalOpen(true)}
                className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
            <CreditCard className="w-4 h-4" />
            Payment Settings
            </button>
            <button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
            >
            <Plus className="w-4 h-4" />
            Add Client
            </button>
        </div>
      </div>

      {/* Metrics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium">Total Clients</p>
                <h3 className="text-2xl font-bold text-slate-800">{totalClients}</h3>
            </div>
            <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                <Building className="w-6 h-6" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium">Monthly Revenue (MRR)</p>
                <h3 className="text-2xl font-bold text-slate-800">${totalMRR}</h3>
            </div>
            <div className="p-3 bg-emerald-100 text-emerald-600 rounded-lg">
                <DollarSign className="w-6 h-6" />
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
            <div>
                <p className="text-slate-500 text-sm font-medium">Active Subscriptions</p>
                <h3 className="text-2xl font-bold text-slate-800">{activeClients}</h3>
            </div>
            <div className="p-3 bg-purple-100 text-purple-600 rounded-lg">
                <Users className="w-6 h-6" />
            </div>
        </div>
      </div>

      {/* Clients Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        <div className="p-4 border-b border-slate-200 flex gap-4">
            <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input 
                    type="text" 
                    placeholder="Search clients..." 
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
            </div>
        </div>
        
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Client Agency / Company</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Users</th>
              <th className="px-6 py-4">MRR</th>
              <th className="px-6 py-4">Next Billing</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-slate-50 transition-colors group cursor-pointer" onClick={() => handleTenantClick(tenant)}>
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-slate-900">{tenant.name}</div>
                    <div className="text-xs text-slate-500">Contact: {tenant.contactPerson}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    tenant.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {tenant.status === 'active' ? <CheckCircle className="w-3 h-3 mr-1" /> : <AlertCircle className="w-3 h-3 mr-1" />}
                    {tenant.status.charAt(0).toUpperCase() + tenant.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-600 text-sm">
                  {tenant.users} agents
                </td>
                 <td className="px-6 py-4 text-slate-900 font-medium text-sm flex items-center gap-1">
                  ${tenant.monthlyRevenue}
                  {stripeConfig.connected && tenant.monthlyRevenue > 0 && (
                      <div className="text-purple-500" title="Synced with Stripe">
                          <Link2 className="w-3 h-3" />
                      </div>
                  )}
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">
                  {tenant.nextBilling}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleTenantClick(tenant); }} 
                        className="text-slate-400 hover:text-blue-600 transition-colors" 
                        title="Manage details"
                      >
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(tenant.id, e)} 
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete client"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                  </div>
                </td>
              </tr>
            ))}
            {tenants.length === 0 && (
                <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-slate-500">
                        No clients found. Add one to get started.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Payment Settings Modal */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-purple-600" />
                        Payment Gateway
                    </h3>
                    <button onClick={() => setIsPaymentModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6">
                    <div className={`p-4 rounded-xl border flex items-center justify-between ${stripeConfig.connected ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-200'}`}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                                <span className="font-bold text-slate-700 text-lg">S</span>
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-800">Stripe Payments</h4>
                                <p className={`text-xs ${stripeConfig.connected ? 'text-emerald-600' : 'text-slate-500'}`}>
                                    {stripeConfig.connected ? 'Connected and processing' : 'Not connected'}
                                </p>
                            </div>
                        </div>
                        <div className={`px-3 py-1 rounded-full text-xs font-bold ${stripeConfig.connected ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                            {stripeConfig.connected ? 'ACTIVE' : 'OFFLINE'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Publishable Key</label>
                            <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input 
                                    type="text" 
                                    value={stripeConfig.publicKey}
                                    onChange={(e) => setStripeConfig({...stripeConfig, publicKey: e.target.value})}
                                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono"
                                    placeholder="pk_test_..."
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Secret Key</label>
                             <div className="relative">
                                <ShieldCheck className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <input 
                                    type="password" 
                                    value={stripeConfig.secretKey}
                                    onChange={(e) => setStripeConfig({...stripeConfig, secretKey: e.target.value})}
                                    className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none text-sm font-mono"
                                    placeholder="sk_test_..."
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
                    <button 
                        onClick={() => setIsPaymentModalOpen(false)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white transition-colors"
                    >
                        Close
                    </button>
                    <button 
                        onClick={handleConnectStripe}
                        disabled={isConnectingStripe || stripeConfig.connected}
                        className={`px-4 py-2 text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${stripeConfig.connected ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-purple-600 hover:bg-purple-700'}`}
                    >
                        {isConnectingStripe ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {stripeConfig.connected ? 'Settings Saved' : 'Connect Account'}
                    </button>
                </div>
            </div>
        </div>
      )}

      {/* Add Client Modal */}
      {isAddModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg font-bold text-slate-800">Add New Client</h3>
                      <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          <X className="w-5 h-5" />
                      </button>
                  </div>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. Acme Agency"
                            value={newTenant.name}
                            onChange={(e) => setNewTenant({...newTenant, name: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Contact Person</label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="e.g. John Doe"
                            value={newTenant.contactPerson}
                            onChange={(e) => setNewTenant({...newTenant, contactPerson: e.target.value})}
                          />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Revenue ($)</label>
                          <input 
                            type="number" 
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                            placeholder="0.00"
                            value={newTenant.monthlyRevenue}
                            onChange={(e) => setNewTenant({...newTenant, monthlyRevenue: parseFloat(e.target.value)})}
                          />
                      </div>

                      {/* Stripe Sync Toggle */}
                      {stripeConfig.connected && (
                          <div className="bg-purple-50 p-3 rounded-lg border border-purple-100 flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                  <CreditCard className="w-4 h-4 text-purple-600" />
                                  <span className="text-sm font-medium text-purple-900">Sync with Stripe</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                  <input 
                                    type="checkbox" 
                                    className="sr-only peer"
                                    checked={newTenant.syncStripe}
                                    onChange={(e) => setNewTenant({...newTenant, syncStripe: e.target.checked})}
                                  />
                                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                              </label>
                          </div>
                      )}

                      <div className="pt-2">
                        <button 
                            onClick={handleAddClient}
                            disabled={!newTenant.name || !newTenant.contactPerson}
                            className="w-full bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {newTenant.syncStripe ? 'Create & Subscribe' : 'Create Account'}
                        </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* View Tenant Details Modal */}
      {selectedTenant && editFormData && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in duration-200 flex flex-col">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50 rounded-t-xl">
              <div className="flex-1 mr-4">
                 <div className="flex items-center gap-3 mb-1">
                    {isEditing ? (
                        <input 
                            type="text" 
                            value={editFormData.name}
                            onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                            className="text-xl font-bold text-slate-800 bg-white border border-slate-300 rounded px-2 py-1 w-full max-w-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                    ) : (
                        <h2 className="text-xl font-bold text-slate-800">{selectedTenant.name}</h2>
                    )}
                    
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider flex-shrink-0 ${
                      selectedTenant.status === 'active' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {selectedTenant.status}
                    </span>
                 </div>
                 <p className="text-sm text-slate-500 flex items-center gap-1">
                   ID: <span className="font-mono text-slate-400">{selectedTenant.id}</span>
                 </p>
              </div>
              <button 
                onClick={() => setSelectedTenant(null)}
                className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 p-2 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-8">
              
              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Details</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <Users className="w-4 h-4" />
                      </div>
                      <div className="flex-1">
                        {isEditing ? (
                            <input 
                                type="text"
                                value={editFormData.contactPerson}
                                onChange={(e) => setEditFormData({...editFormData, contactPerson: e.target.value})}
                                className="font-medium text-slate-900 w-full bg-white border border-slate-300 rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-500 outline-none mb-1"
                            />
                        ) : (
                            <p className="font-medium text-slate-900">{selectedTenant.contactPerson}</p>
                        )}
                        <p className="text-slate-500 text-xs">Primary Contact</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                       <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                        <Mail className="w-4 h-4" />
                       </div>
                       <p className="text-slate-600">admin@{selectedTenant.name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com</p>
                    </div>
                     <div className="flex items-center gap-3 text-sm">
                       <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                        <Phone className="w-4 h-4" />
                       </div>
                       <p className="text-slate-600">+1 (555) 000-0000</p>
                    </div>
                     <div className="flex items-center gap-3 text-sm">
                       <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                        <MapPin className="w-4 h-4" />
                       </div>
                       <p className="text-slate-600">San Francisco, CA</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subscription & Billing</h4>
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Current Plan</span>
                      <span className="font-semibold text-slate-800">Business Pro</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Monthly Revenue</span>
                      {isEditing ? (
                           <div className="flex items-center gap-1">
                               <span className="text-emerald-600 font-semibold">$</span>
                               <input 
                                    type="number"
                                    value={editFormData.monthlyRevenue}
                                    onChange={(e) => setEditFormData({...editFormData, monthlyRevenue: Number(e.target.value)})}
                                    className="font-semibold text-emerald-600 w-24 bg-white border border-slate-300 rounded px-2 py-0.5 text-right text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                           </div>
                      ) : (
                          <span className="font-semibold text-emerald-600">${selectedTenant.monthlyRevenue.toFixed(2)}</span>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Billing Cycle</span>
                      <span className="text-slate-800">Monthly</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500">Next Invoice</span>
                      <span className="text-slate-800">{selectedTenant.nextBilling}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-200 mt-2 flex items-center gap-2 text-xs text-slate-500">
                      <CreditCard className="w-3 h-3" />
                      <span>Visa ending in 4242</span>
                      {stripeConfig.connected && <span className="text-purple-600 font-medium ml-auto flex items-center gap-1"><Link2 className="w-3 h-3"/> Stripe Linked</span>}
                    </div>
                  </div>
                </div>
              </div>

              {/* Activity Log */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Activity className="w-4 h-4" /> Recent Activity
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                   {[
                     { action: 'Invoice #INV-2023-001 Generated', date: '2 hours ago', icon: FileText, color: 'text-blue-500 bg-blue-50' },
                     { action: 'Added 2 new agent seats', date: '1 day ago', icon: Users, color: 'text-emerald-500 bg-emerald-50' },
                     { action: 'Support Ticket #4092 Opened', date: '3 days ago', icon: AlertCircle, color: 'text-amber-500 bg-amber-50' },
                     { action: 'Subscription Renewed', date: '1 week ago', icon: Clock, color: 'text-purple-500 bg-purple-50' },
                   ].map((item, idx) => (
                     <div key={idx} className="flex items-center gap-4 p-3 border-b border-slate-100 last:border-0 hover:bg-slate-50">
                        <div className={`p-2 rounded-lg ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-slate-800">{item.action}</p>
                          <p className="text-xs text-slate-400">{item.date}</p>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50/50 rounded-b-xl flex justify-between items-center">
              <button className="text-slate-500 hover:text-slate-700 text-sm font-medium">View Audit Logs</button>
              <div className="flex gap-3">
                 {isEditing ? (
                    <>
                        <button 
                            onClick={() => { setIsEditing(false); setEditFormData(selectedTenant); }}
                            className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleSaveChanges}
                            className="px-4 py-2 bg-emerald-600 rounded-lg text-white font-medium text-sm hover:bg-emerald-700 transition-colors flex items-center gap-2"
                        >
                            <Save className="w-4 h-4" /> Save Changes
                        </button>
                    </>
                 ) : (
                    <>
                         <button 
                          onClick={() => setSelectedTenant(null)}
                          className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium text-sm hover:bg-slate-50 transition-colors"
                         >
                           Close
                         </button>
                         <button 
                            onClick={() => setIsEditing(true)}
                            className="px-4 py-2 bg-blue-600 rounded-lg text-white font-medium text-sm hover:bg-blue-700 transition-colors flex items-center gap-2"
                         >
                           <Edit2 className="w-4 h-4" /> Edit Details
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