'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, FolderPlus } from 'lucide-react';
import { VdrFolder } from '@/types/vdr';

interface NewFolderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateFolder: (newFolder: VdrFolder) => void;
  existingFoldersCount: number;
}

export function NewFolderModal({
  isOpen,
  onClose,
  onCreateFolder,
  existingFoldersCount,
}: NewFolderModalProps) {
  const nextCode = String(existingFoldersCount + 1).padStart(2, '0');
  const [folderName, setFolderName] = useState('');
  const [folderCode, setFolderCode] = useState(nextCode);
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!folderName.trim()) return;

    const newFolder: VdrFolder = {
      id: `folder-${Date.now()}`,
      code: folderCode.trim() || nextCode,
      name: folderName.trim(),
      count: '0 files',
      size: '0 MB',
      description: description.trim() || 'Custom binder workspace',
    };

    onCreateFolder(newFolder);
    setFolderName('');
    setDescription('');
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="new-folder-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs"
    >
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <form onSubmit={handleSubmit}>
          {/* Header */}
          <div className="p-5 border-b border-[#F1F5F9] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#011238] flex items-center justify-center">
                <FolderPlus className="w-4 h-4 text-[#011238]" />
              </div>
              <div>
                <h3 id="new-folder-modal-title" className="text-[15px] font-bold text-slate-900 leading-tight">
                  Create New Binder
                </h3>
                <p className="text-[11px] text-slate-500">
                  Add a secure repository directory to Project Falcon
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
            <div className="grid grid-cols-4 gap-3">
              <div className="col-span-1">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Code
                </label>
                <input
                  type="text"
                  value={folderCode}
                  onChange={(e) => setFolderCode(e.target.value)}
                  maxLength={4}
                  className="w-full h-9 px-3 text-[13px] font-mono bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 text-center focus:outline-none focus:border-[#011238] focus:bg-white"
                  placeholder="05"
                  required
                />
              </div>

              <div className="col-span-3">
                <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                  Binder Name
                </label>
                <input
                  type="text"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                  className="w-full h-9 px-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white"
                  placeholder="e.g. Tax & Audits"
                  required
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block mb-1.5">
                Description & Scope
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full p-3 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 focus:outline-none focus:border-[#011238] focus:bg-white resize-none"
                placeholder="Brief summary of records deposited in this binder..."
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 bg-[#F8FAFC] border-t border-[#E2E8F0] flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-[12px] font-medium text-slate-700 bg-white border border-[#E2E8F0] hover:bg-slate-50 rounded-lg transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!folderName.trim()}
              className="px-4 py-2 text-[12px] font-semibold text-white bg-[#011238] hover:bg-[#07246b] disabled:opacity-50 disabled:pointer-events-none rounded-lg transition-colors cursor-pointer shadow-xs"
            >
              Create Binder
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
