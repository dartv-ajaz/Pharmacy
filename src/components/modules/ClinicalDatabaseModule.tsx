import React, { useState } from 'react';
import { ShieldAlert, BookOpen, User, Check, Search, AlertCircle, Heart } from 'lucide-react';
import { mockProducts, mockPatients } from '../../data/mockData';
import { Product, Patient } from '../../types';

// Let's create custom drug monographs & interactions lists
const drugMonographs: Record<string, {
  indication: string;
  dosage: string;
  sideEffects: string[];
  scheduleClass: string;
  monographText: string;
}> = {
  P001: {
    indication: 'Mild to moderate pain, analgesia, antipyretic (fever reducer).',
    dosage: '500mg-650mg every 4-6 hours. Max 4,000mg/day.',
    sideEffects: ['Hepatotoxicity (at high dose)', 'Nausea', 'Allergic reactions'],
    scheduleClass: 'G (General/OTC)',
    monographText: 'Safe OTC medication, but high doses can lead to severe hepatic failure. Do not combine with other paracetamol products.'
  },
  P002: {
    indication: 'Type 2 Diabetes Mellitus glycemic control.',
    dosage: '1 tablet once or twice daily with breakfast/meals.',
    sideEffects: ['Hypoglycemia', 'Lactic acidosis (rare)', 'Gastrointestinal upset'],
    scheduleClass: 'Schedule H',
    monographText: 'Prescription mandatory. Requires regular monitoring of renal function, HbA1c, and fasting blood glucose levels.'
  },
  P003: {
    indication: 'Anxiety disorders, panic attacks, and transient insomnia.',
    dosage: '0.25mg to 0.5mg three times daily. Max 4mg/day.',
    sideEffects: ['Somnolence', 'Physical dependence', 'Muscle weakness'],
    scheduleClass: 'Schedule H / Controlled Substance',
    monographText: 'Benzodiazepine. Risk of habituation and withdrawal symptoms. Triplicate prescriptions required in specific territories.'
  },
  P004: {
    indication: 'Bacterial infections including respiratory, otitis media, skin structures.',
    dosage: '250mg-500mg three times daily.',
    sideEffects: ['Hypersensitivity rash', 'Anaphylaxis (severe)', 'Diarrhea'],
    scheduleClass: 'Schedule H / Antibiotic',
    monographText: 'Beta-lactam antibiotic. Contraindicated in patients with severe penicillin allergy. Full course compliance mandatory.'
  },
  P006: {
    indication: 'Tonic-clonic seizures, focal seizures, active status epilepticus.',
    dosage: '60mg-180mg daily at bedtime.',
    sideEffects: ['Nystagmus', 'Sedative fog', 'Osteomalacia'],
    scheduleClass: 'Schedule X / Narcotics Locked Group',
    monographText: 'Barbiturate. Highly regulated Class-II Narcotic. Requires dual-lock pharmacy storage, special patient ledger indexing, and strict audit trace.'
  }
};

const drugInteractions = [
  { drugA: 'Alprax 0.5mg', drugB: 'Gardenal 30mg', rating: 'Critical Crisis Alert', issue: 'Severe central nervous system (CNS) depression, respiratory suppression risk. Combined barbiturate/benzodiazepine therapy is highly contraindicated.' },
  { drugA: 'Amoxil 500mg', drugB: 'Allegra 120mg', rating: 'Potential Interaction', issue: 'Simultaneous antibiotic therapy can modify gastrointestinal flora, marginally affecting absorption rates.' },
  { drugA: 'Calpol 650mg', drugB: 'Gardenal 30mg', rating: 'Hepatic Advisory', issue: 'Phenobarbital induces CYP450, speeding up paracetamol metabolic conversion, potential toxic metabolite build-up.' }
];

export default function ClinicalDatabaseModule() {
  const [selectedProductId, setSelectedProductId] = useState<string>(mockProducts[0]?.id || '');
  const [searchQuery, setSearchQuery] = useState('');
  const [patientId, setPatientId] = useState<string>(mockPatients[0]?.id || '');
  const [testDrugId, setTestDrugId] = useState<string>(mockProducts[0]?.id || '');
  
  const currentProduct = mockProducts.find(p => p.id === selectedProductId) || mockProducts[0];
  const monograph = drugMonographs[currentProduct.id] || {
    indication: 'Standard systemic medication. Regular therapeutic dosage.',
    dosage: 'As prescribed by a registered clinician.',
    sideEffects: ['Gastrointestinal discomfort', 'Headache'],
    scheduleClass: currentProduct.category,
    monographText: `Classified as ${currentProduct.category}. Sells strictly based on standard regulatory retail prescriptions.`
  };

  const currentPatient = mockPatients.find(pat => pat.id === patientId) || mockPatients[0];
  
  // Patient Safety Calculation: Check if the patient is allergic to the tested drug
  const checkSafetyIssue = (pat: Patient, prodId: string): { status: 'safe' | 'alert'; text: string } => {
    const prod = mockProducts.find(p => p.id === prodId);
    if (!prod) return { status: 'safe', text: 'No safety issues detected.' };

    // Penicillin check
    const isPenicillinAllergic = pat.allergies.some(a => a.toLowerCase().includes('penicillin'));
    const isBetaLactamGroup = prod.name.toLowerCase().includes('amoxil') || prod.salt.toLowerCase().includes('amoxicillin');

    if (isPenicillinAllergic && isBetaLactamGroup) {
      return {
        status: 'alert',
        text: `CRITICAL RISK: Patient possesses a historical medical allergy to Penicillin/Beta-lactams! Amoxil (Amoxicillin) will trigger potential anaphylactic shock.`
      };
    }

    // Schedule X check
    if (prod.category === 'Schedule X' && pat.age > 75) {
      return {
        status: 'alert',
        text: `ADVISORY: Geriatric Risk. Schedule X Barbituates (${prod.name}) pose severe fall and central sedation risks for patients over 75.`
      };
    }

    return {
      status: 'safe',
      text: 'No matching allergy profiles or drug contraindications identified for this Patient profile.'
    };
  };

  const safetyResult = checkSafetyIssue(currentPatient, testDrugId);

  return (
    <div className="flex flex-col h-full bg-zinc-50 overflow-y-auto">
      {/* Banner */}
      <div className="bg-white border-b border-zinc-200 px-6 py-4">
        <h2 className="text-sm font-bold tracking-tight text-zinc-900 flex items-center gap-2">
          <ShieldAlert className="h-4 w-4 text-emerald-500" />
          Module 05: Clinical Drug Database & Interaction Engine
        </h2>
        <p className="text-[11px] text-zinc-500 mt-0.5">Real-time clinical countermeasure validations, contraindications & patient EMR checks.</p>
      </div>

      <div className="p-6 grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Drug list and lookup */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen className="h-4 w-4 text-sky-500" /> Drug Monograph Search
            </h3>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search by Brand Name or Salt..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8.5 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none focus:border-sky-500 text-zinc-800"
            />
          </div>

          <div className="space-y-1.5 max-h-96 overflow-y-auto pr-1">
            {mockProducts
              .filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.salt.toLowerCase().includes(searchQuery.toLowerCase()))
              .map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedProductId(p.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all text-xs flex justify-between items-center ${
                    selectedProductId === p.id 
                      ? 'bg-sky-50 border-sky-200 text-sky-900' 
                      : 'bg-zinc-50 border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  <div>
                    <div className="font-bold">{p.name}</div>
                    <div className="text-[10px] font-mono text-zinc-400">{p.salt}</div>
                  </div>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase border ${
                    p.category === 'Schedule X' || p.category === 'Narcotics'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : p.category === 'Schedule H'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-zinc-150 text-zinc-600 border-zinc-300'
                  }`}>
                    {p.category}
                  </span>
                </button>
              ))}
          </div>
        </div>

        {/* Center Column: Detailed Monograph info */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-5">
          <div>
            <span className="text-[10px] uppercase font-bold text-sky-500 tracking-wider">Active Monograph Profile</span>
            <h3 className="text-sm font-bold text-zinc-900 mt-0.5">{currentProduct.name}</h3>
            <p className="text-[11px] text-zinc-600 italic font-mono mt-0.5">{currentProduct.salt}</p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="bg-zinc-50 border border-zinc-200 rounded-lg p-3.5">
              <span className="block text-[9px] font-bold text-zinc-500 uppercase tracking-wider">Manufacturer SCM</span>
              <span className="font-medium text-zinc-800">{currentProduct.manufacturer}</span>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Therapeutic Indications</span>
              <p className="text-zinc-700 mt-1 leading-relaxed">{monograph.indication}</p>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Recommended Dosage Guidelines</span>
              <p className="text-zinc-700 mt-1 font-mono text-[11px]">{monograph.dosage}</p>
            </div>

            <div>
              <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Key Side Effects</span>
              <div className="mt-1 flex flex-wrap gap-1.5">
                {monograph.sideEffects.map((se, idx) => (
                  <span key={idx} className="bg-zinc-100 border border-zinc-200 text-zinc-600 px-2 py-0.5 rounded text-[10px]">
                    {se}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-zinc-100">
              <span className="block text-[9px] font-bold text-zinc-400 uppercase tracking-wider">Safety Regulatory advisory</span>
              <p className="text-zinc-600 mt-1 text-[11px] leading-relaxed bg-zinc-50/50 p-3 rounded-lg border border-zinc-150">
                {monograph.monographText}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Multi-drug clinical analyzer and Patients allergy checks */}
        <div className="space-y-6">
          
          {/* Patient Safety cross-reference */}
          <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-zinc-800 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-4 w-4 text-emerald-500" /> Patient Safety EMR Audit
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase">Select Patient</label>
                <select
                  value={patientId}
                  onChange={(e) => setPatientId(e.target.value)}
                  className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none"
                >
                  {mockPatients.map(pat => (
                    <option key={pat.id} value={pat.id}>{pat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[9px] font-bold text-zinc-500 uppercase">Drug to Prescribe</label>
                <select
                  value={testDrugId}
                  onChange={(e) => setTestDrugId(e.target.value)}
                  className="mt-1 w-full bg-zinc-50 border border-zinc-200 rounded-lg p-2 text-xs focus:outline-none"
                >
                  {mockProducts.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Demographics */}
            <div className="bg-zinc-50 rounded-lg p-3 text-[11px] border border-zinc-200 space-y-1">
              <div className="flex justify-between">
                <span className="text-zinc-400">EMR Reference:</span>
                <span className="font-mono font-bold text-zinc-800">{currentPatient.emrId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Known Allergies:</span>
                <span className="font-bold text-rose-600">
                  {currentPatient.allergies.length > 0 ? currentPatient.allergies.join(', ') : 'None Reported'}
                </span>
              </div>
            </div>

            {/* Clinical safety warning display */}
            <div className={`p-3.5 rounded-lg border text-xs flex gap-2.5 ${
              safetyResult.status === 'alert'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-emerald-50/50 border-emerald-150 text-emerald-800'
            }`}>
              <AlertCircle className={`h-4 w-4 shrink-0 mt-0.5 ${safetyResult.status === 'alert' ? 'text-rose-500' : 'text-emerald-500'}`} />
              <p className="leading-relaxed">{safetyResult.text}</p>
            </div>
          </div>

          {/* Interactive Multi-drug Interactor */}
          <div className="bg-slate-900 border border-slate-800 text-white rounded-xl p-5 shadow-sm space-y-4.5">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-rose-500/10 rounded-lg text-rose-400 border border-rose-500/20">
                <ShieldAlert className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Regulatory Interaction Checker</h3>
            </div>

            <p className="text-[11px] text-slate-400 leading-normal">
              Continuous systemic crosschecking for active chemical combinations that introduce pharmaceutical hazards.
            </p>

            <div className="space-y-2.5">
              {drugInteractions.map((interact, idx) => (
                <div key={idx} className="bg-slate-950/45 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="font-bold text-slate-100">{interact.drugA} + {interact.drugB}</span>
                    <span className="text-[9px] px-2 py-0.5 rounded uppercase font-bold tracking-wider bg-rose-500/20 text-rose-400 border border-rose-500/20">
                      {interact.rating}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-400">{interact.issue}</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
