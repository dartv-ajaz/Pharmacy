import React, { useState, useEffect } from 'react';
import { 
  ShoppingCart, PlusCircle, Trash2, CheckCircle, FileText, 
  AlertTriangle, RefreshCcw, FileImage, UploadCloud, Sparkles, 
  BookOpen, Wallet, ChevronRight, Search, Database, Inbox, 
  TrendingUp, User, ArrowUpRight, ArrowDownRight, Edit3, Save 
} from 'lucide-react';
import { PurchaseOrder, Product, Supplier, BatchInfo } from '../../types';
import { mockOrders } from '../../data/mockData';

export default function PurchaseModule({ initialTab }: { initialTab?: 'orders' | 'create' | 'reorder' | 'ocr-upload' | 'ledger' | 'stock' }) {
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [currentPoItems, setCurrentPoItems] = useState<{ productId: string; qty: number; rate: number }[]>([]);
  const [newProductSelect, setNewProductSelect] = useState('');
  const [newProductQty, setNewProductQty] = useState(100);
  const [newProductRate, setNewProductRate] = useState(25);
  
  // Navigation active tab
  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'create' | 'reorder' | 'ocr-upload' | 'ledger' | 'stock'>(initialTab || 'orders');

  // Server state caches
  const [vendors, setVendors] = useState<Supplier[]>([]);
  const [ledgers, setLedgers] = useState<any[]>([]);
  const [stockRegister, setStockRegister] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [batches, setBatches] = useState<BatchInfo[]>([]);

  // OCR state variables
  const [isOcrLoading, setIsOcrLoading] = useState(false);
  const [detectedBill, setDetectedBill] = useState<any | null>(null);
  const [isCommittingOcr, setIsCommittingOcr] = useState(false);
  const [ocrSuccessData, setOcrSuccessData] = useState<any | null>(null);

  // Settlement Form states
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payFormSupplierId, setPayFormSupplierId] = useState('');
  const [payFormAmount, setPayFormAmount] = useState('');
  const [payFormMode, setPayFormMode] = useState('Bank Transfer');
  const [payFormRemarks, setPayFormRemarks] = useState('');
  const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);

  // Search parameters
  const [stockSearch, setStockSearch] = useState('');
  const [ledgerSearch, setLedgerSearch] = useState('');

  // Fetch full live tables from APIs
  const refreshAllStates = async () => {
    try {
      const vRes = await fetch('/api/vendors');
      const vData = await vRes.json();
      if (vData && vData.data) {
        setVendors(vData.data);
        if (vData.data.length > 0 && !selectedSupplierId) {
          setSelectedSupplierId(vData.data[0].id);
        }
      }

      const lRes = await fetch('/api/vendors/ledger');
      const lData = await lRes.json();
      if (lData && lData.data) setLedgers(lData.data);

      const sRes = await fetch('/api/stock-register');
      const sData = await sRes.json();
      if (sData && sData.data) setStockRegister(sData.data);

      const pRes = await fetch('/api/products');
      const pData = await pRes.json();
      if (pData && pData.data) {
        setProducts(pData.data);
        if (pData.data.length > 0 && !newProductSelect) {
          setNewProductSelect(pData.data[0].id);
          setNewProductRate(pData.data[0].priceList.wholesalePrice);
        }
      }

      const bRes = await fetch('/api/batches');
      const bData = await bRes.json();
      if (bData && bData.data) setBatches(bData.data);
    } catch (err) {
      console.warn("Could not load real-time database state.", err);
    }
  };

  useEffect(() => {
    refreshAllStates();
  }, []);

  // Compute live aggregates 
  const computedStockMap = products.reduce((acc, p) => {
    const pBatches = batches.filter(b => b.productId === p.id);
    const totalStock = pBatches.reduce((sum, b) => sum + b.stockQty, 0);
    acc[p.id] = totalStock;
    return acc;
  }, {} as Record<string, number>);

  const lowStockProducts = products.filter(p => {
    const stock = computedStockMap[p.id] ?? 0;
    return stock < p.minStockLevel;
  });

  const handleAddPoItem = () => {
    if (!newProductSelect) return;
    const prod = products.find(p => p.id === newProductSelect);
    if (!prod) return;

    const exists = currentPoItems.find(item => item.productId === newProductSelect);
    if (exists) {
      setCurrentPoItems(currentPoItems.map(item => 
        item.productId === newProductSelect 
          ? { ...item, qty: item.qty + Number(newProductQty) } 
          : item
      ));
    } else {
      setCurrentPoItems([...currentPoItems, {
        productId: newProductSelect,
        qty: Number(newProductQty),
        rate: Number(newProductRate)
      }]);
    }
  };

  const handleRemovePoItem = (index: number) => {
    setCurrentPoItems(currentPoItems.filter((_, i) => i !== index));
  };

  const handleAutoReorderAll = () => {
    const reorderedDrafts = lowStockProducts.map(p => ({
      productId: p.id,
      qty: p.maxStockLevel - (computedStockMap[p.id] ?? 0),
      rate: p.priceList.wholesalePrice
    }));
    setCurrentPoItems(reorderedDrafts);
    setActiveSubTab('create');
  };

  const handleSubmitPo = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentPoItems.length === 0) return;

    const supplier = vendors.find(s => s.id === selectedSupplierId);
    const newPo: PurchaseOrder = {
      id: `PO00${orders.length + 1}`,
      poNumber: `PO-2026-0${12 + orders.length}`,
      date: new Date().toISOString().split('T')[0],
      supplierId: selectedSupplierId,
      supplierName: supplier ? supplier.name : 'Unknown Supplier',
      status: 'Pending Approval',
      totalAmount: currentPoItems.reduce((acc, item) => acc + (item.qty * item.rate), 0),
      items: currentPoItems.map(item => {
        const prod = products.find(p => p.id === item.productId);
        return {
          productId: item.productId,
          productName: prod ? prod.name : 'Unknown Product',
          qty: item.qty,
          rate: item.rate,
          discountPct: 5,
          total: (item.qty * item.rate) * 0.95
        };
      })
    };

    setOrders([newPo, ...orders]);
    setCurrentPoItems([]);
    setActiveSubTab('orders');
  };

  // Trigger SCM OCR scan using base64 image representation
  const handleOcrFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsOcrLoading(true);
    setDetectedBill(null);
    setOcrSuccessData(null);

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result as string;
      try {
        const res = await fetch('/api/ai/bills/ocr', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'x-gemini-api-key': localStorage.getItem('gemini_api_key_override') || ''
          },
          body: JSON.stringify({ imageBase64: base64String })
        });
        const extracted = await res.json();
        setDetectedBill(extracted);
      } catch (err) {
        console.error("OCR Extraction failed", err);
        alert("OCR Scan failed. Check API key configurations.");
      } finally {
        setIsOcrLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  // Preset OCR triggers for easy 1-click testing
  const triggerPresetOcr = async (presetId: number) => {
    setIsOcrLoading(true);
    setDetectedBill(null);
    setOcrSuccessData(null);

    // Simulated distinct invoice streams
    const presets = [
      {
        supplierName: "McKesson India Distributors",
        gstin: "09AABCM3928L1Z9",
        billNumber: `MCK-${Math.floor(10000 + Math.random() * 90000)}`,
        billDate: new Date().toISOString().split('T')[0],
        items: [
          { productName: "Calpol 650mg", salt: "Paracetamol 650mg", manufacturer: "GSK Pharmaceuticals Ltd", category: "OTC", packSize: "15 tabs", batchNumber: "MCK-CAL-04", expiryDate: "2027-11-20", qty: 250, costPrice: 18.5, gstRate: 12, hsn: "30049011" },
          { productName: "Alprax 0.5mg", salt: "Alprazolam 0.5mg", manufacturer: "Torrent Pharmaceuticals", category: "Schedule H", packSize: "15 tabs", batchNumber: "MCK-ALP-91", expiryDate: "2028-01-15", qty: 100, costPrice: 42.0, gstRate: 12, hsn: "30049014" }
        ]
      },
      {
        supplierName: "Suncor Health Stockists",
        gstin: "12SSUNH2039K9ZN",
        billNumber: `SUN-${Math.floor(10000 + Math.random() * 90000)}`,
        billDate: new Date().toISOString().split('T')[0],
        items: [
          { productName: "Gardasal 10mg", salt: "Hpv Vaccine Lot 2", manufacturer: "Merck Suncor", category: "Schedule H", packSize: "1 Vial", batchNumber: "SUN-GAR-21", expiryDate: "2028-06-30", qty: 45, costPrice: 1850.0, gstRate: 18, hsn: "30022019" },
          { productName: "Pantocid 40mg", salt: "Pantoprazole 40mg", manufacturer: "Sun Pharma Ltd", category: "Schedule H", packSize: "15 tabs", batchNumber: "SUN-PAN-44", expiryDate: "2027-05-18", qty: 300, costPrice: 85.0, gstRate: 12, hsn: "30049039" }
        ]
      },
      {
        supplierName: "Rana Pharma & Stockist",
        gstin: "09AALPR1204C1ZC",
        billNumber: `RAN-${Math.floor(10000 + Math.random() * 90000)}`,
        billDate: new Date().toISOString().split('T')[0],
        items: [
          { productName: "Allegra 120mg", salt: "Fexofenadine Hydrochloride 120mg", manufacturer: "Sanofi India Ltd", category: "OTC", packSize: "10 tabs", batchNumber: "RAN-ALG-03", expiryDate: "2028-04-10", qty: 180, costPrice: 112.5, gstRate: 12, hsn: "30049044" }
        ]
      }
    ];

    try {
      // Simulate real-time artificial network delays
      await new Promise(resolve => setTimeout(resolve, 1400));
      setDetectedBill(presets[presetId] || presets[0]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsOcrLoading(false);
    }
  };

  // Editable fields within SCM OCR form overrides
  const handleOcrFieldChange = (field: string, val: any) => {
    if (!detectedBill) return;
    setDetectedBill({ ...detectedBill, [field]: val });
  };

  const handleOcrItemFieldChange = (itemIdx: number, field: string, val: any) => {
    if (!detectedBill) return;
    const modifiedItems = [...detectedBill.items];
    modifiedItems[itemIdx] = { ...modifiedItems[itemIdx], [field]: val };
    setDetectedBill({ ...detectedBill, items: modifiedItems });
  };

  // Final Commit OCR Bill to central inventory system & supplier ledgers
  const commitOcrBill = async () => {
    if (!detectedBill) return;
    setIsCommittingOcr(true);

    try {
      const res = await fetch('/api/ai/bills/save-ocr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(detectedBill)
      });
      const data = await res.json();
      if (data.status === 201) {
        setOcrSuccessData(data);
        setDetectedBill(null);
        refreshAllStates();
      } else {
        alert(data.error || "Save OCR items failed");
      }
    } catch (err) {
      console.error("Save SCM OCR Commit failure", err);
    } finally {
      setIsCommittingOcr(false);
    }
  };

  // Record a payment settle transaction for a selected supplier
  const submitPaymentDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payFormSupplierId || !payFormAmount) return;

    setIsSubmittingPayment(true);
    try {
      const res = await fetch('/api/vendors/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierId: payFormSupplierId,
          amount: Number(payFormAmount),
          paymentMode: payFormMode,
          remarks: payFormRemarks
        })
      });
      const data = await res.json();
      if (data.status === 200) {
        setShowPaymentModal(false);
        setPayFormAmount('');
        setPayFormRemarks('');
        refreshAllStates();
      } else {
        alert(data.error || "Payment submission failed");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingPayment(false);
    }
  };

  // Filtered lists
  const filteredStockRegister = stockRegister.filter(entry => 
    entry.productName.toLowerCase().includes(stockSearch.toLowerCase()) ||
    entry.supplierName.toLowerCase().includes(stockSearch.toLowerCase()) ||
    entry.batchNumber.toLowerCase().includes(stockSearch.toLowerCase())
  );

  const filteredLedgers = ledgers.filter(entry => 
    entry.supplierName.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    entry.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
    entry.refNo.toLowerCase().includes(ledgerSearch.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* SCM Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <ShoppingCart className="h-4 w-4 text-sky-500" />
            Module 03: SCM procurements & Vendor Double-Entry Ledgers
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Automated visual bill parsing & reconciliation triggers across vendor, stock, and ledger ledgers.</p>
        </div>

        {/* Multi-Tab Navigation for Complete SCM suite */}
        <div className="flex flex-wrap bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 gap-1">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeSubTab === 'orders' ? 'bg-white shadow text-sky-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Requisitions ({orders.length})
          </button>
          <button
            onClick={() => setActiveSubTab('create')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all ${
              activeSubTab === 'create' ? 'bg-white shadow text-sky-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Draft Vendor PO
          </button>
          <button
            onClick={() => setActiveSubTab('reorder')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1 ${
              activeSubTab === 'reorder' ? 'bg-rose-500 text-white shadow' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <AlertTriangle className="h-3 w-3" />
            Under-Stock ({lowStockProducts.length})
          </button>
          <button
            onClick={() => setActiveSubTab('ocr-upload')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 bg-sky-50 text-sky-700 whitespace-nowrap ${
              activeSubTab === 'ocr-upload' ? 'bg-sky-600! text-white! shadow' : 'hover:bg-sky-100 border border-sky-200/40'
            }`}
          >
            <Sparkles className="h-3 w-3" />
            OCR Bill Scanner
          </button>
          <button
            onClick={() => setActiveSubTab('ledger')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'ledger' ? 'bg-white shadow text-sky-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Wallet className="h-3 w-3" />
            Vendor Ledgers
          </button>
          <button
            onClick={() => setActiveSubTab('stock')}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all flex items-center gap-1.5 ${
              activeSubTab === 'stock' ? 'bg-white shadow text-sky-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Database className="h-3 w-3" />
            Stock Register
          </button>
        </div>
      </div>

      <div className="p-6">
        {/* TAB 1: ORIGINAL PO REQUISITION ARCHIVE */}
        {activeSubTab === 'orders' && (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                    <th className="px-5 py-3">PO Number</th>
                    <th className="px-5 py-3">Supplier</th>
                    <th className="px-5 py-3">Date Created</th>
                    <th className="px-5 py-3">Total Amount</th>
                    <th className="px-5 py-3 text-right">Items Count</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {orders.map((po) => (
                    <tr key={po.id} className="hover:bg-zinc-50/50">
                      <td className="px-5 py-3.5 font-mono font-bold text-zinc-900">{po.poNumber}</td>
                      <td className="px-5 py-3.5">
                        <div className="font-semibold text-zinc-800">{po.supplierName}</div>
                        <div className="text-[10px] text-zinc-400 font-mono">SUP_ID: {po.supplierId}</div>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-500 font-mono">{po.date}</td>
                      <td className="px-5 py-3.5 font-semibold text-zinc-800">₹{po.totalAmount.toLocaleString('en-IN')}.00</td>
                      <td className="px-5 py-3.5 text-right font-mono text-zinc-600 font-semibold">{po.items.length} classes</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider border ${
                          po.status === 'Approved' || po.status === 'Received'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: DRAFT NEW VENDOR PO */}
        {activeSubTab === 'create' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-2">
                  <PlusCircle className="h-4 w-4 text-sky-500" /> Assemble Purchase Requisition
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Target Supplier Partner</label>
                    <select
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 focus:outline-none focus:border-sky-500"
                    >
                      {vendors.map(s => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="pt-2 border-t border-zinc-100 grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Select Product Line</label>
                    <select
                      value={newProductSelect}
                      onChange={(e) => {
                        setNewProductSelect(e.target.value);
                        const prod = products.find(p => p.id === e.target.value);
                        if (prod) {
                          setNewProductRate(prod.priceList.wholesalePrice);
                        }
                      }}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 focus:outline-none focus:border-sky-500"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} ({p.salt})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Quantity (Units / Bulks)</label>
                    <input
                      type="number"
                      value={newProductQty}
                      onChange={(e) => setNewProductQty(Math.max(1, Number(e.target.value)))}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800 focus:outline-none"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase">Wholesale Cost (₹)</label>
                      <input
                        type="number"
                        value={newProductRate}
                        onChange={(e) => setNewProductRate(Math.max(1, Number(e.target.value)))}
                        className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs text-zinc-800 focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddPoItem}
                      className="h-10 px-4 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-xs font-semibold shrink-0"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm">
                <h4 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-3">Requisition Items Draft</h4>
                {currentPoItems.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-zinc-100 rounded-xl">
                    <ShoppingCart className="h-6 w-6 text-zinc-300 mx-auto mb-2" />
                    <p className="text-xs text-zinc-400">Order buffer is completely empty. Select items above, or load auto-reorders.</p>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {currentPoItems.map((item, index) => {
                      const prod = products.find(p => p.id === item.productId);
                      return (
                        <div key={index} className="flex justify-between items-center bg-zinc-50 border border-zinc-200 rounded-lg p-3 text-xs">
                          <div className="flex-1">
                            <div className="font-bold text-zinc-900">{prod?.name || 'Unknown Product'}</div>
                            <div className="text-[10px] font-mono text-zinc-400">{prod?.salt || 'No salt group'}</div>
                          </div>
                          <div className="flex gap-6 items-center">
                            <div className="text-right">
                              <div className="font-semibold text-zinc-800 font-mono">{item.qty} units</div>
                              <div className="text-[10px] text-zinc-400 font-mono">@ ₹{item.rate}/ea</div>
                            </div>
                            <div className="font-bold text-zinc-900 font-mono">₹{(item.qty * item.rate).toLocaleString('en-IN')}</div>
                            <button
                              type="button"
                              onClick={() => handleRemovePoItem(index)}
                              className="text-zinc-400 hover:text-rose-500"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-900 text-white border border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400 mb-4 flex items-center gap-2">
                  <FileText className="h-4 w-4 text-sky-450" /> Invoice Valuation Summary
                </h3>

                <div className="space-y-3 pt-3 border-t border-zinc-800 text-xs">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Total Items:</span>
                    <span className="font-semibold font-mono text-zinc-200">{currentPoItems.reduce((acc, i) => acc + i.qty, 0)} units</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">SKU Lines:</span>
                    <span className="font-semibold font-mono text-zinc-200">{currentPoItems.length} lines</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Auto SCM Discount:</span>
                    <span className="font-semibold font-mono text-emerald-400">5.0% Standard</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-zinc-800 text-sm">
                    <span className="font-bold">Total Est:</span>
                    <span className="font-mono font-bold text-white text-lg">
                      ₹{currentPoItems.reduce((acc, item) => acc + (item.qty * item.rate), 0).toLocaleString('en-IN')}.00
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-2">
                <button
                  type="button"
                  disabled={currentPoItems.length === 0}
                  onClick={handleSubmitPo}
                  className="w-full h-10 rounded-lg text-xs font-bold tracking-wide uppercase transition-all bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-40 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="h-4 w-4" /> Finalize Purchase Draft
                </button>
                <p className="text-[10px] text-zinc-500 text-center">Approved PO will trigger automation stock levels on receipt verification.</p>
              </div>
            </div>
          </div>
        )}

        {/* TAB 3: AUTO REORDER CRITICAL LIST */}
        {activeSubTab === 'reorder' && (
          <div className="space-y-4">
            <div className="bg-rose-50 border border-rose-100 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-rose-500 rounded-lg text-white">
                  <AlertTriangle className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-bold text-rose-900 uppercase">Critical SCM Safety Stock Violations</h4>
                  <p className="text-[11px] text-rose-700 leading-relaxed mt-0.5">
                    The system has identified products where live aggregate warehouse stock totals have plunged below their mandatory min safety levels.
                  </p>
                </div>
              </div>
              <button
                onClick={handleAutoReorderAll}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg transition-all shadow-md shrink-0 uppercase"
              >
                Auto-Build Replenishment PO
              </button>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                    <th className="px-5 py-3">Product Name</th>
                    <th className="px-5 py-3">Salt Group</th>
                    <th className="px-5 py-3 text-center">Min Threshold</th>
                    <th className="px-5 py-3 text-center">Live Stock</th>
                    <th className="px-5 py-3 text-center">Deficit</th>
                    <th className="px-5 py-3">Suggested Reorder Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {lowStockProducts.map((p) => {
                    const currentStock = computedStockMap[p.id] ?? 0;
                    const deficit = p.maxStockLevel - currentStock;
                    return (
                      <tr key={p.id} className="hover:bg-zinc-50/50">
                        <td className="px-5 py-3.5 flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                          <span className="font-semibold text-zinc-900">{p.name}</span>
                        </td>
                        <td className="px-5 py-3.5 text-zinc-500 italic text-[11px]">{p.salt}</td>
                        <td className="px-5 py-3.5 text-center font-mono font-semibold text-zinc-700">{p.minStockLevel}</td>
                        <td className="px-5 py-3.5 text-center font-mono font-bold text-rose-600 bg-rose-50/30">{currentStock}</td>
                        <td className="px-5 py-3.5 text-center font-mono text-rose-500 font-semibold">{p.minStockLevel - currentStock} units</td>
                        <td className="px-5 py-3.5 font-bold text-zinc-800">
                          ₹{(deficit * p.priceList.wholesalePrice).toLocaleString('en-IN')} <span className="text-[10px] font-normal text-zinc-400">({deficit} units)</span>
                        </td>
                      </tr>
                    );
                  })}
                  {lowStockProducts.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-zinc-400">All products possess robust stock overhead levels. Safe thresholds are validated.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: NEW AI VENDOR BILL OCR SCANNER */}
        {activeSubTab === 'ocr-upload' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Drag and drop module */}
              <div className="md:col-span-2 bg-white border-2 border-dashed border-zinc-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center min-h-[220px] transition-all hover:border-sky-500 hover:bg-sky-50/20">
                <div className="p-4 bg-sky-500/10 rounded-full text-sky-600 mb-3">
                  <UploadCloud className="h-8 w-8" />
                </div>
                <h4 className="text-sm font-bold text-zinc-850">Drag & Drop Pharmacy Bill Here</h4>
                <p className="text-xs text-zinc-400 mt-1 max-w-[280px] mx-auto">Supports .jpg, .jpeg, .png, .pdf invoices. Live OCR parser will extract line items, batches, exps, and taxes.</p>
                
                <label className="mt-4 px-4 py-2 bg-sky-500 hover:bg-sky-600 cursor-pointer text-white font-bold rounded-xl text-xs transition duration-200 select-none">
                  Choose Invoice File
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleOcrFileChange} 
                    className="hidden" 
                  />
                </label>
              </div>

              {/* Instant pre-sets triggers */}
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex items-center gap-1.5 text-zinc-800">
                  <Sparkles className="h-4 w-4 text-sky-500" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">Instant SCM Invoice Presets</h4>
                </div>
                <p className="text-[11px] text-zinc-500">No invoice sample handy? Click any preset bill below to simulate robust real-world AI OCR invoice extractions instantly.</p>
                
                <div className="space-y-2 pt-1">
                  <button 
                    onClick={() => triggerPresetOcr(0)}
                    className="w-full p-2.5 bg-zinc-50 hover:bg-sky-50 border border-zinc-200 text-left rounded-xl transition flex items-center justify-between text-xs font-semibold text-zinc-700"
                  >
                    <span>McKesson Distributors Bill</span>
                    <ChevronRight className="h-3 w-3 text-zinc-400" />
                  </button>
                  <button 
                    onClick={() => triggerPresetOcr(1)}
                    className="w-full p-2.5 bg-zinc-50 hover:bg-sky-50 border border-zinc-200 text-left rounded-xl transition flex items-center justify-between text-xs font-semibold text-zinc-700"
                  >
                    <span>Suncor SCM Vaccine Intake</span>
                    <ChevronRight className="h-3 w-3 text-zinc-400" />
                  </button>
                  <button 
                    onClick={() => triggerPresetOcr(2)}
                    className="w-full p-2.5 bg-zinc-50 hover:bg-sky-50 border border-zinc-200 text-left rounded-xl transition flex items-center justify-between text-xs font-semibold text-zinc-700"
                  >
                    <span>Rana Premium Batch Inward</span>
                    <ChevronRight className="h-3 w-3 text-zinc-400" />
                  </button>
                </div>
              </div>
            </div>

            {/* OCR Processing loader */}
            {isOcrLoading && (
              <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-zinc-100 shadow-sm space-y-3">
                <div className="relative flex items-center justify-center">
                  <div className="h-10 w-10 rounded-full border-4 border-zinc-100 border-t-sky-500 animate-spin"></div>
                  <Sparkles className="absolute h-4 w-4 text-sky-500 animate-pulse" />
                </div>
                <p className="text-xs font-semibold text-zinc-650 tracking-wide">Gemini Vision OCR analyzing lines, expiries, salts, and wholesale valuations...</p>
              </div>
            )}

            {/* SUCCESS FEEDBACK */}
            {ocrSuccessData && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-800">
                  <CheckCircle className="h-5 w-5" />
                  <h3 className="text-sm font-bold">OCR Invoice Committed & SCM Automations Completed!</h3>
                </div>
                <p className="text-xs text-emerald-700 leading-normal">
                  The invoice bill has been saved perfectly! Real-time double-entry credited ₹{ocrSuccessData.totalInvoiceValue.toLocaleString('en-IN')} to supplier ledger account <b>{ocrSuccessData.supplierName}</b> (Id: {ocrSuccessData.supplierId}). Aggregate stock thresholds have been updated.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="bg-white border border-emerald-200/50 p-3 rounded-xl text-xs">
                    <span className="text-emerald-600 block">Vendor Account Liability</span>
                    <span className="font-bold text-zinc-800 font-mono mt-1 block">₹{ocrSuccessData.outstandingBalance.toLocaleString('en-IN')} OUTSTANDING</span>
                  </div>
                  <div className="bg-white border border-emerald-200/50 p-3 rounded-xl text-xs">
                    <span className="text-emerald-600 block">Medicines Processed</span>
                    <span className="font-bold text-zinc-800 mt-1 block font-mono">{ocrSuccessData.items.length} SKUs Catalogued</span>
                  </div>
                  <div className="bg-white border border-emerald-200/50 p-3 rounded-xl text-xs">
                    <span className="text-emerald-600 block">Ledger Posting Journal</span>
                    <span className="font-bold text-zinc-800 mt-1 block font-mono">ID: {ocrSuccessData.ledgerRow.id}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Editable OCR Form Reviews */}
            {detectedBill && detectedBill.error && (
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-5 text-xs text-rose-900 space-y-2">
                <h4 className="font-bold flex items-center gap-1.5 uppercase tracking-wide">
                  <AlertTriangle className="h-4 w-4 text-rose-600" />
                  SCM Bill Parsing Encountered a Server Exception
                </h4>
                <p className="leading-relaxed text-rose-700">{detectedBill.error}</p>
                <p className="text-[10px] text-rose-500">Please try a different preset or upload again. Ensure your Gemini API is online.</p>
              </div>
            )}

            {detectedBill && !detectedBill.error && (
              <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-zinc-100 pb-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-850 flex items-center gap-1.5">
                      <Sparkles className="h-4 w-4 text-yellow-500 animate-spin" />
                      Review Detected Bill Metadata
                    </h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Edit details below to override any scanning discrepancies before posting to books.</p>
                  </div>
                  <button 
                    onClick={commitOcrBill}
                    disabled={isCommittingOcr}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl text-xs font-bold tracking-wide uppercase transition flex items-center gap-1.5"
                  >
                    {isCommittingOcr ? 'Posting to Books...' : 'Commit to SCM Ledger & Stock'}
                  </button>
                </div>

                {/* SCM Info Forms */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase">Vendor / Wholesaler</label>
                    <input 
                      type="text" 
                      value={detectedBill.supplierName || ''} 
                      onChange={(e) => handleOcrFieldChange('supplierName', e.target.value)}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 font-semibold text-zinc-800 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase">GSTIN Identification</label>
                    <input 
                      type="text" 
                      value={detectedBill.gstin || ''} 
                      onChange={(e) => handleOcrFieldChange('gstin', e.target.value)}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 font-mono text-zinc-800 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase">Bill / Invoice Reference #</label>
                    <input 
                      type="text" 
                      value={detectedBill.billNumber || ''} 
                      onChange={(e) => handleOcrFieldChange('billNumber', e.target.value)}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 font-mono text-zinc-800 focus:outline-none" 
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-400 uppercase">Invoice Date</label>
                    <input 
                      type="date" 
                      value={detectedBill.billDate || ''} 
                      onChange={(e) => handleOcrFieldChange('billDate', e.target.value)}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 font-mono text-zinc-800 focus:outline-none" 
                    />
                  </div>
                </div>

                {/* Extracted medicines rows list */}
                <div className="space-y-3">
                  <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Extracted Line Items (Wholesale SKU)</h4>
                  <div className="overflow-x-auto border border-zinc-100 rounded-xl">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-zinc-50 text-[10px] text-zinc-500 uppercase tracking-widest border-b border-zinc-100 font-bold">
                          <th className="px-4 py-2.5">Medicine Name</th>
                          <th className="px-4 py-2.5">Generic Salt group</th>
                          <th className="px-4 py-2.5">Batch</th>
                          <th className="px-4 py-2.5">Expiry</th>
                          <th className="px-4 py-2.5 text-center">Pack size</th>
                          <th className="px-4 py-2.5 text-center">Qty (packs)</th>
                          <th className="px-4 py-2.5 text-right">Cost Rate</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                        {detectedBill.items && Array.isArray(detectedBill.items) && detectedBill.items.map((item: any, idx: number) => (
                          <tr key={idx} className="hover:bg-zinc-50/50">
                            <td className="px-4 py-2 font-bold text-zinc-800">
                              <input 
                                type="text"
                                value={item.productName}
                                onChange={(e) => handleOcrItemFieldChange(idx, 'productName', e.target.value)}
                                className="w-full bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-2">
                              <input 
                                type="text"
                                value={item.salt}
                                onChange={(e) => handleOcrItemFieldChange(idx, 'salt', e.target.value)}
                                className="w-full bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-zinc-500"
                              />
                            </td>
                            <td className="px-4 py-2 font-mono font-bold">
                              <input 
                                type="text"
                                value={item.batchNumber}
                                onChange={(e) => handleOcrItemFieldChange(idx, 'batchNumber', e.target.value)}
                                className="w-20 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-2 font-mono">
                              <input 
                                type="text" /* text format is safer for random inputs */
                                value={item.expiryDate}
                                onChange={(e) => handleOcrItemFieldChange(idx, 'expiryDate', e.target.value)}
                                className="w-20 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-2 text-center text-[10px]">
                              <input 
                                type="text"
                                value={item.packSize || '10 tabs'}
                                onChange={(e) => handleOcrItemFieldChange(idx, 'packSize', e.target.value)}
                                className="w-16 bg-transparent border-b border-transparent focus:border-sky-500 text-center focus:outline-none"
                              />
                            </td>
                            <td className="px-4 py-2 text-center font-mono font-extrabold text-sky-700">
                              <input 
                                type="number"
                                value={item.qty}
                                onChange={(e) => handleOcrItemFieldChange(idx, 'qty', Number(e.target.value))}
                                className="w-12 bg-transparent border-b border-transparent focus:border-sky-500 text-center focus:outline-none font-bold"
                              />
                            </td>
                            <td className="px-4 py-2 text-right font-mono font-bold text-zinc-900">
                              <input 
                                type="number"
                                value={item.costPrice}
                                onChange={(e) => handleOcrItemFieldChange(idx, 'costPrice', Number(e.target.value))}
                                className="w-16 bg-transparent border-b border-transparent focus:border-sky-500 text-right focus:outline-none font-bold"
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 5: VENDOR OUTSTANDING DOUBLE ENTRY LEDGER & PAYMENT */}
        {activeSubTab === 'ledger' && (
          <div className="space-y-6">
            {/* Vendor balances overview grids */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3 bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
                <div className="flex justify-between items-center pr-2">
                  <div>
                    <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Wallet className="h-4 w-4 text-emerald-500" />
                      Active Vendor Liabilities Summary
                    </h3>
                    <p className="text-[11px] text-zinc-400">Chronological list of payables outstanding for raw materials sourcing channels.</p>
                  </div>
                  <button 
                    onClick={() => {
                      if (vendors.length > 0) {
                        setPayFormSupplierId(vendors[0].id);
                        setShowPaymentModal(true);
                      }
                    }}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-50 transition text-emerald-700! border border-emerald-300 font-bold rounded-xl text-xs flex items-center gap-1.5"
                  >
                    <PlusCircle className="h-3.5 w-3.5" /> settle cash desk Payment
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {vendors.map((vendor) => (
                    <div key={vendor.id} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl relative overflow-hidden text-xs">
                      <span className="text-[10px] uppercase font-bold text-zinc-400 block tracking-wider">{vendor.name}</span>
                      <span className="font-mono font-black text-rose-600 tracking-tight text-sm mt-1.5 block">
                        ₹{(vendor.outstandingBalance || 0).toLocaleString('en-IN')}.00 CAP
                      </span>
                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-zinc-150/50 text-[10px] text-zinc-400">
                        <span>Limit: ₹{(vendor.creditLimit || 0).toLocaleString('en-IN')}</span>
                        <span className="font-mono">ID: {vendor.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick statistics card */}
              <div className="bg-sky-600 text-white rounded-2xl p-5 flex flex-col justify-between Relative overflow-hidden shadow-md">
                <div className="absolute right-0 top-0 translate-x-2 -translate-y-2 opacity-10">
                  <TrendingUp className="h-44 w-44" />
                </div>
                
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-sky-100 font-bold block">Aggregated Liability</span>
                  <h3 className="text-xl font-mono font-black tracking-tighter mt-1">
                    ₹{vendors.reduce((sum, v) => sum + (v.outstandingBalance || 0), 0).toLocaleString('en-IN')}.00
                  </h3>
                  <p className="text-[10px] text-sky-100 mt-1 leading-normal">Overall trade outstanding ledger balances across trade partners.</p>
                </div>

                <div className="pt-4 border-t border-sky-500/50 flex justify-between text-xs text-sky-150/90 font-semibold font-mono">
                  <span>Trade Creditors:</span>
                  <span>{vendors.length} channels</span>
                </div>
              </div>
            </div>

            {/* Settle voucher Payment Form Modal overlay */}
            {showPaymentModal && (
              <div className="bg-zinc-950/40 backdrop-blur-xs fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl w-full max-w-md border border-zinc-200 overflow-hidden shadow-2xl p-6 relative">
                  <h3 className="text-sm font-bold text-zinc-900 border-b border-zinc-100 pb-3 uppercase tracking-wide flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-emerald-500" /> Settle Vendor Payable Voucher
                  </h3>

                  <form onSubmit={submitPaymentDisbursement} className="space-y-4 pt-4 text-xs">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase">Vendor Partner</label>
                      <select 
                        value={payFormSupplierId}
                        onChange={(e) => setPayFormSupplierId(e.target.value)}
                        className="mt-1 w-full bg-zinc-50 border border-zinc-200 p-2 text-xs rounded-lg text-zinc-800 focus:outline-none"
                      >
                        {vendors.map(v => (
                          <option key={v.id} value={v.id}>{v.name} (Outstanding: ₹{(v.outstandingBalance || 0).toLocaleString('en-IN')})</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase">Disbursed Amount (₹)</label>
                        <input 
                          type="number" 
                          required
                          value={payFormAmount}
                          onChange={(e) => setPayFormAmount(e.target.value)}
                          placeholder="e.g. 15000"
                          className="mt-1 w-full bg-zinc-50 border border-zinc-200 p-2 text-xs rounded-lg text-zinc-850 font-bold focus:outline-none" 
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-zinc-500 uppercase">Payment Mode</label>
                        <select 
                          value={payFormMode}
                          onChange={(e) => setPayFormMode(e.target.value)}
                          className="mt-1 w-full bg-zinc-50 border border-zinc-200 p-2 text-xs rounded-lg focus:outline-none"
                        >
                          <option>Bank Transfer</option>
                          <option>Cheque</option>
                          <option>Cash Box</option>
                          <option>UPI/QR Wallet</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-zinc-500 uppercase">Description / voucher Note</label>
                      <textarea 
                        rows={2}
                        value={payFormRemarks}
                        onChange={(e) => setPayFormRemarks(e.target.value)}
                        placeholder="Settlement for near expiry, stock offsets etc..."
                        className="mt-1 w-full bg-zinc-50 border border-zinc-200 p-2 text-xs rounded-lg text-zinc-800 focus:outline-none"
                      />
                    </div>

                    <div className="pt-4 border-t border-zinc-100 flex justify-end gap-3.5">
                      <button 
                        type="button" 
                        onClick={() => setShowPaymentModal(false)}
                        className="px-3.5 py-1.5 border border-zinc-200 text-zinc-500 hover:text-zinc-800 font-bold rounded-lg"
                      >
                        Cancel
                      </button>
                      <button 
                        type="submit"
                        disabled={isSubmittingPayment}
                        className="px-4 py-1.5 bg-sky-500 text-white hover:bg-sky-600 disabled:opacity-40 font-bold rounded-lg uppercase tracking-wide shadow"
                      >
                        {isSubmittingPayment ? 'Processing...' : 'Record disbursement'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Complete Vendor ledger records chronological */}
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Supplier double-entry journal logs</h4>
                <div className="relative w-full sm:w-64 flex-shrink-0">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search ledgers via Supplier or Voucher..."
                    value={ledgerSearch}
                    onChange={(e) => setLedgerSearch(e.target.value)}
                    className="w-full text-xs bg-white border border-zinc-200 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-sky-500 font-medium text-zinc-800"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <th className="px-5 py-3">Date</th>
                      <th className="px-5 py-3">Vendor / Account</th>
                      <th className="px-5 py-3">Voucher Details / Description</th>
                      <th className="px-5 py-3">Ref No</th>
                      <th className="px-5 py-3 text-right">Debit (Paying)</th>
                      <th className="px-5 py-3 text-right">Credit (Buying)</th>
                      <th className="px-5 py-3 text-right">Outstanding Bal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {filteredLedgers.map((entry) => {
                      const isPayment = entry.type === 'PAYMENT';
                      return (
                        <tr key={entry.id} className="hover:bg-zinc-50/50">
                          <td className="px-5 py-3 font-mono text-[11px] text-zinc-500">{entry.date}</td>
                          <td className="px-5 py-3 font-bold text-zinc-900">{entry.supplierName}</td>
                          <td className="px-5 py-3 text-zinc-650 max-w-xs truncate">{entry.description}</td>
                          <td className="px-5 py-3 font-mono font-semibold text-zinc-400">{entry.refNo}</td>
                          <td className="px-5 py-3 text-right text-emerald-600 font-mono font-bold">
                            {entry.debit > 0 ? `₹${entry.debit.toLocaleString('en-IN')}.00` : '-'}
                          </td>
                          <td className="px-5 py-3 text-right text-rose-600 font-mono font-bold">
                            {entry.credit > 0 ? `₹${entry.credit.toLocaleString('en-IN')}.00` : '-'}
                          </td>
                          <td className="px-5 py-3 text-right font-mono font-extrabold text-zinc-800">
                            ₹{entry.balance.toLocaleString('en-IN')}.00
                          </td>
                        </tr>
                      );
                    })}
                    {filteredLedgers.length === 0 && (
                      <tr>
                        <td colSpan={7} className="px-5 py-8 text-center text-zinc-400">No ledger entries match specified searches.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 6: SCM STOCK REGISTER MOVEMENTS SCM */}
        {activeSubTab === 'stock' && (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h4 className="text-[10px] font-bold tracking-widest text-zinc-400 uppercase">Chronological physical Stock Register movements</h4>
                  <p className="text-[10px] text-zinc-400 mt-0.5">Dual tracing of drugs received inward from suppliers and sold/depleted outward from cash counter tickets.</p>
                </div>
                <div className="relative w-full sm:w-64 flex-shrink-0">
                  <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
                  <input 
                    type="text" 
                    placeholder="Search registers via Drug or Supplier..."
                    value={stockSearch}
                    onChange={(e) => setStockSearch(e.target.value)}
                    className="w-full text-xs bg-white border border-zinc-200 pl-9 pr-3 py-2 rounded-xl focus:outline-none focus:border-sky-500 font-medium text-zinc-800"
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-50 border-b border-zinc-150 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                      <th className="px-5 py-3">Movement Date</th>
                      <th className="px-5 py-3">Medicine / Product</th>
                      <th className="px-5 py-3">Specific Batch</th>
                      <th className="px-5 py-3 text-center">In / Out Trigger</th>
                      <th className="px-5 py-3 text-center">Movement Qty</th>
                      <th className="px-5 py-3 text-right">Invoice Rate</th>
                      <th className="px-5 py-3">Source Vendor Channel</th>
                      <th className="px-5 py-3 text-right">Running Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 text-xs text-zinc-700">
                    {filteredStockRegister.map((entry) => {
                      const isInward = entry.type === 'IN';
                      return (
                        <tr key={entry.id} className="hover:bg-zinc-50/50">
                          <td className="px-5 py-3.5 font-mono text-zinc-500">{entry.date}</td>
                          <td className="px-5 py-3.5 font-bold text-zinc-800">{entry.productName}</td>
                          <td className="px-5 py-3.5 font-mono font-semibold text-zinc-400">{entry.batchNumber}</td>
                          <td className="px-5 py-3.5 text-center">
                            <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                              isInward 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-150/40' 
                                : 'bg-rose-50 text-rose-700 border border-rose-150/40'
                            }`}>
                              {isInward ? 'INWARD IN' : 'OUTWARD RET'}
                            </span>
                          </td>
                          <td className={`px-5 py-3 text-center font-mono font-black ${isInward ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {isInward ? `+${entry.qty}` : `-${entry.qty}`}
                          </td>
                          <td className="px-5 py-3 text-right font-semibold font-mono text-zinc-600">₹{entry.rate.toFixed(2)}</td>
                          <td className="px-5 py-3 text-zinc-500">{entry.supplierName}</td>
                          <td className="px-5 py-3 text-right font-mono font-extrabold text-zinc-800 bg-zinc-50/10">
                            {entry.balanceStock} packs
                          </td>
                        </tr>
                      );
                    })}
                    {filteredStockRegister.length === 0 && (
                      <tr>
                        <td colSpan={8} className="px-5 py-8 text-center text-zinc-400">No stock registrations match selected query.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
