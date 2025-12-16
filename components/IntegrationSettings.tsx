import React, { useState } from 'react';
import { Save, RefreshCw, Copy, CheckCircle, AlertCircle, ExternalLink, Lock, Hash, Globe, Smartphone, QrCode, Server, Wifi, Power } from 'lucide-react';
import { WhatsAppConfig } from '../types';

const IntegrationSettings = () => {
  const [config, setConfig] = useState<WhatsAppConfig>({
    provider: 'cloud',
    // Cloud Defaults
    phoneNumberId: '123456789012345',
    businessAccountId: '987654321098765',
    accessToken: 'EAAB...',
    // Evolution Defaults
    baseUrl: 'https://api.myagency.com',
    apiKey: 'global_api_key_secure',
    instanceName: 'MyAgencySupport',
    // Common
    webhookUrl: 'https://api.iadscrm.com/v1/webhooks/whatsapp',
    verifyToken: 'iads_verification_token_secure_123',
    status: 'connected'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoadingQr, setIsLoadingQr] = useState(false);
  const [tempConfig, setTempConfig] = useState(config);

  // Switch Provider Handler
  const handleProviderChange = (provider: 'cloud' | 'evolution') => {
    setConfig({ ...config, provider, status: 'disconnected' });
    setTempConfig({ ...config, provider, status: 'disconnected' });
    setIsEditing(false);
  };

  const handleSave = () => {
    setConfig({ ...tempConfig, status: 'validating' });
    setIsEditing(false);
    
    setTimeout(() => {
        setConfig({ ...tempConfig, status: 'connected' });
    }, 1500);
  };

  const generateQrCode = () => {
    setIsLoadingQr(true);
    setConfig({ ...config, status: 'validating' }); // Using validating as "Loading" state here

    // Simulate API Call to Evolution API /instance/connect
    setTimeout(() => {
        setIsLoadingQr(false);
        setConfig({ ...config, status: 'qr_ready' });
        
        // Simulate User Scanning QR Code after 5 seconds
        setTimeout(() => {
             setConfig({ ...config, status: 'connected' });
        }, 5000);
    }, 1500);
  };

  const handleLogout = () => {
      if(confirm("Are you sure you want to disconnect? You will need to scan the QR code again.")) {
          setConfig({...config, status: 'disconnected'});
      }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-8 h-full overflow-y-auto max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">WhatsApp Integration</h1>
          <p className="text-slate-500">Configure your connection provider to send and receive messages.</p>
        </div>
        <div className={`px-4 py-2 rounded-lg flex items-center gap-2 font-medium ${
            config.status === 'connected' ? 'bg-emerald-100 text-emerald-700' : 
            config.status === 'qr_ready' ? 'bg-amber-100 text-amber-700' :
            config.status === 'validating' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
        }`}>
            {config.status === 'connected' && <CheckCircle className="w-4 h-4" />}
            {config.status === 'qr_ready' && <QrCode className="w-4 h-4" />}
            {config.status === 'validating' && <RefreshCw className="w-4 h-4 animate-spin" />}
            {config.status === 'disconnected' && <AlertCircle className="w-4 h-4" />}
            <span className="capitalize">{config.status === 'qr_ready' ? 'Scan QR Code' : config.status}</span>
        </div>
      </div>

      {/* Provider Selector */}
      <div className="grid grid-cols-2 gap-4 mb-8">
          <button 
            onClick={() => handleProviderChange('cloud')}
            className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                config.provider === 'cloud' 
                ? 'border-blue-600 bg-blue-50/50 ring-1 ring-blue-600' 
                : 'border-slate-200 bg-white hover:border-blue-300'
            }`}
          >
              <div className={`p-3 rounded-lg ${config.provider === 'cloud' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <Globe className="w-6 h-6" />
              </div>
              <div className="text-left">
                  <h3 className={`font-bold ${config.provider === 'cloud' ? 'text-blue-900' : 'text-slate-700'}`}>Official Cloud API</h3>
                  <p className="text-sm text-slate-500">Meta Hosted (Stable, Pay-per-convo)</p>
              </div>
          </button>

          <button 
            onClick={() => handleProviderChange('evolution')}
            className={`p-4 rounded-xl border-2 flex items-center gap-4 transition-all ${
                config.provider === 'evolution' 
                ? 'border-emerald-600 bg-emerald-50/50 ring-1 ring-emerald-600' 
                : 'border-slate-200 bg-white hover:border-emerald-300'
            }`}
          >
              <div className={`p-3 rounded-lg ${config.provider === 'evolution' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                  <QrCode className="w-6 h-6" />
              </div>
              <div className="text-left">
                  <h3 className={`font-bold ${config.provider === 'evolution' ? 'text-emerald-900' : 'text-slate-700'}`}>WhatsApp Web API</h3>
                  <p className="text-sm text-slate-500">QR Code Scan (Evolution/Baileys)</p>
              </div>
          </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Configuration Form */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* -- CLOUD API VIEW -- */}
            {config.provider === 'cloud' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-slate-400" />
                            Cloud API Credentials
                        </h2>
                        {!isEditing ? (
                            <button 
                                onClick={() => { setIsEditing(true); setTempConfig(config); }}
                                className="text-sm text-blue-600 font-medium hover:text-blue-700"
                            >
                                Edit Configuration
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => setIsEditing(false)} className="text-sm text-slate-500 font-medium hover:text-slate-700">Cancel</button>
                                <button onClick={handleSave} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-1">
                                    <Save className="w-3 h-3" /> Save
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="p-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <Smartphone className="w-4 h-4 text-slate-400" /> Phone Number ID
                            </label>
                            <input 
                                type="text" 
                                disabled={!isEditing}
                                value={isEditing ? tempConfig.phoneNumberId : config.phoneNumberId}
                                onChange={(e) => setTempConfig({...tempConfig, phoneNumberId: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-mono text-sm"
                                placeholder="e.g. 1092837465"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <Hash className="w-4 h-4 text-slate-400" /> Business Account ID
                            </label>
                            <input 
                                type="text" 
                                disabled={!isEditing}
                                value={isEditing ? tempConfig.businessAccountId : config.businessAccountId}
                                onChange={(e) => setTempConfig({...tempConfig, businessAccountId: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-mono text-sm"
                                placeholder="e.g. 192837465"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2">
                                <Lock className="w-4 h-4 text-slate-400" /> Permanent Access Token
                            </label>
                            <input 
                                type="password" 
                                disabled={!isEditing}
                                value={isEditing ? tempConfig.accessToken : config.accessToken}
                                onChange={(e) => setTempConfig({...tempConfig, accessToken: e.target.value})}
                                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-mono text-sm"
                                placeholder="EAAB..."
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* -- EVOLUTION API VIEW -- */}
            {config.provider === 'evolution' && (
                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
                    <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                        <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                            <Server className="w-4 h-4 text-slate-400" />
                            Evolution API Server
                        </h2>
                        {!isEditing ? (
                            <button 
                                onClick={() => { setIsEditing(true); setTempConfig(config); }}
                                className="text-sm text-blue-600 font-medium hover:text-blue-700"
                            >
                                Edit Settings
                            </button>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => setIsEditing(false)} className="text-sm text-slate-500 font-medium hover:text-slate-700">Cancel</button>
                                <button onClick={handleSave} className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-1">
                                    <Save className="w-3 h-3" /> Save
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Instance Name</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={isEditing ? tempConfig.instanceName : config.instanceName}
                                    onChange={(e) => setTempConfig({...tempConfig, instanceName: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-mono text-sm"
                                    placeholder="e.g. MyAgencySupport"
                                />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">Global API Key</label>
                                <input 
                                    type="password" 
                                    disabled={!isEditing}
                                    value={isEditing ? tempConfig.apiKey : config.apiKey}
                                    onChange={(e) => setTempConfig({...tempConfig, apiKey: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-mono text-sm"
                                    placeholder="Global API Key from Evolution"
                                />
                            </div>
                             <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-slate-700 mb-1">Server URL</label>
                                <input 
                                    type="text" 
                                    disabled={!isEditing}
                                    value={isEditing ? tempConfig.baseUrl : config.baseUrl}
                                    onChange={(e) => setTempConfig({...tempConfig, baseUrl: e.target.value})}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none disabled:bg-slate-50 disabled:text-slate-500 font-mono text-sm"
                                    placeholder="e.g. https://evolution.myagency.com"
                                />
                            </div>
                        </div>

                        {/* QR Code Action Area */}
                        <div className="border-t border-slate-100 pt-6">
                            <h3 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                                <QrCode className="w-4 h-4 text-emerald-600" /> Device Connection
                            </h3>
                            
                            {config.status === 'connected' ? (
                                <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-white rounded-full p-1 shadow-sm mb-3 relative">
                                        <img src="https://picsum.photos/id/1/200/200" alt="Instance" className="w-full h-full rounded-full" />
                                        <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
                                    </div>
                                    <h4 className="font-bold text-emerald-900 text-lg">Connected</h4>
                                    <p className="text-emerald-700 text-sm mb-4">Instance <strong>{config.instanceName}</strong> is active.</p>
                                    <button 
                                        onClick={handleLogout}
                                        className="text-sm bg-white border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg font-medium hover:bg-emerald-100 flex items-center gap-2 transition-colors"
                                    >
                                        <Power className="w-4 h-4" /> Disconnect Session
                                    </button>
                                </div>
                            ) : (
                                <div className="bg-slate-50 border border-slate-200 rounded-xl p-8 flex flex-col items-center text-center">
                                    {config.status === 'qr_ready' ? (
                                        <div className="animate-in zoom-in duration-300">
                                            <div className="bg-white p-2 rounded-lg shadow-sm mb-4 border border-slate-200">
                                                 <img 
                                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=EvolutionAPI_Instance_${config.instanceName}`} 
                                                    alt="QR Code" 
                                                    className="w-48 h-48 opacity-90" 
                                                 />
                                            </div>
                                            <p className="text-slate-600 font-medium mb-1">Scan with WhatsApp</p>
                                            <p className="text-xs text-slate-400">Settings {'>'} Linked Devices {'>'} Link a Device</p>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 shadow-sm text-slate-300">
                                                {isLoadingQr ? <RefreshCw className="w-8 h-8 animate-spin text-emerald-500" /> : <Wifi className="w-8 h-8" />}
                                            </div>
                                            <p className="text-slate-600 mb-4 max-w-xs">
                                                {isLoadingQr ? "Generating authentication QR code..." : "Ensure your phone has internet access before connecting."}
                                            </p>
                                            <button 
                                                onClick={generateQrCode}
                                                disabled={isLoadingQr}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors disabled:opacity-50"
                                            >
                                                {isLoadingQr ? 'Connecting...' : 'Generate QR Code'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Webhook Configuration Section (Always Visible) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                        <Globe className="w-4 h-4 text-slate-400" />
                        Webhook Configuration
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                        {config.provider === 'cloud' 
                            ? 'Configure this in Meta Developers Dashboard.' 
                            : 'Configure this in Evolution API Manager Global Settings.'}
                    </p>
                </div>
                <div className="p-6 space-y-4">
                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Callback URL</label>
                        <div className="flex gap-2">
                            <code className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded text-sm font-mono text-slate-700 overflow-x-auto">
                                {config.webhookUrl}
                            </code>
                            <button 
                                onClick={() => copyToClipboard(config.webhookUrl)}
                                className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                    {config.provider === 'cloud' && (
                        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">Verify Token</label>
                             <div className="flex gap-2">
                                <code className="flex-1 bg-white border border-slate-200 px-3 py-2 rounded text-sm font-mono text-slate-700">
                                    {config.verifyToken}
                                </code>
                                <button 
                                    onClick={() => copyToClipboard(config.verifyToken)}
                                    className="p-2 text-slate-400 hover:text-blue-600 bg-white border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                                >
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* Instructions / Help Sidebar */}
        <div className="space-y-6">
            {config.provider === 'cloud' ? (
                 <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Cloud API Guide
                    </h3>
                    <ol className="space-y-4 text-sm text-blue-900">
                        <li className="flex gap-2">
                            <span className="font-bold bg-white text-blue-600 w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-sm flex-shrink-0">1</span>
                            <span>Create App in Meta Developers.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold bg-white text-blue-600 w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-sm flex-shrink-0">2</span>
                            <span>Add WhatsApp Product.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold bg-white text-blue-600 w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-sm flex-shrink-0">3</span>
                            <span>Get Permanent Access Token.</span>
                        </li>
                    </ol>
                </div>
            ) : (
                <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                    <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" /> Evolution API Guide
                    </h3>
                    <ol className="space-y-4 text-sm text-emerald-900">
                        <li className="flex gap-2">
                            <span className="font-bold bg-white text-emerald-600 w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-sm flex-shrink-0">1</span>
                            <span>Deploy Evolution API Server (Docker).</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold bg-white text-emerald-600 w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-sm flex-shrink-0">2</span>
                            <span>Generate Global API Key.</span>
                        </li>
                        <li className="flex gap-2">
                            <span className="font-bold bg-white text-emerald-600 w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-sm flex-shrink-0">3</span>
                            <span>Create Instance & Scan QR.</span>
                        </li>
                         <li className="flex gap-2">
                            <span className="font-bold bg-white text-emerald-600 w-5 h-5 flex items-center justify-center rounded-full text-xs shadow-sm flex-shrink-0">4</span>
                            <span>Set Webhook URL in Global Settings.</span>
                        </li>
                    </ol>
                </div>
            )}
            
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="font-bold text-slate-800 mb-2">Need Help?</h3>
                <p className="text-sm text-slate-500 mb-4">
                    Check out the documentation for detailed setup instructions for both providers.
                </p>
                <button className="w-full py-2 bg-slate-100 text-slate-600 text-sm font-medium rounded-lg hover:bg-slate-200 transition-colors">
                    Read Documentation
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default IntegrationSettings;