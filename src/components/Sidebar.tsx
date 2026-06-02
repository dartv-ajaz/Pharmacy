import React from 'react';
import {
  Layers, Building, ShieldAlert, Terminal, BookOpen, ShoppingBag,
  RefreshCw, Package, Sparkles, ClipboardCheck, FileText, ShoppingCart,
  Landmark, Briefcase, Users, BarChart3, Barcode, ShieldCheck, Percent
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  allowedModules: string[];
}

export default function Sidebar({ activeTab, setActiveTab, allowedModules }: SidebarProps) {
  // Group modules logically matching the 18 user requested pharmacy ERP menus
  const categories = [
    {
      title: 'Sales & Front Office',
      activeGradient: 'bg-gradient-to-r from-rose-500 to-pink-600 shadow-md shadow-rose-900/40 border border-rose-400/20',
      modules: [
        { id: 'dashboard', name: 'Dashboard', icon: Layers, desc: 'Central workspace & PharmaSync pulse' },
        { id: 'pos-billing', name: 'POS Billing', icon: ShoppingBag, desc: 'Thermal POS & fast barcode billing' },
        { id: 'offers-schemes', name: 'Offers & Schemes', icon: Percent, desc: 'Manage discount matrices, volume schemes & cashback' }
      ]
    },
    {
      title: 'Inventory & Catalogue',
      activeGradient: 'bg-gradient-to-r from-amber-500 to-orange-650 shadow-md shadow-amber-900/40 border border-amber-400/20',
      modules: [
        { id: 'master-register', name: 'Master Register', icon: Building, desc: 'Products, suppliers & doctor lists' },
        { id: 'narcotics-register', name: 'Narcotics Register', icon: ShieldAlert, desc: 'Schedule H1 & Narcotics licenses check' },
        { id: 'inventory-master', name: 'Inventory Master', icon: Package, desc: 'Real count, transfer logs & bin locations' },
        { id: 'returns-expiry', name: 'Returns & Expiry', icon: RefreshCw, desc: 'Batch near expiry & distributor returns' }
      ]
    },
    {
      title: 'Inbound SCM & AI OCR',
      activeGradient: 'bg-gradient-to-r from-violet-500 to-indigo-600 shadow-md shadow-indigo-900/40 border border-indigo-400/20',
      modules: [
        { id: 'purchase-entry', name: 'Purchase Entry', icon: ClipboardCheck, desc: 'Purchase bills invoice verification' },
        { id: 'ocr-magic', name: 'OCR Magic Import', icon: FileText, desc: 'Scan bills & prescriptions with Gemini' },
        { id: 'purchase-orders', name: 'Purchase Orders', icon: ShoppingCart, desc: 'Indent reorder sheets & vendor requests' }
      ]
    },
    {
      title: 'Ledgers & Khatabook',
      activeGradient: 'bg-gradient-to-r from-teal-500 to-emerald-600 shadow-md shadow-teal-900/40 border border-teal-400/20',
      modules: [
        { id: 'accounts-finance', name: 'Accounts & Finance', icon: BookOpen, desc: 'Double entry accounting, vouchers, PL' },
        { id: 'dealer-ledger', name: 'Dealer Ledger', icon: Landmark, desc: 'Settlements & vendor payments center' },
        { id: 'khatabook-ledger', name: 'Khatabook Ledger', icon: Briefcase, desc: 'Patient Udhaar loops & outstanding records' }
      ]
    },
    {
      title: 'CRM, Taxes & Audits',
      activeGradient: 'bg-gradient-to-r from-pink-500 to-fuchsia-600 shadow-md shadow-fuchsia-900/40 border border-fuchsia-400/20',
      modules: [
        { id: 'suppliers-customers', name: 'Suppliers & Customers', icon: Users, desc: 'Suppliers & Customers CRM contact master' },
        { id: 'sales-analytics', name: 'Sales Analytics', icon: BarChart3, desc: 'Live D3 KPIs, gross margins, analytics' },
        { id: 'gst-reports', name: 'GST Reports', icon: Barcode, desc: 'Ready GSTR1, GSTR3B & tax registers' },
        { id: 'download-reports', name: 'Download Reports', icon: ShieldCheck, desc: 'High-speed CSV/PDF audit trial compliance' }
      ]
    },
    {
      title: 'Advanced ERP Extensions',
      activeGradient: 'bg-gradient-to-r from-sky-500 to-blue-600 shadow-md shadow-sky-900/40 border border-sky-400/20',
      modules: [
        { id: 'pharmasync', name: 'Multi-Branch Sync', icon: RefreshCw, desc: 'Reconcile logs, resolve conflicts & transfers' },
        { id: 'marg-tools', name: 'Advanced Tools (Marg)', icon: Terminal, desc: 'Custom keyboard actions & brand margins syns' }
      ]
    }
  ];

  const getModuleIconColor = (id: string, isActive: boolean) => {
    if (isActive) return 'text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]';
    switch (id) {
      case 'dashboard': return 'text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.4)]';
      case 'pos-billing': return 'text-rose-450 drop-shadow-[0_0_8px_rgba(244,63,94,0.4)]';
      case 'offers-schemes': return 'text-emerald-450 drop-shadow-[0_0_8px_rgba(16,185,129,0.4)]';
      case 'master-register': return 'text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]';
      case 'narcotics-register': return 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)] animate-pulse';
      case 'inventory-master': return 'text-purple-400 drop-shadow-[0_0_8px_rgba(168,85,247,0.4)]';
      case 'returns-expiry': return 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]';
      case 'purchase-entry': return 'text-cyan-405 drop-shadow-[0_0_8px_rgba(34,211,238,0.4)]';
      case 'ocr-magic': return 'text-fuchsia-400 drop-shadow-[0_0_8px_rgba(232,121,249,0.45)] animate-bounce [animation-duration:3000ms]';
      case 'purchase-orders': return 'text-violet-400 drop-shadow-[0_0_8px_rgba(139,92,246,0.4)]';
      case 'accounts-finance': return 'text-teal-400 drop-shadow-[0_0_8px_rgba(20,184,166,0.4)]';
      case 'dealer-ledger': return 'text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.4)]';
      case 'khatabook-ledger': return 'text-yellow-500 drop-shadow-[0_0_8px_rgba(234,179,8,0.4)]';
      case 'suppliers-customers': return 'text-pink-400 drop-shadow-[0_0_8px_rgba(236,72,153,0.4)]';
      case 'sales-analytics': return 'text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.4)]';
      case 'gst-reports': return 'text-rose-400 drop-shadow-[0_0_8px_rgba(251,113,133,0.4)]';
      case 'download-reports': return 'text-sky-400 drop-shadow-[0_0_8px_rgba(56,189,248,0.4)]';
      case 'pharmasync': return 'text-lime-400 drop-shadow-[0_0_8px_rgba(163,230,53,0.5)] animate-spin [animation-duration:12000ms]';
      case 'marg-tools': return 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]';
      default: return 'text-slate-400';
    }
  };

  return (
    <aside className="w-80 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 flex flex-col h-screen border-r border-slate-800/80 flex-shrink-0 shadow-2xl">
      {/* Branding Header with PharmaSync Status Indicator */}
      <div className="p-5 border-b border-slate-800/80 bg-slate-950/25 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-gradient-to-tr from-sky-400 via-indigo-500 to-pink-500 rounded-xl text-white shadow-lg shadow-indigo-500/20 animate-pulse">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-wider leading-none bg-gradient-to-r from-amber-400 via-rose-450 to-sky-400 bg-clip-text text-transparent">
              APOTHECARY
            </h1>
            <span className="text-[9px] uppercase font-extrabold tracking-widest text-sky-450 block mt-1.5 font-mono">
              PharmaSync ERP Node
            </span>
          </div>
        </div>
      </div>

      {/* Categories Scroller */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-slate-800">
        {categories.map((cat, idx) => {
          // Check if any module in this category is allowed under current role
          const visibleModules = cat.modules.filter(m => allowedModules.includes(m.id));
          if (visibleModules.length === 0) return null;

          return (
            <div key={idx} className="space-y-1.5">
              <h3 className="text-[10px] font-bold tracking-widest text-slate-500 uppercase px-3 flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  idx === 0 ? 'bg-rose-500' :
                  idx === 1 ? 'bg-amber-500' :
                  idx === 2 ? 'bg-violet-500' :
                  idx === 3 ? 'bg-teal-500' :
                  idx === 4 ? 'bg-pink-500' : 'bg-sky-500'
                }`} />
                {cat.title}
              </h3>
              <div className="space-y-0.5">
                {visibleModules.map((module) => {
                  const Icon = module.icon;
                  const isActive = activeTab === module.id;
                  return (
                    <button
                      key={module.id}
                      id={`nav-${module.id}`}
                      onClick={() => setActiveTab(module.id)}
                      className={`w-full flex items-start gap-3 px-3.5 py-3 rounded-xl text-left transition-all duration-150 ${
                        isActive
                          ? `${cat.activeGradient} text-white font-extrabold scale-[1.02]`
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100 hover:scale-[1.01]'
                      }`}
                    >
                      <Icon className={`h-5 w-5 mt-0.5 flex-shrink-0 transition-transform ${
                        isActive ? 'scale-110' : 'hover:scale-105'
                      } ${getModuleIconColor(module.id, isActive)}`} />
                      <div className="overflow-hidden">
                        <p className={`text-xs font-semibold leading-none ${isActive ? 'text-white' : 'text-slate-200'}`}>
                          {module.name}
                        </p>
                        <span className={`text-[10px] leading-tight block truncate mt-1 ${isActive ? 'text-sky-100/80' : 'text-slate-500'}`}>
                          {module.desc}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Legal / Version Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-center">
        <p className="text-[10px] text-zinc-500 font-mono tracking-wide leading-none">
          V1.26.04-ESM | Connected to Central SCM
        </p>
      </div>
    </aside>
  );
}
