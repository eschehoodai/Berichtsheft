export interface LocalUser {
  id: string;
  email: string;
  name: string;
}

const LOCAL_USER_KEY = 'berichtsheft_local_user';
const AUTH_EVENT_KEY = 'berichtsheft_auth_change';

/**
 * Format user ID or email into a standard format
 */
export function formatAuthEmail(input: string): string {
  const trimmed = input.trim();
  if (trimmed.includes('@')) return trimmed;
  return `${trimmed.toLowerCase()}@berichtsheft.local`;
}

/**
 * Get current logged-in local user from localStorage
 */
export function getLocalUser(): LocalUser | null {
  try {
    const data = localStorage.getItem(LOCAL_USER_KEY);
    if (!data) return null;
    return JSON.parse(data) as LocalUser;
  } catch (err) {
    console.error('Error reading local user:', err);
    return null;
  }
}

/**
 * Log in locally (Self-Hosted mode).
 * Stores user session in localStorage and fires auth change listener.
 */
export async function loginWithLocalCredentials(
  idOrEmail: string,
  _pass?: string
): Promise<LocalUser> {
  const trimmed = idOrEmail.trim();
  if (!trimmed) {
    throw new Error('Bitte geben Sie einen Benutzernamen oder eine E-Mail-Adresse ein.');
  }

  const email = formatAuthEmail(trimmed);
  const name = trimmed.includes('@') ? trimmed.split('@')[0] : trimmed;

  const user: LocalUser = {
    id: email.toLowerCase(),
    email,
    name
  };

  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_EVENT_KEY));
  return user;
}

/**
 * Log out current user locally
 */
export async function logoutLocalUser(): Promise<void> {
  localStorage.removeItem(LOCAL_USER_KEY);
  window.dispatchEvent(new Event(AUTH_EVENT_KEY));
}

/**
 * Subscribe to local auth changes
 */
export function subscribeLocalAuth(onChange: (user: LocalUser | null) => void): () => void {
  // Initial check
  onChange(getLocalUser());

  const handleAuthChange = () => {
    onChange(getLocalUser());
  };

  window.addEventListener(AUTH_EVENT_KEY, handleAuthChange);
  window.addEventListener('storage', handleAuthChange);

  return () => {
    window.removeEventListener(AUTH_EVENT_KEY, handleAuthChange);
    window.removeEventListener('storage', handleAuthChange);
  };
}
