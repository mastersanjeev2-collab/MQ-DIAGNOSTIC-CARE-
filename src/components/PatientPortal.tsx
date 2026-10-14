import React, { useState } from 'react';
import { DiagnosticBooking } from '../types/diagnostic';
import { getStoredBookings } from '../services/storage';
import { LAB_DETAILS } from '../data/defaultTests';
import { 
  Search, 
  FileText, 
  Download, 
  Eye, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Phone, 
  ShieldCheck,
  User,
  ExternalLink,
  Printer,
  Sparkles,
  ArrowRight,
  FileCheck2
} from 'lucide-react';

interface PatientPortalProps {
  onOpenReportModal: (booking: DiagnosticBooking) => void;
  onOpenBookingModal: () => void;
}

export const PatientPortal: React.FC<PatientPortalProps> = ({
  onOpenReportModal,
  onOpenBookingModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchedBooking, setSearchedBooking] = useState<DiagnosticBooking | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleSearch = (e?: React.FormEvent, customQuery?: string) => {
    if (e) e.preventDefault();
    const query = (customQuery !== undefined ? customQuery : searchQuery).trim().toLowerCase();
    
    if (!query) {
      setErrorMessage('Please enter your Booking ID or registered 10-digit mobile number.');
      setSearchedBooking(null);
      setHasSearched(true);
      return;
    }

    setErrorMessage('');
    const allBookings = getStoredBookings();
    
    // Find matching booking
    const found = allBookings.find((b) => {
      const matchId = b.id.toLowerCase() === query;
      const cleanPhone = b.patientPhone.replace(/\D/g, '');
      const cleanQuery = query.replace(/\D/g, '');
      const matchPhone = cleanPhone && cleanQuery && (cleanPhone.endsWith(cleanQuery) || cleanPhone === cleanQuery);
      return matchId || matchPhone;
    });

    if (found) {
      setSearchedBooking(found);
    } else {
      setSearchedBooking(null);
      setErrorMessage(`No appointment or report found for "${query}". Please check your Booking ID or phone number.`);
    }
    setHasSearched(true);
  };

  const handleDirectSampleClick = (id: string) => {
    setSearchQuery(id);
    handleSearch(undefined, id);
  };

  const getTimelineSteps = (status: DiagnosticBooking['status']) => {
    const steps = [
      { key: 'Confirmed', title: 'Booking Confirmed', desc: 'Appointment registered' },
      { key: 'Sample Collected', title: 'Sample Collected', desc: 'Sample arrived at lab' },
      { key: 'Processing', title: 'In Lab Processing', desc: 'Diagnostic analysis running' },
      { key: 'Report Ready', title: 'Report Ready', desc: 'Verified by Pathologist' },
    ];

    const order = ['Pending', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'];
    const currentIdx = order.indexOf(status);

    return steps.map((s, idx) => {
      const stepIdx = order.indexOf(s.key);
      const isCompleted = currentIdx >= stepIdx;
      const isCurrent = currentIdx === stepIdx;

      return {
        ...s,
        isCompleted,
        isCurrent,
      };
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-4 sm:py-8">
      {/* Search Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-sky-950 to-slate-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl border border-slate-800 relative overflow-hidden mb-8">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-sky-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-4 border border-cyan-500/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            Secure Patient Portal
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Download &amp; Track Your Lab Test Reports
          </h2>
          <p className="mt-2 text-slate-300 text-xs sm:text-sm">
            Enter your Booking ID (e.g., <span className="font-mono text-cyan-400 font-bold">MQ-2026-1001</span>) or 10-digit registered mobile number to access your scanned diagnostic report.
          </p>

          {/* Search Form */}
          <form onSubmit={(e) => handleSearch(e)} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-xl mx-auto">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter Booking ID (e.g. MQ-2026-1001) or Mobile Number"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-slate-900 placeholder:text-slate-400 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-cyan-400 transition"
              />
            </div>
            <button
              type="submit"
              className="bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-white font-bold text-sm px-6 py-3.5 rounded-2xl shadow-lg transition flex items-center justify-center gap-2 shrink-0"
            >
              <Search className="w-4 h-4" />
              <span>Track Report</span>
            </button>
          </form>

          {/* Quick Demo Previews */}
          <div className="mt-4 pt-4 border-t border-slate-800 text-xs text-slate-400 flex flex-wrap items-center justify-center gap-2">
            <span className="font-medium">Quick Demo Samples:</span>
            <button
              onClick={() => handleDirectSampleClick('MQ-2026-1001')}
              className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 font-mono text-[11px] font-semibold border border-emerald-500/30 transition"
              title="Has Scanned Report Ready"
            >
              MQ-2026-1001 (Report Ready ✓)
            </button>
            <button
              onClick={() => handleDirectSampleClick('MQ-2026-1002')}
              className="px-2.5 py-1 rounded-lg bg-sky-500/20 text-sky-300 hover:bg-sky-500/30 font-mono text-[11px] font-semibold border border-sky-500/30 transition"
            >
              MQ-2026-1002 (In Lab)
            </button>
            <button
              onClick={() => handleDirectSampleClick('MQ-2026-1003')}
              className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 font-mono text-[11px] font-semibold border border-amber-500/30 transition"
            >
              MQ-2026-1003 (Sample Collected)
            </button>
          </div>
        </div>
      </div>

      {/* Error Message if not found */}
      {hasSearched && errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-5 mb-8 text-center text-red-700 text-sm flex flex-col items-center gap-2 animate-in fade-in">
          <AlertCircle className="w-8 h-8 text-red-500" />
          <p className="font-semibold">{errorMessage}</p>
          <p className="text-xs text-red-600">
            For assistance, contact MQ Diagnostic Care laboratory at <strong className="text-slate-900">{LAB_DETAILS.contactNumber}</strong>.
          </p>
        </div>
      )}

      {/* Searched Booking Card Details */}
      {searchedBooking && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md mb-8 animate-in fade-in duration-300">
          {/* Top Status Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">
                  BOOKING REFERENCE
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-sky-50 text-sky-800 border border-sky-200">
                  {searchedBooking.id}
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">
                {searchedBooking.patientName}
              </h3>
              <p className="text-xs text-slate-500">
                {searchedBooking.patientAge} Years • {searchedBooking.patientGender} • Phone: {searchedBooking.patientPhone}
              </p>
            </div>

            <div className="flex flex-col sm:items-end">
              <span className="text-xs text-slate-400 font-semibold mb-1">
                CURRENT REPORT STATUS
              </span>
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wide ${
                  searchedBooking.status === 'Report Ready'
                    ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                    : searchedBooking.status === 'Processing'
                    ? 'bg-sky-100 text-sky-800 border border-sky-300 animate-pulse'
                    : searchedBooking.status === 'Sample Collected'
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {searchedBooking.status === 'Report Ready' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <Clock className="w-4 h-4" />
                )}
                {searchedBooking.status}
              </span>
            </div>
          </div>

          {/* Progress Timeline */}
          <div className="py-8 border-b border-slate-200">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-6 text-center">
              Testing Journey Timeline
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {getTimelineSteps(searchedBooking.status).map((step, idx) => (
                <div key={idx} className="flex flex-col items-center text-center relative">
                  {/* Circle indicator */}
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs mb-2 transition-all ${
                      step.isCompleted
                        ? 'bg-emerald-600 text-white shadow-sm ring-4 ring-emerald-100'
                        : 'bg-slate-100 text-slate-400 border border-slate-200'
                    }`}
                  >
                    {step.isCompleted ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-bold ${
                      step.isCompleted ? 'text-slate-900' : 'text-slate-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5">
                    {step.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Callout if Report Ready */}
          {searchedBooking.status === 'Report Ready' ? (
            <div className="mt-6 bg-gradient-to-r from-emerald-50 via-teal-50 to-sky-50 rounded-2xl p-5 sm:p-6 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                  <FileCheck2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-emerald-950">
                    Your Official Lab Report is Ready to Download!
                  </h4>
                  <p className="text-xs text-emerald-800 mt-0.5">
                    Uploaded directly by MQ Diagnostic Care lab administration. Verified by Consultant Pathologist.
                  </p>
                  {searchedBooking.scannedReport?.fileName && (
                    <span className="text-[11px] text-slate-500 font-mono mt-1 block">
                      Attachment: {searchedBooking.scannedReport.fileName}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  onClick={() => onOpenReportModal(searchedBooking)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl shadow-md transition"
                >
                  <Eye className="w-4 h-4" />
                  <span>View Report</span>
                </button>

                {searchedBooking.scannedReport?.fileDataUrl && (
                  <a
                    href={searchedBooking.scannedReport.fileDataUrl}
                    download={searchedBooking.scannedReport.fileName || `MQ_Report_${searchedBooking.id}.png`}
                    className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-300 shadow-2xs transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="mt-6 bg-amber-50 rounded-2xl p-5 border border-amber-200 flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-600 shrink-0" />
              <div className="text-xs text-amber-900">
                <strong className="block text-sm">Testing in progress...</strong>
                Our laboratory technicians are processing your test sample. Once verified by our pathologist, your official scanned report will be available here immediately.
              </div>
            </div>
          )}

          {/* Booked Tests list */}
          <div className="mt-8">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
              Tests Included in this Booking ({searchedBooking.tests.length})
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {searchedBooking.tests.map((test) => (
                <div
                  key={test.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-800">{test.name}</span>
                  <span className="font-bold text-slate-900">₹{test.price}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>Scheduled Date: <strong>{searchedBooking.scheduledDate} ({searchedBooking.scheduledTimeSlot})</strong></span>
              <span>Total Billed: <strong className="text-slate-900 text-sm">₹{searchedBooking.totalAmount}</strong></span>
            </div>
          </div>
        </div>
      )}

      {/* Helpful Info Section for Patients */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center mb-3">
            <Phone className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Laboratory Assistance</h4>
          <p className="text-xs text-slate-500 mt-1">
            Have questions regarding test preparation or report results? Call our lab directly at:
          </p>
          <a
            href={`tel:${LAB_DETAILS.contactNumber}`}
            className="text-xs font-extrabold text-sky-700 mt-2 inline-block hover:underline"
          >
            {LAB_DETAILS.contactNumber}
          </a>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-3">
            <Calendar className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Need Another Test?</h4>
          <p className="text-xs text-slate-500 mt-1">
            Book additional pathological tests or schedule home sample collection with ease.
          </p>
          <button
            onClick={onOpenBookingModal}
            className="text-xs font-extrabold text-teal-700 mt-2 inline-flex items-center gap-1 hover:underline"
          >
            <span>Book New Appointment</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs">
          <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">100% Confidential</h4>
          <p className="text-xs text-slate-500 mt-1">
            Your medical diagnostics and scanned reports are securely protected and strictly confidential.
          </p>
          <span className="text-[11px] font-semibold text-purple-700 mt-2 block">
            Quality Assurance Certified
          </span>
        </div>
      </div>
    </div>
  );
};
