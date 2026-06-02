import React, { useState } from 'react';
import { User, Landmark, Building, Calendar, Bell, Shield, Info, Key, Moon, Sun, Menu } from 'lucide-react';
import { UserRole } from '../types';

interface HeaderProps {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  branch: string;
  setBranch: (branch: string) => void;
  onMenuToggle?: () => void;
}

export default function Header({ currentRole, setCurrentRole, branch, setBranch, onMenuToggle }: HeaderProps) {
  const [company, setCompany] = useState('Apollo Pharmaceuticals Pvt Ltd');
  const [financialYear, setFinancialYear] = useState('FY 2026-27');
  const [showNotification, setShowNotification] = useState(false);
  const [showApiKeySetting, setShowApiKeySetting] = useState(false);
  const [customApiKey, setCustomApiKey] = useState(() => localStorage.getItem('gemini_api_key_override') || '');

  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pharma_dark_mode');
    if (saved === 'enabled') {
      document.documentElement.classList.add('dark');
      return true;
    }
    return false;
  });

  React.useEffect(() => {
    const saved = localStorage.getItem('pharma_dark_mode');
    if (saved === 'enabled') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const next = !prev;
      if (next) {
        localStorage.setItem('pharma_dark_mode', 'enabled');
        document.documentElement.classList.add('dark');
      } else {
        localStorage.setItem('pharma_dark_mode', 'disabled');
        document.documentElement.classList.remove('dark');
      }
      return next;
    });
  };

  const roles: UserRole[] = [
    'Super Admin',
    'Pharmacist',
    'Cashier',
    'Doctor',
    'distributor' as any, // mapping to match lowercase distributor/retailer if needed, let's keep exact string matching
    'Distributor',
    'Retailer',
    'Patient',
    'Delivery Boy',
    'Accountant',
    'Auditor'
  ];

  const branches = [
    'Main Branch (Retail POS)',
    'Noida Godown (SCM Central)',
    'Sub-Station 3 (Downtown Retail)',
    'Warehouse 4 (Central Bulk Storage)'
  ];

  return (
    <header className="h-16 bg-white border-b border-zinc-200/95 flex items-center justify-between px-4 sm:px-6 z-10 flex-shrink-0 shadow-[0_1px_5px_rgba(0,0,0,0.02)]">
      {/* Current Enterprise Node Controls */}
      <div className="flex items-center gap-3 sm:gap-6">
        {/* Mobile Hamburger menu */}
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-1.5 text-zinc-600 hover:text-zinc-900 border border-zinc-200 rounded-xl bg-zinc-50 hover:bg-zinc-100 transition active:scale-95 shrink-0 cursor-pointer"
          title="Toggle Navigation Menu"
        >
          <Menu className="h-4.5 w-4.5" />
        </button>

        {/* Company Dropdown */}
        <div className="flex items-center gap-1.5">
          <Building className="h-4 w-4 text-indigo-500 drop-shadow-[0_0_6px_rgba(99,102,241,0.2)]" />
          <select
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="text-xs sm:text-sm font-bold text-zinc-800 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer hover:text-indigo-600 transition max-w-[110px] sm:max-w-none"
          >
            <option value="Apollo Pharmaceuticals Pvt Ltd">Apollo Pharma Ltd</option>
            <option value="Apothecary Retail Franchise Ltd">Apothecary Retail Franchise</option>
            <option value="Centralized Wholesale Logistics Group">Central Wholesale Logistics</option>
          </select>
        </div>

        {/* Branch Selector */}
        <div className="hidden md:flex items-center gap-2 border-l border-zinc-200 pl-6">
          <Landmark className="h-4.5 w-4.5 text-rose-500 drop-shadow-[0_0_6px_rgba(244,63,94,0.2)]" />
          <select
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="text-sm font-semibold text-zinc-700 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer hover:text-rose-600 transition"
          >
            {branches.map(br => (
              <option key={br} value={br}>{br}</option>
            ))}
          </select>
        </div>

        {/* Financial Year Selector */}
        <div className="hidden xl:flex items-center gap-2 border-l border-zinc-200 pl-6">
          <Calendar className="h-4.5 w-4.5 text-emerald-500 drop-shadow-[0_0_6px_rgba(16,185,129,0.2)]" />
          <select
            value={financialYear}
            onChange={(e) => setFinancialYear(e.target.value)}
            className="text-sm font-semibold text-zinc-600 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer hover:text-emerald-600 transition"
          >
            <option value="FY 2026-27">FY 2026-27 (Active)</option>
            <option value="FY 2025-26">FY 2025-26 (Audited)</option>
          </select>
        </div>
      </div>

      {/* Admin Quick Switchers & Notifications */}
      <div className="flex items-center gap-4">
        {/* Live RBAC Quick Role Selector */}
        <div className="flex items-center gap-2 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-rose-200/80 rounded-xl px-3 py-1.5 shadow-sm hover:shadow-md transition">
          <Shield className="h-4 w-4 text-rose-500 animate-pulse" />
          <span className="text-xs font-bold text-indigo-950 uppercase tracking-wide">Role Switch:</span>
          <select
            value={currentRole}
            onChange={(e) => setCurrentRole(e.target.value as UserRole)}
            className="text-xs font-black text-rose-800 bg-transparent border-none p-0 focus:outline-none focus:ring-0 cursor-pointer uppercase font-sans decoration-none"
          >
            {roles.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* System Time Center */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl text-zinc-500 font-mono text-[11px] select-none hover:border-sky-305 transition">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute [animation-duration:1500ms]"></span>
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 relative"></span>
          <span className="font-bold text-zinc-650">SYSTEM RUNTIME: 2026-06-02 Tue 03:55 UTC</span>
        </div>

        {/* Custom Gemini API Key Override Configuration */}
        <div className="relative">
          <button
            id="custom-api-key-btn"
            onClick={() => setShowApiKeySetting(!showApiKeySetting)}
            className={`p-2 rounded-xl transition relative flex items-center justify-center gap-1.5 border h-9 ${
              customApiKey 
                ? 'text-emerald-700 bg-emerald-500/5 border-emerald-200 hover:bg-emerald-500/10' 
                : 'text-zinc-500 bg-zinc-50 border-zinc-200 hover:text-zinc-850 hover:bg-zinc-100'
            }`}
            title={customApiKey ? "Custom Gemini key is active" : "Configure Custom Gemini API Key"}
          >
            <Key className={`h-4 w-4 ${customApiKey ? 'text-emerald-600 animate-pulse' : 'text-zinc-400'}`} />
            <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline-block">
              {customApiKey ? "Key Live" : "AI Key"}
            </span>
            {customApiKey && (
              <span className="absolute -top-1 -right-0.5 w-2 h-2 bg-emerald-500 border border-white rounded-full animate-ping absolute duration-1000"></span>
            )}
          </button>

          {showApiKeySetting && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 shadow-xl rounded-2xl p-4 text-left z-50">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-3">
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-sky-500" /> AI Key Settings
                </span>
                <button 
                  onClick={() => setShowApiKeySetting(false)} 
                  className="text-[10px] text-zinc-400 font-bold hover:text-zinc-650 uppercase"
                >
                  Close
                </button>
              </div>
              
              <div className="space-y-3">
                <p className="text-[11px] text-zinc-500 leading-normal">
                  If Gemini requests exceed API rate limits or you hit quota barriers, enter a personal <strong>Google AI Studio API Key</strong> below to seamlessly bypass the system-wide shared key.
                </p>

                <div>
                  <label className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1">
                    Gemini Studio API Key Override
                  </label>
                  <input
                    id="gemini-custom-key-input"
                    type="password"
                    placeholder="AIzaSy..."
                    value={customApiKey}
                    onChange={(e) => {
                      const val = e.target.value.trim();
                      setCustomApiKey(val);
                      if (val) {
                        localStorage.setItem('gemini_api_key_override', val);
                      } else {
                        localStorage.removeItem('gemini_api_key_override');
                      }
                      // Dispatch storage event to notify all listening modules
                      window.dispatchEvent(new Event('storage'));
                    }}
                    className="w-full text-xs font-mono px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:bg-white focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all placeholder:text-zinc-305"
                  />
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-zinc-100 text-[10px]">
                  <span className="text-[9px] font-mono text-zinc-400">
                    {customApiKey ? "✨ Override Active (Local)" : "ℹ️ Using Shared Key Pool"}
                  </span>
                  {customApiKey && (
                    <button
                      onClick={() => {
                        setCustomApiKey('');
                        localStorage.removeItem('gemini_api_key_override');
                        window.dispatchEvent(new Event('storage'));
                      }}
                      className="font-bold text-rose-500 hover:text-rose-600 transition"
                    >
                      Clear
                    </button>
                  )}
                </div>
                
                <a 
                  href="https://aistudio.google.com/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2 bg-zinc-50 hover:bg-sky-50/30 rounded-xl flex items-center gap-2 border border-zinc-150 transition select-none cursor-pointer"
                >
                  <Info className="h-3.5 w-3.5 text-sky-500 flex-shrink-0" />
                  <span className="text-[10px] text-zinc-500 font-medium hover:text-sky-600 transition">Get a free key from Google AI Studio &rarr;</span>
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Alert Notification bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotification(!showNotification)}
            className="p-2 text-zinc-500 hover:text-zinc-850 hover:bg-zinc-100 rounded-xl transition relative"
          >
            <Bell className="h-5 w-5 text-indigo-500 drop-shadow-[0_0_6px_rgba(99,102,241,0.3)]" />
            <span className="absolute top-1 right-1.5 w-2.5 h-2.5 bg-rose-550 border-2 border-white rounded-full animate-pulse"></span>
          </button>

          {showNotification && (
            <div className="absolute right-0 mt-2 w-80 bg-white border border-zinc-200 shadow-xl rounded-2xl p-4 text-left z-50">
              <div className="flex items-center justify-between border-b border-zinc-100 pb-2 mb-2">
                <span className="text-xs font-bold text-zinc-700 uppercase">Alert Alerts</span>
                <span className="text-[10px] text-zinc-400 font-mono">3 New Actions</span>
              </div>
              <div className="space-y-3">
                <div className="flex gap-2 text-xs leading-normal">
                  <div className="h-2 w-2 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-zinc-800">Near Expiry Alert:</span> Lipitor 10mg (Batch LIP-8472) expires in less than 30 days. Action required inside Module 04.
                  </div>
                </div>
                <div className="flex gap-2 text-xs leading-normal border-t border-zinc-50 pt-2">
                  <div className="h-2 w-2 rounded-full bg-orange-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-zinc-800">Narcotics Double-Audit:</span> Alprax 0.5mg batch dispensed by Cashier without Doctor signature requires immediate approval.
                  </div>
                </div>
                <div className="flex gap-2 text-xs leading-normal border-t border-zinc-50 pt-2">
                  <div className="h-2 w-2 rounded-full bg-sky-500 mt-1.5 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-zinc-800">Auto Reorder Action:</span> Calpol stock fell below min level (100). Auto generated standard PO-2026-4402 inside module 03.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Persistent High-Contrast Late-Night Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 text-zinc-500 hover:text-zinc-850 hover:bg-zinc-150/50 rounded-xl transition relative flex items-center justify-center border border-zinc-200 h-9 shrink-0 select-none cursor-pointer gap-1.5"
          title={isDarkMode ? "Switch to Standard Day Shift Mode" : "Activate High-Contrast Late-Night Shift Mode"}
        >
          {isDarkMode ? (
            <>
              <Sun className="h-4.5 w-4.5 text-amber-500 drop-shadow-[0_0_6px_rgba(245,158,11,0.5)]" />
              <span className="text-[10px] font-extrabold text-amber-600 uppercase tracking-wider hidden md:inline-block">Day Shift</span>
            </>
          ) : (
            <>
              <Moon className="h-4.5 w-4.5 text-indigo-500 drop-shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
              <span className="text-[10px] font-extrabold text-zinc-500 uppercase tracking-wider hidden md:inline-block">Night Shift</span>
            </>
          )}
        </button>

        {/* Staff Persona Badge */}
        <div className="flex items-center gap-2 border-l border-zinc-200 pl-4">
          <div className="h-8 w-8 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-sm">
            {currentRole ? currentRole[0].toUpperCase() : 'U'}
          </div>
          <div className="text-left hidden md:block">
            <p className="text-xs font-semibold text-zinc-800">{currentRole}</p>
            <p className="text-[10px] font-mono text-zinc-400">ID: EMP-0{currentRole ? currentRole.length : '9'}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
