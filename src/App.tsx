import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { UserRole } from './types';

// Concrete modules
import DashboardModule from './components/modules/DashboardModule';
import MasterSetupModule from './components/modules/MasterSetupModule';
import BillingModule from './components/modules/BillingModule';
import InventoryModule from './components/modules/InventoryModule';
import AccountingModule from './components/modules/AccountingModule';
import AIModule from './components/modules/AIModule';
import MobileDeviceMockup from './components/modules/MobileDeviceMockup';
import PurchaseModule from './components/modules/PurchaseModule';
import ClinicalDatabaseModule from './components/modules/ClinicalDatabaseModule';
import BarcodeLabelModule from './components/modules/BarcodeLabelModule';
import TaxComplianceModule from './components/modules/TaxComplianceModule';
import HrPayrollModule from './components/modules/HrPayrollModule';
import ManufacturingModule from './components/modules/ManufacturingModule';
import AnalyticsModule from './components/modules/AnalyticsModule';
import SecurityAuditModule from './components/modules/SecurityAuditModule';
import SalesOrdersModule from './components/modules/SalesOrdersModule';
import B2bDistributionModule from './components/modules/B2bDistributionModule';
import MarketingLoyaltyModule from './components/modules/MarketingLoyaltyModule';
import ConsumerEcommerceModule from './components/modules/ConsumerEcommerceModule';
import LogisticsDispatchModule from './components/modules/LogisticsDispatchModule';
import HospitalHealthModule from './components/modules/HospitalHealthModule';
import CloudSyncModule from './components/modules/CloudSyncModule';

// New specialized modules
import MargToolsModule from './components/modules/MargToolsModule';
import OffersSchemesModule from './components/modules/OffersSchemesModule';
import KhatabookModule from './components/modules/KhatabookModule';
import PharmaSyncModule from './components/modules/PharmaSyncModule';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<UserRole>('Super Admin');
  const [branch, setBranch] = useState('Main Branch (Retail POS)');

  // RBAC Permission Map linking Roles to the 18 specific custom module IDs:
  const getAllowedModulesByRole = (role: UserRole): string[] => {
    switch (role) {
      case 'Super Admin':
        return [
          'dashboard', 'pos-billing', 'master-register', 'narcotics-register', 
          'inventory-master', 'returns-expiry', 'purchase-entry', 'ocr-magic', 
          'purchase-orders', 'accounts-finance', 'dealer-ledger', 'khatabook-ledger', 
          'suppliers-customers', 'sales-analytics', 'gst-reports', 'download-reports', 
          'offers-schemes', 'marg-tools', 'pharmasync'
        ];
      case 'Cashier':
        return ['dashboard', 'pos-billing', 'master-register', 'khatabook-ledger', 'offers-schemes'];
      case 'Pharmacist':
        return ['dashboard', 'pos-billing', 'narcotics-register', 'inventory-master', 'returns-expiry', 'ocr-magic', 'marg-tools', 'pharmasync'];
      case 'Accountant':
        return ['dashboard', 'accounts-finance', 'dealer-ledger', 'khatabook-ledger', 'gst-reports', 'pharmasync'];
      case 'Auditor':
        return ['dashboard', 'narcotics-register', 'accounts-finance', 'download-reports', 'gst-reports', 'pharmasync'];
      case 'Delivery Boy':
        return ['dashboard', 'inventory-master', 'returns-expiry'];
      case 'Patient':
        return ['dashboard', 'khatabook-ledger', 'offers-schemes'];
      case 'Doctor':
        return ['dashboard', 'narcotics-register', 'ocr-magic'];
      default:
        return ['dashboard', 'pos-billing', 'inventory-master'];
    }
  };

  const allowedModules = getAllowedModulesByRole(currentRole);

  // If active tab gets locked due to role change, auto-switch to a legal permitted tab
  React.useEffect(() => {
    if (!allowedModules.includes(activeTab)) {
      const firstAllowed = allowedModules[0] || 'dashboard';
      setActiveTab(firstAllowed);
    }
  }, [currentRole, activeTab, allowedModules]);

  const renderModuleContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardModule setActiveTab={setActiveTab} />;
      case 'pos-billing':
        return <BillingModule branch={branch} />;
      case 'master-register':
        return <MasterSetupModule />;
      case 'narcotics-register':
        return <ClinicalDatabaseModule />;
      case 'inventory-master':
        return <InventoryModule branch={branch} />;
      case 'returns-expiry':
        // Render Inventory module focusing on Expiry near lists
        return <InventoryModule branch={branch} />;
      case 'purchase-entry':
        // Direct purchase entry invoice formulation and stock registry update
        return <PurchaseModule initialTab="create" />;
      case 'ocr-magic':
        // OCR receipts loading screen linked to suppliers ledgers 
        return <PurchaseModule initialTab="ocr-upload" />;
      case 'purchase-orders':
        // B2B Supplier purchase order lists and re-order triggers
        return <PurchaseModule initialTab="orders" />;
      case 'accounts-finance':
        return <AccountingModule />;
      case 'dealer-ledger':
        // Real-time vendor ledger balance and settlement records
        return <PurchaseModule initialTab="ledger" />;
      case 'khatabook-ledger':
        return <KhatabookModule />;
      case 'suppliers-customers':
        return <MarketingLoyaltyModule />;
      case 'sales-analytics':
        return <AnalyticsModule />;
      case 'gst-reports':
        return <TaxComplianceModule />;
      case 'download-reports':
        return <SecurityAuditModule />;
      case 'offers-schemes':
        return <OffersSchemesModule />;
      case 'marg-tools':
        return <MargToolsModule />;
      case 'pharmasync':
        return <PharmaSyncModule />;
      default:
        return (
          <div className="flex-grow p-6 bg-zinc-50 flex items-center justify-center">
            <div className="bg-white border select-none border-zinc-200 shadow-xl rounded-2xl p-8 max-w-lg text-center space-y-4">
              <div className="h-12 w-12 rounded-full bg-amber-50 border border-amber-200 text-amber-700 flex items-center justify-center mx-auto text-xl">
                ⚠️
              </div>
              <h3 className="text-base font-bold text-zinc-900 uppercase">Enterprise Permission Lock</h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                You possess permission to access this module as a <strong>{currentRole}</strong>, but core branch synchronization is currently offline. Custom mapping parameters can be provisioned within the <strong>Master Setup</strong> dashboard.
              </p>
              <div className="p-3.5 bg-zinc-50 rounded-xl text-[10px] font-mono text-zinc-400 text-left">
                SYSTEM MESSAGE: COUNTER_OFFLINE_RECONCILIATION_RUN
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-zinc-100 font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allowedModules={allowedModules}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header toolbar */}
        <Header
          currentRole={currentRole}
          setCurrentRole={setCurrentRole}
          branch={branch}
          setBranch={setBranch}
        />

        {/* Selected Workspace Component */}
        <main className="flex-1 overflow-hidden relative">
          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
}
