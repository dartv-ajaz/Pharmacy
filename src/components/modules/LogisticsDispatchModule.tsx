import React, { useState } from 'react';
import { 
  Truck, ShieldAlert, Key, MapPin, CheckCircle, Search, 
  HelpCircle, ChevronRight, Activity, Thermometer, User 
} from 'lucide-react';

export default function LogisticsDispatchModule() {
  const [activeSubTab, setActiveSubTab] = useState<'shipments' | 'riders'>('shipments');
  const [searchQuery, setSearchQuery] = useState('');

  const [shipments, setShipments] = useState([
    { id: 'SH-4091', patient: 'Swati Sen', city: 'Delhi Sector 4', temp: '4.5°C', status: 'In Transit', rider: 'Rajesh Kumar', otp: '4921', class: 'Cold Chain Insulin' },
    { id: 'SH-4090', patient: 'Karan Mehra', city: 'Noida Blocks', temp: 'Room Temp', status: 'Assigned', rider: 'Amit Saini', otp: '2019', class: 'General OTC Medicines' },
    { id: 'SH-4089', patient: 'Gaurav Kumar', city: 'Vasant Kunj', temp: '5.1°C', status: 'Delivered', rider: 'Amit Saini', otp: '8821', class: 'Cold Chain Vaccine' }
  ]);

  const [riders, setRiders] = useState([
    { id: 'RID01', name: 'Rajesh Kumar', phone: '9899014321', activeShipments: 1, bikeReg: 'DL-3C-S-9021', status: 'On Delivery Duty' },
    { id: 'RID02', name: 'Amit Saini', phone: '8092144356', activeShipments: 2, bikeReg: 'HR-26-Y-1209', status: 'Active Duty' },
    { id: 'RID03', name: 'Manish Singh', phone: '7611090123', activeShipments: 0, bikeReg: 'UP-16-R-9988', status: 'Standby/Idle' }
  ]);

  const [otpVerifyInput, setOtpVerifyInput] = useState('');
  const [activeOtpShipmentId, setActiveOtpShipmentId] = useState('');
  const [verificationSuccess, setVerificationSuccess] = useState(false);

  const triggerOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const sh = shipments.find(s => s.id === activeOtpShipmentId);
    if (sh && sh.otp === otpVerifyInput) {
      setShipments(shipments.map(s => s.id === activeOtpShipmentId ? { ...s, status: 'Delivered' } : s));
      setVerificationSuccess(true);
      setOtpVerifyInput('');
      setTimeout(() => setVerificationSuccess(false), 2000);
    } else {
      alert("Invalid Security OTP. Double-entry courier check failed.");
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto text-xs">
      {/* SCM Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Truck className="h-4 w-4 text-emerald-500" />
            Module 15: Logistics Dispatch & OTP Courier Ring
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Control cold chain biological shipments, coordinate rider networks, and secure delicate drop-offs using verification PIN keys.</p>
        </div>

        <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('shipments')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'shipments' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Cold-Chain Shipments ({shipments.length})
          </button>
          <button
            onClick={() => setActiveSubTab('riders')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'riders' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Rider Vehicle Fleet Registers ({riders.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === 'shipments' ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* OTP Courier Verification Box */}
            <div className="bg-white border border-zinc-200 p-5 rounded-xl text-xs shadow-sm space-y-4 h-fit">
              <h3 className="text-xs font-bold text-zinc-850 uppercase tracking-wider flex items-center gap-1.5 pb-2 border-b border-zinc-100">
                <Key className="h-4 w-4 text-emerald-500" /> Courier Drop-Off OTP validator
              </h3>

              <form onSubmit={triggerOtpSubmit} className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Select Target Shipment Log</label>
                  <select
                    value={activeOtpShipmentId}
                    onChange={(e) => setActiveOtpShipmentId(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-zinc-850 focus:outline-none"
                  >
                    <option value="">-- Choose active delivery --</option>
                    {shipments.filter(s => s.status !== 'Delivered').map(s => (
                      <option key={s.id} value={s.id}>{s.patient} - {s.id} ({s.class})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Rider Drop PIN (Shared on SMS)</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter 4-digit security code..."
                    value={otpVerifyInput}
                    onChange={(e) => setOtpVerifyInput(e.target.value)}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-zinc-800 focus:outline-none font-mono text-center tracking-widest font-black text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={!activeOtpShipmentId}
                  className="w-full h-10 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold rounded-lg transition uppercase text-[10px] tracking-wide"
                >
                  Verify Code & Settle delivery
                </button>

                {verificationSuccess && (
                  <div className="p-2.5 bg-emerald-50 text-emerald-700 text-center font-bold rounded border border-emerald-200 uppercase tracking-wide text-[10px]">
                    ✓ OTP Confirmed. Shipment Updated!
                  </div>
                )}
              </form>
            </div>

            {/* List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                      <th className="px-5 py-3">Dispatch Code</th>
                      <th className="px-5 py-3">Patient Profile Name</th>
                      <th className="px-5 py-3">Shipment class</th>
                      <th className="px-5 py-3">Cold Temp Tracker</th>
                      <th className="px-5 py-3">Assigned Dispatcher</th>
                      <th className="px-5 py-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 font-sans">
                    {shipments.map((s) => (
                      <tr key={s.id} className="hover:bg-zinc-50/50">
                        <td className="px-5 py-3.5 font-mono font-bold text-zinc-900">{s.id}</td>
                        <td className="px-5 py-3.5 font-bold text-zinc-800">{s.patient}</td>
                        <td className="px-5 py-3.5 text-zinc-500">{s.class}</td>
                        <td className="px-5 py-3.5 font-semibold text-zinc-800 font-mono">
                          <span className="flex items-center gap-1">
                            <Thermometer className="h-3.5 w-3.5 text-sky-500" />
                            {s.temp}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-700 font-semibold">{s.rider}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block px-1.5 py-0.5 rounded text-[9px] font-mono font-black uppercase tracking-wider ${
                            s.status === 'Delivered' ? 'bg-emerald-50 text-emerald-700' : 'bg-sky-50 text-sky-700 border border-sky-100'
                          }`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        ) : (
          /* Active riders */
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-80s uppercase tracking-widest">
              Active Rider Fleet Map Registers
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {riders.map((r) => (
                <div key={r.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-zinc-200 rounded">
                        <User className="h-4 w-4 text-zinc-650" />
                      </div>
                      <div>
                        <strong className="text-zinc-850 font-bold block truncate">{r.name}</strong>
                        <span className="text-[10px] text-zinc-500 font-mono">{r.id} | {r.phone}</span>
                      </div>
                    </div>
                    <span className="bg-slate-900 text-slate-100 px-2 py-0.5 rounded text-[9px] font-bold">
                      {r.status}
                    </span>
                  </div>

                  <div className="pt-2 border-t border-zinc-200/60 flex justify-between text-zinc-500">
                    <span>Bike registration #:</span>
                    <strong className="font-mono text-zinc-900">{r.bikeReg}</strong>
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
