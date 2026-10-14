import React from 'react';
import { LAB_DETAILS } from '../data/defaultTests';
import { 
  ShieldCheck, 
  Home as HomeIcon, 
  FileText, 
  ArrowRight, 
  Phone, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  Layers, 
  Activity,
  Sparkles,
  Clock,
  HeartHandshake
} from 'lucide-react';

interface HomeHeroProps {
  onOpenBooking: () => void;
  onNavigate: (view: 'home' | 'ratechart' | 'packages' | 'patient_portal' | 'admin') => void;
}

export const HomeHero: React.FC<HomeHeroProps> = ({
  onOpenBooking,
  onNavigate,
}) => {
  return (
    <div className="space-y-10 pb-6">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-900 via-sky-950 to-slate-950 text-white shadow-2xl border border-sky-800/40 p-6 sm:p-12">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-cyan-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 rounded-full bg-sky-600/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider border border-cyan-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Sample Collection Center • Trisulia, Baranga</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
            Accurate Testing.<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-sky-200">
              Healthier Tomorrow.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-2xl leading-relaxed">
            Welcome to <strong>MQ DIAGNOSTIC CARE</strong>. Your trusted pathology testing laboratory and sample collection center at Trisulia, Baranga. Accurate clinical results, reliable doctors, and doorstep sample collection.
          </p>

          {/* Quick Value Points */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-200 font-semibold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Affordable Rate Chart</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Home Collection Available</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Safe &amp; Sterile Process</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Direct Scanned Reports</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verified by Pathologists</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>All 27 Pathological Tests</span>
            </div>
          </div>

          {/* Primary Action Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBooking}
              className="bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-white font-extrabold text-sm sm:text-base px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center gap-2 group cursor-pointer active:scale-95"
            >
              <Calendar className="w-5 h-5" />
              <span>Book Test / Home Collection</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>

            <button
              onClick={() => onNavigate('ratechart')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-3.5 rounded-2xl border border-white/20 transition flex items-center gap-2"
            >
              <Activity className="w-4 h-4 text-cyan-300" />
              <span>View Official Rate Chart</span>
            </button>

            <button
              onClick={() => onNavigate('packages')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-3.5 rounded-2xl border border-white/20 transition flex items-center gap-2"
            >
              <Layers className="w-4 h-4 text-teal-300" />
              <span>Health Packages</span>
            </button>

            <button
              onClick={() => onNavigate('patient_portal')}
              className="bg-white/10 hover:bg-white/20 text-white font-bold text-sm px-5 py-3.5 rounded-2xl border border-white/20 transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4 text-cyan-300" />
              <span>Download Report</span>
            </button>
          </div>

          {/* Contact Bar */}
          <div className="pt-3 text-xs text-slate-300 flex flex-wrap items-center gap-5 border-t border-white/10">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-cyan-400" />
              <span>Direct Booking: <strong className="text-white">{LAB_DETAILS.contactNumber}</strong></span>
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-teal-400" />
              <span>TRISULIA, BARANGA, ODISHA</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>{LAB_DETAILS.timings}</span>
            </span>
          </div>
        </div>
      </section>

      {/* 3 Core Workflow Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-700 flex items-center justify-center mb-4">
            <Calendar className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
            Step 1
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Book Test Appointment
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Choose single tests or health packages, select your preferred date, and pick between visiting our lab or requesting home sample collection.
          </p>
          <button
            onClick={onOpenBooking}
            className="mt-4 text-xs font-bold text-sky-600 hover:text-sky-800 flex items-center gap-1 hover:underline"
          >
            <span>Book an appointment</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
            <HomeIcon className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-teal-600">
            Step 2
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Safe Sample Collection
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            Our qualified staff ensures 100% sterile vacuum tubes and precise barcoding for error-free sample transport.
          </p>
          <span className="mt-4 text-xs font-bold text-teal-700 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-teal-600" />
            <span>Strict Hygiene Standards</span>
          </span>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs hover:shadow-md transition">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
            <FileText className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            Step 3
          </span>
          <h3 className="text-lg font-bold text-slate-900 mt-1">
            Download Scanned Reports
          </h3>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">
            The administrator directly uploads the official scanned laboratory report to each patient's account for instant viewing and downloading.
          </p>
          <button
            onClick={() => onNavigate('patient_portal')}
            className="mt-4 text-xs font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
          >
            <span>Access Patient Portal</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </section>
    </div>
  );
};
