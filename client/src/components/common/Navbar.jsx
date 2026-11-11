import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Shield, Send, Search, User, LogOut, Menu, X, 
  ChevronDown, LayoutDashboard, Building2, HelpCircle, PhoneCall, Info
} from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'cmo_admin') return '/cmo/dashboard';
    if (user.role === 'officer') return '/officer/dashboard';
    return '/citizen/dashboard';
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Tricolor / State Government Ribbon */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white text-xs py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-semibold tracking-wide">GOVERNMENT OF KERALA</span>
            <span className="text-emerald-300">|</span>
            <span className="hidden sm:inline text-emerald-100">Chief Minister's Office (CMO)</span>
          </div>
          <div className="flex items-center gap-4 text-emerald-100 text-[11px]">
            <span className="hidden md:inline">24x7 Citizen Helpline: <strong className="text-white">1076</strong> / 1800-425-1076</span>
            <span className="bg-emerald-900/60 px-2 py-0.5 rounded text-amber-300 font-medium border border-emerald-600/50">
              Recruitment Prototype
            </span>
          </div>
        </div>
      </div>

      {/* Main Branding Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Portal Identity */}
          <Link to="/" className="flex items-center gap-3.5 group">
            {/* Kerala Emblem Styled Seal */}
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 flex items-center justify-center text-white shadow-md ring-2 ring-emerald-500/20 group-hover:scale-105 transition-transform">
              <Shield className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-700 transition-colors">
                  CM-PGRP
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-200">
                  Kerala
                </span>
              </div>
              <p className="text-xs font-semibold text-slate-600 hidden sm:block">
                Chief Minister's Public Grievance Redressal Portal
              </p>
              <p className="text-[10px] text-emerald-800 font-medium font-['Manjari',sans-serif]">
                മുഖ്യമന്ത്രിയുടെ പൊതുജന പരാതി പരിഹാര പോർട്ടൽ
              </p>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </Link>
            <Link
              to="/about"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/about') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              About Us
            </Link>
            <Link
              to="/how-it-works"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/how-it-works') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              How It Works
            </Link>
            <Link
              to="/departments"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/departments') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Departments
            </Link>
            <Link
              to="/track"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/track') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Track Status
            </Link>
            <Link
              to="/contact"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/contact') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Contact Us
            </Link>
            <Link
              to="/faq"
              className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                isActive('/faq') ? 'text-emerald-700 bg-emerald-50 font-semibold' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              FAQ
            </Link>
          </nav>

          {/* User & Action Buttons */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to={getDashboardPath()}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition-colors"
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                  {user.role === 'cmo_admin' ? 'CMO Dashboard' : user.role === 'officer' ? 'Officer Queue' : 'My Dashboard'}
                </Link>

                {user.role === 'citizen' && (
                  <Link
                    to="/citizen/submit"
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold bg-emerald-700 text-white shadow-sm hover:bg-emerald-800 transition-colors"
                  >
                    <Send className="w-4 h-4" />
                    Submit Grievance
                  </Link>
                )}

                <div className="relative group">
                  <button 
                    onClick={handleLogout}
                    title="Logout" 
                    className="p-2 text-slate-500 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/track"
                  className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  <Search className="w-4 h-4 text-slate-500" />
                  Track Grievance
                </Link>
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Login
                </Link>
                <Link
                  to="/citizen/submit"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-emerald-700 to-emerald-800 text-white shadow-sm hover:from-emerald-800 hover:to-emerald-900 transition-all hover:shadow"
                >
                  <Send className="w-4 h-4" />
                  Submit Grievance
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium rounded-md text-slate-800 hover:bg-slate-100"
          >
            Home
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium rounded-md text-slate-800 hover:bg-slate-100"
          >
            About Us
          </Link>
          <Link
            to="/how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium rounded-md text-slate-800 hover:bg-slate-100"
          >
            How It Works
          </Link>
          <Link
            to="/departments"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium rounded-md text-slate-800 hover:bg-slate-100"
          >
            Departments
          </Link>
          <Link
            to="/track"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium rounded-md text-slate-800 hover:bg-slate-100"
          >
            Track Status
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium rounded-md text-slate-800 hover:bg-slate-100"
          >
            Contact Us
          </Link>
          <Link
            to="/faq"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-medium rounded-md text-slate-800 hover:bg-slate-100"
          >
            FAQ
          </Link>

          <div className="pt-4 border-t border-slate-100 space-y-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200"
                >
                  Go to Dashboard ({user.role})
                </Link>
                {user.role === 'citizen' && (
                  <Link
                    to="/citizen/submit"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-700 text-white"
                  >
                    Submit Grievance
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="block w-full text-center px-4 py-2.5 rounded-lg text-sm font-medium text-rose-700 bg-rose-50"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center px-4 py-2.5 rounded-lg text-sm font-semibold bg-emerald-700 text-white"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
