import React, { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Printer, CheckCircle, Pause, RefreshCw, Smartphone, CreditCard, Landmark, DollarSign, Plus, Minimize2 } from 'lucide-react';
import { Product, BatchInfo, SalesInvoice, InvoiceItem } from '../../types';
import { mockProducts, mockBatches } from '../../data/mockData';

interface BillingModuleProps {
  branch: string;
}

export default function BillingModule({ branch }: BillingModuleProps) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [batches, setBatches] = useState<BatchInfo[]>(mockBatches);
  const [cartItems, setCartItems] = useState<InvoiceItem[]>([]);
  const [customerName, setCustomerName] = useState('Walk-In Customer');
  const [customerPhone, setCustomerPhone] = useState('9999988888');
  const [searchQuery, setSearchQuery] = useState('');
  const [heldBills, setHeldBills] = useState<{ id: string; name: string; items: InvoiceItem[] }[]>([]);
  const [paymentMode, setPaymentMode] = useState<'Cash' | 'Credit' | 'UPI/QR' | 'Card'>('Cash');
  const [loyaltyApplied, setLoyaltyApplied] = useState(false);
  const [discountPct, setGlobalDiscountPct] = useState(10);
  const [showInvoicedReceipt, setShowInvoicedReceipt] = useState<any | null>(null);

  // Synchronize state with backend
  const refreshLiveDataset = async () => {
    try {
      const prodRes = await fetch('/api/products');
      const prodData = await prodRes.json();
      if (prodData && prodData.data) {
        setProducts(prodData.data);
      }
      
      const batchRes = await fetch('/api/batches');
      const batchData = await batchRes.json();
      if (batchData && batchData.data) {
        setBatches(batchData.data);
      }
    } catch (err) {
      console.warn("Could not load live SCM details in BillingModule. Using fallback static mocks.", err);
    }
  };

  useEffect(() => {
    refreshLiveDataset();
  }, []);

  // Search filter
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.salt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Add Item to Bill
  const addItemToBill = (p: Product) => {
    // Locate corresponding unexpired batches
    const batch = batches.find(b => b.productId === p.id && new Date(b.expiryDate) > new Date()) || batches.find(b => b.productId === p.id);
    if (!batch) return;

    // Check if product is already in cart
    const existing = cartItems.find(item => item.productId === p.id && item.batchId === batch.id);
    if (existing) {
      setCartItems(cartItems.map(item =>
        item.productId === p.id && item.batchId === batch.id
          ? { ...item, qty: item.qty + 1, total: Number(((item.qty + 1) * item.mrp * (1 - item.discountPct / 100) * (1 + item.gstRate / 100)).toFixed(2)) }
          : item
      ));
    } else {
      const price = p.priceList.retailPrice;
      const gstBase = p.gstRate || 12;
      const computedTotal = Number((1 * price * (1 - discountPct / 100) * (1 + gstBase / 100)).toFixed(2));

      const newItem: InvoiceItem = {
        productId: p.id,
        productName: p.name,
        salt: p.salt,
        batchId: batch.id,
        batchNumber: batch.batchNumber,
        expiryDate: batch.expiryDate,
        qty: 1,
        mrp: price,
        discountPct: discountPct,
        gstRate: gstBase,
        cgst: Number((price * (gstBase / 2) / 100).toFixed(2)),
        sgst: Number((price * (gstBase / 2) / 100).toFixed(2)),
        igst: 0,
        total: computedTotal
      };
      setCartItems([...cartItems, newItem]);
    }
  };

  const updateItemQty = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCartItems(cartItems.filter(item => item.productId !== productId));
      return;
    }
    setCartItems(cartItems.map(item => {
      if (item.productId === productId) {
        const lineTotal = Number((qty * item.mrp * (1 - item.discountPct / 100) * (1 + item.gstRate / 100)).toFixed(2));
        return {
          ...item,
          qty,
          total: lineTotal
        };
      }
      return item;
    }));
  };

  const removeItem = (productId: string) => {
    setCartItems(cartItems.filter(item => item.productId !== productId));
  };

  // Hold current billing ticket
  const holdBill = () => {
    if (cartItems.length === 0) return;
    const newHold = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      name: `${customerName} (${cartItems.length} items)`,
      items: cartItems
    };
    setHeldBills([...heldBills, newHold]);
    setCartItems([]);
    setCustomerName('Walk-In Customer');
    setCustomerPhone('9999988888');
  };

  // Resume held bill
  const resumeBill = (id: string) => {
    const bill = heldBills.find(b => b.id === id);
    if (!bill) return;
    setCartItems(bill.items);
    setHeldBills(heldBills.filter(b => b.id !== id));
  };

  // Computations
  const subtotal = cartItems.reduce((acc, curr) => acc + (curr.qty * curr.mrp), 0);
  const totalDiscount = cartItems.reduce((acc, curr) => acc + (curr.qty * curr.mrp * (curr.discountPct / 100)), 0);
  const cgstAmount = cartItems.reduce((acc, curr) => {
    const discountedPrice = curr.mrp * (1 - curr.discountPct / 100);
    return acc + (curr.qty * discountedPrice * ((curr.gstRate / 2) / 100));
  }, 0);
  const sgstAmount = cgstAmount; // CGST == SGST for Local intra-state bills
  const finalLoyaltySub = loyaltyApplied ? 45 : 0; // simulated point conversion
  const grandTotal = Number((subtotal - totalDiscount + cgstAmount + sgstAmount - finalLoyaltySub).toFixed(2));

  // Process checkout transaction
  const submitCheckout = async () => {
    if (cartItems.length === 0) return;

    const payload = {
      customerName,
      customerPhone,
      subtotal: subtotal - totalDiscount,
      discount: totalDiscount + finalLoyaltySub,
      paymentMode,
      items: cartItems
    };

    // Commit to server state
    try {
      const res = await fetch('/api/sandbox/billing/invoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.status === 201) {
        setShowInvoicedReceipt(data.invoice);
        setCartItems([]);
        setCustomerName('Walk-In Customer');
        setCustomerPhone('9999988888');
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex-1 p-6 bg-zinc-50 flex gap-6 overflow-hidden h-full">
      {/* Left side: Product inventory browser & Quick search */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col overflow-hidden shadow-sm">
        <div className="flex items-center justify-between mb-4 flex-shrink-0">
          <div>
            <h2 className="text-base font-bold text-zinc-800">Drug Inventory Quick-POS</h2>
            <p className="text-xs text-zinc-500">Intelligent real-time catalog matched to branch stock levels</p>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 bg-sky-50 border border-sky-200 text-sky-700 rounded-full">
            Counter 01 / {branch.split(' (')[0]}
          </span>
        </div>

        {/* Search input */}
        <div className="mb-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Type Product Name, Salt composition, or Brand (e.g., Calpol, Metformin)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-sm px-4 py-3 bg-zinc-50 border border-zinc-200 focus:outline-none focus:ring-2 focus:ring-sky-500/30 focus:border-sky-500 rounded-xl transition font-medium text-zinc-900"
          />
        </div>

        {/* Inventory Item Listings */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 pr-1">
          {filteredProducts.map(product => {
            // Find active stock summary
            const productBatches = batches.filter(b => b.productId === product.id);
            const totalStock = productBatches.reduce((sum, b) => sum + b.stockQty, 0);
            const nearestExpiry = productBatches.reduce((soonest, b) => {
              if (!soonest) return b.expiryDate;
              return new Date(b.expiryDate) < new Date(soonest) ? b.expiryDate : soonest;
            }, '');

            const isNarcoticControl = p => p.category === 'Schedule X' || p.category === 'Narcotics' || p.category === 'Schedule H';

            return (
              <div
                key={product.id}
                className="p-3.5 border border-zinc-200 rounded-xl bg-white hover:border-sky-500 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full ${
                      isNarcoticControl(product) ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-zinc-50 text-zinc-500 border border-zinc-200'
                    }`}>
                      {product.category}
                    </span>
                    <span className="text-xs font-mono font-bold text-zinc-700">₹{product.priceList.retailPrice.toFixed(2)}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-zinc-800 tracking-tight mt-1">{product.name}</h3>
                  <p className="text-[11px] text-zinc-400 font-medium leading-normal mt-0.5">{product.salt}</p>
                </div>

                <div className="border-t border-zinc-100 pt-2.5 mt-3 flex items-center justify-between">
                  <div className="text-[10px] leading-tight">
                    <p className="text-zinc-400">Total Stock:</p>
                    <p className={`font-mono font-bold ${totalStock < 100 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {totalStock} Sub-packs
                    </p>
                    {nearestExpiry && (
                      <p className="text-zinc-400 scale-95 origin-left">Exp: {nearestExpiry}</p>
                    )}
                  </div>
                  <button
                    onClick={() => addItemToBill(product)}
                    className="flex items-center gap-1.5 text-xs bg-sky-50 border border-sky-200 hover:bg-sky-600 hover:text-white hover:border-transparent text-sky-700 px-3 py-1.5 rounded-lg font-semibold transition"
                  >
                    <Plus className="h-3.5 w-3.5" /> ADD TO BILL
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Billing Cart Summary Terminal */}
      <div className="w-96 bg-white border border-zinc-200 rounded-2xl flex flex-col overflow-hidden shadow-sm flex-shrink-0">
        <div className="p-4 bg-zinc-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-sky-400" />
            <h3 className="text-sm font-bold tracking-tight">Active Billing Terminal</h3>
          </div>
          <span className="text-xs font-mono bg-sky-500/10 text-sky-400 border border-sky-400/20 px-2 py-0.5 rounded-full">
            {cartItems.length} lines
          </span>
        </div>

        {/* Customer Input Section */}
        <div className="p-4 border-b border-zinc-100 bg-zinc-50/50 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Customer Name</label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded-lg bg-white text-zinc-800 font-medium focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Customer Phone</label>
              <input
                type="text"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 border border-zinc-200 rounded-lg bg-white text-zinc-800 font-medium focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center p-8 text-center text-zinc-400">
              <ShoppingCart className="h-10 w-10 text-zinc-200 mb-2 stroke-[1.5]" />
              <p className="text-xs font-medium">POS register is currently empty.</p>
              <p className="text-[10px] text-zinc-400 mt-1">Select from the local drug master on the left to begin compiling sales.</p>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.productId} className="flex items-center justify-between gap-3 p-2.5 border border-dashed border-zinc-200 rounded-xl">
                <div className="overflow-hidden flex-1">
                  <h4 className="text-xs font-bold text-zinc-800 truncate leading-none">{item.productName}</h4>
                  <p className="text-[10px] text-zinc-400 mt-1 leading-none font-medium">Batch {item.batchNumber} | Exp {item.expiryDate}</p>
                  <p className="text-[10px] font-mono text-zinc-500 font-bold mt-1.5">
                    ₹{item.mrp.toFixed(2)} <span className="text-[9px] text-amber-600">(-{item.discountPct}% disc, GST @{item.gstRate}%)</span>
                  </p>
                </div>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={item.qty}
                    onChange={(e) => updateItemQty(item.productId, Number(e.target.value))}
                    className="w-12 text-center text-xs border border-zinc-200 py-1 rounded bg-zinc-50 font-mono font-semibold"
                  />
                  <button
                    onClick={() => removeItem(item.productId)}
                    className="p-1.5 text-zinc-400 hover:text-rose-600 rounded hover:bg-zinc-100 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Held queue summary */}
        {heldBills.length > 0 && (
          <div className="p-3 bg-amber-50 border-t border-b border-amber-200/50 flex flex-col gap-1.5">
            <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wide">Held Billing Sessions</p>
            <div className="flex gap-2 overflow-x-auto pb-1">
              {heldBills.map(b => (
                <button
                  key={b.id}
                  onClick={() => resumeBill(b.id)}
                  className="flex-shrink-0 text-[10px] bg-white border border-amber-300 text-amber-800 px-2 py-1 rounded font-semibold hover:bg-amber-100 transition"
                >
                  Retrieve {b.id}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Totals & GST calculation splits */}
        <div className="p-4 bg-zinc-50 border-t border-zinc-200 space-y-2.5">
          <div className="space-y-1 text-xs text-zinc-500">
            <div className="flex justify-between">
              <span>Gross Base Subtotal:</span>
              <span className="font-mono text-zinc-700 font-medium">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-rose-600">
              <span>Discounts (-{discountPct}%):</span>
              <span className="font-mono font-medium">-₹{totalDiscount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>CGST Split (Central Pool):</span>
              <span className="font-mono text-zinc-700 font-medium">+₹{cgstAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>SGST Split (State Pool):</span>
              <span className="font-mono text-zinc-700 font-medium">+₹{sgstAmount.toFixed(2)}</span>
            </div>
            {loyaltyApplied && (
              <div className="flex justify-between text-emerald-600">
                <span>Loyalty Point Rebate:</span>
                <span className="font-mono font-medium">-₹45.00</span>
              </div>
            )}
          </div>

          {/* Payment Mode options selector */}
          <div className="pt-2 border-t border-zinc-200 grid grid-cols-4 gap-1.5">
            <button
              onClick={() => setPaymentMode('Cash')}
              className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition ${
                paymentMode === 'Cash' ? 'bg-zinc-800 text-white border-transparent' : 'bg-white text-zinc-600 border-zinc-200'
              }`}
            >
              CASH
            </button>
            <button
              onClick={() => setPaymentMode('Card')}
              className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition ${
                paymentMode === 'Card' ? 'bg-zinc-800 text-white border-transparent' : 'bg-white text-zinc-600 border-zinc-200'
              }`}
            >
              CARD
            </button>
            <button
              onClick={() => setPaymentMode('UPI/QR')}
              className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition ${
                paymentMode === 'UPI/QR' ? 'bg-zinc-800 text-white border-transparent' : 'bg-white text-zinc-600 border-zinc-200'
              }`}
            >
              UPI QR
            </button>
            <button
              onClick={() => setPaymentMode('Credit')}
              className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition ${
                paymentMode === 'Credit' ? 'bg-zinc-800 text-white border-transparent' : 'bg-white text-zinc-600 border-zinc-200'
              }`}
            >
              CREDIT
            </button>
          </div>

          <div className="pt-1.5 flex justify-between items-center bg-zinc-900 text-white p-3 rounded-xl">
            <span className="text-xs font-bold uppercase tracking-wide text-zinc-400">GRAND TOTAL</span>
            <span className="text-lg font-mono font-bold text-sky-400">₹{grandTotal.toFixed(2)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={holdBill}
              disabled={cartItems.length === 0}
              className="py-2.5 text-xs font-semibold bg-zinc-200 hover:bg-zinc-300 disabled:opacity-50 text-zinc-700 rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <Pause className="h-3.5 w-3.5" /> HOLD BILL
            </button>
            <button
              onClick={submitCheckout}
              disabled={cartItems.length === 0}
              className="py-2.5 text-xs font-bold bg-sky-600 hover:bg-sky-750 disabled:opacity-50 text-white rounded-xl transition flex items-center justify-center gap-1.5"
            >
              <CheckCircle className="h-3.5 w-3.5" /> CHECKOUT ({paymentMode})
            </button>
          </div>
        </div>
      </div>

      {/* Invoice Printing Receipt Modal Popup */}
      {showInvoicedReceipt && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md border border-zinc-200 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="p-4 bg-sky-600 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Printer className="h-5 w-5" />
                <h3 className="text-sm font-bold tracking-tight">Active Terminal Cash Printout</h3>
              </div>
              <button
                onClick={() => setShowInvoicedReceipt(null)}
                className="text-white hover:text-sky-200 transition"
              >
                <Minimize2 className="h-5 w-5" />
              </button>
            </div>

            <div className="p-6 bg-amber-50/20 font-mono text-[11px] leading-relaxed text-zinc-800 space-y-4 max-h-[450px] overflow-y-auto">
              {/* Header */}
              <div className="text-center border-b border-dashed border-zinc-300 pb-3 space-y-1">
                <h2 className="text-sm font-bold text-zinc-900">APOTHECARY HEALTH HEALTH</h2>
                <p>Noida Sector 63 Logistics Branch</p>
                <p>GSTIN: 09AABCM3928L1Z9</p>
                <p className="pt-1.5 text-[10px] text-zinc-500">TAX INVOICE - DIGITAL RECEIPT</p>
              </div>

              {/* Meta information */}
              <div className="space-y-0.5">
                <p><span className="font-bold">INVOICE:</span> {showInvoicedReceipt.invoiceNumber}</p>
                <p><span className="font-bold">DATE:</span> {showInvoicedReceipt.date} 03:55 UTC</p>
                <p><span className="font-bold">CLIENT:</span> {showInvoicedReceipt.customerName}</p>
                <p><span className="font-bold">CONTACT:</span> {showInvoicedReceipt.customerPhone}</p>
                <p><span className="font-bold">OPERATOR:</span> Cashier Terminal EMP04</p>
              </div>

              {/* Items Table */}
              <div className="border-t border-b border-dashed border-zinc-300 py-2.5">
                <div className="grid grid-cols-12 font-bold pb-1.5 text-zinc-900 decoration-zinc-400">
                  <span className="col-span-5">DRUG / SALT</span>
                  <span className="col-span-2 text-center">BATCH</span>
                  <span className="col-span-1 text-center">QTY</span>
                  <span className="col-span-2 text-right">MRP</span>
                  <span className="col-span-2 text-right">TOTAL</span>
                </div>
                {showInvoicedReceipt.items.map((it: any, idx: number) => (
                  <div key={idx} className="grid grid-cols-12 py-1 select-all border-b border-dashed border-zinc-100/40">
                    <div className="col-span-5">
                      <p className="font-bold text-zinc-900">{it.productName}</p>
                      <span className="text-[9px] text-zinc-400 block leading-tight">{it.salt}</span>
                    </div>
                    <span className="col-span-2 text-center text-zinc-500">{it.batchNumber}</span>
                    <span className="col-span-1 text-center font-bold text-zinc-900">{it.qty}</span>
                    <span className="col-span-2 text-right">₹{it.mrp.toFixed(1)}</span>
                    <span className="col-span-2 text-right font-bold">₹{it.total.toFixed(1)}</span>
                  </div>
                ))}
              </div>

              {/* Valuation & Tax Pool Splits */}
              <div className="space-y-1 align-right text-right">
                <p>Gross Subtotal (Less Disc): ₹{(showInvoicedReceipt.totals.subtotal).toFixed(2)}</p>
                <p>CGST Pool Allocation (6% Area): ₹{(showInvoicedReceipt.totals.cgst).toFixed(2)}</p>
                <p>SGST Pool Allocation (6% Area): ₹{(showInvoicedReceipt.totals.sgst).toFixed(2)}</p>
                <p className="text-xs font-bold text-zinc-900 border-t border-dashed border-zinc-200 pt-1.5">
                  NET INVOICE TOTAL: INR {showInvoicedReceipt.totals.grandTotal.toFixed(2)}
                </p>
                <p className="font-semibold text-emerald-700">TENDER: {showInvoicedReceipt.paymentMode} - FULLY PAID (AUTH_OK)</p>
              </div>

              {/* Regulatory Footer */}
              <div className="text-center border-t border-dashed border-zinc-300 pt-3 text-[10px] text-zinc-400 space-y-0.5">
                <p>Schedule H Warnings: Stamped dispensing required.</p>
                <p>Thank you for letting us serve you. Stay Healthy!</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border-t border-zinc-200 flex justify-end gap-2.5">
              <button
                onClick={() => {
                  const printContent = document.querySelector('.bg-amber-50\\/20')?.innerHTML || '';
                  const printWin = window.open('', '', 'width=400,height=600');
                  if (printWin) {
                    printWin.document.write(`<html><body style="font-family:monospace;padding:20px;">${printContent}</body></html>`);
                    printWin.print();
                    printWin.close();
                  }
                }}
                className="px-4 py-2 text-xs font-semibold bg-zinc-800 text-white rounded-xl hover:bg-black transition flex items-center gap-1.5"
              >
                <Printer className="h-3.5 w-3.5" /> Send to POS Device
              </button>
              <button
                onClick={() => {
                  // Direct PDF File simulation trigger
                  const textContent = document.querySelector('.bg-amber-50\\/20')?.textContent || '';
                  const blob = new Blob([textContent], { type: 'text/plain' });
                  const link = document.createElement('a');
                  link.href = URL.createObjectURL(blob);
                  link.download = `${showInvoicedReceipt.invoiceNumber}.txt`;
                  link.click();
                }}
                className="px-4 py-2 text-xs font-semibold bg-zinc-200 text-zinc-700 hover:bg-zinc-300 rounded-xl transition"
              >
                Download Receipt Text
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
