/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VdrFolder, VdrDocument } from '@/types/vdr';

export const INITIAL_FOLDERS: VdrFolder[] = [
  {
    id: '1',
    code: '01',
    name: 'Legal & Corporate',
    count: '6 files',
    size: '28 MB',
    description: 'Corporate charter, bylaws, capitalization table, and director resolutions'
  },
  {
    id: '2',
    code: '02',
    name: 'Financial Statements',
    count: '5 files',
    size: '42 MB',
    description: 'Audited balance sheets, EBITDA reconciliation models, and quality of earnings'
  },
  {
    id: '3',
    code: '03',
    name: 'Commercial Contracts',
    count: '5 files',
    size: '19 MB',
    description: 'Customer master service agreements, vendor procurement, and key SLAs'
  },
  {
    id: '4',
    code: '04',
    name: 'IP & Patents',
    count: '4 files',
    size: '12 MB',
    description: 'Patent filings, proprietary software audits, and worldwide trademark grants'
  },
];

export const MOCK_DOCUMENTS: VdrDocument[] = [
  // =========================================================================
  // FOLDER 01: LEGAL & CORPORATE
  // =========================================================================

  // 1. TEXT (.txt) document with Compliance Highlights
  {
    id: 'f-01-txt',
    name: 'Executive_Severance_&_Retention_Notes.txt',
    folderCode: '01',
    binder: '01 · Legal & Corporate',
    size: '24 KB',
    sizeBytes: 24576,
    updated: 'Today at 09:15',
    updatedTimestamp: 1791470400000,
    type: 'txt',
    status: 'Under Review',
    securityTag: 'Strict Confidential',
    author: 'Kirkland & Ellis LLP',
    previewMeta: {
      lines: 38,
      checksum: 'sha256-4b89f2a019e1c3a77884d8e78f99014b2a4c6e8',
      lastAuditedBy: 'Compliance Officer (M&A Lead)'
    },
    complianceFlags: [
      {
        id: 'flag-1',
        section: 'Section 4.2',
        phrase: '36-month non-compete restriction worldwide',
        severity: 'high',
        description: 'Enforceability risk: 36-month duration exceeds typical 12–24 month regulatory caps under Delaware law.'
      },
      {
        id: 'flag-2',
        section: 'Section 7.1',
        phrase: '$4,200,000 accelerated golden parachute change-of-control payout',
        severity: 'medium',
        description: 'Exceeds standard 2.5x base compensation multiplier; requires special shareholder advisory consent.'
      }
    ],
    previewContent: `GLYNAC VDR CONFIDENTIAL LEGAL TRANSCRIPT
PROJECT FALCON - EXECUTIVE RETENTION AND SEVERANCE REVIEW
DATE: OCTOBER 2026
COUNSEL: KIRKLAND & ELLIS LLP

1. BACKGROUND & SCOPE
This memorandum reviews the change-of-control covenants, accelerated vesting provisions, and executive covenant restrictions for the target entity's top 5 senior executives.

2. RETENTION PACKAGES
All retention agreements entered into as of FY2025 shall survive the proposed merger transaction. However, the following key items require committee determination:

   a) Chief Executive Officer:
      - Base Salary: $650,000 per annum with target bonus of 85%.
      - Special Covenant: Section 7.1 stipulates a $4,200,000 accelerated golden parachute change-of-control payout upon closing of any sale of greater than 50% equity.
      - Tax Gross-Up: Eliminated in 2024 amendment.

   b) Non-Competition & Non-Solicitation:
      - Section 4.2 enforces a 36-month non-compete restriction worldwide against all direct competitor platforms.
      - Advisory note: Counsel recommends revising the term to 18 months to avoid anti-trust challenges in FTC/EU jurisdictions.

3. INDEMNIFICATION OBLIGATIONS
Target corporation agrees to maintain standard D&O insurance tail policy for a period of 6 years post-transaction. Deductible peg established at $250,000.

APPROVED FOR VDR DEPOSIT:
Partner, Kirkland & Ellis LLP`
  },

  // 2. MARKDOWN (.md) document with Compliance Highlights
  {
    id: 'f-01-md',
    name: 'GDPR_Data_Privacy_&_Security_Audit.md',
    folderCode: '01',
    binder: '01 · Legal & Corporate',
    size: '48 KB',
    sizeBytes: 49152,
    updated: 'Oct 05, 2026',
    updatedTimestamp: 1791187200000,
    type: 'md',
    status: 'Verified',
    securityTag: 'Restricted',
    author: 'PwC Regulatory Compliance',
    previewMeta: {
      lines: 54,
      checksum: 'sha256-8a71b3e022f8a19cd91182bc870192f1b44c688',
      lastAuditedBy: 'Data Protection Officer (DPO)'
    },
    complianceFlags: [
      {
        id: 'flag-md-1',
        section: 'Clause 3.4',
        phrase: 'unencrypted cross-border transfer of EEA user telemetry',
        severity: 'high',
        description: 'Direct violation of GDPR Chapter V: Standard Contractual Clauses (SCCs) are missing for US replica clusters.'
      },
      {
        id: 'flag-md-2',
        section: 'Clause 5.1',
        phrase: 'retention of deactivated user records indefinitely without automated purge',
        severity: 'medium',
        description: 'Data minimization requirement: Article 5(1)(e) requires scheduled data deletion.'
      }
    ],
    previewContent: `# Due Diligence Audit: Privacy & Regulatory Posture

**Target Organization:** Falcon Technologies Inc.  
**Review Period:** FY2025 – FY2026 Q3  
**Classification:** Confidential M&A Diligence Memorandum  

---

### Executive Summary
A comprehensive review of the target's customer data pipelines, sub-processor agreements, and cloud telemetry infrastructure was conducted in September 2026. While core application databases demonstrate ISO 27001 compliance, specific data transfer covenants require remediation before closing.

### Key Compliance Findings

1. **Sub-Processor Governance (Article 28 GDPR)**
   - All 14 third-party SaaS vendors maintain signed Data Processing Addenda (DPAs).
   - SOC 2 Type II reports verified for AWS and Snowflake instances.

2. **Cross-Border Data Flows (Article 44–49 GDPR)**
   - Audit identified unencrypted cross-border transfer of EEA user telemetry to non-adequate third-party analytical endpoints.
   - *Remediation:* Implement EU-US Data Privacy Framework certification or supplemental Standard Contractual Clauses prior to close.

3. **Data Retention & Erasure Policies**
   - Discrepancy observed regarding retention of deactivated user records indefinitely without automated purge in legacy backup vaults.
   - *Recommendation:* Institute automated 90-day anonymization cron routine.

---

### Audit Sign-Off
- **Lead Auditor:** Marcus Vance, CIPP/E, CIPM  
- **Firm:** PwC Regulatory Compliance Practice`
  },

  // 3. JSON (.json) document
  {
    id: 'f-01-json',
    name: 'Cap_Table_Equity_Ownership_Distribution.json',
    folderCode: '01',
    binder: '01 · Legal & Corporate',
    size: '32 KB',
    sizeBytes: 32768,
    updated: 'Oct 02, 2026',
    updatedTimestamp: 1790928000000,
    type: 'json',
    status: 'Verified',
    securityTag: 'Strict Confidential',
    author: 'Morgan & Sterling Advisory',
    previewMeta: {
      lines: 42,
      checksum: 'sha256-11f92e0081d763fa289190ab78345c21948a31e',
      lastAuditedBy: 'Lead Financial Analyst'
    },
    previewContent: JSON.stringify(
      {
        dealMetadata: {
          projectName: 'Project Falcon',
          targetEntity: 'Falcon Technologies Inc.',
          valuationPegUsd: 420000000,
          totalFullyDilutedShares: 45000000,
          parValueUsd: 0.0001
        },
        equityShareholders: [
          {
            holder: 'Founders & Executive Trust',
            class: 'Common Series A',
            shares: 18500000,
            percentage: 41.11,
            liquidationPreference: '1.0x Non-Participating',
            vestedStatus: '100% Vested'
          },
          {
            holder: 'Apex Growth Ventures IV, L.P.',
            class: 'Preferred Series B',
            shares: 14250000,
            percentage: 31.67,
            liquidationPreference: '1.5x Senior Participating',
            vestedStatus: 'Fully Issued'
          },
          {
            holder: 'Summit Strategic Capital Fund',
            class: 'Preferred Series C',
            shares: 7850000,
            percentage: 17.44,
            liquidationPreference: '1.0x Pari Passu',
            vestedStatus: 'Fully Issued'
          },
          {
            holder: 'Employee Stock Option Pool (ESOP)',
            class: 'Unallocated Option Pool',
            shares: 4400000,
            percentage: 9.78,
            liquidationPreference: 'None',
            vestedStatus: '68% Granted / 32% Reserve'
          }
        ],
        antiDilutionProtection: 'Broad-Based Weighted Average',
        votingThreshold: '66.7% Supermajority required for Exit'
      },
      null,
      2
    )
  },

  // 4. DOCX (.docx) document
  {
    id: 'f-01-2',
    name: 'Master_Services_Agreement_Template.docx',
    folderCode: '01',
    binder: '01 · Legal & Corporate',
    size: '1.2 MB',
    sizeBytes: 1258291,
    updated: 'Oct 04, 2026',
    updatedTimestamp: 1791097200000,
    type: 'docx',
    status: 'Verified',
    securityTag: 'Restricted',
    author: 'Kirkland & Ellis LLP',
    previewMeta: {
      pages: 28,
      checksum: 'sha256-91bcfa34988012bb8726514ac01928374a81284',
      lastAuditedBy: 'Commercial Counsel'
    },
    previewContent: 'Standard enterprise customer master contract template with service level benchmarks, IP indemnification caps, and limitation of liability clauses.'
  },

  // 5. PDF (.pdf) document
  {
    id: 'f-01-cert',
    name: 'Certificate_of_Incorporation_&_Bylaws.pdf',
    folderCode: '01',
    binder: '01 · Legal & Corporate',
    size: '2.1 MB',
    sizeBytes: 2202009,
    updated: 'Oct 01, 2026',
    updatedTimestamp: 1790841600000,
    type: 'pdf',
    status: 'Verified',
    securityTag: 'Strict Confidential',
    author: 'Delaware Secretary of State',
    previewMeta: {
      pages: 34,
      checksum: 'sha256-621aa990172bf1082cba119842a7810398bb290',
      lastAuditedBy: 'Corporate Secretary'
    },
    previewContent: 'State of Delaware certified formation charter, authorized capital share divisions, series voting rights, and amended bylaws adopted at Series C.'
  },

  // 6. PDF (.pdf) Board Resolutions
  {
    id: 'f-01-board',
    name: 'Board_Resolutions_Unanimous_Written_Consent.pdf',
    folderCode: '01',
    binder: '01 · Legal & Corporate',
    size: '850 KB',
    sizeBytes: 870400,
    updated: 'Sep 28, 2026',
    updatedTimestamp: 1790582400000,
    type: 'pdf',
    status: 'Verified',
    securityTag: 'Strict Confidential',
    author: 'Kirkland & Ellis LLP',
    previewMeta: {
      pages: 12,
      checksum: 'sha256-118992a01bce8971f1124409bb7101824a71991',
      lastAuditedBy: 'Counsel'
    },
    previewContent: 'Unanimous written consent of the Board of Directors authorizing execution of exclusivity letter and access grant to the Glynac Virtual Data Room.'
  },

  // =========================================================================
  // FOLDER 02: FINANCIAL STATEMENTS
  // =========================================================================

  // 7. PDF (.pdf)
  {
    id: 'f-02-1',
    name: 'FY2026_Q3_Audited_Financial_Statements.pdf',
    folderCode: '02',
    binder: '02 · Financial Statements',
    size: '4.8 MB',
    sizeBytes: 5033164,
    updated: '2 hours ago',
    updatedTimestamp: 1791446400000,
    type: 'pdf',
    status: 'Verified',
    securityTag: 'Strict Confidential',
    author: 'Deloitte Corporate Finance',
    previewMeta: {
      pages: 48,
      checksum: 'sha256-e7f82b993a40871bc7190014a938fe210d79ce',
      lastAuditedBy: 'Deloitte Partner (Audit & Assurance)'
    },
    previewContent: 'Consolidated Statement of Operations, Balance Sheets, and Independent Auditor Negative Assurance Letter for trailing twelve months through Q3 FY2026.'
  },

  // 8. XLSX (.xlsx)
  {
    id: 'f-02-2',
    name: 'Historical_EBITDA_Reconciliation_Model.xlsx',
    folderCode: '02',
    binder: '02 · Financial Statements',
    size: '12.4 MB',
    sizeBytes: 13002342,
    updated: 'Yesterday',
    updatedTimestamp: 1791360000000,
    type: 'xlsx',
    status: 'Verified',
    securityTag: 'Restricted',
    author: 'Morgan & Sterling Advisory',
    previewMeta: {
      pages: 14,
      checksum: 'sha256-3a19bc04fe8829ad4117b98263cf9022e11a9b',
      lastAuditedBy: 'Deloitte Corporate Finance'
    },
    previewContent: 'Dynamic monthly financial workbook incorporating EBITDA bridge entries, non-operating add-backs, and carve-out run-rate expenses.'
  },

  // 9. PDF (.pdf)
  {
    id: 'f-02-3',
    name: 'Executive_Summary_Due_Diligence.pdf',
    folderCode: '02',
    binder: '02 · Financial Statements',
    size: '2.6 MB',
    sizeBytes: 2726297,
    updated: 'Sep 29, 2026',
    updatedTimestamp: 1790668800000,
    type: 'pdf',
    status: 'Verified',
    securityTag: 'Strict Confidential',
    author: 'Deloitte Corporate Finance',
    previewMeta: {
      pages: 22,
      checksum: 'sha256-88219afbc760230198aa71cbf89221010bbca99',
      lastAuditedBy: 'Lead Due Diligence Partner'
    },
    previewContent: 'High-level synthesis of financial audit findings, quality of revenue breakdown, customer churn cohort behavior, and net working capital targets.'
  },

  // 10. JSON (.json)
  {
    id: 'f-02-rev',
    name: 'SaaS_Cohort_Retention_&_ARR_Breakdown.json',
    folderCode: '02',
    binder: '02 · Financial Statements',
    size: '56 KB',
    sizeBytes: 57344,
    updated: 'Oct 03, 2026',
    updatedTimestamp: 1791014400000,
    type: 'json',
    status: 'Verified',
    securityTag: 'Restricted',
    author: 'VP Finance & Operations',
    previewMeta: {
      lines: 36,
      checksum: 'sha256-c488102a9918fb76021184a7102bca881729011',
      lastAuditedBy: 'Deloitte Diligence'
    },
    previewContent: JSON.stringify(
      {
        fiscalPeriod: 'FY2026-Q3-LTM',
        arrSummaryUsd: {
          openingArr: 142400000,
          newExpansion: 38200000,
          churnedArr: 6800000,
          endingArr: 173800000,
          netRevenueRetentionPercentage: 122.4,
          grossMarginSoftware: 83.6
        },
        customerCohorts: [
          { year: 2023, initialCustomers: 120, retainedCustomers: 109, expansionMultiple: '2.1x' },
          { year: 2024, initialCustomers: 184, retainedCustomers: 171, expansionMultiple: '1.7x' },
          { year: 2025, initialCustomers: 260, retainedCustomers: 248, expansionMultiple: '1.4x' }
        ]
      },
      null,
      2
    )
  },

  // 11. TXT (.txt)
  {
    id: 'f-02-tax',
    name: 'Tax_Structuring_Memo_Section_382_Limitations.txt',
    folderCode: '02',
    binder: '02 · Financial Statements',
    size: '18 KB',
    sizeBytes: 18432,
    updated: 'Sep 26, 2026',
    updatedTimestamp: 1790409600000,
    type: 'txt',
    status: 'Under Review',
    securityTag: 'Strict Confidential',
    author: 'PwC Tax Services',
    previewMeta: {
      lines: 29,
      checksum: 'sha256-99014ab1184c7188192a014a8bb189914c67101',
      lastAuditedBy: 'Tax Partner'
    },
    complianceFlags: [
      {
        id: 'tax-flag-1',
        section: 'Section 3.1',
        phrase: 'net operating loss carryforwards subject to annual IRC Section 382 limitation',
        severity: 'high',
        description: 'Ownership shift triggering annual deduction ceiling on $34.5M pre-change NOL assets.'
      }
    ],
    previewContent: `CONFIDENTIAL TAX MEMORANDUM
TARGET: FALCON TECHNOLOGIES INC.
ADVISOR: PWC TRANSACTION TAX SERVICES

1. NET OPERATING LOSS (NOL) OVERVIEW
Falcon Technologies maintains approximately $34.5M in cumulative federal NOL carryforwards generated between 2021 and 2024.

2. IRC SECTION 382 OWNERSHIP CHANGE ANALYSIS
Upon closing of the Proposed Transaction, an ownership change under IRC Section 382 will occur. As a consequence, net operating loss carryforwards subject to annual IRC Section 382 limitation will be restricted to an estimated $8.4M per taxable year based on current long-term tax-exempt rates.

3. STATE TAX APPORTIONMENT
Target maintains nexus across 32 jurisdictions with significant payroll apportionment in California and New York.`
  },

  // =========================================================================
  // FOLDER 03: COMMERCIAL CONTRACTS
  // =========================================================================

  // 12. DOCX (.docx)
  {
    id: 'f-03-1',
    name: 'Top_20_Enterprise_Customer_Master_Agreements.docx',
    folderCode: '03',
    binder: '03 · Commercial Contracts',
    size: '2.5 MB',
    sizeBytes: 2621440,
    updated: 'Sep 29, 2026',
    updatedTimestamp: 1790668800000,
    type: 'docx',
    status: 'Verified',
    securityTag: 'Restricted',
    author: 'Lead Commercial Counsel',
    previewMeta: {
      pages: 64,
      checksum: 'sha256-6cd429188ae90019284ba71a0019bf819281a8b',
      lastAuditedBy: 'Commercial Audit Team'
    },
    previewContent: 'Executed enterprise customer contracts representing top 20 revenue accounts, including pricing tiers, renewal windows, and termination covenants.'
  },

  // 13. PDF (.pdf)
  {
    id: 'f-03-aws',
    name: 'AWS_Enterprise_Cloud_Infrastructure_Master_SLA.pdf',
    folderCode: '03',
    binder: '03 · Commercial Contracts',
    size: '3.1 MB',
    sizeBytes: 3250585,
    updated: 'Oct 02, 2026',
    updatedTimestamp: 1790928000000,
    type: 'pdf',
    status: 'Verified',
    securityTag: 'Restricted',
    author: 'Amazon Web Services Inc.',
    previewMeta: {
      pages: 42,
      checksum: 'sha256-789a1102bca8190014a8b71029cba8817290141',
      lastAuditedBy: 'VP Cloud Infrastructure'
    },
    previewContent: 'Three-year enterprise committed spend agreement ($12.5M commitment), dedicated account support tiers, 99.99% availability service level covenants, and liquidated damages thresholds.'
  },

  // 14. TEXT (.txt) with Compliance Highlights
  {
    id: 'f-03-txt',
    name: 'Key_Customer_Contract_Audit_Summary.txt',
    folderCode: '03',
    binder: '03 · Commercial Contracts',
    size: '16 KB',
    sizeBytes: 16384,
    updated: 'Sep 30, 2026',
    updatedTimestamp: 1790755200000,
    type: 'txt',
    status: 'Under Review',
    securityTag: 'Strict Confidential',
    author: 'Morgan & Sterling Legal',
    previewMeta: {
      lines: 26,
      checksum: 'sha256-2bca8817290141789a1102bca8190014a8b7102',
      lastAuditedBy: 'Commercial Due Diligence Team'
    },
    complianceFlags: [
      {
        id: 'comm-flag-1',
        section: 'Item 4',
        phrase: 'most-favored-nation pricing guarantee with automatic downward adjustment',
        severity: 'high',
        description: 'Pricing restriction: Restricts future contract pricing autonomy across enterprise accounts.'
      },
      {
        id: 'comm-flag-2',
        section: 'Item 7',
        phrase: 'unilateral right of termination on 30 days notice upon change of control',
        severity: 'high',
        description: 'Customer loss risk: Top revenue client (Global Logistics Corp) holds change-of-control walkaway clause.'
      }
    ],
    previewContent: `GLYNAC VDR COMMERCIAL CONTRACT DILIGENCE REPORT
TARGET: FALCON TECHNOLOGIES INC.
DATE: SEPTEMBER 2026

1. SUMMARY OF REVIEW
Analysis of the top 35 customer agreements representing 78% of recurring enterprise subscription billings.

2. FLAGGED CONTRACTUAL COVENANTS
   - Item 4: Global Bank Tier 1 contract contains a most-favored-nation pricing guarantee with automatic downward adjustment if lower rates are extended to any financial peer.
   - Item 7: Contract with Global Logistics Corp ($4.8M ARR) contains a unilateral right of termination on 30 days notice upon change of control without financial penalty.

3. INDEMNITY CAPS
Standard customer liability capped at 12 months fees paid, with mutual carve-outs for confidentiality breach and gross negligence.`
  },

  // 15. XLSX (.xlsx)
  {
    id: 'f-03-sla',
    name: 'Vendor_Procurement_Register_&_Spend_Matrix.xlsx',
    folderCode: '03',
    binder: '03 · Commercial Contracts',
    size: '4.2 MB',
    sizeBytes: 4404019,
    updated: 'Sep 25, 2026',
    updatedTimestamp: 1790323200000,
    type: 'xlsx',
    status: 'Verified',
    securityTag: 'Advisory Only',
    author: 'Head of Procurement',
    previewMeta: {
      pages: 8,
      checksum: 'sha256-8817290141789a1102bca8190014a8b71022bca',
      lastAuditedBy: 'Procurement Audit'
    },
    previewContent: 'Comprehensive inventory of 74 third-party commercial software licenses, cloud providers, colocation hosting agreements, and auto-renewal cancellation notice deadlines.'
  },

  // 16. MARKDOWN (.md)
  {
    id: 'f-03-md',
    name: 'Strategic_Partnership_Framework_Notes.md',
    folderCode: '03',
    binder: '03 · Commercial Contracts',
    size: '22 KB',
    sizeBytes: 22528,
    updated: 'Sep 24, 2026',
    updatedTimestamp: 1790236800000,
    type: 'md',
    status: 'Verified',
    securityTag: 'Restricted',
    author: 'VP Business Development',
    previewMeta: {
      lines: 32,
      checksum: 'sha256-a1102bca8190014a8b71022bca8817290141789',
      lastAuditedBy: 'Deal Team'
    },
    previewContent: `# Strategic OEM Partnership Framework

**Partner:** Apex Global Cloud Systems  
**Status:** Multi-Year Active Integration  

---

### Deal Mechanics
- Revenue share: 80% to Falcon / 20% OEM partner.
- Exclusivity: Non-exclusive in North America; exclusive co-sell rights in Japan and South Korea.
- Term: 24 months remaining with automatic 1-year renewals.`
  },

  // =========================================================================
  // FOLDER 04: IP & PATENTS
  // =========================================================================

  // 17. IMAGE (.image / diagram)
  {
    id: 'f-04-img',
    name: 'Enterprise_Architecture_&_System_Topology.image',
    folderCode: '04',
    binder: '04 · IP & Patents',
    size: '1.8 MB',
    sizeBytes: 1887436,
    updated: 'Oct 03, 2026',
    updatedTimestamp: 1791014400000,
    type: 'image',
    status: 'Verified',
    securityTag: 'Restricted',
    author: 'Chief Technology Officer',
    previewMeta: {
      dimensions: '2400 x 1350 px',
      checksum: 'sha256-77bc014a8f912e98214bb01a892bca881729011',
      lastAuditedBy: 'Infrastructure Security Lead'
    },
    previewContent: 'Production Multi-Region Cloud VPC Architecture, Kubernetes Service Mesh, and HSM Encryption Vault Map.'
  },

  // 18. PDF (.pdf)
  {
    id: 'f-04-1',
    name: 'Core_Patent_Portfolio_Filing_Certificates.pdf',
    folderCode: '04',
    binder: '04 · IP & Patents',
    size: '3.8 MB',
    sizeBytes: 3984588,
    updated: 'Sep 27, 2026',
    updatedTimestamp: 1790496000000,
    type: 'pdf',
    status: 'Verified',
    securityTag: 'Strict Confidential',
    author: 'USPTO Registered Patent Counsel',
    previewMeta: {
      pages: 36,
      checksum: 'sha256-44a8fe017bca881928014a8109bb7101824a719',
      lastAuditedBy: 'IP Legal Counsel'
    },
    previewContent: 'Certified copies of 14 granted utility patents and 6 pending international applications covering core distributed consensus algorithms.'
  },

  // 19. MARKDOWN (.md) with Compliance Highlights
  {
    id: 'f-04-oss',
    name: 'Open_Source_Software_Audit_&_GPL_Risk.md',
    folderCode: '04',
    binder: '04 · IP & Patents',
    size: '41 KB',
    sizeBytes: 41984,
    updated: 'Sep 25, 2026',
    updatedTimestamp: 1790323200000,
    type: 'md',
    status: 'Under Review',
    securityTag: 'Strict Confidential',
    author: 'Black Duck Software Diligence',
    previewMeta: {
      lines: 48,
      checksum: 'sha256-55102a9918fb76021184a7102bca8817290141a',
      lastAuditedBy: 'IP Diligence Partner'
    },
    complianceFlags: [
      {
        id: 'oss-flag-1',
        section: 'Section 2.3',
        phrase: 'statically linked GPL v3.0 copyleft library inside proprietary indexing daemon',
        severity: 'high',
        description: 'Critical IP contamination risk: Copyleft obligations could compel disclosure of core source algorithms.'
      }
    ],
    previewContent: `# Open Source Software Due Diligence Audit

**Repository Audit:** Falcon Core Platform v4.2  
**Diligence Firm:** Black Duck by Synopsys  

---

### Executive IP Summary
A comprehensive binary and dependency scan of all 42 microservices was completed in September 2026. The platform utilizes 312 open-source components, predominantly under permissive MIT and Apache 2.0 licenses.

### Critical Contamination Flag
- **Component:** \`lib-consensus-fast-index\`
- **License:** GNU General Public License v3.0 (GPLv3)
- **Finding:** Audit detected a statically linked GPL v3.0 copyleft library inside proprietary indexing daemon without clean-room API isolation.
- **Remediation Plan:** Replace with Apache-licensed alternative (\`roaring-bitmap\`) prior to closing; estimated engineering effort: 12 man-days.`
  },

  // 20. JSON (.json)
  {
    id: 'f-04-crypto',
    name: 'Cryptographic_Key_Management_Schema.json',
    folderCode: '04',
    binder: '04 · IP & Patents',
    size: '28 KB',
    sizeBytes: 28672,
    updated: 'Sep 22, 2026',
    updatedTimestamp: 1790064000000,
    type: 'json',
    status: 'Verified',
    securityTag: 'Strict Confidential',
    author: 'Principal Security Architect',
    previewMeta: {
      lines: 34,
      checksum: 'sha256-88192a014a8bb189914c6710199014ab1184c718',
      lastAuditedBy: 'Cybersecurity Audit'
    },
    previewContent: JSON.stringify(
      {
        cryptographicStandard: 'FIPS 140-3 Level 3',
        keyHierarchy: {
          masterKeyStorage: 'AWS CloudHSM Cluster (us-east-1)',
          algorithm: 'AES-256-GCM',
          envelopeEncryption: true,
          keyRotationPeriodDays: 90
        },
        dataAtRestPolicy: {
          tablesEncrypted: ['documents', 'user_credentials', 'audit_ledger'],
          saltRounds: 14,
          tlsCipherSuites: [
            'TLS_AES_256_GCM_SHA384',
            'TLS_CHACHA20_POLY1305_SHA256'
          ]
        }
      },
      null,
      2
    )
  }
];
