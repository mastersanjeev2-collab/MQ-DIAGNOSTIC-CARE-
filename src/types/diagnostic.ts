export type BookingStatus =
  | 'Pending'
  | 'Confirmed'
  | 'Sample Collected'
  | 'Processing'
  | 'Report Ready'
  | 'Cancelled';

export type SampleType = 'Blood' | 'Urine' | 'Stool' | 'Swab' | 'Serum' | 'Other';

export interface TestItem {
  id: string;
  name: string;
  code: string;
  category: string;
  price: number;
  sampleType: SampleType;
  turnaroundTime?: string;
  fastingRequired: boolean;
  fastingNote?: string;
  description?: string;
  isPopular?: boolean;
  isActive: boolean;
}

export interface HealthPackage {
  id: string;
  name: string;
  description: string;
  testIds: string[];
  testNames: string[];
  originalPrice: number;
  packagePrice: number;
  recommendedFor: string;
  isPopular?: boolean;
  isActive?: boolean;
}

export interface TestResultParameter {
  name: string;
  result: string;
  unit: string;
  referenceRange: string;
  status: 'Normal' | 'High' | 'Low' | 'Borderline';
}

export interface ScannedReportFile {
  fileName: string;
  fileType: 'image' | 'pdf';
  fileDataUrl: string; // Base64 data URL
  uploadedAt: string;
  fileSizeKb?: number;
}

export interface DiagnosticBooking {
  id: string; // e.g., MQ-2026-1001
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  patientEmail?: string;
  serviceType: 'lab_visit' | 'home_collection';
  address?: string;
  cityArea?: string; // Trisulia / Baranga / Nearby
  scheduledDate: string; // YYYY-MM-DD
  scheduledTimeSlot: string; // e.g. "07:00 AM - 09:00 AM"
  tests: {
    id: string;
    name: string;
    price: number;
  }[];
  healthPackages?: {
    id: string;
    name: string;
    price: number;
  }[];
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: 'Pending at Collection' | 'Paid Online' | 'Paid at Counter';
  referringDoctor?: string;
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  
  // Scanned Report uploaded by Admin
  scannedReport?: ScannedReportFile;
  
  // Digital report parameters filled by lab or auto-generated
  digitalReportParameters?: TestResultParameter[];
  pathologistNotes?: string;
  verifiedBy?: string;
  reportReleasedAt?: string;
}

export interface LabInfo {
  name: string;
  tagline: string;
  subtag: string;
  address: string;
  contactNumber: string;
  whatsappNumber: string;
  email: string;
  timings: string;
  homeCollectionCoverage: string;
}
