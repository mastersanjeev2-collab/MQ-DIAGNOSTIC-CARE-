import React, { useState } from 'react';
import { DiagnosticBooking } from '../types/diagnostic';
import { 
  X, 
  Download, 
  Printer, 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Image as ImageIcon,
  ExternalLink,
  Calendar,
  User,
  Phone,
  FileCheck2
} from 'lucide-react';
import { LAB_DETAILS } from '../data/defaultTests';

interface ReportViewerModalProps {
  booking: DiagnosticBooking | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReportViewerModal: React.FC<ReportViewerModalProps> = ({
  booking,
  isOpen,
  onClose,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'scanned' | 'digital'>('scanned');

  if (!isOpen || !booking) return null;

  const hasScannedReport = Boolean(booking.scannedReport?.fileDataUrl);
  const isPdf = booking.scannedReport?.fileType === 'pdf';

  const handleDownload = () => {
    if (booking.scannedReport?.fileDataUrl) {
      const link = document.createElement('a');
      link.href = booking.scannedReport.fileDataUrl;
      link.download = booking.scannedReport.fileName || `MQ_Report_${booking.id}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div 
        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200"
        role="dialog"
      >
        {/* Top Header Bar */}
        <div className="bg-slate-900 text-white px-5 py-4 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/20 border border-teal-500/40 flex items-center justify-center text-teal-400">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-white">
                  Diagnostic Test Report
                </h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-xs px-2.5 py-0.5 rounded-full font-medium border border-emerald-500/30 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified & Ready
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Booking ID: <strong className="text-cyan-400 font-mono">{booking.id}</strong> • Patient: <strong className="text-white">{booking.patientName}</strong> ({booking.patientAge}y/{booking.patientGender})
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            {hasScannedReport && (
              <div className="hidden sm:flex bg-slate-800 p-1 rounded-lg border border-slate-700 text-xs mr-2">
                <button
                  onClick={() => setActiveTab('scanned')}
                  className={`px-3 py-1 rounded font-medium transition ${
                    activeTab === 'scanned'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Scanned Copy
                </button>
                <button
                  onClick={() => setActiveTab('digital')}
                  className={`px-3 py-1 rounded font-medium transition ${
                    activeTab === 'digital'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Digital Values
                </button>
              </div>
            )}

            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition"
              title="Print Report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>

            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold bg-gradient-to-r from-sky-500 to-teal-500 hover:from-sky-600 hover:to-teal-600 text-white rounded-lg shadow-sm transition"
              title="Download Report File"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition ml-1"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sub Header for Mobile Tabs */}
        {hasScannedReport && (
          <div className="sm:hidden flex bg-slate-100 p-1 border-b border-slate-200 text-xs">
            <button
              onClick={() => setActiveTab('scanned')}
              className={`flex-1 py-1.5 text-center font-semibold rounded ${
                activeTab === 'scanned' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Scanned Copy ({booking.scannedReport?.fileName})
            </button>
            <button
              onClick={() => setActiveTab('digital')}
              className={`flex-1 py-1.5 text-center font-semibold rounded ${
                activeTab === 'digital' ? 'bg-white text-sky-700 shadow-sm' : 'text-slate-600'
              }`}
            >
              Digital Values
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-slate-100 p-4 sm:p-6 flex flex-col items-center">
          {/* If Scanned Tab & Has Scanned File */}
          {activeTab === 'scanned' && hasScannedReport && (
            <div className="w-full flex flex-col items-center">
              {/* Controls Toolbar for image zoom & rotate */}
              {!isPdf && (
                <div className="mb-3 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full border border-slate-200 shadow-xs flex items-center gap-3 text-xs text-slate-600">
                  <span className="font-medium text-slate-500">View Controls:</span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(50, z - 15))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono font-medium text-slate-700 w-12 text-center">
                    {zoomLevel}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(200, z + 15))}
                    className="p-1 hover:bg-slate-100 rounded text-slate-700"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <div className="h-4 w-px bg-slate-200" />
                  <button
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="inline-flex items-center gap-1 p-1 hover:bg-slate-100 rounded text-slate-700"
                    title="Rotate 90deg"
                  >
                    <RotateCw className="w-4 h-4" />
                    <span>Rotate</span>
                  </button>
                  <button
                    onClick={() => {
                      setZoomLevel(100);
                      setRotation(0);
                    }}
                    className="text-[11px] text-sky-600 hover:underline font-semibold ml-1"
                  >
                    Reset
                  </button>
                </div>
              )}

              {/* Scanned Viewer container */}
              <div className="w-full max-w-4xl bg-white rounded-xl shadow-md border border-slate-200 overflow-auto flex items-center justify-center p-4 min-h-[500px]">
                {isPdf ? (
                  <div className="w-full h-[650px] flex flex-col">
                    <iframe
                      src={booking.scannedReport?.fileDataUrl}
                      className="w-full h-full rounded border border-slate-200"
                      title="Scanned PDF Report"
                    />
                    <div className="mt-2 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
                      <span>Unable to view PDF in preview?</span>
                      <a
                        href={booking.scannedReport?.fileDataUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sky-600 font-semibold inline-flex items-center gap-1 hover:underline"
                      >
                        Open in New Tab <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div
                    className="transition-transform duration-200 origin-center max-w-full"
                    style={{
                      transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    }}
                  >
                    <img
                      src={booking.scannedReport?.fileDataUrl}
                      alt={`Report for ${booking.patientName}`}
                      className="max-w-full h-auto rounded shadow-sm object-contain select-none"
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Digital Format View (Either active or fallback if no scanned image) */}
          {(activeTab === 'digital' || !hasScannedReport) && (
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg border border-slate-200 p-6 sm:p-8 text-slate-800">
              {/* Printable Medical Lab Header */}
              <div className="border-b-2 border-sky-700 pb-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className="w-9 h-9 rounded-lg bg-sky-700 text-white font-black text-xl flex items-center justify-center shadow-xs">
                        MQ
                      </div>
                      <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                        {LAB_DETAILS.name}
                      </h2>
                    </div>
                    <p className="text-xs font-bold text-teal-700 uppercase tracking-widest">
                      {LAB_DETAILS.subtag} • {LAB_DETAILS.tagline}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      {LAB_DETAILS.address}
                    </p>
                    <p className="text-xs text-slate-600 font-medium">
                      Phone: <span className="font-bold text-slate-900">{LAB_DETAILS.contactNumber}</span> | Email: {LAB_DETAILS.email}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-right sm:min-w-[200px]">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      LAB REF NUMBER
                    </span>
                    <span className="text-sm font-black font-mono text-sky-800 block">
                      {booking.id}
                    </span>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      ✓ Electronically Signed
                    </span>
                  </div>
                </div>
              </div>

              {/* Patient & Doctor Demographics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs mb-6">
                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-medium">Patient Name:</span>
                    <span className="font-bold text-slate-900 text-sm">{booking.patientName}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-medium">Age / Gender:</span>
                    <span className="font-semibold text-slate-800">{booking.patientAge} Years / {booking.patientGender}</span>
                  </div>
                  <div className="flex">
                    <span className="w-28 text-slate-500 font-medium">Contact:</span>
                    <span className="font-medium text-slate-800">{booking.patientPhone}</span>
                  </div>
                  {booking.address && (
                    <div className="flex">
                      <span className="w-28 text-slate-500 font-medium">Address:</span>
                      <span className="font-medium text-slate-700">{booking.address}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex">
                    <span className="w-32 text-slate-500 font-medium">Referred By:</span>
                    <span className="font-semibold text-slate-800">{booking.referringDoctor || 'Self / Routine'}</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-500 font-medium">Collection Date:</span>
                    <span className="font-medium text-slate-800">{booking.scheduledDate} ({booking.scheduledTimeSlot})</span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-500 font-medium">Report Released:</span>
                    <span className="font-semibold text-emerald-700">
                      {booking.reportReleasedAt || 'Verified on same day'}
                    </span>
                  </div>
                  <div className="flex">
                    <span className="w-32 text-slate-500 font-medium">Service Type:</span>
                    <span className="capitalize font-medium text-slate-700">
                      {booking.serviceType === 'home_collection' ? '🏠 Home Sample Collection' : '🏥 Laboratory Visit'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tests Undertaken Header */}
              <div className="mb-4">
                <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wide flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-sky-600" />
                  Tests &amp; Clinical Investigations Ordered
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {booking.tests.map((t) => (
                    <span
                      key={t.id}
                      className="px-2.5 py-1 bg-sky-50 text-sky-800 border border-sky-200 rounded-md text-xs font-semibold"
                    >
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>

              {/* Clinical Parameter Results Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden mb-6">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 uppercase tracking-wider font-bold">
                      <th className="p-3">Parameter / Test</th>
                      <th className="p-3">Observed Value</th>
                      <th className="p-3">Biological Unit</th>
                      <th className="p-3">Reference Range</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {booking.digitalReportParameters && booking.digitalReportParameters.length > 0 ? (
                      booking.digitalReportParameters.map((param, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/80">
                          <td className="p-3 font-semibold text-slate-900">{param.name}</td>
                          <td className="p-3 font-mono font-bold text-slate-900 text-sm">
                            {param.result}
                          </td>
                          <td className="p-3 text-slate-500">{param.unit}</td>
                          <td className="p-3 text-slate-600">{param.referenceRange}</td>
                          <td className="p-3 text-center">
                            <span
                              className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                param.status === 'Normal'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : param.status === 'High'
                                  ? 'bg-red-100 text-red-800'
                                  : param.status === 'Low'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-800'
                              }`}
                            >
                              {param.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-slate-500">
                          Detailed parameter breakdown processed in physical laboratory report. Please see the attached scanned copy above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pathologist Remarks */}
              <div className="bg-sky-50/60 rounded-xl p-4 border border-sky-100 mb-8">
                <p className="text-xs font-bold text-sky-900 mb-1">
                  PATHOLOGIST REMARKS &amp; INTERPRETATION:
                </p>
                <p className="text-xs text-slate-700 leading-relaxed">
                  {booking.pathologistNotes ||
                    'Results are verified under strict laboratory quality assurance protocols. Clinical correlation with physical findings by treating doctor is recommended.'}
                </p>
              </div>

              {/* Verification & Signatures Footer */}
              <div className="border-t border-slate-200 pt-6 flex flex-wrap items-end justify-between gap-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full border-2 border-emerald-600 flex flex-col items-center justify-center text-emerald-700 font-bold text-[9px] p-1 text-center rotate-[-8deg] shadow-xs">
                    <span>MQ CARE</span>
                    <span className="font-black text-[10px] text-emerald-800">VERIFIED</span>
                    <span>BARANGA</span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    <p className="font-semibold text-slate-700">Digital Authentication ID: {booking.id}-AUTH</p>
                    <p>Verified on automated biochemistry &amp; cell counter analyzer</p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif italic text-base text-slate-800 font-bold tracking-wider">
                    {booking.verifiedBy || 'Dr. A. K. Behera, MD (Pathology)'}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-700">
                    Consultant Pathologist &amp; Lab Director
                  </div>
                  <div className="text-[10px] text-slate-400">
                    MQ Diagnostic Care • Trisulia, Baranga
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer info banner */}
        <div className="bg-slate-50 px-5 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <span>Need help understanding your report? Call our lab: <strong className="text-slate-800">{LAB_DETAILS.contactNumber}</strong></span>
          <span className="text-[11px]">MQ Diagnostic Care • Accurate Testing, Healthier Tomorrow</span>
        </div>
      </div>
    </div>
  );
};
