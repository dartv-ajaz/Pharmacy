import React, { useState } from 'react';
import { 
  Briefcase, FileText, PlusCircle, CheckCircle, Search, 
  HelpCircle, CreditCard, ShieldCheck, DollarSign, Database 
} from 'lucide-react';

export default function SalesOrdersModule() {
  const [activeSubTab, setActiveSubTab] = useState<'quotations' | 'credit' | 'buyers'>('quotations');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [quotations, setQuotations] = useState([
    { id: 'QT-2026-042', client: 'Fortis Clinic Diagnostics', date: '2026-06-01', total: 42500, status: 'Approved', items: '20x Vaccine Bulk Packs' },
    { id: 'QT-2026-041', client: 'City Heart Hospital POS', date: '2026-05-28', total: 118000, status: 'Pending Review', items: '150x Premium Cardiac Infusions' },
    { id: 'QT-2026-040', client: 'Red Cross Relief SCM', date: '2026-05-20', total: 75200, status: 'Draft', items: '500x Calpol Bulk Trays' }
  ]);

  const [buyers, setBuyers] = useState([
    { id: 'BYR01', name: 'Fortis Clinic Diagnostics', creditLimit: 250000, balance: 42500, term: 'Net 30' },
    { id: 'BYR02', name: 'City Heart Hospital POS', creditLimit: 1000000, balance: 345000, term: 'Net 45' },
    { id: 'BYR03', name: 'Apollo Healthways Dist', creditLimit: 1500000, balance: 1100000, term: 'Net 60' },
    { id: 'BYR04', name: 'Metro Drug Stockist', creditLimit: 500000, balance: 0, term: 'Net 15' }
  ]);

  const [newClient, setNewClient] = useState('');
  const [newTotal, setNewTotal] = useState('15000');
  const [newDraftItems, setNewDraftItems] = useState('');

  const handleCreateQuotation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient) return;
    
    setQuotations([
      {
        id: `QT-2026-0${43 + quotations.length}`,
        client: newClient,
        date: new Date().toISOString().split('T')[0],
        total: Number(newTotal),
        status: 'Draft',
        items: newDraftItems || 'General pharmaceutical supplies list'
      },
      ...quotations
    ]);
    
    setNewClient('');
    setNewTotal('15000');
    setNewDraftItems('');
  };

  const filteredBuyers = buyers.filter(b => b.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* SCM Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Briefcase className="h-4 w-4 text-emerald-500" />
            Module 09: Sales Orders & Corporate B2B Quotations
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Manage stockist quotes, institutional contract supply requests, and buyer credit ceiling configurations.</p>
        </div>

        <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('quotations')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'quotations' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Quotation Archival ({quotations.length})
          </button>
          <button
            onClick={() => setActiveSubTab('credit')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'credit' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Institutional Credit Limits
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === 'quotations' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Draft quote */}
            <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm space-y-4 height-fit">
              <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider flex items-center gap-2 pb-2 border-b border-zinc-100">
                <PlusCircle className="h-4 w-4 text-emerald-500" /> Issue B2B Sales Quote
              </h3>
              
              <form onSubmit={handleCreateQuotation} className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Target Client Hospital / Distributor</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Apollo Pharmacy Hub..."
                    value={newClient}
                    onChange={(e) => setNewClient(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-zinc-800 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Est. Wholesale Valuation (₹)</label>
                    <input
                      type="number"
                      required
                      value={newTotal}
                      onChange={(e) => setNewTotal(e.target.value)}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-zinc-800 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Document Class</label>
                    <select className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-zinc-800 focus:outline-none">
                      <option>Commercial Quote</option>
                      <option>Tender Bid Proposal</option>
                      <option>Proforma Ledger</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Detailed SKU Lines Description</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Itemized vaccine lists, batch counts..."
                    value={newDraftItems}
                    onChange={(e) => setNewDraftItems(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-zinc-800 font-mono text-[10.5px] focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition duration-200 uppercase tracking-wide text-[10.5px]"
                >
                  Save Quote Draft
                </button>
              </form>
            </div>

            {/* Existing Quotations archival list */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                      <th className="px-5 py-3">Quote ID</th>
                      <th className="px-5 py-3">B2B client</th>
                      <th className="px-5 py-3">Date Drafted</th>
                      <th className="px-5 py-3">Items list description</th>
                      <th className="px-5 py-3">Gross Deal Size</th>
                      <th className="px-5 py-3 text-center">Contract Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {quotations.map((q) => (
                      <tr key={q.id} className="hover:bg-zinc-50/50">
                        <td className="px-5 py-3.5 font-mono font-bold text-zinc-900">{q.id}</td>
                        <td className="px-5 py-3.5 font-semibold text-zinc-850">{q.client}</td>
                        <td className="px-5 py-3.5 text-zinc-400 font-mono">{q.date}</td>
                        <td className="px-5 py-3.5 text-zinc-500 italic max-w-[200px] truncate">{q.items}</td>
                        <td className="px-5 py-3.5 font-mono font-bold text-zinc-900">₹{q.total.toLocaleString('en-IN')}.00</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                            q.status === 'Approved' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                            q.status === 'Draft' ? 'bg-zinc-100 text-zinc-500 border-zinc-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {q.status}
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
          /* Buyer Outstanding status matrix */
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-1.5">
                    <CreditCard className="h-4 w-4 text-emerald-500" /> Buyer Account Risk & Credit Matrices
                  </h3>
                  <p className="text-[11px] text-zinc-400 mt-0.5">Control wholesale shipping triggers based on outstanding accounts balances vs authorized limits.</p>
                </div>
                
                <div className="relative w-full sm:w-64 text-xs">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <input
                    type="text"
                    placeholder="Search accounts catalog..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8.5 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                {filteredBuyers.map((b) => (
                  <div key={b.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl relative overflow-hidden text-xs flex flex-col justify-between h-36">
                    <div>
                      <span className="text-[9px] uppercase font-bold text-zinc-400 block tracking-widest">ID: {b.id}</span>
                      <strong className="text-zinc-800 font-bold block mt-1 truncate">{b.name}</strong>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-zinc-500">
                        <span>Oustandings:</span>
                        <span className={`font-mono font-bold ${b.balance > b.creditLimit * 0.7 ? 'text-rose-600' : 'text-zinc-700'}`}>
                          ₹{b.balance.toLocaleString('en-IN')}
                        </span>
                      </div>
                      <div className="flex justify-between text-[11px] text-zinc-500">
                        <span>Authorized Cap:</span>
                        <span className="font-mono text-zinc-600">₹{b.creditLimit.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-[11px] text-zinc-500 pt-1.5 border-t border-zinc-150">
                        <span>Settlement Term:</span>
                        <span className="font-sans font-bold text-sky-600">{b.term}</span>
                      </div>
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
