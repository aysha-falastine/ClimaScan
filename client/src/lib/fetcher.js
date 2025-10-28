// Centralized auth-aware fetch helper
export async function authFetch(url, options = {}) {
  const opts = { ...options };
  opts.headers = opts.headers ? { ...opts.headers } : {};

  // Ensure we run only in browser
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    }
  }

  // Default Accept header
  opts.headers['Accept'] = opts.headers['Accept'] || 'application/json';

  const res = await fetch(url, opts);

  // Handle unauthorized centrally: clear token and redirect to login
  if (res.status === 401) {
    try {
      localStorage.removeItem('token');
    } catch (e) {
      // ignore
    }
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    // throw to let callers know
    throw new Error('Unauthorized');
  }

  return res;
}
