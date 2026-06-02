import React, { useState } from 'react';
import { 
  BookOpen, PlusCircle, UserCheck, CheckCircle2, TrendingUp, AlertCircle, Trash, Search, ArrowUpRight, ArrowDownRight, Wallet
} from 'lucide-react';

export default function KhatabookModule() {
  const [ledgerEntries, setLedgerEntries] = useState([
    { id: 'K001', name: 'Rajinder Kumar', phone: '9811029348', amount: 1450.00, type: 'Credit Due', date: '2026-05-28', remarks: 'Asthma inhaler + backup strips' },
    { id: 'K002', name: 'Mrs. Sharda Devi', phone: '9920199482', amount: 350.00, type: 'Credit Due', date: '2026-06-01', remarks: 'Calpol 650mg + cough syrup' },
    { id: 'K003', name: 'Dr. Amit Agrawal', phone: '9899381721', amount: 4800.00, type: 'Credit Due', date: '2026-05-15', remarks: 'Sample OTC vitamins bulk stock' },
    { id: 'K004', name: 'Anish Sharma', phone: '9788112233', amount: 120.00, type: 'Settle Paid', date: '2026-06-02', remarks: 'Bandages and antiseptic cream' }
  ]);

  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAmount, setNewAmount] = useState('');
  const [newRemarks, setNewRemarks] = useState('');
  const [newType, setNewType] = useState<'Credit Due' | 'Settle Paid'>('Credit Due');

  const handleAddUdhaar = () => {
    if (!newName || !newAmount) {
      alert("Please enter both Patient Name and Amount value.");
      return;
    }
    const valObj = {
      id: `K00${ledgerEntries.length + 1}`,
      name: newName,
      phone: newPhone || '9900112233',
      amount: parseFloat(newAmount) || 0,
      type: newType,
      date: new Date().toISOString().split('T')[0],
      remarks: newRemarks || 'Generic medical supplies'
    };
    setLedgerEntries([valObj, ...ledgerEntries]);
    setNewName('');
    setNewPhone('');
    setNewAmount('');
    setNewRemarks('');
    alert("Khatabook Udhaar transaction saved successfully.");
  };

  const handleSettleEntry = (id: string) => {
    const updated = ledgerEntries.map(entry => {
      if (entry.id === id) {
        return { ...entry, type: 'Settle Paid' as const };
      }
      return entry;
    });
    setLedgerEntries(updated);
    alert("Patient balance marked as SETTLED / PAID.");
  };

  // Math indicators
  const totalOutstanding = ledgerEntries
    .filter(e => e.type === 'Credit Due')
    .reduce((sum, e) => sum + e.amount, 0);

  const totalSettled = ledgerEntries
    .filter(e => e.type === 'Settle Paid')
    .reduce((sum, e) => sum + e.amount, 0);

  const activeHolders = ledgerEntries.filter(e => e.type === 'Credit Due').length;

  const filteredEntries = ledgerEntries.filter(e => 
    e.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    e.phone.includes(searchQuery)
  );

  return (
    <div className="flex-grow p-6 bg-zinc-50 flex flex-col overflow-hidden h-full">
      {/* Title Header */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-zinc-200 pb-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <BookOpen className="h-4.5 w-4.5 text-sky-500" />
            Module 14: Khatabook Udhaar & Regular Customer Ledger
          </h2>
          <p className="text-xs text-zinc-500 font-sans">
            Manage local neighborhood credit loops, track medical tabs, log settled vouchers, and review cumulative dues.
          </p>
        </div>
      </div>

      {/* KPI Overviews */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0 mb-6">
        <div className="bg-white border border-rose-200/60 p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-rose-455 transition-all">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Total Outstanding Credit</span>
            <span className="text-lg font-black text-rose-700 font-mono block">₹{totalOutstanding.toLocaleString('en-IN')}.00</span>
            <span className="text-[9px] text-zinc-400 block mt-1">Due from {activeHolders} regular customers</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
            <ArrowUpRight className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-emerald-200/60 p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-emerald-455 transition-all">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block">Settles & Collections</span>
            <span className="text-lg font-black text-emerald-700 font-mono block">₹{totalSettled.toLocaleString('en-IN')}.00</span>
            <span className="text-[9px] text-zinc-400 block mt-1">Reconciled in physical cash / UPI</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ArrowDownRight className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200 p-4 rounded-xl shadow-sm flex items-center justify-between hover:border-zinc-355 transition-all">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Health Rating</span>
            <span className="text-lg font-black text-zinc-800 font-mono block">92.4% Recovery</span>
            <span className="text-[9px] text-emerald-600 block mt-1">Outstanding resolved within average 12 days</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-zinc-50 text-zinc-600 flex items-center justify-center">
            <Wallet className="h-5 w-5" />
          </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* udhaar entry creation form */}
        <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm overflow-y-auto space-y-4">
          <h3 className="text-xs font-black text-zinc-800 uppercase tracking-wider block">New Udhaar Log</h3>
          <p className="text-[11px] text-zinc-400">
            Securely record credit/bills issued without upfront card or cash payment terms.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Patient Trade Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Ramesh Chandra Verma"
                className="w-full text-xs border border-zinc-200 bg-zinc-50 p-2 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Phone Number</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                placeholder="e.g. 981100223"
                className="w-full text-xs border border-zinc-200 bg-zinc-50 p-2 rounded-lg focus:bg-white focus:outline-none font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Debit Amount</label>
                <input
                  type="number"
                  value={newAmount}
                  onChange={(e) => setNewAmount(e.target.value)}
                  placeholder="₹ Amount"
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 p-2 rounded-lg focus:bg-white focus:outline-none font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Payment Status</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as any)}
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 p-2 rounded-lg focus:bg-white focus:outline-none cursor-pointer"
                >
                  <option value="Credit Due">Udhaar / Credit</option>
                  <option value="Settle Paid">UPI / Cash Paid</option>
                </select>
              </div>
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Description / Remarks</label>
              <textarea
                value={newRemarks}
                onChange={(e) => setNewRemarks(e.target.value)}
                placeholder="e.g. Lipitor batch, returns due tomorrow..."
                rows={3}
                className="w-full text-xs border border-zinc-200 bg-zinc-50 p-2 rounded-lg focus:bg-white focus:outline-none"
              />
            </div>
            <button
              onClick={handleAddUdhaar}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 font-bold text-white text-xs rounded-xl transition shadow flex items-center justify-center gap-2 mt-4"
            >
              <PlusCircle className="h-4 w-4" /> Save Udhaar entry
            </button>
          </div>
        </div>

        {/* ledger registry view */}
        <div className="md:col-span-2 flex flex-col bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
          {/* Header Search */}
          <div className="p-4 bg-zinc-50 border-b border-zinc-150 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 flex-shrink-0">
            <span className="text-xs font-bold text-zinc-805">Active Customer Udhaar Registry Book</span>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search patient name/phone..."
                className="w-full text-[11px] pl-8 pr-3 py-1.5 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 focus:focus:ring-sky-500 font-sans"
              />
            </div>
          </div>

          <div className="flex-grow overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-100 text-zinc-500 font-bold border-b border-zinc-150 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Customer (Phone)</th>
                  <th className="p-3">Remarks</th>
                  <th className="p-3 text-right">Debit Balance</th>
                  <th className="p-3 text-center">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-150 text-zinc-705">
                {filteredEntries.map((e, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 transition-all">
                    <td className="p-3">
                      <p className="font-bold text-zinc-900">{e.name}</p>
                      <span className="text-[10px] text-zinc-400 font-mono block mt-0.5">{e.phone}</span>
                    </td>
                    <td className="p-3">
                      <p className="max-w-[200px] truncate m-0">{e.remarks}</p>
                      <span className="text-[9px] text-zinc-400 font-mono block mt-0.5">Date: {e.date}</span>
                    </td>
                    <td className="p-3 text-right font-bold text-zinc-800 font-mono">
                      ₹{e.amount.toFixed(2)}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                        e.type === 'Credit Due' 
                          ? 'bg-rose-50 border border-rose-100 text-rose-600' 
                          : 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                      }`}>
                        {e.type}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      {e.type === 'Credit Due' ? (
                        <button
                          onClick={() => handleSettleEntry(e.id)}
                          className="px-2.5 py-1 text-[10px] font-extrabold text-white bg-sky-500 hover:bg-sky-600 hover:scale-103 active:scale-95 transition-all rounded-lg shadow-sm"
                        >
                          Settle Dues
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold flex items-center justify-end gap-1 font-sans">
                          <CheckCircle2 className="h-4 w-4" /> Cleared
                        </span>
                      )}
                    </td>
                  </tr>
                ))}

                {filteredEntries.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-6 text-center text-zinc-400">
                      No matching udhaar records registered.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
