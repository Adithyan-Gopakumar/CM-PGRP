import React from 'react';
import { 
  Send, Cpu, ShieldCheck, ArrowRight, Building, Wrench, 
  FileCheck, Star, RotateCcw, Clock, AlertTriangle 
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '1',
      title: 'Citizen Grievance Submission',
      status: 'Submitted',
      role: 'Citizen',
      icon: Send,
      desc: 'The citizen logs into the portal and describes the grievance, specifying the district, taluk, category, and uploading optional photos or documents.'
    },
    {
      num: '2',
      title: 'AI Analysis & Triage',
      status: 'AI Assisted',
      role: 'AI Engine',
      icon: Cpu,
      desc: 'The integrated AI Grievance Assistant processes the text in real-time, suggests the responsible department, calculates urgency/priority, creates an executive summary, and checks for potential duplicate complaints.'
    },
    {
      num: '3',
      title: 'CMO Screening & Endorsement',
      status: 'Under Review',
      role: 'CMO Admin',
      icon: ShieldCheck,
      desc: 'The Chief Minister’s administrative team reviews the grievance, inspects attachments, adds internal remarks, and can escalate delayed or critical matters directly.'
    },
    {
      num: '4',
      title: 'Forwarding to Department Nodal Officer',
      status: 'Under Review',
      role: 'CMO Admin',
      icon: ArrowRight,
      desc: 'The grievance is routed to the designated nodal officer of the specific government department (e.g. PWD, KWA, KSEB, Health) with priority instructions.'
    },
    {
      num: '5',
      title: 'Field Investigation & Status Progress',
      status: 'In Progress',
      role: 'Department Officer',
      icon: Wrench,
      desc: 'The department officer acknowledges receipt, updates the status to "In Progress", and dispatches field squads (e.g. road repair crew, pipeline technicians) to inspect.'
    },
    {
      num: '6',
      title: 'Action Taken Report (ATR) Submission',
      status: 'Resolved',
      role: 'Department Officer',
      icon: FileCheck,
      desc: 'Upon completing remedial work, the officer documents the concrete actions taken in an official Action Taken Report (ATR) and submits it back to the CMO and citizen.'
    },
    {
      num: '7',
      title: 'Citizen Verification & Feedback',
      status: 'Resolved',
      role: 'Citizen',
      icon: Star,
      desc: 'The citizen receives the resolution notification, reviews the officer’s report, and submits a 1-5 star rating with comments on satisfaction.'
    },
    {
      num: '8',
      title: 'Reopening (If Unsatisfactory)',
      status: 'Reopened',
      role: 'Citizen & CMO',
      icon: RotateCcw,
      desc: 'If the on-ground resolution was incomplete or defective, the citizen can reopen the grievance. Reopened grievances are automatically flagged for direct CMO oversight.'
    }
  ];

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Transparent Workflow
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          How the Grievance Redressal Mechanism Operates
        </h1>
        <p className="text-base text-slate-600 leading-relaxed">
          From the instant a citizen presses "Submit" to the physical completion of work on the ground, every stage is tracked with timestamps, responsible officials, and irreversible logs.
        </p>
      </div>

      {/* Step by Step Progression */}
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div key={idx} className="gov-card p-6 flex flex-col justify-between border-t-4 border-t-emerald-600">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="w-8 h-8 rounded-full bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center">
                      {s.num}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                      {s.role}
                    </span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-base mb-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.desc}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 font-medium">Lifecycle Status:</span>
                  <span className="font-semibold text-emerald-800">{s.status}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SLA Matrix Table */}
      <div className="gov-card p-8 space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <Clock className="w-6 h-6 text-emerald-700" />
          <div>
            <h3 className="text-lg font-bold text-slate-900">Mandated Service Level Agreements (SLAs)</h3>
            <p className="text-xs text-slate-500">Maximum permissible turnaround timelines as approved by Chief Minister Office</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase tracking-wider font-semibold border-y border-slate-200">
              <tr>
                <th className="py-3 px-4">Priority Level</th>
                <th className="py-3 px-4">Typical Category</th>
                <th className="py-3 px-4">CMO Initial Review SLA</th>
                <th className="py-3 px-4">Department Resolution SLA</th>
                <th className="py-3 px-4">Escalation Trigger</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-rose-700">High Priority</td>
                <td className="py-3.5 px-4 text-slate-600">Live wires, major water pipe bursts, hospital medicine stockouts</td>
                <td className="py-3.5 px-4 font-medium">Within 4 Hours</td>
                <td className="py-3.5 px-4 font-medium text-emerald-800">24 – 48 Hours</td>
                <td className="py-3.5 px-4 text-amber-700">Overdue if exceeds 48 hours</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-amber-700">Medium Priority</td>
                <td className="py-3.5 px-4 text-slate-600">Road potholes, transformer voltage drop, street light cluster faults</td>
                <td className="py-3.5 px-4 font-medium">Within 24 Hours</td>
                <td className="py-3.5 px-4 font-medium text-emerald-800">3 – 7 Working Days</td>
                <td className="py-3.5 px-4 text-amber-700">Overdue if exceeds 7 days</td>
              </tr>
              <tr className="hover:bg-slate-50/50">
                <td className="py-3.5 px-4 font-bold text-slate-700">Low Priority</td>
                <td className="py-3.5 px-4 text-slate-600">Routine enquiries, boundary clarification, name correction</td>
                <td className="py-3.5 px-4 font-medium">Within 48 Hours</td>
                <td className="py-3.5 px-4 font-medium text-emerald-800">10 – 14 Working Days</td>
                <td className="py-3.5 px-4 text-amber-700">Overdue if exceeds 15 days</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
