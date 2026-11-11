import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../services/api';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LifecycleTimeline from '../../components/common/LifecycleTimeline';
import { 
  Search, Shield, CheckCircle, Clock, Building2, MapPin, 
  Calendar, FileText, Printer, AlertTriangle, ArrowRight 
} from 'lucide-react';

export default function TrackGrievancePage() {
  const location = useLocation();
  const [refInput, setRefInput] = useState('');
  const [grievance, setGrievance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Check URL query param e.g. /track?ref=KL-CMO-2026-00101
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const refParam = params.get('ref');
    if (refParam) {
      setRefInput(refParam);
      fetchTracking(refParam);
    }
  }, [location.search]);

  const fetchTracking = async (refId) => {
    if (!refId || !refId.trim()) return;
    setLoading(true);
    setErrorMsg('');
    setGrievance(null);

    try {
      const res = await api.get(`/grievances/track/${encodeURIComponent(refId.trim())}`);
      if (res.data.success) {
        setGrievance(res.data.grievance);
      }
    } catch (err) {
      setErrorMsg(
        err.response?.data?.message || 
        `No grievance was found with reference ID "${refId}". Please check the ID and try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchTracking(refInput);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="py-12 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      {/* Header */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Public Status Verification
        </span>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Track Your Grievance Lifecycle
        </h1>
        <p className="text-sm text-slate-600 max-w-xl mx-auto">
          Enter your unique Grievance Reference ID to see real-time updates, assigned departments, and official action reports.
        </p>
      </div>

      {/* Search Input Box */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-2xl shadow-md border border-slate-200">
          <div className="flex-1 flex items-center pl-3">
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              value={refInput}
              onChange={(e) => setRefInput(e.target.value)}
              placeholder="e.g. KL-CMO-2026-00101"
              className="w-full px-3 py-2.5 text-sm font-mono text-slate-900 placeholder:text-slate-400 focus:outline-hidden"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl transition-colors shrink-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <span>Track Status</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo Quick Suggestion Chips */}
        <div className="mt-3 flex items-center justify-center flex-wrap gap-2 text-xs text-slate-500">
          <span>Try sample IDs:</span>
          {['KL-CMO-2026-00101', 'KL-CMO-2026-00102', 'KL-CMO-2026-00104'].map((sample) => (
            <button
              key={sample}
              type="button"
              onClick={() => {
                setRefInput(sample);
                fetchTracking(sample);
              }}
              className="px-2 py-0.5 rounded bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-800 border border-slate-200 font-mono transition-colors"
            >
              {sample}
            </button>
          ))}
        </div>
      </div>

      {/* Error state */}
      {errorMsg && (
        <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-semibold">Grievance Not Found</strong>
            <p className="text-xs text-rose-700 mt-1">{errorMsg}</p>
          </div>
        </div>
      )}

      {/* Grievance Result Card */}
      {grievance && (
        <div className="gov-card p-6 sm:p-8 space-y-8 print:border-none print:shadow-none">
          
          {/* Top Status Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-slate-500 font-medium">Reference ID:</span>
                <span className="font-mono text-base sm:text-lg font-extrabold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded border border-emerald-200">
                  {grievance.reference_id}
                </span>
                {grievance.is_escalated === 1 && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-800 border border-rose-300 animate-pulse">
                    ESCALATED TO CMO
                  </span>
                )}
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-2">
                {grievance.subject}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <StatusBadge status={grievance.status} size="lg" />
              <button
                onClick={handlePrint}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
            </div>
          </div>

          {/* Key Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs bg-slate-50 p-4 rounded-xl border border-slate-100">
            <div>
              <span className="text-slate-400 block font-medium">Assigned Department</span>
              <strong className="text-slate-900 block mt-0.5 text-sm">
                {grievance.department_name || 'Pending CMO Routing'}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">District & Taluk</span>
              <strong className="text-slate-900 block mt-0.5 text-sm">
                {grievance.district} {grievance.taluk ? `(${grievance.taluk})` : ''}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Category</span>
              <strong className="text-slate-900 block mt-0.5 text-sm">
                {grievance.category}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block font-medium">Priority</span>
              <div className="mt-0.5">
                <PriorityBadge priority={grievance.priority} />
              </div>
            </div>
          </div>

          {/* Action Taken Report (ATR) Section if Available */}
          {grievance.action_taken_report && (
            <div className="p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-700" />
                <span>Official Action Taken Report (ATR)</span>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line bg-white p-3.5 rounded-lg border border-emerald-100">
                {grievance.action_taken_report}
              </p>
              {grievance.resolved_at && (
                <div className="text-[11px] text-emerald-800">
                  Certified resolved on: {new Date(grievance.resolved_at).toLocaleString('en-IN')}
                </div>
              )}
            </div>
          )}

          {/* Full Audit Lifecycle Timeline */}
          <div className="space-y-4">
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-2">
              Lifecycle Milestone Audit Trail
            </h3>
            <LifecycleTimeline history={grievance.history || []} />
          </div>

        </div>
      )}
    </div>
  );
}
