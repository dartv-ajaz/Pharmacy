import React, { useState, useEffect } from 'react';
import { 
  BarChart3, RefreshCw, ShoppingBag, ShieldAlert, BookOpen, 
  ChevronRight, Sparkles, Database, Users, TrendingUp, Clock, 
  CheckCircle2, CloudLightning, Activity, Terminal, Play, 
  FileCheck, ShieldCheck, Heart, ArrowRightLeft, DatabaseBackup, Info, Percent, ClipboardList
} from 'lucide-react';
import { mockProducts, mockInvoices, mockBatches } from '../../data/mockData';
import PharmacyIntelligenceDashboard from './PharmacyIntelligenceDashboard';

export default function DashboardModule({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [dashboardView, setDashboardView] = useState<'modern' | 'marg-classic'>('marg-classic');
  const [syncTime, setSyncTime] = useState('Just Now');
  const [activeSyncing, setActiveSyncing] = useState(false);
  const [statusMessage, setStatusMessage] = useState('All offline registers reconciled with Noida central instance.');
  
  // Marg simulation interactive states
  const [margActionResult, setMargActionResult] = useState<string>('Select any Marg Option above or press a quick tile to execute command.');
  const [simulatedQuery, setSimulatedQuery] = useState('');
  
  const [genericSaltAlternatives, setGenericSaltAlternatives] = useState<any[]>([]);

  // Local sync timer trigger simulation
  const triggerPharmaSync = () => {
    setActiveSyncing(true);
    setStatusMessage('Initiating multi-terminal sync protocols... Exchanging ledger delta values.');
    setTimeout(() => {
      setStatusMessage('SHA-256 state exchange successful. GST validation handshakes verified.');
      setTimeout(() => {
        setSyncTime(new Date().toLocaleTimeString());
        setActiveSyncing(false);
        setStatusMessage('Sync Complete. Noida SCM Central and local cache databases are 100% in alignment.');
      }, 1000);
    }, 850);
  };

  // Math indicators based on actual data:
  const totalSalesVal = mockInvoices.reduce((sum, inv) => sum + inv.totals.grandTotal, 0);
  const totalSkuLines = mockProducts.length;
  
  // Near expiry batches count check
  const nearExpiryCount = mockBatches.filter(b => {
    const expDate = new Date(b.expiryDate);
    const currentDate = new Date('2026-06-02');
    const diffTime = expDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 && diffDays < 90;
  }).length;

  // Paracetamol salt replacement finder helper simulation
  const handleSaltSubstituteSearch = (term: string) => {
    setSimulatedQuery(term);
    if (!term) {
      setGenericSaltAlternatives([]);
      return;
    }
    const results = [
      { name: 'Calpol 650mg', mfg: 'GlaxoSmithKline SCM', price: 32.50, margin: '18% Margin', efficacy: 'High' },
      { name: 'Dolo 650mg', mfg: 'Micro Labs Ltd', price: 30.20, margin: '22% Margin', efficacy: 'High' },
      { name: 'Crocin Advanced', mfg: 'Haleon Healthcare', price: 42.00, margin: '15% Margin', efficacy: 'Medium' },
      { name: 'Pacimol 650', mfg: 'Ipca Laboratories', price: 27.50, margin: '25% Margin', efficacy: 'High' }
    ].filter(i => i.name.toLowerCase().includes(term.toLowerCase()) || term.toLowerCase() === 'paracetamol' || term.toLowerCase() === 'salt');
    setGenericSaltAlternatives(results);
  };

  return (
    <div className="flex-grow p-6 bg-zinc-50 flex flex-col overflow-y-auto h-full space-y-6">
      
      {/* Top Controls: Duality View Switcher */}
      <div className="flex-shrink-0 flex flex-col sm:flex-row items-center justify-between border-b border-zinc-200 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block font-mono">
            COMMAND DASHBOARD SELECTOR
          </span>
          <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2">
            <Activity className="h-4.5 w-4.5 text-sky-500 animate-pulse" />
            Apothecary Dual-Core Management Engine
          </h2>
        </div>

        {/* Dynamic View Toggle */}
        <div className="flex bg-zinc-250/70 p-1 rounded-xl border border-zinc-200/80">
          <button
            onClick={() => setDashboardView('marg-classic')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 ${
              dashboardView === 'marg-classic' 
                ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' 
                : 'text-zinc-650 hover:text-zinc-900'
            }`}
          >
            <Terminal className="h-3.5 w-3.5 text-sky-400" />
            Marg Legacy Quick-Deck (Classic ERP)
          </button>
          <button
            onClick={() => setDashboardView('modern')}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 ${
              dashboardView === 'modern' 
                ? 'bg-slate-900 text-white shadow-xl scale-[1.02]' 
                : 'text-zinc-650 hover:text-zinc-900'
            }`}
          >
            <CloudLightning className="h-3.5 w-3.5 text-amber-500" />
            Modern Cloud Dashboard
          </button>
        </div>
      </div>

      {/* RENDER DYNAMIC DASHBOARD MODE */}
      {dashboardView === 'marg-classic' ? (
        
        // CLASSIC MARG ERP INSPIRED PHARMACY SYSTEM
        <div className="space-y-6">
          
          {/* Quick Notice Banner explaining Marg Design */}
          <div className="p-4 bg-sky-500/10 border border-sky-400/30 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex gap-3">
              <Info className="h-5 w-5 text-sky-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-extrabold text-sky-950 uppercase tracking-wider font-mono">
                  Marg ERP Traditional Companion Model
                </p>
                <p className="text-[11px] text-sky-850 mt-0.5 leading-normal">
                  Simulating standard Marg v9 keyboard billing matrices, wholesale order books, tax-registers, data backups, and quick medicine alternatives substitution decks. Press any shortcut combination to activate.
                </p>
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <span className="bg-sky-500 text-white font-mono text-[10px] px-2.5 py-1 rounded font-bold uppercase tracking-wider shadow-sm">
                Alt+Key Overrides Ready
              </span>
            </div>
          </div>

          {/* Core Interactive Keystroke & Command Simulator Console */}
          <div className="bg-slate-900 text-slate-100 rounded-2xl p-5 shadow-lg border border-slate-800 flex flex-col md:flex-row items-stretch justify-between gap-6 relative overflow-hidden">
            <div className="space-y-3 z-10 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[9px] font-mono font-bold px-2 py-0.5 rounded uppercase tracking-widest">
                  Terminal Status: Active
                </span>
                <span className="text-slate-400 text-[10px] font-mono">PharmaSync Core Live</span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Marg v9+ Offline Command Emulator
              </h3>
              
              {/* Output Feedback area */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-sky-400 min-h-[60px] flex items-center">
                <div className="space-y-1 w-full">
                  <span className="text-[10px] text-zinc-500 block uppercase font-bold tracking-widest">Console Log:</span>
                  <p className="leading-relaxed font-bold text-emerald-450">{margActionResult}</p>
                </div>
              </div>
            </div>

            {/* Quick SCM Bulk Sync Button within console */}
            <div className="bg-slate-950/65 border border-slate-800 rounded-xl p-4 md:w-80 shrink-0 flex flex-col justify-between space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-mono font-bold">
                  Backup Auto-Scheduler
                </span>
                <span className="text-[9px] text-emerald-450 font-bold font-mono">100% Guarded</span>
              </div>
              <p className="text-[11px] text-zinc-350 leading-normal">
                {statusMessage}
              </p>
              <button 
                disabled={activeSyncing}
                onClick={triggerPharmaSync}
                className="w-full py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 shadow-md shadow-sky-500/10 active:scale-98"
              >
                <RefreshCw className={`h-3 w-3 ${activeSyncing ? 'animate-spin' : ''}`} />
                {activeSyncing ? 'Synchronizing XMLs...' : 'Alt+F10 (Force Heartbeat)'}
              </button>
            </div>
            
            {/* Ambient visual background glow */}
            <div className="absolute -right-12 -bottom-12 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl"></div>
          </div>

          {/* Grand Menu Matrix Layout - mimicking Marg ERP's actual main view divisions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Column A: Transactional Bill-Registers (Sales & Wholesale Accounts) */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <ShoppingBag className="h-4 w-4 text-sky-500" />
                  1. Sale, Returns & Challans
                </h4>
                <span className="text-[9px] font-mono text-zinc-400">Transactions</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Primary quick-access bill forms for speed invoicing. Skip long mouse-menus.
              </p>

              <div className="space-y-2.5">
                {[
                  { label: '[F2] Retail Invoicing (Thermal)', desc: 'Run offline drug POS receipt screen.', tab: 'pos-billing', action: 'Triggering Retail Bill Entry Terminal (Quick barcode focus).' },
                  { label: '[Alt+W] Wholesale Multi-Box Bill', desc: 'SCM batch bulk ordering with trade schemes.', tab: 'purchase-orders', action: 'Initiating wholesale margin discount calculator.' },
                  { label: '[Alt+C] Sale Return (Credit Note)', desc: 'Reconcile patient medicine returns on bills.', tab: 'returns-expiry', action: 'Credit note registry requested. Scan local invoice ID.' },
                  { label: '[Alt+N] Bulk Delivery Challan Receipt', desc: 'Post pending logistics transport vouchers.', tab: 'inventory-master', action: 'Posting pending logistics challan state into sub-store cache.' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMargActionResult(`[COMMAND SUCCESS] Registered shortcut ${item.label.split(' ')[0]} => ${item.action}`);
                      if (item.tab) setActiveTab(item.tab);
                    }}
                    className="w-full text-left p-3 bg-zinc-50 hover:bg-sky-50 border border-zinc-200 hover:border-sky-300 rounded-xl transition duration-150 flex items-center justify-between group active:scale-99"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-zinc-800 group-hover:text-sky-700 font-mono">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-zinc-550 mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Column B: Inbound Procurement & Vendor Trade Ledgers */}
            <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-extrabold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Database className="h-4 w-4 text-emerald-500" />
                  2. Inbound SCM & Vendor Ledger
                </h4>
                <span className="text-[9px] font-mono text-zinc-400">Supply Chain</span>
              </div>
              <p className="text-[11px] text-zinc-400">
                Log fresh batch quantities and balance out supplier dues in real time.
              </p>

              <div className="space-y-2.5">
                {[
                  { label: '[Alt+P] Secure Purchase Entry', desc: 'Enter fresh distributor batches with GST calculations.', tab: 'purchase-entry', action: 'Launching raw Purchase Bill entry worksheet. Validate HSN taxes.' },
                  { label: '[Alt+D] Purchase Return (Debit Note)', desc: 'Mark short-expiry / expired stock to return.', tab: 'returns-expiry', action: 'Generating trade debit note files. Ready to submit to GSK Noida depot.' },
                  { label: '[Alt+L] Dealer Ledger Accounts', desc: 'View current outstanding and post settlement payments.', tab: 'dealer-ledger', action: 'Opened distributor ledger account audit checklist.' },
                  { label: '[F10] Stock Issue & Bin Transfers', desc: 'Internal stock allocation between retail and Noida godown.', tab: 'inventory-master', action: 'Submitting stock transit request to Central Noida Godown.' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMargActionResult(`[COMMAND SUCCESS] Triggered key ${item.label.split(' ')[0]} => ${item.action}`);
                      if (item.tab) setActiveTab(item.tab);
                    }}
                    className="w-full text-left p-3 bg-zinc-50 hover:bg-emerald-50 border border-zinc-200 hover:border-emerald-300 rounded-xl transition duration-150 flex items-center justify-between group active:scale-99"
                  >
                    <div>
                      <p className="text-xs font-extrabold text-zinc-800 group-hover:text-emerald-700 font-mono">
                        {item.label}
                      </p>
                      <p className="text-[10px] text-zinc-550 mt-0.5">{item.desc}</p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-zinc-400 group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>
            </div>

            {/* Column C: Interactive Utilities & Generic Chemical Substitutes Lookup */}
            <div className="space-y-6">
              
              {/* Chemical Salt Brand Matrix (Extremely critical for high-volume Marg retailers) */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                    <ArrowRightLeft className="h-4 w-4 text-purple-500 animate-pulse" />
                    [Alt+S] Salt Synonym Finder
                  </h4>
                  <span className="text-[9px] bg-purple-50 text-purple-700 font-black px-1 rounded">Generic Sub</span>
                </div>
                
                <p className="text-[10px] text-zinc-400 leading-normal">
                  Substitute high-price drugs (e.g., Augmentin) with identical generic chemical salts instantly during billing to maximize dealer margins.
                </p>

                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={simulatedQuery}
                      onChange={(e) => handleSaltSubstituteSearch(e.target.value)}
                      placeholder="Type 'Paracetamol' or click suggestions..."
                      className="flex-grow text-xs border border-zinc-200 rounded-xl px-3 py-2 bg-zinc-55 focus:outline-none focus:ring-1 focus:ring-purple-500"
                    />
                    <button 
                      onClick={() => handleSaltSubstituteSearch('Paracetamol')}
                      className="px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white text-[11px] font-bold rounded-xl transition"
                    >
                      Test
                    </button>
                  </div>

                  {/* Suggestion list */}
                  <div className="flex flex-wrap gap-1.5">
                    <button onClick={() => handleSaltSubstituteSearch('Paracetamol')} className="text-[9px] bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-650 px-2 py-1 rounded font-mono font-bold">Paracetamol</button>
                    <button onClick={() => handleSaltSubstituteSearch('Amoxicillin')} className="text-[9px] bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-650 px-2 py-1 rounded font-mono font-bold">Amoxicillin</button>
                  </div>

                  {/* Substitution Output display list */}
                  {genericSaltAlternatives.length > 0 && (
                    <div className="bg-zinc-50 border border-zinc-150 rounded-xl p-2.5 space-y-2 mt-2 max-h-[175px] overflow-y-auto">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-mono">Approved Alternatives Matrix:</p>
                      {genericSaltAlternatives.map((alt, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs border-b border-zinc-100 pb-1.5 last:border-0 last:pb-0">
                          <div>
                            <p className="font-bold text-zinc-805 leading-none">{alt.name}</p>
                            <span className="text-[9px] text-zinc-400 block font-mono">{alt.mfg}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-xs font-black text-emerald-600 block">₹{alt.price.toFixed(2)}</span>
                            <span className="text-[9px] text-sky-600 font-bold bg-sky-50 px-1 rounded block">{alt.margin}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Offline backup & utility ledger triggers */}
              <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4">
                <h4 className="text-xs font-extrabold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <DatabaseBackup className="h-4 w-4 text-sky-505" />
                  Marg System Utilities Deck
                </h4>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <button 
                    onClick={() => {
                      setMargActionResult('[UTILITY EXECUTION] Compiled SHA-256 local ledger database. Offline backup downloaded safely and archived into ZIP structure.');
                      alert('Local database backup verified. Secure copy saved to C:\\MargERP\\Backups\\APOTHECARY_SNAPSHOT.ZIP');
                    }}
                    className="p-3.5 bg-zinc-55 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-left hover:scale-[1.01] active:scale-98 transition-all"
                  >
                    <span className="text-xs font-black text-zinc-800 font-mono block">[Alt+B]</span>
                    <span className="text-[10px] text-zinc-500 block mt-1">Download ERP Backup</span>
                  </button>

                  <button 
                    onClick={() => {
                      setMargActionResult('[UTILITY EXECUTION] Rebuilding local stock indexes. Re-compiled HSN codes for drug catalogs.');
                      alert('Re-indexing transaction vouchers completed! 0 cross-reference conflicts detected in offline index.');
                    }}
                    className="p-3.5 bg-zinc-55 hover:bg-zinc-100 border border-zinc-200 rounded-xl text-left hover:scale-[1.01] active:scale-98 transition-all"
                  >
                    <span className="text-xs font-black text-zinc-800 font-mono block">[Alt+R]</span>
                    <span className="text-[10px] text-zinc-500 block mt-1">Rebuild Stock Index</span>
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Quick Stats overview matching Marg Layout bottom bar */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-white border border-zinc-200/95 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono block">Today's Grand Sale</span>
                <span className="text-lg font-black text-zinc-800 font-mono">₹{totalSalesVal.toLocaleString('en-IN')}.00</span>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">+14.2%</span>
            </div>

            <div className="bg-white border border-zinc-200/95 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono block">Active SKU Stock</span>
                <span className="text-lg font-black text-zinc-800 font-mono">{totalSkuLines} Lines</span>
              </div>
              <span className="text-[10px] text-zinc-450 uppercase font-mono">Verified</span>
            </div>

            <div className="bg-white border border-zinc-200/95 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono block">Expiry Dump Risk</span>
                <span className="text-lg font-black text-amber-600 font-mono">{nearExpiryCount} Batches</span>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg">90 Days</span>
            </div>

            <div className="bg-white border border-zinc-200/95 p-4 rounded-xl shadow-sm flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-zinc-400 uppercase font-mono block">Cloud Sync Pulse</span>
                <span className="text-lg font-black text-sky-655 font-mono">100% Legitimate</span>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            </div>

          </div>

        </div>

      ) : (

        // MODERN CLOUD COMMAND MASTER CENTER VIEW
        <div className="space-y-6">
          
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-slate-900 via-zinc-800 to-slate-900 border border-slate-700/30 text-white rounded-2xl p-6 shadow-md relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-1 z-10">
              <div className="flex items-center gap-2">
                <span className="bg-sky-500/15 border border-sky-400/40 text-sky-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Apothecary Cloud ERP
                </span>
                <span className="bg-emerald-500/15 border border-emerald-400/40 text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Activity className="h-2.5 w-2.5 animate-pulse" /> Live Node
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-white font-sans mt-2">
                Enterprise Command Center
              </h2>
              <p className="text-xs text-zinc-300 max-w-xl">
                Streamlined pharmacy operations, batch-wise compliance ledger, and integrated drug database logistics.
              </p>
            </div>

            {/* PharmaSync Command Button */}
            <div className="bg-zinc-850 border border-zinc-700/50 rounded-xl p-4.5 min-w-[280px] shrink-0 z-10 flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1">
                  <CloudLightning className="h-3 w-3 text-sky-400" /> PharmaSync Cloud Pulse
                </span>
                <span className="text-[9px] text-zinc-500 font-mono">Last Sync: {syncTime}</span>
              </div>
              <p className="text-[11px] leading-relaxed text-zinc-300 min-h-[32px]">
                {statusMessage}
              </p>
              <button 
                disabled={activeSyncing}
                onClick={triggerPharmaSync}
                className={`w-full py-2 px-3.5 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  activeSyncing 
                    ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                    : 'bg-sky-500 text-white hover:bg-sky-600 shadow-md shadow-sky-500/20 active:scale-[0.98]'
                }`}
              >
                <RefreshCw className={`h-3 w-3 ${activeSyncing ? 'animate-spin' : ''}`} />
                {activeSyncing ? 'Syncing...' : 'Sync Now (PharmaSync)'}
              </button>
            </div>

            {/* Background Decorative Circles */}
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-sky-500/5 rounded-full blur-2xl"></div>
            <div className="absolute left-1/3 -bottom-16 w-36 h-36 bg-indigo-500/5 rounded-full blur-2xl"></div>
          </div>

          {/* KPI Overviews */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            
            <div className="bg-white border border-zinc-200/80 p-4.5 rounded-xl shadow-sm flex flex-col justify-between hover:border-sky-300 transition-all group">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Gross Sales Reconciled</span>
                <div className="h-8 w-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold text-sm">
                  ₹
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xl font-extrabold text-zinc-800 font-mono">₹{totalSalesVal.toLocaleString('en-IN')}.00</span>
                <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> +14.2% versus previous week
                </div>
              </div>
            </div>

            <div className="bg-white border border-zinc-200/80 p-4.5 rounded-xl shadow-sm flex flex-col justify-between hover:border-indigo-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Active SKU Catalog</span>
                <div className="h-8 w-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Database className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xl font-extrabold text-zinc-800 font-mono">{totalSkuLines} Drugs</span>
                <span className="text-[10px] text-zinc-400 mt-1 block">OTC, Schedule H & Narcotics registered</span>
              </div>
            </div>

            <div className="bg-white border border-zinc-200/80 p-4.5 rounded-xl shadow-sm flex flex-col justify-between hover:border-amber-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Expiry Warning List</span>
                <div className="h-8 w-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                  <ShieldAlert className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xl font-extrabold text-amber-650 font-mono">{nearExpiryCount} Batches</span>
                <span className="text-[10px] text-zinc-500 mt-1 block">Expiring within 90 days - action needed</span>
              </div>
            </div>

            <div className="bg-white border border-zinc-200/80 p-4.5 rounded-xl shadow-sm flex flex-col justify-between hover:border-emerald-300 transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">PharmaSync Coverage</span>
                <div className="h-8 w-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="h-4.5 w-4.5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-xl font-extrabold text-zinc-800 font-mono">100% Secure</span>
                <span className="text-[10px] text-emerald-600 mt-1 block">4 branches & 2 central warehouses linked</span>
              </div>
            </div>
          </div>

          {/* Pharmacy Intelligence Dashboard Widgets */}
          <PharmacyIntelligenceDashboard />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4 lg:col-span-2">
              <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Essential Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                
                <button 
                  onClick={() => setActiveTab('pos-billing')}
                  className="flex items-center justify-between p-3.5 bg-sky-50/50 border border-sky-100 rounded-xl text-left hover:bg-sky-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-500 text-white rounded-lg group-hover:scale-105 transition-all">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800">New POS Billing</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Quick thermal and QR receipt checkouts</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-sky-400 group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => setActiveTab('ocr-magic')}
                  className="flex items-center justify-between p-3.5 bg-purple-50/50 border border-purple-100 rounded-xl text-left hover:bg-purple-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500 text-white rounded-lg group-hover:scale-105 transition-all">
                      <Sparkles className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800">OCR Magic Import</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Scan vendor bills & prescriptions with AI</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => setActiveTab('narcotics-register')}
                  className="flex items-center justify-between p-3.5 bg-rose-50/50 border border-rose-100 rounded-xl text-left hover:bg-rose-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500 text-white rounded-lg group-hover:scale-105 transition-all">
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800">Narcotics Compliance</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Track double-signed Scheduled drug lists</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-rose-450 group-hover:translate-x-1 transition-all" />
                </button>

                <button 
                  onClick={() => setActiveTab('khatabook-ledger')}
                  className="flex items-center justify-between p-3.5 bg-emerald-50/50 border border-emerald-100 rounded-xl text-left hover:bg-emerald-50 transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500 text-white rounded-lg group-hover:scale-105 transition-all">
                      <BookOpen className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800">Khatabook Customer Accounts</h4>
                      <p className="text-[10px] text-zinc-400 mt-0.5">Track local patient home delivery balances</p>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-emerald-400 group-hover:translate-x-1 transition-all" />
                </button>

              </div>

              {/* Quick System Integrity Check */}
              <div className="bg-zinc-50 border border-zinc-200/70 rounded-xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                  <div>
                    <p className="text-xs font-bold text-zinc-805 flex items-center gap-1.5">
                      PharmaSync Hub Operational
                    </p>
                    <p className="text-[10px] text-zinc-550 mt-0.5">Dual-mode counters and vendor ledger balances synchronized</p>
                  </div>
                </div>
                <div className="flex bg-white shadow-sm border border-zinc-200/50 rounded-lg p-1 shrink-0 text-[10px] font-mono text-zinc-500">
                  <span className="px-2 py-1 font-bold">PHARMASYNC: SYNCED</span>
                </div>
              </div>
            </div>

            {/* PharmaSync Branch Monitoring */}
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">PharmaSync Fleet</h3>
                <span className="text-[9px] bg-sky-100 text-sky-700 font-bold px-1.5 py-0.5 rounded">All Connected</span>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Noida Godown (SCM Central)', status: 'Connected', ping: '12ms', lastSync: '1 min ago', volume: '1,420 items' },
                  { name: 'Main Branch (Retail POS)', status: 'Connected', ping: '8ms', lastSync: 'Real-time', volume: '492 bills today' },
                  { name: 'Warehouse 4 (Central Bulk)', status: 'Connected', ping: '15ms', lastSync: '4 min ago', volume: 'Bulk SCM pallets' },
                  { name: 'Gwalior Franchise Hub', status: 'Connected', ping: '22ms', lastSync: '10 min ago', volume: '88 orders' }
                ].map((branchVal, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 border border-zinc-100 rounded-lg flex items-center justify-between gap-2 hover:border-zinc-300 transition-colors">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-zinc-800">{branchVal.name}</p>
                      <p className="text-[9px] text-zinc-500 font-mono flex items-center gap-1">
                        <Clock className="h-2.5 w-2.5 text-zinc-400" /> Sync: {branchVal.lastSync} • Vol: {branchVal.volume}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[9px] text-sky-600 bg-sky-50 border border-sky-100 font-bold px-1.5 py-0.5 rounded block text-center">
                        {branchVal.ping}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}
