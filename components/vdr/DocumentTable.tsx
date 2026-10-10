'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Shield, ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react';
import { VdrDocument, SortField, SortOrder } from '@/types/vdr';

interface DocumentTableProps {
  documents: VdrDocument[];
  sortField: SortField;
  sortOrder: SortOrder;
  onSortChange: (field: SortField) => void;
  onSelectDocument?: (doc: VdrDocument) => void;
  selectedDocumentId?: string | null;
  onClearFilters?: () => void;
  searchActive?: boolean;
}

export function DocumentTable({
  documents,
  sortField,
  sortOrder,
  onSortChange,
  onSelectDocument,
  selectedDocumentId,
  onClearFilters,
  searchActive = false,
}: DocumentTableProps) {
  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-3 h-3 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="w-3 h-3 text-[#011238]" />
    ) : (
      <ArrowDown className="w-3 h-3 text-[#011238]" />
    );
  };

  const getSecurityBadgeClass = (tag: string) => {
    switch (tag) {
      case 'Strict Confidential':
        return 'text-rose-700 bg-rose-50 border-rose-100';
      case 'Restricted':
        return 'text-amber-700 bg-amber-50 border-amber-100';
      case 'Advisory Only':
        return 'text-blue-700 bg-blue-50 border-blue-100';
      case 'Verified':
        return 'text-emerald-700 bg-emerald-50 border-emerald-100';
      default:
        return 'text-slate-600 bg-slate-50 border-slate-200';
    }
  };

  const renderTypeBadge = (type: string) => {
    switch (type) {
      case 'pdf':
        return (
          <div className="w-7 h-7 rounded bg-rose-50 text-rose-700 border border-rose-100 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            PDF
          </div>
        );
      case 'xlsx':
        return (
          <div className="w-7 h-7 rounded bg-emerald-50 text-emerald-700 border border-emerald-100 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            XLS
          </div>
        );
      case 'docx':
        return (
          <div className="w-7 h-7 rounded bg-blue-50 text-blue-700 border border-blue-100 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            DOC
          </div>
        );
      case 'txt':
        return (
          <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            TXT
          </div>
        );
      case 'md':
        return (
          <div className="w-7 h-7 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            MD
          </div>
        );
      case 'image':
        return (
          <div className="w-7 h-7 rounded bg-purple-50 text-purple-700 border border-purple-100 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            IMG
          </div>
        );
      case 'json':
        return (
          <div className="w-7 h-7 rounded bg-amber-50 text-amber-700 border border-amber-100 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            JSON
          </div>
        );
      default:
        return (
          <div className="w-7 h-7 rounded bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center text-[10px] font-bold font-mono shrink-0">
            DOC
          </div>
        );
    }
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white border border-[#E2E8F0] rounded-xl p-12 text-center shadow-2xs">
        <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-3">
          <Shield className="w-6 h-6" />
        </div>
        <h4 className="text-[14px] font-semibold text-slate-800">No documents found</h4>
        <p className="text-[12px] text-slate-400 mt-1 max-w-sm mx-auto">
          {searchActive
            ? 'No files matched your search or filter criteria in this view.'
            : 'There are currently no documents in this folder.'}
        </p>
        {onClearFilters && (
          <button
            onClick={onClearFilters}
            className="mt-4 px-3.5 py-1.5 text-[12px] font-semibold text-[#011238] bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Reset Filters
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-xl overflow-hidden shadow-2xs">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC] text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            <th
              onClick={() => onSortChange('name')}
              className="py-3 px-5 cursor-pointer select-none group"
            >
              <div className="flex items-center gap-1.5">
                <span>NAME</span>
                {renderSortIndicator('name')}
              </div>
            </th>
            <th
              onClick={() => onSortChange('binder')}
              className="py-3 px-5 hidden md:table-cell cursor-pointer select-none group"
            >
              <div className="flex items-center gap-1.5">
                <span>BINDER</span>
                {renderSortIndicator('binder')}
              </div>
            </th>
            <th
              onClick={() => onSortChange('size')}
              className="py-3 px-5 cursor-pointer select-none group"
            >
              <div className="flex items-center gap-1.5">
                <span>SIZE</span>
                {renderSortIndicator('size')}
              </div>
            </th>
            <th
              onClick={() => onSortChange('updated')}
              className="py-3 px-5 hidden sm:table-cell cursor-pointer select-none group"
            >
              <div className="flex items-center gap-1.5">
                <span>UPDATED</span>
                {renderSortIndicator('updated')}
              </div>
            </th>
            <th
              onClick={() => onSortChange('securityTag')}
              className="py-3 px-5 hidden lg:table-cell cursor-pointer select-none group"
            >
              <div className="flex items-center gap-1.5">
                <span>SECURITY</span>
                {renderSortIndicator('securityTag')}
              </div>
            </th>
            <th className="py-3 px-5 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-[#F1F5F9] text-[13px]">
          {documents.map((file) => {
            const isSelected = selectedDocumentId === file.id;
            return (
              <tr
                key={file.id}
                onClick={() => onSelectDocument?.(file)}
                className={`transition-colors cursor-pointer select-none ${
                  isSelected
                    ? 'bg-blue-50/70 border-l-2 border-l-[#011238]'
                    : 'hover:bg-slate-50/70'
                }`}
              >
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    {renderTypeBadge(file.type)}
                    <div className="min-w-0">
                      <span
                        className={`font-medium truncate block ${
                          isSelected ? 'text-[#011238] font-semibold' : 'text-slate-900 hover:text-blue-900'
                        }`}
                      >
                        {file.name}
                      </span>
                      <span className="text-[11px] text-slate-400 block sm:hidden">
                        {file.size} · {file.updated}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="py-3.5 px-5 text-slate-500 text-[12px] hidden md:table-cell">
                  {file.binder}
                </td>
                <td className="py-3.5 px-5 font-mono text-[12px] text-slate-500">
                  {file.size}
                </td>
                <td className="py-3.5 px-5 text-slate-400 text-[12px] hidden sm:table-cell">
                  {file.updated}
                </td>
                <td className="py-3.5 px-5 hidden lg:table-cell">
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium border ${getSecurityBadgeClass(
                      file.securityTag
                    )}`}
                  >
                    {file.securityTag}
                  </span>
                </td>
                <td className="py-3.5 px-5 text-right">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectDocument?.(file);
                    }}
                    className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#011238] text-white shadow-xs'
                        : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100/70'
                    }`}
                  >
                    <Eye className="w-3 h-3" />
                    <span>{isSelected ? 'Viewing' : 'Preview'}</span>
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
