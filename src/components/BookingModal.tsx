import React, { useState } from 'react';
import { TestItem, DiagnosticBooking } from '../types/diagnostic';
import { createBooking } from '../services/storage';
import { LAB_DETAILS } from '../data/defaultTests';
import confetti from 'canvas-confetti';
import { 
  X, 
  Trash2, 
  Plus, 
  Calendar, 
  Clock, 
  MapPin, 
  Home, 
  Building2, 
  CheckCircle2, 
  ShieldCheck, 
  AlertCircle,
  Copy,
  Printer,
  Phone,
  MessageSquare
} from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  allTests: TestItem[];
  selectedTestIds: string[];
  onToggleTest: (test: TestItem) => void;
  onBookingCreated?: (booking: DiagnosticBooking) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  allTests,
  selectedTestIds,
  onToggleTest,
  onBookingCreated,
}) => {
  const [step, setStep] = useState<'details' | 'success'>('details');
  const [serviceType, setServiceType] = useState<'lab_visit' | 'home_collection'>('lab_visit');
  
  // Patient details state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  const [address, setAddress] = useState('');
  const [cityArea, setCityArea] = useState('Trisulia, Baranga');
  
  // Scheduling
  const todayStr = new Date().toISOString().split('T')[0];
  const [scheduledDate, setScheduledDate] = useState(todayStr);
  const [scheduledTimeSlot, setScheduledTimeSlot] = useState('07:30 AM - 09:30 AM');
  const [referringDoctor, setReferringDoctor] = useState('');
  const [specialInstructions, setSpecialInstructions] = useState('');
  
  const [errorMsg, setErrorMsg] = useState('');
  const [createdBooking, setCreatedBooking] = useState<DiagnosticBooking | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  if (!isOpen) return null;

  const selectedTests = allTests.filter((t) => selectedTestIds.includes(t.id));
  const subtotal = selectedTests.reduce((acc, t) => acc + t.price, 0);
  const homeCollectionFee = serviceType === 'home_collection' ? (subtotal >= 1000 ? 0 : 50) : 0;
  const totalAmount = subtotal + homeCollectionFee;

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (selectedTests.length === 0) {
      setErrorMsg('Please select at least one test to book an appointment.');
      return;
    }

    if (!patientName.trim()) {
      setErrorMsg('Please enter the patient name.');
      return;
    }

    if (!patientAge || parseInt(patientAge, 10) <= 0) {
      setErrorMsg('Please enter a valid age.');
      return;
    }

    if (!patientPhone || patientPhone.replace(/\D/g, '').length < 10) {
      setErrorMsg('Please provide a valid 10-digit mobile number.');
      return;
    }

    if (serviceType === 'home_collection' && !address.trim()) {
      setErrorMsg('Please enter your full address & landmark for home sample collection.');
      return;
    }

    // Create booking
    const newBooking = createBooking({
      patientName: patientName.trim(),
      patientAge: parseInt(patientAge, 10),
      patientGender,
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim() || undefined,
      serviceType,
      address: serviceType === 'home_collection' ? address.trim() : undefined,
      cityArea,
      scheduledDate,
      scheduledTimeSlot,
      tests: selectedTests.map((t) => ({ id: t.id, name: t.name, price: t.price })),
      totalAmount,
      paymentStatus: 'Pending at Collection',
      referringDoctor: referringDoctor.trim() || 'Self',
      specialInstructions: specialInstructions.trim() || undefined,
    });

    setCreatedBooking(newBooking);
    setStep('success');

    // Trigger celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#0284c7', '#0d9488', '#ef4444', '#10b981'],
      });
    } catch {
      // Ignore if not loaded
    }

    if (onBookingCreated) {
      onBookingCreated(newBooking);
    }
  };

  const copyBookingId = () => {
    if (createdBooking?.id) {
      navigator.clipboard.writeText(createdBooking.id);
      setCopiedId(true);
      setTimeout(() => setCopiedId(false), 2000);
    }
  };

  const handleWhatsAppAlert = () => {
    if (!createdBooking) return;
    const msg = `Hello MQ Diagnostic Care, I have confirmed a test appointment:%0A- Booking ID: ${createdBooking.id}%0A- Patient: ${createdBooking.patientName}%0A- Date & Time: ${createdBooking.scheduledDate} (${createdBooking.scheduledTimeSlot})%0A- Service: ${createdBooking.serviceType === 'home_collection' ? 'Home Collection' : 'Lab Visit'}%0A- Total: ₹${createdBooking.totalAmount}`;
    window.open(`https://wa.me/917504662885?text=${msg}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-800 to-teal-800 text-white px-6 py-4 flex items-center justify-between border-b border-sky-900">
          <div>
            <h3 className="font-extrabold text-lg sm:text-xl text-white">
              {step === 'details' ? 'Book Diagnostic Appointment' : 'Booking Confirmed!'}
            </h3>
            <p className="text-xs text-sky-200">
              MQ Diagnostic Care • Trisulia, Baranga • Contact: {LAB_DETAILS.contactNumber}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-sky-200 hover:text-white hover:bg-white/10 rounded-lg transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7">
          {step === 'details' ? (
            <form onSubmit={handleBookingSubmit} className="space-y-6">
              {errorMsg && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm p-3.5 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Service Type Selection */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Service Type
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setServiceType('lab_visit')}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      serviceType === 'lab_visit'
                        ? 'border-sky-600 bg-sky-50/50 ring-2 ring-sky-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-2.5 rounded-lg bg-sky-100 text-sky-700 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm">
                        Visit Laboratory
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Trisulia, Baranga Main Lab. Free walk-in parking &amp; prompt testing.
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setServiceType('home_collection')}
                    className={`p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                      serviceType === 'home_collection'
                        ? 'border-teal-600 bg-teal-50/50 ring-2 ring-teal-500/20'
                        : 'border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="p-2.5 rounded-lg bg-teal-100 text-teal-700 shrink-0">
                      <Home className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <span>Home Sample Collection</span>
                        <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                          Available
                        </span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        Trained phlebotomist collects blood/urine sample from your home safely.
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Selected Tests Summary */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                    Selected Tests ({selectedTests.length})
                  </span>
                  <span className="text-xs text-slate-500">
                    Need to add more? You can select from the rate chart
                  </span>
                </div>

                {selectedTests.length === 0 ? (
                  <div className="py-4 text-center text-xs text-slate-500">
                    No tests selected yet. Please select tests from the rate chart.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-200/80 max-h-48 overflow-y-auto pr-1">
                    {selectedTests.map((test) => (
                      <div
                        key={test.id}
                        className="py-2 flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-semibold text-slate-800">
                            {test.name}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            Sample: {test.sampleType}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900">
                            ₹{test.price}
                          </span>
                          <button
                            type="button"
                            onClick={() => onToggleTest(test)}
                            className="text-slate-400 hover:text-red-600 p-1 rounded"
                            title="Remove"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Subtotals */}
                <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between text-sm font-bold text-slate-800">
                  <span>Total Payable:</span>
                  <span className="text-base text-sky-800 font-black">
                    ₹{totalAmount}
                  </span>
                </div>
              </div>

              {/* Patient Details Form Fields */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 border-b pb-1">
                  Patient Information
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Patient Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar Sahoo"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Age (Years) *
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="120"
                        required
                        placeholder="Age"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Gender *
                      </label>
                      <select
                        value={patientGender}
                        onChange={(e) => setPatientGender(e.target.value as any)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Mobile Number (for SMS &amp; WhatsApp reports) *
                    </label>
                    <div className="flex">
                      <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-xl text-slate-600 text-xs font-bold">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        placeholder="75046 62885"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-r-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      placeholder="patient@example.com"
                      value={patientEmail}
                      onChange={(e) => setPatientEmail(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>

                {/* Home Address if Home Collection */}
                {serviceType === 'home_collection' && (
                  <div className="bg-teal-50/50 p-4 rounded-xl border border-teal-200 space-y-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-teal-800">
                      <MapPin className="w-4 h-4 text-teal-600" />
                      Home Collection Address in Trisulia / Baranga
                    </div>
                    <div>
                      <input
                        type="text"
                        required
                        placeholder="House / Flat No., Apartment / Lane, Landmark (e.g., Near Trisulia Square / Baranga College)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                )}

                {/* Scheduling Date and Time */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Date *
                    </label>
                    <input
                      type="date"
                      required
                      min={todayStr}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Preferred Time Slot *
                    </label>
                    <select
                      value={scheduledTimeSlot}
                      onChange={(e) => setScheduledTimeSlot(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="06:30 AM - 08:30 AM">06:30 AM - 08:30 AM (Best for Fasting)</option>
                      <option value="08:30 AM - 10:30 AM">08:30 AM - 10:30 AM (Morning Slot)</option>
                      <option value="10:30 AM - 12:30 PM">10:30 AM - 12:30 PM (Midday Slot)</option>
                      <option value="02:00 PM - 04:30 PM">02:00 PM - 04:30 PM (Afternoon)</option>
                      <option value="05:00 PM - 08:00 PM">05:00 PM - 08:00 PM (Evening)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Referring Doctor (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Doctor or Clinic Name (or Self)"
                      value={referringDoctor}
                      onChange={(e) => setReferringDoctor(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Special Notes / Symptoms (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 12 hrs fasting done, or fever since 2 days"
                      value={specialInstructions}
                      onChange={(e) => setSpecialInstructions(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={selectedTests.length === 0}
                  className="bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm Appointment (₹{totalAmount})</span>
                </button>
              </div>
            </form>
          ) : (
            /* Booking Success View */
            <div className="text-center py-6 px-2 space-y-6">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                  Appointment Booked Successfully
                </span>
                <h3 className="text-2xl font-black text-slate-900 mt-2">
                  Thank You, {createdBooking?.patientName}!
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-md mx-auto">
                  Your appointment has been registered at MQ Diagnostic Care. Our laboratory team is preparing for your sample collection.
                </p>
              </div>

              {/* Booking ID badge card */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 max-w-md mx-auto text-left shadow-2xs">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      BOOKING REFERENCE ID
                    </span>
                    <span className="text-xl font-black font-mono text-sky-800">
                      {createdBooking?.id}
                    </span>
                  </div>
                  <button
                    onClick={copyBookingId}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 bg-sky-50 px-2.5 py-1.5 rounded-lg border border-sky-200"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedId ? 'Copied!' : 'Copy ID'}</span>
                  </button>
                </div>

                <div className="py-3 space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Scheduled Date:</span>
                    <span className="font-semibold text-slate-800">
                      {createdBooking?.scheduledDate} ({createdBooking?.scheduledTimeSlot})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Service:</span>
                    <span className="font-semibold text-slate-800 capitalize">
                      {createdBooking?.serviceType === 'home_collection' ? '🏠 Home Collection' : '🏥 Lab Visit'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Selected Tests:</span>
                    <span className="font-semibold text-slate-800">
                      {createdBooking?.tests.length} tests (Total: ₹{createdBooking?.totalAmount})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Payment:</span>
                    <span className="font-semibold text-amber-700">
                      Pay at Collection (Cash / UPI / Card)
                    </span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-200 bg-white -mx-5 -mb-5 p-3 rounded-b-2xl text-[11px] text-slate-500 text-center">
                  You can track this booking anytime using your mobile number or <strong>{createdBooking?.id}</strong> in the Patient Portal.
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={handleWhatsAppAlert}
                  className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-xs transition"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Confirmation on WhatsApp</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-slate-200 transition"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Slip</span>
                </button>

                <button
                  onClick={onClose}
                  className="inline-flex items-center gap-1 bg-slate-900 hover:bg-black text-white font-semibold text-xs sm:text-sm px-5 py-2.5 rounded-xl transition"
                >
                  <span>Done</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
