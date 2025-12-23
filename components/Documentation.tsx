import React, { useState } from 'react';
import {
  Book,
  ChevronRight,
  ExternalLink,
  Copy,
  Check,
  Globe,
  Lock,
  Server,
  Smartphone,
  MessageCircle,
  Code,
  Terminal,
  Zap,
  Info,
  X
} from 'lucide-react';

const Documentation = () => {
  const [activeTab, setActiveTab] = useState<'cloud' | 'evolution'>('cloud');
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const CodeBlock = ({ code, id, language = 'javascript' }: { code: string; id: string; language?: string }) => (
    <div className="bg-slate-900 rounded-xl overflow-hidden my-4 relative group">
      <div className="flex justify-between items-center px-4 py-2 bg-slate-800/50 border-b border-slate-700">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{language}</span>
        <button
          onClick={() => handleCopy(code, id)}
          className="text-slate-400 hover:text-white transition-colors p-1"
        >
          {copied === id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
      <pre className="p-4 text-xs font-mono text-blue-100 overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/30">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight flex items-center gap-3">
            <Book className="w-8 h-8 text-blue-600" />
            Centro de Documentación
          </h1>
          <p className="text-slate-500 mt-2 font-medium">Todo lo que necesitas saber para conectar tus canales de WhatsApp.</p>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-1 bg-slate-200/50 rounded-2xl mb-8 w-fit">
          <button
            onClick={() => setActiveTab('cloud')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'cloud' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Globe className="w-4 h-4" /> Cloud API (Oficial)
          </button>
          <button
            onClick={() => setActiveTab('evolution')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'evolution' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
          >
            <Zap className="w-4 h-4" /> Evolution API (Web)
          </button>
        </div>

        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">

          {activeTab === 'cloud' ? (
            <section className="space-y-8">
              <div className="bg-blue-600 rounded-[32px] p-8 text-white shadow-xl shadow-blue-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-2">WhatsApp Cloud API</h2>
                  <p className="opacity-90 max-w-2xl text-sm font-medium">La solución oficial de Meta para empresas que buscan escalabilidad y estabilidad total. Requiere verificación de negocio para uso extensivo.</p>
                  <div className="flex gap-4 mt-6">
                    <a href="https://developers.facebook.com" target="_blank" className="bg-white text-blue-600 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                      Meta Developers <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                  Paso 1: Configuración en Meta
                </h3>
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm space-y-4">
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-1">1</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Crea una Aplicación Empresarial</p>
                        <p className="text-xs text-slate-500 leading-relaxed">Entra a Meta for Developers, "Mis Apps" &gt; "Crear App" y selecciona el tipo "Empresa".</p>
                      </div>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-black text-[10px] flex-shrink-0 mt-1">2</div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm">Agrega el producto WhatsApp</p>
                        <p className="text-xs text-slate-500 leading-relaxed">Busca "WhatsApp" en el panel lateral y agrégalo. Se te pedirá configurar o seleccionar un Meta Business Account.</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-blue-600" />
                  Paso 2: Webhooks y Seguridad
                </h3>
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
                  <p className="text-xs text-slate-500 mb-4 font-medium italic">Debes configurar la URL de Callback en Meta para recibir los mensajes entrantes:</p>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Endpoint para Meta</p>
                    <div className="flex items-center gap-2">
                      <code className="text-blue-600 font-mono text-xs flex-1 truncate">https://api.iadscrm.com/v1/webhooks/whatsapp</code>
                      <button onClick={() => handleCopy("https://api.iadscrm.com/v1/webhooks/whatsapp", "endp1")} className="p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
                        <Copy className="w-3 h-3 text-slate-400" />
                      </button>
                    </div>
                  </div>
                  <div className="mt-6">
                    <p className="text-sm font-bold text-slate-800 mb-2">Verificación del Webhook</p>
                    <p className="text-xs text-slate-500 mb-4">Meta enviará un GET para validar tu servidor. Asegúrate de que el "Verify Token" coincida con el que configuraste en nuestra app.</p>
                    <CodeBlock
                      id="cb1"
                      language="nodejs"
                      code={`// Ejemplo de lógica de verificación
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});`}
                    />
                  </div>
                </div>
              </div>
            </section>
          ) : (
            <section className="space-y-8">
              <div className="bg-emerald-600 rounded-[32px] p-8 text-white shadow-xl shadow-emerald-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="relative z-10">
                  <h2 className="text-2xl font-black mb-2">Evolution API</h2>
                  <p className="opacity-90 max-w-2xl text-sm font-medium">Integración basada en WhatsApp Web. Ideal para agencias que quieren usar números existentes sin procesos de verificación de Meta.</p>
                  <div className="flex gap-4 mt-6">
                    <a href="https://evolution-api.com" target="_blank" className="bg-white text-emerald-600 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                      Documentación Oficial <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-emerald-600" />
                  Paso 1: Instalación de Instancia
                </h3>
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
                  <p className="text-sm text-slate-500 mb-4 leading-relaxed">Evolution API se despliega típicamente vía Docker. Asegúrate de configurar la <code className="bg-slate-100 px-1 rounded font-bold">AUTHENTICATION_API_KEY</code> en tu archivo <code className="bg-slate-100 px-1 rounded font-bold">.env</code>.</p>
                  <div className="p-4 bg-slate-900 rounded-xl">
                    <div className="flex items-center gap-2 text-emerald-400 mb-2">
                      <Terminal className="w-4 h-4" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Docker Compose Snippet</span>
                    </div>
                    <pre className="text-xs text-slate-300 font-mono overflow-x-auto">
                      {`services:
  evolution-api:
    image: atendare/evolution-api:latest
    environment:
      - AUTHENTICATION_API_KEY=tu_clave_global
      - WEBHOOK_GLOBAL_ENABLED=true
      - WEBHOOK_GLOBAL_URL=https://api.iadscrm.com/v1/webhooks/whatsapp`}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-black text-slate-800 flex items-center gap-2">
                  <ChevronRight className="w-5 h-5 text-emerald-600" />
                  Paso 2: Sincronización
                </h3>
                <div className="bg-white border border-slate-100 rounded-[24px] p-6 shadow-sm">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                      <Info className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800">Escaneo de QR</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Una vez configurada la URL del servidor y el API Key en nuestro panel de Integración, el botón "Generate QR" solicitará un código único a tu servidor Evolution. Escanéalo como si fuera WhatsApp Web.</p>
                    </div>
                  </div>
                  <div className="p-5 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-center gap-4">
                    <Smartphone className="w-10 h-10 text-emerald-600" />
                    <div>
                      <p className="text-xs font-black text-emerald-800 uppercase tracking-widest">Estado de Conexión</p>
                      <p className="text-[10px] text-emerald-600">Puedes monitorear el estado de la batería y red del teléfono desde nuestro Dashboard.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Common Section: Troubleshooting */}
          <section className="mt-16 pt-16 border-t border-slate-200">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-slate-900 text-white rounded-2xl">
                <Code className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-black text-slate-800">Solución de Problemas</h3>
                <p className="text-xs text-slate-500 font-medium">Errores comunes y cómo resolverlos rápidamente.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm">
                <p className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                  <X className="w-4 h-4 text-red-500" /> No recibo mensajes
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">Verifica que tu servidor tenga el puerto 443 abierto y un certificado SSL válido. Los webhooks de Meta requieren HTTPS obligatorio.</p>
              </div>
              <div className="p-6 bg-white border border-slate-100 rounded-[24px] shadow-sm">
                <p className="font-black text-slate-800 text-sm mb-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-amber-500" /> Error 401 Unauthorized
                </p>
                <p className="text-xs text-slate-500 leading-relaxed">Comprueba que el Access Token no haya expirado. Recomendamos usar "System User Tokens" en Meta con duración ilimitada.</p>
              </div>
            </div>
          </section>

          <div className="bg-slate-900 rounded-[32px] p-10 text-center space-y-4">
            <MessageCircle className="w-12 h-12 text-blue-500 mx-auto" />
            <h3 className="text-xl font-black text-white">¿Necesitas soporte técnico avanzado?</h3>
            <p className="text-slate-400 text-sm max-w-md mx-auto">Nuestro equipo de ingeniería puede ayudarte con el despliegue de Evolution API en tus servidores privados.</p>
            <button className="bg-blue-600 text-white px-8 py-3 rounded-2xl font-black text-sm hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
              Contactar a Soporte IADS
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Documentation;