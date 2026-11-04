// =============================================================================
// Exam Presets Data
// NOTE: Photo/signature requirements listed here are SAMPLE values for
// demonstration purposes. Always verify the latest specifications from the
// official exam notification before uploading documents.
// =============================================================================

/** Supported document types */
export type DocumentType = "photo" | "signature" | "thumb";

/** Supported image formats */
export type ImageFormat = "jpg" | "jpeg" | "png";

/** Supported dimension units */
export type DimensionUnit = "px" | "cm" | "mm";

/** A single document requirement for an exam */
export interface ExamDocument {
  /** Type of document */
  documentType: DocumentType;
  /** Required width */
  width: number;
  /** Required height */
  height: number;
  /** Dimension unit */
  unit: DimensionUnit;
  /** Minimum file size in KB */
  minKB: number;
  /** Maximum file size in KB */
  maxKB: number;
  /** Required image format */
  format: ImageFormat;
  /** DPI requirement (optional) */
  dpi?: number;
}

/** An exam preset with its document requirements */
export interface ExamPreset {
  /** URL-friendly unique identifier */
  examId: string;
  /** Full display name of the exam */
  examName: string;
  /** Category the exam belongs to */
  category: string;
  /** List of document requirements */
  documents: ExamDocument[];
  /** Link to official website or notification */
  sourceURL: string;
  /** Date when requirements were last verified */
  verifiedDate: string | null;
  /** Whether the requirements have been officially verified */
  verified: boolean;
}

/** Exam category definition */
export interface ExamCategory {
  /** URL-friendly identifier */
  id: string;
  /** Human-readable label */
  label: string;
}

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------

export const examCategories: ExamCategory[] = [
  { id: "upsc", label: "UPSC" },
  { id: "ssc", label: "SSC" },
  { id: "banking", label: "Banking" },
  { id: "railway", label: "Railway" },
  { id: "state-psc", label: "State PSC" },
  { id: "police", label: "Police" },
  { id: "teaching", label: "Teaching" },
  { id: "entrance", label: "Entrance Exams" },
  { id: "other-govt", label: "Other Govt" },
];

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

export const examPresets: ExamPreset[] = [
  // =========================================================================
  // UPSC
  // =========================================================================
  {
    examId: "upsc-civil-services",
    examName: "UPSC Civil Services (IAS/IPS/IFS)",
    category: "upsc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 300,
        format: "jpg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 100,
        format: "jpg",
      },
    ],
    sourceURL: "https://upsconline.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "upsc-nda",
    examName: "UPSC NDA & NA Examination",
    category: "upsc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 300,
        format: "jpg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 100,
        format: "jpg",
      },
    ],
    sourceURL: "https://upsconline.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "upsc-cds",
    examName: "UPSC CDS Examination",
    category: "upsc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 300,
        format: "jpg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 100,
        format: "jpg",
      },
    ],
    sourceURL: "https://upsconline.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "upsc-capf",
    examName: "UPSC CAPF (AC) Examination",
    category: "upsc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 300,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 100,
        format: "jpg",
      },
    ],
    sourceURL: "https://upsconline.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "upsc-ese",
    examName: "UPSC Engineering Services (ESE)",
    category: "upsc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 300,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 100,
        format: "jpg",
      },
    ],
    sourceURL: "https://upsconline.nic.in",
    verifiedDate: null,
    verified: false,
  },

  // =========================================================================
  // SSC
  // =========================================================================
  {
    examId: "ssc-cgl",
    examName: "SSC CGL (Combined Graduate Level)",
    category: "ssc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://ssc.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ssc-chsl",
    examName: "SSC CHSL (Combined Higher Secondary Level)",
    category: "ssc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://ssc.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ssc-mts",
    examName: "SSC MTS (Multi Tasking Staff)",
    category: "ssc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://ssc.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ssc-gd-constable",
    examName: "SSC GD Constable",
    category: "ssc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://ssc.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ssc-cpo",
    examName: "SSC CPO (Central Police Organisation)",
    category: "ssc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://ssc.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ssc-stenographer",
    examName: "SSC Stenographer Grade C & D",
    category: "ssc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://ssc.nic.in",
    verifiedDate: null,
    verified: false,
  },

  // =========================================================================
  // Banking
  // =========================================================================
  {
    examId: "ibps-po",
    examName: "IBPS PO (Probationary Officer)",
    category: "banking",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
      {
        documentType: "thumb",
        width: 240,
        height: 240,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.ibps.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ibps-clerk",
    examName: "IBPS Clerk",
    category: "banking",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
      {
        documentType: "thumb",
        width: 240,
        height: 240,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.ibps.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ibps-so",
    examName: "IBPS SO (Specialist Officer)",
    category: "banking",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.ibps.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ibps-rrb-po",
    examName: "IBPS RRB PO (Officer Scale I)",
    category: "banking",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.ibps.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "sbi-po",
    examName: "SBI PO (Probationary Officer)",
    category: "banking",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.sbi.co.in/careers",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "sbi-clerk",
    examName: "SBI Clerk (Junior Associate)",
    category: "banking",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.sbi.co.in/careers",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "rbi-grade-b",
    examName: "RBI Grade B Officer",
    category: "banking",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.rbi.org.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "rbi-assistant",
    examName: "RBI Assistant",
    category: "banking",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.rbi.org.in",
    verifiedDate: null,
    verified: false,
  },

  // =========================================================================
  // Railway
  // =========================================================================
  {
    examId: "rrb-ntpc",
    examName: "RRB NTPC (Non-Technical Popular Categories)",
    category: "railway",
    documents: [
      {
        documentType: "photo",
        width: 35,
        height: 45,
        unit: "mm",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 50,
        height: 20,
        unit: "mm",
        minKB: 10,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.rrbcdg.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "rrb-group-d",
    examName: "RRB Group D (Level 1)",
    category: "railway",
    documents: [
      {
        documentType: "photo",
        width: 35,
        height: 45,
        unit: "mm",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 50,
        height: 20,
        unit: "mm",
        minKB: 10,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.rrbcdg.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "rrb-je",
    examName: "RRB JE (Junior Engineer)",
    category: "railway",
    documents: [
      {
        documentType: "photo",
        width: 35,
        height: 45,
        unit: "mm",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 50,
        height: 20,
        unit: "mm",
        minKB: 10,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.rrbcdg.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "rrb-alp",
    examName: "RRB ALP (Assistant Loco Pilot)",
    category: "railway",
    documents: [
      {
        documentType: "photo",
        width: 35,
        height: 45,
        unit: "mm",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 50,
        height: 20,
        unit: "mm",
        minKB: 10,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.rrbcdg.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "rrb-ministerial",
    examName: "RRB Ministerial & Isolated Categories",
    category: "railway",
    documents: [
      {
        documentType: "photo",
        width: 35,
        height: 45,
        unit: "mm",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 50,
        height: 20,
        unit: "mm",
        minKB: 10,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.rrbcdg.gov.in",
    verifiedDate: null,
    verified: false,
  },

  // =========================================================================
  // State PSC
  // =========================================================================
  {
    examId: "uppsc-pcs",
    examName: "UPPSC PCS (UP Provincial Civil Service)",
    category: "state-psc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 300,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 100,
        format: "jpg",
      },
    ],
    sourceURL: "https://uppsc.up.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "bpsc-combined",
    examName: "BPSC Combined Competitive Examination",
    category: "state-psc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpg",
      },
    ],
    sourceURL: "https://www.bpsc.bih.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "mppsc-state-services",
    examName: "MPPSC State Services Examination",
    category: "state-psc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 100,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 40,
        format: "jpg",
      },
    ],
    sourceURL: "https://mppsc.mp.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "rpsc-ras",
    examName: "RPSC RAS/RTS (Rajasthan Administrative Service)",
    category: "state-psc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 100,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 40,
        format: "jpg",
      },
    ],
    sourceURL: "https://rpsc.rajasthan.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "wbcs-main",
    examName: "WBPSC WBCS (West Bengal Civil Service)",
    category: "state-psc",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 100,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpg",
      },
    ],
    sourceURL: "https://wbpsc.gov.in",
    verifiedDate: null,
    verified: false,
  },

  // =========================================================================
  // Police
  // =========================================================================
  {
    examId: "up-police-constable",
    examName: "UP Police Constable",
    category: "police",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 5,
        maxKB: 20,
        format: "jpg",
      },
    ],
    sourceURL: "https://uppbpb.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "up-police-si",
    examName: "UP Police Sub Inspector (SI)",
    category: "police",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 5,
        maxKB: 20,
        format: "jpg",
      },
    ],
    sourceURL: "https://uppbpb.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "bihar-police-constable",
    examName: "Bihar Police Constable",
    category: "police",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpg",
      },
    ],
    sourceURL: "https://csbc.bih.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "mp-police-constable",
    examName: "MP Police Constable",
    category: "police",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpg",
      },
    ],
    sourceURL: "https://peb.mp.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "rajasthan-police-constable",
    examName: "Rajasthan Police Constable",
    category: "police",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpg",
      },
    ],
    sourceURL: "https://police.rajasthan.gov.in",
    verifiedDate: null,
    verified: false,
  },

  // =========================================================================
  // Teaching
  // =========================================================================
  {
    examId: "ctet",
    examName: "CTET (Central Teacher Eligibility Test)",
    category: "teaching",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 10,
        maxKB: 100,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://ctet.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "ugc-net",
    examName: "UGC NET (National Eligibility Test)",
    category: "teaching",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 10,
        maxKB: 200,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://ugcnet.nta.ac.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "uptet",
    examName: "UPTET (UP Teacher Eligibility Test)",
    category: "teaching",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 5,
        maxKB: 20,
        format: "jpg",
      },
    ],
    sourceURL: "https://updeled.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "super-tet",
    examName: "Super TET (UP Assistant Teacher)",
    category: "teaching",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 5,
        maxKB: 20,
        format: "jpg",
      },
    ],
    sourceURL: "",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "kvs-teacher",
    examName: "KVS Teacher Recruitment",
    category: "teaching",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 10,
        maxKB: 100,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://kvsangathan.nic.in",
    verifiedDate: null,
    verified: false,
  },

  // =========================================================================
  // Entrance Exams
  // =========================================================================
  {
    examId: "jee-main",
    examName: "JEE Main (Joint Entrance Examination)",
    category: "entrance",
    documents: [
      {
        documentType: "photo",
        width: 276,
        height: 354,
        unit: "px",
        minKB: 10,
        maxKB: 200,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 276,
        height: 118,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://jeemain.nta.ac.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "neet-ug",
    examName: "NEET UG (National Eligibility cum Entrance Test)",
    category: "entrance",
    documents: [
      {
        documentType: "photo",
        width: 276,
        height: 354,
        unit: "px",
        minKB: 10,
        maxKB: 200,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 276,
        height: 118,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
      {
        documentType: "thumb",
        width: 276,
        height: 276,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpeg",
      },
    ],
    sourceURL: "https://neet.nta.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "jee-advanced",
    examName: "JEE Advanced",
    category: "entrance",
    documents: [
      {
        documentType: "photo",
        width: 276,
        height: 354,
        unit: "px",
        minKB: 10,
        maxKB: 200,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 276,
        height: 118,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://jeeadv.ac.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "gate",
    examName: "GATE (Graduate Aptitude Test in Engineering)",
    category: "entrance",
    documents: [
      {
        documentType: "photo",
        width: 276,
        height: 354,
        unit: "px",
        minKB: 10,
        maxKB: 200,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 276,
        height: 118,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://gate2025.iitr.ac.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "cuet-ug",
    examName: "CUET UG (Common University Entrance Test)",
    category: "entrance",
    documents: [
      {
        documentType: "photo",
        width: 276,
        height: 354,
        unit: "px",
        minKB: 10,
        maxKB: 200,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 276,
        height: 118,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://cuet.nta.nic.in",
    verifiedDate: null,
    verified: false,
  },

  // =========================================================================
  // Other Govt
  // =========================================================================
  {
    examId: "nta-abhyas",
    examName: "NTA Common Exam Format",
    category: "other-govt",
    documents: [
      {
        documentType: "photo",
        width: 276,
        height: 354,
        unit: "px",
        minKB: 10,
        maxKB: 200,
        format: "jpeg",
        dpi: 200,
      },
      {
        documentType: "signature",
        width: 276,
        height: 118,
        unit: "px",
        minKB: 4,
        maxKB: 30,
        format: "jpeg",
      },
    ],
    sourceURL: "https://nta.ac.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "lic-aao",
    examName: "LIC AAO (Assistant Administrative Officer)",
    category: "other-govt",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://licindia.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "epfo-ssa",
    examName: "EPFO SSA (Social Security Assistant)",
    category: "other-govt",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.epfindia.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "fci-manager",
    examName: "FCI Manager (Food Corporation of India)",
    category: "other-govt",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 140,
        height: 60,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://fci.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "drdo-ceptam",
    examName: "DRDO CEPTAM (Entry Test)",
    category: "other-govt",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 230,
        unit: "px",
        minKB: 20,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 10,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.drdo.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "indian-navy-mr",
    examName: "Indian Navy MR (Matric Recruit)",
    category: "other-govt",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 250,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 5,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.joinindiannavy.gov.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "indian-army-agniveer",
    examName: "Indian Army Agniveer",
    category: "other-govt",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 250,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 5,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://www.joinindianarmy.nic.in",
    verifiedDate: null,
    verified: false,
  },
  {
    examId: "indian-airforce-agniveer",
    examName: "Indian Air Force Agniveer Vayu",
    category: "other-govt",
    documents: [
      {
        documentType: "photo",
        width: 200,
        height: 250,
        unit: "px",
        minKB: 10,
        maxKB: 50,
        format: "jpeg",
      },
      {
        documentType: "signature",
        width: 200,
        height: 70,
        unit: "px",
        minKB: 5,
        maxKB: 20,
        format: "jpeg",
      },
    ],
    sourceURL: "https://agnipathvayu.cdac.in",
    verifiedDate: null,
    verified: false,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Returns all exams that belong to a given category id.
 */
export function getExamsByCategory(categoryId: string): ExamPreset[] {
  return examPresets.filter((exam) => exam.category === categoryId);
}

/**
 * Finds a single exam preset by its slug / examId.
 * Returns `undefined` when no match is found.
 */
export function getExamBySlug(slug: string): ExamPreset | undefined {
  return examPresets.find((exam) => exam.examId === slug);
}

/**
 * Searches exams by name (case-insensitive substring match).
 * Returns all presets whose `examName` contains the query string.
 */
export function searchExams(query: string): ExamPreset[] {
  if (!query || query.trim().length === 0) return examPresets;
  const normalised = query.toLowerCase().trim();
  return examPresets.filter((exam) =>
    exam.examName.toLowerCase().includes(normalised)
  );
}
