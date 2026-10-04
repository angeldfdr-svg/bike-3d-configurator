'use client';

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { X, Eye, EyeOff, LogIn, UserPlus, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { getAuthStore, useAuthStore } from '@/store/auth-store';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function InputField({
  id,
  label,
  type,
  value,
  onChange,
  autoComplete,
  required = true,
}: {
  id: string;
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete?: string;
  required?: boolean;
}) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword ? (show ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-[0.8125rem] font-medium text-fog-300">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={resolvedType}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete={autoComplete}
          required={required}
          className="w-full rounded-md border border-line bg-ink-850 px-3.5 py-2.5 text-sm text-fog-50 placeholder:text-fog-600 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20 transition-colors duration-200"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Ocultar palavra-passe' : 'Mostrar palavra-passe'}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-fog-500 hover:text-fog-300 transition-colors"
          >
            {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

// ─── Login Form ───────────────────────────────────────────────────────────────

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const login = useAuthStore((s) => s.login);
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const loading = status === 'loading';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    await login({ email, password });
    if (getAuthStore().getState().status === 'authenticated') {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <InputField
        id="login-email"
        label="E-mail"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
      />
      <InputField
        id="login-password"
        label="Palavra-passe"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="current-password"
      />

      {error && (
        <p
          key={error}
          role="alert"
          className="animate-shake rounded-md border border-red-800/60 bg-red-950/60 px-3.5 py-2.5 text-[0.8125rem] text-red-300"
        >
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full mt-1">
        {loading ? (
          <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> A entrar…</>
        ) : (
          <><LogIn className="size-4" aria-hidden="true" /> Entrar</>
        )}
      </Button>
    </form>
  );
}

// ─── Register Form ────────────────────────────────────────────────────────────

function RegisterForm({ onSuccess }: { onSuccess: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const register = useAuthStore((s) => s.register);
  const status = useAuthStore((s) => s.status);
  const error = useAuthStore((s) => s.error);
  const clearError = useAuthStore((s) => s.clearError);

  const loading = status === 'loading';

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    clearError();
    await register({ name, email, password, confirmPassword });
    if (getAuthStore().getState().status === 'authenticated') {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <InputField
        id="reg-name"
        label="Nome completo"
        type="text"
        value={name}
        onChange={setName}
        autoComplete="name"
      />
      <InputField
        id="reg-email"
        label="E-mail"
        type="email"
        value={email}
        onChange={setEmail}
        autoComplete="email"
      />
      <InputField
        id="reg-password"
        label="Palavra-passe"
        type="password"
        value={password}
        onChange={setPassword}
        autoComplete="new-password"
      />
      <InputField
        id="reg-confirm"
        label="Confirmar palavra-passe"
        type="password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        autoComplete="new-password"
      />

      {error && (
        <p
          key={error}
          role="alert"
          className="animate-shake rounded-md border border-red-800/60 bg-red-950/60 px-3.5 py-2.5 text-[0.8125rem] text-red-300"
        >
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="w-full mt-1">
        {loading ? (
          <><Loader2 className="size-4 animate-spin" aria-hidden="true" /> A criar conta…</>
        ) : (
          <><UserPlus className="size-4" aria-hidden="true" /> Criar conta</>
        )}
      </Button>
    </form>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type AuthModalProps = {
  open: boolean;
  onClose: () => void;
};

export function AuthModal({ open, onClose }: AuthModalProps): ReactNode {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const dialogRef = useRef<HTMLDialogElement>(null);
  const clearError = useAuthStore((s) => s.clearError);

  // Sync open/close with <dialog>
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open) {
      el.showModal();
    } else {
      el.close();
    }
  }, [open]);

  // Close on backdrop click
  function handleDialogClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (e.target === dialogRef.current) handleClose();
  }

  function handleClose() {
    clearError();
    onClose();
  }

  function handleSuccess() {
    handleClose();
  }

  // Close on Escape (dialog does this natively, but we need to sync state)
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const handleCancel = () => handleClose();
    el.addEventListener('cancel', handleCancel);
    return () => el.removeEventListener('cancel', handleCancel);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <dialog
      ref={dialogRef}
      onClick={handleDialogClick}
      aria-label={tab === 'login' ? 'Iniciar sessão' : 'Criar conta'}
      className="m-auto w-full max-w-md rounded-xl border border-line bg-ink-900 p-0 shadow-2xl backdrop:bg-ink-950/70 backdrop:backdrop-blur-sm open:animate-[fadeIn_0.18s_ease-out]"
    >
      <div className="flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <div className="flex gap-1 rounded-lg bg-ink-850 p-1">
            <button
              type="button"
              onClick={() => { setTab('login'); clearError(); }}
              className={`rounded-md px-4 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-200 ${
                tab === 'login'
                  ? 'bg-lime-400 text-ink-950'
                  : 'text-fog-400 hover:text-fog-100'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => { setTab('register'); clearError(); }}
              className={`rounded-md px-4 py-1.5 text-[0.8125rem] font-semibold transition-colors duration-200 ${
                tab === 'register'
                  ? 'bg-lime-400 text-ink-950'
                  : 'text-fog-400 hover:text-fog-100'
              }`}
            >
              Criar conta
            </button>
          </div>

          <button
            type="button"
            onClick={handleClose}
            aria-label="Fechar"
            className="rounded-md p-1.5 text-fog-500 hover:bg-ink-800 hover:text-fog-200 transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {tab === 'login' ? (
            <LoginForm onSuccess={handleSuccess} />
          ) : (
            <RegisterForm onSuccess={handleSuccess} />
          )}
        </div>
      </div>
    </dialog>
  );
}
