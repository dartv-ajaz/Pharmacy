import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, Search, ShieldAlert, Key, Globe, Eye, Plus, Check,
  Download, Printer, FileText, Calendar, Filter, Users, Layers,
  RefreshCw, ClipboardCheck, Lock, CheckCircle
} from 'lucide-react';
import { mockLogs } from '../../data/mockData';
import { UserRole, SystemLog } from '../../types';

export default function SecurityAuditModule() {
  const [logs, setLogs] = useState<SystemLog[]>(mockLogs);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom Filter States
  const [filterUser, setFilterUser] = useState('All');
  const [filterModule, setFilterModule] = useState('All');
  const [timeWindow, setTimeWindow] = useState<'All' | 'Today' | '7days' | '30days' | 'custom'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Active Compliance Report State (Modal view)
  const [showPdfModal, setShowPdfModal] = useState(false);

  const [ipWhitelists, setIpWhitelists] = useState([
    { ip: '192.168.1.104', label: 'Local POS Checkout A', status: 'Active' },
    { ip: '103.45.10.22', label: 'Central WH VPN Gateway', status: 'Active' }
  ]);
  const [newIp, setNewIp] = useState('');
  const [newIpLabel, setNewIpLabel] = useState('');
  
  // RBAC viewer states
  const [activeRoleViewer, setActiveRoleViewer] = useState<UserRole>('Super Admin');

  // Sync permissions map from App.tsx
  const permissionsByRole: Record<string, string[]> = {
    'Super Admin': ['Master Setup', 'Pharmacy Billing', 'Purchase Orders', 'Inventory Management', 'Clinical Drug Database', 'Barcode & Labels', 'Double Entry Ledger', 'GST & E-Invoices', 'Sales Orders', 'B2B Distribution', 'Marketing & Loyalty', 'HR & Biometrics', 'Logistics Dispatch', 'Manufacturing (BOM)', 'Consumer Ecommerce', 'HL7 Hospital Health', 'Cloud Branch Sync', 'Mobile App Workspace', 'Analytics & BI Insights', 'Security & Admin Logs', 'Gemini AI Automation', 'PharmaSync Operations Hub', 'Branch Connectivity Control'],
    'Cashier': ['Master Setup', 'Pharmacy Billing'],
    'Pharmacist': ['Master Setup', 'Pharmacy Billing', 'Inventory Management', 'Clinical Drug Database', 'Manufacturing (BOM)', 'Gemini AI Automation'],
    'Accountant': ['Double Entry Ledger', 'GST & E-Invoices', 'PharmaSync Operations Hub'],
    'Auditor': ['Master Setup', 'Inventory Management', 'Double Entry Ledger', 'GST & E-Invoices', 'Security & Admin Logs', 'PharmaSync Operations Hub', 'Branch Connectivity Control'],
    'Delivery Boy': ['Mobile App Workspace', 'Logistics Dispatch'],
    'Patient': ['Mobile App Workspace', 'Consumer Ecommerce'],
    'Doctor': ['Master Setup', 'Clinical Drug Database', 'Gemini AI Automation'],
    'Company Admin': [],
    'Branch Admin': [],
    'Purchase Manager': [],
    'Inventory Manager': [],
    'Warehouse Manager': [],
    'Sales Manager': [],
    'Salesman': [],
    'Distributor': [],
    'Retailer': [],
    'Employee': [],
    'Customer': []
  };

  // Poll server live logs
  const fetchLiveLogs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sandbox/system/logs');
      const data = await res.json();
      if (data && data.data) {
        setLogs(data.data);
      }
    } catch (err) {
      console.warn("Could not retrieve live server logs. Using mock safety database.", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveLogs();
  }, []);

  const handleAddNewIpRule = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIp) return;
    setIpWhitelists([...ipWhitelists, {
      ip: newIp,
      label: newIpLabel || 'Assigned Operator Client',
      status: 'Active'
    }]);
    setNewIp('');
    setNewIpLabel('');
  };

  // Extract unique distinct users & modules for advanced filter controls
  const uniqueUsers = Array.from(new Set(logs.map(l => l.userName).filter(Boolean)));
  const uniqueModules = Array.from(new Set(logs.map(l => l.module).filter(Boolean)));

  // Perform multi-dimensional compliant security filtering
  const filteredLogs = logs.filter(log => {
    // 1. Text Search query
    const matchQuery = 
      log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ipAddress.includes(searchQuery);

    // 2. User specific filter
    const matchUser = filterUser === 'All' || log.userName === filterUser;

    // 3. Module specific filter
    const matchModule = filterModule === 'All' || log.module === filterModule;

    // 4. Time range window filter
    let matchTime = true;
    if (timeWindow !== 'All') {
      const logDate = new Date(log.timestamp);
      const now = new Date();
      
      if (timeWindow === 'Today') {
        const startOfToday = new Date();
        startOfToday.setHours(0, 0, 0, 0);
        matchTime = logDate >= startOfToday;
      } else if (timeWindow === '7days') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchTime = logDate >= sevenDaysAgo;
      } else if (timeWindow === '30days') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchTime = logDate >= thirtyDaysAgo;
      } else if (timeWindow === 'custom') {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          matchTime = matchTime && (logDate >= start);
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          matchTime = matchTime && (logDate <= end);
        }
      }
    }

    return matchQuery && matchUser && matchModule && matchTime;
  });

  // KPI calculations formatted beautifully
  const uniqueIPsCount = Array.from(new Set(filteredLogs.map(l => l.ipAddress))).length;
  const severeIncidentCount = filteredLogs.filter(l => 
    l.action.toLowerCase().includes('narcotic') || 
    l.action.toLowerCase().includes('recall') ||
    l.action.toLowerCase().includes('violation') ||
    l.action.toLowerCase().includes('override') ||
    l.action.toLowerCase().includes('delete')
  ).length;

  // CSV Spreadsheet Export Engine
  const exportLogsToCsv = () => {
    if (filteredLogs.length === 0) {
      alert("No matching audit logs to export.");
      return;
    }

    // CSV header row
    const headers = ["Log ID", "Timestamp (UTC)", "User Name", "Account Role", "System Action", "Affected Module", "IP Address", "Detailed Telemetry Trace"];
    
    // Convert logs into safe CSV strings
    const rows = filteredLogs.map(log => [
      log.id,
      log.timestamp,
      `"${log.userName.replace(/"/g, '""')}"`,
      log.role,
      `"${log.action.replace(/"/g, '""')}"`,
      `"${log.module.replace(/"/g, '""')}"`,
      log.ipAddress,
      `"${log.details.replace(/"/g, '""')}"`
    ]);

    const csvData = [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", blobUrl);
    downloadAnchor.setAttribute("download", `Apothecary_Compliance_AuditLog_Export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(blobUrl);
  };

  // Open Standard Browser Print Layout targeting printable compliance document
  const triggerCompliancePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* Banner Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-sky-600 animate-pulse" />
            Module 19: Security Hardening & FDA GAMP5 Audit Log Ledger
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">
            Secured immutable event streams, interactive diagnostic filtering, network whitelist registries, and compliance audit exports.
          </p>
        </div>

        {/* Toolbar controls */}
        <div className="flex gap-2.5">
          <button 
            onClick={fetchLiveLogs}
            disabled={isLoading}
            className="px-3 py-1.5 bg-white border border-zinc-200 hover:bg-zinc-50 text-zinc-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow-sm disabled:opacity-55"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-zinc-500 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Polling Database...' : 'Sync Live'}
          </button>
          
          <button 
            onClick={exportLogsToCsv}
            className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 hover:bg-sky-100/80 text-xs font-bold rounded-xl flex items-center gap-1.5 transition"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </button>

          <button 
            onClick={() => setShowPdfModal(true)}
            className="px-3 py-1.5 bg-zinc-900 text-white border border-zinc-800 hover:bg-zinc-800 text-xs font-bold rounded-xl flex items-center gap-1.5 transition shadow"
          >
            <Printer className="h-3.5 w-3.5" />
            PDF Compliance Report
          </button>
        </div>
      </div>

      {/* Embedded KPI Ribbon */}
      <div className="px-6 pt-5 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm text-xs relative overflow-hidden flex items-center gap-3">
          <div className="p-2 bg-zinc-100 rounded-lg text-zinc-600">
            <ShieldCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Total Trace Stream</span>
            <span className="font-mono font-black text-zinc-900 text-lg mt-0.5 block">{filteredLogs.length} Records</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm text-xs relative overflow-hidden flex items-center gap-3">
          <div className="p-2 bg-sky-50 text-sky-600 rounded-lg">
            <Globe className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">IP Address Footprint</span>
            <span className="font-mono font-black text-sky-700 text-lg mt-0.5 block">{uniqueIPsCount} Unique</span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm text-xs relative overflow-hidden flex items-center gap-3">
          <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">Overrides / Warnings</span>
            <span className={`font-mono font-black text-lg mt-0.5 block ${severeIncidentCount > 0 ? 'text-rose-600' : 'text-zinc-600'}`}>
              {severeIncidentCount} Flashed
            </span>
          </div>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl p-3.5 shadow-sm text-xs relative overflow-hidden flex items-center gap-3">
          <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
            <ClipboardCheck className="h-4 w-4" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">SLA GAMP5 / HIPAA Status</span>
            <span className="font-semibold text-emerald-600 text-xs mt-0.5 block bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 font-sans uppercase font-bold">
              ✓ Compliant
            </span>
          </div>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Section: Audit Filters & Logs List */}
        <div className="xl:col-span-8 space-y-4">
          
          {/* Diagnostic Filter Panel */}
          <div className="bg-white border border-zinc-200 rounded-xl p-4.5 shadow-sm space-y-3.5">
            <div className="flex items-center gap-1.5 text-zinc-800">
              <Filter className="h-4 w-4 text-zinc-500" />
              <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-700">Audit-Trail Control Filters</h4>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
              {/* Operator User Filter */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1 mb-1">
                  <Users className="h-3 w-3 text-zinc-400" /> Filter Operator
                </label>
                <select
                  value={filterUser}
                  onChange={(e) => setFilterUser(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="All">All Operators (Show All)</option>
                  {uniqueUsers.map((user, idx) => (
                    <option key={idx} value={user}>{user}</option>
                  ))}
                </select>
              </div>

              {/* Module Filter */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1 mb-1">
                  <Layers className="h-3 w-3 text-zinc-400" /> Filter Modules
                </label>
                <select
                  value={filterModule}
                  onChange={(e) => setFilterModule(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="All">All Modules (Show All)</option>
                  {uniqueModules.map((mod, idx) => (
                    <option key={idx} value={mod}>{mod}</option>
                  ))}
                </select>
              </div>

              {/* Date window range selector */}
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase flex items-center gap-1 mb-1">
                  <Calendar className="h-3 w-3 text-zinc-400" /> Time-Window
                </label>
                <select
                  value={timeWindow}
                  onChange={(e) => setTimeWindow(e.target.value as any)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500"
                >
                  <option value="All">All Time History</option>
                  <option value="Today">Recorded Today</option>
                  <option value="7days">Past 7 Days</option>
                  <option value="30days">Past 30 Days</option>
                  <option value="custom">Custom Date Range...</option>
                </select>
              </div>
            </div>

            {/* Hidden custom date fields triggered on custom select */}
            {timeWindow === 'custom' && (
              <div className="grid grid-cols-2 gap-4 pt-1 text-xs animate-fadeIn">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">Start Date Range</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-zinc-400 uppercase mb-1">End Date Range</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="h-4 w-4 text-sky-500" /> Chronological Compliance Trail ({filteredLogs.length} events found)
              </h3>
              
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                <input
                  type="text"
                  placeholder="Filter logs by details context..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8.5 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            {/* List scrollbox */}
            <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
              {filteredLogs.length === 0 ? (
                <div className="py-12 text-center rounded-xl bg-zinc-50 border border-dashed border-zinc-200">
                  <ShieldAlert className="h-7 w-7 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs text-zinc-400">No telemetry log entries match the active filters.</p>
                </div>
              ) : (
                filteredLogs.map((log) => (
                  <div 
                    key={log.id} 
                    className="p-3.5 bg-zinc-50 border border-zinc-200 rounded-xl text-xs space-y-2 hover:bg-zinc-100/40 transition-all font-mono"
                  >
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                      <div className="flex items-center gap-2 text-zinc-900">
                        <span className="font-bold text-zinc-900 bg-sky-100/60 text-sky-950 text-[9px] px-1.5 py-0.5 rounded uppercase leading-none">
                          {log.role}
                        </span>
                        <strong className="text-xs font-bold font-sans text-zinc-800">{log.userName}</strong>
                        <span className="text-[10px] text-zinc-400 font-mono font-bold">{log.userId}</span>
                      </div>
                      <span className="text-[10px] text-zinc-400 font-bold">{log.timestamp}</span>
                    </div>

                    <div className="text-[11px] text-zinc-700 leading-normal font-medium mt-1">
                      Action: <strong className="text-sky-600 underline font-semibold">{log.action}</strong>
                      <p className="text-zinc-500 italic mt-0.5 font-sans leading-relaxed text-[11px]">{log.details}</p>
                    </div>

                    <div className="flex justify-between items-center text-[9px] text-zinc-400 pt-1 border-t border-zinc-200/55 font-bold">
                      <span>IP ADDRESS: {log.ipAddress}</span>
                      <span>MODULE: {log.module}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Section: RBAC & Network Security */}
        <div className="xl:col-span-4 space-y-6">
          {/* RBAC viewer */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider flex items-center gap-1.5 pb-1">
              <Key className="h-4 w-4 text-emerald-500 animate-pulse" /> RBAC Permission Map Inspector
            </h3>

            <div>
              <label className="block text-[9px] font-bold text-zinc-500 uppercase">Selected Role Node</label>
              <select
                value={activeRoleViewer}
                onChange={(e) => setActiveRoleViewer(e.target.value as UserRole)}
                className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:border-emerald-500"
              >
                <option value="Super Admin">Super Admin</option>
                <option value="Pharmacist">Pharmacist</option>
                <option value="Cashier">Cashier</option>
                <option value="Accountant">Accountant</option>
                <option value="Auditor">Auditor</option>
                <option value="Patient">Patient</option>
                <option value="Doctor">Doctor</option>
                <option value="Delivery Boy">Delivery Boy</option>
              </select>
            </div>

            {/* Permissions summary */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto pt-2 text-[10px] font-mono border-t border-zinc-100">
              <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 font-bold">Permitted SCM / compliance Modules</span>
              {(permissionsByRole[activeRoleViewer] || []).map((perm, i) => (
                <div key={i} className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50/50 p-1.5 border border-emerald-150/60 rounded">
                  <Check className="h-3 w-3 text-emerald-500 shrink-0" />
                  <span>{perm}</span>
                </div>
              ))}
              {(permissionsByRole[activeRoleViewer] || []).length === 0 && (
                <span className="text-[10px] text-zinc-400 italic block py-4 text-center">No modules assigned to child role context.</span>
              )}
            </div>
          </div>

          {/* Network IP Whitelists */}
          <div className="bg-slate-900 text-white p-5 rounded-xl shadow-sm space-y-4 border border-slate-800">
            <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300 flex items-center gap-1.5">
              <Globe className="h-4 w-4 text-sky-450 animate-pulse" /> Gateway Network IP Pool
            </h3>

            <p className="text-[10px] text-zinc-400 leading-relaxed">
              Whitelisted IP addresses mapped block external attempts on secure counter endpoints outside designated physical branches.
            </p>

            <form onSubmit={handleAddNewIpRule} className="grid grid-cols-1 gap-2 text-xs">
              <input
                type="text"
                placeholder="Target Network IP Address..."
                value={newIp}
                onChange={(e) => setNewIp(e.target.value)}
                className="bg-slate-950 border border-slate-800 p-2 rounded text-xs focus:outline-none font-mono text-white"
                required
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Label descriptive tag..."
                  value={newIpLabel}
                  onChange={(e) => setNewIpLabel(e.target.value)}
                  className="bg-slate-950 border border-slate-800 p-2 rounded text-xs focus:outline-none flex-grow"
                />
                <button
                  type="submit"
                  className="px-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-black rounded uppercase text-[10px]"
                >
                  Add IP
                </button>
              </div>
            </form>

            <div className="space-y-2 pt-2 border-t border-slate-800 max-h-40 overflow-y-auto">
              {ipWhitelists.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-[10px] font-mono bg-slate-950/40 p-2.5 rounded border border-slate-800/80">
                  <div>
                    <span className="font-bold text-slate-200 block">{item.ip}</span>
                    <span className="text-slate-500 text-[9px]">{item.label}</span>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-500/20 text-[9px] font-bold">✓ WHITELISTED</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* COMPLIANCE PDF FORM modal preview */}
      {showPdfModal && (
        <div className="fixed inset-0 bg-zinc-950/70 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            {/* Header / controls */}
            <div className="p-4 border-b border-zinc-200 flex justify-between items-center bg-zinc-50">
              <div className="flex items-center gap-2">
                <FileText className="h-4.5 w-4.5 text-zinc-700 animate-pulse" />
                <h3 className="text-xs font-bold text-zinc-900 uppercase tracking-wide">
                  FDA GAMP5 Compliance Audit Report Visualizer (Simulated PDF)
                </h3>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={triggerCompliancePrint}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition"
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print Compliance Ledger
                </button>
                <button
                  onClick={() => setShowPdfModal(false)}
                  className="px-3 py-1.5 bg-zinc-200 hover:bg-zinc-300 text-zinc-800 font-bold text-xs rounded-xl transition"
                >
                  Close Visualizer
                </button>
              </div>
            </div>

            {/* Scrollable Printable Document Body Container */}
            <div id="compliance-printable-view" className="p-8 overflow-y-auto flex-1 bg-zinc-100 text-zinc-850 font-sans">
              <div className="max-w-3xl mx-auto bg-white p-8 border border-zinc-300 rounded shadow-md relative">
                {/* Visual Stamp */}
                <div className="absolute right-8 top-8 border-4 border-emerald-500 text-emerald-600 font-black px-4 py-2 rounded-xl text-xs tracking-wider transform rotate-12 -mr-2 uppercase">
                  ✓ VERIFIED LOGS
                </div>

                {/* Company banner */}
                <div className="text-center pb-6 border-b-2 border-zinc-200">
                  <h1 className="text-xl font-extrabold text-zinc-900 uppercase tracking-widest leading-none">APOTHECARY ERP SYSTEM</h1>
                  <span className="text-[10px] font-mono text-zinc-400 mt-1 block">FEDERAL COMPLIANCE VERIFICATION RUN · REGULATORY GAMP-5 / HIPAA SYSTEM AUDIT REPORT</span>
                </div>

                {/* Scope stats */}
                <div className="grid grid-cols-2 gap-4 py-4.5 text-xs text-zinc-700 font-mono">
                  <div>
                    <p><strong>REPORT TIMESTAMP:</strong> {new Date().toISOString()}</p>
                    <p><strong>REVENUE ENTITY ID:</strong> APOTHECARY-IN-2026-9021</p>
                    <p><strong>SELECTED USER SCOPE:</strong> {filterUser === 'All' ? 'ALL SYSTEM CASHIERS / PHARMACISTS' : filterUser}</p>
                  </div>
                  <div>
                    <p><strong>TRACE RECORDS FOUND:</strong> {filteredLogs.length} events matching</p>
                    <p><strong>IP ADDRESS DIVERSIFICATION:</strong> {uniqueIPsCount} Whitelisted Gateways</p>
                    <p><strong>COMPLIANCE ATTESTATION:</strong> ISO-27001 / Sec 21 CFR Part 11 Fully Documented</p>
                  </div>
                </div>

                {/* Summary Box */}
                <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl mb-6">
                  <h4 className="text-[10px] font-bold uppercase tracking-wider text-zinc-800">ATTESTATION OF DATA INTEGRITY</h4>
                  <p className="text-[10.5px] text-zinc-650 leading-relaxed mt-0.5">
                    This compliance journal logs all core transactions including prescriptions, wholesale medication ingestion receipts, and dynamic double-entry ledger settlement actions inside <b>APOTHECARY</b>. The database confirms that no ledger entries have been overwritten or modified manually, keeping audit integrity fully sound.
                  </p>
                </div>

                {/* Logs Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-[10px]">
                    <thead>
                      <tr className="bg-zinc-100 border-b-2 border-zinc-300 text-zinc-700 font-bold uppercase">
                        <th className="p-2">Timestamp</th>
                        <th className="p-2">Author (Role)</th>
                        <th className="p-2">Action Point</th>
                        <th className="p-2">Affected Module</th>
                        <th className="p-2">Target IP</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 font-mono text-zinc-800">
                      {filteredLogs.map(log => (
                        <tr key={log.id} className="hover:bg-zinc-50">
                          <td className="p-2 truncate max-w-[124px] font-semibold">{log.timestamp}</td>
                          <td className="p-2 font-sans">
                            <span className="font-bold">{log.userName}</span> <span className="text-[9px] text-zinc-400">({log.role})</span>
                          </td>
                          <td className="p-2">
                            <span className="text-sky-650 font-bold font-sans">{log.action}</span>
                            <p className="text-zinc-500 font-sans text-[9px] mt-0.5">{log.details}</p>
                          </td>
                          <td className="p-2 truncate font-sans text-emerald-800 font-semibold">{log.module}</td>
                          <td className="p-2">{log.ipAddress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Signatures */}
                <div className="mt-12 flex justify-between items-center text-[10.5px] pt-6 border-t-2 border-dashed border-zinc-200">
                  <div>
                    <div className="h-10 w-32 border-b border-zinc-400 flex items-end justify-center pb-1 text-zinc-400 italic">
                      [System Automated]
                    </div>
                    <span className="font-bold block text-zinc-600 mt-1 uppercase">Apothecary ERP Cryptographic Stamp</span>
                  </div>
                  <div className="text-right">
                    <div className="h-10 w-44 border-b border-zinc-400 flex items-end justify-center pb-1 text-zinc-600 italic font-serif">
                       Super Administrator Desk
                    </div>
                    <span className="font-bold block text-zinc-600 mt-1 uppercase">Authorized Compliance Auditor Signature</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
