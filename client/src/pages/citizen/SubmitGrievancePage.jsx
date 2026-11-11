import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { 
  Send, Sparkles, UploadCloud, AlertCircle, CheckCircle2, 
  Building2, FileText, MapPin, Tag, ShieldAlert, ArrowRight, X
} from 'lucide-react';

const KERALA_DISTRICTS = [
  'Thiruvananthapuram', 'Kollam', 'Pathanamthitta', 'Alappuzha', 'Kottayam',
  'Idukki', 'Ernakulam', 'Thrissur', 'Palakkad', 'Malappuram',
  'Kozhikode', 'Wayanad', 'Kannur', 'Kasaragod'
];

export default function SubmitGrievancePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    district: 'Thiruvananthapuram',
    taluk: '',
    department_id: '',
    category: '',
    subject: '',
    description: '',
    priority: 'Medium'
  });
  const [file, setFile] = useState(null);

  // AI Assistant State
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiApplied, setAiApplied] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successResult, setSuccessResult] = useState(null);

  useEffect(() => {
    // Load departments
    const loadDepts = async () => {
      try {
        const res = await api.get('/departments');
        if (res.data.success) {
          setDepartments(res.data.departments);
          // Check query params e.g. ?dept=1
          const params = new URLSearchParams(location.search);
          const deptParam = params.get('dept');
          if (deptParam) {
            setFormData(prev => ({ ...prev, department_id: deptParam }));
          }
        }
      } catch (err) {
        console.error('Failed to load departments:', err);
      }
    };
    loadDepts();
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  // AI Analysis Trigger
  const handleRunAiAnalysis = async () => {
    if (!formData.description || formData.description.trim().length < 10) {
      setErrorMsg('Please enter at least a brief description of your issue before running AI analysis.');
      return;
    }

    setErrorMsg('');
    setAiAnalyzing(true);
    setAiResult(null);

    try {
      const res = await api.post('/ai/analyze', {
        description: formData.description,
        subject: formData.subject,
        district: formData.district
      });

      if (res.data.success) {
        setAiResult(res.data.analysis);
      }
    } catch (err) {
      setErrorMsg('AI analysis service temporarily unavailable. You can proceed with manual selection.');
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Apply AI Recommendations
  const handleApplyAi = () => {
    if (!aiResult) return;

    setFormData(prev => ({
      ...prev,
      department_id: aiResult.department?.id ? String(aiResult.department.id) : prev.department_id,
      category: aiResult.category || prev.category,
      priority: aiResult.priority || prev.priority
    }));
    setAiApplied(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      const data = new FormData();
      data.append('district', formData.district);
      data.append('taluk', formData.taluk);
      if (formData.department_id) data.append('department_id', formData.department_id);
      data.append('category', formData.category || 'General Grievance');
      data.append('subject', formData.subject);
      data.append('description', formData.description);
      data.append('priority', formData.priority);

      // Attach AI metadata if analysis was performed
      if (aiResult) {
        if (aiResult.department?.id) data.append('ai_suggested_dept_id', aiResult.department.id);
        data.append('ai_suggested_category', aiResult.category);
        data.append('ai_priority_recommendation', aiResult.priority);
        data.append('ai_confidence', aiResult.confidence);
        data.append('ai_summary', aiResult.summary);
        if (aiResult.duplicateDetection?.isDuplicate) {
          data.append('ai_duplicate_flag', '1');
          data.append('ai_duplicate_ref', aiResult.duplicateDetection.matchedRef || '');
        }
      }

      if (file) {
        data.append('attachment', file);
      }

      const res = await api.post('/grievances', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data.success) {
        setSuccessResult({
          referenceId: res.data.referenceId,
          grievance: res.data.grievance
        });
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Failed to submit grievance. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="py-12 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Page Heading */}
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Citizen Portal
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Submit Public Grievance to CMO
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto">
          Provide your issue details below. Our AI Assistant can analyze your text, recommend the responsible department, and evaluate priority before submission.
        </p>
      </div>

      {/* Success Modal / Banner */}
      {successResult && (
        <div className="gov-card p-6 sm:p-8 bg-emerald-50 border-2 border-emerald-400 text-center space-y-6 shadow-xl animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-extrabold text-emerald-950">
              Grievance Successfully Registered!
            </h2>
            <p className="text-sm text-emerald-800">
              Your petition has been securely transmitted to the Chief Minister's Public Grievance Redressal Cell.
            </p>
          </div>

          {/* Reference ID Showcase */}
          <div className="bg-white p-4 rounded-xl border border-emerald-200 inline-block mx-auto shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block uppercase tracking-wider">
              Your Unique Grievance Reference ID
            </span>
            <strong className="text-2xl sm:text-3xl font-mono font-black text-emerald-700 tracking-wider mt-1 block">
              {successResult.referenceId}
            </strong>
            <span className="text-[11px] text-slate-400 block mt-1">
              Please save this ID for tracking and communication.
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => navigate(`/track?ref=${successResult.referenceId}`)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow transition-colors"
            >
              Track Status Now
            </button>
            <button
              onClick={() => navigate('/citizen/dashboard')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-300 transition-colors"
            >
              Go to My Dashboard
            </button>
          </div>
        </div>
      )}

      {/* Main Submission Form */}
      {!successResult && (
        <form onSubmit={handleSubmit} className="gov-card p-6 sm:p-8 space-y-8 shadow-md">
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong>Submission Notice:</strong>
                <p className="mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {/* Step 1: Location & District */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>1. Location in Kerala</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  District *
                </label>
                <select
                  name="district"
                  value={formData.district}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  required
                >
                  {KERALA_DISTRICTS.map((d) => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Taluk / Village / Locality
                </label>
                <input
                  type="text"
                  name="taluk"
                  value={formData.taluk}
                  onChange={handleChange}
                  placeholder="e.g. Ettumanoor, Meenachil Taluk"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Complaint Details & Live AI Assistant */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>2. Grievance Particulars & AI Assistant</span>
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Subject / Brief Summary of Issue *
              </label>
              <input
                type="text"
                name="subject"
                required
                value={formData.subject}
                onChange={handleChange}
                placeholder="e.g. Severe craters on MC Road near Ettumanoor junction causing accidents"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Detailed Complaint Description *
                </label>
                <button
                  type="button"
                  onClick={handleRunAiAnalysis}
                  disabled={aiAnalyzing}
                  className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-bold rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:from-amber-400 hover:to-amber-500 shadow-xs transition-all cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{aiAnalyzing ? 'Analyzing with AI...' : 'Analyze with AI Grievance Assistant'}</span>
                </button>
              </div>

              <textarea
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Explain the grievance clearly: what happened, exact location, danger to public, duration of issue, etc. Click 'Analyze with AI Grievance Assistant' above to auto-triage."
                className="w-full px-3.5 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              ></textarea>
              <p className="text-[11px] text-slate-500 mt-1">
                Tip: Mention road name, hospital name, or nearby landmarks so officers can quickly dispatch field crews.
              </p>
            </div>

            {/* AI Assistant Output Card */}
            {aiResult && (
              <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50 via-amber-50/50 to-white border-2 border-emerald-300 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-500" />
                    <span className="font-bold text-sm text-slate-900">
                      AI Grievance Assistant Assessment
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold border border-emerald-200">
                      {aiResult.source}
                    </span>
                  </div>
                  
                  {!aiApplied ? (
                    <button
                      type="button"
                      onClick={handleApplyAi}
                      className="px-3 py-1 rounded-lg bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-800 transition-colors shadow-xs"
                    >
                      Apply AI Suggestions
                    </button>
                  ) : (
                    <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Suggestions Applied
                    </span>
                  )}
                </div>

                {/* Duplicate Alert if detected */}
                {aiResult.duplicateDetection?.isDuplicate && (
                  <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
                    <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <strong className="block font-semibold">Potential Duplicate Complaint Detected:</strong>
                      <span>
                        A complaint with {aiResult.duplicateDetection.similarityScore}% text similarity already exists (Ref ID: <strong>{aiResult.duplicateDetection.matchedRef}</strong>). Your grievance will be marked for CMO deduplication review.
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-medium">Suggested Department</span>
                    <strong className="text-slate-900 block mt-0.5">
                      {aiResult.department?.name || 'Department routing pending'}
                    </strong>
                    <span className="text-[10px] text-emerald-700">Code: {aiResult.department?.code}</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-medium">Suggested Category</span>
                    <strong className="text-slate-900 block mt-0.5">{aiResult.category}</strong>
                    <span className="text-[10px] text-slate-500">Confidence: {Math.round(aiResult.confidence * 100)}%</span>
                  </div>

                  <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                    <span className="text-slate-400 block font-medium">Recommended Priority</span>
                    <strong className={`block mt-0.5 font-bold ${
                      aiResult.priority === 'High' ? 'text-rose-700' : aiResult.priority === 'Medium' ? 'text-amber-700' : 'text-slate-700'
                    }`}>
                      {aiResult.priority} Priority
                    </strong>
                    <span className="text-[10px] text-slate-500 truncate block">{aiResult.priorityReason}</span>
                  </div>
                </div>

                {aiResult.summary && (
                  <div className="bg-white/80 p-3 rounded-lg border border-slate-200 text-xs text-slate-700">
                    <strong className="text-slate-900 block font-semibold mb-1">Executive Summary for CMO:</strong>
                    <p className="italic">{aiResult.summary}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Step 3: Department, Category & Priority Selection */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>3. Department & Priority Assignment</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Department
                </label>
                <select
                  name="department_id"
                  value={formData.department_id}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                >
                  <option value="">Let CMO Assign Automatically</option>
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.code} - {d.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  placeholder="e.g. Pothole Repair"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                >
                  <option value="Low">Low Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="High">High Priority</option>
                </select>
              </div>
            </div>
          </div>

          {/* Step 4: Supporting Attachment */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-emerald-600" />
              <span>4. Supporting Document / Image (Optional)</span>
            </h3>

            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-6 text-center space-y-2 bg-slate-50/50 transition-colors">
              <UploadCloud className="w-8 h-8 text-slate-400 mx-auto" />
              <div className="text-xs text-slate-600">
                <label className="font-semibold text-emerald-700 hover:text-emerald-800 cursor-pointer">
                  <span>Click to browse</span>
                  <input
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                    accept=".jpg,.jpeg,.png,.webp,.pdf,.doc,.docx"
                  />
                </label>
                <span> or drag and drop photo / complaint document</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Supports PDF, JPG, PNG, DOC up to 15MB.
              </p>
              {file && (
                <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-medium border border-emerald-200">
                  <span>Selected file: <strong>{file.name}</strong> ({(file.size / 1024).toFixed(1)} KB)</span>
                  <button type="button" onClick={() => setFile(null)} className="text-emerald-700 hover:text-rose-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate('/citizen/dashboard')}
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-8 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow transition-colors flex items-center gap-2"
            >
              {submitting ? (
                <span>Registering Grievance...</span>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Submit to Chief Minister Office</span>
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
