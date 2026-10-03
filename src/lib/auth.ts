/**
 * Lightweight mock authentication service.
 *
 * Stores users in localStorage so sessions survive page refreshes without a
 * backend. Replace the `_mockApi` calls with real fetch() calls to wire up a
 * production identity provider.
 */

import type { AuthUser, LoginCredentials, RegisterCredentials } from '@/types/auth';

const STORAGE_KEY = 'veloce:auth:session';
const USERS_KEY = 'veloce:auth:users';

// ─── Persistence helpers ─────────────────────────────────────────────────────

function loadUsers(): Record<string, { password: string; user: AuthUser }> {
  if (typeof window === 'undefined') return {};
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) ?? '{}') as Record<
      string,
      { password: string; user: AuthUser }
    >;
  } catch {
    return {};
  }
}

function saveUsers(users: Record<string, { password: string; user: AuthUser }>): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function persistSession(user: AuthUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

function clearSession(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_KEY);
}

// ─── Public API ──────────────────────────────────────────────────────────────

/** Simulated network delay to make the UX feel realistic. */
function delay(ms = 600): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Returns the currently logged-in user, or null. */
export function getPersistedSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

/** Derives initials from a display name (up to 2 chars). */
function toInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * Validate credentials and return the matching user.
 * Throws a descriptive string on failure so callers can show it in the UI.
 */
export async function loginUser(credentials: LoginCredentials): Promise<AuthUser> {
  await delay();

  const { email, password } = credentials;

  if (!email || !password) {
    throw new Error('Preenche o e-mail e a palavra-passe.');
  }

  const users = loadUsers();
  const entry = users[email.toLowerCase()];

  if (!entry || entry.password !== password) {
    throw new Error('E-mail ou palavra-passe incorretos.');
  }

  persistSession(entry.user);
  return entry.user;
}

/**
 * Create a new account.
 * Throws on validation failure or duplicate e-mail.
 */
export async function registerUser(credentials: RegisterCredentials): Promise<AuthUser> {
  await delay();

  const { name, email, password, confirmPassword } = credentials;

  if (!name.trim()) throw new Error('Introduz o teu nome.');
  if (!email.includes('@')) throw new Error('Endereço de e-mail inválido.');
  if (password.length < 8) throw new Error('A palavra-passe deve ter pelo menos 8 caracteres.');
  if (password !== confirmPassword) throw new Error('As palavras-passe não coincidem.');

  const users = loadUsers();
  const key = email.toLowerCase();

  if (users[key]) {
    throw new Error('Já existe uma conta com este e-mail.');
  }

  const user: AuthUser = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: key,
    avatarInitials: toInitials(name),
    createdAt: new Date().toISOString(),
  };

  users[key] = { password, user };
  saveUsers(users);
  persistSession(user);

  return user;
}

/** Remove the session from localStorage. */
export function logoutUser(): void {
  clearSession();
}
