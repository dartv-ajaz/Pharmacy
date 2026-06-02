import { Product, BatchInfo, Doctor, Patient, Supplier, Customer, SalesInvoice, PurchaseOrder, LedgerAccount, Employee, SystemLog } from '../types';

export const mockProducts: Product[] = [
  {
    id: 'P001',
    name: 'Calpol 650mg',
    salt: 'Paracetamol 650mg',
    manufacturer: 'GSK Pharmaceuticals Ltd',
    category: 'OTC',
    hsn: '30049011',
    gstRate: 12,
    packSize: '15 tabs',
    minStockLevel: 100,
    maxStockLevel: 500,
    rackLocation: 'Rack B-2, Row 4',
    priceList: { retailPrice: 32.5, wholesalePrice: 26.0, distributorPrice: 22.1 }
  },
  {
    id: 'P002',
    name: 'Glycomet GP2',
    salt: 'Glimepiride 2mg + Metformin 500mg',
    manufacturer: 'USV Biotech Ltd',
    category: 'Schedule H',
    hsn: '30049012',
    gstRate: 12,
    packSize: '10 tabs',
    minStockLevel: 150,
    maxStockLevel: 600,
    rackLocation: 'Rack A-1, Row 2',
    priceList: { retailPrice: 125.0, wholesalePrice: 100.0, distributorPrice: 85.0 }
  },
  {
    id: 'P003',
    name: 'Alprax 0.5mg',
    salt: 'Alprazolam 0.5mg',
    manufacturer: 'Torrent Pharmaceuticals',
    category: 'Schedule H',
    hsn: '30049014',
    gstRate: 12,
    packSize: '15 tabs',
    minStockLevel: 50,
    maxStockLevel: 200,
    rackLocation: 'Rack S-1, Narcotics Locked Drawer',
    priceList: { retailPrice: 85.0, wholesalePrice: 68.0, distributorPrice: 57.8 }
  },
  {
    id: 'P004',
    name: 'Amoxil 500mg',
    salt: 'Amoxicillin 500mg',
    manufacturer: 'GSK Pharmaceuticals Ltd',
    category: 'Schedule H',
    hsn: '30041011',
    gstRate: 12,
    packSize: '10 caps',
    minStockLevel: 80,
    maxStockLevel: 400,
    rackLocation: 'Rack B-1, Row 1',
    priceList: { retailPrice: 110.0, wholesalePrice: 88.0, distributorPrice: 74.8 }
  },
  {
    id: 'P005',
    name: 'Lipitor 10mg',
    salt: 'Atorvastatin 10mg',
    manufacturer: 'Pfizer Inc',
    category: 'Schedule H',
    hsn: '30049033',
    gstRate: 12,
    packSize: '10 tabs',
    minStockLevel: 100,
    maxStockLevel: 500,
    rackLocation: 'Rack C-2, Row 3',
    priceList: { retailPrice: 195.0, wholesalePrice: 156.0, distributorPrice: 132.6 }
  },
  {
    id: 'P006',
    name: 'Gardenal 30mg',
    salt: 'Phenobarbital 30mg',
    manufacturer: 'Abbott Labs Ltd',
    category: 'Schedule X',
    hsn: '30049015',
    gstRate: 18,
    packSize: '15 tabs',
    minStockLevel: 20,
    maxStockLevel: 100,
    rackLocation: 'Rack S-2, Narcotic Vault Key 1',
    priceList: { retailPrice: 42.0, wholesalePrice: 33.6, distributorPrice: 28.56 }
  },
  {
    id: 'P007',
    name: 'Allegra 120mg',
    salt: 'Fexofenadine Hydrochloride 120mg',
    manufacturer: 'Sanofi India Ltd',
    category: 'OTC',
    hsn: '30049044',
    gstRate: 12,
    packSize: '10 tabs',
    minStockLevel: 200,
    maxStockLevel: 800,
    rackLocation: 'Rack B-3, Row 1',
    priceList: { retailPrice: 185.0, wholesalePrice: 148.0, distributorPrice: 125.8 }
  },
  {
    id: 'P008',
    name: 'Pantocid 40mg',
    salt: 'Pantoprazole 40mg',
    manufacturer: 'Sun Pharma Ltd',
    category: 'Schedule H',
    hsn: '30049039',
    gstRate: 12,
    packSize: '15 tabs',
    minStockLevel: 300,
    maxStockLevel: 1200,
    rackLocation: 'Rack A-5, Row 1',
    priceList: { retailPrice: 164.0, wholesalePrice: 131.2, distributorPrice: 111.52 }
  }
];

export const mockBatches: BatchInfo[] = [
  {
    id: 'B01',
    productId: 'P001',
    batchNumber: 'CALP-Y304',
    expiryDate: '2027-12-15',
    manufacturingDate: '2025-12-16',
    stockQty: 450,
    costPrice: 18.5,
    mrp: 32.5
  },
  {
    id: 'B02',
    productId: 'P001',
    batchNumber: 'CALP-X102',
    expiryDate: '2026-07-30', // Near Expiry!
    manufacturingDate: '2024-07-31',
    stockQty: 120,
    costPrice: 18.5,
    mrp: 32.5
  },
  {
    id: 'B03',
    productId: 'P002',
    batchNumber: 'GLYC-6629',
    expiryDate: '2027-04-10',
    manufacturingDate: '2025-04-11',
    stockQty: 320,
    costPrice: 65.0,
    mrp: 125.0
  },
  {
    id: 'B04',
    productId: 'P003',
    batchNumber: 'ALPR-9102',
    expiryDate: '2026-08-25', // Near Expiry
    manufacturingDate: '2024-08-26',
    stockQty: 85,
    costPrice: 42.0,
    mrp: 85.0
  },
  {
    id: 'B05',
    productId: 'P004',
    batchNumber: 'AMOX-1102',
    expiryDate: '2028-02-01',
    manufacturingDate: '2026-02-02',
    stockQty: 250,
    costPrice: 53.0,
    mrp: 110.0
  },
  {
    id: 'B06',
    productId: 'P005',
    batchNumber: 'LIP-8472',
    expiryDate: '2026-06-20', // CRITICAL: Near expiry in less than 30 days of June 2026!
    manufacturingDate: '2024-06-21',
    stockQty: 180,
    costPrice: 112.0,
    mrp: 195.0
  },
  {
    id: 'B07',
    productId: 'P006',
    batchNumber: 'GARD-9903',
    expiryDate: '2027-09-12',
    manufacturingDate: '2025-09-13',
    stockQty: 55,
    costPrice: 20.0,
    mrp: 42.0
  },
  {
    id: 'B08',
    productId: 'P007',
    batchNumber: 'ALL-F329',
    expiryDate: '2028-03-14',
    manufacturingDate: '2026-03-15',
    stockQty: 600,
    costPrice: 95.0,
    mrp: 185.0
  },
  {
    id: 'B09',
    productId: 'P008',
    batchNumber: 'PAN-7703',
    expiryDate: '2026-05-10', // Expired
    manufacturingDate: '2024-05-11',
    stockQty: 45,
    costPrice: 85.0,
    mrp: 164.0
  },
  {
    id: 'B10',
    productId: 'P008',
    batchNumber: 'PAN-8802',
    expiryDate: '2028-01-20',
    manufacturingDate: '2026-01-21',
    stockQty: 850,
    costPrice: 85.0,
    mrp: 164.0
  }
];

export const mockDoctors: Doctor[] = [
  {
    id: 'D01',
    name: 'Dr. R. K. Agrawal',
    specialization: 'Cardiologist',
    registrationNumber: 'MCI-192842',
    clinicAddress: 'Metro Heart Care, Sector 15',
    contact: '+91 98374 81234',
    email: 'dr.agrawal@metroheart.com'
  },
  {
    id: 'D02',
    name: 'Dr. Shalini Mehta',
    specialization: 'Diabetologist',
    registrationNumber: 'MCI-228394',
    clinicAddress: 'Mehta Diabetes & Endocrine Centre',
    contact: '+91 91234 56789',
    email: 'shalini@mehtadiabetes.org'
  },
  {
    id: 'D03',
    name: 'Dr. Vijay K. Singh',
    specialization: 'General Physician',
    registrationNumber: 'MCI-882734',
    clinicAddress: 'Arogya Clinic, Phase 2',
    contact: '+91 99887 76655',
    email: 'vijay.singh@arogyaclinic.com'
  }
];

export const mockPatients: Patient[] = [
  {
    id: 'PA01',
    name: 'Aditya Vardhan',
    age: 42,
    gender: 'Male',
    bloodGroup: 'B+',
    contact: '+91 88776 65544',
    emrId: 'EMR-9382-A',
    allergies: ['Penicillin', 'Sulfa drugs']
  },
  {
    id: 'PA02',
    name: 'Sunita Sharma',
    age: 58,
    gender: 'Female',
    bloodGroup: 'O+',
    contact: '+91 90817 26354',
    emrId: 'EMR-1029-B',
    allergies: ['Dust', 'Shellfish']
  },
  {
    id: 'PA03',
    name: 'Rajveer Gil',
    age: 29,
    gender: 'Male',
    bloodGroup: 'AB+',
    contact: '+91 77228 19028',
    emrId: 'EMR-8839-D',
    allergies: []
  }
];

export const mockSuppliers: Supplier[] = [
  {
    id: 'S01',
    name: 'McKesson India Distributors',
    gstin: '09AABCM3928L1Z9',
    contactPerson: 'Mr. Pradeep Grover',
    phone: '+91 98888 77777',
    email: 'orders@mckesson.in',
    address: 'Warehouse A-4, Industrial Area, Noida, UP',
    outstandingBalance: 125400.0,
    creditLimit: 500000.0
  },
  {
    id: 'S02',
    name: 'Rana Pharma & Stockist',
    gstin: '09AALPR1204C1ZC',
    contactPerson: 'Mr. Devendra Rana',
    phone: '+91 91111 22222',
    email: 'dev@ranapharma.com',
    address: 'Shop No. 12, Drug Market, Lucknow, UP',
    outstandingBalance: 46200.0,
    creditLimit: 150000.0
  },
  {
    id: 'S03',
    name: 'Apollo Lifecare Logistics',
    gstin: '07AAKLA8839M2ZA',
    contactPerson: 'Ms. Rachna Sen',
    phone: '+91 95555 44444',
    email: 'logistic.orders@apollo.com',
    address: 'Central Godown 3, Okhla Phase III, Delhi',
    outstandingBalance: 0.0,
    creditLimit: 1000000.0
  }
];

export const mockCustomers: Customer[] = [
  {
    id: 'C01',
    name: 'Gaurav Kumar',
    phone: '9928172635',
    email: 'gaurav.kr@gmail.com',
    outstandingBalance: 1250.0,
    creditLimit: 5000.0,
    loyaltyPoints: 450,
    segment: 'Loyal'
  },
  {
    id: 'C02',
    name: 'Preeti Malhotra',
    phone: '9812903841',
    email: 'preeti.malhotra@yahoo.com',
    outstandingBalance: 0.0,
    creditLimit: 2000.0,
    loyaltyPoints: 85,
    segment: 'General'
  },
  {
    id: 'C03',
    name: 'Sanjeev Nair',
    phone: '9082736154',
    email: 'snair@hotmail.com',
    outstandingBalance: 8400.0, // Over limit warning!
    creditLimit: 5000.0,
    loyaltyPoints: 1200,
    segment: 'High-Value'
  }
];

export const mockInvoices: SalesInvoice[] = [
  {
    id: 'INV001',
    invoiceNumber: 'TAX-2026-00049',
    date: '2026-06-01',
    customerName: 'Gaurav Kumar',
    customerPhone: '9928172635',
    billingType: 'POS',
    paymentMode: 'UPI/QR',
    totals: {
      subtotal: 105.0,
      discount: 10.0,
      cgst: 5.7,
      sgst: 5.7,
      igst: 0.0,
      grandTotal: 106.4,
      paidAmount: 106.4,
      balance: 0.0
    },
    items: [
      {
        productId: 'P001',
        productName: 'Calpol 650mg',
        salt: 'Paracetamol 650mg',
        batchId: 'B01',
        batchNumber: 'CALP-Y304',
        expiryDate: '2027-12-15',
        qty: 2,
        mrp: 32.5,
        discountPct: 10,
        gstRate: 12,
        cgst: 3.12,
        sgst: 3.12,
        igst: 0.0,
        total: 58.5
      },
      {
        productId: 'P003',
        productName: 'Alprax 0.5mg',
        salt: 'Alprazolam 0.5mg',
        batchId: 'B04',
        batchNumber: 'ALPR-9102',
        expiryDate: '2026-08-25',
        qty: 1,
        mrp: 85.0,
        discountPct: 0,
        gstRate: 12,
        cgst: 5.1,
        sgst: 5.1,
        igst: 0.0,
        total: 95.2
      }
    ],
    cashierId: 'EMP04',
    status: 'Completed'
  }
];

export const mockOrders: PurchaseOrder[] = [
  {
    id: 'PO001',
    poNumber: 'PO-2026-0012',
    date: '2026-05-28',
    supplierId: 'S01',
    supplierName: 'McKesson India Distributors',
    status: 'Approved',
    totalAmount: 18500.0,
    items: [
      {
        productId: 'P001',
        productName: 'Calpol 650mg',
        qty: 500,
        rate: 18.5,
        discountPct: 5,
        total: 8787.5
      },
      {
        productId: 'P002',
        productName: 'Glycomet GP2',
        qty: 150,
        rate: 65.0,
        discountPct: 5,
        total: 9262.5
      }
    ]
  }
];

export const mockLedgers: LedgerAccount[] = [
  { id: 'L01', name: 'Cash in Hand', group: 'Cash', balance: 54100.0 },
  { id: 'L02', name: 'State Bank of India A/C 9948', group: 'Bank', balance: 2500000.0 },
  { id: 'L03', name: 'ICICI Current A/C 1204', group: 'Bank', balance: 1450000.0 },
  { id: 'L04', name: 'SGST Output Tax A/C', group: 'Liabilities', balance: -24150.0 },
  { id: 'L05', name: 'CGST Output Tax A/C', group: 'Liabilities', balance: -24150.0 },
  { id: 'L06', name: 'Pharmacy Sales Revenue', group: 'Revenue', balance: 842000.0 },
  { id: 'L07', name: 'Purchase Cost Account', group: 'Expenses', balance: 524000.0 }
];

export const mockEmployees: Employee[] = [
  { id: 'EMP01', name: 'Satyender Verma', designation: 'Store In-charge', department: 'Inventory', salary: 32000, attendanceDays: 25, status: 'Present' },
  { id: 'EMP02', name: 'Rohan Deshmukh', designation: 'Pharmacist Chief', department: 'Operations', salary: 45000, attendanceDays: 24, status: 'Present' },
  { id: 'EMP03', name: 'Ananya Saxena', designation: 'General Accountant', department: 'Finance', salary: 38000, attendanceDays: 22, status: 'On Leave' },
  { id: 'EMP04', name: 'Anshul Gupta', designation: 'POS Cashier Lead', department: 'Sales', salary: 22000, attendanceDays: 25, status: 'Present' }
];

export const mockLogs: SystemLog[] = [
  {
    id: 'LOG0921',
    timestamp: '2026-06-02T03:40:12Z',
    userId: 'U002',
    userName: 'Rohan Deshmukh',
    role: 'Pharmacist',
    action: 'Prescription Verified',
    module: 'Drug Management',
    ipAddress: '192.168.1.104',
    details: 'Verified Rx-9382 for Patient Aditya Vardhan containing Alprax 0.5mg'
  },
  {
    id: 'LOG0920',
    timestamp: '2026-06-02T03:12:45Z',
    userId: 'U004',
    userName: 'Anshul Gupta',
    role: 'Cashier',
    action: 'Invoice Created',
    module: 'Pharmacy Billing',
    ipAddress: '192.168.1.112',
    details: 'Created Retail Invoice TAX-2026-00049 for Gaurav Kumar'
  },
  {
    id: 'LOG0919',
    timestamp: '2026-06-02T01:55:00Z',
    userId: 'U001',
    userName: 'Super Admin',
    role: 'Super Admin',
    action: 'Central Inventory Sync',
    module: 'Cloud & Multi Branch',
    ipAddress: '103.45.10.22',
    details: 'Triggered synchronized inventory update across 5 branch godowns'
  }
];
