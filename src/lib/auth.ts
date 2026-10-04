/**
 * Secure authentication service using the Web Crypto API.
 *
 * Passwords are NEVER stored in plain text. Instead, they are hashed with
 * PBKDF2-SHA-256 (100 000 iterations, 32-byte output) and stored as
 * `salt:hash` — both hex-encoded. The salt is random per account so rainbow
 * tables are useless.
 *
 * This is a client-side demo only, not production authentication: localStorage
 * can be read or modified by the user, and this rate limit can be bypassed.
 * Production authentication and password hashing must happen on a backend.
 *
 * Rate limiting: after 5 consecutive failed attempts the account is locked for
 * 60 seconds. The counter is stored in sessionStorage so it resets on tab close
 * but persists across route changes within the same tab. It is only a UI
 * demonstration and not a security control.
 */

import type { AuthUser, LoginCredentials, RegisterCredentials } from '@/types/auth';

const SESSION_KEY = 'veloce:auth:session';
const USERS_KEY = 'veloce:auth:users';
const RATE_KEY = 'veloce:auth:rate';

const PBKDF2_ITERATIONS = 100_000;
const PBKDF2_HASH = 'SHA-256';
const KEY_LENGTH = 32; // bytes

const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 60_000; // 1 minute

// ─── Crypto helpers ───────────────────────────────────────────────────────────

function bufToHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

function hexToBuf(hex: string): Uint8Array {
  const result = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    result[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return result;
}

async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltBuf = salt.buffer as ArrayBuffer;
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuf,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    key,
    KEY_LENGTH * 8,
  );

  return `${bufToHex(salt.buffer as ArrayBuffer)}:${bufToHex(bits)}`;
}

async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [saltHex, hashHex] = stored.split(':');
  if (!saltHex || !hashHex) return false;

  const saltBytes = hexToBuf(saltHex);
  const saltBuf = saltBytes.buffer as ArrayBuffer;
  const enc = new TextEncoder();

  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, [
    'deriveBits',
  ]);

  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuf,
      iterations: PBKDF2_ITERATIONS,
      hash: PBKDF2_HASH,
    },
    key,
    KEY_LENGTH * 8,
  );

  return bufToHex(bits) === hashHex;
}

// ─── Rate limiting ────────────────────────────────────────────────────────────

type RateEntry = { attempts: number; lockedUntil: number };

function getRateEntry(email: string): RateEntry {
  if (typeof window === 'undefined') return { attempts: 0, lockedUntil: 0 };
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, RateEntry>) : {};
    return map[email.toLowerCase()] ?? { attempts: 0, lockedUntil: 0 };
  } catch {
    return { attempts: 0, lockedUntil: 0 };
  }
}

function setRateEntry(email: string, entry: RateEntry): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = sessionStorage.getItem(RATE_KEY);
    const map = raw ? (JSON.parse(raw) as Record<string, RateEntry>) : {};
    map[email.toLowerCase()] = entry;
    sessionStorage.setItem(RATE_KEY, JSON.stringify(map));
  } catch {
    /* sessionStorage unavailable — skip silently */
  }
}

function recordFailedAttempt(email: string): void {
  const entry = getRateEntry(email);
  const attempts = entry.attempts + 1;
  const lockedUntil = attempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0;
  setRateEntry(email, { attempts, lockedUntil });
}

function resetAttempts(email: string): void {
  setRateEntry(email, { attempts: 0, lockedUntil: 0 });
}

function checkRateLimit(email: string): void {
  const entry = getRateEntry(email);
  if (entry.lockedUntil > Date.now()) {
    const secs = Math.ceil((entry.lockedUntil - Date.now()) / 1000);
    throw new Error(
      `Demasiadas tentativas falhadas. Aguarda ${secs} segundo${secs === 1 ? '' : 's'}.`,
    );
  }
}

// ─── Persistence helpers ──────────────────────────────────────────────────────

type StoredUser = { passwordHash: string; user: AuthUser };

function loadUsers(): Record<string, StoredUser> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}') as Record<string, StoredUser>;
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, StoredUser>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function persistSession(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SESSION_KEY, JSON.stringify(user));
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(SESSION_KEY);
}

// ─── Simulated network delay ─────────────────────────────────────────────────

function delay(ms = 500): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Public API ───────────────────────────────────────────────────────────────

export function getPersistedSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

export async function loginUser(credentials: LoginCredentials): Promise<AuthUser> {
  await delay();

  const { email, password } = credentials;
  if (!email || !password) throw new Error('Preenche o e-mail e a palavra-passe.');

  checkRateLimit(email);

  const users = loadUsers();
  const entry = users[email.toLowerCase()];

  if (!entry) {
    recordFailedAttempt(email);
    throw new Error('E-mail ou palavra-passe incorretos.');
  }

  const valid = await verifyPassword(password, entry.passwordHash);
  if (!valid) {
    recordFailedAttempt(email);
    const { attempts } = getRateEntry(email);
    const remaining = MAX_ATTEMPTS - attempts;
    throw new Error(
      remaining > 0
        ? `E-mail ou palavra-passe incorretos. (${remaining} tentativa${remaining === 1 ? '' : 's'} restante${remaining === 1 ? '' : 's'})`
        : `Conta bloqueada por 60 segundos.`,
    );
  }

  resetAttempts(email);
  persistSession(entry.user);
  return entry.user;
}

export async function registerUser(credentials: RegisterCredentials): Promise<AuthUser> {
  await delay();

  const { name, email, password, confirmPassword } = credentials;

  if (!name.trim()) throw new Error('Introduz o teu nome.');
  if (!email.includes('@')) throw new Error('Endereço de e-mail inválido.');
  if (password.length < 8) throw new Error('A palavra-passe deve ter pelo menos 8 caracteres.');
  if (password !== confirmPassword) throw new Error('As palavras-passe não coincidem.');

  // Password strength: at least one letter and one digit
  if (!/[a-zA-Z]/.test(password) || !/\d/.test(password)) {
    throw new Error('A palavra-passe deve conter letras e números.');
  }

  const users = loadUsers();
  const key = email.toLowerCase();

  if (users[key]) throw new Error('Já existe uma conta com este e-mail.');

  const user: AuthUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: key,
    avatarInitials: toInitials(name),
    createdAt: new Date().toISOString(),
  };

  const passwordHash = await hashPassword(password);
  users[key] = { passwordHash, user };
  saveUsers(users);
  persistSession(user);

  return user;
}

export function logoutUser(): void {
  clearSession();
}
