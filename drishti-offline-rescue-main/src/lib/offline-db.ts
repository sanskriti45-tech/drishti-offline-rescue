// IndexedDB offline storage layer for Drishti
// Stores SOS requests, disasters, and sync queue when offline

const DB_NAME = "drishti-offline-db";
const DB_VERSION = 1;

export interface OfflineRecord {
  id: string;
  type: "sos" | "disaster" | "shelter" | "sync";
  data: unknown;
  synced: boolean;
  timestamp: number;
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains("records")) {
        const store = db.createObjectStore("records", { keyPath: "id" });
        store.createIndex("by_type", ["type"]);
        store.createIndex("by_synced", ["synced"]);
        store.createIndex("by_timestamp", ["timestamp"]);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveOffline(record: Omit<OfflineRecord, "synced" | "timestamp">): Promise<string> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("records", "readwrite");
    const store = tx.objectStore("records");
    const fullRecord: OfflineRecord = {
      ...record,
      synced: false,
      timestamp: Date.now(),
    };
    store.put(fullRecord);
    tx.oncomplete = () => {
      db.close();
      resolve(record.id);
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getUnsynced(): Promise<OfflineRecord[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("records", "readonly");
    const store = tx.objectStore("records");
    const index = store.index("by_synced");
    const request = index.getAll(IDBKeyRange.only(false));
    request.onsuccess = () => {
      db.close();
      resolve(request.result);
    };
    request.onerror = () => {
      db.close();
      reject(request.error);
    };
  });
}

export async function markSynced(id: string): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("records", "readwrite");
    const store = tx.objectStore("records");
    const getReq = store.get(id);
    getReq.onsuccess = () => {
      const record = getReq.result;
      if (record) {
        record.synced = true;
        store.put(record);
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export async function getPendingCount(): Promise<number> {
  const records = await getUnsynced();
  return records.length;
}

export async function clearSynced(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("records", "readwrite");
    const store = tx.objectStore("records");
    const index = store.index("by_synced");
    const request = index.getAll(IDBKeyRange.only(true));
    request.onsuccess = () => {
      const records = request.result;
      for (const record of records) {
        store.delete(record.id);
      }
    };
    tx.oncomplete = () => {
      db.close();
      resolve();
    };
    tx.onerror = () => {
      db.close();
      reject(tx.error);
    };
  });
}

export function generateOfflineId(): string {
  return `offline_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}
