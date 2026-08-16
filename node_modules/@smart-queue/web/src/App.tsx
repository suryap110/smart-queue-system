import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SidebarLayout } from './components/SidebarLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AuthPage } from './pages/AuthPage';
import { MasterDashboardPage } from './pages/MasterDashboardPage';
import { KioskPage } from './pages/KioskPage';
import { LiveTokenPage } from './pages/LiveTokenPage';
import { DisplayBoardPage } from './pages/DisplayBoardPage';
import { DoctorConsolePage } from './pages/DoctorConsolePage';
import { AdminDashboard } from './pages/AdminDashboard';
import { DepartmentsPage } from './pages/DepartmentsPage';
import { AuditLogsPage } from './pages/AuditLogsPage';
import { TriageVitalsPage } from './pages/TriageVitalsPage';
import { TeleOPDPage } from './pages/TeleOPDPage';
import { PatientPortalPage } from './pages/PatientPortalPage';
import { KioskFleetPage } from './pages/KioskFleetPage';
import { SurgeCommandPage } from './pages/SurgeCommandPage';
import { FeedbackPage } from './pages/FeedbackPage';
import { ProfilePage } from './pages/ProfilePage';
import { HospitalCrowdTrackerPage } from './pages/HospitalCrowdTrackerPage';

const queryClient = new QueryClient();

export const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <SidebarLayout>
          <Routes>
            {/* Auth Landing Page */}
            <Route path="/" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage />} />

            {/* Master Command Dashboard */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <MasterDashboardPage />
                </ProtectedRoute>
              }
            />

            {/* Public Citizen & Patient Routes */}
            <Route path="/kiosk" element={<KioskPage />} />
            <Route path="/patient-portal" element={<PatientPortalPage />} />
            <Route path="/track/:codeOrId" element={<LiveTokenPage />} />
            <Route path="/display" element={<DisplayBoardPage />} />
            <Route path="/crowd-tracker" element={<HospitalCrowdTrackerPage />} />
            <Route path="/feedback" element={<FeedbackPage />} />

            {/* Protected Staff & Clinical Routes */}
            <Route
              path="/triage"
              element={
                <ProtectedRoute allowedRoles={['NURSE', 'DOCTOR', 'ADMIN', 'SUPER_ADMIN']}>
                  <TriageVitalsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/doctor"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR', 'NURSE', 'STAFF', 'ADMIN', 'SUPER_ADMIN']}>
                  <DoctorConsolePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/tele-opd"
              element={
                <ProtectedRoute allowedRoles={['DOCTOR', 'NURSE', 'ADMIN', 'SUPER_ADMIN']}>
                  <TeleOPDPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'HOD']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/departments"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN', 'HOD']}>
                  <DepartmentsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/kiosks"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <KioskFleetPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/surge-command"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <SurgeCommandPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit-logs"
              element={
                <ProtectedRoute allowedRoles={['ADMIN', 'SUPER_ADMIN']}>
                  <AuditLogsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </SidebarLayout>
      </BrowserRouter>
    </QueryClientProvider>
  );
};
