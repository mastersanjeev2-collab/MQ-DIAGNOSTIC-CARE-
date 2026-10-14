import React from 'react';
import { MQLogo } from './MQLogo';
import { LAB_DETAILS } from '../data/defaultTests';
import { 
  Phone, 
  MapPin, 
  Clock, 
  Mail, 
  ShieldCheck, 
  MessageSquare, 
  Heart,
  CheckCircle2,
  Lock,
  Share2,
  QrCode
} from 'lucide-react';

interface FooterProps {
  onNavigate: (view: 'home' | 'ratechart' | 'packages' | 'patient_portal' | 'admin') => void;
  onOpenBooking: () => void;
  onOpenShare?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenBooking, onOpenShare }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="bg-white p-3 rounded-2xl inline-block shadow-md">
              <MQLogo size="sm" showSubtitle={false} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong>MQ DIAGNOSTIC CARE</strong> is a dedicated Sample Collection Center and pathology testing laboratory serving Trisulia, Baranga and neighboring regions with accurate, quality testing at affordable rates.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Certified Phlebotomists &amp; Equipment</span>
            </div>
          </div>

          {/* Col 2: Contact & Location */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Laboratory Location
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                <span>
                  <strong>TRISULIA, BARANGA</strong>
                  <br />Near Cuttack - Bhubaneswar Highway Road, Odisha
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-sky-400 shrink-0" />
                <a
                  href={`tel:${LAB_DETAILS.contactNumber}`}
                  className="hover:text-white font-bold text-sky-300"
                >
                  {LAB_DETAILS.contactNumber}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{LAB_DETAILS.timings}</span>
              </div>
            </div>
          </div>

          {/* Col 3: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Patient Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('ratechart')}
                  className="hover:text-cyan-400 transition"
                >
                  Rate Chart (All 27 Tests)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('packages')}
                  className="hover:text-cyan-400 transition"
                >
                  Health Packages
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-cyan-400 transition"
                >
                  Book Home Sample Collection
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('patient_portal')}
                  className="hover:text-cyan-400 transition text-teal-300 font-semibold"
                >
                  Download Scanned Test Report
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenShare}
                  className="hover:text-cyan-400 transition text-sky-300 flex items-center gap-1 font-semibold"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share Website &amp; QR Code</span>
                </button>
              </li>
              <li>
                <a
                  href={`https://wa.me/917504662885?text=Hello%20MQ%20Diagnostic%20Care,%20I%20have%20an%20inquiry.`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-emerald-400 transition flex items-center gap-1"
                >
                  <MessageSquare className="w-3 h-3 text-emerald-500" />
                  <span>WhatsApp Inquiry</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Laboratory Admin & Security */}
          <div className="space-y-3">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              Management Portal
            </h4>
            <p className="text-xs text-slate-400">
              Authorized lab staff can upload scanned patient reports, adjust live test rate charts, and export data backups.
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => onNavigate('admin')}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold border border-slate-700 transition w-fit"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Dashboard</span>
              </button>

              <button
                onClick={onOpenShare}
                className="inline-flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold border border-slate-800 transition w-fit"
              >
                <QrCode className="w-3.5 h-3.5 text-teal-400" />
                <span>Print Counter QR Standee</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} MQ DIAGNOSTIC CARE. All rights reserved. Accurate Testing | Healthier Tomorrow.</p>
          <p className="flex items-center gap-1">
            Trisulia, Baranga • Contact: <span className="text-slate-300 font-semibold">+91 75046 62885</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
