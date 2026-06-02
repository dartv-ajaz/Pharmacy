import React, { useState } from 'react';
import { Layers, ShieldCheck, HelpCircle, Check, Sparkles, Scale, Activity, Plus } from 'lucide-react';
import { mockProducts } from '../../data/mockData';

// Drug chemical base structural templates
const formulationsTemplate: Record<string, {
  apiName: string;
  apiMgPerTablet: number;
  excipients: { name: string; percentage: number }[];
}> = {
  P001: {
    apiName: 'Acetaminophen (Paracetamol) USP Grade',
    apiMgPerTablet: 650,
    excipients: [
      { name: 'Microcrystalline Cellulose (Dry Binder)', percentage: 20 },
      { name: 'Sodium Starch Glycolate (Superdisintegrant)', percentage: 8 },
      { name: 'Magnesium Stearate (Tablet Lubricant)', percentage: 1.5 },
      { name: 'Colloidal Silicon Dioxide (Glidant)', percentage: 0.5 }
    ]
  },
  P002: {
    apiName: 'Glimepiride BP + Metformin Hcl USP Combined Salt',
    apiMgPerTablet: 502,
    excipients: [
      { name: 'Starch 1500 (Binder & Filler)', percentage: 25 },
      { name: 'Povidone K-30 (Wet Granulator)', percentage: 4 },
      { name: 'Talc Purified USP (Glidant/Lubricant)', percentage: 2 },
      { name: 'Hypromellose (Film Coating excipient)', percentage: 3 }
    ]
  },
  P003: {
    apiName: 'Alprazolam Pure Fine Crystals (Schedule IV regulatory API)',
    apiMgPerTablet: 0.5,
    excipients: [
      { name: 'Lactose Monohydrate (Primary Compression Filler)', percentage: 85 },
      { name: 'Dicalcium Phosphate (Structural excipient)', percentage: 10 },
      { name: 'Colorant FD&C Yellow No. 6 Aluminum Lake', percentage: 0.5 },
      { name: 'Magnesium Stearate (Fine Lubricant)', percentage: 1 }
    ]
  }
};

export default function ManufacturingModule() {
  const [selectedProductId, setSelectedProductId] = useState(mockProducts[0]?.id || '');
  const [batchCapacity, setBatchCapacity] = useState(25000); // 25,000 pills default
  const [qcChecks, setQcChecks] = useState({
    friabilityPassed: true,
    dissolutionPassed: true,
    disintegrationPassed: true,
    moistureWithinLimits: true,
    assaysMatchSpec: false
  });
  const [batchLogs, setBatchLogs] = useState<string[]>([]);
  const [stampApproved, setStampApproved] = useState(false);

  const selectedProduct = mockProducts.find(p => p.id === selectedProductId) || mockProducts[0];
  const formulation = formulationsTemplate[selectedProduct.id] || {
    apiName: 'Standard Diagnostic Chemical API',
    apiMgPerTablet: 100,
    excipients: [
      { name: 'Dibasic Calcium Phosphate Binder', percentage: 70 },
      { name: 'Purified Stearic Acid Lubricant', percentage: 3 }
    ]
  };

  // Safe Math metrics:
  // 1 tablet total weight calculation: API weight + excipients ratio. Let's assume excipients percentages make up the rest of the pill weight, or calculate custom.
  const apiKilograms = Math.round(((formulation.apiMgPerTablet * batchCapacity) / 1000000) * 100) / 100;
  
  // Total excipient weight estimation (let's assume a standard pill is at least 300mg, or scale it dynamically)
  const estimatedPillWeightMg = Math.max(formulation.apiMgPerTablet * 1.4, 250);
  const excipientTotalWeightMg = estimatedPillWeightMg - formulation.apiMgPerTablet;
  const excipientKilograms = Math.round(((excipientTotalWeightMg * batchCapacity) / 1000000) * 100) / 100;

  const handleSimulateManufacturingSetup = (e: React.FormEvent) => {
    e.preventDefault();
    const newLog = `[${new Date().toLocaleTimeString()}] Dynamic BOM sealed: Batch size ${batchCapacity.toLocaleString()} Tablets for ${selectedProduct.name}. Total raw API requirement allocated: ${apiKilograms} kg.`;
    setBatchLogs([newLog, ...batchLogs]);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* Banner */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Layers className="h-4 w-4 text-sky-600 animate-pulse" />
            Module 16: Manufacturing (BOM) & Granulation Coordinator
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">WHO-GMP raw compounding, Active Ingredient (API) auto-scalers, and QA/QC friability checklist.</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left column: BOM auto scaler */}
        <form onSubmit={handleSimulateManufacturingSetup} className="xl:col-span-4 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5 pt-1">
            <Scale className="h-4 w-4 text-zinc-400" /> Batch Scaling Parameters
          </h3>

          <div className="space-y-3.5 text-xs text-zinc-700 select-none">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase">Target Formulation Medicine</label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-805 focus:outline-none"
              >
                {mockProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name} ({p.category})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase">Target Batch size (Tablets / Vials)</label>
              <input
                type="number"
                step="5000"
                min="5000"
                max="1000000"
                value={batchCapacity}
                onChange={(e) => setBatchCapacity(Math.max(5000, Number(e.target.value)))}
                className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs font-medium focus:outline-none"
              />
              <span className="text-[10px] text-zinc-400 block mt-1">Minimum GMP batch compression limit: 5,000 units.</span>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-sky-600 hover:bg-sky-700 text-white rounded-lg text-xs font-bold tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Plus className="h-4 w-4" /> Seal Bill of Materials
            </button>
          </div>
        </form>

        {/* Center column: Interactive Scales & BOM Breakdown */}
        <div className="xl:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2.5 border-b border-zinc-100">
            <div>
              <span className="text-[9px] uppercase font-bold text-sky-500 tracking-wider">Formula Recipe Registry</span>
              <h3 className="text-xs font-black text-zinc-900 mt-0.5">BOM Ratio Matrix: {selectedProduct.name}</h3>
            </div>
            <span className="text-[10px] text-zinc-400 font-mono font-bold">BATCH SIZE: {batchCapacity.toLocaleString()} EA</span>
          </div>

          <div className="space-y-3.5 text-xs">
            {/* Live scaled active drug */}
            <div className="bg-sky-50/55 border border-sky-100 rounded-lg p-3">
              <div className="flex justify-between items-start mb-1 text-[10px] font-bold text-sky-700">
                <span className="uppercase text-[9px] tracking-widest">Active Pharmacological Ingredient (API)</span>
                <span className="font-mono">{formulation.apiMgPerTablet} mg / Pill</span>
              </div>
              <div className="flex justify-between text-xs text-zinc-800 font-semibold">
                <span>{formulation.apiName}</span>
                <strong className="text-zinc-900 font-mono text-xs">{apiKilograms} kg</strong>
              </div>
            </div>

            {/* Inactive ingredients itemized scaler */}
            <div className="space-y-2">
              <span className="block text-[8px] font-bold text-zinc-400 uppercase tracking-widest">Scaled Invariant Excipients ({excipientKilograms} kg Total)</span>
              {formulation.excipients.map((ex, idx) => {
                const exKg = Math.round(((excipientKilograms * (ex.percentage / 100)) * 1000)) / 1000;
                return (
                  <div key={idx} className="flex justify-between items-center text-xs p-2 bg-zinc-50 border border-zinc-200 rounded-lg">
                    <div>
                      <span className="font-semibold text-zinc-800">{ex.name}</span>
                      <span className="text-[9px] text-zinc-400 ml-1.5 font-mono">({ex.percentage}%)</span>
                    </div>
                    <strong className="text-zinc-900 font-mono">{exKg} kg</strong>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right column: Quality control audits */}
        <div className="xl:col-span-3 space-y-4">
          <div className="bg-slate-900 text-white border border-slate-800 p-5 rounded-xl shadow-sm space-y-4.5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-emerald-400 animate-pulse" /> GMP Quality Control Checklist
            </h3>

            <p className="text-[10px] text-slate-400 leading-relaxed">
              Batch compression must achieve rigorous pharmaceutical-grade regulatory tolerances before distribution.
            </p>

            <div className="space-y-2 text-xs">
              <label className="flex items-center gap-2.5 text-slate-300 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={qcChecks.friabilityPassed}
                  onChange={(e) => setQcChecks({ ...qcChecks, friabilityPassed: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 cursor-pointer"
                />
                <span>Friability Check Passed (&lt;1.0%)</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-300 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={qcChecks.dissolutionPassed}
                  onChange={(e) => setQcChecks({ ...qcChecks, dissolutionPassed: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 cursor-pointer"
                />
                <span>Dissolution Rate Passed (Q&gt;80%)</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-300 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={qcChecks.disintegrationPassed}
                  onChange={(e) => setQcChecks({ ...qcChecks, disintegrationPassed: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 cursor-pointer"
                />
                <span>Disintegration Testing (&lt;15m)</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-300 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={qcChecks.moistureWithinLimits}
                  onChange={(e) => setQcChecks({ ...qcChecks, moistureWithinLimits: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 cursor-pointer"
                />
                <span>Moisture Ratio Reconciled (&lt;2.0%)</span>
              </label>

              <label className="flex items-center gap-2.5 text-slate-300 select-none cursor-pointer">
                <input
                  type="checkbox"
                  checked={qcChecks.assaysMatchSpec}
                  onChange={(e) => setQcChecks({ ...qcChecks, assaysMatchSpec: e.target.checked })}
                  className="rounded bg-slate-800 border-slate-700 text-emerald-500 cursor-pointer"
                />
                <span>Chemical Assays certified</span>
              </label>
            </div>

            <div className="pt-3.5 border-t border-slate-800">
              <button
                type="button"
                disabled={!(qcChecks.friabilityPassed && qcChecks.dissolutionPassed && qcChecks.disintegrationPassed && qcChecks.moistureWithinLimits && qcChecks.assaysMatchSpec)}
                onClick={() => setStampApproved(true)}
                className="w-full py-2 rounded bg-emerald-500 hover:bg-emerald-600 disabled:opacity-30 disabled:hover:bg-emerald-500 text-slate-950 font-black text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all shadow-md"
              >
                Stamp WHO-GMP Approved Certificate
              </button>
            </div>
          </div>

          {stampApproved && (
            <div className="border border-emerald-400 bg-emerald-50/50 p-4 rounded-xl flex items-start gap-2.5 text-xs text-emerald-800 leading-normal animate-pulse">
              <Check className="h-4.5 w-4.5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-bold block uppercase text-[10px] tracking-wider text-emerald-900">Certificate Released</strong>
                Batch assigned code <span className="font-bold font-mono">B-MFG-GMP-2026</span> is approved for distribution storage and shelf routing!
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Batch Setup Event Logs */}
      <div className="px-6 pb-6 select-none">
        <div className="bg-slate-950 text-slate-400 p-4 rounded-xl font-mono text-[11px] border border-zinc-800">
          <div className="text-zinc-500 mb-2">// GMP Machine Granulator Interface Output Stream</div>
          {batchLogs.length === 0 ? (
            <div className="text-zinc-650 italic">Waiting for compiler events to seal BOM...</div>
          ) : (
            batchLogs.map((log, i) => (
              <div key={i} className="text-emerald-400">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
