import React from 'react';
import { Shield, Target, Eye, Compass, Award, CheckCircle2, Users, Building2 } from 'lucide-react';

export default function AboutUsPage() {
  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          About CM-PGRP Kerala
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Transforming Public Governance Through Transparent Redressal
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          The Chief Minister's Public Grievance Redressal Portal is the premier digital administrative window connecting citizens of Kerala with the executive leadership of the state.
        </p>
      </div>

      {/* CM Message Card */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-2xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 pointer-events-none"></div>
        <div className="relative max-w-3xl space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
            Chief Minister's Vision
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            "A Government That Listens, Acts, and Delivers"
          </h2>
          <p className="text-emerald-100 text-sm leading-relaxed">
            Democratic governance derives its strength from active citizen participation. The CM-PGRP portal ensures that whether a citizen lives in a remote tribal hamlet in Wayanad or an urban centre in Kochi, their concern regarding basic infrastructure, clean drinking water, hospital medicines, or educational facilities reaches the Chief Minister's Office without intermediaries.
          </p>
          <div className="pt-2 text-xs text-emerald-200">
            <strong>Office of the Chief Minister</strong> — Government Secretariat, Thiruvananthapuram
          </div>
        </div>
      </div>

      {/* Vision, Mission, Objectives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="gov-card p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
            <Eye className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Our Vision</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            To build a responsive, paperless, and citizen-first public administration in Kerala where every grievance is resolved expeditiously with dignity, transparency, and accountability.
          </p>
        </div>

        <div className="gov-card p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center border border-amber-100">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Our Mission</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Leveraging modern digital architecture and responsible Artificial Intelligence to eliminate bureaucratic bottlenecks, route complaints to correct departmental authorities within minutes, and maintain complete public traceability.
          </p>
        </div>

        <div className="gov-card p-6 space-y-3">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center border border-indigo-100">
            <Compass className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Core Objectives</h3>
          <p className="text-sm text-slate-600 leading-relaxed">
            Standardize Service Level Agreements (SLAs), empower citizens to track status 24x7, prevent repeat hazards, and generate actionable governance analytics for state policy planning.
          </p>
        </div>
      </div>

      {/* Guiding Principles */}
      <div className="gov-card p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
          Guiding Principles of CM-PGRP
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">Strict Accountability & Non-Repudiation</strong>
              <p className="text-slate-600 text-xs mt-1">Every state officer assigned a grievance is individually accountable. Every action, remark, and status transition is recorded in an immutable audit trail.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">Responsible Human-in-the-Loop AI</strong>
              <p className="text-slate-600 text-xs mt-1">AI accelerates categorization, priority scoring, and duplicate detection, while official decisions and field actions remain strictly under human officers' authority.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">Citizen-Centric Closure Verification</strong>
              <p className="text-slate-600 text-xs mt-1">A grievance is only considered truly resolved when the citizen verifies the Action Taken Report. Citizens retain the sovereign right to reopen unsatisfactory resolutions.</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 block font-semibold">District-Wide Inclusivity</strong>
              <p className="text-slate-600 text-xs mt-1">Full coverage across all 14 revenue districts and 77 taluks of Kerala with bilingual support in Malayalam and English.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
