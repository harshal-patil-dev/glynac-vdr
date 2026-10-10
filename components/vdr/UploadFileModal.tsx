'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Upload, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { VdrFolder, VdrDocument, FileType, SecurityTag } from '@/types/vdr';

interface UploadFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  folders: VdrFolder[];
  defaultFolderCode?: string | null;
  onUploadDocument: (newDoc: VdrDocument) => void;
}

export function UploadFileModal({
  isOpen,
  onClose,
  folders,
  defaultFolderCode,
  onUploadDocument,
}: UploadFileModalProps) {
  const [targetFolderCode, setTargetFolderCode] = useState(defaultFolderCode || folders[0]?.code || '01');
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState<FileType>('pdf');
  const [securityTag, setSecurityTag] = useState<SecurityTag>('Strict Confidential');
  const [author, setAuthor] = useState('Sarah Chen (Lead Advisor)');
  const [isUploading, setIsUploading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      const selectedFolder = folders.find((f) => f.code === targetFolderCode);
      const ext = fileType === 'image' ? '.png' : `.${fileType}`;
      const fullName = fileName.includes('.') ? fileName : `${fileName}${ext}`;

      const newDoc: VdrDocument = {
        id: `upload-${Date.now()}`,
        name: fullName,
        folderCode: targetFolderCode,
        binder: selectedFolder ? `${selectedFolder.code} · ${selectedFolder.name}` : 'General',
        size: '1.4 MB',
        sizeBytes: 1468006,
        updated: 'Just now',
        updatedTimestamp: Date.now(),
        type: fileType,
        status: 'Verified',
        securityTag: securityTag,
        author: author.trim() || 'Advisor Team',
        previewMeta: {
          pages: 18,
          checksum: `sha256-${Math.random().toString(36).substring(2, 15)}...`,
          lastAuditedBy: author.trim() || 'Advisor Team'
        },
        previewContent:
          fileType === 'json'
            ? JSON.stringify({ uploadId: Date.now(), status: 'Deposited in AES-256 Vault', recordCount: 120 }, null, 2)
            : `GLYNAC VDR DEPOSITED RECORD\nFILE: ${fullName}\nDEPOSITED BY: ${author}\nTIMESTAMP: ${new Date().toISOString()}\n\nThis document was successfully encrypted with AES-256 and deposited into the Project Falcon Virtual Data Room under ${securityTag} classification.`
      };

      onUploadDocument(newDoc);
      setIsUploading(false);
      setFileName('');
      onClose();
    }, 400);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#011238] flex items-center justify-center text-white">
                <Upload className="w-4 h-4 text-blue-300" />
              </div>
              <div>
                <h3 id="upload-modal-title" className="text-[15px] font-bold text-slate-900 leading-tight">
                  Upload & Encrypt Document
                </h3>
                <p className="text-[11px] text-slate-500">
                  AES-256 encrypted repository deposit
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6 space-y-4">
            {/* Target Folder Selector */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Target Binder
              </label>
              <select
                value={targetFolderCode}
                onChange={(e) => setTargetFolderCode(e.target.value)}
                className="w-full h-9.5 px-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white"
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.code}>
                    {folder.code} · {folder.name}
                  </option>
                ))}
              </select>
            </div>

            {/* File Name & Format */}
            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Document Title
                </label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  className="w-full h-9.5 px-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white"
                  placeholder="e.g. Q3_Audit_Letter"
                  required
                  autoFocus
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Format
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as FileType)}
                  className="w-full h-9.5 px-3 text-[13px] uppercase font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white"
                >
                  <option value="pdf">PDF</option>
                  <option value="txt">TXT</option>
                  <option value="md">MD</option>
                  <option value="json">JSON</option>
                  <option value="xlsx">XLSX</option>
                  <option value="docx">DOCX</option>
                  <option value="image">IMG</option>
                </select>
              </div>
            </div>

            {/* Security Classification */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Security Clearance
                </label>
                <select
                  value={securityTag}
                  onChange={(e) => setSecurityTag(e.target.value as SecurityTag)}
                  className="w-full h-9.5 px-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white"
                >
                  <option value="Strict Confidential">Strict Confidential</option>
                  <option value="Restricted">Restricted</option>
                  <option value="Advisory Only">Advisory Only</option>
                  <option value="Verified">Verified</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Depositor / Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full h-9.5 px-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white"
                  placeholder="Advisor Name"
                />
              </div>
            </div>

            {/* Simulated Drag & Drop Zone */}
            <div className="p-4 border-2 border-dashed border-[#CBD5E1] rounded-xl bg-[#F8FAFC] text-center flex flex-col items-center justify-center gap-1.5">
              <FileText className="w-6 h-6 text-slate-400" />
              <div className="text-[12px] font-medium text-slate-700">
                Drag and drop file here, or browse local disk
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                Watermarked · SHA-256 hash verified automatically
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 End-to-End</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-[12px] font-medium text-slate-700 bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!fileName.trim() || isUploading}
                className="px-4 py-2 text-[12px] font-semibold text-white bg-[#011238] hover:bg-[#07246b] disabled:opacity-50 disabled:pointer-events-none rounded-lg transition-colors cursor-pointer shadow-xs flex items-center gap-1.5"
              >
                {isUploading ? (
                  <span>Encrypting...</span>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-300" />
                    <span>Upload & Encrypt</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
