import React, { useState } from 'react';
import { Settings, Info, PlusCircle, Search, ShieldCheck, Mail, Phone, MapPin, Trash2, CheckCircle2 } from 'lucide-react';
import { Product, Doctor, Supplier } from '../../types';
import { mockProducts, mockDoctors, mockSuppliers } from '../../data/mockData';

export default function MasterSetupModule() {
  const [activeWorkspace, setActiveWorkspace] = useState<'products' | 'doctors' | 'suppliers' | 'company'>('company');
  const [searchWord, setSearchWord] = useState('');

  // Editable lists states 
  const [productsList, setProductsList] = useState<Product[]>(mockProducts);
  const [doctorsList, setDoctorsList] = useState<Doctor[]>(mockDoctors);
  const [suppliersList, setSuppliersList] = useState<Supplier[]>(mockSuppliers);

  // Forms states
  const [newProd, setNewProd] = useState({ name: '', salt: '', category: 'Schedule H' as any, hsnCode: '', taxRate: 12.00, packSize: '' });
  const [newDoc, setNewDoc] = useState({ name: '', regNo: '', spec: '', phone: '' });
  const [newSup, setNewSup] = useState({ name: '', gst: '', phone: '', address: '' });

  // Company creation state
  const [companyDetails, setCompanyDetails] = useState({
    name: 'Apothecary Healthcare Group PLC',
    legalName: 'Apothecary India Pharmaceuticals Ltd.',
    gst: '07AAAAA1111A1Z1',
    pan: 'AAAAA1111A',
    address: 'SCF-22, Central Market, Sector 15 Noida, Uttar Pradesh — 201301',
    branches: ['Main Branch (Retail POS)', 'Noida Godown (SCM Central)', 'Gwalior Franchise Hub']
  });

  const handleAddProduct = () => {
    if (!newProd.name || !newProd.salt) {
      alert("Please fill in the Product Name and Chemical Salt compound.");
      return;
    }
    const productItem: Product = {
      id: `P00${productsList.length + 1}`,
      name: newProd.name,
      salt: newProd.salt,
      manufacturer: 'Apothecary Labs',
      category: newProd.category,
      hsn: newProd.hsnCode || '30049099',
      gstRate: newProd.taxRate,
      packSize: newProd.packSize || '10 Tablets',
      minStockLevel: 50,
      maxStockLevel: 1000,
      rackLocation: 'Rack A-2',
      priceList: {
        retailPrice: 150,
        wholesalePrice: 120,
        distributorPrice: 100
      }
    };
    setProductsList([...productsList, productItem]);
    setNewProd({ name: '', salt: '', category: 'Schedule H', hsnCode: '', taxRate: 12, packSize: '' });
    alert("New product master catalog item saved successfully.");
  };

  const handleAddDoctor = () => {
    if (!newDoc.name || !newDoc.regNo) {
      alert("Doctor Name and Medical Registration state number are strictly required.");
      return;
    }
    const d: Doctor = {
      id: `D0${doctorsList.length + 1}`,
      name: newDoc.name,
      registrationNumber: newDoc.regNo,
      specialization: newDoc.spec || 'General Physician',
      clinicAddress: 'Sector 15 Clinical Hub',
      contact: newDoc.phone || '9988776655',
      email: 'doctor@apothecary.com'
    };
    setDoctorsList([...doctorsList, d]);
    setNewDoc({ name: '', regNo: '', spec: '', phone: '' });
    alert("Physician licensing details registered cleanly.");
  };

  const handleAddSupplier = () => {
    if (!newSup.name || !newSup.gst) {
      alert("Supplier name and GST Tax Registrant ID are mandatory.");
      return;
    }
    const s: Supplier = {
      id: `S${suppliersList.length + 1}`,
      name: newSup.name,
      gstin: newSup.gst,
      contactPerson: 'Vendor Dispatch Desk',
      phone: newSup.phone || '9900881122',
      email: 'logistics@pharmascm.com',
      address: newSup.address || 'Industrial SCM Depot Central',
      outstandingBalance: 0,
      creditLimit: 500000
    };
    setSuppliersList([...suppliersList, s]);
    setNewSup({ name: '', gst: '', phone: '', address: '' });
    alert("Supplier credential logs added.");
  };

  return (
    <div className="flex-1 p-6 bg-zinc-50 flex flex-col overflow-hidden h-full">
      {/* Title Header */}
      <div className="flex justify-between items-center mb-5 flex-shrink-0">
        <div>
          <h2 className="text-base font-bold text-zinc-800">Module 01: Core Master Setup & Configurations</h2>
          <p className="text-xs text-zinc-500 font-medium">Multi-tenant company structures, registered suppliers, FDA class formulations, and licensing rosters</p>
        </div>
      </div>

      {/* Categories Tabs */}
      <div className="flex border-b border-zinc-200 mb-4 bg-white p-1 rounded-xl border flex-shrink-0">
        <button
          onClick={() => { setActiveWorkspace('company'); setSearchWord(''); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeWorkspace === 'company' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-650 hover:text-zinc-900'
          }`}
        >
          Company Registry Profile
        </button>
        <button
          onClick={() => { setActiveWorkspace('products'); setSearchWord(''); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeWorkspace === 'products' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-650 hover:text-zinc-900'
          }`}
        >
          Product Formulation Catalog Master
        </button>
        <button
          onClick={() => { setActiveWorkspace('doctors'); setSearchWord(''); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeWorkspace === 'doctors' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-650 hover:text-zinc-900'
          }`}
        >
          Fictional Physician Licences Master
        </button>
        <button
          onClick={() => { setActiveWorkspace('suppliers'); setSearchWord(''); }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition ${
            activeWorkspace === 'suppliers' ? 'bg-zinc-900 text-white shadow-sm' : 'text-zinc-650 hover:text-zinc-900'
          }`}
        >
          Supplier & Distributor Registry
        </button>
      </div>

      {/* Workspace Display Layout */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl flex flex-col overflow-hidden shadow-sm">
        
        {/* --- 1. COMPANY CREATION MASTER WORKSPACE --- */}
        {activeWorkspace === 'company' && (
          <div className="flex-1 p-5 overflow-y-auto grid grid-cols-2 gap-6 leading-relaxed">
            {/* Meta Company details */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-widest flex items-center gap-1.5">
                <Settings className="h-4.5 w-4.5 text-zinc-550" /> Multi-Tenant Entity Profile
              </h3>
              
              <div className="grid grid-cols-1 gap-3.5">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Company Registered Name</label>
                  <input
                    type="text"
                    value={companyDetails.name}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-850 font-semibold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Legal Entity Subtitle</label>
                  <input
                    type="text"
                    value={companyDetails.legalName}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, legalName: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-850"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">PAN Number ID</label>
                    <input
                      type="text"
                      value={companyDetails.pan}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, pan: e.target.value })}
                      className="w-full text-xs font-mono font-bold px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-850"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">GST Registration No.</label>
                    <input
                      type="text"
                      value={companyDetails.gst}
                      onChange={(e) => setCompanyDetails({ ...companyDetails, gst: e.target.value })}
                      className="w-full text-xs font-mono font-bold px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-850"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Registered HQ Address</label>
                  <textarea
                    rows={2}
                    value={companyDetails.address}
                    onChange={(e) => setCompanyDetails({ ...companyDetails, address: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-zinc-850"
                  />
                </div>
              </div>
            </div>

            {/* List Franchise / branches inside */}
            <div className="border bg-zinc-50/20 rounded-xl p-4 flex flex-col justify-between">
              <div>
                <dt className="text-xs font-bold uppercase tracking-widest text-zinc-800 mb-3 block">Tenant Registered Branches</dt>
                <div className="space-y-2.5">
                  {companyDetails.branches.map((bName, idx) => (
                    <div key={idx} className="p-3 bg-white border border-zinc-200 rounded-lg flex items-center justify-between shadow-sm">
                      <span className="text-xs font-semibold text-zinc-800">{bName}</span>
                      <span className="text-[9px] bg-sky-50 text-sky-800 font-bold border border-sky-100 px-2 py-0.5 rounded-full select-none">
                        Active Node
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-3.5 bg-emerald-50 border border-emerald-100 text-emerald-800 rounded-xl text-xs flex items-start gap-2">
                <ShieldCheck className="h-5 w-5 mt-0.5 flex-shrink-0" />
                <div>
                  <strong className="block uppercase text-[10px] tracking-wide">Multi-Branch Sync Operational</strong>
                  Data security validations restrict crossing transaction registries between unmapped tenant partitions. High GAMP 5 design parameters are fully active.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- 2. PRODUCT MASTER CATALOG SETUP --- */}
        {activeWorkspace === 'products' && (
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Input Form Panel */}
            <div className="col-span-4 p-5 bg-zinc-50/30 border-r border-zinc-200 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Product Formulary Indexing Form</span>
                
                <div>
                  <label className="text-[10px] font-bold text-zinc-600 block mb-1">Product Brand Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Lipitor, Glycomet GP..."
                    value={newProd.name}
                    onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-600 block mb-1">Active Ingredient Compound (Salt)</label>
                  <input
                    type="text"
                    placeholder="e.g. Atorvastatin 10mg..."
                    value={newProd.salt}
                    onChange={(e) => setNewProd({ ...newProd, salt: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-600 block mb-1">Schedule Drug Category</label>
                    <select
                      value={newProd.category}
                      onChange={(e) => setNewProd({ ...newProd, category: e.target.value as any })}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-zinc-200 rounded-lg"
                    >
                      <option value="Schedule H">Schedule H</option>
                      <option value="Schedule X">Schedule X (Sedatives)</option>
                      <option value="OTC">OTC Drug</option>
                      <option value="Narcotics">Narcotic Record</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-600 block mb-1">HSN Tax Code</label>
                    <input
                      type="text"
                      placeholder="e.g. 30049099"
                      value={newProd.hsnCode}
                      onChange={(e) => setNewProd({ ...newProd, hsnCode: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900 font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-600 block mb-1">GST Tax Rate (%)</label>
                    <select
                      value={newProd.taxRate}
                      onChange={(e) => setNewProd({ ...newProd, taxRate: parseFloat(e.target.value) })}
                      className="w-full text-xs px-3 py-1.5 bg-white border border-zinc-200 rounded-lg font-mono"
                    >
                      <option value={12.00}>12% Drug standard</option>
                      <option value={5.00}>5.0% Med devices</option>
                      <option value={18.00}>18.0% General tax</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-600 block mb-1">Pack Size Details</label>
                    <input
                      type="text"
                      placeholder="e.g. 10 TabletsStrip"
                      value={newProd.packSize}
                      onChange={(e) => setNewProd({ ...newProd, packSize: e.target.value })}
                      className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={handleAddProduct}
                className="w-full mt-4 py-2.5 text-xs font-bold bg-zinc-900 hover:bg-black text-white rounded-xl transition"
              >
                SAVE CATALOG RECORD
              </button>
            </div>

            {/* List display panel */}
            <div className="col-span-8 p-5 flex flex-col overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest">Active Product Formulary Entries</span>
                {/* Simple Search */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Quick search products..."
                    value={searchWord}
                    onChange={(e) => setSearchWord(e.target.value)}
                    className="text-xs px-3 py-1.5 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none focus:ring-1 pr-8 font-medium text-zinc-800"
                  />
                  <Search className="h-4 w-4 text-zinc-400 absolute right-2 top-2" />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto space-y-2">
                {productsList
                  .filter(p => !searchWord || p.name.toLowerCase().includes(searchWord.toLowerCase()) || p.salt.toLowerCase().includes(searchWord.toLowerCase()))
                  .map((p) => (
                    <div key={p.id} className="p-3 bg-white border border-zinc-200 rounded-xl flex items-center justify-between text-left hover:border-zinc-300 transition">
                      <div>
                        <h4 className="text-xs font-bold text-zinc-800">{p.name} <span className="text-[10px] text-zinc-400 font-mono font-medium">({p.id})</span></h4>
                        <p className="text-[10px] text-zinc-500 mt-0.5 leading-none">{p.salt}</p>
                        <div className="mt-2 flex gap-3 text-[9px] text-zinc-400 font-mono">
                          <span>HSN: {p.hsn}</span>
                          <span>Tax Pct: {p.gstRate}%</span>
                        </div>
                      </div>
                      <span className={`text-[9px] leading-none px-2.5 py-1 rounded-full font-bold uppercase tracking-wide border ${
                        p.category === 'Schedule X' || p.category === 'Narcotics'
                          ? 'bg-rose-50 border-rose-200 text-rose-700 animate-pulse'
                          : 'bg-zinc-50 border-zinc-200 text-zinc-600'
                      }`}>
                        {p.category}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 3. PHYSICIANS MASTER DETAILS --- */}
        {activeWorkspace === 'doctors' && (
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Input Form Panel */}
            <div className="col-span-4 p-5 bg-zinc-50/30 border-r border-zinc-200 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Register Prescribing Doctors</span>
                
                <div>
                  <label className="text-[10px] font-bold text-zinc-650 block mb-1">Physician Legal Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. Agrawal M.D."
                    value={newDoc.name}
                    onChange={(e) => setNewDoc({ ...newDoc, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-650 block mb-1">State Licencing Registration No.</label>
                  <input
                    type="text"
                    placeholder="e.g. MCI-22108-A"
                    value={newDoc.regNo}
                    onChange={(e) => setNewDoc({ ...newDoc, regNo: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-650 block mb-1">Specialization Specialty</label>
                  <input
                    type="text"
                    placeholder="e.g. Cardiologist, General Physician..."
                    value={newDoc.spec}
                    onChange={(e) => setNewDoc({ ...newDoc, spec: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-650 block mb-1">Licence Verified Contact Mobile</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 9928172635"
                    value={newDoc.phone}
                    onChange={(e) => setNewDoc({ ...newDoc, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg"
                  />
                </div>
              </div>

              <button
                onClick={handleAddDoctor}
                className="w-full mt-4 py-2.5 text-xs font-bold bg-zinc-900 hover:bg-black text-white rounded-xl transition"
              >
                COMMIT LICENSING ENTRY
              </button>
            </div>

            {/* List panel */}
            <div className="col-span-8 p-5 flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest mb-3">Verified Medical Licensing Database</span>
              <div className="flex-1 overflow-y-auto space-y-2">
                {doctorsList.map((d) => (
                  <div key={d.id} className="p-3.5 bg-white border border-zinc-200 rounded-xl hover:border-zinc-300 transition text-left flex items-start gap-3">
                    <div className="p-2 bg-emerald-50 rounded-lg text-emerald-800 border border-emerald-100 flex-shrink-0">
                      <ShieldCheck className="h-4.5 w-4.5" />
                    </div>
                    <div className="flex-grow">
                      <h4 className="text-xs font-bold text-zinc-800">{d.name}</h4>
                      <p className="text-[10px] text-zinc-400 font-semibold uppercase tracking-wide mt-1">{d.specialization}</p>
                      <div className="mt-2 text-[10px] text-zinc-500 font-mono flex flex-wrap gap-4">
                        <span>Registration No: <strong className="text-zinc-800">{d.registrationNumber}</strong></span>
                        <span>Phone: {d.contact}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* --- 4. SUPPLIER & DISTRIBUTOR REGISTRY --- */}
        {activeWorkspace === 'suppliers' && (
          <div className="flex-1 grid grid-cols-12 overflow-hidden">
            {/* Input Form Panel */}
            <div className="col-span-4 p-5 bg-zinc-50/30 border-r border-zinc-200 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-4">
                <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-wider block mb-1">Supplier Procurement Registry</span>
                
                <div>
                  <label className="text-[10px] font-bold text-zinc-650 block mb-1">Supplier/Enterprise Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Noida SCM Pharmaceuticals Depot..."
                    value={newSup.name}
                    onChange={(e) => setNewSup({ ...newSup, name: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-650 block mb-1">Corporate GSTIN registration Number</label>
                  <input
                    type="text"
                    placeholder="e.g. 09AABBCCDDEE1Z"
                    value={newSup.gst}
                    onChange={(e) => setNewSup({ ...newSup, gst: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-650 block mb-1">Procurement Desk Contact</label>
                  <input
                    type="text"
                    placeholder="e.g. 9900881122"
                    value={newSup.phone}
                    onChange={(e) => setNewSup({ ...newSup, phone: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg font-mono text-zinc-900"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-zinc-650 block mb-1">Distribution Depot Address</label>
                  <input
                    type="text"
                    placeholder="Industrial Zone Depot, Sector 4..."
                    value={newSup.address}
                    onChange={(e) => setNewSup({ ...newSup, address: e.target.value })}
                    className="w-full text-xs px-3 py-2 bg-white border border-zinc-200 rounded-lg text-zinc-900"
                  />
                </div>
              </div>

              <button
                onClick={handleAddSupplier}
                className="w-full mt-4 py-2.5 text-xs font-bold bg-zinc-900 hover:bg-black text-white rounded-xl transition"
              >
                SAVE DISTRIBUTOR RECORD
              </button>
            </div>

            {/* List Panel */}
            <div className="col-span-8 p-5 flex flex-col overflow-hidden">
              <span className="text-xs font-bold text-zinc-700 uppercase tracking-widest mb-3 font-semibold">Active Supply Chain Vendor Depot Register</span>
              <div className="flex-1 overflow-y-auto space-y-2">
                {suppliersList.map((sup) => (
                  <div key={sup.id} className="p-3 bg-white border border-zinc-200 rounded-xl hover:border-zinc-350 transition text-left relative flex flex-col justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-zinc-800">{sup.name}</h4>
                      <p className="text-[10px] text-zinc-400 mt-1 flex items-center gap-1.5">
                        <MapPin className="h-3 w-3 inline" /> {sup.address}
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-zinc-50 flex items-center justify-between text-[10px] text-zinc-550 font-mono">
                      <span>GSTIN Register ID: <strong className="text-zinc-850">{sup.gstin}</strong></span>
                      <span>Phone: {sup.phone}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
