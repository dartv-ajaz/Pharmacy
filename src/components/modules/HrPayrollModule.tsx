import React, { useState } from 'react';
import { UserCheck, ShieldCheck, Mail, Calendar, Coins, UserCircle2, CheckCircle2, AlertCircle, FileSpreadsheet, Fingerprint } from 'lucide-react';
import { mockEmployees } from '../../data/mockData';
import { Employee } from '../../types';

export default function HrPayrollModule() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [selectedEmpId, setSelectedEmpId] = useState(mockEmployees[0]?.id || '');
  const [attendanceOffset, setAttendanceOffset] = useState<number>(24);
  const [providentFundPct, setProvidentFundPct] = useState(12);
  const [esiPct, setEsiPct] = useState(1.75);
  const [daPct, setDaPct] = useState(10);
  const [hraPct, setHraPct] = useState(30);

  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'payroll' | 'biometrics'>('roster');
  const [compiledPayslip, setCompiledPayslip] = useState<any>(null);

  const selectedEmp = employees.find(e => e.id === selectedEmpId) || employees[0];

  const handleCompilePayslip = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;

    // SCM HR Compounding Calculations:
    const baseSal = selectedEmp.salary;
    const proratedBase = (baseSal / 25) * attendanceOffset;
    
    // Earnings
    const daValue = Math.round(proratedBase * (daPct / 100));
    const hraValue = Math.round(proratedBase * (hraPct / 100));
    const medicalAllowance = 1250;
    const grossEarnings = Math.round(proratedBase + daValue + hraValue + medicalAllowance);

    // Deductions
    const pfDeduction = Math.round(proratedBase * (providentFundPct / 100));
    const esiDeduction = Math.round(proratedBase * (esiPct / 100));
    const professionalTax = 200;
    const totalDeductions = pfDeduction + esiDeduction + professionalTax;

    const netSalary = grossEarnings - totalDeductions;

    setCompiledPayslip({
      employeeId: selectedEmp.id,
      name: selectedEmp.name,
      designation: selectedEmp.designation,
      department: selectedEmp.department,
      attendance: `${attendanceOffset} / 25 Days`,
      earnings: {
        basic: Math.round(proratedBase),
        da: daValue,
        hra: hraValue,
        medical: medicalAllowance,
        gross: grossEarnings
      },
      deductions: {
        pf: pfDeduction,
        esi: esiDeduction,
        professionalTax,
        total: totalDeductions
      },
      netPayable: netSalary,
      period: 'June 2026'
    });
  };

  // Biometric log data
  const biometricScans = [
    { time: '09:02 AM', emp: 'Anansul Gupta', status: 'On-Time', scan: 'Pass', device: 'Main POS Gate A' },
    { time: '09:04 AM', emp: 'Rohan Deshmukh', status: 'On-Time', scan: 'Pass', device: 'Chief Pharmacist Vault' },
    { time: '09:35 AM', emp: 'Satyender Verma', status: 'Late (35 mins)', scan: 'Approved Override', device: 'Backdoor Warehouse' },
    { time: '10:05 AM', emp: 'Ananya Saxena', status: 'Late (65 mins)', scan: 'System Warning Flagged', device: 'Accounts Office B' }
  ];

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto font-sans">
      {/* Tab bar header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <UserCheck className="h-4 w-4 text-emerald-500" />
            Module 12: HR, Payroll & Attendance Biometrics
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Biometric attendance triggers, Provident Fund calculators, and consolidated salary slip generators.</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-zinc-100 p-1.5 rounded-lg border border-zinc-200 shrink-0">
          <button
            onClick={() => setActiveSubTab('roster')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeSubTab === 'roster' ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Staff Payroll Roster
          </button>
          <button
            onClick={() => setActiveSubTab('payroll')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all ${
              activeSubTab === 'payroll' ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Salary Slip slip Compiler
          </button>
          <button
            onClick={() => setActiveSubTab('biometrics')}
            className={`px-3 py-1 text-[11px] font-semibold rounded-md transition-all flex items-center gap-1 ${
              activeSubTab === 'biometrics' ? 'bg-white shadow text-zinc-900' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Fingerprint className="h-3.5 w-3.5 text-rose-500" /> Biometric Scans (Live)
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === 'roster' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="md:col-span-3 bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-650 uppercase tracking-wider">
                    <th className="px-5 py-3">Employee Name</th>
                    <th className="px-5 py-3">Department / Role</th>
                    <th className="px-5 py-3 text-right">Standard Salary</th>
                    <th className="px-5 py-3 text-center">Base Attendance days</th>
                    <th className="px-5 py-3 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 text-xs">
                  {employees.map((emp) => (
                    <tr key={emp.id} className="hover:bg-zinc-50/50">
                      <td className="px-5 py-3.5 flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-500 font-bold">
                          {emp.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <span className="font-bold text-zinc-900">{emp.name}</span>
                          <div className="text-[10px] text-zinc-400 font-mono">EMPID: {emp.id}</div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="font-semibold text-zinc-850 block">{emp.designation}</span>
                        <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono font-bold">{emp.department}</span>
                      </td>
                      <td className="px-5 py-3.5 text-right font-mono font-semibold text-zinc-750">₹{emp.salary.toLocaleString('en-IN')}/mo</td>
                      <td className="px-5 py-3.5 text-center font-mono">{emp.attendanceDays} days</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest border ${
                          emp.status === 'Present'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-250'
                            : 'bg-amber-50 text-amber-700 border-amber-250'
                        }`}>
                          {emp.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Quick Summary widget */}
            <div className="bg-slate-900 text-white rounded-xl p-5 border border-slate-800 flex flex-col justify-between shadow-sm">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sky-400">
                  <Coins className="h-5 w-5" />
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-300">Staff Expense Ledger</h3>
                </div>

                <div className="text-xs space-y-3.5 pt-3.5 border-t border-slate-800">
                  <div className="flex justify-between text-slate-400">
                    <span>Active Force:</span>
                    <strong className="text-white font-mono">{employees.length} Members</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Prerated Outgo:</span>
                    <strong className="text-white font-mono">₹{employees.reduce((acc, e) => acc + e.salary, 0).toLocaleString('en-IN')}/mo</strong>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Biometric Override:</span>
                    <strong className="text-amber-400 font-mono">1 Pending Warning</strong>
                  </div>
                </div>
              </div>

              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/60 mt-6 text-[10px] leading-relaxed text-slate-500 font-mono">
                NOTICE: Legal EPF submissions (12% of Basic Pay) are automatically prepared inside the salary slip tab for export compliance audits.
              </div>
            </div>
          </div>
        )}

        {activeSubTab === 'payroll' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Entry options */}
            <form onSubmit={handleCompilePayslip} className="lg:col-span-5 bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-zinc-805 uppercase tracking-wider flex items-center gap-2 pb-2">
                <FileSpreadsheet className="h-4 w-4 text-emerald-500" /> Payslip Variable Ledger Parameters
              </h3>

              <div className="space-y-3 t-xs select-none">
                <div>
                  <label className="block text-[10px] font-bold text-zinc-500 uppercase">Target Employee Profile</label>
                  <select
                    value={selectedEmpId}
                    onChange={(e) => {
                      setSelectedEmpId(e.target.value);
                      const employee = employees.find(emp => emp.id === e.target.value);
                      if (employee) {
                        setAttendanceOffset(employee.attendanceDays);
                      }
                    }}
                    className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2.5 text-xs text-zinc-800 focus:outline-none"
                  >
                    {employees.map(e => (
                      <option key={e.id} value={e.id}>{e.name} ({e.designation})</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Attendance Days</label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={attendanceOffset}
                      onChange={(e) => setAttendanceOffset(Math.min(25, Math.max(0, Number(e.target.value))))}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-zinc-500 uppercase">Dearness Allowance DA (%)</label>
                    <input
                      type="number"
                      value={daPct}
                      onChange={(e) => setDaPct(Number(e.target.value))}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase">HRA Rent (%)</label>
                    <input
                      type="number"
                      value={hraPct}
                      onChange={(e) => setHraPct(Number(e.target.value))}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase">Provident Fund (%)</label>
                    <input
                      type="number"
                      value={providentFundPct}
                      onChange={(e) => setProvidentFundPct(Number(e.target.value))}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-bold text-zinc-500 uppercase">ESI Med (%)</label>
                    <input
                      type="number"
                      value={esiPct}
                      onChange={(e) => setEsiPct(Number(e.target.value))}
                      className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-11 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold tracking-wide uppercase transition-all shadow-md flex items-center justify-center gap-2"
              >
                Assemble & Audit Legal Payslip
              </button>
            </form>

            {/* Payslip rendering */}
            <div className="lg:col-span-7 flex flex-col justify-start">
              {compiledPayslip ? (
                <div className="bg-white border border-zinc-300 rounded-2xl shadow-xl p-6 font-mono text-[11px] leading-relaxed text-zinc-700 relative">
                  
                  {/* Stamp background watermark */}
                  <div className="absolute right-6 top-16 border-4 border-emerald-500/30 text-emerald-500/40 text-xs font-black uppercase tracking-widest rotate-12 p-2 rounded select-none pointer-events-none">
                    COMPLIANCE SEAL AUDITED
                  </div>

                  <div className="text-center border-b border-zinc-150 pb-4">
                    <h4 className="text-sm font-black text-zinc-900 tracking-tight leading-none">APOTHECARY ENTERPRISE PHARMACY</h4>
                    <p className="text-[9px] text-zinc-400 mt-1 uppercase tracking-widest">Legal Form 16 / Consolidated Salary Slip Record</p>
                  </div>

                  {/* Metadata info */}
                  <div className="grid grid-cols-2 gap-y-1 gap-x-4 py-3 text-zinc-600 border-b border-zinc-100 text-[10px]">
                    <div>Employee: <strong className="text-zinc-800">{compiledPayslip.name}</strong></div>
                    <div>Designation: <strong className="text-zinc-800">{compiledPayslip.designation}</strong></div>
                    <div>Attendance: <strong className="text-zinc-800">{compiledPayslip.attendance}</strong></div>
                    <div>Filing Period: <strong className="text-zinc-850">June 2026</strong></div>
                  </div>

                  {/* Balancing Ledgers Grid */}
                  <div className="grid grid-cols-2 border-b border-zinc-150 py-3.5">
                    {/* Earnings */}
                    <div className="space-y-1 px-1 border-r border-zinc-100">
                      <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest pb-1 font-bold">Itemized Earnings (₹)</span>
                      <div className="flex justify-between">
                        <span>Prorated Basic:</span>
                        <strong className="text-zinc-800 font-bold">{compiledPayslip.earnings.basic}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Dearness Allow (DA):</span>
                        <strong className="text-zinc-800">{compiledPayslip.earnings.da}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>HRA Allowance:</span>
                        <strong className="text-zinc-800">{compiledPayslip.earnings.hra}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Med reimbursement:</span>
                        <strong className="text-zinc-800">{compiledPayslip.earnings.medical}</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-zinc-100 font-bold text-zinc-900 text-xs">
                        <span>GROSS EARNINGS:</span>
                        <span>₹{compiledPayslip.earnings.gross}</span>
                      </div>
                    </div>

                    {/* Deductions */}
                    <div className="space-y-1 px-3">
                      <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest pb-1 font-bold">Deductions (₹)</span>
                      <div className="flex justify-between">
                        <span>Provident Fund (EPF):</span>
                        <strong className="text-rose-600">{compiledPayslip.deductions.pf}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>ESI Medical Fund:</span>
                        <strong className="text-rose-600">{compiledPayslip.deductions.esi}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span>Professional tax:</span>
                        <strong className="text-rose-600">{compiledPayslip.deductions.professionalTax}</strong>
                      </div>
                      <div className="flex justify-between pt-1 border-t border-zinc-100 font-bold text-zinc-900 text-xs text-right">
                        <span>TOTAL DEDUCT:</span>
                        <span className="text-rose-600">₹{compiledPayslip.deductions.total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Net Payable block */}
                  <div className="pt-3.5 bg-zinc-50 border border-zinc-200 rounded-xl p-3 flex justify-between items-center mt-3 text-xs">
                    <span className="font-bold text-zinc-800 uppercase tracking-wider">Net Payable Salary Tranche:</span>
                    <strong className="text-base text-zinc-900 font-black font-mono">₹{compiledPayslip.netPayable.toLocaleString('en-IN')}.00</strong>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-dashed border-zinc-200 select-none p-16 rounded-2xl flex flex-col justify-center items-center text-center space-y-2">
                  <Coins className="h-8 w-8 text-zinc-300" />
                  <p className="text-xs text-zinc-400">Configure parameters and compile above to generate audited payslip vector sheet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeSubTab === 'biometrics' && (
          <div className="space-y-4">
            <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3.5">
              <h3 className="text-xs font-bold text-zinc-805 uppercase tracking-wider flex items-center gap-1.5 pt-1.5">
                <Fingerprint className="h-4 w-4 text-rose-500" /> Biometric Hardware Terminal Heartbeats
              </h3>
              <p className="text-xs text-zinc-500 leading-normal max-w-2xl">
                The terminal synchronizes biometric fingerprint templates mapped against RFID staff credentials on the local local gateway. Latency checks are validated at <strong>15ms intervals</strong> over network ports.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {biometricScans.map((log, idx) => (
                <div key={idx} className="bg-white border border-zinc-200 p-4 rounded-xl flex items-center justify-between text-xs font-mono">
                  <div className="space-y-1">
                    <div className="font-bold text-zinc-850 text-xs flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${log.status === 'On-Time' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
                      {log.emp}
                    </div>
                    <div className="text-[10px] text-zinc-400">Terminal: <span className="text-zinc-600 font-bold">{log.device}</span></div>
                    <div className="text-[10px] text-zinc-400">Scan Status: <span className="text-sky-600 font-semibold">{log.scan}</span></div>
                  </div>
                  <div className="text-right space-y-1">
                    <strong className="text-zinc-800 block text-xs">{log.time}</strong>
                    <span className={`inline-block px-2 text-[9px] font-bold rounded uppercase tracking-wider ${
                      log.status === 'On-Time' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {log.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
