import React, { useState, useMemo, useRef } from 'react';
import { DiagnosticBooking, TestItem, HealthPackage, ScannedReportFile } from '../types/diagnostic';
import { 
  updateBookingStatus, 
  uploadReportToBooking, 
  updateTestPrice, 
  addNewTest, 
  deleteTest,
  resetTestsToDefault,
  updatePackage,
  updatePackagePrice,
  addNewPackage,
  deletePackage,
  resetPackagesToDefault,
  createBooking,
  deleteBooking,
  resetAllDataToDefault,
  resetReportsAndBookings,
  restoreDefaultSeedBookings,
  exportBackupData,
  importBackupData,
  getAdminPassword,
  setAdminPassword
} from '../services/storage';
import { LAB_DETAILS } from '../data/defaultTests';
import { 
  LayoutDashboard, 
  Users, 
  FileUp, 
  DollarSign, 
  CheckCircle, 
  Clock, 
  Search, 
  Filter, 
  Upload, 
  Eye, 
  Edit3, 
  Trash2, 
  Plus, 
  RotateCcw, 
  Save, 
  AlertCircle, 
  Check, 
  FileText, 
  Calendar, 
  Phone, 
  TrendingUp,
  Activity,
  Layers,
  Zap,
  Sparkles,
  KeyRound,
  Download,
  FolderArchive,
  RefreshCw,
  LogOut,
  Shield,
  FileSpreadsheet,
  Share2
} from 'lucide-react';

interface AdminDashboardProps {
  bookings: DiagnosticBooking[];
  tests: TestItem[];
  packages: HealthPackage[];
  onOpenReportModal: (booking: DiagnosticBooking) => void;
  onLogout: () => void;
  onOpenShare?: (mode: 'admin', booking?: DiagnosticBooking) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  bookings,
  tests,
  packages,
  onOpenReportModal,
  onLogout,
  onOpenShare,
}) => {
  const [activeTab, setActiveTab] = useState<'bookings' | 'pricing' | 'packages' | 'walkin' | 'settings'>('bookings');
  
  // Bookings filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Report Upload Modal State
  const [uploadModalBooking, setUploadModalBooking] = useState<DiagnosticBooking | null>(null);
  const [selectedFile, setSelectedFile] = useState<{
    file: File;
    dataUrl: string;
    type: 'image' | 'pdf';
  } | null>(null);
  const [uploadNotes, setUploadNotes] = useState('All routine tests completed with internal biological reference verification.');
  const [verifiedByDoctor, setVerifiedByDoctor] = useState('Dr. A. K. Behera, MD (Pathologist)');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Price Editing state
  const [editingPriceMap, setEditingPriceMap] = useState<Record<string, number>>({});
  const [priceSaveSuccess, setPriceSaveSuccess] = useState<string | null>(null);
  
  // Quick Add Test Inline form
  const [quickTestName, setQuickTestName] = useState('');
  const [quickTestPrice, setQuickTestPrice] = useState('');
  const [quickTestCategory, setQuickTestCategory] = useState('Biochemistry');
  const [quickTestSample, setQuickTestSample] = useState<'Blood' | 'Urine' | 'Stool' | 'Swab' | 'Serum' | 'Other'>('Blood');
  const [quickTestMsg, setQuickTestMsg] = useState('');

  // Packages editing state
  const [editingPackagePriceMap, setEditingPackagePriceMap] = useState<Record<string, number>>({});
  const [packageSaveSuccess, setPackageSaveSuccess] = useState<string | null>(null);
  const [showAddPackageModal, setShowAddPackageModal] = useState(false);
  const [newPkgName, setNewPkgName] = useState('');
  const [newPkgDesc, setNewPkgDesc] = useState('');
  const [newPkgPrice, setNewPkgPrice] = useState('');
  const [newPkgOriginalPrice, setNewPkgOriginalPrice] = useState('');
  const [newPkgRecommended, setNewPkgRecommended] = useState('Routine preventive checkup');
  const [newPkgSelectedTestIds, setNewPkgSelectedTestIds] = useState<string[]>([]);

  // Walk-in patient form state
  const [walkinName, setWalkinName] = useState('');
  const [walkinAge, setWalkinAge] = useState('');
  const [walkinGender, setWalkinGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [walkinPhone, setWalkinPhone] = useState('');
  const [walkinSelectedTestIds, setWalkinSelectedTestIds] = useState<string[]>([]);
  const [walkinDoctor, setWalkinDoctor] = useState('');
  const [walkinSuccessMsg, setWalkinSuccessMsg] = useState('');

  // Password Change state
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [passError, setPassError] = useState('');
  const [passSuccess, setPassSuccess] = useState('');

  // Backup & Reset state
  const [backupMsg, setBackupMsg] = useState('');
  const backupFileInputRef = useRef<HTMLInputElement>(null);

  // Key metrics calculation
  const metrics = useMemo(() => {
    const total = bookings.length;
    const reportReady = bookings.filter((b) => b.status === 'Report Ready').length;
    const processing = bookings.filter((b) => b.status === 'Processing' || b.status === 'Sample Collected').length;
    const pending = bookings.filter((b) => b.status === 'Pending' || b.status === 'Confirmed').length;
    const totalRevenue = bookings.reduce((acc, b) => acc + (b.totalAmount || 0), 0);

    return {
      total,
      reportReady,
      processing,
      pending,
      totalRevenue,
    };
  }, [bookings]);

  // Filtered Bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchSearch =
        b.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.patientPhone.includes(searchQuery);

      const matchStatus = statusFilter === 'All' || b.status === statusFilter;

      return matchSearch && matchStatus;
    });
  }, [bookings, searchQuery, statusFilter]);

  // Handle file select for report upload
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');

    if (!isPdf && !isImage) {
      alert('Please upload an image file (PNG, JPG, WEBP) or a PDF document.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setSelectedFile({
        file,
        dataUrl: result,
        type: isPdf ? 'pdf' : 'image',
      });
    };
    reader.readAsDataURL(file);
  };

  // Submit report upload
  const handleSaveUploadedReport = () => {
    if (!uploadModalBooking || !selectedFile) {
      alert('Please select a scanned report file (image or PDF) to upload.');
      return;
    }

    setIsUploading(true);
    const reportFile: ScannedReportFile = {
      fileName: selectedFile.file.name,
      fileType: selectedFile.type,
      fileDataUrl: selectedFile.dataUrl,
      uploadedAt: new Date().toISOString(),
      fileSizeKb: Math.round(selectedFile.file.size / 1024),
    };

    uploadReportToBooking(
      uploadModalBooking.id,
      reportFile,
      undefined,
      uploadNotes,
      verifiedByDoctor
    );

    setIsUploading(false);
    setUploadSuccessMsg(`Report successfully uploaded to Patient ${uploadModalBooking.patientName} (${uploadModalBooking.id})!`);
    
    setTimeout(() => {
      setUploadSuccessMsg('');
      setUploadModalBooking(null);
      setSelectedFile(null);
    }, 1500);
  };

  // Handle single test price update
  const handleSavePrice = (testId: string) => {
    const newPrice = editingPriceMap[testId];
    if (newPrice !== undefined) {
      updateTestPrice(testId, Number(newPrice));
      setPriceSaveSuccess(testId);
      setTimeout(() => setPriceSaveSuccess(null), 2000);
    }
  };

  // Handle package price update
  const handleSavePackagePrice = (pkgId: string) => {
    const newPrice = editingPackagePriceMap[pkgId];
    if (newPrice !== undefined) {
      updatePackagePrice(pkgId, Number(newPrice));
      setPackageSaveSuccess(pkgId);
      setTimeout(() => setPackageSaveSuccess(null), 2000);
    }
  };

  // Handle quick inline test addition
  const handleQuickAddTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTestName.trim() || !quickTestPrice) return;

    const priceNum = parseFloat(quickTestPrice) || 100;
    const testCode = quickTestName.trim().slice(0, 6).toUpperCase();

    addNewTest({
      name: quickTestName.trim(),
      code: testCode,
      category: quickTestCategory,
      price: priceNum,
      sampleType: quickTestSample,
      fastingRequired: false,
      isActive: true,
      description: `Pathology test investigation conducted at ${LAB_DETAILS.name}`,
    });

    setQuickTestMsg(`Test "${quickTestName.trim()}" added to rate chart!`);
    setQuickTestName('');
    setQuickTestPrice('');
    setTimeout(() => setQuickTestMsg(''), 3000);
  };

  // Handle adding new custom package
  const handleCreatePackageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPkgName.trim() || newPkgSelectedTestIds.length === 0) {
      alert('Please enter a package name and select at least one test.');
      return;
    }

    const selectedTestsList = tests.filter((t) => newPkgSelectedTestIds.includes(t.id));
    const calculatedOriginal = selectedTestsList.reduce((acc, t) => acc + t.price, 0);
    const finalPrice = parseFloat(newPkgPrice) || calculatedOriginal;

    addNewPackage({
      name: newPkgName.trim(),
      description: newPkgDesc.trim() || 'Comprehensive doctor recommended health checkup profile.',
      testIds: newPkgSelectedTestIds,
      testNames: selectedTestsList.map((t) => t.name),
      originalPrice: parseFloat(newPkgOriginalPrice) || calculatedOriginal,
      packagePrice: finalPrice,
      recommendedFor: newPkgRecommended.trim() || 'Adults and families for routine prevention',
      isPopular: false,
      isActive: true,
    });

    setShowAddPackageModal(false);
    setNewPkgName('');
    setNewPkgDesc('');
    setNewPkgPrice('');
    setNewPkgOriginalPrice('');
    setNewPkgSelectedTestIds([]);
  };

  // Handle walkin patient creation
  const handleWalkinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!walkinName.trim() || !walkinPhone.trim() || walkinSelectedTestIds.length === 0) {
      alert('Please fill patient name, mobile, and select at least one test.');
      return;
    }

    const selectedTests = tests.filter((t) => walkinSelectedTestIds.includes(t.id));
    const total = selectedTests.reduce((acc, t) => acc + t.price, 0);

    const newBooking = createBooking({
      patientName: walkinName.trim(),
      patientAge: parseInt(walkinAge, 10) || 30,
      patientGender: walkinGender,
      patientPhone: walkinPhone.trim(),
      serviceType: 'lab_visit',
      scheduledDate: new Date().toISOString().split('T')[0],
      scheduledTimeSlot: 'Immediate Walk-in',
      tests: selectedTests.map((t) => ({ id: t.id, name: t.name, price: t.price })),
      totalAmount: total,
      paymentStatus: 'Paid at Counter',
      referringDoctor: walkinDoctor.trim() || 'Walk-in Self',
    });

    setWalkinSuccessMsg(`Walk-in Patient registered with Booking ID: ${newBooking.id}!`);
    setWalkinName('');
    setWalkinAge('');
    setWalkinPhone('');
    setWalkinDoctor('');
    setWalkinSelectedTestIds([]);
    setTimeout(() => setWalkinSuccessMsg(''), 4000);
  };

  // Handle password change
  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    setPassError('');
    setPassSuccess('');

    const actualCurrent = getAdminPassword();
    if (currentPass.trim() !== actualCurrent) {
      setPassError('Current password is not correct.');
      return;
    }

    if (!newPass.trim() || newPass.trim().length < 4) {
      setPassError('New password must be at least 4 characters long.');
      return;
    }

    if (newPass !== confirmPass) {
      setPassError('New password and confirm password do not match.');
      return;
    }

    const saved = setAdminPassword(newPass.trim());
    if (saved) {
      setPassSuccess('Admin password changed successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
    } else {
      setPassError('Failed to update password.');
    }
  };

  // Handle data backup download
  const handleDownloadBackup = () => {
    const jsonStr = exportBackupData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().split('T')[0];
    link.href = url;
    link.download = `MQ_Diagnostic_Backup_${dateStr}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setBackupMsg('Backup file successfully downloaded!');
    setTimeout(() => setBackupMsg(''), 3000);
  };

  // Handle backup restore file import
  const handleRestoreFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const res = importBackupData(content);
      if (res.success) {
        setBackupMsg(res.message);
      } else {
        alert(res.message);
      }
    };
    reader.readAsText(file);
  };

  // Handle report data reset
  const handleResetReports = () => {
    if (confirm('Are you sure you want to clear all patient bookings and uploaded reports? This action cannot be undone.')) {
      resetReportsAndBookings();
      setBackupMsg('All patient booking records and reports have been reset.');
      setTimeout(() => setBackupMsg(''), 4000);
    }
  };

  return (
    <div className="w-full">
      {/* Top Admin Header with Log Out Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              MQ Diagnostic Care — Administrator Portal
            </h2>
          </div>
          <p className="text-xs text-slate-500">
            Real-time appointment tracking, scanned report uploader, rate chart &amp; security settings
          </p>
        </div>

        {/* Tab switchers + Log Out */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex bg-white p-1 rounded-2xl border border-slate-200 shadow-2xs text-xs font-semibold overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'bookings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Bookings ({bookings.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('pricing')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'pricing'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5" />
              <span>Rates ({tests.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('packages')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'packages'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-teal-500" />
              <span>Packages ({packages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('walkin')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'walkin'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Walk-in</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'settings'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-500" />
              <span>Settings &amp; Backup</span>
            </button>
          </div>

          {/* Share Portal & Counter QR Button */}
          <button
            onClick={() => onOpenShare?.('admin')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold text-xs rounded-xl border border-sky-200 transition"
            title="Share website link or counter QR standee"
          >
            <Share2 className="w-3.5 h-3.5 text-sky-600" />
            <span>Share Portal &amp; QR</span>
          </button>

          {/* Explicit Admin Log Out Button (Requested) */}
          <button
            onClick={onLogout}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs rounded-xl border border-red-200 transition"
            title="Log out of Admin Dashboard"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Total Bookings
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {metrics.total}
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
            <Users className="w-3 h-3 text-sky-600" />
            Trisulia &amp; Baranga
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-amber-600 block tracking-wider">
            Pending / Confirmed
          </span>
          <div className="text-2xl font-black text-amber-700 mt-1">
            {metrics.pending}
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3 text-amber-500" />
            Awaiting sample
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-sky-600 block tracking-wider">
            In Lab Processing
          </span>
          <div className="text-2xl font-black text-sky-800 mt-1">
            {metrics.processing}
          </div>
          <span className="text-[11px] text-slate-500 flex items-center gap-1 mt-1">
            <Activity className="w-3 h-3 text-sky-500" />
            Sample at analyzer
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[10px] font-bold uppercase text-emerald-600 block tracking-wider">
            Reports Released
          </span>
          <div className="text-2xl font-black text-emerald-700 mt-1">
            {metrics.reportReady}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <CheckCircle className="w-3 h-3" />
            Scanned &amp; Downloadable
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs col-span-2 md:col-span-1">
          <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider">
            Estimated Revenue
          </span>
          <div className="text-2xl font-black text-slate-900 mt-1">
            ₹{metrics.totalRevenue.toLocaleString('en-IN')}
          </div>
          <span className="text-[11px] text-teal-600 font-semibold flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3" />
            Active volume
          </span>
        </div>
      </div>

      {/* TAB 1: BOOKINGS & SCANNED REPORTS */}
      {activeTab === 'bookings' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search patient, ID (MQ-1001), phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none text-xs">
              <span className="text-slate-400 font-bold mr-1 shrink-0">Status:</span>
              {['All', 'Confirmed', 'Sample Collected', 'Processing', 'Report Ready'].map((st) => (
                <button
                  key={st}
                  onClick={() => setStatusFilter(st)}
                  className={`px-3 py-1 rounded-lg font-medium whitespace-nowrap transition ${
                    statusFilter === st
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                    <th className="p-3.5">Booking / Patient</th>
                    <th className="p-3.5">Type &amp; Schedule</th>
                    <th className="p-3.5">Tests Undertaken</th>
                    <th className="p-3.5">Amount</th>
                    <th className="p-3.5">Status Flow</th>
                    <th className="p-3.5">Scanned Report</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No appointments found matching current filters.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => {
                      const hasScannedReport = Boolean(b.scannedReport?.fileDataUrl);

                      return (
                        <tr key={b.id} className="hover:bg-slate-50/70 transition">
                          <td className="p-3.5">
                            <div>
                              <span className="font-mono font-bold text-sky-800 text-xs block">
                                {b.id}
                              </span>
                              <span className="font-bold text-slate-900 text-sm block">
                                {b.patientName}
                              </span>
                              <span className="text-[11px] text-slate-500">
                                {b.patientAge}y/{b.patientGender} • 📞 {b.patientPhone}
                              </span>
                            </div>
                          </td>

                          <td className="p-3.5">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase mb-1 ${
                                b.serviceType === 'home_collection'
                                  ? 'bg-teal-50 text-teal-800 border border-teal-200'
                                  : 'bg-sky-50 text-sky-800 border border-sky-200'
                              }`}
                            >
                              {b.serviceType === 'home_collection' ? '🏠 Home Collection' : '🏥 Lab Visit'}
                            </span>
                            <div className="text-[11px] text-slate-700 font-medium">
                              {b.scheduledDate}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {b.scheduledTimeSlot}
                            </div>
                            {b.address && (
                              <div className="text-[10px] text-slate-500 truncate max-w-[150px]" title={b.address}>
                                📍 {b.address}
                              </div>
                            )}
                          </td>

                          <td className="p-3.5">
                            <div className="flex flex-wrap gap-1 max-w-xs">
                              {b.tests.slice(0, 3).map((t) => (
                                <span
                                  key={t.id}
                                  className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-700 truncate max-w-[120px]"
                                  title={t.name}
                                >
                                  {t.name}
                                </span>
                              ))}
                              {b.tests.length > 3 && (
                                <span className="px-1.5 py-0.5 bg-sky-50 text-sky-700 rounded text-[10px] font-bold">
                                  +{b.tests.length - 3} more
                                </span>
                              )}
                            </div>
                          </td>

                          <td className="p-3.5 font-bold text-slate-900 text-sm">
                            ₹{b.totalAmount}
                            <span className="block text-[10px] font-normal text-slate-400">
                              {b.paymentStatus}
                            </span>
                          </td>

                          <td className="p-3.5">
                            <select
                              value={b.status}
                              onChange={(e) => updateBookingStatus(b.id, e.target.value as any)}
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-hidden ${
                                b.status === 'Report Ready'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : b.status === 'Processing'
                                  ? 'bg-sky-50 text-sky-800 border-sky-300'
                                  : b.status === 'Sample Collected'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-slate-100 text-slate-800 border-slate-300'
                              }`}
                            >
                              <option value="Confirmed">Confirmed</option>
                              <option value="Sample Collected">Sample Collected</option>
                              <option value="Processing">In Lab Processing</option>
                              <option value="Report Ready">Report Ready ✓</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          <td className="p-3.5">
                            {hasScannedReport ? (
                              <div>
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  <Check className="w-3 h-3" /> Uploaded
                                </span>
                                <span className="block text-[10px] text-slate-400 truncate max-w-[120px] font-mono mt-0.5" title={b.scannedReport?.fileName}>
                                  {b.scannedReport?.fileName}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[11px] text-slate-400 italic">
                                Not uploaded yet
                              </span>
                            )}
                          </td>

                          <td className="p-3.5 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                onClick={() => {
                                  setUploadModalBooking(b);
                                  setSelectedFile(null);
                                }}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 transition"
                                title="Upload scanned report image/PDF"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>{hasScannedReport ? 'Replace' : 'Upload'}</span>
                              </button>

                              {hasScannedReport && (
                                <button
                                  onClick={() => onOpenReportModal(b)}
                                  className="p-1.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-lg transition"
                                  title="Preview Report"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>
                              )}

                              {/* Share with Patient on WhatsApp */}
                              <button
                                onClick={() => onOpenShare?.('admin', b)}
                                className="p-1.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition"
                                title="Share report ready link with patient via WhatsApp"
                              >
                                <Share2 className="w-4 h-4 text-emerald-600" />
                              </button>

                              <button
                                onClick={() => {
                                  if (confirm(`Delete booking ${b.id} for ${b.patientName}?`)) {
                                    deleteBooking(b.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-slate-100 rounded-lg transition"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRICE CHART EDITOR */}
      {activeTab === 'pricing' && (
        <div className="space-y-6">
          {/* Quick Add Inline */}
          <div className="bg-gradient-to-r from-sky-50 via-teal-50 to-emerald-50 rounded-2xl p-5 border border-sky-200 shadow-2xs">
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-4 h-4 text-sky-700" />
              <h3 className="font-extrabold text-slate-900 text-sm">
                Quick Add New Pathological Test
              </h3>
            </div>

            {quickTestMsg && (
              <div className="bg-emerald-100 text-emerald-800 text-xs px-3 py-1.5 rounded-lg mb-3 flex items-center gap-1.5 font-bold">
                <Check className="w-4 h-4" />
                <span>{quickTestMsg}</span>
              </div>
            )}

            <form onSubmit={handleQuickAddTest} className="grid grid-cols-1 sm:grid-cols-5 gap-3">
              <div className="sm:col-span-2">
                <input
                  type="text"
                  required
                  placeholder="Test Name (e.g. D-Dimer, Ferritin...)"
                  value={quickTestName}
                  onChange={(e) => setQuickTestName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <input
                  type="number"
                  required
                  min="0"
                  placeholder="Price (₹)"
                  value={quickTestPrice}
                  onChange={(e) => setQuickTestPrice(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm font-bold focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <select
                  value={quickTestCategory}
                  onChange={(e) => setQuickTestCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Diabetes Care">Diabetes Care</option>
                  <option value="Endocrinology">Endocrinology</option>
                  <option value="Vitamins">Vitamins</option>
                  <option value="Infectious">Infectious</option>
                  <option value="Electrolytes">Electrolytes</option>
                  <option value="Urine & Stool">Urine & Stool</option>
                </select>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm py-2 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Test</span>
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-teal-600" />
                Live Rate Chart Editor ({tests.length} tests)
              </h3>
              <p className="text-xs text-slate-500">
                Update prices in real-time. Changes immediately reflect across the customer portal.
              </p>
            </div>

            <button
              onClick={() => {
                if (confirm('Reset all test prices to original printed poster rates?')) {
                  resetTestsToDefault();
                  setEditingPriceMap({});
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition"
              title="Restore default poster prices"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restore Poster Rates</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 uppercase font-bold text-[11px] tracking-wider">
                    <th className="p-3.5">Test Code</th>
                    <th className="p-3.5">Test Full Name</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Sample Type</th>
                    <th className="p-3.5 w-40">Current Rate (₹)</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tests.map((test) => {
                    const currentEditVal =
                      editingPriceMap[test.id] !== undefined
                        ? editingPriceMap[test.id]
                        : test.price;
                    const isChanged = currentEditVal !== test.price;
                    const isSaved = priceSaveSuccess === test.id;

                    return (
                      <tr key={test.id} className="hover:bg-slate-50/60 transition">
                        <td className="p-3.5 font-mono font-bold text-slate-800">
                          {test.code}
                        </td>
                        <td className="p-3.5 font-bold text-slate-900">
                          {test.name}
                        </td>
                        <td className="p-3.5 text-slate-500">
                          <span className="bg-slate-100 px-2 py-0.5 rounded font-medium">
                            {test.category}
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-500">
                          {test.sampleType}
                        </td>
                        <td className="p-3.5">
                          <div className="flex items-center gap-1.5">
                            <span className="text-slate-400 font-bold">₹</span>
                            <input
                              type="number"
                              min="0"
                              step="10"
                              value={currentEditVal}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value) || 0;
                                setEditingPriceMap((prev) => ({
                                  ...prev,
                                  [test.id]: val,
                                }));
                              }}
                              className={`w-28 px-2.5 py-1 rounded-lg border font-mono font-bold text-sm ${
                                isChanged
                                  ? 'border-sky-500 bg-sky-50/50 text-sky-900'
                                  : 'border-slate-300 text-slate-800'
                              } focus:outline-hidden focus:ring-2 focus:ring-sky-500`}
                            />
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="inline-flex items-center gap-1">
                            {isSaved ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 animate-in fade-in">
                                <Check className="w-3.5 h-3.5" /> Saved!
                              </span>
                            ) : (
                              <button
                                onClick={() => handleSavePrice(test.id)}
                                disabled={!isChanged}
                                className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition ${
                                  isChanged
                                    ? 'bg-sky-600 hover:bg-sky-700 text-white shadow-2xs'
                                    : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                }`}
                              >
                                <Save className="w-3.5 h-3.5" />
                                <span>Save</span>
                              </button>
                            )}

                            {test.id.startsWith('test-custom-') && (
                              <button
                                onClick={() => {
                                  if (confirm(`Delete test "${test.name}"?`)) {
                                    deleteTest(test.id);
                                  }
                                }}
                                className="p-1.5 text-slate-400 hover:text-red-600 ml-1 rounded"
                                title="Delete Custom Test"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PACKAGES MANAGER */}
      {activeTab === 'packages' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-extrabold text-slate-900 text-lg flex items-center gap-2">
                <Layers className="w-5 h-5 text-teal-600" />
                Health Packages Manager &amp; Pricing
              </h3>
              <p className="text-xs text-slate-500">
                Create and edit bundled health checkup packages.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowAddPackageModal(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs transition"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Package</span>
              </button>

              <button
                onClick={() => {
                  if (confirm('Reset packages to default presets?')) {
                    resetPackagesToDefault();
                    setEditingPackagePriceMap({});
                  }
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl border border-slate-200 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Packages</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {packages.map((pkg) => {
              const currentPrice =
                editingPackagePriceMap[pkg.id] !== undefined
                  ? editingPackagePriceMap[pkg.id]
                  : pkg.packagePrice;
              const isChanged = currentPrice !== pkg.packagePrice;
              const isSaved = packageSaveSuccess === pkg.id;

              return (
                <div
                  key={pkg.id}
                  className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[10px] font-extrabold uppercase bg-teal-50 text-teal-800 px-2 py-0.5 rounded border border-teal-200">
                        Package ID: {pkg.id}
                      </span>
                    </div>

                    <h4 className="font-bold text-slate-900 text-base">
                      {pkg.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {pkg.description}
                    </p>

                    <div className="mt-3 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                      <span className="text-[10px] font-bold uppercase text-slate-400 block tracking-wider mb-1">
                        Included Tests ({pkg.testNames.length}):
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {pkg.testNames.map((name, i) => (
                          <span
                            key={i}
                            className="bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px] text-slate-700 font-medium"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold">
                          Orig: ₹{pkg.originalPrice}
                        </span>
                        <div className="flex items-center gap-1">
                          <span className="text-xs text-slate-500 font-bold">₹</span>
                          <input
                            type="number"
                            min="0"
                            step="50"
                            value={currentPrice}
                            onChange={(e) => {
                              const val = parseFloat(e.target.value) || 0;
                              setEditingPackagePriceMap((prev) => ({
                                ...prev,
                                [pkg.id]: val,
                              }));
                            }}
                            className={`w-24 px-2 py-1 rounded-lg border font-mono font-bold text-sm ${
                              isChanged ? 'border-teal-500 bg-teal-50/50' : 'border-slate-300'
                            }`}
                          />
                        </div>
                      </div>

                      {isSaved ? (
                        <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" /> Saved!
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSavePackagePrice(pkg.id)}
                          disabled={!isChanged}
                          className={`px-3 py-1 text-xs font-bold rounded-lg transition ${
                            isChanged
                              ? 'bg-teal-600 text-white hover:bg-teal-700'
                              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                          }`}
                        >
                          Save
                        </button>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(`Delete package "${pkg.name}"?`)) {
                          deletePackage(pkg.id);
                        }
                      }}
                      className="text-slate-400 hover:text-red-600 p-1.5 rounded"
                      title="Delete package"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: WALK-IN PATIENT REGISTRATION */}
      {activeTab === 'walkin' && (
        <div className="max-w-2xl mx-auto bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="border-b border-slate-200 pb-4 mb-6">
            <h3 className="font-extrabold text-slate-900 text-xl flex items-center gap-2">
              <Plus className="w-5 h-5 text-sky-600" />
              Register Direct Walk-in Patient
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Add patients arriving directly at MQ Diagnostic Care counter (Trisulia, Baranga)
            </p>
          </div>

          {walkinSuccessMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm p-4 rounded-xl flex items-center gap-2 mb-6">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{walkinSuccessMsg}</span>
            </div>
          )}

          <form onSubmit={handleWalkinSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Patient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bijay Mohapatra"
                  value={walkinName}
                  onChange={(e) => setWalkinName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Age *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="120"
                    required
                    placeholder="Age"
                    value={walkinAge}
                    onChange={(e) => setWalkinAge(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Gender *
                  </label>
                  <select
                    value={walkinGender}
                    onChange={(e) => setWalkinGender(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
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
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Mobile Number *
                </label>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="10-digit mobile"
                  value={walkinPhone}
                  onChange={(e) => setWalkinPhone(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Referring Doctor
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Jena / Self"
                  value={walkinDoctor}
                  onChange={(e) => setWalkinDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2">
                Select Investigations / Tests * ({walkinSelectedTestIds.length} selected)
              </label>
              <div className="max-h-52 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50 divide-y divide-slate-100">
                {tests.map((test) => {
                  const isChecked = walkinSelectedTestIds.includes(test.id);
                  return (
                    <label
                      key={test.id}
                      className="py-1.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-100/60 px-2 rounded"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setWalkinSelectedTestIds((prev) => [...prev, test.id]);
                            } else {
                              setWalkinSelectedTestIds((prev) =>
                                prev.filter((id) => id !== test.id)
                              );
                            }
                          }}
                          className="rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span className="font-semibold text-slate-800">{test.name}</span>
                      </div>
                      <span className="font-bold text-slate-900">₹{test.price}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Counter Bill:</span>
                <span className="text-xl font-black text-slate-900">
                  ₹{tests.filter((t) => walkinSelectedTestIds.includes(t.id)).reduce((acc, t) => acc + t.price, 0)}
                </span>
              </div>

              <button
                type="submit"
                className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition"
              >
                Register &amp; Print Slip
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: SETTINGS, PASSWORD CHANGE, DATA BACKUP & REPORT RESET (Requested) */}
      {activeTab === 'settings' && (
        <div className="max-w-4xl mx-auto space-y-6">
          {backupMsg && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm p-4 rounded-2xl flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>{backupMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PASSWORD CHANGE PANEL (Requested: Password change) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-200">
                    <KeyRound className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Change Admin Password
                    </h3>
                    <p className="text-xs text-slate-500">
                      Update your administrator password / PIN
                    </p>
                  </div>
                </div>

                {passError && (
                  <div className="mt-3 bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                    <span>{passError}</span>
                  </div>
                )}

                {passSuccess && (
                  <div className="mt-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
                    <span>{passSuccess}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChange} className="mt-4 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Current Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Enter current password"
                      value={currentPass}
                      onChange={(e) => setCurrentPass(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      New Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Minimum 4 characters"
                      value={newPass}
                      onChange={(e) => setNewPass(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Confirm New Password *
                    </label>
                    <input
                      type="password"
                      required
                      placeholder="Repeat new password"
                      value={confirmPass}
                      onChange={(e) => setConfirmPass(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm font-mono"
                    />
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      className="w-full bg-slate-900 hover:bg-black text-white font-bold text-xs sm:text-sm py-2.5 rounded-xl shadow-xs transition"
                    >
                      Update Password
                    </button>
                  </div>
                </form>
              </div>
            </div>

            {/* DATA BACKUP & RESTORE PANEL (Requested: data backup option) */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-xl bg-sky-50 text-sky-600 border border-sky-200">
                    <FolderArchive className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900 text-base">
                      Laboratory Data Backup
                    </h3>
                    <p className="text-xs text-slate-500">
                      Export and restore all bookings, reports &amp; rate charts
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Download a complete JSON snapshot of all patient appointments, uploaded scanned reports, custom added tests, and pricing.
                </p>

                <div className="mt-5 space-y-3">
                  <button
                    onClick={handleDownloadBackup}
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-xs transition flex items-center justify-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Full Backup (.JSON)</span>
                  </button>

                  <input
                    type="file"
                    ref={backupFileInputRef}
                    accept="application/json"
                    onChange={handleRestoreFileSelected}
                    className="hidden"
                  />

                  <button
                    onClick={() => backupFileInputRef.current?.click()}
                    className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs sm:text-sm py-2.5 px-4 rounded-xl border border-slate-300 transition flex items-center justify-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Restore from Backup File</span>
                  </button>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 text-[11px] text-slate-400">
                Backups preserve patient records and rate configurations locally.
              </div>
            </div>
          </div>

          {/* REPORT DATA RESET PANEL (Requested: Report data reset) */}
          <div className="bg-white rounded-3xl p-6 border border-red-200 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-red-700 font-extrabold text-base mb-1">
                  <AlertCircle className="w-5 h-5" />
                  <span>Report Data Reset &amp; Cleanup</span>
                </div>
                <p className="text-xs text-slate-600 max-w-xl">
                  Clear all patient booking appointments and uploaded reports for a clean slate, or restore factory demo samples.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleResetReports}
                  className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition flex items-center gap-1.5"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Reset All Report Data</span>
                </button>

                <button
                  onClick={() => {
                    if (confirm('Restore standard sample demo bookings?')) {
                      restoreDefaultSeedBookings();
                      setBackupMsg('Default demo bookings restored!');
                      setTimeout(() => setBackupMsg(''), 3000);
                    }
                  }}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-300 transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Restore Demo Bookings</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* UPLOAD REPORT MODAL */}
      {uploadModalBooking && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileUp className="w-5 h-5 text-teal-400" />
                <h3 className="font-bold text-base text-white">
                  Upload Scanned Report for {uploadModalBooking.patientName}
                </h3>
              </div>
              <button
                onClick={() => setUploadModalBooking(null)}
                className="text-slate-400 hover:text-white p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-5">
              {uploadSuccessMsg && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs p-3 rounded-xl flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>{uploadSuccessMsg}</span>
                </div>
              )}

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs flex justify-between">
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Patient</span>
                  <span className="font-bold text-slate-800">{uploadModalBooking.patientName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Booking Ref</span>
                  <span className="font-mono font-bold text-sky-800">{uploadModalBooking.id}</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold uppercase text-[10px]">Phone</span>
                  <span className="font-medium text-slate-700">{uploadModalBooking.patientPhone}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                  Select Scanned Report File (Image or PDF) *
                </label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png,image/jpeg,image/webp,image/svg+xml,application/pdf"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <div
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                    selectedFile
                      ? 'border-emerald-500 bg-emerald-50/30'
                      : 'border-slate-300 hover:border-sky-500 bg-slate-50/50 hover:bg-sky-50/20'
                  }`}
                >
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                        <Check className="w-6 h-6 stroke-[3]" />
                      </div>
                      <div className="text-xs font-bold text-slate-900 truncate max-w-sm">
                        {selectedFile.file.name}
                      </div>
                      <span className="text-[11px] text-slate-500">
                        {Math.round(selectedFile.file.size / 1024)} KB • Type: {selectedFile.type.toUpperCase()}
                      </span>
                      <span className="text-[11px] text-sky-600 font-semibold underline mt-1">
                        Click to choose another file
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center">
                        <Upload className="w-6 h-6" />
                      </div>
                      <div className="text-xs font-bold text-slate-800">
                        Click or drag &amp; drop scanned report here
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Supports Scanned PNG, JPG, WEBP, SVG or PDF files directly from lab scanner
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Verifying Pathologist / Lab Director
                </label>
                <input
                  type="text"
                  value={verifiedByDoctor}
                  onChange={(e) => setVerifiedByDoctor(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pathologist Clinical Remarks
                </label>
                <textarea
                  rows={2}
                  value={uploadNotes}
                  onChange={(e) => setUploadNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  placeholder="e.g. All parameters verified and biologically correlated."
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setUploadModalBooking(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveUploadedReport}
                  disabled={!selectedFile || isUploading}
                  className="bg-gradient-to-r from-sky-600 to-teal-600 hover:from-sky-700 hover:to-teal-700 disabled:opacity-50 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-md transition flex items-center gap-2"
                >
                  <FileUp className="w-4 h-4" />
                  <span>{isUploading ? 'Uploading...' : 'Publish Report to Patient'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE PACKAGE MODAL */}
      {showAddPackageModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 border border-slate-200">
            <div className="bg-slate-900 text-white px-5 py-4 flex items-center justify-between">
              <h3 className="font-bold text-base text-white">Create Custom Health Package</h3>
              <button onClick={() => setShowAddPackageModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreatePackageSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Package Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heart & Lipid Wellness Profile"
                  value={newPkgName}
                  onChange={(e) => setNewPkgName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  placeholder="Short description of this health checkup package"
                  value={newPkgDesc}
                  onChange={(e) => setNewPkgDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Package Price (₹) *</label>
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="Discounted Rate"
                    value={newPkgPrice}
                    onChange={(e) => setNewPkgPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Original Price (₹)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="Standard Total"
                    value={newPkgOriginalPrice}
                    onChange={(e) => setNewPkgOriginalPrice(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Recommended For</label>
                <input
                  type="text"
                  placeholder="e.g. Adults aged 30+, individuals with sedentary lifestyle"
                  value={newPkgRecommended}
                  onChange={(e) => setNewPkgRecommended(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Select Tests to Bundle * ({newPkgSelectedTestIds.length} selected)
                </label>
                <div className="max-h-44 overflow-y-auto border border-slate-200 rounded-xl p-2.5 bg-slate-50 divide-y divide-slate-100">
                  {tests.map((test) => {
                    const isChecked = newPkgSelectedTestIds.includes(test.id);
                    return (
                      <label key={test.id} className="py-1.5 flex items-center justify-between text-xs cursor-pointer hover:bg-slate-100/60 px-2 rounded">
                        <div className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setNewPkgSelectedTestIds((prev) => [...prev, test.id]);
                              } else {
                                setNewPkgSelectedTestIds((prev) => prev.filter((id) => id !== test.id));
                              }
                            }}
                            className="rounded text-teal-600 focus:ring-teal-500"
                          />
                          <span className="font-semibold text-slate-800">{test.name}</span>
                        </div>
                        <span className="text-slate-500 font-mono">₹{test.price}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-between">
                <button
                  type="button"
                  onClick={() => setShowAddPackageModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs sm:text-sm px-5 py-2 rounded-xl shadow-xs"
                >
                  Save Health Package
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
