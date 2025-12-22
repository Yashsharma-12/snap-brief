"use client";

import { useCompletion } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { Clipboard, Check, Trash2, Clock, Inbox, Upload } from 'lucide-react';
import mammoth from 'mammoth';

// NOTE: We do not import pdfjs at the top level to avoid SSR errors.

interface HistoryItem {
  id: string;
  timestamp: number;
  mode: string;
  summary: string;
}

export default function SummarizerPage() {
  const [mode, setMode] = useState('short');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [copyId, setCopyId] = useState<string | null>(null);
  const [mainCopied, setMainCopied] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { completion, complete, isLoading, input, setInput, handleInputChange } = useCompletion({
    api: '/api/summarize',
    streamProtocol: 'text',
    body: { mode },
    onFinish: (_prompt, result) => {
      if (result && result.trim().length > 0) {
        const newItem: HistoryItem = {
          id: crypto.randomUUID(),
          timestamp: Date.now(),
          mode,
          summary: result.trim(),
        };
        setHistory((prev) => {
          const updated = [newItem, ...prev].slice(0, 10);
          localStorage.setItem('summary-history', JSON.stringify(updated));
          return updated;
        });
      }
    }
  });

  useEffect(() => {
    const saved = localStorage.getItem('summary-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      if (file.type === "application/pdf") {
        // Dynamic import to prevent "DOMMatrix is not defined" error
        const pdfjs = await import('pdfjs-dist');
        
        // Use the legacy worker for better compatibility with Next.js
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(" ") + "\n";
        }
        setInput(text);
      } else if (file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setInput(result.value);
      } else {
        const text = await file.text();
        setInput(text);
      }
    } catch (err) {
      console.error(err);
      alert("Error reading file. If it's a PDF, ensure it's not a scanned image.");
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const copyMainOutput = async () => {
    if (!completion) return;
    await navigator.clipboard.writeText(completion);
    setMainCopied(true);
    setTimeout(() => setMainCopied(false), 2000);
  };

  const copyHistoryItem = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text);
    setCopyId(id);
    setTimeout(() => setCopyId(null), 2000);
  };

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-4xl font-black text-[#0A1828] tracking-tight">
              <span className="text-[#ec5334]">Summarize</span>
            </h1>
            <p className="text-slate-600 mt-2 text-lg">Clear intelligence from cluttered content.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-green-700 text-sm font-bold bg-white/50 px-4 py-2 rounded-full border border-green-200">
            <span className="h-2 w-2 bg-green-500 rounded-full animate-pulse" /> Active
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Input Box */}
          <div className="bg-[#c0c0c0] p-6 rounded-3xl shadow-xl border border-slate-300">
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-2 flex-1 mr-4">
                {['short', 'bullets', 'formal'].map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-3 rounded-2xl text-sm font-bold capitalize transition-all ${
                      mode === m ? 'bg-[#0A1828] text-white shadow-lg' : 'bg-white/40 text-[#0A1828]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-3 bg-white/60 rounded-2xl hover:bg-white transition-all text-[#0A1828]"
                title="Upload Document"
              >
                {isExtracting ? <div className="animate-spin h-5 w-5 border-2 border-[#0A1828] border-t-transparent rounded-full" /> : <Upload size={20} />}
              </button>
              <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept=".pdf,.docx,.txt" className="hidden" />
            </div>

            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder={isExtracting ? "Extracting text from document..." : "Paste long-form text or upload a file..."}
              className="w-full h-80 p-6 rounded-2xl bg-white/50 border-none focus:ring-4 focus:ring-blue-200 outline-none transition-all resize-none text-[#0A1828] font-medium"
            />
            <button
              onClick={() => complete(input, { body: { mode } })}
              disabled={isLoading || !input || input.length < 10 || isExtracting}
              className="w-full mt-6 py-4 bg-[#ec5334] text-white rounded-2xl font-bold text-lg hover:bg-[#d4462a] transition-all shadow-xl shadow-[#ec5334]/20"
            >
              {isLoading ? 'Summarizing...' : 'Generate Brief'}
            </button>
          </div>

          {/* Output Box */}
          <div className="bg-[#c0c0c0] p-8 rounded-3xl shadow-xl border border-slate-300 min-h-[400px] flex flex-col relative">
            <div className="flex justify-between items-center mb-6 border-b border-white/20 pb-4">
              <h2 className="text-xs font-black text-[#0A1828] uppercase tracking-widest">The Output</h2>
              {completion && (
                <button 
                  onClick={copyMainOutput}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    mainCopied ? 'bg-green-600 text-white' : 'bg-[#0A1828] text-white hover:bg-slate-800'
                  }`}
                >
                  {mainCopied ? <><Check size={14} /> Copied!</> : <><Clipboard size={14} /> Copy Summary</>}
                </button>
              )}
            </div>

            {isLoading && !completion ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-4 bg-white/30 rounded w-3/4" />
                <div className="h-4 bg-white/30 rounded w-full" />
              </div>
            ) : completion ? (
              <div className="prose prose-slate max-w-none">
                <p className="text-[#0A1828] leading-relaxed whitespace-pre-wrap font-semibold italic">
                  {completion}
                </p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-[#0A1828]/40 italic font-medium">
                Results will appear here...
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        <div className="mt-20 border-t border-[#0A1828]/10 pt-12 pb-20">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-3">
              <Clock className="text-[#0A1828] w-6 h-6" />
              <h3 className="text-2xl font-black text-[#0A1828]">Recent Activity</h3>
            </div>
            {history.length > 0 && (
              <button 
                onClick={() => { setHistory([]); localStorage.removeItem('summary-history'); }} 
                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-xl transition-all"
              >
                <Trash2 size={16} /> Clear History
              </button>
            )}
          </div>

          {history.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {history.map((item) => (
                <div key={item.id} className="bg-[#4a4a4a] p-6 rounded-2xl shadow-md border border-white/10 relative transition-transform hover:scale-[1.01]">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <span className="text-[10px] font-black uppercase tracking-widest bg-[#ec5334] text-white px-2 py-1 rounded mr-2">
                        {item.mode}
                      </span>
                      <span className="text-[10px] font-bold text-slate-300">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    
                    <button
                      onClick={() => copyHistoryItem(item.summary, item.id)}
                      className={`p-2 rounded-lg transition-all ${
                        copyId === item.id ? 'bg-green-500 text-white' : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {copyId === item.id ? <Check size={18} /> : <Clipboard size={18} />}
                    </button>
                  </div>
                  <p className="text-sm text-slate-100 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 bg-[#c0c0c0]/20 rounded-3xl border-2 border-dashed border-[#0A1828]/10">
              <Inbox className="w-12 h-12 text-[#0A1828]/20 mb-4" />
              <p className="text-[#0A1828]/40 font-bold uppercase tracking-widest text-sm">No summaries yet</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}