'use client';

import { useState, type ReactNode } from 'react';
import { LogOut, User } from 'lucide-react';

import { AuthModal } from '@/components/auth/auth-modal';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth-store';

/**
 * Auth button shown in the site header.
 *
 * - Unauthenticated: shows "Entrar" → opens the modal.
 * - Authenticated: shows the user's avatar initials + name, and a logout button.
 */
export function AuthButton(): ReactNode {
  const [modalOpen, setModalOpen] = useState(false);

  const user = useAuthStore((s) => s.user);
  const status = useAuthStore((s) => s.status);
  const logout = useAuthStore((s) => s.logout);

  // Don't render anything while hydrating to avoid a flash
  if (status === 'idle') return null;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        {/* Avatar */}
        <div
          aria-hidden="true"
          className="flex size-8 items-center justify-center rounded-full bg-lime-400 text-[0.6875rem] font-extrabold text-ink-950 select-none"
        >
          {user.avatarInitials}
        </div>

        {/* Name (hidden on mobile) */}
        <span className="hidden text-[0.8125rem] font-medium text-fog-200 lg:block">
          {user.name.split(' ')[0]}
        </span>

        {/* Logout */}
        <button
          type="button"
          onClick={logout}
          aria-label="Terminar sessão"
          title="Terminar sessão"
          className="rounded-md p-1.5 text-fog-500 hover:bg-ink-850 hover:text-fog-200 transition-colors duration-200"
        >
          <LogOut className="size-4" aria-hidden="true" />
        </button>
      </div>
    );
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setModalOpen(true)}
        aria-haspopup="dialog"
        className="hidden sm:inline-flex"
      >
        <User className="size-4" aria-hidden="true" />
        Entrar
      </Button>

      {/* Mobile: icon only */}
      <button
        type="button"
        onClick={() => setModalOpen(true)}
        aria-label="Entrar / criar conta"
        className="inline-flex size-10 items-center justify-center rounded-md border border-line text-fog-200 transition-colors hover:border-line-strong hover:text-fog-50 sm:hidden"
      >
        <User className="size-5" aria-hidden="true" />
      </button>

      <AuthModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
