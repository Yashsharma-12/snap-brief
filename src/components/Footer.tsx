"use client";

import Link from "next/link";
import { useState } from "react";
import { Github, Linkedin, Mail, ExternalLink, Check } from "lucide-react";

export default function Footer() {
  const [copied, setCopied] = useState(false);
  const emailAddress = "yashsharma2044@gmail.com";

  const handleEmailClick = (e: React.MouseEvent) => {
    // Copy to clipboard as a fallback/convenience
    navigator.clipboard.writeText(emailAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    // The href will still trigger the mailto action
  };

  return (
    <footer className="bg-[#0A1828] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Section 1: About */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center font-bold shadow-lg bg-white/10">
                <img src="/crab.png" alt="Logo" className="w-6 h-6 object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight">
                Snap<span className="text-blue-400">Brief</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              Powered by Gemini 2.5, SnapBrief is designed to help you conquer information overload by turning long documents into instant, actionable intelligence.
            </p>
          </div>

          {/* Section 2: Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-[#ec5334] mb-6">Product</h4>
            <ul className="space-y-4 text-sm text-slate-400">
              <li><Link href="#" className="hover:text-white transition-colors">How it Works</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Section 3: Connect */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-[#ec5334] mb-6">Connect</h4>
            <div className="flex gap-4">
              <a 
                href="https://github.com/Yashsharma-12" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white/5 rounded-lg hover:bg-[#ec5334] hover:text-white transition-all text-slate-400"
                title="GitHub"
              >
                <Github size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/yash-sharma-2004d/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-2 bg-white/5 rounded-lg hover:bg-[#ec5334] hover:text-white transition-all text-slate-400"
                title="LinkedIn"
              >
                <Linkedin size={20} />
              </a>
              
              {/* Functional Email Link with Copy Fallback */}
              <a 
                href={`mailto:${emailAddress}`}
                onClick={handleEmailClick}
                target="_blank" 
                rel="noopener noreferrer"
                className={`p-2 rounded-lg transition-all flex items-center gap-2 group ${
                  copied ? 'bg-green-600 text-white' : 'bg-white/5 text-slate-400 hover:bg-[#ec5334] hover:text-white'
                }`}
                title={copied ? "Email Copied!" : "Send us an email (Click to Copy)"}
              >
                {copied ? <Check size={20} /> : <Mail size={20} className="group-hover:scale-110 transition-transform" />}
                {copied && <span className="text-[10px] font-bold uppercase tracking-tighter">Copied!</span>}
              </a>
            </div>
            <p className="mt-6 text-xs text-slate-500">
              Found a bug? <a href="#" className="underline inline-flex items-center gap-1 hover:text-white">Report it <ExternalLink size={10} /></a>
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>© 2025 SnapBrief AI. Built with precision for the modern web.</p>
          <div className="flex gap-6">
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Systems Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}