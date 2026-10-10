'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ChevronRight, HardDrive, FileText } from 'lucide-react';
import { VdrFolder, VdrDocument } from '@/types/vdr';

interface BreadcrumbsProps {
  currentFolder: VdrFolder | null;
  selectedDocument?: VdrDocument | null;
  onNavigateRoot: () => void;
  onNavigateFolder?: (folder: VdrFolder) => void;
  rootLabel?: string;
}

export function Breadcrumbs({
  currentFolder,
  selectedDocument,
  onNavigateRoot,
  onNavigateFolder,
  rootLabel = 'Project Falcon',
}: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[12px] flex-wrap">
      {/* 1. Root / Deal Room Level */}
      <button
        onClick={onNavigateRoot}
        className={`flex items-center gap-1.5 font-medium transition-colors cursor-pointer ${
          currentFolder || selectedDocument
            ? 'text-slate-500 hover:text-slate-900'
            : 'text-slate-900 font-semibold'
        }`}
      >
        <HardDrive className="w-3.5 h-3.5 text-slate-400" />
        <span>{rootLabel}</span>
      </button>

      {/* 2. Folder Level */}
      {currentFolder && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <button
            onClick={() => onNavigateFolder?.(currentFolder)}
            className={`font-semibold transition-colors cursor-pointer truncate max-w-[200px] ${
              selectedDocument
                ? 'text-slate-500 hover:text-slate-900 font-medium'
                : 'text-slate-900 font-semibold'
            }`}
          >
            {currentFolder.code} · {currentFolder.name}
          </button>
        </>
      )}

      {/* 3. Document Leaf Level (when preview is open) */}
      {selectedDocument && (
        <>
          <ChevronRight className="w-3.5 h-3.5 text-slate-300 shrink-0" />
          <span className="flex items-center gap-1 font-semibold text-[#011238] truncate max-w-[220px]">
            <FileText className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{selectedDocument.name}</span>
          </span>
        </>
      )}
    </nav>
  );
}
