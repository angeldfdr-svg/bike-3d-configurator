/**
 * Authentication types for VELOCE Bike Configurator.
 *
 * Lightweight auth model that lives entirely client-side (no backend required).
 * A production implementation would swap the mock functions for real API calls.
 */

export type AuthUser = {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly avatarInitials: string;
  readonly createdAt: string;
};

export type AuthStatus = 'idle' | 'loading' | 'authenticated' | 'unauthenticated' | 'error';

export type AuthState = {
  readonly user: AuthUser | null;
  readonly status: AuthStatus;
  readonly error: string | null;
};

export type LoginCredentials = {
  readonly email: string;
  readonly password: string;
};

export type RegisterCredentials = {
  readonly name: string;
  readonly email: string;
  readonly password: string;
  readonly confirmPassword: string;
};

export type AuthActions = {
  login(credentials: LoginCredentials): Promise<void>;
  register(credentials: RegisterCredentials): Promise<void>;
  logout(): void;
  clearError(): void;
};

export type AuthStore = AuthState & AuthActions;
