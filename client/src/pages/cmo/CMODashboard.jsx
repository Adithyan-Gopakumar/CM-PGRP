import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import PriorityBadge from '../../components/common/PriorityBadge';
import LifecycleTimeline from '../../components/common/LifecycleTimeline';
import { 
  Shield, Search, Filter, AlertTriangle, CheckCircle, Clock, 
  Building2, MapPin, Eye, Forward, Sparkles, Download, 
  RotateCcw, ShieldAlert, BarChart3, ListFilter, Users, Mail, RefreshCw, X
} from 'lucide-react';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
  'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

export default function CMODashboard() {
  const { user } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState('grievances'); // 'grievances' | 'analytics' | 'audit' | 'enquiries'

  // Data States
  const [stats, setStats] = useState(null);
  const [grievances, setGrievances] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [filterEscalated, setFilterEscalated] = useState('');

  // Selected Grievance & Administrative Actions
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');
  const [actionErrorMsg, setActionErrorMsg] = useState('');

  // Forward Modal State
  const [forwardDeptId, setForwardDeptId] = useState('');
  const [forwardRemarks, setForwardRemarks] = useState('');
  const [forwardPriority, setForwardPriority] = useState('High');
  const [submittingForward, setSubmittingForward] = useState(false);

  // Status Change State
  const [newStatus, setNewStatus] = useState('');
  const [statusRemarks, setStatusRemarks] = useState('');
  const [submittingStatus, setSubmittingStatus] = useState(false);

  // Escalation State
  const [escalationReason, setEscalationReason] = useState('');
  const [submittingEscalate, setSubmittingEscalate] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsRes, deptsRes, grievRes, enqRes] = await Promise.allSettled([
        api.get('/cmo/stats'),
        api.get('/departments'),
        api.get('/grievances'),
        api.get('/contact')
      ]);

      if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
        setStats(statsRes.value.data.data);
      }
      if (deptsRes.status === 'fulfilled' && deptsRes.value.data.success) {
        setDepartments(deptsRes.value.data.departments);
      }
      if (grievRes.status === 'fulfilled' && grievRes.value.data.success) {
        setGrievances(grievRes.value.data.grievances);
      }
      if (enqRes.status === 'fulfilled' && enqRes.value.data.success) {
        setEnquiries(enqRes.value.data.enquiries);
      }
    } catch (err) {
      console.error('Failed to load CMO dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenGrievance = async (g) => {
    setSelectedGrievance(g);
    setActionSuccessMsg('');
    setActionErrorMsg('');
    setNewStatus(g.status);
    setForwardDeptId(g.department_id ? String(g.department_id) : '');
    setForwardPriority(g.priority || 'Medium');

    try {
      const res = await api.get(`/grievances/${g.id}`);
      if (res.data.success) {
        setSelectedGrievance(res.data.grievance);
      }
    } catch (err) {
      console.error('Failed to load full grievance details:', err);
    }
  };

  // 1. Forward to Department
  const handleForward = async (e) => {
    e.preventDefault();
    if (!selectedGrievance || !forwardDeptId) return;
    setSubmittingForward(true);
    setActionSuccessMsg('');
    setActionErrorMsg('');

    try {
      const res = await api.post(`/grievances/${selectedGrievance.id}/forward`, {
        department_id: forwardDeptId,
        remarks: forwardRemarks || 'Forwarded by CMO for priority investigation.',
        priority: forwardPriority
      });

      if (res.data.success) {
        setActionSuccessMsg(`Grievance successfully assigned to ${res.data.department.name}.`);
        setForwardRemarks('');
        fetchData();
        // reload current
        handleOpenGrievance({ ...selectedGrievance, department_id: forwardDeptId, department_name: res.data.department.name });
      }
    } catch (err) {
      setActionErrorMsg(err.response?.data?.message || 'Failed to forward grievance.');
    } finally {
      setSubmittingForward(false);
    }
  };

  // 2. Update Status
  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedGrievance || !newStatus) return;
    setSubmittingStatus(true);
    setActionSuccessMsg('');
    setActionErrorMsg('');

    try {
      const res = await api.patch(`/grievances/${selectedGrievance.id}/status`, {
        status: newStatus,
        remarks: statusRemarks
      });

      if (res.data.success) {
        setActionSuccessMsg(`Status successfully transitioned to '${newStatus}'.`);
        setStatusRemarks('');
        fetchData();
        handleOpenGrievance(res.data.grievance);
      }
    } catch (err) {
      setActionErrorMsg(err.response?.data?.message || 'Failed to update status.');
    } finally {
      setSubmittingStatus(false);
    }
  };

  // 3. Toggle Escalation
  const handleToggleEscalation = async () => {
    if (!selectedGrievance) return;
    setSubmittingEscalate(true);
    setActionSuccessMsg('');
    setActionErrorMsg('');

    try {
      const res = await api.post(`/grievances/${selectedGrievance.id}/escalate`, {
        escalation_reason: escalationReason || 'Escalated by CMO Administrator due to urgency / citizen alert.'
      });

      if (res.data.success) {
        setActionSuccessMsg(res.data.message);
        setEscalationReason('');
        fetchData();
        handleOpenGrievance({ ...selectedGrievance, is_escalated: res.data.is_escalated });
      }
    } catch (err) {
      setActionErrorMsg(err.response?.data?.message || 'Failed to update escalation.');
    } finally {
      setSubmittingEscalate(false);
    }
  };

  // Filter grievances
  const filteredGrievances = grievances.filter(g => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = 
      g.reference_id.toLowerCase().includes(q) ||
      g.subject.toLowerCase().includes(q) ||
      g.citizen_name?.toLowerCase().includes(q) ||
      g.description?.toLowerCase().includes(q);

    const matchesDistrict = filterDistrict ? g.district === filterDistrict : true;
    const matchesStatus = filterStatus ? g.status === filterStatus : true;
    const matchesPriority = filterPriority ? g.priority === filterPriority : true;
    const matchesDept = filterDept ? String(g.department_id) === filterDept : true;
    const matchesEscalated = filterEscalated !== '' ? String(g.is_escalated) === filterEscalated : true;

    return matchesSearch && matchesDistrict && matchesStatus && matchesPriority && matchesDept && matchesEscalated;
  });

  const summary = stats?.summary || {
    total: grievances.length,
    pending: grievances.filter(g => g.status !== 'Resolved').length,
    resolved: grievances.filter(g => g.status === 'Resolved').length,
    overdue: 1,
    escalated: grievances.filter(g => g.is_escalated === 1).length,
    resolutionRate: 85
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Dashboard Executive Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              CMO Central Command & Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
            Chief Minister's Office Grievance Console
          </h1>
          <p className="text-xs text-slate-500">
            Administrator: <strong>{user?.name}</strong> | Overseeing public redressal across 14 Kerala districts.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold shadow-xs transition-colors self-start md:self-auto cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Live Data</span>
        </button>
      </div>

      {/* KPI Statistic Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        <div className="gov-card p-4 border-l-4 border-l-slate-700">
          <span className="text-[11px] font-medium text-slate-500 block">Total Petitions</span>
          <strong className="text-2xl font-black text-slate-900 mt-0.5 block">{summary.total}</strong>
          <span className="text-[10px] text-slate-400">All submissions</span>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-sky-500">
          <span className="text-[11px] font-medium text-slate-500 block">Submitted (New)</span>
          <strong className="text-2xl font-black text-sky-700 mt-0.5 block">{summary.submitted || 0}</strong>
          <span className="text-[10px] text-sky-600">Pending initial triage</span>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-indigo-500">
          <span className="text-[11px] font-medium text-slate-500 block">In Progress</span>
          <strong className="text-2xl font-black text-indigo-700 mt-0.5 block">{summary.inProgress || 0}</strong>
          <span className="text-[10px] text-indigo-600">Department action</span>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-emerald-600">
          <span className="text-[11px] font-medium text-slate-500 block">Resolved</span>
          <strong className="text-2xl font-black text-emerald-700 mt-0.5 block">{summary.resolved}</strong>
          <span className="text-[10px] text-emerald-600">{summary.resolutionRate}% resolution rate</span>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-rose-500">
          <span className="text-[11px] font-medium text-slate-500 block">Escalated</span>
          <strong className="text-2xl font-black text-rose-700 mt-0.5 block">{summary.escalated}</strong>
          <span className="text-[10px] text-rose-600">Urgent CMO flag</span>
        </div>

        <div className="gov-card p-4 border-l-4 border-l-amber-500">
          <span className="text-[11px] font-medium text-slate-500 block">Overdue / SLA Alert</span>
          <strong className="text-2xl font-black text-amber-700 mt-0.5 block">{summary.overdue}</strong>
          <span className="text-[10px] text-amber-600">&gt; 7 days pending</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('grievances')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'grievances'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ListFilter className="w-4 h-4" />
          <span>Grievance Master Queue ({filteredGrievances.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>District & Department Analytics</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`pb-3 px-3 transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'enquiries'
              ? 'border-emerald-700 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Public Enquiries ({enquiries.length})</span>
        </button>
      </div>

      {/* TAB 1: GRIEVANCES MASTER QUEUE */}
      {activeTab === 'grievances' && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="gov-card p-4 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
              {/* Search input */}
              <div className="lg:col-span-2 relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search Ref ID, Subject, Citizen..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              {/* District filter */}
              <div>
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                >
                  <option value="">All 14 Districts</option>
                  {KERALA_DISTRICTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              {/* Status filter */}
              <div>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                >
                  <option value="">All Statuses</option>
                  <option value="Submitted">Submitted</option>
                  <option value="Under Review">Under Review</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Reopened">Reopened</option>
                </select>
              </div>

              {/* Priority filter */}
              <div>
                <select
                  value={filterPriority}
                  onChange={(e) => setFilterPriority(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                >
                  <option value="">All Priorities</option>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              {/* Escalated filter */}
              <div>
                <select
                  value={filterEscalated}
                  onChange={(e) => setFilterEscalated(e.target.value)}
                  className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:outline-hidden"
                >
                  <option value="">All Escalation States</option>
                  <option value="1">Escalated Only</option>
                  <option value="0">Normal</option>
                </select>
              </div>
            </div>

            {/* Clear filters shortcut */}
            {(searchTerm || filterDistrict || filterStatus || filterPriority || filterDept || filterEscalated) && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm('');
                    setFilterDistrict('');
                    setFilterStatus('');
                    setFilterPriority('');
                    setFilterDept('');
                    setFilterEscalated('');
                  }}
                  className="text-xs text-rose-600 hover:underline font-semibold"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Grievances Table */}
          <div className="gov-card overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Ref ID</th>
                    <th className="py-3 px-4">Citizen & District</th>
                    <th className="py-3 px-4">Subject & Description</th>
                    <th className="py-3 px-4">Assigned Dept</th>
                    <th className="py-3 px-4">Priority</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Flags</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredGrievances.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="p-8 text-center text-slate-400">
                        No grievances match the specified filter criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredGrievances.map((g) => (
                      <tr key={g.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800 whitespace-nowrap">
                          {g.reference_id}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="font-semibold text-slate-900">{g.citizen_name || 'Citizen'}</div>
                          <div className="text-[11px] text-slate-500">{g.district}</div>
                        </td>

                        <td className="py-3 px-4 max-w-xs">
                          <div className="font-medium text-slate-900 line-clamp-1">{g.subject}</div>
                          <div className="text-[11px] text-slate-500 line-clamp-1">{g.description}</div>
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          {g.department_name ? (
                            <span className="font-semibold text-slate-800">{g.department_code}</span>
                          ) : (
                            <span className="text-amber-600 font-medium">Unassigned</span>
                          )}
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <PriorityBadge priority={g.priority} />
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <StatusBadge status={g.status} />
                        </td>

                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex items-center gap-1">
                            {g.is_escalated === 1 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                                Escalated
                              </span>
                            )}
                            {g.ai_duplicate_flag === 1 && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300" title="Possible duplicate">
                                Duplicate?
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <button
                            onClick={() => handleOpenGrievance(g)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Review</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DISTRICT & DEPARTMENT ANALYTICS */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-8">
          {/* District Breakdown Table */}
          <div className="gov-card p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
              District-Wise Grievance Distribution (All 14 Kerala Districts)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">District</th>
                    <th className="py-2.5 px-4">Total Submissions</th>
                    <th className="py-2.5 px-4">Resolved</th>
                    <th className="py-2.5 px-4">Pending</th>
                    <th className="py-2.5 px-4">High Priority</th>
                    <th className="py-2.5 px-4">Resolution Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.districtStats.map((item, idx) => {
                    const rate = item.total > 0 ? Math.round((item.resolved / item.total) * 100) : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50">
                        <td className="py-3 px-4 font-semibold text-slate-900">{item.district}</td>
                        <td className="py-3 px-4 font-bold text-slate-800">{item.total}</td>
                        <td className="py-3 px-4 text-emerald-700 font-bold">{item.resolved}</td>
                        <td className="py-3 px-4 text-amber-700 font-bold">{item.pending}</td>
                        <td className="py-3 px-4">
                          {item.highPriority > 0 ? (
                            <span className="text-rose-600 font-bold">{item.highPriority} Urgent</span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 w-48">
                          <div className="flex items-center gap-2">
                            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                              <div
                                className="bg-emerald-600 h-2 rounded-full"
                                style={{ width: `${rate}%` }}
                              ></div>
                            </div>
                            <span className="text-[11px] font-bold text-slate-700 w-8">{rate}%</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Department Breakdown Table */}
          <div className="gov-card p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
              Departmental Resolution Performance
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {stats.departmentStats.map((dept) => (
                <div key={dept.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                      {dept.code}
                    </span>
                    <span className="text-xs font-bold text-emerald-700">{dept.resolution_rate}% Resolved</span>
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{dept.name}</h4>
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                    <span>Total Assigned: <strong>{dept.total}</strong></span>
                    <span>Resolved: <strong className="text-emerald-700">{dept.resolved || 0}</strong></span>
                    <span>Pending: <strong className="text-amber-700">{dept.pending || 0}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT ENQUIRIES */}
      {activeTab === 'enquiries' && (
        <div className="gov-card overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900">
              Citizen Enquiries via Public Contact Form
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Citizen Name</th>
                  <th className="py-3 px-4">Contact Info</th>
                  <th className="py-3 px-4">Subject & Message</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-8 text-center text-slate-400">No public enquiries received yet.</td>
                  </tr>
                ) : (
                  enquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50">
                      <td className="py-3 px-4 whitespace-nowrap text-slate-500">
                        {new Date(enq.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{enq.name}</td>
                      <td className="py-3 px-4">
                        <div>{enq.email}</div>
                        {enq.phone && <div className="text-[11px] text-slate-500">{enq.phone}</div>}
                      </td>
                      <td className="py-3 px-4 max-w-md">
                        <div className="font-semibold text-slate-900">{enq.subject}</div>
                        <p className="text-slate-600 text-[11px] mt-0.5 line-clamp-2">{enq.message}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 font-medium text-[11px] border border-emerald-200">
                          {enq.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* GRIEVANCE REVIEW DRAWER / MODAL */}
      {selectedGrievance && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
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
                <span className="font-mono text-base font-extrabold text-emerald-800 bg-emerald-50 px-3 py-0.5 rounded border border-emerald-200">
                  {selectedGrievance.reference_id}
                </span>
                <StatusBadge status={selectedGrievance.status} size="lg" />
                <PriorityBadge priority={selectedGrievance.priority} />
                {selectedGrievance.is_escalated === 1 && (
                  <span className="px-2.5 py-0.5 rounded text-xs font-black bg-rose-100 text-rose-800 border border-rose-300">
                    ESCALATED
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900">{selectedGrievance.subject}</h2>
              <div className="flex flex-wrap gap-4 text-xs text-slate-500">
                <span>Citizen: <strong className="text-slate-800">{selectedGrievance.citizen_name}</strong></span>
                <span>Mobile: <strong className="text-slate-800">{selectedGrievance.citizen_mobile}</strong></span>
                <span>District: <strong className="text-slate-800">{selectedGrievance.district}</strong></span>
                <span>Category: <strong className="text-slate-800">{selectedGrievance.category}</strong></span>
              </div>
            </div>

            {/* Action Feedback Alerts */}
            {actionSuccessMsg && (
              <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-medium">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{actionSuccessMsg}</span>
              </div>
            )}
            {actionErrorMsg && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 font-medium">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{actionErrorMsg}</span>
              </div>
            )}

            {/* Complaint Text */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                Citizen Grievance Description
              </label>
              <p className="text-xs text-slate-800 bg-slate-50 p-4 rounded-xl border border-slate-100 leading-relaxed whitespace-pre-line">
                {selectedGrievance.description}
              </p>
            </div>

            {/* AI Assistant Analysis Panel */}
            {selectedGrievance.ai_summary && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-50/70 to-emerald-50/70 border border-amber-200 text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    <span>AI Assistant Summary & Routing Evaluation</span>
                  </span>
                  <span className="text-[10px] text-slate-500">Confidence: {Math.round((selectedGrievance.ai_confidence || 0.9) * 100)}%</span>
                </div>
                <p className="text-slate-700 italic bg-white/70 p-2.5 rounded border border-amber-100">
                  {selectedGrievance.ai_summary}
                </p>
                {selectedGrievance.ai_duplicate_flag === 1 && (
                  <p className="text-rose-700 font-semibold text-[11px]">
                    Alert: High similarity with previous grievance ({selectedGrievance.ai_duplicate_ref}). Human deduplication required.
                  </p>
                )}
              </div>
            )}

            {/* Attachments if any */}
            {selectedGrievance.attachments && selectedGrievance.attachments.length > 0 && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Supporting Files
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

            {/* Action Taken Report (ATR) from Dept */}
            {selectedGrievance.action_taken_report && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5">
                <span className="font-bold text-xs text-emerald-900 uppercase tracking-wider block">
                  Department Action Taken Report (ATR):
                </span>
                <p className="text-xs text-slate-800 bg-white p-3 rounded-lg border border-emerald-100 leading-relaxed whitespace-pre-line">
                  {selectedGrievance.action_taken_report}
                </p>
              </div>
            )}

            {/* Citizen Feedback (if any) */}
            {selectedGrievance.feedback && (
              <div className="p-3.5 rounded-xl bg-amber-50/50 border border-amber-200 text-xs space-y-1">
                <span className="font-semibold text-amber-900">
                  Citizen Rating: {selectedGrievance.feedback.rating} / 5 Stars
                </span>
                <p className="text-slate-700 italic">"{selectedGrievance.feedback.comments || 'No comment'}"</p>
              </div>
            )}

            {/* ADMINISTRATIVE ACTIONS SECTION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200">
              
              {/* Form 1: Forward to Department */}
              <div className="gov-card p-4 space-y-3 bg-slate-50/50 border-slate-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <Forward className="w-4 h-4 text-emerald-700" />
                  <span>Assign / Forward to Department</span>
                </h4>

                <form onSubmit={handleForward} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Target Department *
                    </label>
                    <select
                      value={forwardDeptId}
                      onChange={(e) => setForwardDeptId(e.target.value)}
                      required
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="">Select Government Department</option>
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.code} - {d.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Set Priority
                    </label>
                    <select
                      value={forwardPriority}
                      onChange={(e) => setForwardPriority(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium</option>
                      <option value="Low">Low</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      CMO Administrative Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={forwardRemarks}
                      onChange={(e) => setForwardRemarks(e.target.value)}
                      placeholder="e.g. Expedite within 24 hours. Submit ATR to CMO cell..."
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingForward}
                    className="w-full py-2 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs transition-colors"
                  >
                    {submittingForward ? 'Routing...' : 'Assign & Forward to Dept'}
                  </button>
                </form>
              </div>

              {/* Form 2: Direct Status Update & Escalation */}
              <div className="gov-card p-4 space-y-3 bg-slate-50/50 border-slate-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-700" />
                  <span>Update Status & Escalation</span>
                </h4>

                <form onSubmit={handleUpdateStatus} className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Workflow Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    >
                      <option value="Submitted">Submitted</option>
                      <option value="Under Review">Under Review</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                      <option value="Reopened">Reopened</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Internal Remarks
                    </label>
                    <textarea
                      rows={2}
                      value={statusRemarks}
                      onChange={(e) => setStatusRemarks(e.target.value)}
                      placeholder="Add official remarks..."
                      className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white"
                    ></textarea>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submittingStatus}
                      className="flex-1 py-2 rounded-lg bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition-colors"
                    >
                      {submittingStatus ? 'Updating...' : 'Update Status'}
                    </button>

                    <button
                      type="button"
                      disabled={submittingEscalate}
                      onClick={handleToggleEscalation}
                      className={`px-3 py-2 rounded-lg font-bold text-xs border transition-colors ${
                        selectedGrievance.is_escalated === 1
                          ? 'bg-rose-50 text-rose-700 border-rose-300 hover:bg-rose-100'
                          : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                      }`}
                    >
                      {selectedGrievance.is_escalated === 1 ? 'De-escalate' : 'Escalate to CMO'}
                    </button>
                  </div>
                </form>
              </div>

            </div>

            {/* Lifecycle History Audit Trail */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Lifecycle Milestone History</h3>
              <LifecycleTimeline history={selectedGrievance.history || []} />
            </div>

            {/* Modal Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setSelectedGrievance(null)}
                className="px-5 py-2 text-xs font-semibold rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
