import React, { useState } from 'react';
import { 
  Terminal, Sparkles, AlertCircle, FileSpreadsheet, Keyboard, CheckCircle2, Search, ArrowRightLeft
} from 'lucide-react';

export default function MargToolsModule() {
  const [activeWorkspace, setActiveWorkspace] = useState<'emulator' | 'alternatives' | 'conversion'>('emulator');
  const [pressedKeyText, setPressedKeyText] = useState('Select or press a shortcut key to emmulate quick-key billing protocols.');
  const [querySalt, setQuerySalt] = useState('');
  const [foundBrands, setFoundBrands] = useState<any[]>([]);

  // Keyboard shortcut registry 
  const margShortcuts = [
    { key: 'F2', action: 'Direct Thermal POS Bill Creation', desc: 'Saves 4 clicks, automatically centers search on barcode entry field.' },
    { key: 'Alt + M', action: 'Modify Posted Supplier Ledger Voucher', desc: 'Allows immediate correction of batch number constraints.' },
    { key: 'F10', action: 'Register New B2B Distributor Ledger', desc: 'Instantly prompt details such as GSTIN, drug license, and credit window limits.' },
    { key: 'Alt + X', action: 'Batch Expiry Return Processing', desc: 'Marks highlighted stocks as expired and auto-drafts return delivery slips.' },
    { key: 'Ctrl + P', action: 'Print Offline Multi-Branch Stock Register', desc: 'Saves a copy of the entire inventory count in TXT format to external disk.' },
    { key: 'Alt + F10', action: 'Force Cloud Heartbeat Sync (PharmaSync)', desc: 'Triggers local master record synchronization with Delhi central instance.' }
  ];

  // Compound Salt Alternatives Database
  const saltDatabase: Record<string, { salt: string; therapeutic: string; brands: { name: string; price: number; margin: string; mfg: string }[] }> = {
    'Paracetamol': {
      salt: 'Paracetamol 650mg / 1000mg USP',
      therapeutic: 'Antipyretics & Analgesics (Fever & Pain reduction)',
      brands: [
        { name: 'Calpol 650', price: 32.50, margin: '18% Retailer / 8% Distributor', mfg: 'GSK Consumer India Ltd' },
        { name: 'Dolo 650', price: 30.20, margin: '22% Retailer / 10% Distributor', mfg: 'Micro Labs Ltd' },
        { name: 'Crocin Pain Relief', price: 42.00, margin: '15% Retailer / 6% Distributor', mfg: 'Haleon Healthcare' },
        { name: 'Pacimol Active', price: 28.00, margin: '25% Retailer / 12% Distributor', mfg: 'Ipca Laboratories' }
      ]
    },
    'Amoxicillin': {
      salt: 'Amoxicillin Trihydrate 500mg IP + Clavulanate Potassium 125mg',
      therapeutic: 'Penicillin-class Broad Spectrum Antibiotics',
      brands: [
        { name: 'Augmentin 625 Duo', price: 201.30, margin: '16% Retailer / 8% Distributor', mfg: 'GlaxoSmithKline Pharma' },
        { name: 'Moxikind-CV 625', price: 178.50, margin: '20% Retailer / 12% Distributor', mfg: 'Mankind Pharma Ltd' },
        { name: 'Clavam 625', price: 194.00, margin: '18% Retailer / 9% Distributor', mfg: 'Alkem Laboratories' },
        { name: 'Amoxyclav 625', price: 165.00, margin: '24% Retailer / 10% Distributor', mfg: 'Abbott Healthcare' }
      ]
    },
    'Atorvastatin': {
      salt: 'Atorvastatin Calcium IP 10mg / 20mg',
      therapeutic: 'HMG-CoA Reductase Inhibitor (Cholesterol Statin)',
      brands: [
        { name: 'Lipitor 10mg', price: 285.00, margin: '12% Retailer / 6% Distributor', mfg: 'Viatris Inc' },
        { name: 'Atorva 10', price: 85.40, margin: '22% Retailer / 10% Distributor', mfg: 'Zydus Cadila' },
        { name: 'Tonact 10', price: 78.00, margin: '24% Retailer / 12% Distributor', mfg: 'Lupin Limited' },
        { name: 'Lipivas 10', price: 68.00, margin: '25% Retailer / 15% Distributor', mfg: 'Cipla Limited' }
      ]
    }
  };

  const handleAltSearch = () => {
    const term = querySalt.trim().toLowerCase();
    if (!term) {
      setFoundBrands([]);
      return;
    }
    // Match partial keys
    const match = Object.keys(saltDatabase).find(key => key.toLowerCase().includes(term));
    if (match) {
      setFoundBrands(saltDatabase[match].brands);
    } else {
      setFoundBrands([]);
    }
  };

  return (
    <div className="flex-grow p-6 bg-zinc-50 flex flex-col overflow-hidden h-full">
      {/* Title Header */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-zinc-200 pb-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Terminal className="h-4 w-4 text-sky-500" />
            Module 22: Advanced Marg ERP Tools & Compound Alternatives
          </h2>
          <p className="text-xs text-zinc-500">
            Keyboard-first fast workspace simulations, margins calculations, drug salt synonyms, and offline data adapters.
          </p>
        </div>

        {/* Subtabs switches */}
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveWorkspace('emulator')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeWorkspace === 'emulator' ? 'bg-white shadow text-sky-600' : 'text-zinc-500'
            }`}
          >
            Keyboard Emulator
          </button>
          <button
            onClick={() => setActiveWorkspace('alternatives')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeWorkspace === 'alternatives' ? 'bg-white shadow text-sky-600' : 'text-zinc-500'
            }`}
          >
            Salt Brand Matrix
          </button>
          <button
            onClick={() => setActiveWorkspace('conversion')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeWorkspace === 'conversion' ? 'bg-white shadow text-sky-600' : 'text-zinc-500'
            }`}
          >
            Marg Format Converter
          </button>
        </div>
      </div>

      {/* Main Workspace Frame */}
      <div className="flex-1 overflow-y-auto">
        {activeWorkspace === 'emulator' && (
          <div className="space-y-6">
            <div className="p-4 bg-slate-900 text-slate-100 rounded-xl border border-slate-800 shadow-lg flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-sky-500/10 border border-sky-400/25 rounded-lg text-sky-450 animate-pulse">
                  <Keyboard className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-zinc-400 font-mono">MARG HOTKEY SYSTEM EMULATOR (OFFLINE-MODE READY)</p>
                  <p className="text-sm font-bold text-white mt-0.5">{pressedKeyText}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {margShortcuts.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => setPressedKeyText(`[SUCCESS] Registered offline keystroke '${s.key}' => Executed: ${s.action}.`)}
                  className="bg-white border border-zinc-200 p-4 rounded-xl text-left hover:border-sky-500 hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-black border border-zinc-300 bg-zinc-100 text-zinc-700 px-2 py-1 rounded shadow-sm">
                      {s.key}
                    </span>
                    <span className="text-[10px] text-zinc-400 font-bold uppercase">Click to fire</span>
                  </div>
                  <h4 className="text-xs font-bold text-zinc-805 mt-4">{s.action}</h4>
                  <p className="text-[10px] text-zinc-500 mt-2 leading-relaxed">{s.desc}</p>
                </button>
              ))}
            </div>

            {/* Pro Tips panel */}
            <div className="p-4 bg-amber-50 border border-amber-200/50 rounded-xl flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-xs font-bold text-amber-900">Why does Apothecary emmulate Marg keys?</h4>
                <p className="text-[11px] text-amber-850 mt-1 leading-relaxed">
                  Pharmacists and pharmacists billing operators in India have massive muscle memory built over 20+ years of using legacy Marg ERP softwares. Adding keyboard emulator overrides means cache operators do not have to leave their legacy keyboards to click small dropdown buttons.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeWorkspace === 'alternatives' && (
          <div className="space-y-6">
            <div className="bg-white border border-zinc-200/80 p-5 rounded-xl shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">Search active chemical salts & find generic alternatives</h3>
              <p className="text-[11px] text-zinc-400 leading-normal">
                Enter common salts like <strong className="text-zinc-600">Paracetamol</strong>, <strong className="text-zinc-600">Amoxicillin</strong>, or <strong className="text-zinc-600">Atorvastatin</strong> to see all generic brand substitutions, their MRP retail prices, and profit margins structures.
              </p>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <input
                    type="text"
                    value={querySalt}
                    onChange={(e) => setQuerySalt(e.target.value)}
                    placeholder="Enter active salt ingredient..."
                    className="w-full text-xs border border-zinc-200 rounded-xl pl-9 pr-4 py-2.5 bg-zinc-50 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleAltSearch()}
                  />
                </div>
                <button
                  onClick={handleAltSearch}
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl transition shadow"
                >
                  Verify Substitutions
                </button>
              </div>
            </div>

            {foundBrands.length > 0 ? (
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <div className="p-4 bg-zinc-50 border-b border-zinc-150">
                  <span className="text-xs font-bold text-zinc-800">Generic Brands & Approved Alternatives Matrix</span>
                </div>
                <table className="w-full text-left text-xs">
                  <thead className="bg-zinc-100 text-zinc-500 font-bold">
                    <tr>
                      <th className="p-3">Brand Trade Name</th>
                      <th className="p-3">Manufacturer</th>
                      <th className="p-3 text-right">MRP (INR)</th>
                      <th className="p-3 text-center">Margin Split</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-150 text-zinc-705">
                    {foundBrands.map((b, i) => (
                      <tr key={i} className="hover:bg-sky-50/20 transition-colors">
                        <td className="p-3 font-semibold text-zinc-900">{b.name}</td>
                        <td className="p-3 text-zinc-500 font-mono">{b.mfg}</td>
                        <td className="p-3 text-right font-bold text-zinc-800">₹{b.price.toFixed(2)}</td>
                        <td className="p-3 text-center font-bold text-sky-600 bg-sky-50/40">{b.margin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : querySalt ? (
              <div className="bg-white border border-zinc-200 p-6 rounded-xl text-center text-zinc-400 text-xs">
                No matching ingredients registered in offline state. Try searching <strong>Paracetamol</strong> or <strong>Amoxicillin</strong>.
              </div>
            ) : null}
          </div>
        )}

        {activeWorkspace === 'conversion' && (
          <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-750 uppercase tracking-widest flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-emerald-500" /> Convert Standard Inventory Data to Marg Legacy Schema
            </h3>
            <p className="text-[11px] text-zinc-500 leading-normal">
              Need to load bills into standalone PCs locally? Generate a Marg compliance-matched layout detailing batch IDs, expiry dates, packing numbers, VAT values, and manufacturing codes.
            </p>

            <div className="p-4 bg-zinc-50 border border-zinc-150 rounded-xl space-y-3">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-zinc-800">Export Parameters:</span>
                <span className="font-mono text-zinc-500">FORMAT-VER: Marg v9.11_ESM</span>
              </div>
              <div className="text-[10px] font-mono text-zinc-400 bg-zinc-900 p-3 rounded-lg text-left overflow-x-auto select-all leading-relaxed whitespace-pre">
                {`"HEADER","COAD","DRUG_REG_ID","BATCH_NUM","EXP_DATE","PACK_VAL","MRP_IND","CGST","SGST"
"ITEM","CAL650","DL-203847","CPL-9981","2026-11-20","10 Tabs",32.50,6.00,6.00
"ITEM","DOL650","DL-884729","DOL-7721","2026-09-15","15 Tabs",30.20,6.00,6.00
"ITEM","AUG625","DL-113322","AUG-4422","2027-02-10","6 Tabs",201.30,9.00,9.00`}
              </div>
              <button
                onClick={() => alert('Offline Marg ERP format CSV generated and cached in local downloads.')}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-lg transition"
              >
                Download Export file (.csv)
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
