import React, { useState } from 'react';
import { 
  Globe, FileText, ShoppingCart, Plus, CheckCircle, Search, 
  HelpCircle, Image, Star, Sparkles, Check, Clipboard 
} from 'lucide-react';

export default function ConsumerEcommerceModule() {
  const [activeSubTab, setActiveSubTab] = useState<'prescriptions' | 'preorders'>('prescriptions');
  const [searchQuery, setSearchQuery] = useState('');

  const [uploadedRxs, setUploadedRxs] = useState([
    { id: 'RX-9081', patient: 'Swati Sen', date: '2026-06-02', docName: 'Dr. Vivek Malhotra', status: 'Verified', drugMatch: 'Insulin Humalog 100IU' },
    { id: 'RX-9080', patient: 'Gaurav Kumar', date: '2026-06-02', docName: 'Dr. Anita Desai', status: 'Pending Review', drugMatch: 'Amoxycillin 500mg' },
    { id: 'RX-9079', patient: 'Aditya Vardhan', date: '2026-05-30', docName: 'Dr. Rajeev Sethi', status: 'Verified', drugMatch: 'Calpol 650mg, Alprax 0.5mg' }
  ]);

  const [preorders, setPreorders] = useState([
    { id: 'ORD-99120', patient: 'Swati Sen', value: 1250, method: 'Click & Collect', status: 'Ready for Pickup' },
    { id: 'ORD-99119', patient: 'Karan Mehra', value: 850, method: 'Home Delivery', status: 'On Route' },
    { id: 'ORD-99118', patient: 'Gaurav Kumar', value: 450, method: 'Click & Collect', status: 'Processing' }
  ]);

  const handleVerifyRx = (id: string) => {
    setUploadedRxs(uploadedRxs.map(rx => rx.id === id ? { ...rx, status: 'Verified' } : rx));
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto text-xs">
      {/* SCM Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Globe className="h-4 w-4 text-emerald-500" />
            Module 14: Multichannel Ecommerce & Digital Prescription Intake Hub
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Fulfill digital prescriptions uploaded via patient consumer mobile applications or Click & Collect e-store baskets.</p>
        </div>

        <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('prescriptions')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'prescriptions' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Digital Prescriptions Review ({uploadedRxs.length})
          </button>
          <button
            onClick={() => setActiveSubTab('preorders')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'preorders' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Ecommerce Click & Collect Orders ({preorders.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === 'prescriptions' ? (
          <div className="space-y-4">
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3 text-amber-800">
              <Sparkles className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold uppercase tracking-wider text-[10px]">Narcotics Schedule H Restrictive Warnings</p>
                <p className="text-[10.5px] mt-0.5">Please map generic drug names with registered practitioners stamps. Click on verify once chemical combinations align with inventory.</p>
              </div>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                    <th className="px-5 py-3">Prescription Case ID</th>
                    <th className="px-5 py-3">Patient Profile Name</th>
                    <th className="px-5 py-3">Authorized Doctor</th>
                    <th className="px-5 py-3">Medicines Required</th>
                    <th className="px-5 py-3">Date Submitted</th>
                    <th className="px-5 py-3 text-center">Intake Status</th>
                    <th className="px-5 py-3 text-right">Verification Trigger</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-sans">
                  {uploadedRxs.map((rx) => (
                    <tr key={rx.id} className="hover:bg-zinc-50/50">
                      <td className="px-5 py-3.5 font-mono font-bold text-zinc-900">{rx.id}</td>
                      <td className="px-5 py-3.5 font-bold text-zinc-800">{rx.patient}</td>
                      <td className="px-5 py-3.5 font-medium text-zinc-500">{rx.docName}</td>
                      <td className="px-5 py-3.5 italic font-semibold text-sky-800">{rx.drugMatch}</td>
                      <td className="px-5 py-3.5 font-mono text-zinc-400">{rx.date}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block px-2     py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          rx.status === 'Verified' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {rx.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {rx.status !== 'Verified' ? (
                          <button
                            onClick={() => handleVerifyRx(rx.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[10px] uppercase transition"
                          >
                            Approve Rx Matches
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold flex items-center gap-1 justify-end">
                            <Check className="h-3 w-3" /> System Verified
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          /* Active orders lists */
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-80s uppercase tracking-widest flex items-center gap-1.5">
              <ShoppingCart className="h-4 w-4 text-emerald-500" /> Web & Mobile Store Active Baskets
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {preorders.map((o) => (
                <div key={o.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-zinc-800 font-bold block truncate">{o.patient}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">ID: {o.id} | {o.method}</span>
                    </div>
                    <span className="bg-zinc-900 text-zinc-100 px-2 py-0.5 rounded-full font-bold font-mono text-[9px]">
                      ₹{o.value}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-150/50 flex justify-between items-center text-[11px]">
                    <span className="text-zinc-500">Intelligent Status:</span>
                    <strong className="text-emerald-700 font-bold uppercase tracking-wider text-[10px]">{o.status}</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
