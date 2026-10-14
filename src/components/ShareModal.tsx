import React, { useState, useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { DiagnosticBooking } from '../types/diagnostic';
import { LAB_DETAILS } from '../data/defaultTests';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  MessageSquare, 
  Send, 
  Download, 
  Printer, 
  ExternalLink, 
  QrCode, 
  Smartphone, 
  Sparkles,
  Phone,
  Building2,
  FileText
} from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: 'customer' | 'admin';
  booking?: DiagnosticBooking | null;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  mode = 'customer',
  booking = null,
}) => {
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'link' | 'qr' | 'whatsapp'>('link');
  const [patientMobileInput, setPatientMobileInput] = useState(booking?.patientPhone || '');
  const [customMsg, setCustomMsg] = useState('');

  // Get current website URL
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://mqdiagnosticcare.com';

  // Specific target link (e.g. if sharing specific booking)
  const targetUrl = booking 
    ? `${siteUrl}?bookingId=${booking.id}`
    : siteUrl;

  // Generate QR Code on load
  useEffect(() => {
    if (isOpen) {
      QRCode.toDataURL(targetUrl, {
        width: 320,
        margin: 2,
        color: {
          dark: '#0369a1',
          light: '#ffffff',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Error generating QR:', err));
    }
  }, [isOpen, targetUrl]);

  // Set default patient notification message if booking is provided
  useEffect(() => {
    if (booking) {
      setPatientMobileInput(booking.patientPhone);
      setCustomMsg(
        `Dear ${booking.patientName}, your pathological test report (Booking ID: ${booking.id}) from MQ DIAGNOSTIC CARE (Trisulia, Baranga) is verified and ready for download. View and download your report here: ${siteUrl}`
      );
    } else {
      setCustomMsg(
        `Book accurate pathological tests and home sample collection at MQ DIAGNOSTIC CARE, Trisulia, Baranga. Contact: ${LAB_DETAILS.contactNumber}. Visit portal: ${siteUrl}`
      );
    }
  }, [booking, siteUrl]);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(targetUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'MQ Diagnostic Care - Laboratory & Patient Portal',
          text: customMsg,
          url: targetUrl,
        });
      } catch {
        // User cancelled or unsupported
      }
    } else {
      handleCopyLink();
    }
  };

  const handleShareWhatsApp = () => {
    const encoded = encodeURIComponent(customMsg);
    if (booking && patientMobileInput) {
      // Send directly to patient's WhatsApp
      const cleanPhone = patientMobileInput.replace(/\D/g, '');
      const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
      window.open(`https://wa.me/${fullPhone}?text=${encoded}`, '_blank');
    } else {
      // Open general WhatsApp share
      window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const link = document.createElement('a');
    link.href = qrDataUrl;
    link.download = `MQ_Diagnostic_QR_${booking ? booking.id : 'Website'}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintStandee = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <html>
        <head>
          <title>MQ Diagnostic Care - Counter QR Code</title>
          <style>
            body { font-family: sans-serif; text-align: center; padding: 40px; }
            .card { border: 4px solid #0284c7; border-radius: 24px; padding: 40px; max-width: 480px; margin: 0 auto; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            h1 { color: #0369a1; margin-bottom: 4px; font-size: 28px; }
            p { color: #475569; margin: 6px 0; font-size: 14px; }
            .badge { background: #0d9488; color: white; display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-bottom: 20px; }
            img { width: 260px; height: 260px; margin: 15px 0; border: 1px solid #e2e8f0; border-radius: 12px; padding: 10px; }
            .footer { font-size: 13px; color: #64748b; margin-top: 20px; border-top: 1px solid #e2e8f0; padding-top: 15px; }
          </style>
        </head>
        <body>
          <div class="card">
            <h1>MQ DIAGNOSTIC CARE</h1>
            <div class="badge">SAMPLE COLLECTION CENTER</div>
            <p><strong>SCAN TO BOOK TESTS &amp; DOWNLOAD REPORTS</strong></p>
            <p>Trisulia, Baranga • Contact: +91 75046 62885</p>
            <img src="${qrDataUrl}" alt="QR Code" />
            <div class="footer">
              <p>Scan with any camera or Google Lens to view rates and track test reports 24/7</p>
            </div>
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Top Header Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-sky-950 to-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-white">
                {mode === 'admin' ? 'Share Report & Portal' : 'Share Laboratory Website'}
              </h3>
              <p className="text-[11px] text-slate-300">
                MQ Diagnostic Care • Trisulia, Baranga
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switchers */}
        <div className="flex bg-slate-100 p-1 border-b border-slate-200 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('link')}
            className={`flex-1 py-2 text-center rounded-xl transition ${
              activeTab === 'link' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Share Link
          </button>
          <button
            onClick={() => setActiveTab('qr')}
            className={`flex-1 py-2 text-center rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'qr' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <QrCode className="w-3.5 h-3.5 text-sky-600" />
            <span>Scan QR Code</span>
          </button>
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 text-center rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'whatsapp' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Tab 1: Share Link */}
        {activeTab === 'link' && (
          <div className="p-6 space-y-5">
            {booking && (
              <div className="bg-sky-50 border border-sky-200 rounded-2xl p-3.5 text-xs">
                <span className="font-extrabold text-sky-900 block">
                  Patient Report Ready Link:
                </span>
                <span className="text-slate-700">
                  {booking.patientName} ({booking.id}) • {booking.tests.length} Tests
                </span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Website Portal Link
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={targetUrl}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono text-slate-700 select-all focus:outline-hidden"
                />
                <button
                  onClick={handleCopyLink}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition shrink-0"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>
            </div>

            {/* Quick Share Buttons */}
            <div>
              <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Share Directly via:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button
                  onClick={handleShareWhatsApp}
                  className="p-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-800 text-xs font-bold transition"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>WhatsApp</span>
                </button>

                <button
                  onClick={() => {
                    const url = `https://t.me/share/url?url=${encodeURIComponent(targetUrl)}&text=${encodeURIComponent(customMsg)}`;
                    window.open(url, '_blank');
                  }}
                  className="p-3 bg-sky-50 hover:bg-sky-100 border border-sky-200 rounded-xl flex items-center gap-2 text-sky-800 text-xs font-bold transition"
                >
                  <Send className="w-4 h-4 text-sky-600 shrink-0" />
                  <span>Telegram</span>
                </button>

                <button
                  onClick={() => {
                    const mailSubject = encodeURIComponent('MQ Diagnostic Care - Pathology Tests & Reports');
                    const mailBody = encodeURIComponent(customMsg);
                    window.location.href = `mailto:?subject=${mailSubject}&body=${mailBody}`;
                  }}
                  className="p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl flex items-center gap-2 text-slate-800 text-xs font-bold transition"
                >
                  <Building2 className="w-4 h-4 text-slate-600 shrink-0" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Native Mobile Share Sheet */}
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button
                onClick={handleNativeShare}
                className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm py-2.5 rounded-xl border border-slate-300 transition flex items-center justify-center gap-2"
              >
                <Smartphone className="w-4 h-4 text-sky-600" />
                <span>Open Device Share Sheet</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: QR Code View & Download */}
        {activeTab === 'qr' && (
          <div className="p-6 text-center space-y-4">
            <div className="max-w-[240px] mx-auto bg-white p-4 rounded-2xl border-2 border-sky-500 shadow-md">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="MQ Diagnostic Care QR"
                  className="w-full h-auto rounded-lg mx-auto"
                />
              ) : (
                <div className="w-48 h-48 bg-slate-100 animate-pulse rounded-lg mx-auto" />
              )}
              <span className="text-[11px] font-bold text-sky-800 uppercase block mt-2">
                Scan with Phone Camera
              </span>
            </div>

            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Scan this QR code with any mobile device to immediately open MQ Diagnostic Care test booking and report tracking portal.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={handleDownloadQr}
                className="bg-slate-900 hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" />
                <span>Save QR Image</span>
              </button>

              <button
                onClick={handlePrintStandee}
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
              >
                <Printer className="w-4 h-4" />
                <span>Print Counter Standee</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: WhatsApp Direct Messaging */}
        {activeTab === 'whatsapp' && (
          <div className="p-6 space-y-4">
            {mode === 'admin' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Recipient Patient Mobile Number
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-600 text-xs font-bold">
                    +91
                  </span>
                  <input
                    type="tel"
                    placeholder="10-digit mobile"
                    value={patientMobileInput}
                    onChange={(e) => setPatientMobileInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-r-xl text-xs sm:text-sm font-mono"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                WhatsApp Message Preview
              </label>
              <textarea
                rows={4}
                value={customMsg}
                onChange={(e) => setCustomMsg(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed focus:bg-white"
              />
            </div>

            <button
              onClick={handleShareWhatsApp}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm py-3 rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Send Message on WhatsApp</span>
            </button>
          </div>
        )}

        {/* Footer info */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
          <span>MQ Diagnostic Care • Trisulia, Baranga</span>
          <span className="font-semibold text-slate-700">Helpline: {LAB_DETAILS.contactNumber}</span>
        </div>
      </div>
    </div>
  );
};
