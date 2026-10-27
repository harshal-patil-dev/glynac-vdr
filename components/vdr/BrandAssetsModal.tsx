'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Copy, Check, Download, Sparkles } from 'lucide-react';
import { GlynacGVLogo } from '@/components/vdr/GlynacGVLogo';

interface BrandAssetsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SVG_CODE = `<svg width="1000" height="1000" viewBox="0 0 1000 1000" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="1000" height="1000" rx="200" fill="#011238"/>
  <path d="M 571 314 A 214 214 0 1 0 449 659 L 437 599 A 152 152 0 1 1 523 354 Z" fill="white"/>
  <path d="M 388 440 L 602 440 L 565 500 L 492 500 L 582 656 L 708 440 L 792 440 L 582 772 Z" fill="white"/>
</svg>`;

export function BrandAssetsModal({ isOpen, onClose }: BrandAssetsModalProps) {
  const [copied, setCopied] = useState(false);

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

  const handleCopySvg = () => {
    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(SVG_CODE).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    } else {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = SVG_CODE;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleDownloadSvg = () => {
    const blob = new Blob([SVG_CODE], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glynac-vdr-logo.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="brand-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#011238] flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4 text-blue-300" />
            </div>
            <div>
              <h3 id="brand-modal-title" className="text-[15px] font-bold text-slate-900 leading-tight">
                Glynac VDR Brand Identity
              </h3>
              <p className="text-[11px] text-slate-500">
                Official Enterprise GV Vector Monogram & Assets
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close brand modal"
            className="p-1.5 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Main Logo Display */}
          <div className="p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl flex flex-col items-center justify-center gap-4">
            <GlynacGVLogo size={84} />
            <div className="text-center">
              <div className="text-[14px] font-bold tracking-tight text-[#0F172A]">
                GLYNAC <span className="text-slate-400 font-semibold">VDR</span>
              </div>
              <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                Hex Vault Squircle · Circular 'G' · Precision 'V' Monogram
              </div>
            </div>
          </div>

          {/* Size Variations */}
          <div>
            <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              Scale Preview
            </label>
            <div className="grid grid-cols-4 gap-3 p-3 bg-white border border-[#E2E8F0] rounded-xl text-center">
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F8FAFC]">
                <GlynacGVLogo size={48} />
                <span className="font-mono text-[10px] text-slate-400 mt-2">48px</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F8FAFC]">
                <GlynacGVLogo size={36} />
                <span className="font-mono text-[10px] text-slate-400 mt-2">36px (UI)</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F8FAFC]">
                <GlynacGVLogo size={24} />
                <span className="font-mono text-[10px] text-slate-400 mt-2">24px</span>
              </div>
              <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-[#F8FAFC]">
                <GlynacGVLogo size={18} />
                <span className="font-mono text-[10px] text-slate-400 mt-2">18px (Tab)</span>
              </div>
            </div>
          </div>

          {/* Color Specifications */}
          <div className="grid grid-cols-2 gap-3 text-[11px]">
            <div className="p-2.5 rounded-lg border border-[#E2E8F0] flex items-center gap-2.5">
              <div className="w-5 h-5 rounded bg-[#011238] border border-slate-300"></div>
              <div>
                <span className="font-semibold text-slate-800 block">Obsidian Navy</span>
                <span className="font-mono text-slate-400">#011238</span>
              </div>
            </div>
            <div className="p-2.5 rounded-lg border border-[#E2E8F0] flex items-center gap-2.5">
              <div className="w-5 h-5 rounded bg-white border border-slate-300"></div>
              <div>
                <span className="font-semibold text-slate-800 block">Vector White</span>
                <span className="font-mono text-slate-400">#FFFFFF</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-between gap-3">
          <button
            onClick={handleDownloadSvg}
            className="px-3.5 py-2 text-[12px] font-semibold text-slate-700 bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Download SVG</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySvg}
              className="px-4 py-2 text-[12px] font-semibold text-white bg-[#011238] hover:bg-[#07246b] rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>SVG Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-300" />
                  <span>Copy SVG Vector</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
