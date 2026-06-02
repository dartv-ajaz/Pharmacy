import React, { useState } from 'react';
import { BarChart3, TrendingUp, DollarSign, Calendar, ChevronRight, PieChart, Activity, Sparkles } from 'lucide-react';
import { mockInvoices, mockProducts, mockBatches } from '../../data/mockData';

export default function AnalyticsModule() {
  const [activeDateRange, setActiveDateRange] = useState<'30days' | '6m' | '1y'>('30days');

  // Math indicators based on actual mock data:
  const totalInvoicesValue = mockInvoices.reduce((sum, inv) => sum + inv.totals.grandTotal, 0);
  const totalSkuLines = mockProducts.length;
  
  // Calculate expiry risk totals sum: Number of batches near/expired
  const nearExpiryCount = mockBatches.filter(b => {
    const expDate = new Date(b.expiryDate);
    const currentDate = new Date('2026-06-02');
    const diffTime = expDate.getTime() - currentDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays < 90; // expiring in 90 days
  }).length;

  const revenueByMonthData = [
    { label: 'Jan', value: 450000 },
    { label: 'Feb', value: 520000 },
    { label: 'Mar', value: 610000 },
    { label: 'Apr', value: 580000 },
    { label: 'May', value: 720000 },
    { label: 'Jun', value: 842000 } // June current matches June Revenue ledger mock
  ];

  const maxVal = Math.max(...revenueByMonthData.map(d => d.value));

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* Banner */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-sky-500 animate-pulse" />
            Module 18: Enterprise Analytical BI Informatics
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Real-time SCM aging matrixes, category sales distributions, and custom D3-style SVG visual indicators.</p>
        </div>

        {/* Filters */}
        <div className="flex bg-zinc-100 p-1.5 rounded-lg border border-zinc-200 shrink-0">
          <button
            onClick={() => setActiveDateRange('30days')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeDateRange === '30days' ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setActiveDateRange('1y')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeDateRange === '1y' ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Year-to-Date
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* KPI Scorecards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-zinc-200 p-4.5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">YTD Gross Revenue</span>
              <span className="text-base font-black text-zinc-800 font-mono mt-1 block">₹37,22,000.00</span>
              <span className="text-[9px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" /> +14.2% YoY growth
              </span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg select-none">
              ₹
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-4.5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">June Billing Volume</span>
              <span className="text-base font-black text-zinc-800 font-mono mt-1 block">₹8,42,000.00</span>
              <span className="text-[9px] text-zinc-400 mt-1 block">Reconciled against 5 registers</span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center font-bold">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-white border border-zinc-200 p-4.5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Active SKU Coverage</span>
              <span className="text-base font-black text-zinc-800 font-mono mt-1 block">{totalSkuLines} Drugs</span>
              <span className="text-[9px] text-zinc-400 mt-1 block">Across OTC, Sch-H & Narcotics</span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Activity className="h-5 w-5" />
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-150 p-4.5 rounded-xl shadow-sm flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider block">Near Expiry Risk Liabilities</span>
              <span className="text-base font-black text-rose-700 font-mono mt-1 block">{nearExpiryCount} SKU Batches</span>
              <span className="text-[9px] text-rose-600 font-semibold mt-1 block">Expiring under 90 days</span>
            </div>
            <div className="h-10 w-10 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center font-bold text-base select-none animate-pulse">
              ⚠️
            </div>
          </div>
        </div>

        {/* Graphical Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue line plot (SVG-backed) */}
          <div className="lg:col-span-2 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-100 pb-3">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp className="h-4 w-4 text-sky-500" /> Rolling H1 Consolidated Revenues (₹ Lakhs)
              </h3>
            </div>

            <div className="relative pt-6">
              {/* Core SVG Chart */}
              <svg className="w-full h-48 text-sky-500 overflow-visible" viewBox="0 0 600 160" preserveAspectRatio="none">
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.3" />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid Lines */}
                <line x1="0" y1="120" x2="600" y2="120" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="80" x2="600" y2="80" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />
                <line x1="0" y1="40" x2="600" y2="40" stroke="#f4f4f5" strokeWidth="1" strokeDasharray="3,3" />

                {/* Line Path */}
                {/* Jan: 0,110 | Feb: 120,95 | Mar: 240,75 | Apr: 360,82 | May: 480,50 | Jun: 600,25 */}
                <path
                  d="M 0 110 L 120 95 L 240 75 L 360 82 L 480 50 L 600 25"
                  fill="none"
                  stroke="#0284c7"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />

                {/* Area Gradient fill */}
                <path
                  d="M 0 110 L 120 95 L 240 75 L 360 82 L 480 50 L 600 25 L 600 160 L 0 160 Z"
                  fill="url(#chartGradient)"
                />

                {/* Highlight node circles */}
                <circle cx="0" cy="110" r="5" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="120" cy="95" r="5" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="240" cy="75" r="5" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="360" cy="82" r="5" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="480" cy="50" r="5" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" />
                <circle cx="600" cy="25" r="5" fill="#ffffff" stroke="#0ea5e9" strokeWidth="3" />
              </svg>

              <div className="flex justify-between text-[10px] text-zinc-400 font-mono font-bold mt-4 pt-2.5 border-t border-zinc-100">
                <span>JAN (4.5L)</span>
                <span>FEB (5.2L)</span>
                <span>MAR (6.1L)</span>
                <span>APR (5.8L)</span>
                <span>MAY (7.2L)</span>
                <span className="text-zinc-800 font-extrabold">JUN (8.4L)</span>
              </div>
            </div>
          </div>

          {/* Right itemized categories distribution */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-805 uppercase tracking-wider flex items-center gap-1.5">
              <PieChart className="h-4 w-4 text-sky-500" /> Drug Sales category Ratio
            </h3>

            <p className="text-[11px] text-zinc-500 leading-normal">
              Breakdown of pharmacy register transactions scaled as a percentage of collective therapeutic classes.
            </p>

            <div className="space-y-3 pt-2">
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Schedule H (Rx Critical)</span>
                  <span className="font-mono text-zinc-500">45%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-sky-500 rounded-full" style={{ width: '45%' }}></div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>OTC (Over the counter Calpol/Allegra)</span>
                  <span className="font-mono text-zinc-500">30%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '30%' }}></div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>Schedule X (Narcotics dual key)</span>
                  <span className="font-mono text-zinc-500">10%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: '10%' }}></div>
                </div>
              </div>

              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-semibold">
                  <span>General & Dietary supplements</span>
                  <span className="font-mono text-zinc-500">15%</span>
                </div>
                <div className="h-2 w-full bg-zinc-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Down SCM parameters overview */}
        <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex justify-between items-center flex-col sm:flex-row gap-4.5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-sky-500/10 border border-sky-500/20 rounded-xl text-sky-400">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-slate-300">Predictive AI Co-Forecasting engine</h4>
              <p className="text-[11px] text-slate-400 leading-normal max-w-2xl mt-0.5">
                Utilize integrated historical models inside our <strong>Gemini AI Automation module</strong> to run high-confidence prediction runs on drug consumption peaks based on regional epidemiological shifts.
              </p>
            </div>
          </div>
          <div className="shrink-0 font-mono text-[10px] text-slate-500">
            COMPUTATIONAL INSTANCE: APOTHECARY_CELL_BI_04
          </div>
        </div>

      </div>
    </div>
  );
}
