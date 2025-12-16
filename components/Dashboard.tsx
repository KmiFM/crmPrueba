import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { MessageSquare, Users, Clock, ArrowUpRight } from 'lucide-react';

const data = [
  { name: 'Mon', incoming: 400, outgoing: 240 },
  { name: 'Tue', incoming: 300, outgoing: 139 },
  { name: 'Wed', incoming: 200, outgoing: 980 },
  { name: 'Thu', incoming: 278, outgoing: 390 },
  { name: 'Fri', incoming: 189, outgoing: 480 },
  { name: 'Sat', incoming: 239, outgoing: 380 },
  { name: 'Sun', incoming: 349, outgoing: 430 },
];

const StatCard = ({ title, value, sub, icon: Icon, color }: any) => (
  <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-slate-500 text-sm font-medium mb-1">{title}</p>
      <h3 className="text-2xl font-bold text-slate-800">{value}</h3>
      <div className="flex items-center mt-2 text-xs font-medium text-emerald-600">
        <ArrowUpRight className="w-3 h-3 mr-1" />
        {sub}
      </div>
    </div>
    <div className={`p-3 rounded-lg ${color}`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div className="p-8 h-full overflow-y-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
        <p className="text-slate-500">Welcome back, here's what's happening with your agency today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Total Conversations" value="1,234" sub="+12% from last week" icon={MessageSquare} color="bg-blue-500" />
        <StatCard title="Active Contacts" value="892" sub="+5% new leads" icon={Users} color="bg-purple-500" />
        <StatCard title="Avg Response Time" value="2m 30s" sub="-15s improvement" icon={Clock} color="bg-orange-500" />
        <StatCard title="Messages Sent" value="8.5k" sub="+22% engagement" icon={ArrowUpRight} color="bg-emerald-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Message Volume</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: '#f8fafc' }} />
              <Bar dataKey="incoming" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="outgoing" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
         <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm h-[400px]">
          <h3 className="text-lg font-semibold text-slate-800 mb-6">Response Times (Minutes)</h3>
          <ResponsiveContainer width="100%" height="85%">
            <LineChart data={data}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip />
              <Line type="monotone" dataKey="incoming" stroke="#8b5cf6" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
