/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type FileType = 'pdf' | 'xlsx' | 'docx' | 'txt' | 'md' | 'image' | 'json';

export type SecurityTag =
  | 'Strict Confidential'
  | 'Restricted'
  | 'Advisory Only'
  | 'Verified'
  | 'Standard Internal';

export interface ComplianceFlag {
  id: string;
  section: string;
  phrase: string;
  severity: 'high' | 'medium' | 'info';
  description: string;
}

export interface VdrFolder {
  id: string;
  code: string;
  name: string;
  count: string;
  size: string;
  description?: string;
}

export interface VdrDocument {
  id: string;
  name: string;
  folderCode: string;
  binder: string;
  size: string;
  sizeBytes: number;
  updated: string;
  updatedTimestamp: number;
  type: FileType;
  status: 'Verified' | 'Under Review' | 'Draft';
  securityTag: SecurityTag;
  author?: string;
  // Mock preview fields
  previewContent?: string;
  previewMeta?: {
    pages?: number;
    lines?: number;
    dimensions?: string;
    checksum?: string;
    lastAuditedBy?: string;
  };
  complianceFlags?: ComplianceFlag[];
}

export type SortField = 'name' | 'updated' | 'type' | 'size' | 'binder' | 'securityTag';
export type SortOrder = 'asc' | 'desc';
