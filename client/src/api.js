const API_BASE = 'http://localhost:5000';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const contentType = res.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const body = isJson ? await res.json() : null;
  if (!res.ok) {
    throw body || { error: 'Request failed' };
  }
  return body;
}

export const customers = {
  list: (params = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request(`/api/customers?${qs}`);
  },
  get: (id) => request(`/api/customers/${id}`),
  create: (payload) => request('/api/customers', { method: 'POST', body: JSON.stringify(payload) }),
  update: (id, payload) => request(`/api/customers/${id}`, { method: 'PUT', body: JSON.stringify(payload) }),
  remove: (id) => request(`/api/customers/${id}`, { method: 'DELETE' }),
  addresses: {
    list: (customerId) => request(`/api/customers/${customerId}/addresses`),
    create: (customerId, payload) => request(`/api/customers/${customerId}/addresses`, { method: 'POST', body: JSON.stringify(payload) }),
    update: (addressId, payload) => request(`/api/addresses/${addressId}`, { method: 'PUT', body: JSON.stringify(payload) }),
    remove: (addressId) => request(`/api/addresses/${addressId}`, { method: 'DELETE' })
  }
};