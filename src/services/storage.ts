import { DiagnosticBooking, TestItem, HealthPackage, ScannedReportFile, TestResultParameter } from '../types/diagnostic';
import { INITIAL_TESTS, DEFAULT_PACKAGES } from '../data/defaultTests';
import { SEED_BOOKINGS } from '../data/seedBookings';

const STORAGE_KEYS = {
  TESTS: 'mq_diagnostic_tests_v2',
  PACKAGES: 'mq_diagnostic_packages_v2',
  BOOKINGS: 'mq_diagnostic_bookings_v2',
  ADMIN_PASSWORD: 'mq_admin_password_v1',
};

// Custom event to broadcast state changes across components in real-time
export const MQ_DATA_UPDATED_EVENT = 'mq_data_updated';

function triggerUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(MQ_DATA_UPDATED_EVENT));
  }
}

// ----------------- ADMIN SECURITY & PASSWORD -----------------

export function getAdminPassword(): string {
  if (typeof window === 'undefined') return '1234';
  try {
    const saved = localStorage.getItem(STORAGE_KEYS.ADMIN_PASSWORD);
    return saved || '1234';
  } catch {
    return '1234';
  }
}

export function setAdminPassword(newPassword: string): boolean {
  try {
    if (!newPassword || newPassword.trim().length === 0) return false;
    localStorage.setItem(STORAGE_KEYS.ADMIN_PASSWORD, newPassword.trim());
    return true;
  } catch (err) {
    console.error('Failed to set admin password:', err);
    return false;
  }
}

export function verifyAdminPassword(passwordInput: string): boolean {
  const current = getAdminPassword();
  return passwordInput.trim() === current;
}

// ----------------- TESTS & PRICING STORAGE -----------------

export function getStoredTests(): TestItem[] {
  if (typeof window === 'undefined') return INITIAL_TESTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TESTS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(INITIAL_TESTS));
      return INITIAL_TESTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading tests from storage:', err);
    return INITIAL_TESTS;
  }
}

export function saveTests(tests: TestItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(tests));
    triggerUpdate();
  } catch (err) {
    console.error('Error saving tests to storage:', err);
  }
}

export function updateTestPrice(testId: string, newPrice: number): boolean {
  const tests = getStoredTests();
  const index = tests.findIndex((t) => t.id === testId);
  if (index !== -1) {
    tests[index] = {
      ...tests[index],
      price: Math.max(0, newPrice),
    };
    saveTests(tests);
    return true;
  }
  return false;
}

export function updateTestDetails(updatedTest: TestItem): boolean {
  const tests = getStoredTests();
  const index = tests.findIndex((t) => t.id === updatedTest.id);
  if (index !== -1) {
    tests[index] = { ...updatedTest };
    saveTests(tests);
    return true;
  }
  return false;
}

export function addNewTest(newTest: Omit<TestItem, 'id'>): TestItem {
  const tests = getStoredTests();
  const test: TestItem = {
    ...newTest,
    id: `test-custom-${Date.now()}`,
  };
  tests.push(test);
  saveTests(tests);
  return test;
}

export function deleteTest(testId: string): boolean {
  const tests = getStoredTests();
  const filtered = tests.filter((t) => t.id !== testId);
  if (filtered.length !== tests.length) {
    saveTests(filtered);
    return true;
  }
  return false;
}

export function resetTestsToDefault(): TestItem[] {
  saveTests(INITIAL_TESTS);
  return INITIAL_TESTS;
}

// ----------------- HEALTH PACKAGES STORAGE -----------------

export function getStoredPackages(): HealthPackage[] {
  if (typeof window === 'undefined') return DEFAULT_PACKAGES;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PACKAGES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
      return DEFAULT_PACKAGES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading packages from storage:', err);
    return DEFAULT_PACKAGES;
  }
}

export function savePackages(packages: HealthPackage[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(packages));
    triggerUpdate();
  } catch (err) {
    console.error('Error saving packages to storage:', err);
  }
}

export function updatePackagePrice(packageId: string, newPrice: number): boolean {
  const pkgs = getStoredPackages();
  const index = pkgs.findIndex((p) => p.id === packageId);
  if (index !== -1) {
    pkgs[index] = {
      ...pkgs[index],
      packagePrice: Math.max(0, newPrice),
    };
    savePackages(pkgs);
    return true;
  }
  return false;
}

export function updatePackage(updatedPackage: HealthPackage): boolean {
  const pkgs = getStoredPackages();
  const index = pkgs.findIndex((p) => p.id === updatedPackage.id);
  if (index !== -1) {
    pkgs[index] = { ...updatedPackage };
    savePackages(pkgs);
    return true;
  }
  return false;
}

export function addNewPackage(newPackage: Omit<HealthPackage, 'id'>): HealthPackage {
  const pkgs = getStoredPackages();
  const pkg: HealthPackage = {
    ...newPackage,
    id: `pkg-${Date.now()}`,
    isActive: true,
  };
  pkgs.push(pkg);
  savePackages(pkgs);
  return pkg;
}

export function deletePackage(packageId: string): boolean {
  const pkgs = getStoredPackages();
  const filtered = pkgs.filter((p) => p.id !== packageId);
  if (filtered.length !== pkgs.length) {
    savePackages(filtered);
    return true;
  }
  return false;
}

export function resetPackagesToDefault(): HealthPackage[] {
  savePackages(DEFAULT_PACKAGES);
  return DEFAULT_PACKAGES;
}

// ----------------- BOOKINGS STORAGE -----------------

export function getStoredBookings(): DiagnosticBooking[] {
  if (typeof window === 'undefined') return SEED_BOOKINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
      return SEED_BOOKINGS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading bookings from storage:', err);
    return SEED_BOOKINGS;
  }
}

export function saveBookings(bookings: DiagnosticBooking[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookings));
    triggerUpdate();
  } catch (err) {
    console.error('Error saving bookings to storage:', err);
  }
}

export function createBooking(
  bookingData: Omit<DiagnosticBooking, 'id' | 'createdAt' | 'updatedAt' | 'status'>
): DiagnosticBooking {
  const bookings = getStoredBookings();
  const nextNum = 1000 + bookings.length + 1;
  const currentYear = new Date().getFullYear();
  const newId = `MQ-${currentYear}-${nextNum}`;

  const now = new Date().toISOString();
  const newBooking: DiagnosticBooking = {
    ...bookingData,
    id: newId,
    status: 'Confirmed',
    createdAt: now,
    updatedAt: now,
  };

  const updatedBookings = [newBooking, ...bookings];
  saveBookings(updatedBookings);
  return newBooking;
}

export function updateBookingStatus(bookingId: string, status: DiagnosticBooking['status']): boolean {
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => b.id.toLowerCase() === bookingId.toLowerCase());
  if (index !== -1) {
    bookings[index] = {
      ...bookings[index],
      status,
      updatedAt: new Date().toISOString(),
    };
    saveBookings(bookings);
    return true;
  }
  return false;
}

export function uploadReportToBooking(
  bookingId: string,
  reportFile: ScannedReportFile,
  digitalParameters?: TestResultParameter[],
  notes?: string,
  verifiedBy?: string
): boolean {
  const bookings = getStoredBookings();
  const index = bookings.findIndex((b) => b.id.toLowerCase() === bookingId.toLowerCase());
  if (index !== -1) {
    const now = new Date();
    const formattedDate = `${now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

    bookings[index] = {
      ...bookings[index],
      status: 'Report Ready',
      scannedReport: reportFile,
      digitalReportParameters: digitalParameters || bookings[index].digitalReportParameters,
      pathologistNotes: notes || 'Tests processed according to standard quality protocols. Clinically correlated.',
      verifiedBy: verifiedBy || 'Dr. A. K. Behera, MD (Consultant Pathologist)',
      reportReleasedAt: formattedDate,
      updatedAt: now.toISOString(),
    };
    saveBookings(bookings);
    return true;
  }
  return false;
}

export function deleteBooking(bookingId: string): boolean {
  const bookings = getStoredBookings();
  const filtered = bookings.filter((b) => b.id !== bookingId);
  if (filtered.length !== bookings.length) {
    saveBookings(filtered);
    return true;
  }
  return false;
}

export function findBookingByIdOrPhone(query: string): DiagnosticBooking | undefined {
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return undefined;
  const bookings = getStoredBookings();
  return bookings.find(
    (b) =>
      b.id.toLowerCase() === cleanQuery ||
      b.patientPhone.replace(/\D/g, '').endsWith(cleanQuery.replace(/\D/g, '')) ||
      b.patientPhone.toLowerCase().includes(cleanQuery)
  );
}

// ----------------- BACKUP & REPORT DATA RESET (Requested) -----------------

export function resetReportsAndBookings(): void {
  // Reset all bookings to empty array or clear all reports
  saveBookings([]);
}

export function restoreDefaultSeedBookings(): void {
  saveBookings(SEED_BOOKINGS);
}

export function resetAllDataToDefault(): void {
  localStorage.setItem(STORAGE_KEYS.TESTS, JSON.stringify(INITIAL_TESTS));
  localStorage.setItem(STORAGE_KEYS.PACKAGES, JSON.stringify(DEFAULT_PACKAGES));
  localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(SEED_BOOKINGS));
  triggerUpdate();
}

export function exportBackupData(): string {
  const backup = {
    version: '1.0',
    labName: 'MQ DIAGNOSTIC CARE',
    timestamp: new Date().toISOString(),
    tests: getStoredTests(),
    packages: getStoredPackages(),
    bookings: getStoredBookings(),
  };
  return JSON.stringify(backup, null, 2);
}

export function importBackupData(jsonString: string): { success: boolean; message: string } {
  try {
    const data = JSON.parse(jsonString);
    if (!data.tests && !data.bookings && !data.packages) {
      return { success: false, message: 'Invalid backup file format.' };
    }

    if (Array.isArray(data.tests)) {
      saveTests(data.tests);
    }
    if (Array.isArray(data.packages)) {
      savePackages(data.packages);
    }
    if (Array.isArray(data.bookings)) {
      saveBookings(data.bookings);
    }

    triggerUpdate();
    return { success: true, message: 'Backup successfully restored!' };
  } catch (err: any) {
    return { success: false, message: `Failed to restore: ${err.message || 'Invalid JSON'}` };
  }
}
