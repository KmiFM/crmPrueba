
import React, { useState } from 'react';
import { 
  Save, 
  RefreshCw, 
  Copy, 
  CheckCircle, 
  Lock, 
  Globe, 
  QrCode, 
  Server, 
  Smartphone, 
  Palette, 
  Image, 
  ExternalLink,
  Wifi,
  Zap,
  ShieldCheck,
  Loader2,
  Key
} from 'lucide-react';
import { WhatsAppConfig, Tenant } from '../types';

interface Props {
  onNavigateDocs?: () => void;
  currentTenant?: Tenant;
  onUpdateTenant?: (tenant: Tenant) => void;
}

const IntegrationSettings: React.FC<Props> = ({ onNavigateDocs, currentTenant, onUpdateTenant }) => {
  const [config, setConfig] = useState<WhatsAppConfig>({
    provider: 'cloud',
    phoneNumberId: '123456789012345',
    businessAccountId: '987654321098765',
    accessToken: 'EAAB...',
    baseUrl: 'https://api.myevolution.com',
    apiKey: 'global_api_key_secure',
    instanceName: 'Main_Support',
    webhookUrl: 'https://api.iadscrm.com/v1/webhooks/whatsapp',
    verifyToken: 'iads_verification_token_secure_123',
    status: 'connected'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [showQr, setShowQr] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);
  const [tenantLogo, setTenantLogo] = useState(currentTenant?.logoUrl || '');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleProviderChange = (provider: 'cloud' | 'evolution') => {
    setConfig({ ...config, provider, status: 'disconnected' });
    setTempConfig({ ...config, provider, status: 'disconnected' });
    setIsEditing(false);
    setShowQr(false);
  };

  const handleSave = () => {
    setConfig({ ...tempConfig, status: 'validating' });
    setIsEditing(false);
    setTimeout(() => {
        setConfig({ ...tempConfig, status: 'connected' });
    }, 1500);
  };

  const handleGenerateQr = () => {
    setIsLoadingQr(true);
    setShowQr(false);
    setTimeout(() => {
      setIsLoadingQr(false);
      setShowQr(true);
    }, 2000);
  };

  const handleSaveBranding = () => {
    if (currentTenant && onUpdateTenant) {
      onUpdateTenant({ ...currentTenant, logoUrl: tenantLogo });
      alert("Marca de la agencia actualizada.");
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto max-w-5xl mx-auto space-y-8 bg-slate-50/30">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Configuración Técnica</h1>
          <p className="text-slate-500 font-medium">Gestiona tu conexión con WhatsApp y la identidad de tu plataforma.</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-2xl border border-slate-200 shadow-sm">
           <div className={`w-2 h-2 rounded-full ${config.status === 'connected' ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></div>
           <span className="text-[10px] font-black uppercase text-slate-600 tracking-widest">{config.status}</span>
        </div>
      </div>

      {/* WHITELABEL SECTION */}
      {currentTenant && (
        <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-indigo-50/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <h2 className="font-bold text-slate-800 uppercase text-xs tracking-widest">Identidad de Marca (Whitelabel)</h2>
              </div>
           </div>
           <div className="p-8 flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-shrink-0">
                 <div className="w-24 h-24 rounded-3xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden">
                    {tenantLogo ? (
                      <img src={tenantLogo} alt="Agency Logo" className="w-full h-full object-cover" />
                    ) : (
                      <Image className="w-8 h-8 text-slate-300" />
                    )}
                 </div>
              </div>
              <div className="flex-1 space-y-4 w-full">
                 <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">URL del Logo (Admin & Agentes)</label>
                    <div className="flex gap-2">
                       <input 
                         type="text" 
                         value={tenantLogo}
                         onChange={(e) => setTenantLogo(e.target.value)}
                         placeholder="https://tuagencia.com/logo.png"
                         className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                       />
                       <button 
                        onClick={handleSaveBranding}
                        className="bg-indigo-600 text-white px-8 py-3 rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 flex items-center gap-2"
                       >
                         <Save className="w-4 h-4" /> Aplicar
                       </button>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* WHATSAPP PROVIDER SELECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button 
            onClick={() => handleProviderChange('cloud')}
            className={`p-6 rounded-[24px] border-2 flex items-center gap-5 transition-all relative overflow-hidden group ${
                config.provider === 'cloud' 
                ? 'border-blue-600 bg-blue-50/50 shadow-lg shadow-blue-100' 
                : 'border-white bg-white hover:border-slate-200'
            }`}
          >
              <div className={`p-4 rounded-2xl ${config.provider === 'cloud' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Globe className="w-7 h-7" />
              </div>
              <div className="text-left">
                  <h3 className="font-black text-slate-800 tracking-tight">Official Cloud API</h3>
                  <p className="text-xs text-slate-500 font-medium">Servicio directo de Meta.</p>
              </div>
              {config.provider === 'cloud' && <div className="absolute top-2 right-2"><CheckCircle className="w-4 h-4 text-blue-600" /></div>}
          </button>

          <button 
            onClick={() => handleProviderChange('evolution')}
            className={`p-6 rounded-[24px] border-2 flex items-center gap-5 transition-all relative overflow-hidden group ${
                config.provider === 'evolution' 
                ? 'border-emerald-600 bg-emerald-50/50 shadow-lg shadow-emerald-100' 
                : 'border-white bg-white hover:border-slate-200'
            }`}
          >
              <div className={`p-4 rounded-2xl ${config.provider === 'evolution' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <QrCode className="w-7 h-7" />
              </div>
              <div className="text-left">
                  <h3 className="font-black text-slate-800 tracking-tight">Evolution API</h3>
                  <p className="text-xs text-slate-500 font-medium">Instancia Web (QR Scan).</p>
              </div>
              {config.provider === 'evolution' && <div className="absolute top-2 right-2"><CheckCircle className="w-4 h-4 text-emerald-600" /></div>}
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Technical Form */}
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="font-bold text-slate-800 text-xs uppercase tracking-[0.2em] flex items-center gap-2">
                        {config.provider === 'cloud' ? <Lock className="w-4 h-4 text-blue-600" /> : <Server className="w-4 h-4 text-emerald-600" />}
                        Configuración de {config.provider === 'cloud' ? 'Meta' : 'Servidor'}
                    </h2>
                    {!isEditing ? (
                        <button 
                          onClick={() => { setIsEditing(true); setTempConfig(config); }} 
                          className="text-xs text-blue-600 font-black uppercase hover:underline"
                        >
                          Editar Parámetros
                        </button>
                    ) : (
                        <div className="flex gap-4">
                            <button onClick={() => setIsEditing(false)} className="text-xs text-slate-400 font-bold uppercase">Cancelar</button>
                            <button onClick={handleSave} className="text-xs bg-blue-600 text-white px-4 py-1.5 rounded-xl font-bold uppercase shadow-md">Guardar</button>
                        </div>
                    )}
                </div>
                
                <div className="p-8 space-y-6">
                    {config.provider === 'cloud' ? (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Phone Number ID</label>
                              <input 
                                type="text" 
                                disabled={!isEditing} 
                                value={isEditing ? tempConfig.phoneNumberId : config.phoneNumberId} 
                                onChange={(e) => setTempConfig({...tempConfig, phoneNumberId: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                              />
                           </div>
                           <div>
                              <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Business Account ID</label>
                              <input 
                                type="text" 
                                disabled={!isEditing} 
                                value={isEditing ? tempConfig.businessAccountId : config.businessAccountId} 
                                onChange={(e) => setTempConfig({...tempConfig, businessAccountId: e.target.value})}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                              />
                           </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Permanent Access Token</label>
                          <input 
                            type="password" 
                            disabled={!isEditing} 
                            value={isEditing ? tempConfig.accessToken : config.accessToken} 
                            onChange={(e) => setTempConfig({...tempConfig, accessToken: e.target.value})}
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Evolution Server URL</label>
                            <input 
                              type="text" 
                              disabled={!isEditing} 
                              value={isEditing ? tempConfig.baseUrl : config.baseUrl} 
                              onChange={(e) => setTempConfig({...tempConfig, baseUrl: e.target.value})}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Instance Name</label>
                            <input 
                              type="text" 
                              disabled={!isEditing} 
                              value={isEditing ? tempConfig.instanceName : config.instanceName} 
                              onChange={(e) => setTempConfig({...tempConfig, instanceName: e.target.value})}
                              className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                            />
                          </div>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">API Key (Global/Instance)</label>
                          <div className="relative">
                            <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                            <input 
                              type="password" 
                              disabled={!isEditing} 
                              value={isEditing ? tempConfig.apiKey : config.apiKey} 
                              onChange={(e) => setTempConfig({...tempConfig, apiKey: e.target.value})}
                              className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-mono text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                            />
                          </div>
                        </div>
                      </>
                    )}
                </div>
            </div>

            {/* WEBHOOK PANEL */}
            <div className="bg-slate-900 rounded-[32px] p-8 text-white space-y-6">
                <div className="flex items-center gap-3">
                   <div className="p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-500/20">
                      <Zap className="w-5 h-5 text-white" />
                   </div>
                   <div>
                      <h3 className="font-black text-lg">Webhooks</h3>
                      <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">Configuración de Retorno</p>
                   </div>
                </div>
                
                <div className="space-y-4">
                   <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[9px] font-black text-slate-500 uppercase">Webhook Callback URL</span>
                         <button onClick={() => handleCopy(config.webhookUrl, 'webhook')} className="text-blue-400 hover:text-blue-300">
                            {copied === 'webhook' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                         </button>
                      </div>
                      <code className="text-xs font-mono text-blue-200 break-all">{config.webhookUrl}</code>
                   </div>

                   <div className="p-4 bg-slate-800/50 rounded-2xl border border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[9px] font-black text-slate-500 uppercase">Verify Token (Para Meta)</span>
                         <button onClick={() => handleCopy(config.verifyToken, 'token')} className="text-blue-400 hover:text-blue-300">
                            {copied === 'token' ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                         </button>
                      </div>
                      <code className="text-xs font-mono text-blue-200">{config.verifyToken}</code>
                   </div>
                </div>
                
                <button 
                  onClick={onNavigateDocs}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                >
                   <ExternalLink className="w-4 h-4" /> Leer Documentación de Ayuda
                </button>
            </div>
        </div>

        {/* Status & Side Panel */}
        <div className="space-y-6">
            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
                <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-6">Estado de Conexión</h3>
                
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${config.status === 'connected' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                           <Wifi className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-black text-slate-800">Canal {config.status === 'connected' ? 'Activo' : 'Offline'}</p>
                            <p className="text-[10px] text-slate-500 font-bold uppercase">{config.provider === 'cloud' ? 'Meta Cloud API' : 'Evolution instance'}</p>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50">
                        {config.provider === 'evolution' ? (
                            <div className="space-y-4">
                                <button 
                                  onClick={handleGenerateQr}
                                  disabled={isLoadingQr}
                                  className="w-full bg-emerald-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-100 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
                                >
                                    {isLoadingQr ? <Loader2 className="w-4 h-4 animate-spin" /> : <><QrCode className="w-4 h-4" /> Generar Código QR</>}
                                </button>
                                
                                {showQr && (
                                  <div className="p-6 bg-slate-50 rounded-[32px] border-2 border-emerald-100 animate-in zoom-in duration-300">
                                     <div className="aspect-square bg-white rounded-2xl border border-slate-100 flex items-center justify-center relative overflow-hidden group">
                                         {/* Mock QR Content */}
                                         <div className="grid grid-cols-8 gap-1 p-4 opacity-80">
                                            {Array.from({length: 64}).map((_, i) => (
                                              <div key={i} className={`w-full aspect-square ${Math.random() > 0.5 ? 'bg-slate-800' : 'bg-transparent'}`}></div>
                                            ))}
                                         </div>
                                         <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            {/* Fix: use Smartphone instead of smartphone in Hindi */}
                                            <Smartphone className="w-8 h-8 text-emerald-600 mb-2" />
                                            <span className="text-[8px] font-black uppercase text-emerald-800 px-3 text-center">Escanea con tu WhatsApp</span>
                                         </div>
                                     </div>
                                     <p className="text-[9px] text-center mt-4 text-emerald-600 font-bold uppercase">QR expira en 60s</p>
                                  </div>
                                )}
                            </div>
                        ) : (
                            <div className="p-6 bg-blue-50 rounded-[32px] border border-blue-100">
                                <ShieldCheck className="w-8 h-8 text-blue-600 mb-3" />
                                <p className="text-[10px] font-black text-blue-800 uppercase tracking-widest mb-2">Conexión Oficial</p>
                                <p className="text-[10px] text-blue-600 leading-relaxed font-medium">La API de la nube no requiere escaneo QR. La conexión se valida mediante el Access Token permanente.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-[32px] border border-slate-200 p-8 shadow-sm">
               <h3 className="font-black text-slate-800 text-xs uppercase tracking-widest mb-4">Ayuda Rápida</h3>
               <ul className="space-y-4">
                  <li className="flex gap-3 items-start">
                     <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">?</div>
                     <p className="text-[10px] text-slate-500 leading-relaxed"><span className="font-bold text-slate-700">Meta:</span> Configura tu App en developers.facebook.com</p>
                  </li>
                  <li className="flex gap-3 items-start">
                     <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5 font-bold text-[10px]">?</div>
                     <p className="text-[10px] text-slate-500 leading-relaxed"><span className="font-bold text-slate-700">Evolution:</span> Tu servidor debe tener SSL (HTTPS) activo.</p>
                  </li>
               </ul>
            </div>
        </div>
      </div>
    </div>
  );
};

export default IntegrationSettings;
