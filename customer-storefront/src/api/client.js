const API_BASE =
  import.meta.env.REACT_APP_API_GATEWAY_URL ||
  import.meta.env.VITE_API_GATEWAY_URL ||
  'http://localhost:8080';

let token = localStorage.getItem('storefront_token') || '';
let authPromise = null;

function setToken(next) {
  token = next;
  if (next) {
    localStorage.setItem('storefront_token', next);
  } else {
    localStorage.removeItem('storefront_token');
  }
}

export function getApiBase() {
  return API_BASE;
}

export async function ensureAuth() {
  if (token) return token;
  if (authPromise) return authPromise;

  authPromise = fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'customer@storefront.local',
      password: 'customer',
    }),
  })
    .then(async (res) => {
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || 'Authentication failed');
      }
      const data = await res.json();
      setToken(data.token);
      return data.token;
    })
    .finally(() => {
      authPromise = null;
    });

  return authPromise;
}

async function request(path, options = {}) {
  const { auth = true, ...fetchOptions } = options;
  const headers = {
    'Content-Type': 'application/json',
    ...(fetchOptions.headers || {}),
  };

  if (auth) {
    await ensureAuth();
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...fetchOptions,
    headers,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed (${res.status})`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function getProducts() {
  return request('/api/inventory/products');
}

export function getProduct(id) {
  return request(`/api/inventory/products/${encodeURIComponent(id)}`);
}

export function createOrder(payload) {
  return request('/api/orders/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function getOrder(id) {
  return request(`/api/orders/${id}`);
}

export function trackShipment(trackingNumber) {
  return request(`/api/shipping/track/${encodeURIComponent(trackingNumber)}`, {
    auth: false,
  });
}
