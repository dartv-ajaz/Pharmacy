import React, { useState } from 'react';
import { 
  Users, Sparkles, MessageSquare, Plus, CheckCircle, Search, 
  HelpCircle, Send, Award, Gift, Calendar 
} from 'lucide-react';

export default function MarketingLoyaltyModule() {
  const [activeSubTab, setActiveSubTab] = useState<'loyalty' | 'campaigns'>('loyalty');
  const [searchQuery, setSearchQuery] = useState('');

  const [loyaltyLedger, setLoyaltyLedger] = useState([
    { id: 'LOY-102', customerName: 'Aditya Vardhan', phone: '9845012356', points: 850, tier: 'Silver', lastPurchase: '2026-06-02' },
    { id: 'LOY-101', customerName: 'Gaurav Kumar', phone: '7611094321', points: 2100, tier: 'Platinum', lastPurchase: '2026-06-01' },
    { id: 'LOY-100', customerName: 'Swati Sen', phone: '8092144390', points: 1450, tier: 'Gold', lastPurchase: '2026-05-27' },
    { id: 'LOY-099', customerName: 'Karan Mehra', phone: '9901452290', points: 340, tier: 'Bronze', lastPurchase: '2026-05-15' }
  ]);

  const [campaigns, setCampaigns] = useState([
    { id: 'CMP-01', name: 'Monsoon Flu Vaccine Alert', channel: 'SMS', targets: 480, sentDate: '2026-05-30', status: 'Delivered' },
    { id: 'CMP-02', name: 'Alprax Chronic Medication Refill Reminder', channel: 'Whatsapp/SMS', targets: 135, sentDate: '2026-06-01', status: 'Processing' },
    { id: 'CMP-03', name: 'Elderly Cardiac Care Discount Campaign', channel: 'SMS', targets: 620, sentDate: '2026-05-18', status: 'Completed' }
  ]);

  // Campaign fields
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignChannel, setNewCampaignChannel] = useState('SMS');
  const [isSending, setIsSending] = useState(false);

  // Send campaign trigger
  const handleCreateCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName) return;

    setIsSending(true);
    // Simulate API delivery
    await new Promise(r => setTimeout(r, 1000));
    
    setCampaigns([
      {
        id: `CMP-0${campaigns.length + 1}`,
        name: newCampaignName,
        channel: newCampaignChannel,
        targets: Math.floor(100 + Math.random() * 500),
        sentDate: new Date().toISOString().split('T')[0],
        status: 'Delivered'
      },
      ...campaigns
    ]);

    setNewCampaignName('');
    setIsSending(false);
  };

  const filteredLoyalty = loyaltyLedger.filter(c => 
    c.customerName.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery)
  );

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* Dynamic Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Users className="h-4 w-4 text-emerald-500" />
            Module 11: Patient CRM, Loyalty Ledgers & Refill Triggers
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Maintain recurring chronic medicine loyalty registers, redeem store cashbacks, and dispatch automated refill reminders.</p>
        </div>

        <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('loyalty')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'loyalty' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Loyalty Points Ledger ({loyaltyLedger.length})
          </button>
          <button
            onClick={() => setActiveSubTab('campaigns')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'campaigns' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Refill SMS Dispatchers
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === 'loyalty' ? (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h3 className="text-xs font-bold text-zinc-80s uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="h-4 w-4 text-amber-500" /> Patient Reward Program database
                </h3>
                
                <div className="relative w-full sm:w-64 text-xs">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search custom CRM records..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8.5 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="overflow-x-auto rounded-xl border border-zinc-100">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                      <th className="px-5 py-3">Register Card ID</th>
                      <th className="px-5 py-3">Patient Customer</th>
                      <th className="px-5 py-3">Registered Mobile</th>
                      <th className="px-5 py-3 text-center">Reward Balance Points</th>
                      <th className="px-5 py-3">Customer Tier</th>
                      <th className="px-5 py-3 font-mono text-right">Last POS Sells</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-sans">
                    {filteredLoyalty.map((c) => (
                      <tr key={c.id} className="hover:bg-zinc-50/50">
                        <td className="px-5 py-3.5 font-mono font-bold text-zinc-400">{c.id}</td>
                        <td className="px-5 py-3.5 font-bold text-zinc-800">{c.customerName}</td>
                        <td className="px-5 py-3.5 font-mono text-zinc-500">{c.phone}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="bg-amber-50 text-amber-850 border border-amber-200 px-2.5 py-1 rounded-xl text-[11px] font-mono font-black">
                            ★ {c.points} pts
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            c.tier === 'Platinum' ? 'bg-indigo-50 text-indigo-700 border border-indigo-200' :
                            c.tier === 'Gold' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                            c.tier === 'Silver' ? 'bg-zinc-100 text-zinc-700' : 'bg-orange-50 text-orange-600'
                          }`}>
                            {c.tier}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-right font-mono text-zinc-400">{c.lastPurchase}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Campaigns screen */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-xs">
            {/* Create campaign */}
            <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm space-y-4 h-fit">
              <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-zinc-100">
                <MessageSquare className="h-4 w-4 text-emerald-500" /> Formulate Refill Broadcast alert
              </h3>

              <form onSubmit={handleCreateCampaign} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Alert Broadcast Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Diabetics Insulin Refill Reminder June..."
                    value={newCampaignName}
                    onChange={(e) => setNewCampaignName(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-zinc-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Delivery Channel Route</label>
                  <select
                    value={newCampaignChannel}
                    onChange={(e) => setNewCampaignChannel(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-zinc-800 focus:outline-none"
                  >
                    <option value="SMS">SMS Gateway (Pratibha Prime)</option>
                    <option value="Whatsapp">Whatsapp API Cloud Business</option>
                    <option value="Email">Standard SMTP Patient Circle</option>
                  </select>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl text-[10px] text-zinc-400 font-mono leading-relaxed">
                  NOTE: Broadcast alerts cross-reference customer card history, auto-matching chronic disease codes to trigger refills based on 30-day medication lifespans.
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition uppercase text-[10.5px] flex items-center justify-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  {isSending ? 'Transmitting Over API...' : 'Dispatch Refill Triggers'}
                </button>
              </form>
            </div>

            {/* Campaign lists */}
            <div className="lg:col-span-2 bg-white border border-zinc-200 p-5 rounded-xl shadow-sm space-y-4 text-xs">
              <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-widest flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-500" /> Historical Campaigns Log
              </h3>

              <div className="space-y-3">
                {campaigns.map((c) => (
                  <div key={c.id} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between">
                    <div>
                      <strong className="text-zinc-805 font-bold block">{c.name}</strong>
                      <span className="text-[10px] mt-0.5 block font-mono text-zinc-400">ID: {c.id} | ROUTED VIA: {c.channel} | DATE: {c.sentDate}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-mono font-bold text-zinc-800 block">{c.targets} Patients</span>
                      <span className={`inline-block px-1.5 py-0.2 mt-1 rounded text-[9px] font-bold uppercase tracking-wider ${
                        c.status === 'Delivered' || c.status === 'Completed' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-600 border border-sky-100'
                      }`}>
                        {c.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
