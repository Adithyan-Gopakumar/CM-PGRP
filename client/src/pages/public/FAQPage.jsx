import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FAQPage() {
  const [openIdx, setOpenIdx] = useState(0);

  const faqs = [
    {
      q: 'What is the CM-PGRP portal and who can use it?',
      a: 'The Chief Minister’s Public Grievance Redressal Portal (CM-PGRP) is an online administrative redressal window established by the Government of Kerala. Any citizen residing in Kerala (or having issues related to Kerala public infrastructure and services) can register and submit grievances directly to the Chief Minister’s Office (CMO).'
    },
    {
      q: 'How does the AI Grievance Assistant assist my complaint?',
      a: 'When you type your complaint description, our AI engine automatically reviews the text to identify the appropriate department (e.g., PWD, KWA, KSEB, Health), recommend an urgency priority level (High, Medium, Low), generate an executive summary for CMO administrators, and alert you if a similar complaint was recently filed in your locality. You can review and modify the AI suggestions before final submission.'
    },
    {
      q: 'What format is the Grievance Reference ID and how do I track it?',
      a: 'Upon successful submission, the portal generates a unique Reference ID in the format KL-CMO-2026-XXXXX (e.g. KL-CMO-2026-00101). You can enter this reference ID at any time on the "Track Status" page to view real-time progress, assigned officers, and milestone timestamps without needing to log in.'
    },
    {
      q: 'What are the mandatory workflow stages for my grievance?',
      a: 'Every grievance passes through five transparent states: 1) "Submitted" (filed by citizen), 2) "Under Review" (screened by CMO and assigned to department), 3) "In Progress" (department officer inspecting or carrying out work), 4) "Resolved" (Action Taken Report submitted), and 5) "Reopened" (if citizen reports the issue remains unresolved).'
    },
    {
      q: 'What file formats and sizes are permitted for supporting attachments?',
      a: 'Citizens can upload photos of road damage, pipeline leaks, or documents (PDF, JPG, PNG, WEBP, DOCX) up to 15MB. Attachments help department field squads pinpoint the exact location and scope of work.'
    },
    {
      q: 'What should I do if the resolution provided by the department is unsatisfactory?',
      a: 'You have the sovereign right to reopen your complaint! When a grievance is marked "Resolved", log into your dashboard, click on the grievance, and select "Reopen Grievance". Provide your remarks explaining why the remedy was incomplete. Reopened grievances are automatically flagged with an escalation indicator on the CMO administrative desk.'
    },
    {
      q: 'What are the official resolution timelines (SLAs)?',
      a: 'High-priority public safety hazards (live electrical wires, hospital medicine shortages, water pipeline bursts) have a 24 to 48-hour SLA. Medium-priority municipal and road works have a 3 to 7 working day SLA. Routine administrative issues have a 10 to 14 day SLA.'
    },
    {
      q: 'Is my data secure and private?',
      a: 'Yes. The portal utilizes role-based access control (RBAC), hashed credentials, and secure JSON Web Tokens (JWT). Citizen personal contact numbers and emails are only accessible by authorized CMO personnel and assigned nodal officers.'
    }
  ];

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Frequently Asked Questions
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Help & Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-600">
          Find answers to common questions about submitting, tracking, and escalating public grievances.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div 
              key={idx} 
              className="gov-card overflow-hidden border border-slate-200/90"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? -1 : idx)}
                className="w-full text-left p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-emerald-800 transition-colors"
              >
                <span className="text-sm sm:text-base flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-emerald-50 text-emerald-800 text-xs flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </span>
                  {faq.q}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-emerald-700' : ''}`} 
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
