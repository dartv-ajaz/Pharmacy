export type UserRole =
  | 'Super Admin'
  | 'Company Admin'
  | 'Branch Admin'
  | 'Pharmacist'
  | 'Cashier'
  | 'Purchase Manager'
  | 'Inventory Manager'
  | 'Warehouse Manager'
  | 'Sales Manager'
  | 'Salesman'
  | 'Distributor'
  | 'Retailer'
  | 'Doctor'
  | 'Patient'
  | 'Delivery Boy'
  | 'Accountant'
  | 'HR Manager'
  | 'Employee'
  | 'Customer'
  | 'Auditor';

export interface UserContext {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  branch: string;
  companyId: string;
  permissions: string[];
}

export interface Product {
  id: string;
  name: string;
  salt: string;
  manufacturer: string;
  category: 'Schedule H' | 'Schedule X' | 'Schedule G' | 'Narcotics' | 'OTC' | 'General';
  hsn: string;
  gstRate: number; // e.g. 5, 12, 18
  packSize: string; // e.g., "10 tabs", "100ml"
  minStockLevel: number;
  maxStockLevel: number;
  rackLocation: string; // e.g., "Rack A-3"
  priceList: {
    retailPrice: number;
    wholesalePrice: number;
    distributorPrice: number;
  };
}

export interface BatchInfo {
  id: string;
  productId: string;
  batchNumber: string;
  expiryDate: string; // YYYY-MM-DD
  manufacturingDate: string;
  stockQty: number;
  costPrice: number;
  mrp: number;
  isRecalled?: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  registrationNumber: string;
  clinicAddress: string;
  contact: string;
  email: string;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  bloodGroup: string;
  contact: string;
  emrId: string;
  allergies: string[];
}

export interface Supplier {
  id: string;
  name: string;
  gstin: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
  outstandingBalance: number;
  creditLimit: number;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  outstandingBalance: number;
  creditLimit: number;
  loyaltyPoints: number;
  segment: 'Loyal' | 'Slipping' | 'High-Value' | 'General';
}

export interface InvoiceItem {
  productId: string;
  productName: string;
  salt: string;
  batchId: string;
  batchNumber: string;
  expiryDate: string;
  qty: number;
  mrp: number;
  discountPct: number;
  gstRate: number;
  cgst: number;
  sgst: number;
  igst: number;
  total: number;
}

export interface SalesInvoice {
  id: string;
  invoiceNumber: string;
  date: string;
  customerName: string;
  customerPhone: string;
  patientId?: string;
  doctorId?: string;
  billingType: 'Retail' | 'Wholesale' | 'POS' | 'Loyalty';
  paymentMode: 'Cash' | 'Credit' | 'UPI/QR' | 'Card' | 'Split';
  totals: {
    subtotal: number;
    discount: number;
    cgst: number;
    sgst: number;
    igst: number;
    grandTotal: number;
    paidAmount: number;
    balance: number;
  };
  items: InvoiceItem[];
  cashierId: string;
  status: 'Completed' | 'Pending' | 'Draft' | 'Cancelled';
}

export interface PurchaseOrder {
  id: string;
  poNumber: string;
  date: string;
  supplierId: string;
  supplierName: string;
  status: 'Draft' | 'Pending Approval' | 'Approved' | 'Sent' | 'Received' | 'Cancelled';
  totalAmount: number;
  items: {
    productId: string;
    productName: string;
    qty: number;
    rate: number;
    discountPct: number;
    total: number;
  }[];
}

export interface LedgerAccount {
  id: string;
  name: string;
  group: 'Assets' | 'Liabilities' | 'Equity' | 'Revenue' | 'Expenses' | 'Bank' | 'Cash' | 'Customer' | 'Supplier';
  balance: number;
}

export interface Voucher {
  id: string;
  voucherNo: string;
  date: string;
  voucherType: 'Receipt' | 'Payment' | 'Journal' | 'Contra';
  narration: string;
  debitedAccount: string;
  creditedAccount: string;
  amount: number;
}

export interface Employee {
  id: string;
  name: string;
  designation: string;
  department: string;
  salary: number;
  attendanceDays: number;
  status: 'Present' | 'Absent' | 'On Leave';
}

export interface SystemLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: string;
  action: string;
  module: string;
  ipAddress: string;
  details: string;
}
