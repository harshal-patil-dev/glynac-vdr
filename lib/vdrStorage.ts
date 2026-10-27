/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { VdrFolder, VdrDocument } from '@/types/vdr';
import { INITIAL_FOLDERS, MOCK_DOCUMENTS } from '@/data/mockVdrData';

const DB_NAME = 'glynac_vdr_db';
const DB_VERSION = 1;
const FOLDERS_STORE = 'folders';
const DOCUMENTS_STORE = 'documents';
const META_STORE = 'meta';

/**
 * Format raw byte size into human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

function getIndexedDB(): IDBFactory | undefined {
  if (typeof window !== 'undefined' && window.indexedDB) {
    return window.indexedDB;
  }
  if (typeof globalThis !== 'undefined' && globalThis.indexedDB) {
    return globalThis.indexedDB;
  }
  return undefined;
}

/**
 * Open the IndexedDB database with schema initialization
 */
function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const idb = getIndexedDB();
    if (!idb) {
      reject(new Error('IndexedDB is not available in this environment.'));
      return;
    }

    const request = idb.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      // 1. Folders store
      if (!db.objectStoreNames.contains(FOLDERS_STORE)) {
        const folderStore = db.createObjectStore(FOLDERS_STORE, { keyPath: 'id' });
        folderStore.createIndex('code', 'code', { unique: true });
      }

      // 2. Documents store
      if (!db.objectStoreNames.contains(DOCUMENTS_STORE)) {
        const docStore = db.createObjectStore(DOCUMENTS_STORE, { keyPath: 'id' });
        docStore.createIndex('folderCode', 'folderCode', { unique: false });
        docStore.createIndex('updatedTimestamp', 'updatedTimestamp', { unique: false });
      }

      // 3. Metadata store (tracks seed status)
      if (!db.objectStoreNames.contains(META_STORE)) {
        db.createObjectStore(META_STORE, { keyPath: 'key' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error || new Error('Failed to open IndexedDB.'));
  });
}

/**
 * Fallback storage keys for restricted environments
 */
const FALLBACK_KEY_FOLDERS = 'glynac_vdr_fallback_folders';
const FALLBACK_KEY_DOCUMENTS = 'glynac_vdr_fallback_documents';

function getFallbackData(): { folders: VdrFolder[]; documents: VdrDocument[] } {
  try {
    const rawFolders = localStorage.getItem(FALLBACK_KEY_FOLDERS);
    const rawDocs = localStorage.getItem(FALLBACK_KEY_DOCUMENTS);
    if (rawFolders && rawDocs) {
      return {
        folders: JSON.parse(rawFolders),
        documents: JSON.parse(rawDocs),
      };
    }
  } catch (e) {
    console.warn('LocalStorage fallback read failed, using initial mock data', e);
  }
  return { folders: INITIAL_FOLDERS, documents: MOCK_DOCUMENTS };
}

function setFallbackData(folders: VdrFolder[], documents: VdrDocument[]) {
  try {
    localStorage.setItem(FALLBACK_KEY_FOLDERS, JSON.stringify(folders));
    localStorage.setItem(FALLBACK_KEY_DOCUMENTS, JSON.stringify(documents));
  } catch (e) {
    console.warn('LocalStorage fallback write failed', e);
  }
}

/**
 * Initialize storage and seed initial demo data safely if not already present.
 * Existing user data is never overwritten.
 */
export async function initVdrStorage(): Promise<{
  folders: VdrFolder[];
  documents: VdrDocument[];
}> {
  try {
    const db = await openDatabase();

    // Check if data is already seeded
    const isSeeded = await new Promise<boolean>((resolve, reject) => {
      const tx = db.transaction([META_STORE, FOLDERS_STORE], 'readonly');
      const metaStore = tx.objectStore(META_STORE);
      const getMeta = metaStore.get('is_seeded');

      getMeta.onsuccess = () => {
        if (getMeta.result && getMeta.result.value) {
          resolve(true);
        } else {
          // Double check if folder store already has data
          const folderStore = tx.objectStore(FOLDERS_STORE);
          const countReq = folderStore.count();
          countReq.onsuccess = () => resolve(countReq.result > 0);
          countReq.onerror = () => resolve(false);
        }
      };
      getMeta.onerror = () => resolve(false);
      tx.onerror = () => reject(tx.error);
    });

    if (!isSeeded) {
      // Seed initial demo data safely in a readwrite transaction
      await new Promise<void>((resolve, reject) => {
        const tx = db.transaction([FOLDERS_STORE, DOCUMENTS_STORE, META_STORE], 'readwrite');
        const folderStore = tx.objectStore(FOLDERS_STORE);
        const docStore = tx.objectStore(DOCUMENTS_STORE);
        const metaStore = tx.objectStore(META_STORE);

        INITIAL_FOLDERS.forEach((f) => folderStore.put(f));
        MOCK_DOCUMENTS.forEach((d) => docStore.put(d));
        metaStore.put({ key: 'is_seeded', value: true, seededAt: Date.now() });

        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      });

      return {
        folders: INITIAL_FOLDERS,
        documents: MOCK_DOCUMENTS,
      };
    }

    // Retrieve existing user data from IndexedDB
    const [folders, documents] = await Promise.all([
      getAllFromStore<VdrFolder>(db, FOLDERS_STORE),
      getAllFromStore<VdrDocument>(db, DOCUMENTS_STORE),
    ]);

    // Recalculate accurate file counts and sizes based on real documents in each folder
    const syncedFolders = folders.map((folder) => {
      const folderDocs = documents.filter((d) => d.folderCode === folder.code);
      const totalBytes = folderDocs.reduce((acc, d) => acc + (d.sizeBytes || 0), 0);
      return {
        ...folder,
        count: `${folderDocs.length} files`,
        size: formatBytes(totalBytes),
      };
    });

    return {
      folders: syncedFolders,
      documents,
    };
  } catch (error) {
    console.warn('IndexedDB initialization failed, falling back to LocalStorage:', error);
    return getFallbackData();
  }
}

/**
 * Retrieve all items from a specified object store
 */
function getAllFromStore<T>(db: IDBDatabase, storeName: string): Promise<T[]> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result || []);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Persist a newly created folder into IndexedDB
 */
export async function persistFolder(newFolder: VdrFolder): Promise<void> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(FOLDERS_STORE, 'readwrite');
      const store = tx.objectStore(FOLDERS_STORE);
      store.put(newFolder);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn('Failed to persist folder to IndexedDB, using fallback:', error);
    const { folders, documents } = getFallbackData();
    setFallbackData([...folders, newFolder], documents);
  }
}

/**
 * Persist an uploaded document into IndexedDB and update the parent binder's metadata
 */
export async function persistDocument(newDoc: VdrDocument): Promise<VdrFolder | null> {
  try {
    const db = await openDatabase();
    return await new Promise<VdrFolder | null>((resolve, reject) => {
      const tx = db.transaction([DOCUMENTS_STORE, FOLDERS_STORE], 'readwrite');
      const docStore = tx.objectStore(DOCUMENTS_STORE);
      const folderStore = tx.objectStore(FOLDERS_STORE);

      // Save document
      docStore.put(newDoc);

      // Update folder count and size
      let updatedFolderResult: VdrFolder | null = null;
      const getFolderReq = folderStore.getAll();

      getFolderReq.onsuccess = () => {
        const allFolders = getFolderReq.result as VdrFolder[];
        const targetFolder = allFolders.find((f) => f.code === newDoc.folderCode);

        if (targetFolder) {
          const docIndex = docStore.index('folderCode');
          const getDocsReq = docIndex.getAll(newDoc.folderCode);

          getDocsReq.onsuccess = () => {
            const folderDocs = getDocsReq.result as VdrDocument[];
            const count = folderDocs.length;
            const totalBytes = folderDocs.reduce((acc, d) => acc + (d.sizeBytes || 0), 0);

            const updatedFolder: VdrFolder = {
              ...targetFolder,
              count: `${count} files`,
              size: formatBytes(totalBytes),
            };

            folderStore.put(updatedFolder);
            updatedFolderResult = updatedFolder;
          };
        }
      };

      tx.oncomplete = () => resolve(updatedFolderResult);
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn('Failed to persist document to IndexedDB, using fallback:', error);
    const { folders, documents } = getFallbackData();
    const updatedDocs = [newDoc, ...documents];
    const updatedFolders = folders.map((f) => {
      if (f.code === newDoc.folderCode) {
        const folderDocs = updatedDocs.filter((d) => d.folderCode === f.code);
        const totalBytes = folderDocs.reduce((acc, d) => acc + (d.sizeBytes || 0), 0);
        return {
          ...f,
          count: `${folderDocs.length} files`,
          size: formatBytes(totalBytes),
        };
      }
      return f;
    });
    setFallbackData(updatedFolders, updatedDocs);
    return updatedFolders.find((f) => f.code === newDoc.folderCode) || null;
  }
}

/**
 * Reset data back to default demo records (for testing or user reset)
 */
export async function resetVdrStorage(): Promise<{
  folders: VdrFolder[];
  documents: VdrDocument[];
}> {
  try {
    const db = await openDatabase();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([FOLDERS_STORE, DOCUMENTS_STORE, META_STORE], 'readwrite');
      tx.objectStore(FOLDERS_STORE).clear();
      tx.objectStore(DOCUMENTS_STORE).clear();
      tx.objectStore(META_STORE).clear();

      INITIAL_FOLDERS.forEach((f) => tx.objectStore(FOLDERS_STORE).put(f));
      MOCK_DOCUMENTS.forEach((d) => tx.objectStore(DOCUMENTS_STORE).put(d));
      tx.objectStore(META_STORE).put({ key: 'is_seeded', value: true, seededAt: Date.now() });

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  } catch (error) {
    console.warn('IndexedDB reset failed, resetting fallback storage:', error);
    setFallbackData(INITIAL_FOLDERS, MOCK_DOCUMENTS);
  }

  return {
    folders: INITIAL_FOLDERS,
    documents: MOCK_DOCUMENTS,
  };
}
