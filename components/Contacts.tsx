import React, { useState } from 'react';
import { MOCK_CONTACTS } from '../constants';
import { Contact } from '../types';
import { Search, Plus, Filter, MoreHorizontal, MessageSquare, Trash2, Edit2, X, Phone, Mail, Building, Tag, User, Users } from 'lucide-react';

const Contacts = () => {
  // Convert object to array for the list
  const [contacts, setContacts] = useState<Contact[]>(Object.values(MOCK_CONTACTS));
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  
  // Form State
  const initialFormState = {
    name: '',
    phoneNumber: '',
    email: '',
    company: '',
    tags: '',
    notes: '',
    isGroup: false
  };
  const [formData, setFormData] = useState(initialFormState);

  // Extract unique tags for filter
  const allTags = Array.from(new Set(contacts.flatMap(c => c.tags)));

  // Filter Logic
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          contact.phoneNumber.includes(searchTerm) ||
                          (contact.email && contact.email.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesTag = selectedTag ? contact.tags.includes(selectedTag) : true;
    return matchesSearch && matchesTag;
  });

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phoneNumber: contact.phoneNumber,
      email: contact.email || '',
      company: contact.company || '',
      tags: contact.tags.join(', '),
      notes: contact.notes,
      isGroup: contact.isGroup
    });
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this contact?')) {
      setContacts(contacts.filter(c => c.id !== id));
    }
  };

  const handleSave = () => {
    if (!formData.name || !formData.phoneNumber) return;

    const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(t => t !== '');

    if (editingContact) {
      // Update existing
      setContacts(contacts.map(c => c.id === editingContact.id ? {
        ...c,
        ...formData,
        tags: tagsArray,
        avatar: c.avatar // Keep existing avatar
      } : c));
    } else {
      // Create new
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData,
        tags: tagsArray,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
      };
      setContacts([...contacts, newContact]);
    }

    handleCloseModal();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingContact(null);
    setFormData(initialFormState);
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Contacts</h1>
          <p className="text-slate-500">Manage your customers, leads, and groups.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Contact
        </button>
      </div>

      {/* Filters & Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by name, phone, or email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Filter className="w-4 h-4 text-slate-400" />
          <button 
            onClick={() => setSelectedTag(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${!selectedTag ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
          >
            All
          </button>
          {allTags.map(tag => (
            <button 
              key={tag}
              onClick={() => setSelectedTag(tag === selectedTag ? null : tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${tag === selectedTag ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Name / Group</th>
              <th className="px-6 py-4">Contact Info</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4">Tags</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredContacts.map((contact) => (
              <tr key={contact.id} className="hover:bg-slate-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                        <img src={contact.avatar} alt={contact.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                        {contact.isGroup && (
                            <div className="absolute -bottom-1 -right-1 bg-purple-100 text-purple-600 rounded-full p-0.5 border border-white" title="Group Chat">
                                <Users className="w-3 h-3" />
                            </div>
                        )}
                    </div>
                    <div>
                      <div className="font-medium text-slate-900">{contact.name}</div>
                      <div className="text-xs text-slate-400">{contact.isGroup ? 'Group Chat' : 'Individual'}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Phone className="w-3 h-3 text-slate-400" />
                      {contact.phoneNumber}
                    </div>
                    {contact.email && (
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {contact.email}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                   {contact.company ? (
                       <div className="flex items-center gap-2 text-sm text-slate-700">
                           <Building className="w-3 h-3 text-slate-400" />
                           {contact.company}
                       </div>
                   ) : (
                       <span className="text-xs text-slate-400 italic">--</span>
                   )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {contact.tags.map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Message">
                        <MessageSquare className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleEdit(contact)} className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(contact.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredContacts.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                        <div className="flex flex-col items-center">
                            <User className="w-12 h-12 text-slate-300 mb-2" />
                            <p>No contacts found matching your search.</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">
                {editingContact ? 'Edit Contact' : 'New Contact'}
              </h3>
              <button onClick={handleCloseModal} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="e.g. Jane Doe"
                    />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                        type="text" 
                        value={formData.phoneNumber}
                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="+1 234 567 890"
                        />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                        <input 
                        type="email" 
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="jane@example.com"
                        />
                    </div>
                  </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company / Organization</label>
                <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={formData.company}
                      onChange={(e) => setFormData({...formData, company: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Acme Corp"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tags (comma separated)</label>
                <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <input 
                      type="text" 
                      value={formData.tags}
                      onChange={(e) => setFormData({...formData, tags: e.target.value})}
                      className="w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="vip, lead, support"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Notes</label>
                <textarea 
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  className="w-full p-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24 resize-none"
                  placeholder="Internal notes about this contact..."
                />
              </div>
              
              <div className="flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    id="isGroup"
                    checked={formData.isGroup}
                    onChange={(e) => setFormData({...formData, isGroup: e.target.checked})}
                    className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isGroup" className="text-sm text-slate-700">This is a WhatsApp Group</label>
              </div>

            </div>

            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
              <button 
                onClick={handleCloseModal}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                disabled={!formData.name || !formData.phoneNumber}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {editingContact ? 'Save Changes' : 'Create Contact'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;