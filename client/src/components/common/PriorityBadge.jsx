import React from 'react';
import { AlertTriangle, Clock, ArrowDown } from 'lucide-react';

export default function PriorityBadge({ priority }) {
  if (priority === 'High') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
        <AlertTriangle className="w-3 h-3 text-rose-600" />
        High Priority
      </span>
    );
  }
  if (priority === 'Medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        <Clock className="w-3 h-3 text-amber-600" />
        Medium
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-medium bg-slate-50 text-slate-700 border border-slate-200">
      <ArrowDown className="w-3 h-3 text-slate-500" />
      Low
    </span>
  );
}
