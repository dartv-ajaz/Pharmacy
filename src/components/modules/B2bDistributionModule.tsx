import React, { useState } from 'react';
import { 
  Network, Users, MapPin, Truck, ChevronRight, Search, 
  HelpCircle, ArrowUpRight, TrendingUp, Sparkles, Building 
} from 'lucide-react';

export default function B2bDistributionModule() {
  const [activeSubTab, setActiveSubTab] = useState<'beats' | 'reps'>('beats');
  const [searchQuery, setSearchQuery] = useState('');

  const [beats, setBeats] = useState([
    { id: 'BT-01', name: 'West Delhi Outer Ring Beat', stockistsCount: 18, assignedRep: 'Vikas Sharma', status: 'Active', shipments: 4 },
    { id: 'BT-02', name: 'Noida Hub Sector 62 Beat', stockistsCount: 22, assignedRep: 'Arun Yadav', status: 'Active', shipments: 6 },
    { id: 'BT-03', name: 'South Delhi Corporate Clinic Beat', stockistsCount: 14, assignedRep: 'Preeti Deshmukh', status: 'Idle', shipments: 1 },
    { id: 'BT-04', name: 'Ghaziabad Pharmacists Beat', stockistsCount: 31, assignedRep: 'Sanjay Rawat', status: 'Active', shipments: 8 }
  ]);

  const [reps, setReps] = useState([
    { id: 'REP01', name: 'Vikas Sharma', zone: 'West Zone', todaySales: 78500, status: 'On Route' },
    { id: 'REP02', name: 'Arun Yadav', zone: 'East Zone', todaySales: 94200, status: 'On Route' },
    { id: 'REP03', name: 'Preeti Deshmukh', zone: 'South Zone', todaySales: 35000, status: 'Completed' },
    { id: 'REP04', name: 'Sanjay Rawat', zone: 'Central District', todaySales: 168000, status: 'On Route' }
  ]);

  const [newBeatName, setNewBeatName] = useState('');
  const [newBeatRep, setNewBeatRep] = useState('Vikas Sharma');

  const handleCreateBeat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBeatName) return;

    setBeats([
      ...beats,
      {
        id: `BT-0${beats.length + 1}`,
        name: newBeatName,
        stockistsCount: Math.floor(10 + Math.random() * 20),
        assignedRep: newBeatRep,
        status: 'Active',
        shipments: 0
      }
    ]);
    setNewBeatName('');
  };

  const filteredBeats = beats.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* SCM Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Network className="h-4 w-4 text-emerald-500" />
            Module 10: B2B Distribution & Stockist Beat Planner
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Define geographical sales beats, organize territory coverage, and trace pharmacy sales representative daily progress.</p>
        </div>

        <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('beats')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'beats' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Logistics Beats Mapping ({beats.length})
          </button>
          <button
            onClick={() => setActiveSubTab('reps')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'reps' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Sales Representative Status ({reps.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === 'beats' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Create beat */}
            <div className="bg-white border border-zinc-200 p-5 rounded-xl text-xs shadow-sm space-y-4 height-fit">
              <h3 className="text-xs font-bold text-zinc-855 uppercase tracking-widest flex items-center gap-2 pb-2 border-b border-zinc-100">
                <MapPin className="h-4 w-4 text-emerald-500" /> Add Logistical Route / Beat
              </h3>

              <form onSubmit={handleCreateBeat} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Geographical Beat Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rohini Residential Medical Beat..."
                    value={newBeatName}
                    onChange={(e) => setNewBeatName(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-zinc-800 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Assigned Field Representative</label>
                  <select
                    value={newBeatRep}
                    onChange={(e) => setNewBeatRep(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-zinc-800 focus:outline-none"
                  >
                    {reps.map(r => (
                      <option key={r.id} value={r.name}>{r.name} ({r.zone})</option>
                    ))}
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition uppercase text-[10.5px]"
                >
                  Register Region beat
                </button>
              </form>
            </div>

            {/* list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                      <th className="px-5 py-3">Region ID</th>
                      <th className="px-5 py-3">Beat Route Name</th>
                      <th className="px-5 py-3 text-center">Retailers Count</th>
                      <th className="px-5 py-3">Target Field Rep</th>
                      <th className="px-5 py-3 text-center">Today Active Trucks</th>
                      <th className="px-5 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-sans">
                    {filteredBeats.map((b) => (
                      <tr key={b.id} className="hover:bg-zinc-50/50">
                        <td className="px-5 py-3.5 font-mono font-bold text-zinc-400">{b.id}</td>
                        <td className="px-5 py-3.5 font-bold text-zinc-800">{b.name}</td>
                        <td className="px-5 py-3 text-center font-mono font-semibold text-zinc-650">{b.stockistsCount} retailers</td>
                        <td className="px-5 py-3.5 text-zinc-700 font-medium">{b.assignedRep}</td>
                        <td className="px-5 py-3 text-center font-mono text-emerald-600 font-bold">{b.shipments} vehicles</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className="inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                            {b.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* Rep performance matrix */
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-80s uppercase tracking-widest">
              Field Agent SCM Deliveries & Sales Metrics
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-1">
              {reps.map((r) => (
                <div key={r.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-zinc-800 font-bold block truncate">{r.name}</strong>
                      <span className="text-[10px] text-zinc-400 font-medium font-mono">{r.id} | {r.zone}</span>
                    </div>
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded text-[9px] font-bold font-mono">
                      {r.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-150/50 flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Today Gross Order SCM:</span>
                    <strong className="font-mono text-zinc-900">₹{r.todaySales.toLocaleString('en-IN')}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
