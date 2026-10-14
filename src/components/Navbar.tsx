import React from 'react';
import { MQLogo } from './MQLogo';
import { LAB_DETAILS } from '../data/defaultTests';
import { 
  Phone, 
  MapPin, 
  Calendar, 
  FileText, 
  Lock,
  Layers,
  Clock, 
  MessageSquare,
  LogOut,
  Share2
} from 'lucide-react';

interface NavbarProps {
  currentView: 'home' | 'ratechart' | 'packages' | 'patient_portal' | 'admin';
  isAdminAuthenticated: boolean;
  onNavigate: (view: 'home' | 'ratechart' | 'packages' | 'patient_portal' | 'admin') => void;
  onOpenBooking: () => void;
  onOpenShare: () => void;
  onAdminClick: () => void;
  onAdminLogout: () => void;
  selectedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  isAdminAuthenticated,
  onNavigate,
  onOpenBooking,
  onOpenShare,
  onAdminClick,
  onAdminLogout,
  selectedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
      {/* Top bar for Contact & Location */}
      <div className="bg-slate-900 text-white text-[11px] py-1.5 px-4 sm:px-8 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Location & Timings */}
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-teal-400 shrink-0" />
              <span>Location: <strong className="text-white">TRISULIA, BARANGA</strong></span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{LAB_DETAILS.timings}</span>
            </span>
          </div>

          {/* Quick Call, WhatsApp & Quick Share */}
          <div className="flex items-center gap-4">
            <button
              onClick={onOpenShare}
              className="flex items-center gap-1 text-cyan-300 hover:text-cyan-200 font-semibold transition"
              title="Share website link or QR code"
            >
              <Share2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Share</span>
            </button>

            <a
              href={`https://wa.me/917504662885?text=Hello%20MQ%20Diagnostic%20Care,%20I%20want%20to%20book%20a%20test%20or%20inquire%20about%20reports.`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            <a
              href={`tel:${LAB_DETAILS.contactNumber}`}
              className="flex items-center gap-1.5 text-cyan-300 hover:text-cyan-200 font-bold"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Call: {LAB_DETAILS.contactNumber}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('home')}
          className="text-left focus:outline-hidden"
        >
          <MQLogo size="md" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-50 p-1 rounded-2xl border border-slate-200 text-xs font-bold text-slate-700">
          <button
            onClick={() => onNavigate('home')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              currentView === 'home'
                ? 'bg-white text-sky-800 shadow-2xs font-extrabold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Home
          </button>

          <button
            onClick={() => onNavigate('ratechart')}
            className={`px-3.5 py-1.5 rounded-xl transition ${
              currentView === 'ratechart'
                ? 'bg-white text-sky-800 shadow-2xs font-extrabold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Rate Chart (27 Tests)
          </button>

          {/* SEPARATE PACKAGE OPTION */}
          <button
            onClick={() => onNavigate('packages')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              currentView === 'packages'
                ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>Health Packages</span>
          </button>

          <button
            onClick={() => onNavigate('patient_portal')}
            className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
              currentView === 'patient_portal'
                ? 'bg-white text-teal-800 shadow-2xs font-extrabold'
                : 'hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-sky-600" />
            <span>Download Reports</span>
          </button>

          {/* SINGLE DEDICATED ADMIN DASHBOARD BUTTON WITH PASSWORD PROTECTION */}
          {currentView === 'admin' && isAdminAuthenticated ? (
            <button
              onClick={onAdminLogout}
              className="px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 bg-red-50 text-red-700 hover:bg-red-100 font-extrabold border border-red-200"
              title="Lock & Exit Admin Dashboard"
            >
              <LogOut className="w-3.5 h-3.5 text-red-600" />
              <span>Exit Admin</span>
            </button>
          ) : (
            <button
              onClick={onAdminClick}
              className={`px-3.5 py-1.5 rounded-xl transition flex items-center gap-1.5 ${
                currentView === 'admin'
                  ? 'bg-slate-900 text-white shadow-xs font-extrabold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Lock className="w-3.5 h-3.5 text-amber-500" />
              <span>Admin Portal</span>
            </button>
          )}
        </nav>

        {/* CTA and Share Buttons */}
        <div className="flex items-center gap-2">
          {/* Share Button for Customers */}
          <button
            onClick={onOpenShare}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl border border-slate-200 transition"
            title="Share website link or QR code"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-600" />
            <span className="hidden sm:inline">Share</span>
          </button>

          <button
            onClick={onOpenBooking}
            className="relative bg-gradient-to-r from-sky-600 via-sky-700 to-teal-700 hover:from-sky-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-md transition flex items-center gap-2 active:scale-95"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Test</span>
            {selectedCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black flex items-center justify-center ml-0.5">
                {selectedCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile navigation tab bar */}
      <div className="md:hidden flex border-t border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 divide-x divide-slate-200">
        <button
          onClick={() => onNavigate('home')}
          className={`flex-1 py-2 text-center ${currentView === 'home' ? 'text-sky-700 bg-white font-black' : ''}`}
        >
          Home
        </button>
        <button
          onClick={() => onNavigate('ratechart')}
          className={`flex-1 py-2 text-center ${currentView === 'ratechart' ? 'text-sky-700 bg-white font-black' : ''}`}
        >
          Rate Chart
        </button>
        <button
          onClick={() => onNavigate('packages')}
          className={`flex-1 py-2 text-center ${currentView === 'packages' ? 'text-teal-700 bg-white font-black' : ''}`}
        >
          Packages
        </button>
        <button
          onClick={() => onNavigate('patient_portal')}
          className={`flex-1 py-2 text-center ${currentView === 'patient_portal' ? 'text-teal-700 bg-white font-black' : ''}`}
        >
          Reports
        </button>
        <button
          onClick={onAdminClick}
          className={`flex-1 py-2 text-center ${currentView === 'admin' ? 'text-amber-700 bg-white font-black' : ''}`}
        >
          Admin
        </button>
      </div>
    </header>
  );
};
