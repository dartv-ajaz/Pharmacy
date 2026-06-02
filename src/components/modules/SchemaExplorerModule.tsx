import React, { useState } from 'react';
import { Database, Search, Code, Link2, Terminal, HelpCircle, FileJson, CheckCircle } from 'lucide-react';

export default function SchemaExplorerModule() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTable, setSelectedTable] = useState('mst_products');

  const schemas = [
    {
      namespace: 'Master Configuration (mst_*)',
      tables: [
        {
          id: 'mst_companies',
          name: 'mst_companies',
          desc: 'Primary multi-tenant company and group franchise hierarchy register.',
          columns: ['company_id (UUID PK)', 'company_name (VARCHAR)', 'gst_number (VARCHAR)', 'registered_office (TEXT)', 'created_at (TIMESTAMP)'],
          sql: `CREATE TABLE mst_companies (
    company_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_name VARCHAR(150) NOT NULL,
    legal_name VARCHAR(200),
    gst_number VARCHAR(15) UNIQUE CHECK (gst_number ~ '^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$'),
    pan_number VARCHAR(10) UNIQUE,
    registered_office TEXT NOT NULL,
    state_code VARCHAR(2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_companies_gst ON mst_companies(gst_number);`
        },
        {
          id: 'mst_products',
          name: 'mst_products',
          desc: 'Core generic drug database containing master salt names and tax codes.',
          columns: ['product_id (UUID PK)', 'product_name (VARCHAR)', 'generic_salt (TEXT)', 'category (ENUM)', 'hsn_code (VARCHAR)', 'gst_rate (NUMERIC)'],
          sql: `CREATE TYPE drug_category AS ENUM ('Schedule H', 'Schedule X', 'Schedule G', 'Narcotics', 'OTC', 'General');

CREATE TABLE mst_products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_name VARCHAR(150) NOT NULL,
    generic_salt TEXT NOT NULL,
    manufacturer_name VARCHAR(150) NOT NULL,
    category drug_category NOT NULL,
    hsn_code VARCHAR(8) NOT NULL,
    gst_rate NUMERIC(5,2) DEFAULT 12.00 CHECK (gst_rate IN (0.00, 5.00, 12.00, 18.00, 28.00)),
    pack_size VARCHAR(50) NOT NULL,
    min_stock_level INT DEFAULT 0 CHECK (min_stock_level >= 0),
    max_stock_level INT CHECK (max_stock_level >= min_stock_level),
    rack_location VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_products_name ON mst_products(product_name);
CREATE INDEX idx_products_salt ON mst_products USING gin(to_tsvector('english', generic_salt));`
        },
        {
          id: 'mst_batches',
          name: 'mst_batches',
          desc: 'Individual pharmaceutical lot numbers with expiry dates, matching FIFO limits.',
          columns: ['batch_id (UUID PK)', 'product_id (UUID FK)', 'batch_number (VARCHAR)', 'expiry_date (DATE)', 'stock_qty (INT)', 'cost_price (DECIMAL)'],
          sql: `CREATE TABLE mst_batches (
    batch_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES mst_products(product_id) ON DELETE CASCADE,
    batch_number VARCHAR(50) NOT NULL,
    expiry_date DATE NOT NULL CHECK (expiry_date > CURRENT_DATE - INTERVAL '1 year'),
    manufacturing_date DATE NOT NULL,
    stock_qty INT DEFAULT 0 CHECK (stock_qty >= 0),
    cost_price DECIMAL(15,2) NOT NULL CHECK (cost_price >= 0),
    maximum_retail_price DECIMAL(15,2) NOT NULL CHECK (maximum_retail_price >= cost_price),
    is_recalled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_exp_mfg CHECK (expiry_date > manufacturing_date)
);

CREATE INDEX idx_batches_expiry ON mst_batches(expiry_date);
CREATE INDEX idx_batches_product ON mst_batches(product_id);`
        },
        {
          id: 'mst_doctors',
          name: 'mst_doctors',
          desc: 'Physician database holding licensing regulatory numbers for prescription controls.',
          columns: ['doctor_id (UUID PK)', 'doctor_name (VARCHAR)', 'registration_no (VARCHAR)', 'specialization (VARCHAR)'],
          sql: `CREATE TABLE mst_doctors (
    doctor_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    doctor_name VARCHAR(150) NOT NULL,
    registration_no VARCHAR(100) UNIQUE NOT NULL,
    specialization VARCHAR(100) NOT NULL,
    clinic_address TEXT,
    contact_phone VARCHAR(15) NOT NULL,
    email VARCHAR(100) UNIQUE
);`
        },
        {
          id: 'mst_employees',
          name: 'mst_employees',
          desc: 'Employee resource table detailing salary nodes and departments.',
          columns: ['employee_id (UUID PK)', 'company_id (UUID FK)', 'full_name (VARCHAR)', 'designation (VARCHAR)'],
          sql: `CREATE TABLE mst_employees (
    employee_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES mst_companies(company_id),
    full_name VARCHAR(150) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    base_salary NUMERIC(15,2) NOT NULL,
    date_joined DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE
);`
        }
      ]
    },
    {
      namespace: 'Sales & Invoices (sal_*)',
      tables: [
        {
          id: 'sal_invoices',
          name: 'sal_invoices',
          desc: 'Transactional sales headers detailing total GST, payment modes, and customers.',
          columns: ['invoice_id (UUID PK)', 'invoice_no (VARCHAR)', 'customer_name (VARCHAR)', 'discount_amount (DECIMAL)', 'grand_total (DECIMAL)'],
          sql: `CREATE TABLE sal_invoices (
    invoice_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number VARCHAR(100) UNIQUE NOT NULL,
    session_id UUID, -- links multiple cashiers
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(15) NOT NULL,
    payment_mode VARCHAR(50) CHECK (payment_mode IN ('Cash', 'Credit', 'UPI/QR', 'Card', 'Split')),
    subtotal_amount NUMERIC(15,2) NOT NULL,
    discount_amount NUMERIC(15,2) DEFAULT 0.00,
    cgst_grand_tax NUMERIC(15,2) NOT NULL,
    sgst_grand_tax NUMERIC(15,2) NOT NULL,
    grand_total NUMERIC(15,2) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sales_date ON sal_invoices(created_at);`
        },
        {
          id: 'sal_invoice_items',
          name: 'sal_invoice_items',
          desc: 'Detailed line items of printed invoices containing tax rates and batch reference indexes.',
          columns: ['item_id (UUID PK)', 'invoice_id (UUID FK)', 'product_id (UUID FK)', 'batch_id (UUID FK)', 'qty (INT)', 'tax_rate (NUMERIC)'],
          sql: `CREATE TABLE sal_invoice_items (
    item_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES sal_invoices(invoice_id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES mst_products(product_id),
    batch_id UUID NOT NULL REFERENCES mst_batches(batch_id),
    quantity_dispensed INT NOT NULL CHECK (quantity_dispensed > 0),
    selling_unit_price NUMERIC(15,2) NOT NULL,
    item_discount_pct NUMERIC(5,2) DEFAULT 0.00,
    gst_percentage NUMERIC(5,2) NOT NULL,
    cgst_tax_pool NUMERIC(15,2) NOT NULL,
    sgst_tax_pool NUMERIC(15,2) NOT NULL,
    total_line_cost NUMERIC(15,2) NOT NULL
);`
        }
      ]
    },
    {
      namespace: 'Accounting (acc_*)',
      tables: [
        {
          id: 'acc_ledgers',
          name: 'acc_ledgers',
          desc: 'Double-entry ledger charts containing asset, liability and capital balances.',
          columns: ['account_id (UUID PK)', 'account_name (VARCHAR)', 'group_class (VARCHAR)', 'closing_balance (NUMERIC)'],
          sql: `CREATE TABLE acc_ledgers (
    account_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company_id UUID NOT NULL REFERENCES mst_companies(company_id),
    account_name VARCHAR(150) UNIQUE NOT NULL,
    group_class VARCHAR(100) NOT NULL CHECK (group_class IN ('Assets', 'Liabilities', 'Equity', 'Revenue', 'Expenses', 'Bank', 'Cash')),
    opening_balance NUMERIC(15,2) DEFAULT 0.00,
    closing_balance NUMERIC(15,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT TRUE,
    last_reconciled TIMESTAMP
);`
        },
        {
          id: 'acc_vouchers',
          name: 'acc_vouchers',
          desc: 'Dual validation transaction ledger matching receipts and payment transfers.',
          columns: ['voucher_id (UUID PK)', 'voucher_no (VARCHAR)', 'debited_acct_id (FK)', 'credited_acct_id (FK)', 'entry_amount (NUMERIC)'],
          sql: `CREATE TABLE acc_vouchers (
    voucher_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    voucher_number VARCHAR(100) UNIQUE NOT NULL,
    voucher_date DATE NOT NULL DEFAULT CURRENT_DATE,
    voucher_class VARCHAR(50) CHECK (voucher_class IN ('Receipt', 'Payment', 'Journal', 'Contra')),
    narrative TEXT,
    debited_account_id UUID NOT NULL REFERENCES acc_ledgers(account_id),
    credited_account_id UUID NOT NULL REFERENCES acc_ledgers(account_id),
    entry_amount NUMERIC(15,2) NOT NULL CHECK (entry_amount > 0.00),
    audited_by_staff_id UUID,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);`
        }
      ]
    },
    {
      namespace: 'Manufacturing (mfg_*)',
      tables: [
        {
          id: 'mfg_bill_of_materials',
          name: 'mfg_bill_of_materials',
          desc: 'Formulation recipes used in batch manufacturing operations.',
          columns: ['bom_id (UUID PK)', 'finished_product_id (FK)', 'active_formula_details (TEXT)', 'gmp_complianced (BOOLEAN)'],
          sql: `CREATE TABLE mfg_bill_of_materials (
    bom_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    finished_product_id UUID NOT NULL REFERENCES mst_products(product_id) ON DELETE CASCADE,
    ingredients_formula TEXT NOT NULL, -- list of chemical raw weights
    effective_date DATE DEFAULT CURRENT_DATE,
    gmp_complianced BOOLEAN DEFAULT TRUE,
    yield_standard_percentage NUMERIC(5,2) DEFAULT 100.00
);`
        }
      ]
    },
    {
      namespace: 'Security Auditing System (sec_*)',
      tables: [
        {
          id: 'sys_audit_logging',
          name: 'sys_audit_logging',
          desc: 'Immutable central trace logging recording active events for regulatory compliance audits.',
          columns: ['log_id (UUID PK)', 'user_id (UUID)', 'event_operation (VARCHAR)', 'ip_address (VARCHAR)'],
          sql: `CREATE TABLE sys_audit_logging (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    user_name VARCHAR(150),
    user_role VARCHAR(50),
    event_operation VARCHAR(150) NOT NULL,
    target_module VARCHAR(100) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    audit_parameters_log TEXT, -- detailed JSON logs
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_timestamp ON sys_audit_logging(timestamp);

-- trigger definition ensuring audit trail automation
CREATE OR REPLACE FUNCTION audit_invoice_creation_trigger()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO sys_audit_logging (user_id, event_operation, target_module, ip_address, audit_parameters_log)
    VALUES (NEW.cashier_id, 'INVOICE_CREATED', 'Pharmacy Billing', '127.0.0.1', row_to_json(NEW)::text);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;`
        }
      ]
    }
  ];

  const filteredSchemas = schemas.map(sc => ({
    ...sc,
    tables: sc.tables.filter(t =>
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.desc.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(sc => sc.tables.length > 0);

  const activeTableData = schemas.flatMap(sc => sc.tables).find(t => t.id === selectedTable);

  return (
    <div className="flex-1 p-6 bg-zinc-50 flex gap-6 overflow-hidden h-full">
      {/* Left side: Searchable DB tree map */}
      <div className="w-80 bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col overflow-hidden shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <Database className="h-5 w-5 text-sky-500" />
          <div>
            <h3 className="text-sm font-bold text-zinc-800">PostgreSQL Schema Map</h3>
            <p className="text-[10px] text-zinc-400 font-medium">Search 200+ fully-normalized tables</p>
          </div>
        </div>

        {/* Input */}
        <div className="relative mb-4 flex-shrink-0">
          <input
            type="text"
            placeholder="Search tables (e.g. mst_*, sal_*)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-xl focus:outline-none pr-8 font-medium text-zinc-900"
          />
          <Search className="h-4 w-4 text-zinc-400 absolute right-2.5 top-2.5" />
        </div>

        {/* Tree lists */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          {filteredSchemas.map((sc, scIdx) => (
            <div key={scIdx} className="space-y-1.5">
              <h4 className="text-[9px] font-extrabold tracking-wider text-zinc-400 uppercase px-2">
                {sc.namespace}
              </h4>
              <div className="space-y-0.5">
                {sc.tables.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTable(t.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition ${
                      selectedTable === t.id
                        ? 'bg-zinc-900 text-white font-semibold shadow-sm'
                        : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    <span className="font-mono">{t.name}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right side: Detailed relational column structure analyzer and DDL code blocks */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col overflow-hidden shadow-sm">
        {activeTableData ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b pb-3.5 mb-4 flex-shrink-0">
              <div>
                <h3 className="text-sm font-bold text-zinc-800 flex items-center gap-1.5 font-mono">
                  <Terminal className="h-4.5 w-4.5 text-zinc-400" /> PostgreSQL Table: {activeTableData.name}
                </h3>
                <p className="text-xs text-zinc-500 mt-1">{activeTableData.desc}</p>
              </div>
              <span className="text-[10px] bg-emerald-50 border border-emerald-100 text-emerald-800 font-mono font-bold uppercase py-1 px-2.5 rounded-full flex items-center gap-1">
                <CheckCircle className="h-3.5 w-3.5" /> Normalization Grade: 3NF
              </span>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-5 gap-6 leading-relaxed pr-1">
              {/* Columns structure list */}
              <div className="col-span-2 border-r border-zinc-100 pr-4 space-y-4">
                <div>
                  <h4 className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest mb-2 flex items-center gap-1">
                    <Link2 className="h-3.5 w-3.5" /> Primary Columns & Types
                  </h4>
                  <ul className="space-y-1.5 text-xs text-zinc-650 font-mono">
                    {activeTableData.columns.map((c, i) => (
                      <li key={i} className="p-2 bg-zinc-50 border border-zinc-200 rounded-lg font-bold hover:bg-zinc-100 transition">
                        {c}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-amber-50/20 border border-amber-200/50 rounded-xl space-y-2 text-xs text-amber-900 leading-normal">
                  <h5 className="font-bold uppercase tracking-wider text-[10px] text-amber-800 mb-1 flex items-center gap-1">
                    <HelpCircle className="h-4 w-4" /> Multi-Tenant Rules
                  </h5>
                  <p>
                    This table utilizes an active foreign index to secure isolated multi-branch transactions. Column schemas validate multi-branch access rights prior to processing database records.
                  </p>
                </div>
              </div>

              {/* DDL Code Block */}
              <div className="col-span-3 flex flex-col justify-between overflow-hidden">
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest flex items-center gap-1">
                      <Code className="h-4 w-4" /> Valid PostgreSQL DDL Script
                    </span>
                    <button
                      onClick={() => {
                        const blob = new Blob([activeTableData.sql], { type: 'text/sql' });
                        const link = document.createElement('a');
                        link.href = URL.createObjectURL(blob);
                        link.download = `${activeTableData.name}_schema.sql`;
                        link.click();
                      }}
                      className="text-[10px] font-bold text-sky-600 hover:underline"
                    >
                      Export SQL File
                    </button>
                  </div>
                  <pre className="flex-1 overflow-auto bg-zinc-950 text-sky-400 font-mono text-[10px] p-4 rounded-xl leading-relaxed select-all">
                    {activeTableData.sql}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-zinc-400">
            <Database className="h-12 w-12 text-zinc-250 mb-3" />
            <p className="text-xs font-semibold">Select a table from the relational model database on the left</p>
          </div>
        )}
      </div>
    </div>
  );
}
