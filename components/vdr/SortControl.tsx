'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { SortField, SortOrder } from '@/types/vdr';

interface SortControlProps {
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  onToggleOrder: () => void;
}

export function SortControl({
  sortField,
  sortOrder,
  onSortChange,
  onToggleOrder,
}: SortControlProps) {
  return (
    <div className="flex items-center gap-1.5 text-[12px]">
      <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider hidden sm:inline">
        Sort:
      </span>

      <div className="flex items-center bg-white border border-[#E2E8F0] rounded-lg p-0.5 shadow-2xs">
        <select
          value={sortField}
          aria-label="Sort documents by"
          onChange={(e) => onSortChange(e.target.value as SortField)}
          className="bg-transparent text-slate-800 text-[12px] font-medium px-2 py-1 focus:outline-none cursor-pointer"
        >
          <option value="updated">Date (Updated)</option>
          <option value="name">Document Name</option>
          <option value="type">File Type</option>
          <option value="size">File Size</option>
          <option value="securityTag">Security Clearance</option>
          <option value="binder">Binder / Folder</option>
        </select>

        <button
          onClick={onToggleOrder}
          title={sortOrder === 'asc' ? 'Ascending (A-Z, oldest first)' : 'Descending (Z-A, newest first)'}
          aria-label="Toggle sort order"
          className="p-1 text-slate-400 hover:text-slate-800 rounded transition-colors cursor-pointer border-l border-[#F1F5F9]"
        >
          {sortOrder === 'asc' ? (
            <ArrowUp className="w-3.5 h-3.5 text-[#011238]" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 text-[#011238]" />
          )}
        </button>
      </div>
    </div>
  );
}
