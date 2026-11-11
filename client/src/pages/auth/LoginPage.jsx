import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Shield, Lock, Mail, User, Building2, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('citizen'); // 'citizen' | 'cmo' | 'officer'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const demoAccounts = {
    citizen: {
      email: 'citizen@kerala.gov.in',
      password: 'Password@123',
      label: 'Citizen Demo (Ananya Nair)'
    },
    cmo: {
      email: 'cmo.admin@kerala.gov.in',
      password: 'Password@123',
      label: 'CMO Administrator (Shri. K. Narayanan)'
    },
    officer: {
      email: 'pwd.officer@kerala.gov.in',
      password: 'Password@123',
      label: 'PWD Executive Engineer (Er. Rajesh Kumar)'
    },
    officer_kwa: {
      email: 'kwa.officer@kerala.gov.in',
      password: 'Password@123',
      label: 'KWA Officer (Er. Mini Varghese)'
    },
    officer_health: {
      email: 'health.officer@kerala.gov.in',
      password: 'Password@123',
      label: 'Health Officer (Dr. Sujatha Pillai)'
    }
  };

  const handleFillDemo = (key) => {
    const acc = demoAccounts[key];
    if (acc) {
      setEmail(acc.email);
      setPassword(acc.password);
      setErrorMsg('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const user = await login(email, password);
      if (user.role === 'cmo_admin') {
        navigate('/cmo/dashboard');
      } else if (user.role === 'officer') {
        navigate('/officer/dashboard');
      } else {
        navigate('/citizen/dashboard');
      }
    } catch (err) {
      setErrorMsg(err.response?.data?.message || err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 max-w-lg mx-auto px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-700 text-white shadow-md">
          <Shield className="w-6 h-6 text-amber-400" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Portal Secure Sign-In
        </h1>
        <p className="text-xs text-slate-500">
          Access the Chief Minister's Public Grievance Redressal Portal
        </p>
      </div>

      {/* Main Login Card */}
      <div className="gov-card p-6 sm:p-8 space-y-6 shadow-lg">
        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('citizen');
              handleFillDemo('citizen');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'citizen'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Citizen
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('cmo');
              handleFillDemo('cmo');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'cmo'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            CMO Admin
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('officer');
              handleFillDemo('officer');
            }}
            className={`py-2 rounded-lg transition-all ${
              activeTab === 'officer'
                ? 'bg-white text-emerald-800 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Dept Officer
          </button>
        </div>

        {/* Demo Credentials Quick-Fill helper for Evaluators */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-3 text-xs space-y-2">
          <div className="flex items-center justify-between text-amber-900 font-semibold">
            <span>Evaluator Quick-Fill:</span>
            <span className="text-[10px] text-amber-700 font-normal">Click to pre-fill</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeTab === 'citizen' && (
              <button
                type="button"
                onClick={() => handleFillDemo('citizen')}
                className="px-2 py-1 rounded bg-white text-amber-900 hover:bg-amber-100 border border-amber-300 font-medium transition-colors"
              >
                Citizen (Ananya)
              </button>
            )}
            {activeTab === 'cmo' && (
              <button
                type="button"
                onClick={() => handleFillDemo('cmo')}
                className="px-2 py-1 rounded bg-white text-amber-900 hover:bg-amber-100 border border-amber-300 font-medium transition-colors"
              >
                CMO Admin (Principal Secy)
              </button>
            )}
            {activeTab === 'officer' && (
              <>
                <button
                  type="button"
                  onClick={() => handleFillDemo('officer')}
                  className="px-2 py-1 rounded bg-white text-amber-900 hover:bg-amber-100 border border-amber-300 font-medium transition-colors"
                >
                  PWD Officer
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('officer_kwa')}
                  className="px-2 py-1 rounded bg-white text-amber-900 hover:bg-amber-100 border border-amber-300 font-medium transition-colors"
                >
                  KWA Water
                </button>
                <button
                  type="button"
                  onClick={() => handleFillDemo('officer_health')}
                  className="px-2 py-1 rounded bg-white text-amber-900 hover:bg-amber-100 border border-amber-300 font-medium transition-colors"
                >
                  Health DMO
                </button>
              </>
            )}
          </div>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@kerala.gov.in"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">
                Password
              </label>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-colors shadow-xs flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Sign In to Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-600">
          <span>Don't have a citizen account? </span>
          <Link to="/register" className="text-emerald-700 font-bold hover:underline">
            Register as Citizen
          </Link>
        </div>
      </div>
    </div>
  );
}
