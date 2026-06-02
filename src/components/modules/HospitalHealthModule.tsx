import React, { useState } from 'react';
import { 
  Building, ShieldCheck, RefreshCw, Key, Plus, CheckCircle, Search, 
  HelpCircle, ChevronRight, Activity, Database, AlertCircle 
} from 'lucide-react';

export default function HospitalHealthModule() {
  const [activeSubTab, setActiveSubTab] = useState<'hl7' | 'emr'>('hl7');
  const [searchQuery, setSearchQuery] = useState('');

  const [hl7Feed, setHl7Feed] = useState([
    { id: 'HL7-9812', hospital: 'Apollo Heart Specialty OPD', patientName: 'Priya Mehra', doctor: 'Dr. S. K. Sen', drugs: 'Pentocid 40mg (30x), Calpol 650mg (15x)', status: 'Incoming Prescribing stream' },
    { id: 'HL7-9811', hospital: 'Fortis Multi-Specialty Clinic', patientName: 'Aditya Vardhan', doctor: 'Dr. Vivek Malhotra', drugs: 'Alprax 0.5mg (10x)', status: 'Awaiting Stocks checks' },
    { id: 'HL7-9810', hospital: 'Max Clinic Pediatric EMR', patientName: 'Baby Swara', doctor: 'Dr. Anita Desai', drugs: 'Crocin Syrup 60ml (1x)', status: 'Intake Completed' }
  ]);

  const [connections, setConnections] = useState([
    { id: 'CONN-01', provider: 'Apollo Hospitals Clinical Network', type: 'HL7 v2.5 Stream Secure TLS', state: 'CONNECTED' },
    { id: 'CONN-02', provider: 'Fortis Healthcare Systems EMR', type: 'FHIR JSON REST Hook v4', state: 'CONNECTED' },
    { id: 'CONN-03', provider: 'Max Health EMR Portal Sync', type: 'HL7 v3.0 XML Pipeline', state: 'CONNECTED' }
  ]);

  const triggerIntake = (id: string) => {
    setHl7Feed(hl7Feed.map(feed => feed.id === id ? { ...feed, status: 'Intake Completed' } : feed));
  };

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto text-xs">
      {/* SCM Header */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 flex-shrink-0">
        <div>
          <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
            <Building className="h-4 w-4 text-emerald-500 font-bold" />
            Module 17: HL7 Clinical Prescription Streams & Hospital EMR Bridge
          </h2>
          <p className="text-[11px] text-zinc-500 mt-0.5">Sync electronic medical record (EMR) e-prescriptions, evaluate patient allergy tags, and convert doctor orders to Billing POS cards.</p>
        </div>

        <div className="flex bg-zinc-100 p-1.5 rounded-xl border border-zinc-200 gap-1 text-xs">
          <button
            onClick={() => setActiveSubTab('hl7')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'hl7' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Clinical HL7 Incoming Feed ({hl7Feed.length})
          </button>
          <button
            onClick={() => setActiveSubTab('emr')}
            className={`px-3 py-1 font-bold rounded-lg transition-all ${
              activeSubTab === 'emr' ? 'bg-white shadow text-emerald-600' : 'text-zinc-500 hover:text-zinc-800'
            }`}
          >
            Digital Hospital Connections ({connections.length})
          </button>
        </div>
      </div>

      <div className="p-6">
        {activeSubTab === 'hl7' ? (
          <div className="space-y-4">
            
            <div className="p-4 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-3 text-sky-800">
              <Activity className="h-4 w-4 text-sky-600 shrink-0" />
              <p className="text-[10.5px]">
                <b>HL7 Live Integration Pipeline:</b> Automatically matching doctor prescribing names against registered local FDA licensing databases. Awaiting chemical verification.
              </p>
            </div>

            <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-zinc-50 border-b border-zinc-200 text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                    <th className="px-5 py-3">HL7 stream ID</th>
                    <th className="px-5 py-3">Hospital Provider node</th>
                    <th className="px-5 py-3">Patient Customer</th>
                    <th className="px-5 py-3">Prescribing Physician</th>
                    <th className="px-5 py-3 text-sky-750">Required Drug Formulary</th>
                    <th className="px-5 py-3 text-center">Status</th>
                    <th className="px-5 py-3 text-right">Convert to Billing POS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-100 font-sans">
                  {hl7Feed.map((feed) => (
                    <tr key={feed.id} className="hover:bg-zinc-50/50">
                      <td className="px-5 py-3.5 font-mono font-bold text-zinc-500">{feed.id}</td>
                      <td className="px-5 py-3.5 font-semibold text-zinc-850">{feed.hospital}</td>
                      <td className="px-5 py-3.5 font-bold text-zinc-800">{feed.patientName}</td>
                      <td className="px-5 py-3.5 text-zinc-500">{feed.doctor}</td>
                      <td className="px-5 py-3.5 font-semibold text-zinc-700 italic">{feed.drugs}</td>
                      <td className="px-5 py-3.5 text-center">
                        <span className={`inline-block px-1.5 py-0.5 rounded text-[8.5px] font-bold uppercase tracking-wider ${
                          feed.status === 'Intake Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-sky-50 text-sky-700 border border-sky-100'
                        }`}>
                          {feed.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {feed.status !== 'Intake Completed' ? (
                          <button
                            onClick={() => triggerIntake(feed.id)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg text-[9px] uppercase transition"
                          >
                            Integrate Rx Order
                          </button>
                        ) : (
                          <span className="text-emerald-600 font-bold flex items-center gap-1 justify-end">
                            <CheckCircle className="h-3 w-3" /> Transferred to Bill desk
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>
        ) : (
          /* Connections list */
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-80s uppercase tracking-widest">
              Authorized clinical HIPAA & Hospital secure pipelines
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {connections.map((c) => (
                <div key={c.id} className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <strong className="text-zinc-850 font-bold block truncate">{c.provider}</strong>
                      <span className="text-[10px] text-zinc-400 font-mono">CONNECTION: {c.id} | PROTOCOL: {c.type}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-zinc-150/50 flex justify-between items-center">
                    <span className="text-zinc-500">Pipeline Status:</span>
                    <span className="px-2 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-700 font-mono font-black text-[9px]">
                      {c.state}
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
