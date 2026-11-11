import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LifecycleTimeline from '../../components/common/LifecycleTimeline';
import { 
  Send, Search, Clock, CheckCircle2, RotateCcw, AlertCircle, 
  Eye, Star, FileText, Download, X, MessageSquare, ChevronRight, Filter
} from 'lucide-react';

export default function CitizenDashboard() {
  const { user } = useAuth();
  const [grievances, setGrievances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Selected grievance for modal view
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  // Feedback State
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackComments, setFeedbackComments] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  // Reopen State
  const [showReopenBox, setShowReopenBox] = useState(false);
  const [reopenRemarks, setReopenRemarks] = useState('');
  const [submittingReopen, setSubmittingReopen] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  const loadGrievances = async () => {
    try {
      setLoading(true);
      const res = await api.get('/grievances');
      if (res.data.success) {
        setGrievances(res.data.grievances);
      }
    } catch (err) {
      console.error('Failed to load citizen grievances:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGrievances();
  }, []);

  // Open detail modal & fetch full history
  const handleOpenDetails = async (g) => {
    setLoadingDetails(true);
    setSelectedGrievance(g);
    setShowReopenBox(false);
    setFeedbackSuccess('');
    setActionNotice('');

    try {
      const res = await api.get(`/grievances/${g.id}`);
      if (res.data.success) {
        setSelectedGrievance(res.data.grievance);
        if (res.data.grievance.feedback) {
          setFeedbackRating(res.data.grievance.feedback.rating);
          setFeedbackComments(res.data.grievance.feedback.comments || '');
        }
      }
    } catch (err) {
      console.error('Failed to load grievance details:', err);
    } finally {
      setLoadingDetails(false);
    }
  };

  // Submit Feedback
  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedGrievance) return;
    setSubmittingFeedback(true);
    try {
      const res = await api.post(`/grievances/${selectedGrievance.id}/feedback`, {
        rating: feedbackRating,
        comments: feedbackComments
      });
      if (res.data.success) {
        setFeedbackSuccess('Feedback submitted successfully! Thank you for rating the service.');
        // Refresh details
        handleOpenDetails(selectedGrievance);
        loadGrievances();
      }
    } catch (err) {
      setActionNotice(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  // Reopen Grievance
  const handleReopen = async (e) => {
    e.preventDefault();
    if (!selectedGrievance || !reopenRemarks.trim()) return;
    setSubmittingReopen(true);
    try {
      const res = await api.post(`/grievances/${selectedGrievance.id}/reopen`, {
        remarks: reopenRemarks
      });
      if (res.data.success) {
        setActionNotice('Grievance has been reopened and escalated to the CMO for expedited review.');
        setShowReopenBox(false);
        setReopenRemarks('');
        handleOpenDetails(selectedGrievance);
        loadGrievances();
      }
    } catch (err) {
      setActionNotice(err.response?.data?.message || 'Failed to reopen grievance.');
    } finally {
      setSubmittingReopen(false);
    }
  };

  // Compute summary metrics
  const totalCount = grievances.length;
  const resolvedCount = grievances.filter(g => g.status === 'Resolved').length;
  const inProgressCount = grievances.filter(g => g.status === 'In Progress').length;
  const pendingCount = grievances.filter(g => ['Submitted', 'Under Review', 'Reopened'].includes(g.status)).length;

  const filteredGrievances = grievances.filter(g => {
    const matchesSearch = 
      g.reference_id.toLowerCase().includes(search.toLowerCase()) ||
      g.subject.toLowerCase().includes(search.toLowerCase()) ||
      g.category.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter ? g.status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Citizen Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Welcome, {user?.name}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Registered District: <strong>{user?.district || 'Kerala'}</strong> | Track and manage your grievances directly with the Chief Minister's Office.
          </p>
        </div>

        <Link
          to="/citizen/submit"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md transition-all self-start sm:self-auto"
        >
          <Send className="w-4 h-4" />
          <span>Submit New Grievance</span>
        </Link>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gov-card p-5 border-l-4 border-l-slate-600">
          <span className="text-xs font-medium text-slate-500 block">Total Submitted</span>
          <strong className="text-2xl font-extrabold text-slate-900 mt-1 block">
            {totalCount}
          </strong>
          <span className="text-[11px] text-slate-400">All registered complaints</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-amber-500">
          <span className="text-xs font-medium text-slate-500 block">Under Review / Pending</span>
          <strong className="text-2xl font-extrabold text-amber-700 mt-1 block">
            {pendingCount}
          </strong>
          <span className="text-[11px] text-amber-600/80">Awaiting CMO / Dept routing</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-indigo-500">
          <span className="text-xs font-medium text-slate-500 block">In Progress</span>
          <strong className="text-2xl font-extrabold text-indigo-700 mt-1 block">
            {inProgressCount}
          </strong>
          <span className="text-[11px] text-indigo-600/80">Active field investigation</span>
        </div>

        <div className="gov-card p-5 border-l-4 border-l-emerald-600">
          <span className="text-xs font-medium text-slate-500 block">Resolved</span>
          <strong className="text-2xl font-extrabold text-emerald-700 mt-1 block">
            {resolvedCount}
          </strong>
          <span className="text-[11px] text-emerald-600/80">ATR certified on ground</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="gov-card p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Ref ID, Subject, or Category..."
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

      {/* Grievances List Table */}
      <div className="gov-card overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-900 text-base">
            Your Registered Grievances ({filteredGrievances.length})
          </h2>
        </div>

        {loading ? (
          <div className="p-12 text-center text-slate-400 text-sm">Loading your grievance records...</div>
        ) : filteredGrievances.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-semibold text-slate-700 text-sm">No grievances found</h3>
            <p className="text-xs text-slate-400">You haven't filed any grievances yet, or no items match your search filter.</p>
            <Link
              to="/citizen/submit"
              className="inline-block px-4 py-2 text-xs font-bold rounded-lg bg-emerald-700 text-white hover:bg-emerald-800 transition-colors mt-2"
            >
              Submit Your First Grievance
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Reference ID</th>
                  <th className="py-3 px-4">Subject & Details</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date Filed</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredGrievances.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                      {g.reference_id}
                    </td>

                    <td className="py-3.5 px-4 max-w-xs sm:max-w-md">
                      <div className="font-semibold text-slate-900 line-clamp-1">{g.subject}</div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        {g.district} • {g.category}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700">
                      {g.department_name || <span className="text-slate-400 italic">Pending Assignment</span>}
                    </td>

                    <td className="py-3.5 px-4">
                      <PriorityBadge priority={g.priority} />
                    </td>

                    <td className="py-3.5 px-4">
                      <StatusBadge status={g.status} />
                    </td>

                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {g.created_at ? new Date(g.created_at).toLocaleDateString('en-IN') : 'Recent'}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => handleOpenDetails(g)}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-semibold text-xs border border-emerald-200 transition-colors cursor-pointer"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>View Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Grievance Details Modal */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setSelectedGrievance(null)}
              className="absolute right-4 top-4 p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="border-b border-slate-100 pb-4 space-y-2">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-sm font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200">
                  {selectedGrievance.reference_id}
                </span>
                <StatusBadge status={selectedGrievance.status} />
                <PriorityBadge priority={selectedGrievance.priority} />
                {selectedGrievance.is_escalated === 1 && (
                  <span className="text-xs font-bold text-rose-700 bg-rose-50 px-2 py-0.5 rounded border border-rose-200">
                    Escalated
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{selectedGrievance.subject}</h2>
              <p className="text-xs text-slate-500">
                District: <strong>{selectedGrievance.district}</strong> | Category: <strong>{selectedGrievance.category}</strong> | Assigned: <strong>{selectedGrievance.department_name || 'Pending CMO Routing'}</strong>
              </p>
            </div>

            {actionNotice && (
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionNotice}</span>
              </div>
            )}

            {/* Complaint Description */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Detailed Complaint
              </label>
              <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line">
                {selectedGrievance.description}
              </p>
            </div>

            {/* AI Assistant Summary (if available) */}
            {selectedGrievance.ai_summary && (
              <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                <span className="font-semibold text-amber-900 block">AI Executive Summary:</span>
                <p className="text-slate-700 italic">{selectedGrievance.ai_summary}</p>
              </div>
            )}

            {/* Attachments (if any) */}
            {selectedGrievance.attachments && selectedGrievance.attachments.length > 0 && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Uploaded Supporting Attachments
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

            {/* Action Taken Report (ATR) */}
            {selectedGrievance.action_taken_report && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <span className="font-bold text-xs text-emerald-900 uppercase tracking-wider block">
                  Official Action Taken Report (ATR) from Department:
                </span>
                <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-emerald-100 leading-relaxed whitespace-pre-line">
                  {selectedGrievance.action_taken_report}
                </p>
                {selectedGrievance.resolved_at && (
                  <p className="text-[11px] text-emerald-800 font-medium pt-1">
                    Certified resolved on: {new Date(selectedGrievance.resolved_at).toLocaleString('en-IN')}
                  </p>
                )}
              </div>
            )}

            {/* Citizen Feedback Section (when Resolved) */}
            {selectedGrievance.status === 'Resolved' && (
              <div className="gov-card p-5 bg-slate-50/80 border border-slate-200 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>Citizen Feedback & Quality Rating</span>
                  </span>
                  {!showReopenBox && (
                    <button
                      type="button"
                      onClick={() => setShowReopenBox(true)}
                      className="text-xs font-semibold text-rose-700 hover:underline"
                    >
                      Not satisfied? Reopen Grievance
                    </button>
                  )}
                </div>

                {feedbackSuccess ? (
                  <div className="p-3 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-medium">
                    {feedbackSuccess}
                  </div>
                ) : (
                  <form onSubmit={handleSubmitFeedback} className="space-y-3">
                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Rate the Redressal Experience (1 to 5 Stars):
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setFeedbackRating(star)}
                            className="p-1 focus:outline-hidden"
                          >
                            <Star
                              className={`w-6 h-6 transition-colors ${
                                star <= feedbackRating
                                  ? 'text-amber-400 fill-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-2">
                          {feedbackRating} / 5 Stars
                        </span>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-slate-600 block mb-1">
                        Remarks / Verification Comments:
                      </label>
                      <textarea
                        rows={2}
                        value={feedbackComments}
                        onChange={(e) => setFeedbackComments(e.target.value)}
                        placeholder="Share your thoughts on the resolution provided on ground..."
                        className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingFeedback}
                      className="px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                    >
                      {submittingFeedback ? 'Saving Feedback...' : 'Submit Official Rating'}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* Reopen Box (Mandatory workflow) */}
            {showReopenBox && selectedGrievance.status === 'Resolved' && (
              <div className="p-5 rounded-xl bg-rose-50 border border-rose-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-rose-900 uppercase tracking-wider flex items-center gap-1.5">
                    <RotateCcw className="w-4 h-4 text-rose-600" />
                    <span>Reopen Grievance for Expedited CMO Action</span>
                  </span>
                  <button
                    onClick={() => setShowReopenBox(false)}
                    className="text-xs text-slate-400 hover:text-slate-600"
                  >
                    Cancel
                  </button>
                </div>
                <p className="text-xs text-rose-800">
                  Please detail why the department's action was incomplete or defective. The grievance will be escalated back to the Chief Minister Office.
                </p>
                <form onSubmit={handleReopen} className="space-y-3">
                  <textarea
                    rows={3}
                    required
                    value={reopenRemarks}
                    onChange={(e) => setReopenRemarks(e.target.value)}
                    placeholder="Specify the deficiency on ground (e.g. road was only filled with mud instead of bitumen; pipe is still leaking)..."
                    className="w-full p-2.5 text-xs border border-rose-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-hidden bg-white"
                  ></textarea>

                  <button
                    type="submit"
                    disabled={submittingReopen}
                    className="px-5 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs transition-colors shadow-xs"
                  >
                    {submittingReopen ? 'Reopening...' : 'Confirm Reopening of Grievance'}
                  </button>
                </form>
              </div>
            )}

            {/* Complete Milestone Lifecycle Timeline */}
            <div className="space-y-4 pt-2">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                Complete Lifecycle Milestone History
              </h3>
              <LifecycleTimeline history={selectedGrievance.history || []} />
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedGrievance(null)}
                className="px-5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
