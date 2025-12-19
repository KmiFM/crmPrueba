
import React, { useState } from 'react';
import { User } from '../types';
import { 
  User as UserIcon, 
  Mail, 
  Phone, 
  Lock, 
  Camera, 
  Save, 
  CheckCircle,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react';

interface Props {
  user: User;
  onUpdateUser: (updatedUser: User) => void;
}

const Profile: React.FC<Props> = ({ user, onUpdateUser }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    avatar: user.avatar,
    password: user.password || '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      onUpdateUser({
        ...user,
        ...formData
      });
      setIsSaving(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/30">
      <div className="max-w-2xl mx-auto">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Mi Perfil</h1>
          <p className="text-slate-500 font-medium">Gestiona tu información personal y seguridad.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {/* Avatar Section */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col items-center">
             <div className="relative group">
                <img 
                  src={formData.avatar} 
                  alt="Profile" 
                  className="w-32 h-32 rounded-3xl object-cover border-4 border-white shadow-xl mb-4 group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                   <Camera className="w-8 h-8 text-white drop-shadow-md" />
                </div>
             </div>
             <div className="w-full max-w-sm">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 text-center">URL de Avatar</label>
                <input 
                  type="text" 
                  value={formData.avatar}
                  onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none text-center"
                  placeholder="https://ejemplo.com/foto.jpg"
                />
             </div>
          </div>

          {/* Personal Info */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2 text-blue-600">
               <UserIcon className="w-5 h-5" />
               <h3 className="font-black text-sm uppercase tracking-widest">Información Personal</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nombre Completo</label>
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                  <input 
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div className="md:col-span-2">
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Método de Contacto (WhatsApp/Tel)</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                  <input 
                    type="text" 
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="+54 9 11 1234-5678"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2 mb-2 text-indigo-600">
               <ShieldCheck className="w-5 h-5" />
               <h3 className="font-black text-sm uppercase tracking-widest">Seguridad</h3>
            </div>

            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Cambiar Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 w-4 h-4" />
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Mínimo 6 caracteres"
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
             <button 
                type="submit"
                disabled={isSaving}
                className={`flex items-center gap-2 px-10 py-4 rounded-2xl font-black text-sm shadow-xl transition-all active:scale-95 ${
                  showSuccess ? 'bg-emerald-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-100'
                }`}
             >
                {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                  showSuccess ? <><CheckCircle className="w-5 h-5" /> Guardado!</> : <><Save className="w-5 h-5" /> Guardar Cambios</>
                )}
             </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
