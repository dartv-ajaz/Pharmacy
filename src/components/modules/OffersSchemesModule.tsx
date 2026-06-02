import React, { useState } from 'react';
import { 
  Sparkles, PlusCircle, Tag, CheckCircle2, Ticket, Percent, Briefcase, HelpCircle, AlertCircle
} from 'lucide-react';

export default function OffersSchemesModule() {
  const [activeWorkspace, setActiveWorkspace] = useState<'patient' | 'distributor'>('patient');

  // Multi-tier scheme data mock lists
  const [patientCoupons, setPatientCoupons] = useState([
    { code: 'SENIOR15', title: 'Senior Citizen Flat 15%', discount: '15% Off', minBill: '₹500', target: 'Prescription Drugs only', status: 'Active' },
    { code: 'CHRONIC20', title: 'Chronic Diabetes Group Bundle', discount: '20% Off', minBill: '₹2,500', target: 'Insulins, Glimepiride, Metformin', status: 'Active' },
    { code: 'OTC500PR', title: 'Self-Care Wellness Coupon', discount: 'Flat ₹50', minBill: '₹400', target: 'OTC vitamins & dietary health', status: 'Active' },
    { code: 'MOMCARE12', title: 'Baby Nutrition Subsidy', discount: '12% Off', minBill: '₹1,000', target: 'Pediasure, Lactogen, baby wipes', status: 'Active' }
  ]);

  const [distributorSchemes, setDistributorSchemes] = useState([
    { product: 'Calpol 650mg Tablets', scheme: '10 + 1 Box Free (10% Bonus)', minOrder: '10 Boxes', supplier: 'GSK Consumer India Depot', duration: 'Valid up to end of month' },
    { product: 'Moxikind-CV 625 Duo', scheme: 'Buy 5 strips, Get 1 strip free (20% Bonus)', minOrder: '50 strips', supplier: 'Mankind SCM Depot', duration: 'Valid up to end of month' },
    { product: 'Augmentin 625 Oral Suspension', scheme: 'Double Points + CD 2% Discount', minOrder: '20 Liquid Bottles', supplier: 'GlaxoSmithKline SCM Noida', duration: 'Continuous standard' },
    { product: 'Lipitor Statin Calcium', scheme: 'Scheme 12 + 2 Strip Free (16.6% bonus)', minOrder: '12 Boxes', supplier: 'Viatris Delhi logistics', duration: 'Flash 3-Day Campaign' }
  ]);

  // Form states 
  const [newCode, setNewCode] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newDiscount, setNewDiscount] = useState('');
  const [newMinBill, setNewMinBill] = useState('');
  const [newTarget, setNewTarget] = useState('');

  const [newProd, setNewProd] = useState('');
  const [newScheme, setNewScheme] = useState('');
  const [newMinOrder, setNewMinOrder] = useState('');
  const [newSupplier, setNewSupplier] = useState('');

  const handleAddCoupon = () => {
    if (!newCode || !newTitle || !newDiscount) {
      alert("Coupon Code, Display Title, and Discount Value are mandatory.");
      return;
    }
    setPatientCoupons([
      ...patientCoupons,
      {
        code: newCode.toUpperCase(),
        title: newTitle,
        discount: newDiscount,
        minBill: newMinBill || '₹0',
        target: newTarget || 'All inventory items',
        status: 'Active'
      }
    ]);
    setNewCode('');
    setNewTitle('');
    setNewDiscount('');
    setNewMinBill('');
    setNewTarget('');
    alert("Patient coupon configuration saved successfully.");
  };

  const handleAddDistributorScheme = () => {
    if (!newProd || !newScheme || !newSupplier) {
      alert("Product name, Scheme formula description, and Supplier name are mandatory.");
      return;
    }
    setDistributorSchemes([
      ...distributorSchemes,
      {
        product: newProd,
        scheme: newScheme,
        minOrder: newMinOrder || 'None',
        supplier: newSupplier,
        duration: 'Active 30 days'
      }
    ]);
    setNewProd('');
    setNewScheme('');
    setNewMinOrder('');
    setNewSupplier('');
    alert("B2B Distributor bulk scheme registered.");
  };

  return (
    <div className="flex-grow p-6 bg-zinc-50 flex flex-col overflow-hidden h-full">
      {/* Title Header */}
      <div className="flex-shrink-0 flex items-center justify-between border-b border-zinc-200 pb-4 mb-5">
        <div>
          <h2 className="text-base font-bold text-zinc-900 flex items-center gap-2">
            <Sparkles className="h-4.5 w-4.5 text-sky-500 animate-pulse" />
            Module 09: Dynamic Pharmacy Offers & Schemes Register
          </h2>
          <p className="text-xs text-zinc-500 font-sans">
            Configure consumer retail coupons, multi-box vendor schemes (10+1, 12+2), flash discounts, and cash rebates.
          </p>
        </div>

        {/* Workspace switch buttons */}
        <div className="flex bg-zinc-100 p-1 rounded-xl border border-zinc-200">
          <button
            onClick={() => setActiveWorkspace('patient')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeWorkspace === 'patient' ? 'bg-white shadow text-sky-600' : 'text-zinc-500'
            }`}
          >
            Patient retail coupons
          </button>
          <button
            onClick={() => setActiveWorkspace('distributor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
              activeWorkspace === 'distributor' ? 'bg-white shadow text-sky-600' : 'text-zinc-500'
            }`}
          >
            Vendor Trade Schemes (10+1)
          </button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 overflow-hidden">
        {/* Left Column: Create Form */}
        <div className="bg-white border border-zinc-200 p-5 rounded-xl shadow-sm overflow-y-auto space-y-4">
          <h3 className="text-xs font-black text-zinc-800 uppercase tracking-widest">
            {activeWorkspace === 'patient' ? 'Add Consumer Coupon' : 'Add Trade Scheme (10+1)'}
          </h3>
          <p className="text-[11px] text-zinc-400">
            Define structural rules so the POS billing register automatically calculates price markdowns during checkout.
          </p>

          {activeWorkspace === 'patient' ? (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Coupon Code</label>
                <input
                  type="text"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  placeholder="e.g. OFF20GST, HEALTH15"
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Display Title / Name</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Asthma Group Flat 20%"
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Discount Magnitude</label>
                <input
                  type="text"
                  value={newDiscount}
                  onChange={(e) => setNewDiscount(e.target.value)}
                  placeholder="e.g. 15% Off, Flat ₹100"
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Min Bill Vol</label>
                  <input
                    type="text"
                    value={newMinBill}
                    onChange={(e) => setNewMinBill(e.target.value)}
                    placeholder="e.g. ₹600"
                    className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Target Drugs</label>
                  <input
                    type="text"
                    value={newTarget}
                    onChange={(e) => setNewTarget(e.target.value)}
                    placeholder="e.g. OTC Wellness"
                    className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
              <button
                onClick={handleAddCoupon}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 font-bold text-white text-xs rounded-xl transition shadow mt-4 flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" /> Save Coupon Code
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-2">
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Target Drug / Product</label>
                <input
                  type="text"
                  value={newProd}
                  onChange={(e) => setNewProd(e.target.value)}
                  placeholder="e.g. Calpol 650 Boxes"
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:ring-1 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Trade Scheme Description (10+1, 12+2)</label>
                <input
                  type="text"
                  value={newScheme}
                  onChange={(e) => setNewScheme(e.target.value)}
                  placeholder="e.g. 10 Boxes + 1 Free Unit"
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Min Order volume limits</label>
                <input
                  type="text"
                  value={newMinOrder}
                  onChange={(e) => setNewMinOrder(e.target.value)}
                  placeholder="e.g. 10 Boxes"
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-zinc-500 uppercase block mb-1">Supplier Depot</label>
                <input
                  type="text"
                  value={newSupplier}
                  onChange={(e) => setNewSupplier(e.target.value)}
                  placeholder="e.g. GSK Noida Depot"
                  className="w-full text-xs border border-zinc-200 bg-zinc-50 rounded-lg p-2 focus:bg-white focus:outline-none"
                />
              </div>
              <button
                onClick={handleAddDistributorScheme}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 font-bold text-white text-xs rounded-xl transition shadow mt-4 flex items-center justify-center gap-2"
              >
                <PlusCircle className="h-4 w-4" /> Save Trade Scheme
              </button>
            </div>
          )}
        </div>

        {/* Right Columns: Active Layout Grid */}
        <div className="md:col-span-2 overflow-y-auto space-y-4 pr-1">
          {activeWorkspace === 'patient' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {patientCoupons.map((c, i) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[9px] bg-sky-100 text-sky-700 font-black px-1.5 py-0.5 rounded font-mono block w-fit mb-2">
                        {c.code}
                      </span>
                      <h4 className="text-xs font-bold text-zinc-800 leading-tight">{c.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-semibold mt-2">Target: {c.target}</p>
                    </div>
                    <div className="h-8 w-8 rounded-full bg-sky-50 text-sky-600 flex items-center justify-center font-mono">
                      <Percent className="h-4 w-4" />
                    </div>
                  </div>

                  <div className="border-t border-zinc-100 pt-3 mt-4 flex items-center justify-between text-[10px]">
                    <span className="text-zinc-400">Min. Billing: <strong className="text-zinc-600 font-mono">{c.minBill}</strong></span>
                    <span className="text-emerald-600 font-black flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" /> {c.discount}
                    </span>
                  </div>

                  {/* Cut-out ticket shapes */}
                  <div className="absolute top-1/2 -left-2 w-4 h-4 bg-zinc-50 border border-zinc-200 rounded-full"></div>
                  <div className="absolute top-1/2 -right-2 w-4 h-4 bg-zinc-50 border border-zinc-200 rounded-full"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {distributorSchemes.map((s, i) => (
                <div key={i} className="bg-white border border-zinc-200 rounded-xl p-4 flex items-center justify-between gap-4 hover:border-zinc-300 transition-all shadow-sm">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] bg-amber-50 border border-amber-200 text-amber-700 font-extrabold px-1.5 py-0.5 rounded uppercase">
                        Vendor Trade Alert
                      </span>
                      <span className="text-[10px] text-zinc-450 font-mono">{s.duration}</span>
                    </div>
                    <h4 className="text-xs font-black text-zinc-850 mt-1">{s.product}</h4>
                    <p className="text-[11px] text-zinc-500 font-semibold">Ordered From: {s.supplier}</p>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-black text-emerald-600 bg-emerald-50 border border-emerald-100 px-3 py-1.5 rounded-lg block">
                      {s.scheme}
                    </span>
                    <span className="text-[10px] text-zinc-400 block mt-1 font-mono">Min Order: {s.minOrder}</span>
                  </div>
                </div>
              ))}

              {/* Informative alert box explaining Schemes in pharma */}
              <div className="p-4 bg-sky-50 border border-sky-200/50 rounded-xl flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-sky-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-xs font-bold text-sky-900">B2B Trade Schemes System Note</h4>
                  <p className="text-[10px] text-sky-850 mt-1 leading-relaxed">
                    Trade schemes like 10+1 or 12+2 free units are the foundation of pharmaceutical stocking. Apothecary automatically matches purchase entries matching these formulations, updating the unit cost price mathematically so your balance sheets display real gross margins without manual spreadsheet calculations.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
