import React, { useState } from 'react';
import { Package, ShieldAlert, ArrowLeftRight, Check, History, TrendingDown, ClipboardCheck, Settings, Download, Trash, RefreshCw } from 'lucide-react';
import { Product, BatchInfo } from '../../types';
import { mockProducts, mockBatches } from '../../data/mockData';

interface InventoryModuleProps {
  branch: string;
}

export default function InventoryModule({ branch }: InventoryModuleProps) {
  const [activeTab, setActiveTab] = useState<'alerts' | 'adjust' | 'transfer'>('alerts');
  const [batches, setBatches] = useState<BatchInfo[]>(mockBatches);
  const [valuationMethod, setValuationMethod] = useState<'Weighted Average' | 'FIFO' | 'LIFO'>('Weighted Average');

  // Interactive state for Stock Adjustment
  const [selectedProductAdjust, setSelectedProductAdjust] = useState('P001');
  const [adjustQty, setAdjustQty] = useState(0);
  const [adjustType, setAdjustType] = useState<'Add' | 'Subtract'>('Add');
  const [adjustRemarks, setAdjustRemarks] = useState('');

  // Interactive state for Transfers
  const [transferProduct, setTransferProduct] = useState('P001');
  const [transferSource, setTransferSource] = useState('Main Branch (Retail POS)');
  const [transferDest, setTransferDest] = useState('Noida Godown (SCM Central)');
  const [transferQty, setTransferQty] = useState(10);
  const [transferLogs, setTransferLogs] = useState<{ date: string; drugName: string; qty: number; source: string; dest: string }[]>([
    { date: '2026-06-01', drugName: 'Amoxil 500mg', qty: 50, source: 'Noida Godown (SCM Central)', dest: 'Main Branch (Retail POS)' }
  ]);

  // Calculations for dashboard
  const nearExpiryCount = batches.filter(b => {
    const diff = new Date(b.expiryDate).getTime() - new Date('2026-06-02').getTime();
    return diff > 0 && diff < (40 * 24 * 60 * 60 * 1000); // within 40 days
  }).length;

  const expiredCount = batches.filter(b => new Date(b.expiryDate).getTime() <= new Date('2026-06-02').getTime()).length;

  const handleAdjustStock = () => {
    const prod = mockProducts.find(p => p.id === selectedProductAdjust);
    if (!prod) return;

    // Locate first batch
    const updated = batches.map(b => {
      if (b.productId === selectedProductAdjust) {
        const delta = adjustType === 'Add' ? adjustQty : -adjustQty;
        return {
          ...b,
          stockQty: Math.max(0, b.stockQty + delta)
        };
      }
      return b;
    });

    setBatches(updated);
    setAdjustQty(0);
    setAdjustRemarks('');

    alert(`Successfully processed standard stock reconciliation audit. Product ${prod.name} has been modified securely.`);
  };

  const handleTransfer = () => {
    const p = mockProducts.find(prod => prod.id === transferProduct);
    if (!p) return;

    setTransferLogs([
      {
        date: new Date().toISOString().split('T')[0],
        drugName: p.name,
        qty: transferQty,
        source: transferSource,
        dest: transferDest
      },
      ...transferLogs
    ]);

    alert(`Inter-godown transfer transaction order successfully recorded. Unit state updated cleanly.`);
  };

  return (
    <div className="flex-1 p-6 bg-zinc-50 flex flex-col overflow-hidden h-full">
      {/* Header bar */}
      <div className="flex items-center justify-between mb-5 flex-shrink-0">
        <div>
          <h2 className="text-base font-bold text-zinc-800">Logistics & Intelligent Stock Central</h2>
          <p className="text-xs text-zinc-500">Continuous batch compliance, physical stock matching, and warehouse transfer routers</p>
        </div>
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-zinc-400" />
          <span className="text-xs font-semibold text-zinc-500">Valuation Ledger:</span>
          <select
            value={valuationMethod}
            onChange={(e) => setValuationMethod(e.target.value as any)}
            className="text-xs font-extrabold bg-white border border-zinc-200 px-2.5 py-1.5 rounded-lg text-zinc-700 cursor-pointer"
          >
            <option value="Weighted Average">Weighted Avg Cost</option>
            <option value="FIFO">FIFO (First-In, First-Out)</option>
            <option value="LIFO">LIFO (Last-In, First-Out)</option>
          </select>
        </div>
      </div>

      {/* Primary Stats Widget */}
      <div className="grid grid-cols-4 gap-4 mb-5 flex-shrink-0">
        <div className="bg-white border border-rose-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wide">Critical Near-Expiry</p>
            <h3 className="text-xl font-bold font-mono text-rose-800 mt-1">{nearExpiryCount} items</h3>
            <span className="text-[9px] text-rose-500 font-medium">Expiring within 30-45 days</span>
          </div>
          <div className="p-3 bg-rose-50 border border-rose-200/50 rounded-xl text-rose-700">
            <ShieldAlert className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-amber-100 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wide font-medium">Total Expired Lots</p>
            <h3 className="text-xl font-bold font-mono text-amber-800 mt-1">{expiredCount} lots</h3>
            <span className="text-[9px] text-amber-500 font-semibold uppercase">Restricted (Lockbox Vault)</span>
          </div>
          <div className="p-3 bg-amber-50 border border-amber-200/50 rounded-xl text-amber-700">
            <Package className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200/60 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Dead Stock (Active)</p>
            <h3 className="text-xl font-bold font-mono text-zinc-700 mt-1">₹45,200.00</h3>
            <span className="text-[9px] text-zinc-400 block mt-0.5">Zero turnover over 180 days</span>
          </div>
          <div className="p-3 bg-zinc-50 border border-zinc-200/60 rounded-xl text-zinc-500">
            <TrendingDown className="h-5 w-5" />
          </div>
        </div>

        <div className="bg-white border border-zinc-200/60 rounded-2xl p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-[10px] font-bold text-sky-500 uppercase tracking-wide">Inter-Godown Synced</p>
            <h3 className="text-xl font-bold font-mono text-sky-800 mt-1">99.8%</h3>
            <span className="text-[9px] text-sky-600 font-medium block">All central nodes online</span>
          </div>
          <div className="p-3 bg-sky-50 border border-sky-100 rounded-xl text-sky-700">
            <ArrowLeftRight className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-zinc-200 mb-4 bg-white p-1 rounded-xl border flex-shrink-0">
        <button
          onClick={() => setActiveTab('alerts')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'alerts' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Expiry Warnings Ledger & Batch Lots
        </button>
        <button
          onClick={() => setActiveTab('adjust')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'adjust' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Physical Audit & Stock Adjustments
        </button>
        <button
          onClick={() => setActiveTab('transfer')}
          className={`flex-1 py-2 text-xs font-semibold rounded-lg transition ${
            activeTab === 'transfer' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-600 hover:text-zinc-900'
          }`}
        >
          Inter-Warehouse Godown Transfers (IBT)
        </button>
      </div>

      {/* Workspace Display Area */}
      <div className="flex-1 overflow-hidden flex bg-white border border-zinc-200 rounded-2xl shadow-sm">
        {activeTab === 'alerts' && (
          <div className="flex-1 flex flex-col overflow-hidden p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-zinc-800 uppercase tracking-wide">Live Warehouse Batch Status</h3>
              <button
                onClick={() => {
                  const csvContent = "data:text/csv;charset=utf-8,ID,Product,Batch Number,Expiry Date,Remaining StockQty\n" +
                    batches.map(b => `${b.id},${mockProducts.find(p => p.id === b.productId)?.name || b.productId},${b.batchNumber},${b.expiryDate},${b.stockQty}`).join("\n");
                  const link = document.createElement('a');
                  link.href = encodeURI(csvContent);
                  link.download = `inventory_expiry_ledger.csv`;
                  link.click();
                }}
                className="flex items-center gap-1 text-[11px] bg-zinc-100 hover:bg-zinc-200 text-zinc-600 px-2.5 py-1 rounded-lg font-mono font-bold transition"
              >
                <Download className="h-3.5 w-3.5" /> EXPORT EXCEL LOG
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto pr-1">
              <table className="w-full text-zinc-700 text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-100 text-zinc-500 font-bold uppercase tracking-wider text-[10px] border-b border-zinc-200">
                    <th className="py-2.5 px-4 rounded-tl-xl">Product / Salt</th>
                    <th className="py-2.5 px-4 text-center">Batch Number</th>
                    <th className="py-2.5 px-4 text-center">Manufacturing</th>
                    <th className="py-2.5 px-4 text-center">Expiry Limit</th>
                    <th className="py-2.5 px-4 text-center">Stock Level</th>
                    <th className="py-2.5 px-4 text-center rounded-tr-xl">Status Indicator</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-medium">
                  {batches.map((b) => {
                    const prod = mockProducts.find(p => p.id === b.productId);
                    const expiryTime = new Date(b.expiryDate).getTime();
                    const nowTime = new Date('2026-06-02').getTime();
                    const isExpired = expiryTime <= nowTime;
                    const isNear = !isExpired && (expiryTime - nowTime) < (45 * 24 * 60 * 60 * 1000);

                    return (
                      <tr key={b.id} className="hover:bg-zinc-50/50">
                        <td className="py-3 px-4 font-semibold text-zinc-900 border-none">
                          <p>{prod?.name || 'Unknown item'}</p>
                          <span className="text-[10px] text-zinc-400 font-medium">{prod?.salt}</span>
                        </td>
                        <td className="py-3 px-4 text-center font-mono font-bold">{b.batchNumber}</td>
                        <td className="py-3 px-4 text-center text-zinc-400">{b.manufacturingDate}</td>
                        <td className="py-3 px-4 text-center font-bold font-mono text-zinc-800">{b.expiryDate}</td>
                        <td className="py-3 px-4 text-center font-mono font-bold">{b.stockQty} packs</td>
                        <td className="py-3 px-4 text-center border-none">
                          {isExpired ? (
                            <span className="px-2.5 py-1 text-[10px] font-bold bg-rose-50 border border-rose-200 text-rose-700 uppercase tracking-wide rounded-full">
                              ❌ EXPIRED LOT
                            </span>
                          ) : isNear ? (
                            <span className="px-2.5 py-1 text-[10px] font-bold bg-amber-50 border border-amber-200 text-amber-700 uppercase tracking-wide rounded-full animate-pulse">
                              ⚠️ NEAR EXPIRY
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 border border-emerald-200 text-emerald-700 uppercase tracking-wide rounded-full">
                              ✅ AUDIT PASSED
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Adjustments */}
        {activeTab === 'adjust' && (
          <div className="flex-1 grid grid-cols-3 overflow-hidden">
            {/* Audit Adjustment Form */}
            <div className="col-span-1 p-5 border-r border-zinc-200 bg-zinc-50/40 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-800 mb-2">
                  <ClipboardCheck className="h-5 w-5 text-sky-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wide">Adjustment Form</h3>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Select Target Drug</label>
                  <select
                    value={selectedProductAdjust}
                    onChange={(e) => setSelectedProductAdjust(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 font-medium"
                  >
                    {mockProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name} ({p.salt})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Audit Operation Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setAdjustType('Add')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                        adjustType === 'Add' ? 'bg-zinc-800 text-white border-transparent' : 'bg-white text-zinc-650 border-zinc-200'
                      }`}
                    >
                      (+) RECEIVE STOCK
                    </button>
                    <button
                      onClick={() => setAdjustType('Subtract')}
                      className={`py-1.5 text-xs font-bold rounded-lg border transition ${
                        adjustType === 'Subtract' ? 'bg-zinc-800 text-white border-transparent' : 'bg-white text-zinc-650 border-zinc-200'
                      }`}
                    >
                      (-) SHRINK / DAMAGE
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Reconciliation Quantity</label>
                  <input
                    type="number"
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(Math.max(0, parseInt(e.target.value) || 0))}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 text-zinc-900 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Auditor Remarks / Reason</label>
                  <textarea
                    rows={3}
                    placeholder="Physical audit count reconciliation, dry storage loss damage..."
                    value={adjustRemarks}
                    onChange={(e) => setAdjustRemarks(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg focus:outline-none focus:ring-1 text-zinc-900"
                  />
                </div>
              </div>

              <button
                onClick={handleAdjustStock}
                className="w-full py-2.5 text-xs font-bold bg-zinc-900 border border-transparent hover:bg-black text-white rounded-xl transition"
              >
                COMMIT AUDIT ADJUSTMENT
              </button>
            </div>

            {/* Current Session Changes Audit Log */}
            <div className="col-span-2 p-5 flex flex-col overflow-hidden">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide mb-3">Auditor Reconciliation Rules (Weighted Average)</h3>
              <div className="flex-1 bg-zinc-50 border border-dashed border-zinc-200 rounded-xl p-4 flex flex-col justify-between overflow-y-auto">
                <div className="space-y-4 text-xs text-zinc-600 leading-relaxed">
                  <p>
                    <span className="font-bold text-zinc-800 uppercase block mb-1">RULE 01: Audit Sign-Off</span>
                    All physical stock audits require secondary login confirmation when logged under non-'Auditor' categories. All reductions ('Subtract') trigger immediate system warnings to central loss prevention.
                  </p>
                  <p>
                    <span className="font-bold text-zinc-800 uppercase block mb-1">RULE 02: Valuation Cost Locking</span>
                    Adjustments committed under <strong>{valuationMethod}</strong> automatically recalibrate the general ledger accounts (Asset Group) mapping cost variances directly against CoGS pool accounts.
                  </p>
                  <p>
                    <span className="font-bold text-zinc-800 uppercase block mb-1">RULE 03: FIFO Expiry Integrity</span>
                    The system prioritizes dispensing unexpired batch parcels according to earliest-lot FIFO limits. Manual adjustments do not override expiration lock locks.
                  </p>
                </div>
                <div className="border-t border-zinc-200/60 pt-4 mt-4 flex items-center justify-between text-zinc-400 text-[10px] font-mono">
                  <span>LAST RECONCILIATION RUN: TODAY 03:22 UTC</span>
                  <span>IP AUTH: SECURE VALIDATED</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Transfers */}
        {activeTab === 'transfer' && (
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Form */}
            <div className="col-span-5 p-5 border-r border-zinc-200 bg-zinc-50/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-zinc-800 mb-2">
                  <ArrowLeftRight className="h-5 w-5 text-sky-500" />
                  <h3 className="text-xs font-bold uppercase tracking-wide">IBT Dispatch</h3>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Select Transfer Drug</label>
                  <select
                    value={transferProduct}
                    onChange={(e) => setTransferProduct(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg font-medium"
                  >
                    {mockProducts.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Source Node</label>
                  <select
                    value={transferSource}
                    onChange={(e) => setTransferSource(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-650"
                  >
                    <option value="Main Branch (Retail POS)">Main Branch (Retail POS)</option>
                    <option value="Noida Godown (SCM Central)">Noida Godown (SCM Central)</option>
                    <option value="Sub-Station 3 (Downtown Retail)">Sub-Station 3 (Downtown Retail)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Destination Node</label>
                  <select
                    value={transferDest}
                    onChange={(e) => setTransferDest(e.target.value)}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-650"
                  >
                    <option value="Noida Godown (SCM Central)">Noida Godown (SCM Central)</option>
                    <option value="Sub-Station 3 (Downtown Retail)">Sub-Station 3 (Downtown Retail)</option>
                    <option value="Main Branch (Retail POS)">Main Branch (Retail POS)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">Transfer Volume (Packs)</label>
                  <input
                    type="number"
                    value={transferQty}
                    onChange={(e) => setTransferQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg font-mono font-bold text-zinc-900"
                  />
                </div>
              </div>

              <button
                onClick={handleTransfer}
                className="w-full py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-700 text-white rounded-xl transition"
              >
                DISPATCH INTER-GODOWN TRANSFER
              </button>
            </div>

            {/* Current Transfer Logs */}
            <div className="col-span-7 p-5 flex flex-col overflow-hidden">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wide mb-3">Active IBT Transfers In Transmit</h3>
              <div className="flex-1 overflow-y-auto space-y-3">
                {transferLogs.map((log, idx) => (
                  <div key={idx} className="p-3.5 border border-zinc-200 rounded-xl relative hover:border-zinc-300 transition">
                    <span className="absolute top-3.5 right-3.5 text-[10px] font-mono text-zinc-400 uppercase font-extrabold bg-zinc-50 border border-zinc-200 px-2 py-0.5 rounded-full">
                      In-Transit (A4 GatePass)
                    </span>
                    <h4 className="text-xs font-bold text-zinc-800">{log.drugName}</h4>
                    <p className="text-[10px] text-zinc-500 mt-1 font-mono">Qty Volume: {log.qty} packs | Sent: {log.date}</p>
                    <div className="mt-2 text-[10px] flex gap-3 text-zinc-650 border-t border-dashed border-zinc-100 pt-2.5">
                      <span>Source: <strong className="text-zinc-800">{log.source.split(' (')[0]}</strong></span>
                      <span>➔ Destination: <strong className="text-zinc-800">{log.dest.split(' (')[0]}</strong></span>
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
