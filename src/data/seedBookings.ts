import { DiagnosticBooking } from '../types/diagnostic';

// High-fidelity SVG base64 sample report representing a scanned lab report
const SAMPLE_SCANNED_REPORT_SVG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 1100" width="800" height="1100" style="background:#ffffff; font-family:sans-serif;">
  <!-- Header Background Accent -->
  <rect x="0" y="0" width="800" height="130" fill="#f0fdfa"/>
  <rect x="0" y="0" width="800" height="8" fill="#0284c7"/>
  <rect x="0" y="126" width="800" height="4" fill="#0d9488"/>

  <!-- Logo Emblem -->
  <circle cx="65" cy="65" r="40" fill="#0284c7"/>
  <text x="65" y="77" font-size="34" font-weight="900" fill="#ffffff" text-anchor="middle" font-family="'Plus Jakarta Sans', Arial, sans-serif">MQ</text>
  <circle cx="85" cy="45" r="12" fill="#ef4444"/>
  <text x="85" y="50" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle">+</text>

  <!-- Clinic Header Text -->
  <text x="125" y="52" font-size="28" font-weight="800" fill="#0369a1" letter-spacing="0.5">MQ DIAGNOSTIC CARE</text>
  <text x="125" y="74" font-size="12" font-weight="700" fill="#0d9488" letter-spacing="2">SAMPLE COLLECTION CENTER &amp; PATHOLOGICAL LABORATORY</text>
  <text x="125" y="93" font-size="12" fill="#475569">Address: Trisulia, Baranga | Contact: +91 75046 62885 | Email: mqdiagnosticcare@gmail.com</text>
  <text x="125" y="110" font-size="11" font-weight="600" fill="#64748b">Accurate Testing | Healthier Tomorrow</text>

  <!-- Barcode / QR Placeholder -->
  <rect x="670" y="25" width="90" height="90" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1" rx="4"/>
  <text x="715" y="65" font-size="9" fill="#94a3b8" text-anchor="middle">VERIFIED</text>
  <text x="715" y="80" font-size="11" font-weight="bold" fill="#0369a1" text-anchor="middle">MQ-1001</text>
  <rect x="682" y="35" width="66" height="4" fill="#0284c7"/>
  <rect x="682" y="42" width="66" height="2" fill="#0f172a"/>

  <!-- Watermark in Background -->
  <text x="400" y="580" font-size="110" font-weight="900" fill="#f1f5f9" text-anchor="middle" transform="rotate(-30 400 580)">MQ DIAGNOSTIC</text>

  <!-- Patient Info Box -->
  <rect x="40" y="150" width="720" height="95" rx="6" fill="#f8fafc" stroke="#e2e8f0" stroke-width="1.5"/>
  
  <text x="60" y="176" font-size="12" font-weight="bold" fill="#64748b">PATIENT NAME:</text>
  <text x="170" y="176" font-size="13" font-weight="700" fill="#0f172a">Mr. Rajesh Mohanty</text>
  
  <text x="430" y="176" font-size="12" font-weight="bold" fill="#64748b">BOOKING ID:</text>
  <text x="540" y="176" font-size="13" font-weight="800" fill="#0284c7">MQ-2026-1001</text>

  <text x="60" y="202" font-size="12" font-weight="bold" fill="#64748b">AGE / GENDER:</text>
  <text x="170" y="202" font-size="12" font-weight="600" fill="#1e293b">42 Yrs / Male</text>

  <text x="430" y="202" font-size="12" font-weight="bold" fill="#64748b">COLLECTION DATE:</text>
  <text x="570" y="202" font-size="12" font-weight="600" fill="#1e293b">14 Oct 2026, 07:30 AM</text>

  <text x="60" y="228" font-size="12" font-weight="bold" fill="#64748b">REFERRED BY:</text>
  <text x="170" y="228" font-size="12" font-weight="600" fill="#1e293b">Self / Dr. P. K. Patnaik, MD</text>

  <text x="430" y="228" font-size="12" font-weight="bold" fill="#64748b">REPORT RELEASED:</text>
  <text x="570" y="228" font-size="12" font-weight="600" fill="#1e293b">14 Oct 2026, 01:15 PM</text>

  <!-- Report Title Banner -->
  <rect x="40" y="260" width="720" height="34" fill="#0369a1" rx="4"/>
  <text x="400" y="283" font-size="14" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="1">CLINICAL PATHOLOGY LABORATORY REPORT</text>

  <!-- Table Header -->
  <rect x="40" y="306" width="720" height="28" fill="#e2e8f0"/>
  <text x="60" y="325" font-size="11" font-weight="bold" fill="#334155">INVESTIGATION / PARAMETER</text>
  <text x="320" y="325" font-size="11" font-weight="bold" fill="#334155">OBSERVED VALUE</text>
  <text x="480" y="325" font-size="11" font-weight="bold" fill="#334155">UNIT</text>
  <text x="600" y="325" font-size="11" font-weight="bold" fill="#334155">REFERENCE INTERVAL</text>

  <!-- Test 1: Complete Blood Count Section -->
  <rect x="40" y="342" width="720" height="22" fill="#eff6ff"/>
  <text x="60" y="357" font-size="11" font-weight="bold" fill="#1d4ed8">HAEMATOLOGY - COMPLETE BLOOD COUNT (CBC)</text>

  <text x="60" y="380" font-size="11" fill="#1e293b">Hemoglobin (Hb)</text>
  <text x="320" y="380" font-size="12" font-weight="bold" fill="#0f172a">14.2</text>
  <text x="480" y="380" font-size="11" fill="#475569">g/dL</text>
  <text x="600" y="380" font-size="11" fill="#475569">13.0 - 17.0</text>
  <line x1="40" y1="392" x2="760" y2="392" stroke="#f1f5f9" stroke-width="1"/>

  <text x="60" y="410" font-size="11" fill="#1e293b">Total Leukocyte Count (TLC / WBC)</text>
  <text x="320" y="410" font-size="12" font-weight="bold" fill="#0f172a">7,400</text>
  <text x="480" y="410" font-size="11" fill="#475569">/cumm</text>
  <text x="600" y="410" font-size="11" fill="#475569">4,000 - 11,000</text>
  <line x1="40" y1="422" x2="760" y2="422" stroke="#f1f5f9" stroke-width="1"/>

  <text x="60" y="440" font-size="11" fill="#1e293b">Platelet Count</text>
  <text x="320" y="440" font-size="12" font-weight="bold" fill="#0f172a">2.45</text>
  <text x="480" y="440" font-size="11" fill="#475569">Lakhs/cumm</text>
  <text x="600" y="440" font-size="11" fill="#475569">1.50 - 4.50</text>
  <line x1="40" y1="452" x2="760" y2="452" stroke="#f1f5f9" stroke-width="1"/>

  <text x="60" y="470" font-size="11" fill="#1e293b">ESR (Erythrocyte Sedimentation Rate)</text>
  <text x="320" y="470" font-size="12" font-weight="bold" fill="#0f172a">12</text>
  <text x="480" y="470" font-size="11" fill="#475569">mm/1st hr</text>
  <text x="600" y="470" font-size="11" fill="#475569">0 - 15</text>
  <line x1="40" y1="482" x2="760" y2="482" stroke="#f1f5f9" stroke-width="1"/>

  <!-- Test 2: Biochemistry Section -->
  <rect x="40" y="500" width="720" height="22" fill="#eff6ff"/>
  <text x="60" y="515" font-size="11" font-weight="bold" fill="#1d4ed8">BIOCHEMISTRY &amp; METABOLIC PROFILE</text>

  <text x="60" y="538" font-size="11" fill="#1e293b">Fasting Blood Sugar (FBS)</text>
  <text x="320" y="538" font-size="12" font-weight="bold" fill="#0f172a">94</text>
  <text x="480" y="538" font-size="11" fill="#475569">mg/dL</text>
  <text x="600" y="538" font-size="11" fill="#475569">70 - 100 (Normal)</text>
  <line x1="40" y1="550" x2="760" y2="550" stroke="#f1f5f9" stroke-width="1"/>

  <text x="60" y="568" font-size="11" fill="#1e293b">HbA1c (Glycosylated Hemoglobin)</text>
  <text x="320" y="568" font-size="12" font-weight="bold" fill="#0f172a">5.4</text>
  <text x="480" y="568" font-size="11" fill="#475569">%</text>
  <text x="600" y="568" font-size="11" fill="#475569">&lt; 5.7 (Normal)</text>
  <line x1="40" y1="580" x2="760" y2="580" stroke="#f1f5f9" stroke-width="1"/>

  <text x="60" y="598" font-size="11" fill="#1e293b">Serum Creatinine</text>
  <text x="320" y="598" font-size="12" font-weight="bold" fill="#0f172a">0.9</text>
  <text x="480" y="598" font-size="11" fill="#475569">mg/dL</text>
  <text x="600" y="598" font-size="11" fill="#475569">0.7 - 1.3</text>
  <line x1="40" y1="610" x2="760" y2="610" stroke="#f1f5f9" stroke-width="1"/>

  <text x="60" y="628" font-size="11" fill="#1e293b">Serum Urea</text>
  <text x="320" y="628" font-size="12" font-weight="bold" fill="#0f172a">24</text>
  <text x="480" y="628" font-size="11" fill="#475569">mg/dL</text>
  <text x="600" y="628" font-size="11" fill="#475569">15 - 40</text>
  <line x1="40" y1="640" x2="760" y2="640" stroke="#f1f5f9" stroke-width="1"/>

  <text x="60" y="658" font-size="11" fill="#1e293b">Serum Calcium</text>
  <text x="320" y="658" font-size="12" font-weight="bold" fill="#0f172a">9.3</text>
  <text x="480" y="658" font-size="11" fill="#475569">mg/dL</text>
  <text x="600" y="658" font-size="11" fill="#475569">8.8 - 10.2</text>
  <line x1="40" y1="670" x2="760" y2="670" stroke="#f1f5f9" stroke-width="1"/>

  <text x="60" y="688" font-size="11" fill="#1e293b">Total Cholesterol</text>
  <text x="320" y="688" font-size="12" font-weight="bold" fill="#0f172a">172</text>
  <text x="480" y="688" font-size="11" fill="#475569">mg/dL</text>
  <text x="600" y="688" font-size="11" fill="#475569">&lt; 200 (Desirable)</text>
  <line x1="40" y1="700" x2="760" y2="700" stroke="#f1f5f9" stroke-width="1"/>

  <!-- Clinical Impression Box -->
  <rect x="40" y="730" width="720" height="90" rx="4" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1"/>
  <text x="60" y="754" font-size="12" font-weight="bold" fill="#0369a1">PATHOLOGIST CLINICAL REMARKS &amp; INTERPRETATION:</text>
  <text x="60" y="776" font-size="11" fill="#334155">1. Complete blood parameters, Glycated Hemoglobin and Fasting Glucose are within biological limits.</text>
  <text x="60" y="794" font-size="11" fill="#334155">2. Renal filtration profile (Serum Urea and Creatinine) shows healthy functioning kidneys.</text>
  <text x="60" y="810" font-size="11" font-style="italic" fill="#64748b">Note: Clinical correlation with physical symptoms and medical history recommended.</text>

  <!-- Verified Stamp Box -->
  <g transform="translate(100, 850)">
    <circle cx="50" cy="50" r="45" fill="none" stroke="#059669" stroke-width="2.5" stroke-dasharray="6,3"/>
    <text x="50" y="44" font-size="10" font-weight="bold" fill="#059669" text-anchor="middle">MQ DIAGNOSTIC</text>
    <text x="50" y="58" font-size="12" font-weight="900" fill="#059669" text-anchor="middle">VERIFIED</text>
    <text x="50" y="70" font-size="9" fill="#059669" text-anchor="middle">BARANGA LAB</text>
  </g>

  <!-- Signatures -->
  <g transform="translate(360, 880)">
    <line x1="0" y1="0" x2="160" y2="0" stroke="#94a3b8" stroke-width="1"/>
    <text x="80" y="20" font-size="12" font-weight="bold" fill="#1e293b" text-anchor="middle">S. Routray, DMLT</text>
    <text x="80" y="36" font-size="10" fill="#64748b" text-anchor="middle">Senior Medical Laboratory Tech</text>
  </g>

  <g transform="translate(580, 880)">
    <line x1="0" y1="0" x2="160" y2="0" stroke="#94a3b8" stroke-width="1"/>
    <text x="80" y="20" font-size="12" font-weight="bold" fill="#0369a1" text-anchor="middle">Dr. A. K. Behera, MD</text>
    <text x="80" y="36" font-size="10" fill="#64748b" text-anchor="middle">Consultant Pathologist (Reg No: 18492)</text>
  </g>

  <!-- Footer Banner -->
  <rect x="0" y="1030" width="800" height="70" fill="#0f172a"/>
  <text x="400" y="1056" font-size="12" font-weight="bold" fill="#ffffff" text-anchor="middle">MQ DIAGNOSTIC CARE • SAMPLE COLLECTION CENTER</text>
  <text x="400" y="1076" font-size="11" fill="#94a3b8" text-anchor="middle">Trisulia, Baranga | Contact for Home Collection &amp; Queries: +91 75046 62885</text>
</svg>
`)}`;

export const SEED_BOOKINGS: DiagnosticBooking[] = [
  {
    id: 'MQ-2026-1001',
    patientName: 'Rajesh Mohanty',
    patientAge: 42,
    patientGender: 'Male',
    patientPhone: '9861234567',
    patientEmail: 'rajesh.mohanty@gmail.com',
    serviceType: 'home_collection',
    address: 'Plot 412, Royal Enclave, Trisulia, Baranga',
    cityArea: 'Trisulia, Baranga',
    scheduledDate: '2026-10-14',
    scheduledTimeSlot: '07:00 AM - 09:00 AM',
    tests: [
      { id: 'test-fbs', name: 'FBS (Fasting Blood Sugar)', price: 50 },
      { id: 'test-hba1c', name: 'HbA1c (Glycosylated Hemoglobin)', price: 500 },
      { id: 'test-cbc', name: 'CBC (Complete Blood Count)', price: 300 },
      { id: 'test-serum-creatinine', name: 'Serum Creatinine', price: 200 },
    ],
    totalAmount: 1050,
    status: 'Report Ready',
    paymentStatus: 'Paid Online',
    referringDoctor: 'Dr. P. K. Patnaik, MD',
    specialInstructions: 'Patient requested morning sample collection before breakfast.',
    createdAt: '2026-10-14T06:45:00.000Z',
    updatedAt: '2026-10-14T13:20:00.000Z',
    scannedReport: {
      fileName: 'MQ1001_RajeshMohanty_Report.svg',
      fileType: 'image',
      fileDataUrl: SAMPLE_SCANNED_REPORT_SVG,
      uploadedAt: '2026-10-14T13:15:00.000Z',
      fileSizeKb: 142,
    },
    digitalReportParameters: [
      { name: 'Hemoglobin (Hb)', result: '14.2', unit: 'g/dL', referenceRange: '13.0 - 17.0', status: 'Normal' },
      { name: 'WBC (Total Count)', result: '7,400', unit: '/cumm', referenceRange: '4,000 - 11,000', status: 'Normal' },
      { name: 'Platelet Count', result: '2.45', unit: 'Lakhs/cumm', referenceRange: '1.50 - 4.50', status: 'Normal' },
      { name: 'Fasting Blood Sugar (FBS)', result: '94', unit: 'mg/dL', referenceRange: '70 - 100', status: 'Normal' },
      { name: 'HbA1c', result: '5.4', unit: '%', referenceRange: '< 5.7', status: 'Normal' },
      { name: 'Serum Creatinine', result: '0.9', unit: 'mg/dL', referenceRange: '0.7 - 1.3', status: 'Normal' },
    ],
    pathologistNotes: 'All hematological and metabolic parameters within biologically normal limits.',
    verifiedBy: 'Dr. A. K. Behera, MD (Pathologist)',
    reportReleasedAt: '2026-10-14 01:15 PM',
  },
  {
    id: 'MQ-2026-1002',
    patientName: 'Priyanka Das',
    patientAge: 34,
    patientGender: 'Female',
    patientPhone: '9437890123',
    patientEmail: 'priyanka.das@yahoo.com',
    serviceType: 'lab_visit',
    scheduledDate: '2026-10-14',
    scheduledTimeSlot: '09:00 AM - 11:00 AM',
    tests: [
      { id: 'test-thyroid', name: 'T3, T4, TSH (Thyroid Profile)', price: 600 },
      { id: 'test-vit-d3', name: 'Vitamin D3', price: 1200 },
      { id: 'test-serum-calcium', name: 'Serum Calcium', price: 200 },
    ],
    totalAmount: 2000,
    status: 'Processing',
    paymentStatus: 'Paid at Counter',
    referringDoctor: 'Dr. S. Mohapatra, Gynaecologist',
    specialInstructions: 'Regular thyroid checkup.',
    createdAt: '2026-10-14T08:30:00.000Z',
    updatedAt: '2026-10-14T10:15:00.000Z',
  },
  {
    id: 'MQ-2026-1003',
    patientName: 'Subhasish Panda',
    patientAge: 58,
    patientGender: 'Male',
    patientPhone: '9937123456',
    serviceType: 'home_collection',
    address: 'Near Baranga Railway Station, Baranga Market Area',
    cityArea: 'Baranga',
    scheduledDate: '2026-10-14',
    scheduledTimeSlot: '11:00 AM - 01:00 PM',
    tests: [
      { id: 'test-lft', name: 'LFT (Liver Function Test)', price: 500 },
      { id: 'test-kft', name: 'KFT / RFT (Kidney Function Test)', price: 500 },
      { id: 'test-lipid', name: 'Lipid Profile', price: 600 },
    ],
    totalAmount: 1600,
    status: 'Sample Collected',
    paymentStatus: 'Pending at Collection',
    referringDoctor: 'Self',
    createdAt: '2026-10-14T09:10:00.000Z',
    updatedAt: '2026-10-14T11:45:00.000Z',
  },
  {
    id: 'MQ-2026-1004',
    patientName: 'Ananya Mishra',
    patientAge: 27,
    patientGender: 'Female',
    patientPhone: '7008123456',
    serviceType: 'lab_visit',
    scheduledDate: '2026-10-15',
    scheduledTimeSlot: '08:00 AM - 10:00 AM',
    tests: [
      { id: 'test-cbc', name: 'CBC (Complete Blood Count)', price: 300 },
      { id: 'test-widal', name: 'Widal', price: 300 },
      { id: 'test-crp', name: 'CRP (C-Reactive Protein)', price: 400 },
    ],
    totalAmount: 1000,
    status: 'Confirmed',
    paymentStatus: 'Pending at Collection',
    referringDoctor: 'Dr. B. K. Jena, Physician',
    specialInstructions: 'Patient has mild fever since 3 days.',
    createdAt: '2026-10-14T09:25:00.000Z',
    updatedAt: '2026-10-14T09:30:00.000Z',
  },
];
