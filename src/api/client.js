const DEFAULT_TIMEOUT_MS = 15000;

const API_BASE = import.meta.env.VITE_API_BASE_URL;

function withTimeout(ms, signal) {
  const ctrl = new AbortController();
  const id = setTimeout(() => ctrl.abort(), ms);
  if (signal) signal.addEventListener('abort', () => ctrl.abort());
  return { signal: ctrl.signal, cancelTimer: () => clearTimeout(id) };
}

function isFormLike(body) {
  return body instanceof FormData || body instanceof Blob || body instanceof File;
}

function buildHeaders(extra, token, body) {
  const base = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
  // Only set JSON content-type if body is plain object/string and not form-like
  if (body !== undefined && !isFormLike(body) && typeof body !== 'string') {
    return { 'Content-Type': 'application/json', ...base };
  }
  // If caller passed a body that's already string (assumed they set headers) leave as-is
  return base;
}

export function toQueryString(params) {
  const esc = encodeURIComponent;
  return Object.entries(params || {})
    .filter(([, v]) => v !== undefined && v !== null)
    .flatMap(([k, v]) =>
      Array.isArray(v)
        ? v.map((item) => `${esc(k)}=${esc(item)}`)
        : [`${esc(k)}=${esc(v)}`]
    )
    .join('&');
}

export async function apiRequest(
  path,
  { method = 'GET', body, token, headers = {}, timeout = DEFAULT_TIMEOUT_MS, signal } = {},
) {
  const url = path.startsWith('http')
  ? path
  : `${API_BASE.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
  const isForm = isFormLike(body);
  const preparedBody =
    body === undefined
      ? undefined
      : isForm
        ? body
        : typeof body === 'string'
          ? body
          : JSON.stringify(body);

  const { signal: finalSignal, cancelTimer } = withTimeout(timeout, signal);

  try {
    const res = await fetch(url, {
      method,
      headers: buildHeaders(headers, token, body),
      body: preparedBody,
      signal: finalSignal,
      credentials: 'include',
    });

    const contentType = res.headers.get('content-type') || '';
    const parseJson = contentType.includes('application/json');

    const data = parseJson ? await res.json().catch(() => null) : await res.text();

    if (!res.ok) {
      throw {
        status: res.status,
        message: (data && data.message) || res.statusText,
        data,
        url,
      };
    }
    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      throw { status: 0, message: 'Request timed out / aborted', url };
    }
    throw err;
  } finally {
    cancelTimer();
  }
}

// Convenience verbs
export const api = {
  get: (p, opts) => apiRequest(p, { ...opts, method: 'GET' }),
  post: (p, body, opts) => apiRequest(p, { ...opts, method: 'POST', body }),
  put: (p, body, opts) => apiRequest(p, { ...opts, method: 'PUT', body }),
  patch: (p, body, opts) => apiRequest(p, { ...opts, method: 'PATCH', body }),
  delete: (p, opts) => apiRequest(p, { ...opts, method: 'DELETE' }),
  base: () => API_BASE,
};
