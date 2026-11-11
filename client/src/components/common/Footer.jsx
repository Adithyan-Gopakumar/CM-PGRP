import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Phone, Mail, MapPin, ExternalLink, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-10 border-t-4 border-emerald-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Col 1: Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-700 flex items-center justify-center text-white shadow">
                <Shield className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">CM-PGRP</span>
                <p className="text-[11px] text-emerald-400 font-medium">Govt. of Kerala</p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Chief Minister's Public Grievance Redressal Portal provides an expedited, AI-assisted digital window for citizens to bring public issues directly to the Chief Minister's Office.
            </p>
            <p className="text-xs text-emerald-300/80 font-['Manjari',sans-serif]">
              "ജനപക്ഷ വികസനവും സുതാര്യമായ ഭരണവും ഉറപ്പാക്കുന്നു"
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Quick Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li><Link to="/about" className="hover:text-emerald-400 transition-colors">About CMO Grievance Initiative</Link></li>
              <li><Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works & SLAs</Link></li>
              <li><Link to="/departments" className="hover:text-emerald-400 transition-colors">Participating Departments</Link></li>
              <li><Link to="/track" className="hover:text-emerald-400 transition-colors">Track Grievance Status</Link></li>
              <li><Link to="/faq" className="hover:text-emerald-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400 transition-colors">Public Contact & Secretariat</Link></li>
            </ul>
          </div>

          {/* Col 3: State Helplines */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              Emergency Toll-Free Helplines
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span>CM Public Grievance Helpline:</span>
                <strong className="text-amber-400 font-mono text-sm">1076</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span>Police / Emergency:</span>
                <strong className="text-emerald-400 font-mono text-sm">112</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span>KSEB Power Breakdown:</span>
                <strong className="text-amber-400 font-mono text-sm">1912</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span>KWA Water Supply Grievance:</span>
                <strong className="text-sky-400 font-mono text-sm">1916</strong>
              </div>
              <div className="flex items-center justify-between p-2 rounded bg-slate-800/80 border border-slate-700/50">
                <span>Disha Health Information:</span>
                <strong className="text-emerald-400 font-mono text-sm">1056</strong>
              </div>
            </div>
          </div>

          {/* Col 4: CMO Office Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4 border-l-2 border-emerald-500 pl-2">
              CMO Secretariat Address
            </h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Office of the Chief Minister, 3rd Floor, North Block, Government Secretariat, Thiruvananthapuram, Kerala - 695001</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>0471-2333812 / 2333682</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>chiefminister@kerala.gov.in</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Prototype Disclaimer & Mandatory Recruitment Notice */}
        <div className="mt-8 pt-6 text-center space-y-3">
          <div className="inline-block bg-amber-500/10 border border-amber-500/30 rounded-lg px-4 py-2.5 max-w-3xl mx-auto">
            <p className="text-xs text-amber-300 font-medium leading-relaxed">
              <strong>Recruitment Assessment Disclaimer:</strong> This portal is a working technical prototype developed for the WhiteMatrix Software Solutions AI Full Stack Engineer Recruitment Assessment. Fictional sample data is used for demonstration purposes. This prototype is not officially affiliated with or endorsed by the Government of Kerala.
            </p>
          </div>
          <p className="text-[11px] text-slate-500">
            © {new Date().getFullYear()} Chief Minister's Public Grievance Redressal Portal (CM-PGRP) Prototype. Designed with React, Node.js, SQLite & AI.
          </p>
        </div>
      </div>
    </footer>
  );
}
