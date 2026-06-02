import React, { useState } from 'react';
import { Terminal, Play, Send, CheckCircle2, ChevronRight, HelpCircle, FileJson, AlertCircle } from 'lucide-react';

export default function ApiSandboxModule() {
  const [activeVerb, setActiveVerb] = useState<'GET' | 'POST'>('GET');
  const [selectedEndpoint, setSelectedEndpoint] = useState('/api/sandbox/products');
  const [requestHeaders, setRequestHeaders] = useState('{\n  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9",\n  "Content-Type": "application/json"\n}');
  const [requestBody, setRequestBody] = useState('{\n  "customerName": "Gaurav Kumar",\n  "customerPhone": "9928172635",\n  "subtotal": 120,\n  "discount": 10\n}');
  
  const [responseLog, setResponseLog] = useState<any | null>(null);
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);

  const endpoints = [
    {
      verb: 'GET',
      path: '/api/sandbox/products',
      desc: 'Retrieve master drug inventory items, filtration, and locations.',
      category: 'Inventory APIs',
      schema: 'Returns full list of branch generic formulations.'
    },
    {
      verb: 'GET',
      path: '/api/sandbox/billing/invoices',
      desc: 'Retrieve chronological list of sales invoices and counters.',
      category: 'Billing APIs',
      schema: 'Returns complete history array of generated billing invoices.'
    },
    {
      verb: 'POST',
      path: '/api/sandbox/billing/invoice',
      desc: 'Commit new POS checkout receipt, calculating CGST and SGST splits.',
      category: 'Billing APIs',
      schema: 'Body: { customerName: string, customerPhone: string, subtotal: number }'
    },
    {
      verb: 'GET',
      path: '/api/sandbox/system/logs',
      desc: 'Immutable central trace logging recording active events for regulatory compliance audits.',
      category: 'Security Auditing System',
      schema: 'Returns active actions and IP session heartbeats.'
    }
  ];

  const handleRunRequest = async () => {
    setLoading(true);
    const start = performance.now();
    try {
      let options: RequestInit = {
        method: activeVerb,
        headers: JSON.parse(requestHeaders)
      };
      
      if (activeVerb === 'POST') {
        options.body = requestBody;
      }

      const res = await fetch(selectedEndpoint, options);
      const data = await res.json();
      const end = performance.now();
      
      setResponseStatus(res.status);
      setResponseLog(data);
      setExecutionTime(Number((end - start).toFixed(1)));
    } catch (e: any) {
      setResponseStatus(500);
      setResponseLog({ error: 'Endpoint calculation failure', message: e.message });
      setExecutionTime(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectEndpoint = (ep: typeof endpoints[0]) => {
    setActiveVerb(ep.verb as any);
    setSelectedEndpoint(ep.path);
    setResponseLog(null);
    setResponseStatus(null);
    setExecutionTime(null);
  };

  return (
    <div className="flex-1 p-6 bg-zinc-50 flex gap-6 overflow-hidden h-full">
      {/* Left Navigation bar: endpoint catalogs */}
      <div className="w-80 bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col overflow-hidden shadow-sm flex-shrink-0">
        <div className="flex items-center gap-2 mb-4 flex-shrink-0">
          <Terminal className="h-5 w-5 text-sky-500" />
          <div>
            <h3 className="text-sm font-bold text-zinc-800">Swagger API Playground</h3>
            <p className="text-[10px] text-zinc-400 font-medium">Test active routes against live server state</p>
          </div>
        </div>

        {/* Tree directory */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-thin">
          <div className="space-y-1.5">
            <span className="text-[9px] font-extrabold tracking-widest text-zinc-500 uppercase px-2">Active API Endpoints</span>
            <div className="space-y-1">
              {endpoints.map((ep, idx) => {
                const isActive = selectedEndpoint === ep.path;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectEndpoint(ep)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border flex items-center gap-2 text-xs transition ${
                      isActive
                        ? 'bg-zinc-900 border-transparent text-white'
                        : 'bg-white border-zinc-250 text-zinc-650 hover:bg-zinc-50 hover:text-zinc-900'
                    }`}
                  >
                    <span className={`text-[9px] font-mono font-bold leading-none px-1.5 py-1 rounded ${
                      ep.verb === 'GET' ? 'bg-sky-50 text-sky-700' : 'bg-emerald-50 text-emerald-700'
                    }`}>
                      {ep.verb}
                    </span>
                    <div className="overflow-hidden">
                      <p className="font-mono font-bold truncate leading-none">{ep.path}</p>
                      <span className="text-[9px] text-zinc-400 font-medium block truncate mt-1 leading-tight">{ep.desc}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="p-3 bg-zinc-50 border border-zinc-200 rounded-xl">
            <h4 className="text-[10px] font-bold text-zinc-550 uppercase tracking-wide">Documentation Note</h4>
            <p className="text-[10px] text-zinc-400 leading-normal mt-1">
              All REST responses carry headers satisfying HIPAA, GAMP 5, GCP, and local compliance.
            </p>
          </div>
        </div>
      </div>

      {/* Right Sandbox Container */}
      <div className="flex-1 bg-white border border-zinc-200 rounded-2xl p-5 flex flex-col overflow-hidden shadow-sm">
        <div className="flex items-center justify-between border-b pb-3.5 mb-4 flex-shrink-0">
          <div>
            <h3 className="text-sm font-bold text-zinc-800">REST Client Playground</h3>
            <span className="text-xs text-zinc-400 mt-1 font-mono font-bold">{activeVerb} {selectedEndpoint}</span>
          </div>
          <button
            onClick={handleRunRequest}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white font-bold px-4 py-2 rounded-xl border border-transparent transition"
          >
            <Send className="h-4 w-4" /> SEND SANDBOX REQUEST
          </button>
        </div>

        <div className="flex-1 grid grid-cols-2 gap-5 leading-relaxed overflow-hidden">
          {/* Inputs section */}
          <div className="border-r border-zinc-150 pr-4 flex flex-col justify-between overflow-y-auto space-y-4">
            <div>
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Client Authorization & Headers</label>
              <textarea
                rows={4}
                value={requestHeaders}
                onChange={(e) => setRequestHeaders(e.target.value)}
                className="w-full text-[10px] font-mono bg-zinc-950 text-emerald-400 p-3 rounded-xl focus:outline-none focus:ring-1 border border-zinc-900"
              />
            </div>

            {activeVerb === 'POST' && (
              <div className="flex-1 flex flex-col">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1.5 block">Raw Request payload (JSON)</label>
                <textarea
                  value={requestBody}
                  onChange={(e) => setRequestBody(e.target.value)}
                  className="flex-1 w-full text-[10px] font-mono bg-zinc-950 text-amber-400 p-3 rounded-xl focus:outline-none border border-zinc-900 min-h-60"
                />
              </div>
            )}
          </div>

          {/* Response log view block */}
          <div className="flex flex-col justify-between overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-zinc-400 uppercase font-bold tracking-widest">Sandbox Execution Console</span>
              {executionTime !== null && (
                <span className="text-[10px] text-emerald-700 font-mono font-black uppercase">
                  ⚡ LATENCY: {executionTime}ms | STATUS: {responseStatus}
                </span>
              )}
            </div>

            <div className="flex-1 overflow-auto bg-zinc-950 p-4 rounded-xl relative">
              {!responseLog ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-zinc-500 font-mono text-[10px]">
                  <span>SYSTEM WAITING FOR PIPELINE TRIGGER...</span>
                  <span className="text-zinc-600 scale-95 leading-normal text-center max-w-xs mt-2 font-sans font-medium">Click "SEND SANDBOX REQUEST" above to route and retrieve real database metrics.</span>
                </div>
              ) : (
                <pre className="text-slate-100 font-mono text-[10px] leading-relaxed select-all">
                  {JSON.stringify(responseLog, null, 2)}
                </pre>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
