import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, onSnapshot, collection, getDocs, writeBatch } from 'firebase/firestore';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import type { Wochenbericht, AppProfile } from '../types/report';
import { db } from './database';

const firebaseConfig = {
  apiKey: 'AIzaSyDdl7q9-arWIm4BKCohtR8wDLFrByRggLY',
  authDomain: 'berichtsheft-857ac.firebaseapp.com',
  projectId: 'berichtsheft-857ac',
  storageBucket: 'berichtsheft-857ac.firebasestorage.app',
  messagingSenderId: '672662101165',
  appId: '1:672662101165:web:0a189ba9144ef5803a3a24'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

import { getLocalUser } from './auth';

const SYNC_CODE_KEY = 'berichtsheft_sync_code';

/**
 * Get or generate default sync code (6-character uppercase string)
 */
export function getSyncCode(): string {
  let code = localStorage.getItem(SYNC_CODE_KEY);
  const localUser = getLocalUser();
  if (!code || (localUser?.email?.includes('eschehood44') && code !== 'BH-758150')) {
    if (localUser?.email?.includes('eschehood44')) {
      code = 'BH-758150';
    } else if (!code) {
      code = 'BH-' + Math.floor(100000 + Math.random() * 900000);
    }
    if (code) localStorage.setItem(SYNC_CODE_KEY, code);
  }
  return code || 'BH-758150';
}

/**
 * Update current device sync code
 */
export function setSyncCode(code: string): string {
  const cleaned = code.trim().toUpperCase();
  if (cleaned) {
    localStorage.setItem(SYNC_CODE_KEY, cleaned);
  }
  return cleaned;
}

/**
 * Save single report to Firestore Cloud
 */
export async function pushReportToCloud(report: Wochenbericht): Promise<void> {
  try {
    const syncCode = getSyncCode();
    const docRef = doc(firestore, 'syncGroups', syncCode, 'reports', report.id);
    await setDoc(docRef, JSON.parse(JSON.stringify(report)), { merge: true });
  } catch (err) {
    console.warn('Firebase Cloud sync report failed:', err);
  }
}

/**
 * Save profile to Firestore Cloud
 */
export async function pushProfileToCloud(profile: AppProfile): Promise<void> {
  try {
    const syncCode = getSyncCode();
    const docRef = doc(firestore, 'syncGroups', syncCode, 'profile', 'mainProfile');
    await setDoc(docRef, JSON.parse(JSON.stringify(profile)), { merge: true });
  } catch (err) {
    console.warn('Firebase Cloud sync profile failed:', err);
  }
}

/**
 * Upload all local reports to cloud (used when joining/pairing a new device or initial sync)
 */
export async function pushAllLocalToCloud(): Promise<void> {
  try {
    const syncCode = getSyncCode();
    const allReports = await db.reports.toArray();
    const profile = await db.profile.toCollection().first();

    const batch = writeBatch(firestore);

    for (const report of allReports) {
      const rRef = doc(firestore, 'syncGroups', syncCode, 'reports', report.id);
      batch.set(rRef, JSON.parse(JSON.stringify(report)), { merge: true });
    }

    if (profile) {
      const pRef = doc(firestore, 'syncGroups', syncCode, 'profile', 'mainProfile');
      batch.set(pRef, JSON.parse(JSON.stringify(profile)), { merge: true });
    }

    await batch.commit();
  } catch (err) {
    console.warn('Push all to cloud error:', err);
  }
}

/**
 * Listen for real-time cloud updates from Firestore for the active sync code
 */
export function setupCloudListeners(
  syncCode: string,
  onSyncStatusChange?: (status: 'CONNECTED' | 'SYNCING' | 'OFFLINE') => void
) {
  if (!syncCode) return () => {};

  if (onSyncStatusChange) onSyncStatusChange('SYNCING');

  // 1. Listen to Reports Collection
  const reportsColRef = collection(firestore, 'syncGroups', syncCode, 'reports');
  const unsubscribeReports = onSnapshot(
    reportsColRef,
    async (snapshot) => {
      if (onSyncStatusChange) onSyncStatusChange('SYNCING');
      for (const change of snapshot.docChanges()) {
        const data = change.doc.data() as Wochenbericht;
        if (change.type === 'added' || change.type === 'modified') {
          await db.reports.put(data);
        } else if (change.type === 'removed') {
          await db.reports.delete(data.id);
        }
      }
      if (onSyncStatusChange) onSyncStatusChange('CONNECTED');
    },
    (err) => {
      console.warn('Cloud listener reports error:', err);
      if (onSyncStatusChange) onSyncStatusChange('OFFLINE');
    }
  );

  // 2. Listen to Profile
  const profileDocRef = doc(firestore, 'syncGroups', syncCode, 'profile', 'mainProfile');
  const unsubscribeProfile = onSnapshot(
    profileDocRef,
    async (snapshot) => {
      if (snapshot.exists()) {
        const profileData = snapshot.data() as AppProfile;
        await db.profile.clear();
        await db.profile.add(profileData);
      }
    },
    (err) => {
      console.warn('Cloud listener profile error:', err);
    }
  );

  return () => {
    unsubscribeReports();
    unsubscribeProfile();
  };
}

/**
 * Pull all data from cloud for a new sync code and save locally
 */
export async function pullAllFromCloud(syncCode: string): Promise<boolean> {
  try {
    const reportsColRef = collection(firestore, 'syncGroups', syncCode, 'reports');
    const querySnapshot = await getDocs(reportsColRef);
    
    if (querySnapshot.empty) {
      return false; // No cloud data yet for this code
    }

    for (const docSnap of querySnapshot.docs) {
      const report = docSnap.data() as Wochenbericht;
      await db.reports.put(report);
    }

    const profileSnap = await getDocs(collection(firestore, 'syncGroups', syncCode, 'profile'));
    if (!profileSnap.empty) {
      const profileData = profileSnap.docs[0].data() as AppProfile;
      await db.profile.clear();
      await db.profile.add(profileData);
    }

    return true;
  } catch (err) {
    console.warn('Pull all from cloud error:', err);
    return false;
  }
}

/**
 * Format user ID or email into a valid email address for Firebase Auth
 */
export function formatAuthEmail(input: string): string {
  const trimmed = input.trim();
  if (trimmed.includes('@')) return trimmed;
  return `${trimmed.toLowerCase()}@berichtsheft.app`;
}

/**
 * Login with User ID / Email & Password
 */
export async function loginWithUserCredentials(idOrEmail: string, pass: string): Promise<User> {
  const email = formatAuthEmail(idOrEmail);
  try {
    const cred = await signInWithEmailAndPassword(auth, email, pass);
    return cred.user;
  } catch (err: any) {
    // If account does not exist yet, attempt automatic creation
    if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
      try {
        const newCred = await createUserWithEmailAndPassword(auth, email, pass);
        return newCred.user;
      } catch (createErr) {
        throw err;
      }
    }
    throw err;
  }
}

/**
 * Register a new user
 */
export async function registerWithUserCredentials(idOrEmail: string, pass: string): Promise<User> {
  const email = formatAuthEmail(idOrEmail);
  const cred = await createUserWithEmailAndPassword(auth, email, pass);
  return cred.user;
}

/**
 * Sign out current user
 */
export async function logoutUser(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function subscribeAuthState(onChange: (user: User | null) => void) {
  return onAuthStateChanged(auth, onChange);
}

