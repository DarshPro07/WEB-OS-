const DB_NAME = "nexus.wallpaper";
const STORE = "custom";
const KEY = "current";

export interface CustomWallpaper {
  blob: Blob;
  kind: "video" | "image";
}

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(STORE);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveCustomWallpaper(file: File): Promise<void> {
  const db = await openDb();
  const kind: CustomWallpaper["kind"] = file.type.startsWith("video") ? "video" : "image";
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE, "readwrite");
    tx.objectStore(STORE).put({ blob: file, kind }, KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

export async function loadCustomWallpaper(): Promise<CustomWallpaper | null> {
  const db = await openDb();
  const result = await new Promise<CustomWallpaper | null>((resolve, reject) => {
    const tx = db.transaction(STORE, "readonly");
    const request = tx.objectStore(STORE).get(KEY);
    request.onsuccess = () => resolve(request.result ?? null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return result;
}
