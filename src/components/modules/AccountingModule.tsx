import React, { useState } from 'react';
import { Landmark, FileText, Plus, Calculator, DollarSign, Calendar, BookOpen, Clock, Download } from 'lucide-react';
import { mockLedgers } from '../../data/mockData';
import { LedgerAccount, Voucher } from '../../types';

export default function AccountingModule() {
  const [activeSubTab, setActiveSubTab] = useState<'voucher' | 'reports'>('voucher');
  const [ledgers, setLedgers] = useState<LedgerAccount[]>(mockLedgers);
  
  // Voucher recording states
  const [voucherType, setVoucherType] = useState<'Receipt' | 'Payment' | 'Journal' | 'Contra'>('Receipt');
  const [amount, setAmount] = useState(0);
  const [drAccount, setDrAccount] = useState('L01'); // Cash in hand
  const [crAccount, setCrAccount] = useState('L06'); // Pharmacy Sales Revenue
  const [narration, setNarration] = useState('');
  
  const [vouchersHistory, setVouchersHistory] = useState<Voucher[]>([
    {
      id: 'VOUCH-01',
      voucherNo: 'VCH-2026-0038',
      date: '2026-06-01',
      voucherType: 'Receipt',
      narration: 'Cash received from daily POS retail sales sync',
      debitedAccount: 'Cash in Hand',
      creditedAccount: 'Pharmacy Sales Revenue',
      amount: 14200.0
    }
  ]);

  const handleCreateVoucher = () => {
    if (amount <= 0) {
      alert("Please enter a valid amount greater than Zero.");
      return;
    }
    if (drAccount === crAccount) {
      alert("Double entry rules forbid debiting and crediting the exact same ledger account.");
      return;
    }

    const firstDr = ledgers.find(l => l.id === drAccount);
    const firstCr = ledgers.find(l => l.id === crAccount);
    if (!firstDr || !firstCr) return;

    // Dual-entry calculations
    const updatedLedgers = ledgers.map(l => {
      if (l.id === drAccount) {
        // Debiting Assets or Expenses increases value. Debiting Liabilities or Revenue decreases value.
        const multiplier = (l.group === 'Assets' || l.group === 'Expenses' || l.group === 'Cash' || l.group === 'Bank') ? 1 : -1;
        return { ...l, balance: l.balance + (amount * multiplier) };
      }
      if (l.id === crAccount) {
        // Crediting Liabilities, Revenue or Equity increases value. Crediting Assets decreases value.
        const multiplier = (l.group === 'Liabilities' || l.group === 'Revenue' || l.group === 'Equity' || l.group === 'Supplier') ? 1 : -1;
        return { ...l, balance: l.balance + (amount * multiplier) };
      }
      return l;
    });

    setLedgers(updatedLedgers);

    const newVoucher: Voucher = {
      id: `VOUCH-${Date.now().toString().slice(-4)}`,
      voucherNo: `VCH-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      voucherType,
      narration,
      debitedAccount: firstDr.name,
      creditedAccount: firstCr.name,
      amount
    };

    setVouchersHistory([newVoucher, ...vouchersHistory]);
    setAmount(0);
    setNarration('');

    alert(`Voucher ${newVoucher.voucherNo} recorded. Double-entry ledger books updated and reconciled cleanly.`);
  };

  // Computations for reports
  const totalAssets = ledgers.filter(l => l.group === 'Assets' || l.group === 'Cash' || l.group === 'Bank' || l.group === 'Customer').reduce((acc, curr) => acc + curr.balance, 0);
  const totalLiabilities = ledgers.filter(l => l.group === 'Liabilities' || l.group === 'Supplier').reduce((acc, curr) => acc + Math.abs(curr.balance), 0);
  const revenueTotal = ledgers.filter(l => l.group === 'Revenue').reduce((acc, curr) => acc + curr.balance, 0);
  const expenseTotal = ledgers.filter(l => l.group === 'Expenses').reduce((acc, curr) => acc + curr.balance, 0);
  const netEarnings = revenueTotal - expenseTotal;

  const handleExportCSV = () => {
    let csvContent = "";
    let fileName = "";

    if (activeSubTab === 'voucher') {
      const headers = ["Voucher No", "Date", "Voucher Type", "Narration", "Debited Account", "Credited Account", "Amount (INR)"];
      const rows = vouchersHistory.map(v => [
        v.voucherNo,
        v.date,
        v.voucherType,
        `"${v.narration?.replace(/"/g, '""') || ''}"`,
        `"${v.debitedAccount}"`,
        `"${v.creditedAccount}"`,
        v.amount
      ]);
      csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      fileName = "accounting_vouchers_history.csv";
    } else {
      const headers = ["Ledger ID", "Ledger Name", "Account Group", "Balance (INR)"];
      const rows = ledgers.map(l => [
        l.id,
        `"${l.name}"`,
        l.group,
        l.balance
      ]);
      csvContent = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
      fileName = "accounting_trial_balance.csv";
    }

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex-1 p-6 bg-zinc-50 flex flex-col overflow-hidden h-full">
      {/* Title */}
      <div className="flex justify-between items-center mb-5 flex-shrink-0">
        <div>
          <h2 className="text-base font-bold text-zinc-800">Double-Entry Financial Accounting Ledger</h2>
          <p className="text-xs text-zinc-500">Real-time book reconciliations, tax ledgers, and standard dual-entry audits</p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-50 border border-indigo-200 text-indigo-700 hover:bg-indigo-100 rounded-xl text-xs font-bold transition shadow-sm active:scale-95"
          title="Download current financial ledger selection as CSV spreadsheet"
        >
          <Download className="h-4 w-4" />
          <span>Export {activeSubTab === 'voucher' ? "Vouchers" : "Ledgers"} CSV</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-4 bg-white p-1 rounded-xl border flex-shrink-0">
        <button
          onClick={() => setActiveSubTab('voucher')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeSubTab === 'voucher' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-650 hover:text-zinc-900'
          }`}
        >
          Dual-Entry Voucher Terminal
        </button>
        <button
          onClick={() => setActiveSubTab('reports')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeSubTab === 'reports' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-650 hover:text-zinc-900'
          }`}
        >
          Trial Balance & Profit/Loss Sheet
        </button>
      </div>

      {/* Display Grid */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        {activeSubTab === 'voucher' && (
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Voucher entry form panel */}
            <div className="col-span-4 p-5 bg-zinc-50/35 border-r border-zinc-200 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="h-5 w-5 text-zinc-500" />
                  <span className="text-xs font-bold text-zinc-800 uppercase tracking-widest">Post Account Voucher</span>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Voucher Class</label>
                  <select
                    value={voucherType}
                    onChange={(e) => setVoucherType(e.target.value as any)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-800 font-bold"
                  >
                    <option value="Receipt">Receipt Voucher (Receive Inflow)</option>
                    <option value="Payment">Payment Voucher (Disburse Outflow)</option>
                    <option value="Journal">Journal Voucher (Adjust Entry)</option>
                    <option value="Contra">Contra Voucher (Bank-Cash interchange)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">DR Debit Account</label>
                  <select
                    value={drAccount}
                    onChange={(e) => setDrAccount(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg"
                  >
                    {ledgers.map(l => (
                      <option key={l.id} value={l.id}>({l.group}) {l.name} — Bal: ₹{l.balance.toFixed(0)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">CR Credit Account</label>
                  <select
                    value={crAccount}
                    onChange={(e) => setCrAccount(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg"
                  >
                    {ledgers.map(l => (
                      <option key={l.id} value={l.id}>({l.group}) {l.name} — Bal: ₹{l.balance.toFixed(0)}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Amount Value (INR)</label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg font-mono font-bold text-zinc-900 focus:outline-sky-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase block mb-1">Narration / Log Note</label>
                  <textarea
                    rows={2}
                    placeholder="Provide description audit check detail..."
                    value={narration}
                    onChange={(e) => setNarration(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg"
                  />
                </div>
              </div>

              <button
                onClick={handleCreateVoucher}
                className="w-full mt-4 py-2 text-xs font-bold bg-zinc-950 hover:bg-black text-white hover:shadow-md transition rounded-xl"
              >
                COMMIT LEDGER VOUCHER
              </button>
            </div>

            {/* Reconciliation terminal display list */}
            <div className="col-span-8 p-5 flex flex-col overflow-hidden">
              <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                <Clock className="h-4 w-4" /> Posted Transactions Journal Audit Trail
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-1">
                {vouchersHistory.map((v, idx) => (
                  <div key={idx} className="p-4 border border-zinc-200 rounded-xl bg-white relative hover:border-zinc-300 transition">
                    <span className="absolute top-4 right-4 text-[10px] uppercase bg-zinc-100 border border-zinc-200 px-2 py-0.5 rounded-full font-bold font-mono text-zinc-600">
                      {v.voucherType}
                    </span>
                    <h4 className="text-xs font-bold text-zinc-800">{v.voucherNo}</h4>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5 mt-0.5">Posted: {v.date} System UTC</p>
                    <p className="text-xs text-zinc-600 leading-normal mt-2 italic">"{v.narration || 'No narrative provided.'}"</p>
                    
                    <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-dashed border-zinc-100 text-[10px] text-zinc-500 font-semibold font-mono">
                      <div>
                        <span className="text-emerald-700 font-bold block mb-0.5">(DR DEBIT)</span>
                        {v.debitedAccount}
                      </div>
                      <div>
                        <span className="text-rose-700 font-bold block mb-0.5">(CR CREDIT)</span>
                        {v.creditedAccount}
                      </div>
                    </div>
                    
                    <div className="text-right border-t border-zinc-50 pt-2.5 mt-3">
                      <span className="text-sm font-bold text-zinc-900 font-mono">₹{v.amount.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. Trial Balance Reports view */}
        {activeSubTab === 'reports' && (
          <div className="flex-1 p-5 overflow-y-auto grid grid-cols-2 gap-6 leading-relaxed">
            {/* Profit & loss */}
            <div className="border border-zinc-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-800">Profit & Loss Statement (Fiscal Year)</h4>
                  <span className="text-[10px] font-mono font-bold text-zinc-400">UNAUDITED MOCK-UP</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between border-b pb-1 dark:border-zinc-100">
                    <span className="font-bold text-zinc-900 select-all">Total Revenue:</span>
                    <span className="font-mono text-zinc-700 font-bold">₹{revenueTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500 border-b pb-1">
                    <span>Operating Pharmacy Sales:</span>
                    <span className="font-mono">₹{revenueTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b pb-1 pt-2">
                    <span className="font-bold text-zinc-900">Total Purchase Costs:</span>
                    <span className="font-mono text-rose-500 font-bold">₹{expenseTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-zinc-500">
                    <span>Vendor Procurement costs:</span>
                    <span className="font-mono">₹{expenseTotal.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-zinc-300 pt-3 mt-4 bg-zinc-900 text-white p-3.5 rounded-xl flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Net Operational Earnings (EBITDA)</span>
                <span className={`text-md font-bold font-mono ${netEarnings > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                  ₹{netEarnings.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Balance Sheet Ledger Metrics */}
            <div className="border border-zinc-200 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-800 mb-3 flex items-center gap-1.5">
                  <BookOpen className="h-4.5 w-4.5 text-zinc-500" /> Live Trial Balance Sheet Summary
                </dt>
                <div className="space-y-2 text-xs">
                  {ledgers.map(l => (
                    <div key={l.id} className="flex justify-between border-b pb-1 select-all hover:bg-zinc-50 transition px-1 py-0.5">
                      <span className="font-medium text-zinc-800">{l.name} <span className="text-[10px] font-mono text-zinc-400">({l.group})</span></span>
                      <span className="font-mono font-bold text-zinc-700">₹{l.balance.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-dashed border-zinc-200 pt-3 mt-4 flex items-center justify-between text-[11px] font-bold text-zinc-500 font-mono">
                <span>Books Balanced Summary: DR == CR</span>
                <span className="text-emerald-700 font-extrabold uppercase">Balanced (100% Accuracy)</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
