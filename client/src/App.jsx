import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';

// Public Pages
import HomePage from './pages/public/HomePage';
import AboutUsPage from './pages/public/AboutUsPage';
import HowItWorksPage from './pages/public/HowItWorksPage';
import DepartmentsPage from './pages/public/DepartmentsPage';
import ContactUsPage from './pages/public/ContactUsPage';
import FAQPage from './pages/public/FAQPage';
import TrackGrievancePage from './pages/public/TrackGrievancePage';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Role Dashboards
import CitizenDashboard from './pages/citizen/CitizenDashboard';
import SubmitGrievancePage from './pages/citizen/SubmitGrievancePage';
import CMODashboard from './pages/cmo/CMODashboard';
import OfficerDashboard from './pages/officer/OfficerDashboard';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Navbar />

      <main className="flex-1">
        <Routes>
          {/* Public Website */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/departments" element={<DepartmentsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/track" element={<TrackGrievancePage />} />

          {/* Authentication */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Citizen Routes */}
          <Route
            path="/citizen/dashboard"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <CitizenDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/citizen/submit"
            element={
              <ProtectedRoute allowedRoles={['citizen']}>
                <SubmitGrievancePage />
              </ProtectedRoute>
            }
          />

          {/* CMO Administrator Dashboard */}
          <Route
            path="/cmo/dashboard"
            element={
              <ProtectedRoute allowedRoles={['cmo_admin']}>
                <CMODashboard />
              </ProtectedRoute>
            }
          />

          {/* Department Officer Workstation */}
          <Route
            path="/officer/dashboard"
            element={
              <ProtectedRoute allowedRoles={['officer']}>
                <OfficerDashboard />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}
