import React from 'react';
import { 
  CheckCircle2, Clock, Forward, RotateCcw, FileText, 
  Send, AlertCircle, ShieldAlert, Star
} from 'lucide-react';

const ACTION_ICONS = {
  'SUBMITTED': Send,
  'CMO_REVIEW': Clock,
  'FORWARDED_TO_DEPT': Forward,
  'STATUS_UPDATED': Clock,
  'ATR_SUBMITTED': FileText,
  'ESCALATED': ShieldAlert,
  'RESOLVED': CheckCircle2,
  'REOPENED': RotateCcw,
  'FEEDBACK_ADDED': Star
};

export default function LifecycleTimeline({ history = [] }) {
  if (!history || history.length === 0) {
    return <div className="text-slate-400 text-sm italic py-4">No milestone activity recorded yet.</div>;
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {history.map((event, idx) => {
        const IconComponent = ACTION_ICONS[event.action] || Clock;
        const isResolved = event.new_status === 'Resolved' || event.action === 'RESOLVED';
        const isReopened = event.new_status === 'Reopened' || event.action === 'REOPENED';
        const isEscalated = event.action === 'ESCALATED';

        let badgeBg = 'bg-slate-100 text-slate-700';
        if (isResolved) badgeBg = 'bg-emerald-100 text-emerald-800';
        else if (isReopened) badgeBg = 'bg-rose-100 text-rose-800';
        else if (isEscalated) badgeBg = 'bg-amber-100 text-amber-800';

        const dateStr = event.created_at ? new Date(event.created_at).toLocaleString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }) : 'Recent';

        return (
          <div key={event.id || idx} className="relative group">
            {/* Timeline node icon */}
            <div className={`absolute -left-[30px] top-0.5 w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${badgeBg}`}>
              <IconComponent className="w-3.5 h-3.5" />
            </div>

            <div className="bg-white border border-slate-200/80 rounded-lg p-3.5 shadow-xs hover:border-slate-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-slate-900">
                    {event.action.replace(/_/g, ' ')}
                  </span>
                  {event.new_status && (
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                      Status: {event.new_status}
                    </span>
                  )}
                </div>
                <span className="text-xs text-slate-400 font-medium">
                  {dateStr}
                </span>
              </div>

              {event.remarks && (
                <p className="text-xs text-slate-700 mt-1 whitespace-pre-line leading-relaxed bg-slate-50 p-2.5 rounded border border-slate-100">
                  {event.remarks}
                </p>
              )}

              <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-500">
                <span className="font-medium text-slate-700">{event.user_name || 'System'}</span>
                {event.user_role && (
                  <span className="capitalize px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 border border-slate-200">
                    {event.user_role === 'cmo_admin' ? 'CMO Admin' : event.user_role}
                  </span>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
