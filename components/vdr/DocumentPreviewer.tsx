'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  FileText,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Copy,
  Check,
  FileCode,
  Image as ImageIcon,
  Shield,
  ZoomIn,
  ZoomOut
} from 'lucide-react';
import { VdrDocument } from '@/types/vdr';

interface DocumentPreviewerProps {
  document: VdrDocument;
  onClose: () => void;
}

export function DocumentPreviewer({ document, onClose }: DocumentPreviewerProps) {
  const [copiedState, setCopiedState] = useState(false);
  const [imageZoomed, setImageZoomed] = useState(false);

  // Keyboard shortcut: close preview on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Security badge styling helper
  const getSecurityBadgeClass = (tag: string) => {
    switch (tag) {
      case 'Strict Confidential':
        return 'text-rose-700 bg-rose-50 border-rose-200';
      case 'Restricted':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      case 'Advisory Only':
        return 'text-blue-700 bg-blue-50 border-blue-200';
      default:
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
    }
  };

  // File type icon helper
  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-4 h-4 text-rose-600" />;
      case 'xlsx':
        return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
      case 'txt':
        return <FileText className="w-4 h-4 text-slate-600" />;
      case 'md':
        return <FileCode className="w-4 h-4 text-indigo-600" />;
      case 'image':
        return <ImageIcon className="w-4 h-4 text-purple-600" />;
      case 'json':
        return <FileCode className="w-4 h-4 text-amber-600" />;
      default:
        return <FileText className="w-4 h-4 text-blue-600" />;
    }
  };

  // Safe clipboard copy handler with fallback
  const handleCopyContent = useCallback((textToCopy?: string) => {
    const content = textToCopy || document.previewContent || '';
    if (!content) return;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard
        .writeText(content)
        .then(() => {
          setCopiedState(true);
          setTimeout(() => setCopiedState(false), 2000);
        })
        .catch(() => {
          fallbackCopyText(content);
        });
    } else {
      fallbackCopyText(content);
    }
  }, [document.previewContent]);

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = window.document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-9999px';
      window.document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      window.document.execCommand('copy');
      window.document.body.removeChild(textArea);
      setCopiedState(true);
      setTimeout(() => setCopiedState(false), 2000);
    } catch (e) {
      console.error('Copy fallback failed', e);
    }
  };

  // Helper to render text with highlighted compliance phrases
  const renderHighlightedText = (content: string) => {
    if (!document.complianceFlags || document.complianceFlags.length === 0) {
      return <span>{content}</span>;
    }

    let parts: React.ReactNode[] = [content];

    document.complianceFlags.forEach((flag) => {
      const phrase = flag.phrase;
      const newParts: React.ReactNode[] = [];

      parts.forEach((part, index) => {
        if (typeof part === 'string') {
          const splitIndex = part.indexOf(phrase);
          if (splitIndex !== -1) {
            newParts.push(part.substring(0, splitIndex));
            newParts.push(
              <mark
                key={`highlight-${flag.id}-${index}`}
                className="bg-amber-100 text-amber-950 font-semibold px-1 py-0.5 rounded border-b-2 border-amber-400 relative group cursor-help inline"
                title={`${flag.section}: ${flag.description}`}
              >
                {phrase}
                <span className="sr-only"> ({flag.section} Flagged)</span>
              </mark>
            );
            newParts.push(part.substring(splitIndex + phrase.length));
          } else {
            newParts.push(part);
          }
        } else {
          newParts.push(part);
        }
      });

      parts = newParts;
    });

    return <>{parts}</>;
  };

  // Dynamic Markdown parser for realistic .md preview
  const renderMarkdownContent = (rawMarkdown: string) => {
    const lines = rawMarkdown.split('\n');
    return (
      <div className="space-y-2.5 text-[12px] leading-relaxed text-slate-800">
        {lines.map((line, index) => {
          const trimmed = line.trim();

          // Horizontal rule
          if (trimmed === '---') {
            return <hr key={index} className="border-slate-200 my-3" />;
          }

          // Heading 1
          if (trimmed.startsWith('# ')) {
            return (
              <h3 key={index} className="text-[16px] font-bold text-slate-900 border-b border-slate-200 pb-2 mt-2">
                {renderHighlightedText(trimmed.replace('# ', ''))}
              </h3>
            );
          }

          // Heading 2
          if (trimmed.startsWith('## ')) {
            return (
              <h4 key={index} className="text-[14px] font-bold text-slate-900 mt-3">
                {renderHighlightedText(trimmed.replace('## ', ''))}
              </h4>
            );
          }

          // Heading 3
          if (trimmed.startsWith('### ')) {
            return (
              <h5 key={index} className="text-[13px] font-semibold text-slate-900 mt-2.5">
                {renderHighlightedText(trimmed.replace('### ', ''))}
              </h5>
            );
          }

          // List item
          if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const listText = trimmed.substring(2);
            return (
              <li key={index} className="ml-4 list-disc text-slate-700">
                {renderHighlightedText(listText)}
              </li>
            );
          }

          // Numbered list item
          if (/^\d+\.\s/.test(trimmed)) {
            const listText = trimmed.replace(/^\d+\.\s/, '');
            return (
              <li key={index} className="ml-4 list-decimal text-slate-700">
                {renderHighlightedText(listText)}
              </li>
            );
          }

          // Empty line
          if (!trimmed) {
            return <div key={index} className="h-1" />;
          }

          // Regular paragraph
          return (
            <p key={index} className="text-slate-700 leading-normal">
              {renderHighlightedText(trimmed)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <aside
      aria-label="Document Preview Panel"
      className="w-full md:w-[480px] lg:w-[540px] shrink-0 border-l border-[#E2E8F0] bg-white flex flex-col h-full shadow-lg z-20 overflow-hidden"
    >
      {/* 1. Header with Close Button */}
      <div className="p-4 border-b border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
            {getFileTypeIcon(document.type)}
          </div>
          <div className="min-w-0">
            <h2 className="text-[13px] font-bold text-slate-900 truncate" title={document.name}>
              {document.name}
            </h2>
            <div className="flex items-center gap-2 text-[10px] text-slate-400">
              <span className="uppercase font-mono font-semibold">{document.type}</span>
              <span>·</span>
              <span className="truncate">{document.binder}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${getSecurityBadgeClass(
              document.securityTag
            )}`}
          >
            {document.securityTag}
          </span>
          <button
            onClick={onClose}
            aria-label="Close document preview"
            title="Close preview (Esc)"
            className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Document Information Bar */}
      <div className="px-4 py-2.5 bg-[#F8FAFC] border-b border-[#E2E8F0] text-[11px] text-slate-500 shrink-0">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">FILE SIZE</span>
            <span className="font-mono text-slate-800 font-medium">{document.size}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">UPDATED</span>
            <span className="text-slate-800 font-medium truncate block">{document.updated}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">AUTHOR</span>
            <span className="text-slate-800 font-medium truncate block">{document.author || 'Advisor Team'}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">STATUS</span>
            <span className="text-emerald-700 font-medium flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {document.status}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Compliance Highlight Area (When flagged text exists) */}
      {document.complianceFlags && document.complianceFlags.length > 0 && (
        <div className="p-3 bg-amber-50/70 border-b border-amber-200 shrink-0">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center gap-1.5 text-amber-900 font-semibold text-[11px]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
              <span>Compliance Highlights ({document.complianceFlags.length} Flagged)</span>
            </div>
            <span className="text-[10px] font-mono text-amber-700 uppercase font-semibold">Audit Warning</span>
          </div>

          <div className="space-y-1.5 max-h-36 overflow-y-auto">
            {document.complianceFlags.map((flag) => (
              <div
                key={flag.id}
                className="p-2 bg-white/90 rounded border border-amber-200 text-[11px] text-slate-700 space-y-0.5 shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-900">{flag.section}</span>
                  <span
                    className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded ${
                      flag.severity === 'high'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {flag.severity} Risk
                  </span>
                </div>
                <div className="text-[10px] font-mono text-amber-900 italic bg-amber-50/60 p-1 rounded">
                  "{flag.phrase}"
                </div>
                <div className="text-[10px] text-slate-600">{flag.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Scrollable Document Content Previewer Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-[#F8F9FA]">
        {/* TEXT (.txt) Preview */}
        {document.type === 'txt' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1">
              <span className="font-mono text-[10px] uppercase">Plain Text Document</span>
              <button
                onClick={() => handleCopyContent()}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-[#E2E8F0] px-2 py-0.5 rounded transition-colors cursor-pointer"
              >
                {copiedState ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Text</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 font-mono text-[11px] leading-relaxed text-slate-800 shadow-2xs whitespace-pre-wrap select-text">
              {renderHighlightedText(document.previewContent || 'No text content available.')}
            </div>
          </div>
        )}

        {/* MARKDOWN (.md) Preview */}
        {document.type === 'md' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-[11px] text-slate-500 pb-1">
              <span className="font-mono text-[10px] uppercase">Formatted Markdown Document</span>
              <button
                onClick={() => handleCopyContent()}
                className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-slate-900 bg-white border border-[#E2E8F0] px-2 py-0.5 rounded transition-colors cursor-pointer"
              >
                {copiedState ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy Markdown</span>
                  </>
                )}
              </button>
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-2xs select-text">
              {renderMarkdownContent(document.previewContent || '')}
            </div>
          </div>
        )}

        {/* PDF (.pdf) Preview */}
        {document.type === 'pdf' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg shadow-sm p-6 relative flex flex-col justify-between min-h-[460px] select-text">
            {/* Protective Watermark Simulation */}
            <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center rotate-[-25deg] opacity-[0.06] text-black font-mono text-[11px] font-bold tracking-widest uppercase text-center px-4">
              CONFIDENTIAL // GLYNAC VDR // SARAH CHEN // SESSION #{document.id}
            </div>

            <div className="relative z-10 space-y-4">
              <div className="flex items-start justify-between border-b-2 border-slate-900 pb-3">
                <div>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-slate-500">
                    GLYNAC VDR SECURE VAULT · PROJECT FALCON
                  </span>
                  <h3 className="text-[14px] font-bold text-slate-900 mt-0.5">
                    {document.name.replace('.pdf', '')}
                  </h3>
                </div>
                <span className="font-mono text-[10px] text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">
                  PAGE 1 OF {document.previewMeta?.pages || 32}
                </span>
              </div>

              <div className="p-3 bg-slate-50 rounded border border-slate-200 space-y-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Auditor Certification & Executive Summary
                </span>
                <p className="text-[11px] text-slate-700 leading-relaxed">
                  {document.previewContent || 'Consolidated financial audit memorandum and due diligence comfort letter.'}
                </p>
              </div>

              {/* Mock Balance Sheet Summary Table */}
              <div className="space-y-1.5 text-[11px]">
                <div className="font-semibold text-slate-900 text-[12px]">Financial Highlights (in $ USD M)</div>
                <div className="border border-slate-200 rounded overflow-hidden">
                  <div className="grid grid-cols-3 bg-slate-100 p-2 font-mono text-[10px] font-semibold text-slate-600">
                    <div>METRIC</div>
                    <div className="text-right">FY25 AUDITED</div>
                    <div className="text-right">FY26 LTM</div>
                  </div>
                  <div className="divide-y divide-slate-100 font-mono text-[10px] text-slate-700">
                    <div className="grid grid-cols-3 p-2">
                      <div>Revenue</div>
                      <div className="text-right">$142.4M</div>
                      <div className="text-right font-semibold">$188.6M</div>
                    </div>
                    <div className="grid grid-cols-3 p-2 bg-slate-50/50">
                      <div>Gross Profit</div>
                      <div className="text-right">$96.8M</div>
                      <div className="text-right font-semibold">$132.0M</div>
                    </div>
                    <div className="grid grid-cols-3 p-2">
                      <div>Adj. EBITDA</div>
                      <div className="text-right">$32.1M</div>
                      <div className="text-right font-semibold">$48.5M</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-mono">
              <span>SHA-256: {document.previewMeta?.checksum || 'verified'}</span>
              <span className="text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-semibold">
                WATERMARK ENFORCED
              </span>
            </div>
          </div>
        )}

        {/* IMAGE (.image / .png) Preview */}
        {document.type === 'image' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span className="font-medium text-slate-800">
                {document.previewContent && document.previewContent.startsWith('data:image/')
                  ? 'Uploaded Image Preview'
                  : 'System Topology Diagram'}
              </span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">
                  {document.previewMeta?.dimensions || '2400 x 1350 px'}
                </span>
                <button
                  onClick={() => setImageZoomed(!imageZoomed)}
                  className="p-1 text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                  title={imageZoomed ? 'Zoom Out' : 'Zoom In'}
                >
                  {imageZoomed ? <ZoomOut className="w-3.5 h-3.5" /> : <ZoomIn className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* High-Fidelity Enterprise Architecture Diagram Vector or Uploaded Image */}
            {document.previewContent && document.previewContent.startsWith('data:image/') ? (
              <div className="w-full bg-slate-900 rounded-lg p-2 flex items-center justify-center overflow-hidden border border-slate-800">
                <img
                  src={document.previewContent}
                  alt={document.name}
                  className={`object-contain transition-all duration-200 ${
                    imageZoomed ? 'max-h-[500px]' : 'max-h-64'
                  }`}
                />
              </div>
            ) : (
              <div
                className={`w-full bg-[#0A1128] rounded-lg p-4 flex flex-col justify-between relative overflow-hidden border border-slate-800 shadow-inner transition-all duration-200 ${
                  imageZoomed ? 'h-96' : 'h-64'
                }`}
              >
                <div className="flex justify-between items-center text-[10px] font-mono text-blue-400 border-b border-blue-900/40 pb-2">
                  <span>VPC-EAST-01 · PRODUCTION CLUSTER</span>
                  <span className="text-emerald-400">ACTIVE · HIGH AVAILABILITY</span>
                </div>

                {/* Architecture Node Visuals */}
                <div className="grid grid-cols-3 gap-2.5 my-auto">
                  <div className="p-2.5 rounded bg-blue-950/60 border border-blue-800 text-center space-y-1">
                    <div className="text-[10px] font-mono text-blue-300 font-bold">API GATEWAY</div>
                    <div className="text-[9px] text-slate-400">TLS 1.3 · WAF Layer</div>
                    <div className="h-1 bg-blue-500 rounded-full mt-1"></div>
                  </div>

                  <div className="p-2.5 rounded bg-indigo-950/60 border border-indigo-800 text-center space-y-1">
                    <div className="text-[10px] font-mono text-indigo-300 font-bold">K8S SERVICE MESH</div>
                    <div className="text-[9px] text-slate-400">48 Microservices</div>
                    <div className="h-1 bg-indigo-500 rounded-full mt-1"></div>
                  </div>

                  <div className="p-2.5 rounded bg-emerald-950/60 border border-emerald-800 text-center space-y-1">
                    <div className="text-[10px] font-mono text-emerald-300 font-bold">ENCRYPTED VAULT</div>
                    <div className="text-[9px] text-slate-400">AES-256 HSM Storage</div>
                    <div className="h-1 bg-emerald-500 rounded-full mt-1"></div>
                  </div>
                </div>

                <div className="flex justify-between text-[9px] font-mono text-slate-500 pt-2 border-t border-blue-900/40">
                  <span>MULTI-REGION REPLICATION: US-EAST / EU-CENTRAL</span>
                  <span>FAILOVER: &lt; 300MS</span>
                </div>
              </div>
            )}

            <p className="text-[11px] text-slate-500">
              {document.previewContent}
            </p>
          </div>
        )}

        {/* JSON (.json) Preview */}
        {document.type === 'json' && (
          <div className="bg-[#0F172A] border border-slate-800 rounded-lg overflow-hidden shadow-md">
            <div className="p-2.5 bg-[#020A1E] border-b border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span className="font-mono text-slate-300">{document.name}</span>
              <button
                onClick={() => handleCopyContent()}
                className="flex items-center gap-1 text-[10px] font-semibold text-blue-400 hover:text-blue-300 bg-blue-950/60 border border-blue-800/80 px-2 py-0.5 rounded transition-colors cursor-pointer"
              >
                {copiedState ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" />
                    <span>Copy JSON</span>
                  </>
                )}
              </button>
            </div>

            <pre className="p-4 text-[11px] font-mono leading-relaxed text-slate-200 overflow-x-auto max-h-[460px] select-text">
              <code>{document.previewContent}</code>
            </pre>
          </div>
        )}

        {/* XLSX (.xlsx) Preview fallback */}
        {document.type === 'xlsx' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-4 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-[11px] text-slate-500">
              <span>Financial Workbook: 3 Sheets</span>
              <span className="font-mono text-[10px] bg-slate-100 px-2 py-0.5 rounded">MS Excel Model</span>
            </div>
            <div className="border border-slate-200 rounded overflow-hidden text-[10px] font-mono">
              <div className="grid grid-cols-4 bg-emerald-50 text-emerald-950 font-bold p-2 border-b border-emerald-200">
                <div>LINE ITEM</div>
                <div className="text-right">FY24</div>
                <div className="text-right">FY25</div>
                <div className="text-right">FY26 LTM</div>
              </div>
              <div className="divide-y divide-slate-100">
                <div className="grid grid-cols-4 p-2">
                  <div className="font-medium text-slate-900">GAAP Operating Income</div>
                  <div className="text-right">$24.2M</div>
                  <div className="text-right">$28.6M</div>
                  <div className="text-right font-semibold">$36.4M</div>
                </div>
                <div className="grid grid-cols-4 p-2 bg-slate-50/60">
                  <div className="text-slate-600">+ Non-recurring Legal</div>
                  <div className="text-right">$1.8M</div>
                  <div className="text-right">$2.1M</div>
                  <div className="text-right">$1.4M</div>
                </div>
                <div className="grid grid-cols-4 p-2">
                  <div className="text-slate-600">+ Carve-Out Synergy Peg</div>
                  <div className="text-right">$4.2M</div>
                  <div className="text-right">$5.6M</div>
                  <div className="text-right">$8.2M</div>
                </div>
                <div className="grid grid-cols-4 p-2 bg-emerald-50/40 font-bold text-emerald-900">
                  <div>Adjusted EBITDA (Target)</div>
                  <div className="text-right">$30.2M</div>
                  <div className="text-right">$36.3M</div>
                  <div className="text-right font-semibold">$46.0M</div>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">{document.previewContent}</p>
          </div>
        )}

        {/* DOCX (.docx) Preview fallback */}
        {document.type === 'docx' && (
          <div className="bg-white border border-[#E2E8F0] rounded-lg p-5 shadow-2xs space-y-3 select-text">
            <div className="border-b border-slate-200 pb-2">
              <h4 className="font-bold text-[13px] text-slate-900">{document.name}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5">Author: {document.author}</p>
            </div>
            <p className="text-[12px] text-slate-700 leading-relaxed">
              {document.previewContent}
            </p>
            <div className="p-3 bg-slate-50 rounded text-[11px] text-slate-600 border border-slate-200">
              <span className="font-semibold text-slate-800 block mb-1">Standard Diligence Note:</span>
              Executed agreements have been verified against original wet-signature counterparts deposited in escrow.
            </div>
          </div>
        )}
      </div>

      {/* 5. Footer Actions */}
      <div className="p-3 bg-white border-t border-[#E2E8F0] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
          <Lock className="w-3 h-3 text-slate-400" />
          <span>VDR Read-Only Session</span>
        </div>

        <button
          onClick={onClose}
          className="px-3.5 py-1.5 text-[12px] font-semibold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
        >
          Close Preview
        </button>
      </div>
    </aside>
  );
}
