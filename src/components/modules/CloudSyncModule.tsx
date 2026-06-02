import React, { useState } from 'react';
import { 
  RefreshCw, Cloud, Database, Network, ChevronRight, Search, 
  HelpCircle, ShieldCheck, Play, Plus, Activity, Clock, CheckCircle, X 
} from 'lucide-react';

interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

export default function CloudSyncModule() {
  const [activeSubTab, setActiveSubTab] = useState<'nodes' | 'jobs'>('nodes');
  const [nodes, setNodes] = useState([
    { id: 'BR-01', name: 'Main Branch POS (HQ Delhi)', ping: '12ms', lastSync: '10 seconds ago', state: 'ONLINE', transactions: 4092 },
    { id: 'BR-02', name: 'Noida Godown & Supply Hub', ping: '18ms', lastSync: '1 minute ago', state: 'ONLINE', transactions: 1290 },
    { id: 'BR-03', name: 'Gurgaon Sec 45 Retail Branch', ping: '22ms', lastSync: '5 minutes ago', state: 'ONLINE', transactions: 840 },
    { id: 'BR-04', name: 'Sector 15 Faridabad Franchise', ping: '310ms', lastSync: 'Awaiting sync', state: 'LAGGING', transactions: 410 }
  ]);

  const [jobs, setJobs] = useState([
    { id: 'JOB-901', title: 'Compile Masters Price List Matrix', frequency: 'Hourly Synclink', state: 'Completed' },
    { id: 'JOB-900', title: 'Settle Supplier Credit Ledger books', frequency: 'Daily Midnight', state: 'Completed' },
    { id: 'JOB-899', title: 'Flush FDA Critical Narcotics Registers', frequency: 'Real-time Hook', state: 'Processing' }
  ]);

  const [isSyncingAll, setIsSyncingAll] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const addToast = (title: string, message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Math.random().toString();
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const triggerSyncAll = async () => {
    setIsSyncingAll(true);
    await new Promise(r => setTimeout(r, 1400));
    setNodes(nodes.map(n => ({
      ...n,
      lastSync: 'Just now',
      state: n.state === 'LAGGING' ? 'ONLINE' : n.state
    })));
    setIsSyncingAll(false);
    addToast(
      'Cloud Synchronization Succeeded',
      'Unified enterprise masters pricing matrices and satellite POS registers successfully updated with central depository checks.',
      'success'
    );
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto text-xs">
      {/* SCM Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Cloud className="h-4 w-4 text-emerald-500 animate-pulse" />
            Module 20: Cloud Branch Sync & Multi-Warehouse Replication
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Control corporate cloud master pricing arrays, sync inventories across multiple warehouse depots, and monitor satellite operations.</p>
        </div>

        <div className="flex gap-2 text-xs font-bold items-center">
          <button
            onClick={triggerSyncAll}
            disabled={isSyncingAll}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl flex items-center gap-1.5 transition disabled:opacity-50 select-none cursor-pointer text-[10.5px] uppercase"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isSyncingAll ? 'animate-spin' : ''}`} />
            {isSyncingAll ? 'Syncing satellites...' : 'Force Sync Nodes'}
          </button>

          <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 gap-1 text-xs font-semibold">
            <button
              onClick={() => setActiveSubTab('nodes')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeSubTab === 'nodes' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Satellite branch nodes ({nodes.length})
            </button>
            <button
              onClick={() => setActiveSubTab('jobs')}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                activeSubTab === 'jobs' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
              }`}
            >
              Master cron arrays
            </button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === 'nodes' ? (
          <div className="space-y-4">
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {nodes.map((n) => (
                <div key={n.id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm relative overflow-hidden flex flex-col justify-between h-34 text-xs font-sans">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-[9px] font-mono font-bold text-zinc-400">NODE ID: {n.id}</span>
                      <span className={`inline-block px-1.5 py-0.2 rounded text-[8px] font-mono font-black ${
                        n.state === 'ONLINE' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                      }`}>
                        {n.state}
                      </span>
                    </div>
                    <strong className="text-zinc-850 font-bold block truncate mt-1.5">{n.name}</strong>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-150/40 text-[11px] text-zinc-500 space-y-1">
                    <div className="flex justify-between">
                      <span>Sync Speed ping:</span>
                      <strong className="font-mono text-zinc-805">{n.ping}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Transactions Count:</span>
                      <strong className="font-mono text-zinc-805">{n.transactions} entries</strong>
                    </div>
                    <div className="flex justify-between pt-1 text-[10px] text-zinc-400 italic font-medium">
                      <span>Last heartbeat check:</span>
                      <span>{n.lastSync}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>
        ) : (
          /* Master cron jobs */
          <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-80s uppercase tracking-widest flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-emerald-500" /> Automated cloud pricing arrays sync procedures
            </h3>

            <div className="space-y-2.5">
              {jobs.map((j) => (
                <div key={j.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl flex items-center justify-between text-xs">
                  <div>
                    <strong className="text-zinc-800 font-bold block">{j.title}</strong>
                    <span className="text-[10px] text-zinc-400 font-mono">TASK: {j.id} | EXECUTION INTERVAL: {j.frequency}</span>
                  </div>

                  <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider ${
                    j.state === 'Completed' ? 'bg-emerald-50 text-emerald-750' : 'bg-sky-50 text-sky-700 border border-sky-100'
                  }`}>
                    {j.state}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Floating Toast Notification Centre */}
      {toasts.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full">
          {toasts.map(t => (
            <div 
              key={t.id}
              className="bg-zinc-900 border border-zinc-800 text-white shadow-2xl rounded-2xl p-4 flex gap-3.5 items-start animate-bounce-short relative overflow-hidden"
            >
              <div className="h-5 w-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4" />
              </div>
              <div className="flex-1 text-left space-y-0.5">
                <h4 className="font-extrabold text-xs text-emerald-400 tracking-wide uppercase">{t.title}</h4>
                <p className="text-[11px] text-zinc-300 leading-normal font-semibold">{t.message}</p>
                <span className="text-[8.5px] font-mono text-zinc-500 uppercase block pt-0.5">TERMINAL_REF: SCM_CLOUD_OK</span>
              </div>
              <button 
                onClick={() => removeToast(t.id)}
                className="text-zinc-500 hover:text-zinc-200 transition p-0.5 rounded-lg"
                title="Dismiss Alert"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
