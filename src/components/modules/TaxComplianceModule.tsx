import React, { useState } from 'react';
import { Landmark, FileText, Download, CheckCircle, Car, ArrowUpRight, Search, Activity, HelpCircle } from 'lucide-react';
import { mockInvoices } from '../../data/mockData';

export default function TaxComplianceModule() {
  const [invoices, setInvoices] = useState(mockInvoices);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(mockInvoices[0]?.id || '');
  const [vehicleNo, setVehicleNo] = useState('DL-1CA-5509');
  const [transporter, setTransporter] = useState('Delhi Cargo logistics');
  const [distance, setDistance] = useState(45);
  const [activeTab, setActiveTab] = useState<'returns' | 'eway' | 'e-invoice'>('returns');
  const [ewayStatus, setEwayStatus] = useState<string | null>(null);

  // Financial Math based on invoices:
  const taxableSubtotal = invoices.reduce((sum, inv) => sum + (inv.totals.subtotal - inv.totals.discount), 0);
  const cgstLiability = invoices.reduce((sum, inv) => sum + inv.totals.cgst, 0);
  const sgstLiability = invoices.reduce((sum, inv) => sum + inv.totals.sgst, 0);
  const igstLiability = invoices.reduce((sum, inv) => sum + inv.totals.igst, 0);
  const totalTaxCollected = cgstLiability + sgstLiability + igstLiability;

  const currentInvoice = invoices.find(inv => inv.id === selectedInvoiceId) || invoices[0];

  const handleGenerateEwayBill = (e: React.FormEvent) => {
    e.preventDefault();
    setEwayStatus('processing');
    setTimeout(() => {
      // Dynamic Eway Bill ID
      const randomEwayNum = Math.floor(100000000000 + Math.random() * 900000000000);
      setEwayStatus(`GST E-Way Bill approved successfully! Reference ID: EWB-${randomEwayNum}. Transporter assigned: ${transporter} via Vehicle ${vehicleNo}.`);
    }, 1200);
  };

  const handleDownloadTaxJson = () => {
    // Generate actual conformant tax structure JSON
    const gstrJson = {
      complianceRef: "GSTIN-09AABCM3928L1Z9-GSTR1-2026-06",
      filingPeriod: "2026-06",
      gstin: "09AABCM3928L1Z9",
      statistics: {
        totalInvoices: invoices.length,
        taxableTurnover: taxableSubtotal,
        cgstTotal: cgstLiability,
        sgstTotal: sgstLiability,
        igstTotal: igstLiability,
        grandTotal: taxableSubtotal + totalTaxCollected
      },
      b2bRecords: invoices.map(inv => ({
        invoiceNum: inv.invoiceNumber,
        invoiceDate: inv.date,
        originalValue: inv.totals.grandTotal,
        taxableAmt: inv.totals.subtotal - inv.totals.discount,
        taxDetails: {
          cgst: inv.totals.cgst,
          sgst: inv.totals.sgst,
          igst: inv.totals.igst
        },
        purchaserName: inv.customerName,
        purchaserContact: inv.customerPhone
      }))
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(gstrJson, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `GSTR1_COMPILE_PERIOD_2026_06.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* Upper banner */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Landmark className="h-4 w-4 text-emerald-600" />
            Module 08: GST & E-Invoicing Compliance Terminal
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Automated GSTR-1, GSTR-3B pre-auditing, digital E-way bills, and government JSON compilers.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-zinc-100 p-1.5 rounded-lg border border-zinc-200 shrink-0">
          <button
            onClick={() => setActiveTab('returns')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeTab === 'returns' ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            GST Returns Registry
          </button>
          <button
            onClick={() => setActiveTab('eway')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeTab === 'eway' ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            National E-Way Bill Dispenser
          </button>
          <button
            onClick={() => setActiveTab('e-invoice')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeTab === 'e-invoice' ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Digital E-Invoicing
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'returns' && (
          <div className="space-y-6">
            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-sm">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">GSTR Taxable Volume</span>
                <span className="text-base font-black text-zinc-800 font-mono mt-1 block">₹{taxableSubtotal.toLocaleString('en-IN')}.00</span>
                <span className="text-[9px] text-emerald-600 font-semibold mt-1 inline-block">✓ Audited Against Ledger</span>
              </div>
              <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-sm">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">CGST Collected Output</span>
                <span className="text-base font-black text-zinc-800 font-mono mt-1 block text-sky-600">₹{cgstLiability.toLocaleString('en-IN')}.00</span>
                <span className="text-[9px] text-zinc-400 mt-1 inline-block">SGST mirror match certified</span>
              </div>
              <div className="bg-white p-4.5 rounded-xl border border-zinc-200 shadow-sm">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">IGST (Interstate) Liability</span>
                <span className="text-base font-black text-zinc-800 font-mono mt-1 block">₹{igstLiability.toLocaleString('en-IN')}.00</span>
                <span className="text-[9px] text-zinc-400 mt-1 inline-block">Branch transfers offset</span>
              </div>
              <div className="bg-emerald-900 text-white p-4.5 rounded-xl border border-emerald-850 shadow-sm justify-between flex flex-col">
                <div>
                  <span className="text-[10px] font-bold text-emerald-300 uppercase tracking-wider block">Total GSTR-1 Tax Debt</span>
                  <span className="text-lg font-black font-mono mt-1 block text-emerald-100">₹{totalTaxCollected.toLocaleString('en-IN')}.00</span>
                </div>
                <button
                  onClick={handleDownloadTaxJson}
                  className="mt-3.5 w-full py-1.5 bg-white text-emerald-900 rounded text-[10px] uppercase tracking-wider font-extrabold flex items-center justify-center gap-1 hover:bg-emerald-50 transition-all"
                >
                  <Download className="h-3 w-3" /> Export Portal JSON
                </button>
              </div>
            </div>

            {/* Invoices audits */}
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <div className="px-5 py-4 border-b border-zinc-150 flex justify-between items-center bg-zinc-50/50">
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Activity className="h-4 w-4 text-emerald-500" /> Active Period Sales Invoices Tax Audit Ledger
                </h3>
              </div>

              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-150/40 border-b border-zinc-200 text-[10px] font-bold text-zinc-650 uppercase tracking-wider">
                    <th className="px-5 py-3">Invoice Ref</th>
                    <th className="px-5 py-3">Party Name</th>
                    <th className="px-5 py-3 text-center">Taxable Sum</th>
                    <th className="px-5 py-3 text-center">CGST liability</th>
                    <th className="px-5 py-3 text-center">SGST liability</th>
                    <th className="px-5 py-3 text-center">IGST liability</th>
                    <th className="px-5 py-3">Filing compliance status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {invoices.map((inv) => (
                    <tr key={inv.id} className="hover:bg-zinc-50/50">
                      <td className="px-5 py-3.5 font-mono font-bold text-zinc-900">{inv.invoiceNumber}</td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-zinc-805">{inv.customerName}</span>
                        <div className="text-[10px] text-zinc-400 font-mono">{inv.customerPhone}</div>
                      </td>
                      <td className="px-5 py-3.5 text-center font-mono font-semibold text-zinc-700">₹{(inv.totals.subtotal - inv.totals.discount).toLocaleString('en-IN')}</td>
                      <td className="px-5 py-3.5 text-center font-mono text-sky-600">₹{inv.totals.cgst}</td>
                      <td className="px-5 py-3.5 text-center font-mono text-sky-600">₹{inv.totals.sgst}</td>
                      <td className="px-5 py-3.5 text-center font-mono text-zinc-500">₹{inv.totals.igst}</td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-100">
                          Ready for portal
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'eway' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Eway Bill details form */}
            <form onSubmit={handleGenerateEwayBill} className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2 mb-2">
                <Car className="h-4 w-4 text-emerald-600" /> Transporter & Vehicle Parameters
              </h3>

              <div className="space-y-3.5 text-xs text-zinc-700">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Linked Invoice Reference</label>
                  <select
                    value={selectedInvoiceId}
                    onChange={(e) => setSelectedInvoiceId(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs font-mono text-zinc-800 focus:outline-none"
                  >
                    {invoices.map(inv => (
                      <option key={inv.id} value={inv.id}>{inv.invoiceNumber} ({inv.customerName})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Transporter Agency</label>
                  <input
                    type="text"
                    value={transporter}
                    onChange={(e) => setTransporter(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none"
                    placeholder="e.g. BlueDart Logistics"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Vehicle Registration No</label>
                    <input
                      type="text"
                      value={vehicleNo}
                      onChange={(e) => setVehicleNo(e.target.value)}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs font-mono focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Route Distance (KM)</label>
                    <input
                      type="number"
                      value={distance}
                      onChange={(e) => setDistance(Math.max(1, Number(e.target.value)))}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-805"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                Assemble National E-Way Bill Number
              </button>
            </form>

            {/* Eway Bill Preview output */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-zinc-800 text-zinc-300 p-4 rounded-xl text-xs flex justify-between items-center">
                <span>E-Way Bill NIC Web Portal Simulation Gateway</span>
                <span className="font-mono bg-zinc-700 text-zinc-301 px-2 py-0.5 rounded font-bold uppercase text-[9px]">status: Connected</span>
              </div>

              {ewayStatus === 'processing' ? (
                <div className="bg-white border select-none border-zinc-200 shadow-xl rounded-2xl p-16 flex flex-col justify-center items-center text-center space-y-3">
                  <div className="h-6 w-6 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin"></div>
                  <p className="text-xs text-zinc-500 font-medium">Communicating with GSTIN National NIC Gateway. Signing authorization keys...</p>
                </div>
              ) : ewayStatus ? (
                <div className="bg-white border border-zinc-300 rounded-2xl shadow-xl p-6 space-y-4 font-mono text-[11px] text-zinc-700 leading-relaxed">
                  <div className="flex justify-between items-start border-b border-zinc-150 pb-3">
                    <div>
                      <span className="text-[9px] text-zinc-400 block font-bold">GOVERNMENT OF INDIA</span>
                      <span className="text-xs font-black text-zinc-900 uppercase">E-WAY BILL CERTIFICATE FORM PART-A</span>
                    </div>
                    <span className="text-[10px] px-2.5 py-0.5 bg-emerald-50 border border-emerald-250 text-emerald-800 rounded font-bold uppercase">APPROVED</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-[8px] text-zinc-400 block font-bold">E-WAY BILL NUMBER</span>
                      <span className="font-bold text-zinc-904 text-xs">{ewayStatus.split('Reference ID: ')[1]?.split('.')[0] || '102931823902'}</span>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 block font-bold">GENERATION TIMESTAMP</span>
                      <span className="font-bold text-zinc-904">2026-06-02 04:05:00 UTC</span>
                    </div>
                  </div>

                  <div className="border-t border-zinc-150 pt-3 grid grid-cols-2 gap-3.5">
                    <div>
                      <span className="text-[8px] text-zinc-400 block">BILL FROM GSTIN</span>
                      <strong className="text-zinc-800">09AABCM3928L1Z9</strong>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-400 block">RECONCILED PARTY INVOICE</span>
                      <strong className="text-zinc-850">{currentInvoice.invoiceNumber}</strong>
                    </div>
                  </div>

                  <div className="border-t border-dashed border-zinc-150 pt-3 flex justify-between text-zinc-600">
                    <div>Vehicle Assigned: <strong className="text-zinc-800">{vehicleNo}</strong></div>
                    <div>Transporter: <strong className="text-zinc-800">{transporter}</strong></div>
                    <div>Distance: <strong className="text-zinc-800">{distance} KM</strong></div>
                  </div>

                  <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-lg text-[10px] leading-relaxed text-zinc-400">
                    NOTICE: Carrying pharmaceutical batches without an authenticated NIC registered E-Way bill invites serious SCM audit confiscation. This certificate is legally validated for 48 hours.
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-dashed border-zinc-200 select-none p-16 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
                  <Car className="h-8 w-8 text-zinc-300" />
                  <p className="text-xs text-zinc-400">Input vehicles transport logistics on the left to test National E-Way bill generation.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'e-invoice' && (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-205 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5 pt-1">
                <FileText className="h-4 w-4 text-emerald-500" /> Government IRP E-Invoicing Integration
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-2xl">
                Pharmaceutical enterprise sales invoices with totals exceeding general compliance parameters require automated E-invoice registration with a unique Invoice Reference Number (IRN) signed by the national Invoice Registration Portal (IRP).
              </p>

              <div className="bg-zinc-900 border border-zinc-800 text-lime-400 font-mono p-5 rounded-xl text-xs space-y-2">
                <div>// CHANNELS STATUS: CONNECTED TO CENTRAL IRP APIS (SANDBOX DEMO MODE)</div>
                <div>// REGISTERED ENTERPRISE CERTIFICATE: <strong>09AABCM3928L1Z9 (Apothecary Labs)</strong></div>
                <div className="text-zinc-400 mt-4">// Active REST handshake:</div>
                <div className="text-white">POST https://api.einvoice1.gst.gov.in/api/v1/generateIRN</div>
                <div className="text-sky-300">HEADER: "x-cleartax-authorization": "JWT_PROD_VAL_SEC_1102"</div>
                <div className="text-zinc-400">// Handshake Response payload signature:</div>
                <div className="text-orange-300">JSON_BODY: {"{"} irn: "78f921ea02019ab002cc3ea022938a...", ackNo: "220912", status: "ACKNOWLEDGED_COMPACT" {"}"}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
