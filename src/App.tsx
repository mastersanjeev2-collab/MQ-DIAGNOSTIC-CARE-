/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeHero } from './components/HomeHero';
import { RateChartView } from './components/RateChartView';
import { PackagesView } from './components/PackagesView';
import { PatientPortal } from './components/PatientPortal';
import { AdminDashboard } from './components/AdminDashboard';
import { AdminLoginModal } from './components/AdminLoginModal';
import { BookingModal } from './components/BookingModal';
import { ReportViewerModal } from './components/ReportViewerModal';
import { ShareModal } from './components/ShareModal';
import { 
  getStoredTests, 
  getStoredPackages,
  getStoredBookings, 
  MQ_DATA_UPDATED_EVENT 
} from './services/storage';
import { TestItem, HealthPackage, DiagnosticBooking } from './types/diagnostic';
import { LAB_DETAILS } from './data/defaultTests';
import { Sparkles } from 'lucide-react';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'ratechart' | 'packages' | 'patient_portal' | 'admin'>('home');
  const [tests, setTests] = useState<TestItem[]>([]);
  const [packages, setPackages] = useState<HealthPackage[]>([]);
  const [bookings, setBookings] = useState<DiagnosticBooking[]>([]);
  const [selectedTestIds, setSelectedTestIds] = useState<string[]>([]);
  
  // Password Protected Admin State
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('mq_admin_authenticated') === 'true';
    }
    return false;
  });
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  // Modals state
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [viewingReportBooking, setViewingReportBooking] = useState<DiagnosticBooking | null>(null);

  // Share Modal state
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareModalMode, setShareModalMode] = useState<'customer' | 'admin'>('customer');
  const [shareModalBooking, setShareModalBooking] = useState<DiagnosticBooking | null>(null);

  // Sync state from storage
  const syncData = () => {
    setTests(getStoredTests());
    setPackages(getStoredPackages());
    setBookings(getStoredBookings());
  };

  useEffect(() => {
    syncData();

    // Listen to custom reactive events fired when tests, packages, or bookings update
    const handleUpdate = () => {
      syncData();
    };

    window.addEventListener(MQ_DATA_UPDATED_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener(MQ_DATA_UPDATED_EVENT, handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleToggleTest = (test: TestItem) => {
    setSelectedTestIds((prev) => {
      if (prev.includes(test.id)) {
        return prev.filter((id) => id !== test.id);
      } else {
        return [...prev, test.id];
      }
    });
  };

  const handleOpenReportModal = (booking: DiagnosticBooking) => {
    setViewingReportBooking(booking);
  };

  const handleBookingCreated = (newBooking: DiagnosticBooking) => {
    // Clear selection after successful booking
    setSelectedTestIds([]);
    // Update booking list
    syncData();
  };

  // Admin access control
  const handleAdminClick = () => {
    if (isAdminAuthenticated) {
      setCurrentView('admin');
    } else {
      setIsAdminLoginOpen(true);
    }
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('mq_admin_authenticated', 'true');
    }
    setIsAdminLoginOpen(false);
    setCurrentView('admin');
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('mq_admin_authenticated');
    }
    setCurrentView('home');
  };

  // Share actions
  const handleOpenCustomerShare = () => {
    setShareModalMode('customer');
    setShareModalBooking(null);
    setIsShareModalOpen(true);
  };

  const handleOpenAdminShare = (mode: 'admin', booking?: DiagnosticBooking) => {
    setShareModalMode(mode);
    setShareModalBooking(booking || null);
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Clean announcement strip */}
      <div className="bg-sky-900 text-sky-100 py-1.5 px-4 text-center text-xs font-medium">
        <span className="inline-flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            <strong>MQ DIAGNOSTIC CARE:</strong> Sample Collection Center at Trisulia, Baranga • Contact: {LAB_DETAILS.contactNumber}
          </span>
        </span>
      </div>

      {/* Main Navbar with Share & Single Admin Portal Button */}
      <Navbar
        currentView={currentView}
        isAdminAuthenticated={isAdminAuthenticated}
        onNavigate={setCurrentView}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenShare={handleOpenCustomerShare}
        onAdminClick={handleAdminClick}
        onAdminLogout={handleAdminLogout}
        selectedCount={selectedTestIds.length}
      />

      {/* Main View Router */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 sm:py-8">
        {/* 1. HOME VIEW */}
        {currentView === 'home' && (
          <HomeHero
            onOpenBooking={() => setIsBookingModalOpen(true)}
            onNavigate={setCurrentView}
          />
        )}

        {/* 2. RATE CHART VIEW (ONE unified official rate chart panel) */}
        {currentView === 'ratechart' && (
          <RateChartView
            tests={tests}
            selectedTestIds={selectedTestIds}
            onToggleTest={handleToggleTest}
            onOpenBooking={() => setIsBookingModalOpen(true)}
          />
        )}

        {/* 3. SEPARATE PACKAGES VIEW */}
        {currentView === 'packages' && (
          <PackagesView
            packages={packages}
            tests={tests}
            selectedTestIds={selectedTestIds}
            onToggleTest={handleToggleTest}
            onOpenBooking={() => setIsBookingModalOpen(true)}
          />
        )}

        {/* 4. PATIENT PORTAL (Track & Download Reports) */}
        {currentView === 'patient_portal' && (
          <PatientPortal
            onOpenReportModal={handleOpenReportModal}
            onOpenBookingModal={() => setIsBookingModalOpen(true)}
          />
        )}

        {/* 5. ADMIN DASHBOARD (Password protected) */}
        {currentView === 'admin' && (
          isAdminAuthenticated ? (
            <AdminDashboard
              bookings={bookings}
              tests={tests}
              packages={packages}
              onOpenReportModal={handleOpenReportModal}
              onLogout={handleAdminLogout}
              onOpenShare={handleOpenAdminShare}
            />
          ) : (
            <div className="max-w-md mx-auto my-12 bg-white rounded-3xl p-8 border border-slate-200 text-center shadow-md">
              <h3 className="font-black text-xl text-slate-900 mb-2">Password Protected</h3>
              <p className="text-xs text-slate-500 mb-6">
                Administrator credentials required to manage laboratory bookings, rate charts, and reports.
              </p>
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="bg-slate-900 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md"
              >
                Enter Password
              </button>
            </div>
          )
        )}
      </main>

      {/* Website & Report Share Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        mode={shareModalMode}
        booking={shareModalBooking}
      />

      {/* Admin Password Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onSuccess={handleAdminLoginSuccess}
      />

      {/* Interactive Booking Modal */}
      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        allTests={tests}
        selectedTestIds={selectedTestIds}
        onToggleTest={handleToggleTest}
        onBookingCreated={handleBookingCreated}
      />

      {/* Report Viewer & Download Modal */}
      <ReportViewerModal
        booking={viewingReportBooking}
        isOpen={Boolean(viewingReportBooking)}
        onClose={() => setViewingReportBooking(null)}
      />

      {/* Global Footer */}
      <Footer
        onNavigate={setCurrentView}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenShare={handleOpenCustomerShare}
      />
    </div>
  );
}
