/**
 * PRALAY TECH - Firebase Authentication Service
 * Secure Admin Login with Google Sign-In Popup, Email/Password, and role verification.
 */

import {
  signInWithPopup,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { auth, isConfigValid } from './config';
import { AdminUser } from '../types';

const ADMIN_EMAILS = [
  'singhtiger7171@gmail.com',
  'admin@pralaytech.edu',
  'hasan.mujtaba@pralaytech.edu'
];

const LOCAL_ADMIN_SESSION_KEY = 'pralay_tech_admin_session_v1';

export function isUserAdmin(email?: string | null): boolean {
  if (!email) return false;
  const lower = email.toLowerCase().trim();
  return ADMIN_EMAILS.some(adminEmail => adminEmail.toLowerCase() === lower);
}

/**
 * Sign In with Google Popup (using Firebase Auth Modular SDK)
 */
export async function signInWithGoogle(): Promise<AdminUser> {
  if (isConfigValid && auth) {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });
    const credential = await signInWithPopup(auth, provider);
    const user = credential.user;

    const isAdmin = isUserAdmin(user.email);
    const adminUser: AdminUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || 'College Project Evaluator',
      role: isAdmin ? 'admin' : 'guest',
      isAdmin
    };

    localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
    return adminUser;
  }

  throw new Error('Firebase Cloud Auth is not configured. Please use Presentation Admin Mode or configure your Firebase credentials.');
}

/**
 * Sign In with Email and Password
 */
export async function signInWithEmail(email: string, pass: string): Promise<AdminUser> {
  if (isConfigValid && auth) {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const user = cred.user;
      const isAdmin = isUserAdmin(user.email);
      const adminUser: AdminUser = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Authorized Admin',
        role: isAdmin ? 'admin' : 'guest',
        isAdmin
      };
      localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
      return adminUser;
    } catch (err: any) {
      // If user doesn't exist yet, attempt signup for admin email
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        try {
          const newCred = await createUserWithEmailAndPassword(auth, email, pass);
          const user = newCred.user;
          const isAdmin = isUserAdmin(user.email);
          const adminUser: AdminUser = {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || 'Authorized Admin',
            role: isAdmin ? 'admin' : 'guest',
            isAdmin
          };
          localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
          return adminUser;
        } catch {
          throw err;
        }
      }
      throw err;
    }
  }

  throw new Error('Firebase Auth is in local simulation mode.');
}

/**
 * Sign in using Presentation Admin Access (College Defense Mode)
 * Allows team members and evaluating professors during presentation (6:50 PM - 7:10 PM)
 * to test admin functionality with verified credentials.
 */
export async function signInPresentationAdmin(passcode: string): Promise<AdminUser> {
  const clean = passcode.trim();
  // Valid passcodes for presentation defense
  if (clean === 'PRALAY2026' || clean === 'TEAM02' || clean === 'ADMIN123') {
    const adminUser: AdminUser = {
      uid: 'admin-presentation-lead',
      email: 'singhtiger7171@gmail.com',
      displayName: 'PRALAY TECH Lead Evaluator',
      role: 'superadmin',
      isAdmin: true
    };
    localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
    return adminUser;
  }
  throw new Error('Invalid Admin Passcode. Use PRALAY2026 or TEAM02 for college presentation evaluation.');
}

/**
 * Sign out
 */
export async function logoutAdmin(): Promise<void> {
  if (auth) {
    try {
      await signOut(auth);
    } catch {
      // ignore
    }
  }
  localStorage.removeItem(LOCAL_ADMIN_SESSION_KEY);
}

/**
 * Get current admin session from storage or Firebase Auth
 */
export function getCurrentAdminSession(): AdminUser | null {
  try {
    const stored = localStorage.getItem(LOCAL_ADMIN_SESSION_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // ignore
  }
  return null;
}

/**
 * Subscribe to Auth State Changes
 */
export function subscribeToAuthState(callback: (user: AdminUser | null) => void): () => void {
  // If Firebase Auth is active
  if (isConfigValid && auth) {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser: User | null) => {
      if (firebaseUser) {
        const isAdmin = isUserAdmin(firebaseUser.email);
        const adminUser: AdminUser = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || 'Admin User',
          role: isAdmin ? 'admin' : 'guest',
          isAdmin
        };
        localStorage.setItem(LOCAL_ADMIN_SESSION_KEY, JSON.stringify(adminUser));
        callback(adminUser);
      } else {
        const local = getCurrentAdminSession();
        // Keep session if signed in via Presentation Defense passkey
        if (local && local.uid.startsWith('admin-presentation')) {
          callback(local);
        } else {
          callback(null);
        }
      }
    });
    return () => unsubscribe();
  }

  // Fallback to local session check
  const initial = getCurrentAdminSession();
  callback(initial);
  return () => {};
}
