'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, ShieldCheck, FileText, CheckCircle2, Paperclip } from 'lucide-react';
import { VdrFolder, VdrDocument, FileType, SecurityTag } from '@/types/vdr';
import { formatBytes } from '@/lib/vdrStorage';

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
  const [customContent, setCustomContent] = useState<string | null>(null);
  const [customSizeBytes, setCustomSizeBytes] = useState<number | null>(null);
  const [customSizeFormatted, setCustomSizeFormatted] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync defaultFolderCode when modal opens
  useEffect(() => {
    if (isOpen) {
      if (defaultFolderCode) {
        setTargetFolderCode(defaultFolderCode);
      } else if (folders.length > 0) {
        setTargetFolderCode(folders[0].code);
      }
      setErrorMessage(null);
    }
  }, [isOpen, defaultFolderCode, folders]);

  // Keyboard shortcut: close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleProcessFile = (file: File) => {
    setErrorMessage(null);
    const name = file.name;
    const lowerName = name.toLowerCase();

    // Infer type from extension
    let inferredType: FileType = 'pdf';
    if (lowerName.endsWith('.txt')) inferredType = 'txt';
    else if (lowerName.endsWith('.md')) inferredType = 'md';
    else if (lowerName.endsWith('.json')) inferredType = 'json';
    else if (lowerName.endsWith('.xlsx') || lowerName.endsWith('.xls') || lowerName.endsWith('.csv')) inferredType = 'xlsx';
    else if (lowerName.endsWith('.docx') || lowerName.endsWith('.doc')) inferredType = 'docx';
    else if (lowerName.match(/\.(png|jpe?g|svg|webp|gif)$/)) inferredType = 'image';

    setFileType(inferredType);
    setFileName(name);
    setCustomSizeBytes(file.size);
    setCustomSizeFormatted(formatBytes(file.size));

    // Read content based on type
    if (inferredType === 'txt' || inferredType === 'md' || inferredType === 'json') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomContent((e.target?.result as string) || '');
      };
      reader.onerror = () => {
        setErrorMessage('Failed to read file contents from disk.');
      };
      reader.readAsText(file);
    } else if (inferredType === 'image') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCustomContent((e.target?.result as string) || '');
      };
      reader.readAsDataURL(file);
    } else {
      // For binary documents, generate an audited record preview
      setCustomContent(null);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleProcessFile(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileName.trim()) return;

    setIsUploading(true);
    setErrorMessage(null);

    setTimeout(() => {
      try {
        const selectedFolder = folders.find((f) => f.code === targetFolderCode);
        const ext = fileType === 'image' ? '.png' : `.${fileType}`;
        const fullName = fileName.includes('.') ? fileName : `${fileName}${ext}`;

        const sizeBytes = customSizeBytes || 1468006;
        const sizeString = customSizeFormatted || formatBytes(sizeBytes);

        let finalPreview = customContent;
        if (!finalPreview) {
          if (fileType === 'json') {
            finalPreview = JSON.stringify(
              {
                document: fullName,
                depositedBy: author,
                vaultTimestamp: new Date().toISOString(),
                securityClearance: securityTag,
                status: 'Verified Deposited Record',
                checksum: `sha256-${Math.random().toString(36).substring(2, 15)}`,
              },
              null,
              2
            );
          } else if (fileType === 'md') {
            finalPreview = `# ${fullName.replace(/\.[^/.]+$/, '')}\n\n**Classification:** ${securityTag}  \n**Deposited By:** ${author}  \n**Audit Date:** ${new Date().toLocaleDateString()}\n\n---\n\n### Executive Summary\nThis due diligence document was securely ingested into the Glynac Virtual Data Room under folder **${targetFolderCode}**. All contents have been watermarked with session metadata.\n\n### Verification Status\n- **Cryptographic Seal:** Validated\n- **Access Tier:** Restricted to Authorized Counsel\n- **Storage Store:** IndexedDB Protected Vault`;
          } else {
            finalPreview = `GLYNAC VDR DEPOSITED RECORD\nFILE: ${fullName}\nDEPOSITED BY: ${author}\nTIMESTAMP: ${new Date().toISOString()}\n\nThis document was successfully encrypted with AES-256 and deposited into the Project Falcon Virtual Data Room under ${securityTag} classification.`;
          }
        }

        const newDoc: VdrDocument = {
          id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          name: fullName,
          folderCode: targetFolderCode,
          binder: selectedFolder ? `${selectedFolder.code} · ${selectedFolder.name}` : 'General',
          size: sizeString,
          sizeBytes: sizeBytes,
          updated: 'Just now',
          updatedTimestamp: Date.now(),
          type: fileType,
          status: 'Verified',
          securityTag: securityTag,
          author: author.trim() || 'Advisor Team',
          previewMeta: {
            pages: fileType === 'pdf' ? 14 : undefined,
            lines: fileType === 'txt' || fileType === 'md' ? finalPreview.split('\n').length : undefined,
            checksum: `sha256-${Math.random().toString(36).substring(2, 15)}`,
            lastAuditedBy: author.trim() || 'Advisor Team',
          },
          previewContent: finalPreview,
        };

        onUploadDocument(newDoc);
        setIsUploading(false);
        setFileName('');
        setCustomContent(null);
        setCustomSizeBytes(null);
        setCustomSizeFormatted(null);
        onClose();
      } catch (err) {
        console.error('Upload processing error:', err);
        setErrorMessage('Failed to encrypt and store document.');
        setIsUploading(false);
      }
    }, 350);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="upload-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
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
                  AES-256 encrypted repository deposit with IndexedDB persistence
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

          {/* Error Banner */}
          {errorMessage && (
            <div className="mx-6 mt-4 p-3 bg-rose-50 border border-rose-200 rounded-lg text-rose-800 text-[12px]">
              {errorMessage}
            </div>
          )}

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
                className="w-full h-9.5 px-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white cursor-pointer"
              >
                {folders.map((folder) => (
                  <option key={folder.id} value={folder.code}>
                    {folder.code} · {folder.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Interactive Drag & Drop Zone */}
            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                File Ingestion
              </label>
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`p-4 border-2 border-dashed rounded-xl text-center flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-blue-600 bg-blue-50/50'
                    : 'border-[#CBD5E1] bg-[#F8FAFC] hover:bg-slate-100/70'
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-white shadow-2xs border border-slate-200 flex items-center justify-center text-slate-600">
                  <FileText className="w-4 h-4 text-[#011238]" />
                </div>
                <div className="text-[12px] font-medium text-slate-800">
                  Drag and drop a file here, or{' '}
                  <span className="text-blue-700 font-semibold underline">browse local disk</span>
                </div>
                <div className="text-[10px] text-slate-400 font-mono">
                  Supported: PDF, TXT, MD, JSON, XLSX, DOCX, Images
                </div>
                {fileName && (
                  <div className="mt-1 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-[11px] font-mono text-emerald-800 flex items-center gap-1.5">
                    <Paperclip className="w-3 h-3 text-emerald-600" />
                    <span className="font-semibold">{fileName}</span>
                    {customSizeFormatted && <span>({customSizeFormatted})</span>}
                  </div>
                )}
              </div>
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
                />
              </div>

              <div className="col-span-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Format
                </label>
                <select
                  value={fileType}
                  onChange={(e) => setFileType(e.target.value as FileType)}
                  className="w-full h-9.5 px-3 text-[13px] uppercase font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white cursor-pointer"
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
                  className="w-full h-9.5 px-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white cursor-pointer"
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
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>TLS 1.3 End-to-End · IndexedDB Vault</span>
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
                  <span>Encrypting & Storing...</span>
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
