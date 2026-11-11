import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LifecycleTimeline from '../../components/common/LifecycleTimeline';
import { 
  Building2, Search, Filter, Wrench, FileCheck, CheckCircle2, 
  AlertCircle, Download, Clock, Eye, RefreshCw, X
} from 'lucide-react';

export default function OfficerDashboard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected Grievance for Action Modal
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Form states for ATR and Status
  const [atrText, setAtrText] = useState('');
  const [markResolved, setMarkResolved] = useState(true);
  const [investigationRemarks, setInvestigationRemarks] = useState('');
  const [submittingAtr, setSubmittingAtr] = useState(false);

  const [newStatus, setNewStatus] = useState('In Progress');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  const fetchGrievances = async () => {
    try {
      setLoading(true);
      const res = await api.get('/grievances');
      if (res.data.success) {
        setGrievances(res.data.grievances);
      }
    } catch (err) {
      console.error('Failed to load officer grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrievances();
  }, []);

  const handleOpenGrievance = async (g) => {
    setSelectedGrievance(g);
    setActionSuccessMsg('');
    setActionErrorMsg('');
    setNewStatus(g.status === 'Submitted' ? 'In Progress' : g.status);
    setAtrText(g.action_taken_report || '');
    setInvestigationRemarks('');

    try {
      const res = await api.get(`/grievances/${g.id}`);
      if (res.data.success) {
        setSelectedGrievance(res.data.grievance);
      }
    } catch (err) {
      console.error('Failed to load full grievance details:', err);
    }
  };

  // Submit Action Taken Report (ATR)
  const handleSubmitAtr = async (e) => {
    e.preventDefault();
    if (!selectedGrievance || !atrText.trim()) return;

    setSubmittingAtr(true);
    setActionSuccessMsg('');
    setActionErrorMsg('');

    try {
      const res = await api.post(`/grievances/${selectedGrievance.id}/atr`, {
        action_taken_report: atrText.trim(),
        mark_resolved: markResolved,
        remarks: investigationRemarks || 'Field team completed action on site.'
      });

      if (res.data.success) {
        setActionSuccessMsg(res.data.message);
        fetchGrievances();
        handleOpenGrievance({
          ...selectedGrievance,
          action_taken_report: atrText,
          status: markResolved ? 'Resolved' : 'In Progress'
        });
      }
    } catch (err) {
      setActionErrorMsg(err.response?.data?.message || 'Failed to submit ATR.');
    } finally {
      setSubmittingAtr(false);
    }
  };

  // Quick Status Transition (e.g. Acknowledge & move to In Progress)
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedGrievance || !newStatus) return;

    setSubmittingStatus(true);
    setActionSuccessMsg('');
    setActionErrorMsg('');

    try {
      const res = await api.patch(`/grievances/${selectedGrievance.id}/status`, {
        status: newStatus,
        remarks: statusRemarks || `Officer ${user.name} updated status to ${newStatus}.`
      });

      if (res.data.success) {
        setActionSuccessMsg(`Status updated to '${newStatus}'.`);
        setStatusRemarks('');
        fetchGrievances();
        handleOpenGrievance(res.data.grievance);
      }
    } catch (err) {
      setActionErrorMsg(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSubmittingStatus(false);
    }
  };

  const filteredGrievances = grievances.filter(g => {
    const q = search.toLowerCase();
    const matchesSearch = 
      g.reference_id.toLowerCase().includes(q) ||
      g.subject.toLowerCase().includes(q) ||
      g.district.toLowerCase().includes(q) ||
      g.category.toLowerCase().includes(q);

    const matchesStatus = statusFilter ? g.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = grievances.filter(g => g.status !== 'Resolved').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress').length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Officer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Department Nodal Officer Workstation
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            {user?.department_name || 'Department Officer Queue'} ({user?.department_code})
          </h1>
          <p className="text-xs text-slate-500">
            Nodal Officer: <strong>{user?.name}</strong> | Email: <strong>{user?.email}</strong>
          </p>
        </div>

        <button
          onClick={fetchGrievances}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Metric Counters */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="gov-card p-5 border-l-4 border-l-amber-500">
          <span className="text-xs font-medium text-slate-500 block">Pending Investigation</span>
          <strong className="text-2xl font-extrabold text-amber-700 mt-1 block">
            {pendingCount}
          </strong>
          <span className="text-[11px] text-amber-600">Requires site visit / work order</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-indigo-500">
          <span className="text-xs font-medium text-slate-500 block">Work In Progress</span>
          <strong className="text-2xl font-extrabold text-indigo-700 mt-1 block">
            {inProgressCount}
          </strong>
          <span className="text-[11px] text-indigo-600">Field crew deployed</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-emerald-600">
          <span className="text-xs font-medium text-slate-500 block">Resolved with ATR</span>
          <strong className="text-2xl font-extrabold text-emerald-700 mt-1 block">
            {resolvedCount}
          </strong>
          <span className="text-[11px] text-emerald-600">Submitted back to CMO</span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="gov-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ref ID, Subject, District..."
            className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-500 shrink-0" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white w-full sm:w-auto"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Under Review">Under Review</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Reopened">Reopened</option>
          </select>
        </div>
      </div>

      {/* Grievance Table */}
      <div className="gov-card overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">
            Grievances Assigned to {user?.department_code || 'Department'} ({filteredGrievances.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading department queue...</div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-sm">
            No grievances currently assigned matching your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref ID</th>
                  <th className="py-3 px-4">Citizen & Location</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Assigned</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrievances.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {g.reference_id}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <div className="font-semibold text-slate-900">{g.citizen_name || 'Citizen'}</div>
                      <div className="text-[11px] text-slate-500">{g.district} {g.taluk ? `• ${g.taluk}` : ''}</div>
                    </td>

                    <td className="py-3 px-4 max-w-xs">
                      <div className="font-medium text-slate-900 line-clamp-1">{g.subject}</div>
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      {g.category}
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <PriorityBadge priority={g.priority} />
                    </td>

                    <td className="py-3 px-4 whitespace-nowrap">
                      <StatusBadge status={g.status} />
                    </td>

                    <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                      {g.created_at ? new Date(g.created_at).toLocaleDateString('en-IN') : 'Recent'}
                    </td>

                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenGrievance(g)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Action / ATR</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* OFFICER ACTION MODAL */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={() => setSelectedGrievance(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {selectedGrievance.reference_id}
                </span>
                <StatusBadge status={selectedGrievance.status} />
                <PriorityBadge priority={selectedGrievance.priority} />
                {selectedGrievance.is_escalated === 1 && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Escalated by CMO
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{selectedGrievance.subject}</h2>
              <div className="text-xs text-slate-500">
                District: <strong>{selectedGrievance.district}</strong> | Citizen: <strong>{selectedGrievance.citizen_name} ({selectedGrievance.citizen_mobile})</strong>
              </div>
            </div>

            {actionSuccessMsg && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}
            {actionErrorMsg && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{actionErrorMsg}</span>
              </div>
            )}

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Citizen's Grievance Details
              </label>
              <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line">
                {selectedGrievance.description}
              </p>
            </div>

            {/* Attachments if any */}
            {selectedGrievance.attachments && selectedGrievance.attachments.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Supporting Attachments from Citizen
                </label>
                <div className="flex flex-wrap gap-2">
                  {selectedGrievance.attachments.map((att) => (
                    <a
                      key={att.id}
                      href={att.file_path}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium border border-slate-200 transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>{att.original_name}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* SUBMIT ACTION TAKEN REPORT (ATR) FORM */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-emerald-50/70 to-white border-2 border-emerald-300 space-y-4">
              <h3 className="font-bold text-sm text-emerald-950 flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-emerald-700" />
                <span>Submit Official Action Taken Report (ATR)</span>
              </h3>

              <form onSubmit={handleSubmitAtr} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Action Taken Report (Remedial work conducted on site) *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={atrText}
                    onChange={(e) => setAtrText(e.target.value)}
                    placeholder="Describe specific field action taken (e.g. 500m bituminous patching completed; 160 kVA transformer installed; pipeline welded and supply restored; 150 anti-venom vials stocked in hospital)..."
                    className="w-full p-3 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  ></textarea>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="mark_resolved"
                    checked={markResolved}
                    onChange={(e) => setMarkResolved(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-slate-300"
                  />
                  <label htmlFor="mark_resolved" className="text-xs font-bold text-slate-800 cursor-pointer">
                    Mark grievance as fully "Resolved" and submit final report to CMO
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submittingAtr}
                  className="px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors shadow-xs"
                >
                  {submittingAtr ? 'Submitting ATR...' : 'Submit Action Taken Report to CMO'}
                </button>
              </form>
            </div>

            {/* Update Progress Status without closing */}
            <div className="gov-card p-4 space-y-3 bg-slate-50">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900">
                Acknowledge / Update Investigation Status
              </h4>
              <form onSubmit={handleUpdateStatus} className="flex flex-col sm:flex-row gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                >
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>

                <input
                  type="text"
                  value={statusRemarks}
                  onChange={(e) => setStatusRemarks(e.target.value)}
                  placeholder="Officer remarks (e.g. Squad dispatched to site)..."
                  className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />

                <button
                  type="submit"
                  disabled={submittingStatus}
                  className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors shrink-0"
                >
                  {submittingStatus ? 'Saving...' : 'Update Progress'}
                </button>
              </form>
            </div>

            {/* History timeline */}
            <div className="space-y-3 pt-2 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Grievance Audit Trail</h3>
              <LifecycleTimeline history={selectedGrievance.history || []} />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedGrievance(null)}
                className="px-5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close Workstation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
