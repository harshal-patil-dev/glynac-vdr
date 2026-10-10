'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Folder } from 'lucide-react';
import { VdrFolder } from '@/types/vdr';

interface FolderCardProps {
  folder: VdrFolder;
  isSelected: boolean;
  onSelect: (folderCode: string) => void;
}

export function FolderCard({ folder, isSelected, onSelect }: FolderCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(folder.code)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(folder.code);
        }
      }}
      className={`p-4 rounded-xl border transition-all cursor-pointer bg-white select-none text-left ${
        isSelected
          ? 'border-[#011238] ring-1 ring-[#011238] shadow-xs'
          : 'border-[#E2E8F0] hover:border-slate-300 hover:shadow-2xs'
      }`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="w-9 h-9 rounded-lg bg-blue-50 text-[#1E3A8A] flex items-center justify-center">
          <Folder className="w-4 h-4 fill-blue-500/10" />
        </div>
        <span className="font-mono text-[11px] text-slate-400 font-semibold">
          {folder.code}
        </span>
      </div>
      <div className="text-[13px] font-semibold text-slate-900 truncate">
        {folder.name}
      </div>
      <div className="mt-1 flex items-center gap-2 text-[11px] text-slate-400">
        <span>{folder.count}</span>
        <span>·</span>
        <span>{folder.size}</span>
      </div>
    </div>
  );
}
