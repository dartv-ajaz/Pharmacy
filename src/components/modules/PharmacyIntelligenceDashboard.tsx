import React, { useState, useMemo } from 'react';
import { 
  TrendingUp, TrendingDown, ShoppingBag, ShieldAlert, AlertTriangle, 
  RefreshCw, ClipboardCheck, ArrowRightLeft, Landmark, DollarSign, 
  Calendar, Layers, Clock, AlertCircle, CheckCircle2, ChevronRight, 
  Plus, FileText, ShoppingCart, Truck, Trash2, CheckCircle
} from 'lucide-react';
import { mockProducts, mockInvoices, mockBatches, mockOrders, mockSuppliers } from '../../data/mockData';
import { Product, BatchInfo, PurchaseOrder, SalesInvoice } from '../../types';

export default function PharmacyIntelligenceDashboard() {
  // --- REAL-TIME INTERACTIVE STORES (Initialized from Mock Data) ---
  const [invoices, setInvoices] = useState<SalesInvoice[]>(mockInvoices);
  const [batches, setBatches] = useState<BatchInfo[]>(mockBatches);
  const [orders, setOrders] = useState<PurchaseOrder[]>(mockOrders);
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Filter thresholds for Expiry and Stocks
  const [expiryDaysThreshold, setExpiryDaysThreshold] = useState<30 | 90 | 180>(90);
  const [showLowStockOnly, setShowLowStockOnly] = useState<boolean>(true);

  // New PO Quick Form state
  const [showNewPoForm, setShowNewPoForm] = useState(false);
  const [selectedSupplierId, setSelectedSupplierId] = useState(mockSuppliers[0]?.id || '');
  const [selectedProductId, setSelectedProductId] = useState(mockProducts[0]?.id || '');
  const [poQty, setPoQty] = useState<number>(100);
  const [poRate, setPoRate] = useState<number>(20);

  // Today's date reference
  const CURRENT_DATE = useMemo(() => new Date('2026-06-02'), []);

  // --- ACTIONS & MUTATORS ---

  // 1. Record simulated sale
  const handleSimulateSale = (paymentMode: 'Cash' | 'UPI/QR' | 'Card') => {
    const randomProduct = products[Math.floor(Math.random() * products.length)];
    const randomQty = Math.floor(Math.random() * 5) + 1;
    const rate = randomProduct.priceList.retailPrice;
    const subtotal = rate * randomQty;
    const discount = subtotal * 0.1; // 10% discount
    const cgst = subtotal * 0.06;
    const sgst = subtotal * 0.06;
    const grandTotal = subtotal - discount + cgst + sgst;

    const newInvoice: SalesInvoice = {
      id: `SIM-INV-${Math.floor(Math.random() * 9000) + 1000}`,
      invoiceNumber: `TAX-2026-SIM-${Math.floor(Math.random() * 90000) + 10000}`,
      date: '2026-06-02',
      customerName: 'Anonymous Walk-in Patient',
      customerPhone: '9888877777',
      billingType: 'POS',
      paymentMode,
      totals: {
        subtotal,
        discount,
        cgst,
        sgst,
        igst: 0,
        grandTotal,
        paidAmount: grandTotal,
        balance: 0
      },
      items: [
        {
          productId: randomProduct.id,
          productName: randomProduct.name,
          salt: randomProduct.salt,
          batchId: 'B01',
          batchNumber: `SIM-${Math.floor(Math.random() * 900) + 100}`,
          expiryDate: '2028-01-01',
          qty: randomQty,
          mrp: rate,
          discountPct: 10,
          gstRate: randomProduct.gstRate,
          cgst,
          sgst,
          igst: 0,
          total: grandTotal
        }
      ],
      cashierId: 'EMP04',
      status: 'Completed'
    };

    setInvoices(prev => [newInvoice, ...prev]);

    // DEDUCT stock from first available batch of that product if possible
    setBatches(prevBatches => {
      let remainingQtyToDeduct = randomQty;
      return prevBatches.map(b => {
        if (b.productId === randomProduct.id && b.stockQty > 0 && remainingQtyToDeduct > 0) {
          const deduction = Math.min(b.stockQty, remainingQtyToDeduct);
          remainingQtyToDeduct -= deduction;
          return { ...b, stockQty: b.stockQty - deduction };
        }
        return b;
      });
    });
  };

  // 2. Replenish product stock directly to resolve low stock alerts
  const handleReplenishStock = (productId: string, qtyToAdd: number = 200) => {
    // Find first batch of this product or create a new batch to push stock
    setBatches(prev => {
      const productHasBatch = prev.some(b => b.productId === productId);
      if (productHasBatch) {
        return prev.map(b => {
          if (b.productId === productId) {
            return { ...b, stockQty: b.stockQty + qtyToAdd };
          }
          return b;
        });
      } else {
        const newBatch: BatchInfo = {
          id: `B-NEW-${Math.floor(Math.random() * 900) + 100}`,
          productId,
          batchNumber: `INDENT-${Math.floor(Math.random() * 9000) + 1000}`,
          expiryDate: '2028-06-01',
          manufacturingDate: '2026-06-01',
          stockQty: qtyToAdd,
          costPrice: 50.0,
          mrp: 100.0
        };
        return [newBatch, ...prev];
      }
    });
  };

  // 3. Mark near expiry batch as returnee / write-off / return to supplier
  const handleDisposeBatch = (batchId: string) => {
    setBatches(prev => prev.map(b => {
      if (b.id === batchId) {
        return { ...b, stockQty: 0 }; // write off quantity to 0
      }
      return b;
    }));
  };

  // 4. Create new PO simulated
  const handleCreateNewPo = (e: React.FormEvent) => {
    e.preventDefault();
    const supplier = mockSuppliers.find(s => s.id === selectedSupplierId);
    const product = products.find(p => p.id === selectedProductId);
    if (!supplier || !product) return;

    const amount = poQty * poRate;
    const newPO: PurchaseOrder = {
      id: `PO-${Math.floor(Math.random() * 90000) + 10000}`,
      poNumber: `PO-2026-00${orders.length + 12}`,
      date: '2026-06-02',
      supplierId: selectedSupplierId,
      supplierName: supplier.name,
      status: 'Draft',
      totalAmount: amount,
      items: [
        {
          productId: selectedProductId,
          productName: product.name,
          qty: poQty,
          rate: poRate,
          discountPct: 5,
          total: amount * 0.95
        }
      ]
    };

    setOrders(prev => [newPO, ...prev]);
    setShowNewPoForm(false);
  };

  // 5. Update PO status
  const handleUpdatePoStatus = (poId: string, status: PurchaseOrder['status']) => {
    setOrders(prev => prev.map(o => {
      if (o.id === poId) {
        // If transitioning to received, automatically credit stock to the branches!
        if (status === 'Received') {
          o.items.forEach(item => {
            handleReplenishStock(item.productId, item.qty);
          });
        }
        return { ...o, status };
      }
      return o;
    }));
  };

  // --- STATS COMPUTATIONS ---

  // A. Today's Sales Calculations
  const salesSummary = useMemo(() => {
    let subtotal = 0;
    let grandTotal = 0;
    let totalInvoices = 0;
    let cashSales = 0;
    let upiSales = 0;
    let cardSales = 0;

    invoices.forEach(inv => {
      // Assuming today is June 2, 2026. Or June 1/2 both. Let's include all simulated ones + initial mock ones
      subtotal += inv.totals.subtotal;
      grandTotal += inv.totals.grandTotal;
      totalInvoices++;

      if (inv.paymentMode === 'Cash') cashSales += inv.totals.grandTotal;
      else if (inv.paymentMode === 'UPI/QR') upiSales += inv.totals.grandTotal;
      else cardSales += inv.totals.grandTotal;
    });

    return { subtotal, grandTotal, totalInvoices, cashSales, upiSales, cardSales };
  }, [invoices]);

  // B. Product Inventory & Low Stock Alerts
  const lowStockAlerts = useMemo(() => {
    return products.map(p => {
      // sum up batches matching product ID
      const totalInStock = batches
        .filter(b => b.productId === p.id)
        .reduce((sum, b) => sum + b.stockQty, 0);

      const isLow = totalInStock < p.minStockLevel;

      return {
        product: p,
        totalInStock,
        isLow,
        missingUnitsToMax: p.maxStockLevel - totalInStock
      };
    });
  }, [products, batches]);

  const activeLowStockFiltered = useMemo(() => {
    return lowStockAlerts.filter(l => l.isLow);
  }, [lowStockAlerts]);

  // C. Near Expiry Lists
  const expiringItemsReport = useMemo(() => {
    let expiredCount = 0;
    let criticalCount = 0; // < 30 days
    let warningCount = 0;  // < 90/threshold days

    const nearExpiryBatches = batches.map(b => {
      const productObj = products.find(p => p.id === b.productId);
      if (!productObj) return null;

      const expDate = new Date(b.expiryDate);
      const diffTime = expDate.getTime() - CURRENT_DATE.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      let alertLevel: 'expired' | 'critical' | 'warning' | 'safe' = 'safe';

      if (diffDays <= 0) {
        expiredCount++;
        alertLevel = 'expired';
      } else if (diffDays <= 30) {
        criticalCount++;
        alertLevel = 'critical';
      } else if (diffDays <= expiryDaysThreshold) {
        warningCount++;
        alertLevel = 'warning';
      }

      return {
        batch: b,
        product: productObj,
        daysRemaining: diffDays,
        alertLevel
      };
    }).filter(item => item !== null && (item.daysRemaining <= expiryDaysThreshold || item.daysRemaining <= 0)) as any[];

    // Sort by soonest to expire
    nearExpiryBatches.sort((a, b) => a.daysRemaining - b.daysRemaining);

    return { expiredCount, criticalCount, warningCount, nearExpiryBatches };
  }, [batches, products, expiryDaysThreshold, CURRENT_DATE]);

  // D. Pending / active Purchase Orders
  const pendingOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'Received' && o.status !== 'Cancelled');
  }, [orders]);


  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER WITH MODERN ACCENTS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-6 bg-gradient-to-r from-indigo-700 via-purple-700 to-rose-600 border border-indigo-400/20 rounded-2xl text-white shadow-xl shadow-indigo-900/10 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full blur-2xl pointer-events-none transform translate-x-12 -translate-y-12" />
        <div className="z-10">
          <span className="text-[9px] font-mono font-black tracking-widest text-yellow-300 uppercase bg-black/25 px-3 py-1 rounded-full border border-white/10">
            ✨ REAL-TIME PHARMACY INTELLIGENCE INTEGRATION
          </span>
          <h2 className="text-xl font-black font-sans mt-3.5 tracking-tight drop-shadow-sm">
            Active Operation Metrics & ERP Decounter
          </h2>
          <p className="text-xs text-indigo-100/90 mt-1 max-w-xl font-medium leading-relaxed">
            Live intelligence modules that coordinate with drug sales sheets, low-threshold alarms, expiring drug vaults, and B2B orders.
          </p>
        </div>
        
        {/* Rapid Simulator toolbar */}
        <div className="mt-4 sm:mt-0 flex flex-wrap gap-2 z-10">
          <div className="px-4 py-2 bg-black/30 border border-white/10 rounded-xl text-left backdrop-blur-sm">
            <span className="text-[8px] uppercase tracking-widest text-sky-300 block font-bold font-mono">Today's Date Context</span>
            <span className="text-xs font-black font-mono text-yellow-300">2026-06-02 Tue</span>
          </div>
        </div>
      </div>

      {/* DETAILED CARDS & LAYOUT MATRIX */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

        {/* 1. TODAY'S SALES SUMMARY WIDGET */}
        <div id="intel-widget-sales" className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-md space-y-4 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="h-5 w-5 text-emerald-500 bg-emerald-100/80 p-1 rounded-xl" />
                Live: Today's Sales Summary
              </h3>
              <span className="text-[10px] bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-extrabold px-3 py-1 rounded-full shadow-sm">
                {salesSummary.totalInvoices} Bills Filed
              </span>
            </div>

            {/* Micro counters columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mt-4">
              <div className="p-3 bg-gradient-to-br from-emerald-500/5 to-emerald-500/10 text-emerald-950 rounded-xl border border-emerald-350 hover:bg-emerald-500/15 transition-all shadow-sm">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-mono">Grand Revenue</span>
                <span className="text-xl font-black text-emerald-700 font-mono">₹{salesSummary.grandTotal.toFixed(2)}</span>
                <div className="text-[9px] text-emerald-600 mt-1 flex items-center gap-0.5 font-bold font-mono">
                  <TrendingUp className="h-3 w-3" /> Reconciled
                </div>
              </div>

              <div className="p-3 bg-gradient-to-br from-indigo-500/5 to-indigo-500/10 text-indigo-950 rounded-xl border border-indigo-250 hover:bg-indigo-500/15 transition-all shadow-sm">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-mono">UPI / Electronic</span>
                <span className="text-xl font-black text-indigo-750 font-mono">₹{salesSummary.upiSales.toFixed(2)}</span>
                <span className="text-[9px] block text-indigo-600 font-semibold mt-1 font-mono">Instant Bank Vault</span>
              </div>

              <div className="p-3 bg-gradient-to-br from-amber-500/5 to-amber-500/10 text-amber-950 rounded-xl border border-amber-250 hover:bg-amber-500/15 transition-all shadow-sm">
                <span className="text-[9px] font-bold text-zinc-550 uppercase tracking-widest block font-mono">Cash in Drawer</span>
                <span className="text-xl font-black text-amber-700 font-mono">₹{salesSummary.cashSales.toFixed(2)}</span>
                <span className="text-[9px] block text-amber-600 font-semibold mt-1 font-mono">Manual Ledger Asset</span>
              </div>
            </div>

            {/* mini payment progress representation */}
            <div className="mt-4 p-4.5 bg-gradient-to-b from-zinc-50 to-zinc-100/50 border border-zinc-200 rounded-xl space-y-2.5">
              <span className="text-[10px] font-bold text-zinc-500 uppercase font-mono block tracking-wide">Payment Mode Distribution Percentage</span>
              <div className="flex gap-1 h-3.5 rounded-full overflow-hidden bg-zinc-200 shadow-inner p-0.5">
                <div 
                  style={{ width: `${salesSummary.grandTotal > 0 ? (salesSummary.upiSales / salesSummary.grandTotal) * 100 : 0}%` }}
                  className="bg-gradient-to-r from-indigo-500 to-purple-650 rounded-full" 
                  title="UPI"
                />
                <div 
                  style={{ width: `${salesSummary.grandTotal > 0 ? (salesSummary.cashSales / salesSummary.grandTotal) * 100 : 0}%` }}
                  className="bg-gradient-to-r from-amber-500 to-orange-550 rounded-full" 
                  title="Cash"
                />
                <div 
                  style={{ width: `${salesSummary.grandTotal > 0 ? (salesSummary.cardSales / salesSummary.grandTotal) * 100 : 0}%` }}
                  className="bg-gradient-to-r from-sky-550 to-blue-650 rounded-full" 
                  title="Card"
                />
              </div>
              <div className="flex justify-between text-[9px] text-zinc-500">
                <span className="flex items-center gap-1 font-mono font-bold"><span className="w-1.5 h-1.5 rounded-full bg-indigo-500 block"></span>UPI {salesSummary.grandTotal > 0 ? Math.round((salesSummary.upiSales/salesSummary.grandTotal)*100) : 0}%</span>
                <span className="flex items-center gap-1 font-mono font-bold"><span className="w-1.5 h-1.5 rounded-full bg-amber-500 block"></span>Cash {salesSummary.grandTotal > 0 ? Math.round((salesSummary.cashSales/salesSummary.grandTotal)*100) : 0}%</span>
                <span className="flex items-center gap-1 font-mono font-bold"><span className="w-1.5 h-1.5 rounded-full bg-sky-500 block"></span>Card {salesSummary.grandTotal > 0 ? Math.round((salesSummary.cardSales/salesSummary.grandTotal)*100) : 0}%</span>
              </div>
            </div>
          </div>

          {/* SIMULATE SALE BUTTON ROW WITH MULTICOLOUR GRADIENTS */}
          <div className="mt-5 border-t border-zinc-100 pt-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-zinc-50/70 p-3 rounded-xl border border-zinc-100">
            <div className="text-left">
              <span className="text-[10px] font-bold text-zinc-500 block uppercase font-mono tracking-wider">Continuous Sandbox Testing</span>
              <p className="text-[10px] text-zinc-500 mt-0.5 leading-tight">Simulate offline or walk-in sales; watch stock drawdowns compute live on tiles.</p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <button 
                onClick={() => handleSimulateSale('Cash')}
                className="px-3.5 py-2 bg-gradient-to-r from-amber-550 to-orange-600 text-white rounded-lg text-[10px] font-black transition shadow-md shadow-amber-500/10 hover:brightness-110 active:scale-95 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                SIMULATE CASH
              </button>
              <button 
                onClick={() => handleSimulateSale('UPI/QR')}
                className="px-3.5 py-2 bg-gradient-to-r from-indigo-550 via-purple-600 to-rose-500 text-white rounded-lg text-[10px] font-black transition shadow-md shadow-indigo-500/10 hover:brightness-110 active:scale-95 flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                SIMULATE UPI / QR
              </button>
            </div>
          </div>
        </div>

        {/* 2. LOW STOCK ALERTS CARD WIDGET */}
        <div id="intel-widget-lowstock" className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-md space-y-4 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <div className="flex items-center gap-1.5">
                <ShieldAlert className="h-5 w-5 text-rose-500 bg-rose-100 p-1 rounded-xl" />
                <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider">
                  Real-time: Low Stock Alerts
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold px-2.5 py-0.5 rounded-full shadow-sm">
                  {activeLowStockFiltered.length} Flags
                </span>
                <label className="text-[10px] text-zinc-500 font-bold flex items-center gap-1.5 bg-zinc-50 px-2 py-0.5 rounded border border-zinc-200 cursor-pointer user-select-none">
                  <input 
                    type="checkbox" 
                    checked={showLowStockOnly} 
                    onChange={() => setShowLowStockOnly(!showLowStockOnly)}
                    className="rounded text-indigo-500 focus:ring-0" 
                  />
                  Low Only
                </label>
              </div>
            </div>

            {/* List scrollbar containing alerts */}
            <div className="mt-4 space-y-3 max-h-[220px] overflow-y-auto pr-1">
              {showLowStockOnly ? (
                activeLowStockFiltered.length > 0 ? (
                  activeLowStockFiltered.map((alert, idx) => (
                    <div key={idx} className="p-3 bg-gradient-to-r from-rose-500/5 via-pink-500/5 to-white border border-rose-100 hover:border-rose-350 rounded-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 transition">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-extrabold text-xs text-zinc-800 font-mono">{alert.product.name}</span>
                          <span className="bg-rose-100 border border-rose-200 text-rose-800 text-[8px] font-black px-1.5 py-0.5 rounded uppercase font-mono tracking-wider">
                            {alert.product.category}
                          </span>
                        </div>
                        <p className="text-[10px] text-zinc-500 mt-1">Chemical: {alert.product.salt}</p>
                        <p className="text-[9px] text-zinc-500 font-mono mt-0.5">
                          Current Stock: <strong className="text-rose-600 font-black">{alert.totalInStock} units</strong> (Min Limit: {alert.product.minStockLevel})
                        </p>
                      </div>

                      <div className="flex gap-1.5 mt-2 md:mt-0 w-full md:w-auto">
                        <button 
                          onClick={() => handleReplenishStock(alert.product.id, 250)}
                          className="flex-1 md:flex-none px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-lg text-[10px] font-bold shadow-md shadow-emerald-500/10 hover:brightness-105 active:scale-95 transition flex items-center gap-0.5 justify-center"
                        >
                          <CheckCircle className="h-3.5 w-3.5" /> RESTOCK 250
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedProductId(alert.product.id);
                            setShowNewPoForm(true);
                          }}
                          className="flex-1 md:flex-none px-3 py-1.5 bg-gradient-to-r from-violet-550 to-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-md shadow-indigo-500/10 hover:brightness-105 active:scale-95 transition flex items-center gap-0.5 justify-center"
                        >
                          <ShoppingCart className="h-3.5 w-3.5" /> DRAFT PO
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-10 bg-zinc-50 rounded-xl text-center border border-dashed border-zinc-200">
                    <CheckCircle2 className="h-8 w-8 text-emerald-500" />
                    <p className="text-xs font-bold text-zinc-700 mt-2">Inventory 100% Satisfactory</p>
                    <p className="text-[10px] text-zinc-400">All registered SKUs are currently above minimum reserve thresholds.</p>
                  </div>
                )
              ) : (
                lowStockAlerts.map((alert, idx) => (
                  <div key={idx} className={`p-3 border rounded-xl flex items-center justify-between gap-3 transition ${
                    alert.isLow ? 'bg-rose-50/40 border-rose-100' : 'bg-zinc-50/50 border-zinc-150 hover:border-zinc-300'
                  }`}>
                    <div>
                      <p className="font-extrabold text-xs text-zinc-800 font-mono">{alert.product.name}</p>
                      <span className="text-[10px] text-zinc-400 block font-mono">
                        Count: {alert.totalInStock} / {alert.product.minStockLevel} (min) | Category: {alert.product.category}
                      </span>
                    </div>
                    {alert.isLow && (
                      <button 
                        onClick={() => handleReplenishStock(alert.product.id, 200)}
                        className="px-2.5 py-1 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-extrabold text-[9px] rounded-lg shadow-sm"
                      >
                        REPLENISH
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 border-t border-zinc-150 pt-3 flex items-center justify-between text-[10px] text-zinc-500 bg-zinc-50 p-2.5 rounded-lg border">
            <span>Minimum levels set by Drug Controller Authority / local ERP registers.</span>
            <span className="font-mono text-[9px] font-black text-rose-500">Auto-calculated</span>
          </div>
        </div>

        {/* 3. EXPIRING ITEMS VALUATION WIDGET */}
        <div id="intel-widget-expiry" className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-md space-y-4 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="h-5 w-5 text-amber-500 bg-amber-100 p-1 rounded-xl" />
                Expiry Intelligence Registry
              </h3>
              <div className="flex gap-1.5">
                {[30, 90, 180].map((days) => (
                  <button
                    key={days}
                    onClick={() => setExpiryDaysThreshold(days as any)}
                    className={`px-3 py-1 text-[10px] font-bold rounded-lg transition-all ${
                      expiryDaysThreshold === days 
                        ? 'bg-gradient-to-r from-slate-800 to-slate-950 text-white shadow-sm' 
                        : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-650'
                    }`}
                  >
                    &lt;{days} Days
                  </button>
                ))}
              </div>
            </div>

            {/* Colorful summary panels */}
            <div className="grid grid-cols-3 gap-2.5 mt-4 text-center">
              <div className="p-2.5 bg-gradient-to-b from-rose-50 to-rose-100/40 rounded-xl border border-rose-300">
                <span className="text-[18px] font-black font-mono text-rose-900 leading-none">{expiringItemsReport.expiredCount}</span>
                <span className="text-[9px] text-rose-700 font-extrabold block uppercase mt-1">Expired Stock</span>
              </div>
              <div className="p-2.5 bg-gradient-to-b from-orange-50 to-orange-100/40 rounded-xl border border-orange-300">
                <span className="text-[18px] font-black font-mono text-orange-900 leading-none">{expiringItemsReport.criticalCount}</span>
                <span className="text-[9px] text-orange-700 font-extrabold block uppercase mt-1">&lt;30 Days</span>
              </div>
              <div className="p-2.5 bg-gradient-to-b from-amber-50 to-amber-100/40 rounded-xl border border-amber-300">
                <span className="text-[18px] font-black font-mono text-amber-900 leading-none">{expiringItemsReport.warningCount}</span>
                <span className="text-[9px] text-amber-700 font-extrabold block uppercase mt-1">&lt;{expiryDaysThreshold} Days</span>
              </div>
            </div>

            {/* List of critical near expired batches with custom indicators */}
            <div className="mt-4 space-y-2.5 max-h-[170px] overflow-y-auto pr-1">
              {expiringItemsReport.nearExpiryBatches.length > 0 ? (
                expiringItemsReport.nearExpiryBatches.map((item, idx) => (
                  <div key={idx} className="p-3 bg-gradient-to-r from-zinc-50 to-white border border-zinc-200 rounded-xl flex items-center justify-between text-xs hover:border-amber-350 hover:bg-zinc-50/50 transition duration-150">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-extrabold text-zinc-800">{item.product.name}</span>
                        <span className="bg-zinc-150 text-zinc-700 font-mono text-[9px] px-1.5 py-0.5 rounded border border-zinc-200">
                          Batch: {item.batch.batchNumber}
                        </span>
                        {item.daysRemaining <= 0 ? (
                          <span className="bg-gradient-to-r from-rose-500 to-pink-600 text-white font-bold text-[8px] px-2 py-0.5 rounded-full uppercase font-mono tracking-wider shadow-sm animate-pulse">
                            Expired
                          </span>
                        ) : item.daysRemaining <= 30 ? (
                          <span className="bg-gradient-to-r from-orange-400 to-amber-550 text-zinc-950 font-bold text-[8px] px-2 py-0.5 rounded-full uppercase font-mono tracking-wider shadow-sm">
                            Critical Close
                          </span>
                        ) : (
                          <span className="bg-amber-100 border border-amber-200 text-amber-800 font-bold text-[8px] px-2 py-0.5 rounded-full font-mono">
                            Warning Exp
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] text-zinc-500 font-mono mt-1.5">
                        Expiry Date: {item.batch.expiryDate} ({item.daysRemaining <= 0 ? 'Passed' : `${item.daysRemaining} days left`}) • Exp stock level: {item.batch.stockQty} unit(s)
                      </p>
                    </div>

                    <div className="shrink-0 flex gap-1 items-center">
                      {item.batch.stockQty > 0 ? (
                        <button 
                          onClick={() => handleDisposeBatch(item.batch.id)}
                          className="px-2.5 py-1.5 border border-rose-350 text-rose-600 hover:bg-rose-50 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-0.5 transition"
                          title="Purge Stock & File Debit Note"
                        >
                          <Trash2 className="h-3 w-3 text-rose-500 shrink-0" /> Return / Disposal
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full">
                          Handled / 0 Qty
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-400 text-xs">
                  No batches matching this filter require immediate attention.
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 leading-normal mt-3 bg-zinc-50 p-2.5 rounded-lg border">
            * Note: Drugs expiring in less than 30 days are legally barred from POS sales. The Apothecary POS checkout module will auto-block scan of barcode CALP-X102.
          </p>
        </div>

        {/* 4. PENDING PURCHASE ORDERS WIDGET WITH ATTRACTIVE ACTIONS */}
        <div id="intel-widget-po" className="bg-white border border-zinc-200/90 rounded-2xl p-5 shadow-md space-y-4 flex flex-col justify-between hover:shadow-lg transition-all">
          <div>
            <div className="flex items-center justify-between border-b border-zinc-150 pb-3">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingCart className="h-5 w-5 text-indigo-500 bg-indigo-100 p-1 rounded-xl" />
                Procurement / Purchase Orders
              </h3>
              <button 
                onClick={() => setShowNewPoForm(!showNewPoForm)}
                className="px-3 py-1.5 bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-600 text-white rounded-lg text-[10px] font-bold shadow-md shadow-indigo-500/10 hover:brightness-105 active:scale-95 transition flex items-center gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                CREATE DRAFT PO
              </button>
            </div>

            {/* POPUP PO CREATION SUB-FORM */}
            {showNewPoForm && (
              <form onSubmit={handleCreateNewPo} className="p-4 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 border border-indigo-200 rounded-xl space-y-3 mt-3 animate-fadeIn text-xs">
                <p className="font-bold text-indigo-955 uppercase text-[9px] tracking-wider font-mono">Fast Draft PO Maker</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold">Wholesaler Vendor</label>
                    <select 
                      value={selectedSupplierId}
                      onChange={(e) => setSelectedSupplierId(e.target.value)}
                      className="mt-1 w-full bg-white border border-zinc-200 p-1.5 rounded-lg text-xs"
                    >
                      {mockSuppliers.map(s => (
                        <option key={s.id} value={s.id}>{s.name} (Bal: ₹{s.outstandingBalance.toLocaleString()})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold">Required SKU Item</label>
                    <select 
                      value={selectedProductId}
                      onChange={(e) => setSelectedProductId(e.target.value)}
                      className="mt-1 w-full bg-white border border-zinc-200 p-1.5 rounded-lg text-xs"
                    >
                      {products.map(p => (
                        <option key={p.id} value={p.id}>{p.name} (Min level: {p.minStockLevel})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold">Purchase Volume (Tabs/Packs)</label>
                    <input 
                      type="number" 
                      value={poQty}
                      onChange={(e) => setPoQty(Number(e.target.value))}
                      className="mt-1 w-full bg-white border border-zinc-200 p-1.5 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-bold">Agreed Deal Price Unit (₹)</label>
                    <input 
                      type="number" 
                      value={poRate}
                      onChange={(e) => setPoRate(Number(e.target.value))}
                      className="mt-1 w-full bg-white border border-zinc-200 p-1.5 rounded-lg text-xs font-mono font-bold"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowNewPoForm(false)}
                    className="px-3 py-1.5 bg-white border border-zinc-250 text-zinc-650 rounded-lg hover:bg-zinc-100 text-[10px] font-bold"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 bg-gradient-to-r from-indigo-500 to-indigo-650 text-white rounded-lg font-black hover:brightness-105"
                  >
                    Inject Order Record
                  </button>
                </div>
              </form>
            )}

            {/* List of orders */}
            <div className="mt-4 space-y-3 max-h-[190px] overflow-y-auto pr-1">
              {pendingOrders.length > 0 ? (
                pendingOrders.map((po, idx) => (
                  <div key={idx} className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl hover:border-indigo-300 hover:bg-indigo-50/5 transition flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-xs text-zinc-800 font-mono">{po.poNumber}</span>
                        <span className={`text-[9px] font-mono font-black px-2 py-0.5 rounded uppercase ${
                          po.status === 'Draft' ? 'bg-zinc-200 text-zinc-700' :
                          po.status === 'Pending Approval' ? 'bg-orange-50 text-orange-800 border border-orange-200' :
                          po.status === 'Approved' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                          'bg-indigo-50 text-indigo-700'
                        }`}>
                          {po.status}
                        </span>
                      </div>
                      <p className="text-[10px] text-zinc-500 mt-1">To: <span className="font-bold text-zinc-700">{po.supplierName}</span> • Date: {po.date}</p>
                      <div className="mt-1.5 text-[9px] text-zinc-500 font-mono space-y-0.5 border-l-2 border-indigo-200 pl-2">
                        {po.items.map((i: any, subIdx) => (
                          <div key={subIdx}>Ordered: {i.productName} ({i.qty} units @ ₹{i.rate})</div>
                        ))}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <span className="text-xs font-black text-indigo-850 font-mono bg-indigo-50 border border-indigo-100 px-2 py-1 rounded block text-right shadow-sm">
                        ₹{po.totalAmount.toLocaleString()}
                      </span>
                      {po.status === 'Draft' && (
                        <button 
                          onClick={() => handleUpdatePoStatus(po.id, 'Approved')}
                          className="px-2.5 py-1.5 uppercase transition bg-gradient-to-r from-sky-500 to-blue-600 text-white font-extrabold text-[9px] rounded-lg shadow shadow-sky-500/10 hover:brightness-105"
                        >
                          Send Out
                        </button>
                      )}
                      {po.status === 'Approved' && (
                        <button 
                          onClick={() => handleUpdatePoStatus(po.id, 'Received')}
                          className="px-2.5 py-1.5 uppercase transition bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-extrabold text-[9px] rounded-lg flex items-center gap-1 shadow shadow-emerald-500/10 hover:brightness-105"
                        >
                          <Truck className="h-3.5 w-3.5" /> Received
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-zinc-400 text-xs">
                  No active draft/pending purchase orders. Create a simulated PO.
                </div>
              )}
            </div>
          </div>

          <p className="text-[10px] text-zinc-500 italic leading-snug mt-3">
            * ERP Trigger Hint: Clicking "Goods Received" immediately pushes the ordered quantities into local batch stock counts, clearing any active low-stock alarms!
          </p>
        </div>

      </div>

    </div>
  );
}
