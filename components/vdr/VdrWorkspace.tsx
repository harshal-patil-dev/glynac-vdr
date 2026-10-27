'use client';

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Search,
  Lock,
  Upload,
  Plus,
  ChevronDown,
  HardDrive,
  ShieldCheck,
  X,
  Sparkles,
  Check,
  Key,
  Database,
  RotateCcw
} from 'lucide-react';
import { GlynacGVLogo } from '@/components/vdr/GlynacGVLogo';
import { FolderCard } from '@/components/vdr/FolderCard';
import { DocumentTable } from '@/components/vdr/DocumentTable';
import { Breadcrumbs } from '@/components/vdr/Breadcrumbs';
import { SortControl } from '@/components/vdr/SortControl';
import { DocumentPreviewer } from '@/components/vdr/DocumentPreviewer';
import { BrandAssetsModal } from '@/components/vdr/BrandAssetsModal';
import { NewFolderModal } from '@/components/vdr/NewFolderModal';
import { UploadFileModal } from '@/components/vdr/UploadFileModal';
import { INITIAL_FOLDERS, MOCK_DOCUMENTS } from '@/data/mockVdrData';
import { SortField, SortOrder, VdrDocument, VdrFolder, FileType, SecurityTag } from '@/types/vdr';
import { initVdrStorage, persistFolder, persistDocument, resetVdrStorage } from '@/lib/vdrStorage';

export function VdrWorkspace() {
  // Navigation & View Mode
  const [activeNav, setActiveNav] = useState<'documents' | 'security'>('documents');

  // Repository Data State (Backed by IndexedDB)
  const [folders, setFolders] = useState<VdrFolder[]>(INITIAL_FOLDERS);
  const [documents, setDocuments] = useState<VdrDocument[]>(MOCK_DOCUMENTS);
  const [isLoadingStorage, setIsLoadingStorage] = useState(true);
  const [storageNotice, setStorageNotice] = useState<string | null>(null);

  // Folder & Search State
  const [selectedFolderCode, setSelectedFolderCode] = useState<string | null>('01');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFileType, setSelectedFileType] = useState<FileType | 'all'>('all');
  const [selectedSecurityFilter, setSelectedSecurityFilter] = useState<SecurityTag | 'all'>('all');

  // Sorting State
  const [sortField, setSortField] = useState<SortField>('updated');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Previewer State
  const [selectedDocumentForPreview, setSelectedDocumentForPreview] = useState<VdrDocument | null>(null);

  // Modals & Popovers
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isNewFolderModalOpen, setIsNewFolderModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [currentWorkspace, setCurrentWorkspace] = useState('Project Falcon');

  // Refs for click-outside dismissal
  const workspaceMenuRef = useRef<HTMLDivElement>(null);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // 1. Initialize IndexedDB storage safely on mount
  useEffect(() => {
    let isMounted = true;
    initVdrStorage()
      .then((data) => {
        if (isMounted) {
          setFolders(data.folders);
          setDocuments(data.documents);
          setIsLoadingStorage(false);
        }
      })
      .catch((error) => {
        console.error('IndexedDB load error:', error);
        if (isMounted) {
          setIsLoadingStorage(false);
          setStorageNotice('Loaded in memory fallback mode.');
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // 2. Click-outside handler for popover menus
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        workspaceMenuRef.current &&
        !workspaceMenuRef.current.contains(e.target as Node)
      ) {
        setIsWorkspaceMenuOpen(false);
      }
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Currently selected folder object
  const currentFolder = useMemo(() => {
    if (!selectedFolderCode) return null;
    return folders.find((f) => f.code === selectedFolderCode) || null;
  }, [folders, selectedFolderCode]);

  // Filter folders based on search query
  const filteredFolders = useMemo(() => {
    if (!searchQuery.trim()) return folders;
    const q = searchQuery.toLowerCase();
    return folders.filter(
      (f) => f.name.toLowerCase().includes(q) || f.code.toLowerCase().includes(q)
    );
  }, [folders, searchQuery]);

  // Filter documents based on: selected folder, search query, file type, security filter
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      // 1. Folder match
      const matchesFolder = selectedFolderCode ? doc.folderCode === selectedFolderCode : true;

      // 2. Search match across name, binder, type, security, author, or content
      let matchesSearch = true;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        matchesSearch =
          doc.name.toLowerCase().includes(q) ||
          doc.binder.toLowerCase().includes(q) ||
          doc.securityTag.toLowerCase().includes(q) ||
          doc.type.toLowerCase().includes(q) ||
          (doc.author ? doc.author.toLowerCase().includes(q) : false) ||
          (doc.previewContent ? doc.previewContent.toLowerCase().includes(q) : false);
      }

      // 3. File type pill filter
      const matchesType = selectedFileType === 'all' || doc.type === selectedFileType;

      // 4. Security tag filter
      const matchesSecurity =
        selectedSecurityFilter === 'all' || doc.securityTag === selectedSecurityFilter;

      return matchesFolder && matchesSearch && matchesType && matchesSecurity;
    });
  }, [documents, selectedFolderCode, searchQuery, selectedFileType, selectedSecurityFilter]);

  // Sort documents
  const sortedDocuments = useMemo(() => {
    return [...filteredDocuments].sort((a, b) => {
      let comparison = 0;
      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'size') {
        comparison = a.sizeBytes - b.sizeBytes;
      } else if (sortField === 'updated') {
        comparison = a.updatedTimestamp - b.updatedTimestamp;
      } else if (sortField === 'type') {
        comparison = a.type.localeCompare(b.type);
      } else if (sortField === 'binder') {
        comparison = a.binder.localeCompare(b.binder);
      } else if (sortField === 'securityTag') {
        comparison = a.securityTag.localeCompare(b.securityTag);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredDocuments, sortField, sortOrder]);

  // Folder selection handler
  const handleFolderSelect = (folderCode: string) => {
    if (selectedFolderCode === folderCode) {
      // Toggle off to view all binders
      setSelectedFolderCode(null);
    } else {
      setSelectedFolderCode(folderCode);
    }
  };

  // Header column sort toggle
  const handleSortChange = (field: SortField) => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Document selection handler
  const handleSelectDocument = (doc: VdrDocument) => {
    setSelectedDocumentForPreview(doc);
  };

  // Handlers for modal actions with IndexedDB persistence
  const handleCreateFolder = async (newFolder: VdrFolder) => {
    setFolders((prev) => [...prev, newFolder]);
    setSelectedFolderCode(newFolder.code);
    try {
      await persistFolder(newFolder);
    } catch (err) {
      console.error('Failed to persist folder:', err);
      setStorageNotice('Folder created in session; storage write failed.');
    }
  };

  const handleUploadDocument = async (newDoc: VdrDocument) => {
    setDocuments((prev) => [newDoc, ...prev]);
    setSelectedDocumentForPreview(newDoc);

    try {
      const updatedFolder = await persistDocument(newDoc);
      if (updatedFolder) {
        setFolders((prev) =>
          prev.map((f) => (f.code === updatedFolder.code ? updatedFolder : f))
        );
      } else {
        setFolders((prev) =>
          prev.map((f) => {
            if (f.code === newDoc.folderCode) {
              const currentCount = parseInt(f.count, 10) || 0;
              return { ...f, count: `${currentCount + 1} files` };
            }
            return f;
          })
        );
      }
    } catch (err) {
      console.error('Failed to persist document:', err);
      setStorageNotice('Document uploaded in session; storage write failed.');
    }
  };

  const handleResetFilters = () => {
    setSelectedFolderCode(null);
    setSearchQuery('');
    setSelectedFileType('all');
    setSelectedSecurityFilter('all');
  };

  const handleResetData = async () => {
    if (window.confirm('Reset data room back to default demonstration records?')) {
      setIsLoadingStorage(true);
      const res = await resetVdrStorage();
      setFolders(res.folders);
      setDocuments(res.documents);
      setSelectedFolderCode('01');
      setSelectedDocumentForPreview(null);
      setIsLoadingStorage(false);
      setStorageNotice('Data room reset to demo state.');
      setTimeout(() => setStorageNotice(null), 3000);
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8F9FA] text-[#0F172A] font-sans antialiased">
      {/* ========================================================= */}
      {/* 1. SIDEBAR                                                */}
      {/* ========================================================= */}
      <aside className="w-64 shrink-0 bg-[#FFFFFF] border-r border-[#E2E8F0] flex flex-col justify-between p-5 select-none z-10">
        <div>
          {/* Logo & Brand Header: Clicking navigates to All Documents (Home) */}
          <div
            onClick={() => {
              setActiveNav('documents');
              setSelectedFolderCode(null);
              setSelectedDocumentForPreview(null);
            }}
            title="Glynac VDR - Return to all binders"
            className="flex items-center justify-between pb-6 border-b border-[#F1F5F9] cursor-pointer group hover:opacity-90 transition-opacity"
          >
            <div className="flex items-center gap-3">
              <GlynacGVLogo size={36} />
              <div>
                <div className="text-[14px] font-bold tracking-tight text-[#0F172A] leading-tight">
                  GLYNAC <span className="font-semibold text-slate-400">VDR</span>
                </div>
                <div className="text-[11px] text-slate-400 leading-tight">
                  Enterprise Data Room
                </div>
              </div>
            </div>
            <span className="p-1 rounded text-slate-300">
              <Sparkles className="w-3.5 h-3.5" />
            </span>
          </div>

          {/* Active Workspace Switcher */}
          <div className="mt-5 mb-6 relative" ref={workspaceMenuRef}>
            <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
              ACTIVE WORKSPACE
            </label>
            <button
              onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
              className="w-full flex items-center justify-between p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg hover:bg-slate-100 transition-colors cursor-pointer text-left"
            >
              <div className="min-w-0">
                <div className="text-[12px] font-semibold text-slate-900 truncate">
                  {currentWorkspace}
                </div>
                <div className="text-[10px] text-slate-500">
                  M&A Due Diligence
                </div>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 text-slate-400 shrink-0 transition-transform ${
                  isWorkspaceMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Workspace Dropdown Menu */}
            {isWorkspaceMenuOpen && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-[#E2E8F0] rounded-xl shadow-lg p-1.5 z-30 space-y-1">
                {[
                  { name: 'Project Falcon', status: 'Active · $420M Buyout' },
                  { name: 'Project Titan', status: 'Archive · Series B' },
                  { name: 'Aurora JV', status: 'Draft · Cross-Border' },
                ].map((ws) => (
                  <button
                    key={ws.name}
                    onClick={() => {
                      setCurrentWorkspace(ws.name);
                      setIsWorkspaceMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[12px] text-left transition-colors cursor-pointer ${
                      currentWorkspace === ws.name
                        ? 'bg-blue-50 text-[#011238] font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="font-medium">{ws.name}</div>
                      <div className="text-[10px] text-slate-400">{ws.status}</div>
                    </div>
                    {currentWorkspace === ws.name && (
                      <Check className="w-3.5 h-3.5 text-[#011238]" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveNav('documents');
                setSelectedFolderCode(null);
                setSelectedDocumentForPreview(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                activeNav === 'documents' && selectedFolderCode === null
                  ? 'bg-[#011238] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <HardDrive className="w-4 h-4 opacity-80" />
                <span>All Documents</span>
              </div>
              <span
                className={`text-[11px] font-mono ${
                  activeNav === 'documents' && selectedFolderCode === null
                    ? 'text-white/80'
                    : 'text-slate-400'
                }`}
              >
                {documents.length}
              </span>
            </button>

            {/* Folder shortcuts in sidebar */}
            <div className="pt-2 pb-1 px-3 text-[10px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>BINDERS ({folders.length})</span>
            </div>

            {folders.map((f) => {
              const isSelected = activeNav === 'documents' && selectedFolderCode === f.code;
              const binderDocCount = documents.filter((d) => d.folderCode === f.code).length;
              return (
                <button
                  key={f.id}
                  onClick={() => {
                    setActiveNav('documents');
                    setSelectedFolderCode(f.code);
                    setSelectedDocumentForPreview(null);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 rounded-lg text-[12px] font-medium transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-blue-50 text-[#011238] font-semibold'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="font-mono text-[10px] text-slate-400 font-bold">{f.code}</span>
                    <span className="truncate">{f.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {binderDocCount}
                  </span>
                </button>
              );
            })}

            <div className="pt-2"></div>

            <button
              onClick={() => setActiveNav('security')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors cursor-pointer ${
                activeNav === 'security'
                  ? 'bg-[#011238] text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <ShieldCheck className="w-4 h-4 opacity-80" />
              <span>Security & Access</span>
            </button>
          </div>
        </div>

        {/* Quiet Footer Controls */}
        <div className="pt-4 border-t border-[#F1F5F9] flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-slate-600">
            <Database className="w-3.5 h-3.5 text-emerald-600" />
            <span className="text-[11px] font-medium text-slate-700">IndexedDB Vault</span>
          </div>
          <button
            onClick={handleResetData}
            title="Reset sample data"
            className="text-[10px] text-slate-400 hover:text-rose-600 flex items-center gap-1 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-2.5 h-2.5" />
            <span>Reset Demo</span>
          </button>
        </div>
      </aside>

      {/* ========================================================= */}
      {/* 2. MAIN WORKSPACE VIEWPORT                                */}
      {/* ========================================================= */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="h-16 px-8 border-b border-[#E2E8F0] bg-[#FFFFFF] flex items-center justify-between gap-6 shrink-0 z-10">
          {/* Functional Real-Time Search Input */}
          <div className="w-96 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search files, contents, or folders..."
              className="w-full h-9.5 pl-10 pr-9 text-[13px] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#011238] focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 cursor-pointer"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Right Header: Profile Popover */}
          <div className="relative" ref={profileMenuRef}>
            <button
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-3 p-1 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer text-left"
            >
              <div className="w-8 h-8 rounded-full bg-[#011238] text-white flex items-center justify-center text-xs font-semibold shadow-2xs">
                SC
              </div>
              <div className="hidden sm:block text-left">
                <div className="text-[12px] font-semibold text-slate-900 leading-tight">Sarah Chen</div>
                <div className="text-[10px] text-slate-400 leading-tight">Advisor (Lead)</div>
              </div>
            </button>

            {/* Profile Menu Popover (Corrected: No misplaced brand modal action) */}
            {isProfileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-[#E2E8F0] rounded-xl shadow-xl p-4 z-30 space-y-3">
                <div className="border-b border-slate-100 pb-2">
                  <div className="font-semibold text-slate-900 text-[13px]">Sarah Chen, Esq.</div>
                  <div className="text-[11px] text-slate-500">Kirkland & Ellis · M&A Diligence</div>
                  <div className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded mt-1.5 inline-block font-semibold">
                    Full Vault Clearance
                  </div>
                </div>

                <div className="text-[11px] space-y-1 text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Audit Watermark ID:</span>
                    <span className="font-mono text-slate-800">SC-99214</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Session Protocol:</span>
                    <span className="font-mono text-slate-800">TLS 1.3 / E2EE</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Storage State:</span>
                    <span className="font-mono text-emerald-700">IndexedDB Active</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-[11px]">
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Counsel Verified</span>
                  </span>
                  <button
                    onClick={() => setIsProfileMenuOpen(false)}
                    className="text-slate-400 hover:text-slate-700 cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Transient Storage Notification Banner */}
        {storageNotice && (
          <div className="px-8 py-2 bg-blue-50 border-b border-blue-200 text-blue-900 text-[12px] flex items-center justify-between">
            <span>{storageNotice}</span>
            <button
              onClick={() => setStorageNotice(null)}
              className="text-blue-700 hover:text-blue-900 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body: Split View when Preview is Open */}
        <div className="flex-1 flex min-h-0 overflow-hidden">
          {activeNav === 'documents' ? (
            <>
              {/* Left/Center Workspace: File Explorer */}
              <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 min-w-0">
                {/* 1. Breadcrumb Navigation Bar */}
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Breadcrumbs
                    currentFolder={currentFolder}
                    selectedDocument={selectedDocumentForPreview}
                    onNavigateRoot={() => {
                      setSelectedFolderCode(null);
                      setSelectedDocumentForPreview(null);
                    }}
                    onNavigateFolder={(folder) => {
                      setSelectedFolderCode(folder.code);
                      setSelectedDocumentForPreview(null);
                    }}
                    rootLabel={currentWorkspace}
                  />

                  {selectedFolderCode && (
                    <button
                      onClick={() => setSelectedFolderCode(null)}
                      className="text-[11px] font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <span>View all binders</span>
                    </button>
                  )}
                </div>

                {/* 2. Workspace Title & Action Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h1 className="text-[22px] font-bold text-[#0F172A] tracking-tight">
                      {currentFolder ? currentFolder.name : `${currentWorkspace} · Data Room`}
                    </h1>
                    <p className="mt-1 text-[13px] text-slate-500">
                      {currentFolder
                        ? `${currentFolder.description || 'Secure folder workspace'} · ${sortedDocuments.length} documents`
                        : `Secure Virtual Workspace · ${folders.length} Binders · ${documents.length} verified documents`}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsNewFolderModalOpen(true)}
                      className="px-4 py-2 text-[13px] font-medium text-slate-700 bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors shadow-2xs flex items-center gap-2 cursor-pointer"
                    >
                      <Plus className="w-4 h-4 text-slate-400" />
                      <span>New Folder</span>
                    </button>

                    <button
                      onClick={() => setIsUploadModalOpen(true)}
                      className="px-4 py-2 text-[13px] font-semibold text-white bg-[#011238] hover:bg-[#07246b] rounded-lg transition-colors shadow-xs flex items-center gap-2 cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-slate-300" />
                      <span>Upload File</span>
                    </button>
                  </div>
                </div>

                {/* 3. Folders Section */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      FOLDERS ({filteredFolders.length})
                    </div>
                    {selectedFolderCode && (
                      <span className="text-[11px] text-slate-500 font-mono">
                        Active: Binder {selectedFolderCode}
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {filteredFolders.map((folder) => {
                      const isSelected = selectedFolderCode === folder.code;
                      return (
                        <FolderCard
                          key={folder.id}
                          folder={folder}
                          isSelected={isSelected}
                          onSelect={handleFolderSelect}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* 4. Filter Strip & Recent Documents Section */}
                <div>
                  {/* Filter Pills & Sort Bar */}
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-3">
                    {/* File Type Filter Pills */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">
                        Filter:
                      </span>
                      {[
                        { label: 'All', value: 'all' },
                        { label: 'PDF', value: 'pdf' },
                        { label: 'Spreadsheets', value: 'xlsx' },
                        { label: 'Contracts', value: 'docx' },
                        { label: 'Text (.txt)', value: 'txt' },
                        { label: 'Markdown (.md)', value: 'md' },
                        { label: 'JSON', value: 'json' },
                        { label: 'Images', value: 'image' },
                      ].map((item) => (
                        <button
                          key={item.value}
                          onClick={() => setSelectedFileType(item.value as FileType | 'all')}
                          className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors cursor-pointer ${
                            selectedFileType === item.value
                              ? 'bg-[#011238] text-white font-semibold shadow-2xs'
                              : 'bg-white text-slate-600 hover:bg-slate-100 border border-[#E2E8F0]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}

                      {/* Security Level Dropdown */}
                      <select
                        value={selectedSecurityFilter}
                        onChange={(e) => setSelectedSecurityFilter(e.target.value as SecurityTag | 'all')}
                        className="h-7 px-2 text-[11px] bg-white border border-[#E2E8F0] rounded-md text-slate-700 font-medium focus:outline-none cursor-pointer"
                        title="Filter by Security Clearance"
                      >
                        <option value="all">All Clearance Levels</option>
                        <option value="Strict Confidential">Strict Confidential</option>
                        <option value="Restricted">Restricted</option>
                        <option value="Advisory Only">Advisory Only</option>
                        <option value="Verified">Verified</option>
                      </select>

                      {(searchQuery ||
                        selectedFileType !== 'all' ||
                        selectedSecurityFilter !== 'all' ||
                        selectedFolderCode) && (
                        <button
                          onClick={handleResetFilters}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-medium px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                        >
                          Clear Filters
                        </button>
                      )}
                    </div>

                    {/* Sorting Controls */}
                    <SortControl
                      sortField={sortField}
                      sortOrder={sortOrder}
                      onSortChange={setSortField}
                      onToggleOrder={toggleSortOrder}
                    />
                  </div>

                  {/* Search feedback banner */}
                  {searchQuery && (
                    <div className="mb-3 px-3 py-2 bg-blue-50/70 border border-blue-200 rounded-lg flex items-center justify-between text-[12px] text-blue-900">
                      <span>
                        Showing {sortedDocuments.length} result(s) matching "<strong>{searchQuery}</strong>"
                        {selectedFolderCode ? ` in Binder ${selectedFolderCode}` : ' across all binders'}.
                      </span>
                      {selectedFolderCode && (
                        <button
                          onClick={() => setSelectedFolderCode(null)}
                          className="font-semibold text-blue-700 hover:underline cursor-pointer"
                        >
                          Search all binders
                        </button>
                      )}
                    </div>
                  )}

                  {/* Document Table */}
                  <DocumentTable
                    documents={sortedDocuments}
                    sortField={sortField}
                    sortOrder={sortOrder}
                    onSortChange={handleSortChange}
                    onSelectDocument={handleSelectDocument}
                    selectedDocumentId={selectedDocumentForPreview?.id || null}
                    onClearFilters={handleResetFilters}
                    searchActive={Boolean(
                      searchQuery.trim() ||
                        selectedFileType !== 'all' ||
                        selectedSecurityFilter !== 'all' ||
                        selectedFolderCode
                    )}
                  />
                </div>
              </main>

              {/* Right Side-Panel: Split-Screen Document Previewer */}
              {selectedDocumentForPreview && (
                <DocumentPreviewer
                  document={selectedDocumentForPreview}
                  onClose={() => setSelectedDocumentForPreview(null)}
                />
              )}
            </>
          ) : (
            /* Security & Access View */
            <main className="flex-1 overflow-y-auto p-8 max-w-4xl mx-auto space-y-6">
              <div>
                <h1 className="text-[22px] font-bold text-[#0F172A] tracking-tight">
                  Security & Access Controls
                </h1>
                <p className="mt-1 text-[13px] text-slate-500">
                  Room cryptographic posture and compliance safeguards for {currentWorkspace}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-[14px]">AES-256 Vault Encryption</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">Active</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    All document payloads, metadata indices, and cryptographic hashes are encrypted at rest and in transit via TLS 1.3 with FIPS 140-3 HSM key custody.
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-[14px]">Dynamic Watermarking</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">Enforced</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    Every document view automatically stamps viewer email identity (Sarah Chen), exact timestamp, and unique audit session token across all rendered views.
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-[14px]">Granular Role-Based Access</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">Configured</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    Permission policies are partitioned by binder code (01 Legal, 02 Financial, 03 Commercial, 04 IP) with view-only export restrictions.
                  </p>
                </div>

                <div className="p-5 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-900 text-[14px]">Tamper-Proof Audit Ledger</span>
                    <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">Live</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed">
                    Every view, copy action, and export attempt is permanently logged with cryptographic SHA-256 verification.
                  </p>
                </div>
              </div>

              {/* Legitimate Brand Assets Trigger in Security & Access */}
              <div className="p-4 bg-blue-50/70 border border-blue-200 rounded-xl flex items-center justify-between text-[12px] text-blue-900">
                <div className="flex items-center gap-2">
                  <Key className="w-4 h-4 text-[#011238]" />
                  <span>Looking for Glynac VDR official logo assets and brand files?</span>
                </div>
                <button
                  onClick={() => setIsBrandModalOpen(true)}
                  className="font-semibold text-white bg-[#011238] px-3 py-1.5 rounded-lg text-[11px] hover:bg-[#07246b] transition-colors cursor-pointer"
                >
                  View Brand Assets
                </button>
              </div>
            </main>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. MODALS                                                 */}
      {/* ========================================================= */}
      {/* Brand Assets Modal */}
      <BrandAssetsModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
      />

      {/* New Folder Modal */}
      <NewFolderModal
        isOpen={isNewFolderModalOpen}
        onClose={() => setIsNewFolderModalOpen(false)}
        onCreateFolder={handleCreateFolder}
        existingFoldersCount={folders.length}
      />

      {/* Upload File Modal */}
      <UploadFileModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        folders={folders}
        defaultFolderCode={selectedFolderCode}
        onUploadDocument={handleUploadDocument}
      />
    </div>
  );
}
