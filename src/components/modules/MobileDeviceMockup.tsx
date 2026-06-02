import React, { useState } from 'react';
import { Smartphone, Camera, Truck, ShieldCheck, MapPin, Search, ChevronRight, User, ShoppingCart, RefreshCw, CheckCircle, Package } from 'lucide-react';
import { mockProducts } from '../../data/mockData';

export default function MobileDeviceMockup() {
  const [activeMobileApp, setActiveMobileApp] = useState<'rider' | 'customer' | 'salesman'>('rider');
  
  // Rider App states
  const [otpValue, setOtpValue] = useState('');
  const [deliveredStatus, setDeliveredStatus] = useState(false);

  // Customer App states
  const [customerSearch, setCustomerSearch] = useState('');
  const [prescriptionAttached, setPrescriptionAttached] = useState(false);
  const [addedItemsCount, setAddedItemsCount] = useState(0);

  // Salesman App states
  const [orderClient, setOrderClient] = useState('Central Pharmacy Gwalior');
  const [salesLog, setSalesLog] = useState<{ client: string; items: number; status: string }[]>([
    { client: 'Gwalior Pharma Care', items: 120, status: 'Draft Sent' }
  ]);

  const handleVerifyOtp = () => {
    if (otpValue === '4402' || otpValue === '1234') {
      setDeliveredStatus(true);
      alert("OTP Verification Successful. Delivery state closed out in high-integrity database.");
    } else {
      alert("Invalid verification OTP. Authorized OTP: 1234 or 4402.");
    }
  };

  const handleSalesmanOrder = () => {
    setSalesLog([
      { client: orderClient, items: Math.floor(50 + Math.random() * 150), status: 'Approved & Syncing' },
      ...salesLog
    ]);
    alert("B2B Sales Order saved and synced to master distribution pipeline.");
  };

  return (
    <div className="flex-1 p-6 bg-zinc-50 flex items-center justify-center overflow-hidden h-full">
      {/* Container holding mockup explanation and the devices */}
      <div className="w-full max-w-5xl grid grid-cols-12 gap-8 h-full items-center">
        {/* Device Info column on left */}
        <div className="col-span-5 space-y-5 leading-relaxed text-left">
          <div>
            <span className="text-[10px] font-bold bg-sky-50 border border-sky-100 text-sky-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
              Module 13 Mobile Applications
            </span>
            <h2 className="text-xl font-bold text-zinc-800 mt-2">Active Field Applications Sandbox</h2>
            <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
              Experience the integrated smartphone applications designed for other system actors (Delivery Boys, Traveling Salesmen, and Patients) inside this immersive, high-integrity design container.
            </p>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => setActiveMobileApp('rider')}
              className={`w-full p-3 border rounded-xl text-left transition flex items-center gap-3 ${
                activeMobileApp === 'rider' ? 'bg-zinc-900 border-transparent text-white shadow-sm' : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
              }`}
            >
              <Truck className="h-5 w-5" />
              <div>
                <h4 className="text-xs font-bold leading-none">Rider & Logistics App</h4>
                <p className="text-[10px] text-zinc-400 mt-1 leading-tight">OTP Delivery authorization and route optimizations.</p>
              </div>
            </button>

            <button
              onClick={() => setActiveMobileApp('customer')}
              className={`w-full p-3 border rounded-xl text-left transition flex items-center gap-3 ${
                activeMobileApp === 'customer' ? 'bg-zinc-900 border-transparent text-white shadow-sm' : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
              }`}
            >
              <Search className="h-5 w-5" />
              <div>
                <h4 className="text-xs font-bold leading-none">Customer ePharmacy App</h4>
                <p className="text-[10px] text-zinc-400 mt-1 leading-tight">Prescription upload drawers and self-service dispatch portals.</p>
              </div>
            </button>

            <button
              onClick={() => setActiveMobileApp('salesman')}
              className={`w-full p-3 border rounded-xl text-left transition flex items-center gap-3 ${
                activeMobileApp === 'salesman' ? 'bg-zinc-900 border-transparent text-white shadow-sm' : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-50'
              }`}
            >
              <Smartphone className="h-5 w-5" />
              <div>
                <h4 className="text-xs font-bold leading-none">Traveling Salesman Tool</h4>
                <p className="text-[10px] text-zinc-400 mt-1 leading-tight">B2B Order booking arrays matching regional stocks.</p>
              </div>
            </button>
          </div>
        </div>

        {/* Dynamic Smartphone Viewport Container Mockup */}
        <div className="col-span-7 flex justify-center h-full max-h-[580px] overflow-hidden py-4 select-none">
          <div className="w-72 border-[12px] border-zinc-800 bg-black rounded-[36px] shadow-2xl relative flex flex-col overflow-hidden aspect-[9/18.5] flex-shrink-0">
            {/* Phone Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-5 bg-zinc-800 rounded-b-xl z-50 flex items-center justify-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-zinc-900"></span>
              <span className="w-8 h-1 bg-zinc-900 rounded-full"></span>
            </div>

            {/* Smart Screen Canvas */}
            <div className="flex-1 bg-slate-50 pt-5 flex flex-col overflow-hidden text-zinc-800">
              
              {/* --- 1. RIDER DELIVERY APP VIEW --- */}
              {activeMobileApp === 'rider' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="p-3 bg-zinc-900 text-white flex items-center justify-between">
                    <span className="text-[10px] font-bold font-mono">APOTHECARY LOGISTICS DISPATCH</span>
                    <span className="text-[9px] text-sky-400 font-bold select-all">OTP_REQ</span>
                  </div>

                  {/* Delivery Info */}
                  <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
                    {/* Routing */}
                    <div className="bg-white border border-zinc-200 p-2.5 rounded-xl text-left">
                      <div className="flex gap-2 text-xs">
                        <MapPin className="h-4.5 w-4.5 text-rose-500 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-bold text-zinc-800">Dispatch Order #LOG-9942</p>
                          <p className="text-[9px] text-zinc-450 leading-normal mt-0.5">Aditya Vardhan, Sector 15 Noida — MCA-302</p>
                        </div>
                      </div>
                      <div className="border-t border-dashed border-zinc-100 pt-2.5 mt-2.5 text-[9px] text-zinc-500 flex gap-2">
                        <span>Items: <strong className="text-zinc-700">Calpol 650, Alprax</strong></span>
                        <span>COD Cash: <strong className="text-zinc-700">₹240.00</strong></span>
                      </div>
                    </div>

                    {/* Verification Panel */}
                    <div className="bg-amber-50/15 border border-dashed border-amber-300 p-3 rounded-xl text-left space-y-2">
                      <p className="text-[9px] font-bold text-amber-800 uppercase tracking-widest leading-none">Security OTP Verification</p>
                      <p className="text-[9px] text-amber-705 leading-normal">Enter security OTP provided by recipient Patient to complete legal ledger log verification.</p>
                      
                      {deliveredStatus ? (
                        <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 font-bold text-[10px] p-2 rounded-lg flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" /> DISPATCH COMPLETED
                        </div>
                      ) : (
                        <div className="flex gap-1.5">
                          <input
                            type="text"
                            placeholder="Enter 4-Digital OTP (1234)"
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            className="bg-white border border-zinc-250 py-1 px-2 text-xs font-mono font-bold w-full rounded focus:outline-none"
                          />
                          <button
                            onClick={handleVerifyOtp}
                            className="bg-zinc-800 hover:bg-black text-white font-extrabold text-[9px] leading-none px-2 rounded hover:shadow-xs transition"
                          >
                            VERIFY
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="p-2.5 bg-zinc-950 text-center text-[9px] text-zinc-400 font-mono">
                    Rider Profile: Satyender Verma #R8
                  </div>
                </div>
              )}

              {/* --- 2. CUSTOMER ePHARMACY APP VIEW --- */}
              {activeMobileApp === 'customer' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="p-3 bg-sky-600 text-white flex items-center justify-between">
                    <span className="text-[10px] font-bold">APOTHECARY CONSUMER DISPATCH</span>
                    <User className="h-3.5 w-3.5" />
                  </div>

                  <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto">
                    {/* Search bar */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search medicines..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        className="w-full text-[10px] px-2.5 py-1.5 bg-white border border-zinc-200 rounded-lg text-zinc-800"
                      />
                    </div>

                    {/* Upload Rx script */}
                    <div className="p-3 bg-sky-50/15 border border-sky-300 rounded-xl text-left space-y-1.5 cursor-pointer hover:bg-sky-50 transition">
                      <div className="flex items-center gap-1 text-sky-800">
                        <Camera className="h-4 w-4" />
                        <span className="text-[10px] font-bold uppercase leading-none">Instant Rx Prescription Sync</span>
                      </div>
                      <p className="text-[9px] text-sky-650 leading-normal">Upload prescription photo directly. Our AI scanner automatically processes order listings.</p>
                      
                      {prescriptionAttached ? (
                        <span className="text-[9px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-full block text-center">
                          Prescription Staged Successfully ✓
                        </span>
                      ) : (
                        <button
                          onClick={() => setPrescriptionAttached(true)}
                          className="w-full bg-sky-600 hover:bg-sky-750 text-white font-bold text-[9px] py-1 rounded transition"
                        >
                          Choose from Photo Folder
                        </button>
                      )}
                    </div>

                    {/* Fast Medicines catalogue items */}
                    <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                      {mockProducts.map(p => (
                        <div key={p.id} className="p-2 border border-zinc-200 rounded-lg bg-white flex items-center justify-between text-left">
                          <div>
                            <h5 className="text-[10px] font-bold text-zinc-800 leading-none">{p.name}</h5>
                            <span className="text-[8px] text-zinc-400 mt-1 leading-none">{p.salt}</span>
                          </div>
                          <button
                            onClick={() => {
                              setAddedItemsCount(addedItemsCount + 1);
                              alert(`${p.name} added to cart.`);
                            }}
                            className="bg-zinc-100 hover:bg-zinc-200 text-zinc-700 font-extrabold text-[9px] border leading-none p-1 rounded px-2"
                          >
                            Add
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 bg-zinc-900 border-t border-zinc-850 flex items-center justify-between text-white text-[10px] font-mono">
                    <span>Cart: {addedItemsCount} Items</span>
                    <button
                      onClick={() => {
                        if (addedItemsCount === 0) {
                          alert("Your cart is empty.");
                          return;
                        }
                        alert("Self check-out order recorded. Standard click-and-collect billing issued.");
                        setAddedItemsCount(0);
                      }}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-bold px-3 py-1 rounded"
                    >
                      Checkout
                    </button>
                  </div>
                </div>
              )}

              {/* --- 3. Traveling Salesman B2B Tool --- */}
              {activeMobileApp === 'salesman' && (
                <div className="flex-1 flex flex-col justify-between overflow-hidden">
                  <div className="p-3 bg-zinc-900 text-white flex items-center justify-between">
                    <span className="text-[10px] font-bold">B2B SALES RECORD BOARDS</span>
                  </div>

                  <div className="flex-1 p-3.5 space-y-3 overflow-y-auto">
                    <div className="bg-white border rounded-xl p-3 text-left space-y-2.5">
                      <div>
                        <label className="text-[10px] font-bold text-zinc-405 uppercase block mb-1">Target B2B Chemist Stockist</label>
                        <select
                          value={orderClient}
                          onChange={(e) => setOrderClient(e.target.value)}
                          className="w-full text-[10px] border px-2 py-1.5 rounded"
                        >
                          <option value="Downtown Retail Franchise #12">Retail Franchise #12</option>
                          <option value="Central Pharmacy Gwalior">Central Pharmacy Gwalior</option>
                          <option value="Apollo Stockist Logistics East">Apollo Stockist East</option>
                        </select>
                      </div>

                      <button
                        onClick={handleSalesmanOrder}
                        className="w-full bg-zinc-900 hover:bg-black text-white font-bold text-[9px] py-1.5 rounded transition"
                      >
                        BOOK ORDER & PUSH IBT
                      </button>
                    </div>

                    {/* Sales Order Logs History */}
                    <div className="space-y-1.5 text-left">
                      <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1 shadow-none">Commit Ledger Orders</p>
                      {salesLog.map((log, idx) => (
                        <div key={idx} className="p-2 border rounded-lg bg-zinc-100 flex items-center justify-between text-[10px]">
                          <div>
                            <span className="font-bold text-zinc-800">{log.client}</span>
                            <p className="text-[8px] text-zinc-450 mt-1">Staged Volume: {log.items} Packs</p>
                          </div>
                          <span className="text-[8px] bg-emerald-50 text-emerald-800 border font-extrabold px-1.5 py-0.5 rounded">
                            {log.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-2 bg-zinc-950 text-center text-[9px] text-zinc-400 font-mono">
                    Sales Rep: Satya Verma #REP9
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
