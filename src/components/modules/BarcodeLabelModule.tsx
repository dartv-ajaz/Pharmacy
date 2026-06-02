import React, { useState } from 'react';
import { Barcode, Settings, Printer, Download, ToggleLeft, ToggleRight, Check } from 'lucide-react';
import { mockProducts, mockBatches } from '../../data/mockData';

export default function BarcodeLabelModule() {
  const [selectedProductId, setSelectedProductId] = useState(mockProducts[0]?.id || '');
  const [selectedBatchId, setSelectedBatchId] = useState(mockBatches[0]?.id || '');
  
  // Custom states/options
  const [showSalt, setShowSalt] = useState(true);
  const [showMrp, setShowMrp] = useState(true);
  const [showExpiry, setShowExpiry] = useState(true);
  const [showQr, setShowQr] = useState(true);
  const [barcodeLayout, setBarcodeLayout] = useState<'Standard 3x2' | 'Dense 2x1' | 'Shelf Edge'>('Standard 3x2');
  const [copies, setCopies] = useState(5);
  const [printStatus, setPrintStatus] = useState<string | null>(null);

  const selectedProduct = mockProducts.find(p => p.id === selectedProductId) || mockProducts[0];
  const relatedBatches = mockBatches.filter(b => b.productId === selectedProduct.id);
  
  // Ensure we fall back to a legal related batch
  const activeBatch = relatedBatches.find(b => b.id === selectedBatchId) || relatedBatches[0] || mockBatches[0];

  const handleTriggerPrint = (e: React.FormEvent) => {
    e.preventDefault();
    setPrintStatus('initializing');
    setTimeout(() => {
      setPrintStatus('sending');
      setTimeout(() => {
        setPrintStatus(`Successfully queued ${copies} copies of label (${selectedProduct.name} - ${activeBatch.batchNumber}) to TSC Zebra printer!`);
      }, 1000);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* Page Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Barcode className="h-4 w-4 text-indigo-500" />
            Module 06: High-Density Barcode & Shelf Label Generator
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Custom layout rendering, regulatory batch coding, and shelf edge ticketing.</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Properties control menu */}
        <form onSubmit={handleTriggerPrint} className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2 mb-2">
            <Settings className="h-4 w-4 text-zinc-400" /> Label Setup & Sizing
          </h3>

          <div className="space-y-3.5 text-xs text-zinc-700">
            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase">Product Select</label>
              <select
                value={selectedProductId}
                onChange={(e) => {
                  setSelectedProductId(e.target.value);
                  const related = mockBatches.filter(b => b.productId === e.target.value);
                  if (related.length > 0) setSelectedBatchId(related[0].id);
                }}
                className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 focus:outline-none focus:border-sky-500"
              >
                {mockProducts.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-500 uppercase">Batch Assignment</label>
              <select
                value={selectedBatchId}
                onChange={(e) => setSelectedBatchId(e.target.value)}
                className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 focus:outline-none"
              >
                {relatedBatches.map(b => (
                  <option key={b.id} value={b.id}>{b.batchNumber} (Stock: {b.stockQty} / Exp: {b.expiryDate})</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Label Layout Sheet</label>
                <select
                  value={barcodeLayout}
                  onChange={(e) => setBarcodeLayout(e.target.value as any)}
                  className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none"
                >
                  <option value="Standard 3x2">Standard 3" x 2"</option>
                  <option value="Dense 2x1">Vial Dense 2" x 1"</option>
                  <option value="Shelf Edge">Shelf Talker Edge</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-500 uppercase">Print Quantity</label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={copies}
                  onChange={(e) => setCopies(Math.max(1, Number(e.target.value)))}
                  className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-805"
                />
              </div>
            </div>

            {/* Toggle Switches */}
            <div className="pt-2.5 border-t border-zinc-100 space-y-2.5">
              <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-widest">Metadata Toggle</span>
              
              <div className="flex justify-between items-center text-xs">
                <span>Print Chemical Salt Info</span>
                <button type="button" onClick={() => setShowSalt(!showSalt)} className="text-zinc-500">
                  {showSalt ? <ToggleRight className="h-6 w-6 text-sky-500" /> : <ToggleLeft className="h-6 w-6 text-zinc-300" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span>Display Pack Price & Margin</span>
                <button type="button" onClick={() => setShowMrp(!showMrp)} className="text-zinc-500">
                  {showMrp ? <ToggleRight className="h-6 w-6 text-sky-500" /> : <ToggleLeft className="h-6 w-6 text-zinc-300" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span>Expiry Alert Warnings</span>
                <button type="button" onClick={() => setShowExpiry(!showExpiry)} className="text-zinc-500">
                  {showExpiry ? <ToggleRight className="h-6 w-6 text-sky-500" /> : <ToggleLeft className="h-6 w-6 text-zinc-300" />}
                </button>
              </div>

              <div className="flex justify-between items-center text-xs">
                <span>Inject Matrix QR Trace</span>
                <button type="button" onClick={() => setShowQr(!showQr)} className="text-zinc-500">
                  {showQr ? <ToggleRight className="h-6 w-6 text-sky-500" /> : <ToggleLeft className="h-6 w-6 text-zinc-300" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full h-11 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Printer className="h-4 w-4" /> Trigger Thermal Batch Print
            </button>
          </div>
        </form>

        {/* Right Column: Dynamic Sticker Preview render */}
        <div className="lg:col-span-7 flex flex-col justify-start space-y-4">
          <div className="bg-zinc-800 border border-zinc-750 text-white p-4.5 rounded-xl flex justify-between items-center text-xs">
            <span className="font-semibold text-zinc-300">Live Sticker Matrix Emulator </span>
            <span className="text-[10px] font-mono bg-zinc-700 px-2 py-0.5 rounded text-zinc-300 font-bold uppercase">{barcodeLayout} layout</span>
          </div>

          {/* Interactive render canvas container matching Zebra physical constraints */}
          <div className="border border-zinc-300 bg-white shadow-xl rounded-2xl p-8 flex items-center justify-center flex-grow min-h-[300px]">
            <div className={`p-5 bg-white border border-dashed border-zinc-300 rounded-lg shadow-sm flex flex-col justify-between ${
              barcodeLayout === 'Standard 3x2' ? 'w-96 h-60' : barcodeLayout === 'Dense 2x1' ? 'w-80 h-44' : 'w-full h-44'
            }`}>
              
              {/* Sticker Content Top */}
              <div className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[9px] font-mono font-bold uppercase text-zinc-400">APOTHECARY BIOPHARM</span>
                    <h4 className="text-sm font-black text-zinc-900 leading-none">{selectedProduct.name}</h4>
                  </div>
                  <span className="text-[10px] font-black font-mono border-2 border-zinc-900 px-1 py-0.2 rounded uppercase">
                    {selectedProduct.category}
                  </span>
                </div>

                {showSalt && (
                  <p className="text-[9px] text-zinc-500 font-mono italic shrink-0 truncate">{selectedProduct.salt}</p>
                )}
              </div>

              {/* Sticker Center (Variable Data) */}
              <div className="grid grid-cols-2 gap-2 text-[9.5px] font-semibold text-zinc-700 border-t border-b border-zinc-150 py-2 font-mono">
                <div>
                  <div>BATCH: <strong className="text-zinc-900 text-xs font-bold">{activeBatch?.batchNumber || 'N/A'}</strong></div>
                  {showExpiry && (
                    <div>EXPIRY: <strong className="text-rose-600 font-black">{activeBatch?.expiryDate || 'N/A'}</strong></div>
                  )}
                </div>
                {showMrp && (
                  <div className="text-right">
                    <div>MRP: <strong className="text-zinc-900 text-xs font-black">₹{activeBatch?.mrp || '0'}.00</strong></div>
                    <div className="text-[8px] text-zinc-400">RACK: {selectedProduct.rackLocation || 'Rack A-2'}</div>
                  </div>
                )}
              </div>

              {/* Sticker Bottom (Barcode / QR representation) */}
              <div className="flex items-center justify-between pt-1">
                {/* SVG Barcode generator */}
                <div className="flex-1 flex flex-col justify-center items-start">
                  <svg className="h-8 w-56 text-zinc-900 shrink-0 select-none pointer-events-none" viewBox="0 0 100 20" preserveAspectRatio="none">
                    <rect x="0" y="0" width="3" height="20" fill="currentColor"/>
                    <rect x="5" y="0" width="1" height="20" fill="currentColor"/>
                    <rect x="8" y="0" width="4" height="20" fill="currentColor"/>
                    <rect x="14" y="0" width="1" height="20" fill="currentColor"/>
                    <rect x="17" y="0" width="2" height="20" fill="currentColor"/>
                    <rect x="21" y="0" width="4" height="20" fill="currentColor"/>
                    <rect x="27" y="0" width="1" height="20" fill="currentColor"/>
                    <rect x="30" y="0" width="3" height="20" fill="currentColor"/>
                    <rect x="35" y="0" width="2" height="20" fill="currentColor"/>
                    <rect x="39" y="0" width="4" height="20" fill="currentColor"/>
                    <rect x="45" y="0" width="1" height="20" fill="currentColor"/>
                    <rect x="48" y="0" width="3" height="20" fill="currentColor"/>
                    <rect x="53" y="0" width="2" height="20" fill="currentColor"/>
                    <rect x="57" y="0" width="4" height="20" fill="currentColor"/>
                    <rect x="63" y="0" width="1" height="20" fill="currentColor"/>
                    <rect x="66" y="0" width="3" height="20" fill="currentColor"/>
                    <rect x="71" y="0" width="2" height="20" fill="currentColor"/>
                    <rect x="75" y="0" width="4" height="20" fill="currentColor"/>
                    <rect x="81" y="0" width="1" height="20" fill="currentColor"/>
                    <rect x="84" y="0" width="3" height="20" fill="currentColor"/>
                    <rect x="89" y="0" width="2" height="20" fill="currentColor"/>
                    <rect x="93" y="0" width="4" height="20" fill="currentColor"/>
                    <rect x="98" y="0" width="2" height="20" fill="currentColor"/>
                  </svg>
                  <span className="text-[8px] font-mono font-medium tracking-[0.25em] text-zinc-400 mt-1">*{selectedProduct.id}-{activeBatch?.batchNumber}*</span>
                </div>

                {/* SVG Matrix QR code */}
                {showQr && (
                  <div className="h-10 w-10 shrink-0 border border-zinc-200 p-0.5 rounded flex items-center justify-center">
                    <svg viewBox="0 0 100 100" className="h-full w-full">
                      {/* Anchor square Top-Left */}
                      <rect x="0" y="0" width="30" height="30" fill="black" />
                      <rect x="5" y="5" width="20" height="20" fill="white" />
                      <rect x="10" y="10" width="10" height="10" fill="black" />
                      {/* Anchor square Top-Right */}
                      <rect x="70" y="0" width="30" height="30" fill="black" />
                      <rect x="75" y="5" width="20" height="20" fill="white" />
                      <rect x="80" y="10" width="10" height="10" fill="black" />
                      {/* Anchor square Bottom-Left */}
                      <rect x="0" y="70" width="30" height="30" fill="black" />
                      <rect x="5" y="75" width="20" height="20" fill="white" />
                      <rect x="10" y="80" width="10" height="10" fill="black" />
                      {/* Random QR elements */}
                      <rect x="40" y="10" width="10" height="10" fill="black" />
                      <rect x="50" y="20" width="10" height="10" fill="black" />
                      <rect x="40" y="40" width="20" height="15" fill="black" />
                      <rect x="20" y="45" width="10" height="15" fill="black" />
                      <rect x="70" y="40" width="15" height="15" fill="black" />
                      <rect x="85" y="55" width="15" height="15" fill="black" />
                      <rect x="45" y="70" width="15" height="15" fill="black" />
                      <rect x="55" y="85" width="20" height="10" fill="black" />
                      <rect x="35" y="85" width="10" height="10" fill="black" />
                    </svg>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* Feedback Area */}
          {printStatus && (
            <div className={`p-4 rounded-xl border text-xs leading-relaxed flex items-center gap-3 ${
              printStatus === 'initializing' || printStatus === 'sending'
                ? 'bg-amber-50 border-amber-200 text-amber-800'
                : 'bg-emerald-50 border-emerald-250 text-emerald-800'
            }`}>
              <div className="shrink-0">
                {printStatus === 'initializing' || printStatus === 'sending' ? (
                  <div className="h-4 w-4 rounded-full border-2 border-amber-600 border-t-transparent animate-spin"></div>
                ) : (
                  <div className="h-5 w-5 bg-emerald-500 rounded-full text-white flex items-center justify-center">
                    <Check className="h-3 w-3" />
                  </div>
                )}
              </div>
              <p className="font-semibold">
                {printStatus === 'initializing' && 'Initializing hardware diagnostics... Parsing label vector arrays...'}
                {printStatus === 'sending' && 'Uploading print job buffer to central thermal spooler...'}
                {printStatus !== 'initializing' && printStatus !== 'sending' && printStatus}
              </p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
