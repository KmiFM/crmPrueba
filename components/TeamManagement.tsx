
import React, { useState } from 'react';
import { User } from '../types';
import { 
  UserPlus, 
  Mail, 
  Lock, 
  Shield, 
  UserCircle, 
  Trash2, 
  Edit2, 
  X, 
  Eye, 
  EyeOff,
  CheckCircle2,
  Users
} from 'lucide-react';

interface Props {
  currentUser: User;
  users: User[];
  onUpdateUsers: (users: User[]) => void;
}

const TeamManagement: React.FC<Props> = ({ currentUser, users, onUpdateUsers }) => {
  // Filter only users belonging to the current agency
  const agencyUsers = users.filter(u => u.tenantId === currentUser.tenantId);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'agent' as 'agent' | 'admin'
  });

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleOpenModal = (user: User | null = null) => {
    setErrors({});
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: user.password || '',
        role: user.role as 'agent' | 'admin'
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'agent'
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'Obligatorio';
    if (!validateEmail(formData.email)) newErrors.email = 'Email inválido';
    if (!editingUser && formData.password.length < 6) newErrors.password = 'Mínimo 6 caracteres';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (editingUser) {
      onUpdateUsers(users.map(u => u.id === editingUser.id ? { ...u, ...formData } : u));
    } else {
      const newUser: User = {
        id: 'u-' + Date.now(),
        ...formData,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${formData.name}`,
        tenantId: currentUser.tenantId
      };
      onUpdateUsers([...users, newUser]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (id === currentUser.id) {
        alert("No puedes eliminarte a ti mismo.");
        return;
    }
    if (confirm('¿Estás seguro de que deseas eliminar este miembro del equipo?')) {
      onUpdateUsers(users.filter(u => u.id !== id));
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto bg-slate-50/30">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">Gestión de Equipo</h1>
          <p className="text-slate-500 font-medium text-sm mt-1">Miembros de tu agencia.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl flex items-center gap-2 font-bold shadow-xl shadow-blue-100 transition-all active:scale-95"
        >
          <UserPlus className="w-5 h-5" />
          Añadir Miembro
        </button>
      </div>

      <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100">
            <tr>
              <th className="px-8 py-5">Usuario</th>
              <th className="px-8 py-5">Email</th>
              <th className="px-8 py-5">Rol</th>
              <th className="px-8 py-5 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {agencyUsers.map((user) => (
              <tr key={user.id} className="hover:bg-blue-50/30 transition-colors group">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-4">
                    <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl bg-slate-100" />
                    <span className="font-bold text-slate-800 text-sm">{user.name}</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-sm font-medium text-slate-600">{user.email}</td>
                <td className="px-8 py-5">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                    user.role === 'admin' ? 'bg-indigo-100 text-indigo-700' : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-8 py-5 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button onClick={() => handleOpenModal(user)} className="p-2 text-slate-400 hover:text-blue-600">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(user.id)} className="p-2 text-slate-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {agencyUsers.length === 0 && (
          <div className="p-20 text-center">
            <Users className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-500 font-bold">No hay miembros registrados.</p>
          </div>
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-50 backdrop-blur-md p-4">
          <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md animate-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-2xl font-black text-slate-800">{editingUser ? 'Editar' : 'Nuevo'} Miembro</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full">
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>

            <div className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Nombre *</label>
                <input 
                  type="text" 
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl font-bold text-sm outline-none ${errors.name ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="Juan Pérez"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Email *</label>
                <input 
                  type="email" 
                  className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl font-bold text-sm outline-none ${errors.email ? 'border-red-500' : 'border-slate-200'}`}
                  placeholder="juan@agencia.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-2">Contraseña {!editingUser && '*'}</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className={`w-full px-4 py-3 bg-slate-50 border rounded-2xl font-bold text-sm outline-none ${errors.password ? 'border-red-500' : 'border-slate-200'}`}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase mb-3">Rol</label>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => setFormData({...formData, role: 'agent'})} className={`p-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest ${formData.role === 'agent' ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-slate-100 text-slate-400'}`}>Agente</button>
                  <button onClick={() => setFormData({...formData, role: 'admin'})} className={`p-3 rounded-2xl border-2 font-black text-[10px] uppercase tracking-widest ${formData.role === 'admin' ? 'border-indigo-600 bg-indigo-50 text-indigo-800' : 'border-slate-100 text-slate-400'}`}>Admin</button>
                </div>
              </div>
            </div>

            <div className="p-10 pt-0 flex justify-end gap-3">
              <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 font-bold text-slate-400 text-sm">Cancelar</button>
              <button onClick={handleSave} className="bg-blue-600 text-white px-10 py-3 rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManagement;
