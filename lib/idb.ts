const DB_NAME = "qh_resume_db";
const STORE_NAME = "files";
const VERSION = 1;

type ResumeRecord = {
  id: "resume_pdf";
  name: string;
  blob: Blob;
  uploadedAt: number;
};

const openDB = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });

export const saveResumePdf = async (file: File) => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  const record: ResumeRecord = {
    id: "resume_pdf",
    name: file.name,
    blob: file,
    uploadedAt: Date.now(),
  };
  await new Promise((resolve, reject) => {
    const r = store.put(record);
    r.onsuccess = () => resolve(true);
    r.onerror = () => reject(r.error);
  });
  await new Promise((resolve) => {
    tx.oncomplete = () => resolve(true);
  });
  db.close();
};

export const getResumePdf = async (): Promise<ResumeRecord | null> => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const rec = await new Promise<ResumeRecord | null>((resolve, reject) => {
    const r = store.get("resume_pdf");
    r.onsuccess = () => resolve((r.result as ResumeRecord) || null);
    r.onerror = () => reject(r.error);
  });
  db.close();
  return rec;
};

export const deleteResumePdf = async () => {
  const db = await openDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  const store = tx.objectStore(STORE_NAME);
  await new Promise((resolve, reject) => {
    const r = store.delete("resume_pdf");
    r.onsuccess = () => resolve(true);
    r.onerror = () => reject(r.error);
  });
  await new Promise((resolve) => {
    tx.oncomplete = () => resolve(true);
  });
  db.close();
};
