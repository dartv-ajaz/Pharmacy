import React, { useState, useMemo } from 'react';
import { 
  RefreshCw, Layers, CheckCircle2, AlertTriangle, ArrowRightLeft, 
  MapPin, Clock, Search, ShieldCheck, ChevronRight, Check, X, 
  PlusCircle, Truck, Package, Database, Key, Send, FileText, BadgeInfo
} from 'lucide-react';
import { mockProducts } from '../../data/mockData';
import { Product } from '../../types';

// Concrete local interfaces for PharmaSync Module
interface BranchNode {
  id: string;
  name: string;
  location: string;
  status: 'Synchronized' | 'Sync Pending' | 'Syncing' | 'Offline';
  latency: number;
  lastSync: string;
  totalSkuStock: number;
  activeConflicts: number;
}

interface ReconciliationLog {
  id: string;
  timestamp: string;
  productName: string;
  branch: string;
  type: string;
  status: 'Auto Reconciled' | 'Manual Resolved' | 'Conflict Pending';
  resolutionDetails: string;
}

interface ActiveConflict {
  id: string;
  productName: string;
  productId: string;
  batchNumber: string;
  branchNameA: string;
  valueA: number;
  branchNameB: string;
  valueB: number;
  reconciliationField: string;
  status: 'Unresolved' | 'Resolved';
  selectedTruth?: string;
  finalValue?: number;
}

interface InterBranchTransfer {
  id: string;
  productName: string;
  productId: string;
  fromBranch: string;
  toBranch: string;
  qty: number;
  batchNumber: string;
  status: 'Pending Dispatch' | 'In Transit' | 'Received' | 'Cancelled';
  date: string;
  transitRefNo: string;
}

export default function PharmaSyncModule() {
  // --- IN-MEMORY REAL-TIME STATE STORES ---
  const [branches, setBranches] = useState<BranchNode[]>([
    { id: 'BR-01', name: 'Noida Godown (SCM Central)', location: 'Industrial Area Phase 2, Noida', status: 'Synchronized', latency: 12, lastSync: '15:45:10', totalSkuStock: 12540, activeConflicts: 0 },
    { id: 'BR-02', name: 'Main Branch (Retail POS)', location: 'Sector 18 Market, Noida', status: 'Synchronized', latency: 8, lastSync: '16:08:22', totalSkuStock: 4890, activeConflicts: 1 },
    { id: 'BR-03', name: 'Warehouse 4 (Central Bulk)', location: 'Okhla Phase III, New Delhi', status: 'Sync Pending', latency: 24, lastSync: '14:22:15', totalSkuStock: 35600, activeConflicts: 1 },
    { id: 'BR-04', name: 'Gwalior Franchise Hub', location: 'Naya Bazar, Gwalior', status: 'Synchronized', latency: 42, lastSync: '15:10:05', totalSkuStock: 2855, activeConflicts: 1 },
    { id: 'BR-05', name: 'Patna Local Sub-branch', location: 'Boring Road, Patna', status: 'Offline', latency: 0, lastSync: 'Yesterday 18:30', totalSkuStock: 1940, activeConflicts: 0 }
  ]);

  const [conflicts, setConflicts] = useState<ActiveConflict[]>([
    { 
      id: 'CONF-101', 
      productName: 'Calpol 650mg', 
      productId: 'P001', 
      batchNumber: 'CALP-Y304', 
      branchNameA: 'Noida Godown (SCM Central)', 
      valueA: 450, 
      branchNameB: 'Main Branch (Retail POS)', 
      valueB: 420, 
      reconciliationField: 'Batch Quantity Mismatch', 
      status: 'Unresolved' 
    },
    { 
      id: 'CONF-102', 
      productName: 'Glycomet GP2', 
      productId: 'P002', 
      batchNumber: 'GLYC-6629', 
      branchNameA: 'Warehouse 4 (Central Bulk)', 
      valueA: 320, 
      branchNameB: 'Gwalior Franchise Hub', 
      valueB: 350, 
      reconciliationField: 'Billed Delivery Stock Sync Hazard', 
      status: 'Unresolved' 
    },
    { 
      id: 'CONF-103', 
      productName: 'Alprax 0.5mg', 
      productId: 'P003', 
      batchNumber: 'ALPR-9102', 
      branchNameA: 'Main Branch (Retail POS)', 
      valueA: 85, 
      branchNameB: 'Warehouse 4 (Central Bulk)', 
      valueB: 65, 
      reconciliationField: 'Narcotic Safe Double-Count Error', 
      status: 'Unresolved' 
    }
  ]);

  const [transfers, setTransfers] = useState<InterBranchTransfer[]>([
    { id: 'TRF-9021', productName: 'Allegra 120mg', productId: 'P007', fromBranch: 'Warehouse 4 (Central Bulk)', toBranch: 'Main Branch (Retail POS)', qty: 150, batchNumber: 'ALL-F329', status: 'In Transit', date: '2026-06-02', transitRefNo: 'GDS-TRK-7741' },
    { id: 'TRF-9022', productName: 'Lipitor 10mg', productId: 'P005', fromBranch: 'Noida Godown (SCM Central)', toBranch: 'Gwalior Franchise Hub', qty: 200, batchNumber: 'LIP-8472', status: 'Pending Dispatch', date: '2026-06-02', transitRefNo: 'GDS-TRK-8902' },
    { id: 'TRF-9020', productName: 'Pantocid 40mg', productId: 'P008', fromBranch: 'Noida Godown (SCM Central)', toBranch: 'Main Branch (Retail POS)', qty: 300, batchNumber: 'PAN-8802', status: 'Received', date: '2026-06-01', transitRefNo: 'GDS-TRK-1111' }
  ]);

  const [reconciliationLogs, setReconciliationLogs] = useState<ReconciliationLog[]>([
    { id: 'REC-501', timestamp: '2026-06-02 15:45:12', productName: 'Pantocid 40mg', branch: 'Main Branch (Retail POS)', type: 'Batch Index Offset', status: 'Auto Reconciled', resolutionDetails: 'Fitted latest transaction stamp delta (+45 units).' },
    { id: 'REC-502', timestamp: '2026-06-02 11:24:05', productName: 'Amoxil 500mg', branch: 'Gwalior Franchise Hub', type: 'Negative Inventory Prevention', status: 'Auto Reconciled', resolutionDetails: 'Capped stock floor value to 0 due to refund override.' },
    { id: 'REC-503', timestamp: '2026-06-02 09:12:44', productName: 'Gardenal 30mg', branch: 'Warehouse 4 (Central Bulk)', type: 'Double Entry Verification', status: 'Manual Resolved', resolutionDetails: 'Super Admin picked Local Audit Branch count.' }
  ]);

  // View States
  const [syncFilter, setSyncFilter] = useState<string>('');
  const [activeTransferTab, setActiveTransferTab] = useState<'all' | 'pending' | 'transit' | 'received'>('all');
  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [globalStatusMsg, setGlobalStatusMsg] = useState('All synchronization pipelines are listening.');

  // Create Transfer State Form
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  const [newTrfProductId, setNewTrfProductId] = useState(mockProducts[0]?.id || '');
  const [newTrfFrom, setNewTrfFrom] = useState('Noida Godown (SCM Central)');
  const [newTrfTo, setNewTrfTo] = useState('Main Branch (Retail POS)');
  const [newTrfQty, setNewTrfQty] = useState<number>(50);

  // Manual Resolved Custom Input state
  const [customResolutions, setCustomResolutions] = useState<Record<string, number>>({});

  // --- HANDLERS & ACTORS ---

  // 1. Force full fleet synchronization routine
  const handleForceBulkSync = () => {
    setIsSyncingAll(true);
    setGlobalStatusMsg('Executing physical handshake protocol across 5 connected SCM points...');
    
    // Simulate staggered progression for each branch status
    setBranches(prev => prev.map(b => b.status === 'Offline' ? b : { ...b, status: 'Syncing' }));

    setTimeout(() => {
      setBranches(prev => prev.map(b => {
        if (b.id === 'BR-03') return { ...b, status: 'Synchronized', lastSync: new Date().toLocaleTimeString(), totalSkuStock: b.totalSkuStock + 100 };
        if (b.id === 'BR-01' || b.id === 'BR-02' || b.id === 'BR-04') return { ...b, status: 'Synchronized', lastSync: new Date().toLocaleTimeString() };
        return b; // Keep Patna offline
      }));
      setGlobalStatusMsg('XML Ledger delta reconciled. Noida godown and Bulks are 100% in alignment.');
      setIsSyncingAll(false);

      // Add a log
      const newLog: ReconciliationLog = {
        id: `REC-${Math.floor(Math.random() * 900) + 600}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        productName: 'Fleet Interlock Root',
        branch: 'SCM Central (Noida)',
        type: 'Total Fleet Restructural Re-Sync',
        status: 'Auto Reconciled',
        resolutionDetails: 'Forced SHA-256 handshake. Broad-spectrum indexes successfully aligned.'
      };
      setReconciliationLogs(prev => [newLog, ...prev]);
    }, 2000);
  };

  // 2. Resolve conflict with logic
  const handleResolveConflict = (conflictId: string, selection: 'branchA' | 'branchB' | 'sum' | 'custom') => {
    const conflict = conflicts.find(c => c.id === conflictId);
    if (!conflict) return;

    let finalValue = 0;
    let truthSource = '';

    if (selection === 'branchA') {
      finalValue = conflict.valueA;
      truthSource = conflict.branchNameA;
    } else if (selection === 'branchB') {
      finalValue = conflict.valueB;
      truthSource = conflict.branchNameB;
    } else if (selection === 'sum') {
      finalValue = conflict.valueA + conflict.valueB;
      truthSource = 'Sum of Branches';
    } else {
      finalValue = customResolutions[conflictId] || 0;
      truthSource = 'Custom Admin Entry';
    }

    // Resolve conflict state
    setConflicts(prev => prev.map(c => {
      if (c.id === conflictId) {
        return { ...c, status: 'Resolved', selectedTruth: truthSource, finalValue };
      }
      return c;
    }));

    // Register into SCM Reconciliation Log
    const newLog: ReconciliationLog = {
      id: `REC-${Math.floor(Math.random() * 900) + 600}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      productName: conflict.productName,
      branch: conflict.branchNameA,
      type: 'Conflict Resolved Manually',
      status: 'Manual Resolved',
      resolutionDetails: `Approved source [${truthSource}], stabilizing stock metrics to ${finalValue} units.`
    };
    setReconciliationLogs(prev => [newLog, ...prev]);

    // Update branch counters
    setBranches(prev => prev.map(b => {
      if (b.name === conflict.branchNameA || b.name === conflict.branchNameB) {
        return { ...b, activeConflicts: Math.max(0, b.activeConflicts - 1) };
      }
      return b;
    }));
  };

  // 3. Dispatch Transit
  const handleDispatchTransfer = (transferId: string) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) {
        return { ...t, status: 'In Transit' };
      }
      return t;
    }));
  };

  // 4. Complete Interbranch Delivery
  const handleAcknowledgeDelivery = (transferId: string) => {
    setTransfers(prev => prev.map(t => {
      if (t.id === transferId) {
        return { ...t, status: 'Received' };
      }
      return t;
    }));

    const trf = transfers.find(t => t.id === transferId);
    if (!trf) return;

    // Log the transaction
    const newLog: ReconciliationLog = {
      id: `REC-${Math.floor(Math.random() * 900) + 600}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      productName: trf.productName,
      branch: trf.toBranch,
      type: 'Interbranch Transfer Completed',
      status: 'Manual Resolved',
      resolutionDetails: `Credit delivery of ${trf.qty} units batch ${trf.batchNumber} into receiving bay.`
    };
    setReconciliationLogs(prev => [newLog, ...prev]);
  };

  // 5. Submit New Transfer
  const handleCreateNewTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    const product = mockProducts.find(p => p.id === newTrfProductId);
    if (!product) return;

    const newTrf: InterBranchTransfer = {
      id: `TRF-${Math.floor(Math.random() * 9000) + 1000}`,
      productName: product.name,
      productId: newTrfProductId,
      fromBranch: newTrfFrom,
      toBranch: newTrfTo,
      qty: newTrfQty,
      batchNumber: `BAT-${Math.floor(Math.random() * 900) + 100}`,
      status: 'Pending Dispatch',
      date: new Date().toISOString().split('T')[0],
      transitRefNo: `GDS-TRK-${Math.floor(Math.random() * 9000) + 1000}`
    };

    setTransfers(prev => [newTrf, ...prev]);
    setShowNewTransferModal(false);
  };

  // --- FILTERS & SELECTORS ---
  const filteredLogs = useMemo(() => {
    if (!syncFilter) return reconciliationLogs;
    return reconciliationLogs.filter(log => 
      log.productName.toLowerCase().includes(syncFilter.toLowerCase()) ||
      log.branch.toLowerCase().includes(syncFilter.toLowerCase()) ||
      log.type.toLowerCase().includes(syncFilter.toLowerCase())
    );
  }, [reconciliationLogs, syncFilter]);

  const filteredTransfers = useMemo(() => {
    if (activeTransferTab === 'all') return transfers;
    if (activeTransferTab === 'pending') return transfers.filter(t => t.status === 'Pending Dispatch');
    if (activeTransferTab === 'transit') return transfers.filter(t => t.status === 'In Transit');
    return transfers.filter(t => t.status === 'Received');
  }, [transfers, activeTransferTab]);

  return (
    <div className="flex-grow p-6 bg-zinc-50 flex flex-col overflow-y-auto h-full space-y-6">
      
      {/* HEADER BANNER */}
      <div className="flex-shrink-0 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-zinc-200 pb-4 gap-4">
        <div>
          <span className="text-[10px] font-bold text-zinc-400 font-mono tracking-widest block">
            MODULE 19: MULTI-STORE ORCHESTRATION
          </span>
          <h2 className="text-base font-extrabold text-zinc-900 flex items-center gap-2 mt-0.5">
            <RefreshCw className="h-4.5 w-4.5 text-indigo-500 animate-spin" />
            PharmaSync Multi-Branch Ledger Sync Control
          </h2>
        </div>

        {/* Global synchronization driver button */}
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-semibold text-zinc-500">{globalStatusMsg}</span>
          <button 
            disabled={isSyncingAll}
            onClick={handleForceBulkSync}
            className={`px-4 py-2 text-xs font-black rounded-lg transition-all flex items-center gap-2 ${
              isSyncingAll 
                ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' 
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/10 hover:scale-[1.01] active:scale-98'
            }`}
          >
            <RefreshCw className={`h-3 w-3 ${isSyncingAll ? 'animate-spin' : ''}`} />
            {isSyncingAll ? 'Connecting Fleet...' : 'Sync Fleet Index'}
          </button>
        </div>
      </div>

      {/* MATRIX LAYOUT GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* COLUMN 1: FLEET ACTIVE CONNECTIVITY MATRIX */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
            <div className="flex items-center gap-1.5">
              <Database className="h-4.5 w-4.5 text-indigo-500" />
              <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                Connected Fleet Synced Nodes
              </h3>
            </div>
            <span className="text-[9px] bg-emerald-50 text-emerald-700 font-black px-1.5 rounded uppercase">
              {branches.filter(b => b.status === 'Synchronized').length}/5 Synced
            </span>
          </div>

          <p className="text-[11px] text-zinc-400">
            Real-time latency check for individual sub-store terminals communicating with Central SCM Noida godown.
          </p>

          <div className="space-y-3.5">
            {branches.map((b, idx) => (
              <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200/80 rounded-xl space-y-2 hover:border-zinc-300 transition duration-150">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-extrabold text-xs text-zinc-800">{b.name}</h4>
                    <span className="text-[9px] text-zinc-400 flex items-center gap-0.5 mt-0.5">
                      <MapPin className="h-2.5 w-2.5" /> {b.location}
                    </span>
                  </div>
                  <div>
                    {b.status === 'Synchronized' && (
                      <span className="bg-emerald-50 text-emerald-700 font-bold border border-emerald-200 text-[8px] px-2 py-0.5 rounded-full font-mono uppercase">
                        Synced
                      </span>
                    )}
                    {b.status === 'Syncing' && (
                      <span className="bg-sky-50 text-sky-700 font-bold border border-sky-200 text-[8px] px-2 py-0.5 rounded-full font-mono uppercase animate-pulse">
                        Connecting
                      </span>
                    )}
                    {b.status === 'Sync Pending' && (
                      <span className="bg-amber-105 text-amber-800 bg-amber-50 border border-amber-200 text-[8px] px-2 py-0.5 rounded-full font-mono uppercase">
                        Pending Delta
                      </span>
                    )}
                    {b.status === 'Offline' && (
                      <span className="bg-rose-50 text-rose-800 border border-rose-200 text-[8px] px-2 py-0.5 rounded-full font-mono uppercase">
                        Offline
                      </span>
                    )}
                  </div>
                </div>

                {/* mini gauge showing database size / latent ping */}
                <div className="flex justify-between items-center text-[9px] text-zinc-500 pt-1 border-t border-zinc-100">
                  <span className="font-mono">Lat: {b.latency > 0 ? `${b.latency}ms` : 'Timeout'}</span>
                  <span className="font-mono">Last Handshake: {b.lastSync}</span>
                  <span className="font-bold text-indigo-700 font-mono">Qty: {b.totalSkuStock.toLocaleString()}</span>
                </div>

                {b.activeConflicts > 0 && (
                  <div className="p-1 px-2 bg-rose-50 text-rose-850 rounded border border-rose-100 text-[9px] font-bold flex items-center gap-1.5 animate-pulse mt-1">
                    <AlertTriangle className="h-3 w-3 text-rose-500 shrink-0" />
                    Pending Conflict Block Resolved Necessary
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* COLUMN 2: INTERACTIVE CONFLICT RESOLUTION */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4 xl:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div className="flex items-center gap-1.5">
                <AlertTriangle className="h-4.5 w-4.5 text-rose-500 animate-bounce" />
                <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Conflict Resolution Control Panel
                </h3>
              </div>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded-full font-mono">
                {conflicts.filter(c => c.status === 'Unresolved').length} Unsolved Hazards
              </span>
            </div>

            <p className="text-[11px] text-zinc-400 mt-2">
              System flags when duplicate edits or offline entries conflict on Noida Central SCM. Select source of truth or enter manual audited totals below.
            </p>

            {/* List of active mismatches */}
            <div className="space-y-4 mt-4">
              {conflicts.map((c, idx) => (
                <div key={idx} className={`p-4 border rounded-xl space-y-4 relative overflow-hidden transition ${
                  c.status === 'Resolved' 
                    ? 'border-emerald-200 bg-emerald-500/5 hover:border-emerald-300' 
                    : 'border-rose-100 bg-zinc-55 hover:border-rose-300'
                }`}>
                  
                  {/* Title details */}
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-extrabold text-zinc-800 font-mono">{c.productName}</h4>
                        <span className="bg-zinc-200 text-zinc-700 text-[8px] font-bold px-1.5 rounded uppercase font-mono">
                          Batch: {c.batchNumber}
                        </span>
                        <span className="bg-rose-100 text-rose-700 font-bold text-[8px] px-1 rounded uppercase font-mono scale-95">
                          {c.reconciliationField}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-400 mt-1">Incident Token: {c.id}</p>
                    </div>

                    <div>
                      {c.status === 'Resolved' ? (
                        <span className="bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold text-[9px] px-2 py-0.5 rounded flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> Resolved
                        </span>
                      ) : (
                        <span className="bg-rose-50 border border-rose-200 text-rose-800 font-bold text-[9px] px-2 py-0.5 rounded uppercase font-mono">
                          Suspended Sync
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Dual comparison pillars */}
                  {c.status === 'Unresolved' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Branch A */}
                      <div className="p-3 bg-white rounded-lg border border-zinc-200 text-center space-y-1">
                        <span className="text-[9px] text-zinc-400 font-bold block uppercase">{c.branchNameA}</span>
                        <span className="text-base font-mono font-black text-indigo-700 block">{c.valueA} units</span>
                        <button 
                          onClick={() => handleResolveConflict(c.id, 'branchA')}
                          className="w-full py-1 text-[10px] bg-indigo-50 hover:bg-indigo-150 text-indigo-800 rounded font-bold transition"
                        >
                          Approve Noida Value
                        </button>
                      </div>

                      {/* Branch B */}
                      <div className="p-3 bg-white rounded-lg border border-zinc-200 text-center space-y-1">
                        <span className="text-[9px] text-zinc-400 font-bold block uppercase">{c.branchNameB}</span>
                        <span className="text-base font-mono font-black text-amber-700 block">{c.valueB} units</span>
                        <button 
                          onClick={() => handleResolveConflict(c.id, 'branchB')}
                          className="w-full py-1 text-[10px] bg-amber-50 hover:bg-amber-150 text-amber-800 rounded font-bold transition"
                        >
                          Approve Local Branch Value
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 bg-emerald-500/10 rounded-xl text-xs space-y-1 text-emerald-950 font-bold">
                      <p>Truth Established: [ {c.selectedTruth} ]</p>
                      <p className="font-mono text-[10px] text-emerald-700">Committed stock quantity: {c.finalValue} units. Distribution pipelines unlocked.</p>
                    </div>
                  )}

                  {/* Alternative Advanced Actions inside conflicts */}
                  {c.status === 'Unresolved' && (
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2 bg-white/70 p-2.5 rounded-lg border border-zinc-200/50">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleResolveConflict(c.id, 'sum')}
                          className="px-2.5 py-1 text-[10px] bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-mono font-bold rounded"
                        >
                          Sum Quantities ({c.valueA + c.valueB})
                        </button>
                      </div>
                      
                      <div className="flex gap-1.5">
                        <input 
                          type="number" 
                          placeholder="Verified Physical Count" 
                          value={customResolutions[c.id] || ''}
                          onChange={(e) => setCustomResolutions({ ...customResolutions, [c.id]: Number(e.target.value) })}
                          className="w-36 text-xs border border-zinc-200 rounded p-1"
                        />
                        <button 
                          onClick={() => handleResolveConflict(c.id, 'custom')}
                          className="px-2.5 py-1 text-[11px] bg-slate-900 text-white rounded hover:bg-slate-800 font-bold"
                        >
                          Enforce Custom
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>

          <p className="text-[10px] text-zinc-450 italic mt-4 bg-zinc-50 p-2 text-center rounded">
            * Resolution log ledger lines are logged with complete user compliance stamp trail matching HIPAA audit parameters.
          </p>
        </div>

      </div>

      {/* TRACKING AND TRANSFER REGISTERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* 1. STATUS TRACKING FOR BRANCH-TO-BRANCH TRANSFER */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4 lg:col-span-2 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div className="flex items-center gap-1.5">
                <Truck className="h-4.5 w-4.5 text-indigo-500" />
                <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Inter-Branch Stock Transfer Tracker
                </h3>
              </div>
              <div className="flex gap-1.5">
                {['all', 'pending', 'transit', 'received'].map((filterTab) => (
                  <button
                    key={filterTab}
                    onClick={() => setActiveTransferTab(filterTab as any)}
                    className={`px-2 py-0.5 text-[9px] font-bold rounded uppercase tracking-wider ${
                      activeTransferTab === filterTab 
                        ? 'bg-indigo-600 text-white' 
                        : 'bg-zinc-100 hover:bg-zinc-250 text-zinc-600'
                    }`}
                  >
                    {filterTab}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-zinc-400 mt-2">
              B2B logistics transfer records tracking active stock transit events between bulk godowns and franchise terminals.
            </p>

            {/* List of active transfers */}
            <div className="space-y-3 mt-4 max-h-[300px] overflow-y-auto pr-1">
              {filteredTransfers.map((t, idx) => (
                <div key={idx} className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-zinc-350 transition relative">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-zinc-100 pb-2">
                    <div>
                      <span className="text-[10px] text-zinc-450 font-bold block">Ref # {t.transitRefNo} ({t.id})</span>
                      <h4 className="font-extrabold text-xs text-zinc-800 mt-0.5">{t.productName} ({t.qty} Units)</h4>
                    </div>
                    <div>
                      {t.status === 'Pending Dispatch' && (
                        <span className="bg-indigo-50 border border-indigo-200 text-indigo-850 text-[8px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                          Pending Dispatch
                        </span>
                      )}
                      {t.status === 'In Transit' && (
                        <span className="bg-sky-50 border border-sky-200 text-sky-850 text-[8px] font-bold px-2 py-0.5 rounded font-mono uppercase animate-pulse">
                          In Transit
                        </span>
                      )}
                      {t.status === 'Received' && (
                        <span className="bg-emerald-5 border border-emerald-200 text-emerald-800 text-[8px] font-bold px-2 py-0.5 rounded font-mono uppercase">
                          Cargo Handled / Credited
                        </span>
                      )}
                    </div>
                  </div>

                  {/* visual progress bar for transfers */}
                  <div className="mt-3.5 space-y-2">
                    <div className="flex justify-between text-[9px] text-zinc-400 font-mono font-bold">
                      <span className="text-zinc-600">From: {t.fromBranch}</span>
                      <span className="text-zinc-650">To: {t.toBranch}</span>
                    </div>

                    {/* Progress slider bar representation */}
                    <div className="relative h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                      <div 
                        className={`absolute left-0 top-0 h-full transition-all duration-500 ${
                          t.status === 'Pending Dispatch' ? 'w-1/4 bg-amber-500' :
                          t.status === 'In Transit' ? 'w-2/3 bg-sky-500 animate-pulse' : 'w-full bg-emerald-500'
                        }`}
                      />
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-zinc-500 pt-1">
                      <span>Shipment Date: {t.date}</span>
                      <span className="bg-zinc-100 text-zinc-600 px-1 rounded font-mono font-bold">Batch Ref: {t.batchNumber}</span>
                    </div>
                  </div>

                  {/* interactive action buttons on tracking card */}
                  <div className="mt-3 flex justify-end gap-2 border-t border-zinc-100 pt-2.5">
                    {t.status === 'Pending Dispatch' && (
                      <button 
                        onClick={() => handleDispatchTransfer(t.id)}
                        className="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-[10px] font-black tracking-wide uppercase transition flex items-center gap-0.5"
                      >
                        <Send className="h-3 w-3" /> Dispatch Cargo
                      </button>
                    )}
                    {t.status === 'In Transit' && (
                      <button 
                        onClick={() => handleAcknowledgeDelivery(t.id)}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[10px] font-black tracking-wide uppercase transition flex items-center gap-0.5"
                      >
                        <Check className="h-3 w-3" /> Handover & Credit Stock
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 border-t border-zinc-100 pt-3 flex flex-col sm:flex-row justify-between items-center bg-zinc-50 p-2 rounded-xl">
            <span className="text-[10px] text-zinc-450 italic">Generate or route new inventory transfers on demand.</span>
            <button 
              onClick={() => setShowNewTransferModal(true)}
              className="mt-2 sm:mt-0 font-bold text-xs text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              <PlusCircle className="h-4 w-4" /> Ship Cargo Now
            </button>
          </div>
        </div>

        {/* 2. REAL-TIME RECONCILIATION DATA LOGS */}
        <div className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div className="flex items-center gap-1.5">
                <FileText className="h-4.5 w-4.5 text-zinc-500" />
                <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wider">
                  Reconciliation Sync Audit Logs
                </h3>
              </div>
            </div>

            {/* Log Search Searchbar */}
            <div className="mt-3 flex gap-2 relative">
              <Search className="h-4 w-4 text-zinc-400 absolute left-3 top-3" />
              <input 
                type="text" 
                value={syncFilter}
                onChange={(e) => setSyncFilter(e.target.value)}
                placeholder="Search drug, branch or incident type..."
                className="w-full text-xs bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 font-semibold"
              />
            </div>

            {/* List block */}
            <div className="mt-4 space-y-3.5 max-h-[300px] overflow-y-auto pr-1">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, idx) => (
                  <div key={idx} className="text-xs border-b border-zinc-100 pb-3 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start">
                      <span className="font-extrabold text-zinc-800 block text-[11px] font-mono leading-normal">
                        {log.productName}
                      </span>
                      <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded-full ${
                        log.status === 'Auto Reconciled' ? 'bg-sky-50 text-sky-800' : 'bg-emerald-50 text-emerald-850'
                      }`}>
                        {log.status}
                      </span>
                    </div>
                    <p className="text-[10px] text-zinc-450 font-mono mt-0.5">{log.type} • {log.branch}</p>
                    <p className="text-[10px] text-zinc-500 leading-normal mt-1 border-l-2 border-zinc-200 pl-2 bg-zinc-50 p-1 rounded-r">
                      {log.resolutionDetails}
                    </p>
                    <span className="text-[9px] text-zinc-400 font-mono flex items-center gap-1 mt-1">
                      <Clock className="h-3 w-3 text-zinc-300" /> {log.timestamp}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-zinc-400">
                  No log entries matched your filter.
                </div>
              )}
            </div>
          </div>

          <div className="bg-zinc-50 p-2.5 rounded-lg border text-center text-zinc-450 text-[10px]">
            * Ledger snapshot synchronized continuously with Noida headquarters.
          </div>
        </div>

      </div>

      {/* NEW TRANSFER POPUP MODAL */}
      {showNewTransferModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white border rounded-2xl w-full max-w-lg shadow-xl p-6 relative animate-fadeIn">
            <button 
              onClick={() => setShowNewTransferModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-zinc-650"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-sm font-black font-sans uppercase text-zinc-800 border-b pb-3 flex items-center gap-1.5">
              <Package className="h-5 w-5 text-indigo-500 animate-pulse" />
              Initiate Inter-Branch Transfer Order
            </h3>

            <form onSubmit={handleCreateNewTransfer} className="space-y-4 pt-4 text-xs">
              
              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-450 mb-1">Select Catalog Drug</label>
                <select 
                  value={newTrfProductId}
                  onChange={(e) => setNewTrfProductId(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 font-semibold"
                >
                  {mockProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.salt})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-450 mb-1">Dispatcher Node (From)</label>
                  <select 
                    value={newTrfFrom}
                    onChange={(e) => setNewTrfFrom(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2"
                  >
                    <option value="Noida Godown (SCM Central)">Noida Godown (SCM Central)</option>
                    <option value="Warehouse 4 (Central Bulk)">Warehouse 4 (Central Bulk)</option>
                    <option value="Main Branch (Retail POS)">Main Branch (Retail POS)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-zinc-450 mb-1">Receiving Depot (To)</label>
                  <select 
                    value={newTrfTo}
                    onChange={(e) => setNewTrfTo(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2"
                  >
                    <option value="Main Branch (Retail POS)">Main Branch (Retail POS)</option>
                    <option value="Gwalior Franchise Hub">Gwalior Franchise Hub</option>
                    <option value="Patna Local Sub-branch">Patna Local Sub-branch</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-zinc-450 mb-1">Volume to Transfer (Quantities)</label>
                <input 
                  type="number" 
                  value={newTrfQty}
                  onChange={(e) => setNewTrfQty(Number(e.target.value))}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 font-mono font-bold"
                  min={1}
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t">
                <button 
                  type="button"
                  onClick={() => setShowNewTransferModal(false)}
                  className="px-3.5 py-1.5 bg-zinc-100 hover:bg-zinc-200 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" /> Commit Order
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
