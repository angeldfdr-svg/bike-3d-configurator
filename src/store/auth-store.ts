/**
 * Global authentication store powered by Zustand.
 *
 * Hydrates from localStorage on first mount so a hard refresh keeps the user
 * logged in. All side-effects (localStorage read/write) live in `src/lib/auth`
 * so this store stays pure state management.
 */

import { createStore, useStore, type StateCreator, type StoreApi } from 'zustand';

import {
  getPersistedSession,
  loginUser,
  logoutUser,
  registerUser,
} from '@/lib/auth';
import type { AuthStore, LoginCredentials, RegisterCredentials } from '@/types/auth';

// ─── Initial state ────────────────────────────────────────────────────────────

const initialState = {
  user: null,
  status: 'idle' as AuthStore['status'],
  error: null,
};

// ─── Store factory ────────────────────────────────────────────────────────────

function createAuthStoreState(): StateCreator<AuthStore, [], []> {
  return (set) => ({
    ...initialState,

    async login(credentials: LoginCredentials) {
      set({ status: 'loading', error: null });
      try {
        const user = await loginUser(credentials);
        set({ user, status: 'authenticated', error: null });
      } catch (err) {
        set({
          status: 'error',
          error: err instanceof Error ? err.message : 'Erro ao iniciar sessão.',
        });
      }
    },

    async register(credentials: RegisterCredentials) {
      set({ status: 'loading', error: null });
      try {
        const user = await registerUser(credentials);
        set({ user, status: 'authenticated', error: null });
      } catch (err) {
        set({
          status: 'error',
          error: err instanceof Error ? err.message : 'Erro ao criar conta.',
        });
      }
    },

    logout() {
      logoutUser();
      set({ user: null, status: 'unauthenticated', error: null });
    },

    clearError() {
      set({ error: null });
    },
  });
}

export type AuthStoreApi = StoreApi<AuthStore>;

let singleton: AuthStoreApi | undefined;

export function getAuthStore(): AuthStoreApi {
  if (!singleton) {
    singleton = createStore<AuthStore>()(createAuthStoreState());

    // Hydrate from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const persisted = getPersistedSession();
      if (persisted) {
        singleton.setState({ user: persisted, status: 'authenticated' });
      } else {
        singleton.setState({ status: 'unauthenticated' });
      }
    }
  }
  return singleton;
}

/** Subscribe a component to a slice of the auth store. */
export function useAuthStore<T>(selector: (state: AuthStore) => T): T {
  return useStore(getAuthStore(), selector);
}
