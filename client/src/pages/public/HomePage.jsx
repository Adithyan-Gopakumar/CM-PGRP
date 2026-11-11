import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { 
  Send, Search, CheckCircle, Clock, Shield, ArrowRight, 
  Building2, Sparkles, AlertCircle, FileText, Users, Award, ChevronRight
} from 'lucide-react';

export default function HomePage() {
  const navigate = useNavigate();
  const [trackRef, setTrackRef] = useState('');
  const [stats, setStats] = useState({
    total: 12480,
    resolved: 11150,
    pending: 1330,
    resolutionRate: 89,
    activeDepartments: 10
  });
  const [featuredDepartments, setFeaturedDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, statsRes] = await Promise.allSettled([
          api.get('/departments'),
          api.get('/cmo/stats') // may fail if unauthenticated, fallback handled
        ]);

        if (deptRes.status === 'fulfilled' && deptRes.value.data.success) {
          setFeaturedDepartments(deptRes.value.data.departments.slice(0, 6));
        }

        if (statsRes.status === 'fulfilled' && statsRes.value.data.success) {
          const s = statsRes.value.data.data.summary;
          setStats({
            total: s.total || 12480,
            resolved: s.resolved || 11150,
            pending: s.pending || 1330,
            resolutionRate: s.resolutionRate || 89,
            activeDepartments: 10
          });
        }
      } catch (err) {
        console.warn('Stats fetch notice:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleTrackSubmit = (e) => {
    e.preventDefault();
    if (trackRef.trim()) {
      navigate(`/track?ref=${encodeURIComponent(trackRef.trim())}`);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden kerala-gradient text-white pt-16 pb-24 lg:pt-20 lg:pb-32">
        {/* Background decorative patterns */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="absolute -right-20 -top-20 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-900/60 border border-emerald-400/30 text-emerald-200 text-xs font-semibold backdrop-blur-xs">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Next-Gen AI-Assisted Citizen Redressal Portal</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Direct Line to the <br />
                <span className="text-amber-400">Chief Minister's Office</span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 leading-relaxed max-w-2xl">
                Every citizen’s voice matters. Submit your grievances concerning roads, water supply, electricity, healthcare, or public services directly to the CMO for expedited resolution and continuous monitoring.
              </p>

              {/* Main Quick Action Cards */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  to="/citizen/submit"
                  className="flex items-center justify-center gap-2.5 px-6 py-4 rounded-xl bg-amber-500 text-slate-950 font-bold text-base shadow-lg hover:bg-amber-400 transition-all transform hover:-translate-y-0.5"
                >
                  <Send className="w-5 h-5 text-slate-950" />
                  <span>Submit a Grievance</span>
                </Link>

                <Link
                  to="/track"
                  className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 text-white font-semibold text-base border border-white/20 backdrop-blur-xs hover:bg-white/20 transition-all"
                >
                  <Search className="w-5 h-5 text-emerald-300" />
                  <span>Track Grievance Status</span>
                </Link>
              </div>

              {/* Quick Search Bar */}
              <div className="pt-4 max-w-lg">
                <form onSubmit={handleTrackSubmit} className="flex items-center bg-white rounded-xl p-1.5 shadow-xl border border-white/30">
                  <div className="pl-3 pr-2 text-slate-400">
                    <Search className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    value={trackRef}
                    onChange={(e) => setTrackRef(e.target.value)}
                    placeholder="Enter Reference ID (e.g. KL-CMO-2026-00101)"
                    className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden py-2"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg transition-colors shrink-0"
                  >
                    Track
                  </button>
                </form>
                <p className="text-xs text-emerald-200/70 mt-2">
                  Sample ID for testing: <button type="button" onClick={() => setTrackRef('KL-CMO-2026-00101')} className="underline text-amber-300 hover:text-white font-mono">KL-CMO-2026-00101</button>
                </p>
              </div>
            </div>

            {/* Right Column: Kerala Emblem & Live Statistics Card */}
            <div className="lg:col-span-5">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 sm:p-8 shadow-2xl space-y-6">
                <div className="flex items-center justify-between border-b border-white/15 pb-4">
                  <div>
                    <h3 className="font-bold text-lg text-white">Live Portal Activity</h3>
                    <p className="text-xs text-emerald-200">Across 14 Districts of Kerala</p>
                  </div>
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-500/20">
                    <span className="text-xs text-emerald-200 font-medium block">Total Submitted</span>
                    <strong className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                      {stats.total.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-300">Registered on Portal</span>
                  </div>

                  <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-500/20">
                    <span className="text-xs text-emerald-200 font-medium block">Resolved</span>
                    <strong className="text-2xl sm:text-3xl font-extrabold text-amber-400 mt-1 block">
                      {stats.resolved.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-300">{stats.resolutionRate}% Success Rate</span>
                  </div>

                  <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-500/20">
                    <span className="text-xs text-emerald-200 font-medium block">Under Action</span>
                    <strong className="text-2xl sm:text-3xl font-extrabold text-sky-300 mt-1 block">
                      {stats.pending.toLocaleString()}
                    </strong>
                    <span className="text-[10px] text-emerald-300">In Dept Investigation</span>
                  </div>

                  <div className="bg-emerald-950/40 rounded-xl p-4 border border-emerald-500/20">
                    <span className="text-xs text-emerald-200 font-medium block">Departments</span>
                    <strong className="text-2xl sm:text-3xl font-extrabold text-white mt-1 block">
                      {stats.activeDepartments}
                    </strong>
                    <span className="text-[10px] text-emerald-300">Connected 24x7</span>
                  </div>
                </div>

                {/* AI Feature Highlight */}
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/30 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                  <div className="text-xs">
                    <strong className="text-amber-200 block font-semibold">AI Grievance Assistant Active</strong>
                    <span className="text-emerald-100">Automatic department routing, priority calculation & duplicate detection built in.</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5-Step Redressal Workflow Lifecycle */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Transparent Governance
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-3">
            How Your Grievance is Handled
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            A step-by-step accountability pipeline ensuring every petition reaches the Chief Minister's desk and assigned department nodal officers without delay.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '01',
              title: 'Citizen Submission',
              desc: 'Enter complaint details online. AI Assistant analyzes urgency & suggests department.',
              icon: FileText
            },
            {
              step: '02',
              title: 'Unique Ref ID',
              desc: 'Instant generation of reference tracking number (e.g. KL-CMO-2026-XXXXX).',
              icon: Award
            },
            {
              step: '03',
              title: 'CMO Review',
              desc: 'Chief Minister’s cell evaluates grievance, adds administrative remarks & forwards to dept.',
              icon: Shield
            },
            {
              step: '04',
              title: 'Officer Action (ATR)',
              desc: 'Department executive engineer/officer investigates on-ground and files Action Taken Report.',
              icon: Building2
            },
            {
              step: '05',
              title: 'Resolution & Feedback',
              desc: 'Citizen receives resolution report and rates the redressal, or reopens if dissatisfied.',
              icon: CheckCircle
            }
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="gov-card p-5 relative flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-emerald-800/20">{item.step}</span>
                    <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center border border-emerald-100">
                      <Icon className="w-5 h-5" />
                    </div>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">{item.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Featured Government Departments */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
              Departmental Redressal Cells
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
              Featured Departments
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Key state public utilities and departments integrated into the Chief Minister's portal.
            </p>
          </div>
          <Link
            to="/departments"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
          >
            <span>View All 10 Departments</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredDepartments.map((dept) => (
            <div key={dept.id} className="gov-card p-6 flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-800 font-mono text-xs font-bold border border-emerald-200">
                    {dept.code}
                  </span>
                  <span className="text-[11px] text-slate-500 font-medium">
                    {dept.resolved_grievances || 0} Resolved
                  </span>
                </div>
                <h3 className="font-bold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
                  {dept.name}
                </h3>
                <p className="text-xs text-emerald-800/80 font-medium font-['Manjari'] mt-1">
                  {dept.name_ml}
                </p>
                <p className="text-xs text-slate-600 mt-3 line-clamp-2 leading-relaxed">
                  {dept.description}
                </p>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 truncate max-w-[200px]">
                  Nodal: {dept.nodal_officer || 'Chief Engineer'}
                </span>
                <Link
                  to={`/citizen/submit?dept=${dept.id}`}
                  className="text-emerald-700 font-semibold hover:underline flex items-center gap-1"
                >
                  File Complaint
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Citizen Guarantee Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-2xl p-8 sm:p-12 shadow-xl border border-slate-800 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl text-center lg:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              Government Accountability
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              Kerala Right to Public Services Commitment
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every complaint is logged with an irreversible audit trail. If any department delays action beyond prescribed turnaround timelines, the grievance is automatically flagged for CMO intervention.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <Link
              to="/citizen/submit"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow transition-colors text-center"
            >
              Submit Grievance Now
            </Link>
            <Link
              to="/faq"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-colors text-center"
            >
              Read FAQs & SLAs
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
