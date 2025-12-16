import React, { useState } from 'react';
import { MOCK_CONTACTS } from '../constants';
import { Megaphone, Users, Send, Clock, CheckCircle, AlertTriangle, Plus, X, Filter, BarChart3, Calendar, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'scheduled' | 'sending' | 'completed';
  audience: string; // e.g., "All Contacts" or "Tag: vip"
  audienceSize: number;
  sentCount: number;
  readCount: number;
  createdAt: string;
  scheduledFor?: string;
  content: string;
}

const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp_1',
    name: 'November Newsletter',
    status: 'completed',
    audience: 'Tag: lead',
    audienceSize: 150,
    sentCount: 148,
    readCount: 112,
    createdAt: '2023-11-01',
    content: 'Check out our latest features for this month!'
  },
  {
    id: 'cmp_2',
    name: 'Black Friday Promo',
    status: 'scheduled',
    audience: 'All Contacts',
    audienceSize: 892,
    sentCount: 0,
    readCount: 0,
    createdAt: '2023-11-10',
    scheduledFor: '2023-11-24 09:00 AM',
    content: 'Exclusive 50% discount for our loyal customers.'
  }
];

const ANALYTICS_DATA = [
  { date: 'Mon', sent: 120, read: 98, clicked: 45 },
  { date: 'Tue', sent: 180, read: 150, clicked: 70 },
  { date: 'Wed', sent: 160, read: 140, clicked: 65 },
  { date: 'Thu', sent: 250, read: 210, clicked: 120 },
  { date: 'Fri', sent: 310, read: 280, clicked: 160 },
  { date: 'Sat', sent: 190, read: 170, clicked: 80 },
  { date: 'Sun', sent: 140, read: 120, clicked: 50 },
];

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>(MOCK_CAMPAIGNS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Form State
  const [newCampaign, setNewCampaign] = useState({
    name: '',
    targetTag: 'all', // 'all' or specific tag
    content: '',
    schedule: ''
  });

  // Extract available tags from contacts for the dropdown
  const availableTags = Array.from(new Set(Object.values(MOCK_CONTACTS).flatMap(c => c.tags)));

  // Calculate estimated audience size based on selection
  const estimatedAudience = newCampaign.targetTag === 'all' 
    ? Object.keys(MOCK_CONTACTS).length 
    : Object.values(MOCK_CONTACTS).filter(c => c.tags.includes(newCampaign.targetTag)).length;

  const handleCreateCampaign = () => {
    if (!newCampaign.name || !newCampaign.content) return;

    const campaign: Campaign = {
        id: Date.now().toString(),
        name: newCampaign.name,
        status: newCampaign.schedule ? 'scheduled' : 'sending',
        audience: newCampaign.targetTag === 'all' ? 'All Contacts' : `Tag: ${newCampaign.targetTag}`,
        audienceSize: estimatedAudience,
        sentCount: 0,
        readCount: 0,
        createdAt: new Date().toISOString().split('T')[0],
        scheduledFor: newCampaign.schedule,
        content: newCampaign.content
    };

    setCampaigns([campaign, ...campaigns]);
    setIsModalOpen(false);
    setNewCampaign({ name: '', targetTag: 'all', content: '', schedule: '' });
  };

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'completed': return 'bg-emerald-100 text-emerald-700';
          case 'sending': return 'bg-blue-100 text-blue-700';
          case 'scheduled': return 'bg-amber-100 text-amber-700';
          default: return 'bg-slate-100 text-slate-600';
      }
  };

  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Campaigns</h1>
          <p className="text-slate-500">Broadcast messages to your audience segments.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Send className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Total Messages Sent</p>
                <h3 className="text-2xl font-bold text-slate-800">14,203</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Avg. Read Rate</p>
                <h3 className="text-2xl font-bold text-slate-800">88.5%</h3>
            </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-6 h-6" />
            </div>
            <div>
                <p className="text-slate-500 text-sm font-medium">Scheduled Campaigns</p>
                <h3 className="text-2xl font-bold text-slate-800">{campaigns.filter(c => c.status === 'scheduled').length}</h3>
            </div>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
                Engagement Trends
            </h3>
            <ResponsiveContainer width="100%" height="85%">
                <AreaChart data={ANALYTICS_DATA}>
                    <defs>
                        <linearGradient id="colorSent" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                        <linearGradient id="colorRead" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend iconType="circle" />
                    <Area type="monotone" dataKey="sent" stroke="#3b82f6" fillOpacity={1} fill="url(#colorSent)" name="Sent" strokeWidth={2} />
                    <Area type="monotone" dataKey="read" stroke="#10b981" fillOpacity={1} fill="url(#colorRead)" name="Read" strokeWidth={2} />
                </AreaChart>
            </ResponsiveContainer>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[350px]">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-purple-600" />
                Delivery & Interaction
            </h3>
             <ResponsiveContainer width="100%" height="85%">
                <BarChart data={ANALYTICS_DATA}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
                    <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                    <Legend iconType="circle" />
                    <Bar dataKey="sent" fill="#94a3b8" radius={[4, 4, 0, 0]} name="Total Sent" barSize={30} />
                    <Bar dataKey="clicked" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Link Clicks" barSize={30} />
                </BarChart>
            </ResponsiveContainer>
        </div>
      </div>

      {/* Campaigns List */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800">Recent Campaigns</h3>
            <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">View All</button>
        </div>
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4">Campaign Name</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Audience</th>
              <th className="px-6 py-4">Performance</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {campaigns.map((campaign) => (
              <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div>
                    <div className="font-medium text-slate-900">{campaign.name}</div>
                    <div className="text-xs text-slate-500 truncate max-w-[200px]">{campaign.content}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${getStatusColor(campaign.status)}`}>
                    {campaign.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-slate-600">
                    <Users className="w-4 h-4 text-slate-400" />
                    <span>{campaign.audience}</span>
                    <span className="text-xs bg-slate-100 px-1.5 rounded text-slate-500">
                        {campaign.audienceSize}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                    {campaign.status === 'completed' || campaign.status === 'sending' ? (
                        <div className="w-full max-w-[140px]">
                            <div className="flex justify-between text-xs mb-1">
                                <span className="text-slate-500">Read Rate</span>
                                <span className="font-medium text-slate-700">
                                    {Math.round((campaign.readCount / campaign.sentCount) * 100) || 0}%
                                </span>
                            </div>
                            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                                <div 
                                    className="bg-emerald-500 h-1.5 rounded-full" 
                                    style={{ width: `${(campaign.readCount / campaign.sentCount) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    ) : (
                        <span className="text-xs text-slate-400 italic">No data yet</span>
                    )}
                </td>
                <td className="px-6 py-4 text-right text-sm text-slate-500">
                  {campaign.scheduledFor ? (
                      <div className="flex items-center justify-end gap-1 text-amber-600">
                          <Calendar className="w-3 h-3" />
                          {campaign.scheduledFor.split(' ')[0]}
                      </div>
                  ) : campaign.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                <div className="flex justify-between items-center p-6 border-b border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Megaphone className="w-5 h-5 text-blue-600" />
                        Create New Campaign
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                
                <div className="p-6 space-y-6 overflow-y-auto">
                    {/* Step 1: Details */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Campaign Name</label>
                        <input 
                            type="text" 
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            placeholder="e.g. Summer Sale Announcement"
                            value={newCampaign.name}
                            onChange={(e) => setNewCampaign({...newCampaign, name: e.target.value})}
                        />
                    </div>

                    {/* Step 2: Audience */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Target Audience</label>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                                <select 
                                    className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white appearance-none"
                                    value={newCampaign.targetTag}
                                    onChange={(e) => setNewCampaign({...newCampaign, targetTag: e.target.value})}
                                >
                                    <option value="all">All Contacts</option>
                                    <optgroup label="By Tag">
                                        {availableTags.map(tag => (
                                            <option key={tag} value={tag}>{tag}</option>
                                        ))}
                                    </optgroup>
                                </select>
                            </div>
                            <div className="bg-blue-50 text-blue-700 px-4 py-2 rounded-lg flex items-center justify-between text-sm font-medium border border-blue-100">
                                <span>Estimated Audience:</span>
                                <span className="text-lg font-bold">{estimatedAudience}</span>
                            </div>
                        </div>
                    </div>

                    {/* Step 3: Content */}
                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Message Content</label>
                        <div className="relative">
                            <textarea 
                                className="w-full p-4 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-32 resize-none font-sans text-sm"
                                placeholder="Hi {{name}}, we have a special offer for you..."
                                value={newCampaign.content}
                                onChange={(e) => setNewCampaign({...newCampaign, content: e.target.value})}
                            />
                            <div className="absolute bottom-3 right-3 flex gap-2">
                                <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors text-slate-600">
                                    {'{name}'}
                                </button>
                                <button className="text-xs bg-slate-100 hover:bg-slate-200 px-2 py-1 rounded transition-colors text-slate-600">
                                    {'{company}'}
                                </button>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            Note: For Cloud API, only pre-approved Templates can be sent to users outside the 24h window.
                        </p>
                    </div>

                    {/* Step 4: Schedule */}
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Schedule (Optional)</label>
                         <div className="relative">
                             <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                             <input 
                                type="datetime-local" 
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={newCampaign.schedule}
                                onChange={(e) => setNewCampaign({...newCampaign, schedule: e.target.value})}
                             />
                         </div>
                         <p className="text-xs text-slate-400 mt-1">Leave blank to send immediately.</p>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-xl flex justify-end gap-3">
                    <button 
                        onClick={() => setIsModalOpen(false)}
                        className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 font-medium hover:bg-white transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleCreateCampaign}
                        disabled={!newCampaign.name || !newCampaign.content}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-sm"
                    >
                        <Send className="w-4 h-4" />
                        {newCampaign.schedule ? 'Schedule Campaign' : 'Send Now'}
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default Campaigns;