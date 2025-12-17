import React, { useState } from 'react';
import { CreditCard, CheckCircle, FileText, Download, Zap, Check, AlertCircle } from 'lucide-react';

const PLANS = [
  {
    id: 'basic',
    name: 'BASIC',
    monthlyPrice: 100,
    setupFee: 150,
    agents: 2,
    features: ['2 Agents Included', 'Basic CRM Features', 'Standard Support', 'Cloud API Access'],
    color: 'slate',
    popular: false
  },
  {
    id: 'pro',
    name: 'PRO',
    monthlyPrice: 200,
    setupFee: 300,
    agents: 5,
    features: ['Up to 5 Agents', 'Advanced Automation', 'Priority Email Support', 'Campaign Management'],
    color: 'blue',
    popular: true
  },
  {
    id: 'golden',
    name: 'GOLDEN',
    monthlyPrice: 300,
    setupFee: 400,
    agents: 10,
    features: ['Up to 10 Agents', 'AI Agent Customization', '24/7 Dedicated Support', 'Whitelabel Options'],
    color: 'amber',
    popular: false
  }
];

const Billing = () => {
  const [currentPlanId, setCurrentPlanId] = useState('pro'); // Mocking 'PRO' as current plan

  return (
    <div className="p-8 h-full overflow-y-auto max-w-6xl mx-auto">
       {/* Header */}
       <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Plans & Billing</h1>
          <p className="text-slate-500">Choose the plan that fits your agency size. Upgrade anytime.</p>
       </div>

       {/* Pricing Plans Grid */}
       <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
           {PLANS.map((plan) => {
               const isCurrent = currentPlanId === plan.id;
               const isGolden = plan.id === 'golden';
               const isPro = plan.id === 'pro';

               let borderColor = 'border-slate-200';
               let bgColor = 'bg-white';
               let headerColor = 'bg-slate-50';
               
               if (isPro) {
                   borderColor = 'border-blue-500 ring-1 ring-blue-500';
                   headerColor = 'bg-blue-50';
               } else if (isGolden) {
                   borderColor = 'border-amber-300';
                   bgColor = 'bg-gradient-to-b from-white to-amber-50/30';
                   headerColor = 'bg-gradient-to-r from-amber-100 to-amber-50';
               }

               return (
                   <div key={plan.id} className={`rounded-xl border ${borderColor} ${bgColor} shadow-sm flex flex-col relative overflow-hidden transition-all hover:shadow-md`}>
                       {plan.popular && (
                           <div className="absolute top-0 right-0 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                               Most Popular
                           </div>
                       )}
                       {isGolden && (
                           <div className="absolute top-0 right-0 bg-amber-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                               Best Value
                           </div>
                       )}

                       <div className={`p-6 border-b border-slate-100 ${headerColor}`}>
                           <h3 className={`text-lg font-bold uppercase tracking-wide mb-2 ${isGolden ? 'text-amber-700' : isPro ? 'text-blue-700' : 'text-slate-700'}`}>
                               {plan.name} Plan
                           </h3>
                           <div className="flex items-baseline gap-1">
                               <span className="text-3xl font-bold text-slate-900">${plan.monthlyPrice}</span>
                               <span className="text-sm text-slate-500 font-medium">USD /mo</span>
                           </div>
                           <p className="text-xs text-slate-500 mt-2 flex items-center gap-1">
                               <AlertCircle className="w-3 h-3" />
                               Opening Price: <span className="font-semibold">${plan.setupFee} USD</span>
                           </p>
                       </div>

                       <div className="p-6 flex-1">
                           <div className="flex items-center gap-2 mb-6">
                               <div className={`p-2 rounded-lg ${isGolden ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                                   <Zap className="w-5 h-5" />
                               </div>
                               <div>
                                   <p className="font-bold text-slate-800">{plan.agents} Agents</p>
                                   <p className="text-xs text-slate-500">Included Seats</p>
                               </div>
                           </div>

                           <ul className="space-y-3 mb-6">
                               {plan.features.map((feature, idx) => (
                                   <li key={idx} className="flex items-start gap-2 text-sm text-slate-600">
                                       <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${isGolden ? 'text-amber-500' : 'text-emerald-500'}`} />
                                       <span>{feature}</span>
                                   </li>
                               ))}
                           </ul>
                       </div>

                       <div className="p-6 pt-0 mt-auto">
                           <button 
                               disabled={isCurrent}
                               className={`w-full py-2.5 rounded-lg font-medium transition-colors ${
                                   isCurrent 
                                   ? 'bg-slate-100 text-slate-400 cursor-default'
                                   : isGolden
                                        ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm'
                                        : isPro 
                                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                                            : 'border border-slate-300 text-slate-700 hover:bg-slate-50'
                               }`}
                           >
                               {isCurrent ? 'Current Plan' : 'Switch Plan'}
                           </button>
                       </div>
                   </div>
               );
           })}
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Payment Method */}
            <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm">
                <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-slate-400" /> Payment Method
                    </h2>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">Update Card</button>
                </div>
                <div className="p-6 flex items-center gap-4">
                    <div className="w-14 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-sm relative overflow-hidden">
                        <div className="absolute top-2 left-2 w-full h-full bg-white/10 rounded-full"></div>
                        VISA
                    </div>
                    <div>
                        <p className="font-medium text-slate-800">Visa ending in 4242</p>
                        <p className="text-sm text-slate-500">Expires 12/2025 • Default</p>
                    </div>
                </div>
            </div>

            {/* Usage Stats (Simplified) */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                <h3 className="font-semibold text-slate-800 mb-4">Current Usage</h3>
                <div className="space-y-4">
                    <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Agents Active</span>
                            <span>3 / 5</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                    </div>
                    <div>
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                            <span>Messages</span>
                            <span>Unlimited</span>
                        </div>
                         <div className="w-full bg-slate-100 rounded-full h-2">
                            <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
       </div>

       {/* Invoices */}
       <div className="mt-8 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
           <div className="p-6 border-b border-slate-100 bg-slate-50/50">
               <h2 className="font-semibold text-slate-800 flex items-center gap-2">
                   <FileText className="w-5 h-5 text-slate-400" /> Billing History
               </h2>
           </div>
           <table className="w-full text-left">
               <thead className="bg-slate-50 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                   <tr>
                       <th className="px-6 py-4">Invoice</th>
                       <th className="px-6 py-4">Date</th>
                       <th className="px-6 py-4">Amount</th>
                       <th className="px-6 py-4">Status</th>
                       <th className="px-6 py-4 text-right">Download</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                   {[
                       { id: 'INV-2023-011', date: 'Nov 1, 2023', amount: '$200.00', status: 'Paid' },
                       { id: 'INV-2023-010', date: 'Oct 1, 2023', amount: '$200.00', status: 'Paid' },
                       { id: 'INV-2023-009', date: 'Sep 1, 2023', amount: '$300.00', status: 'Paid' }, // Setup fee included previously
                   ].map((inv) => (
                       <tr key={inv.id} className="hover:bg-slate-50 transition-colors">
                           <td className="px-6 py-4 font-medium text-slate-800 text-sm">{inv.id}</td>
                           <td className="px-6 py-4 text-slate-500 text-sm">{inv.date}</td>
                           <td className="px-6 py-4 text-slate-800 font-medium text-sm">{inv.amount}</td>
                           <td className="px-6 py-4">
                               <span className="bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-1 w-fit">
                                   <CheckCircle className="w-3 h-3" /> {inv.status}
                               </span>
                           </td>
                           <td className="px-6 py-4 text-right">
                               <button className="text-slate-400 hover:text-blue-600 transition-colors">
                                   <Download className="w-4 h-4" />
                               </button>
                           </td>
                       </tr>
                   ))}
               </tbody>
           </table>
       </div>
    </div>
  );
}

export default Billing;