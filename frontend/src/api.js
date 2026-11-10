const BASE = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });
  if (res.status === 204) return null;
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error([data.error, ...(data.details || [])].filter(Boolean).join(': ') || `HTTP ${res.status}`);
  return data;
}

export const api = {
  list: (resource, query = '') => request(`/${resource}${query}`),
  create: (resource, body) => request(`/${resource}`, { method: 'POST', body }),
  update: (resource, id, body) => request(`/${resource}/${id}`, { method: 'PUT', body }),
  remove: (resource, id) => request(`/${resource}/${id}`, { method: 'DELETE' }),
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body }),
};
