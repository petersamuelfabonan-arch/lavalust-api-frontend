const API_URL = import.meta.env.VITE_API_URL;

function getToken() {
  return localStorage.getItem('access_token');
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, { ...options, headers });
  } catch (err) {
    // Network failure, CORS block, or the Render free tier is still waking up
    throw new Error(
      'Cannot reach the server. If the API was idle, wait ~30-60 seconds and try again.'
    );
  }

  // Don't crash if the server returns something that isn't JSON (e.g. a 502 page)
  const data = await res.json().catch(() => ({}));

  // Expired/invalid token: clear it and send the user back to login
  if (res.status === 401 && path !== '/api/login') {
    logout();
    window.location.href = '/login';
    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }

  return data;
}

export async function login(username, password) {
  const data = await request('/api/login', {
    method: 'POST',
    body: JSON.stringify({ username, password }),
  });

  localStorage.setItem('access_token', data.tokens.access_token);
  localStorage.setItem('refresh_token', data.tokens.refresh_token);
  localStorage.setItem('username', data.user.username);

  return data;
}

export function logout() {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('username');
}

export function isLoggedIn() {
  return !!getToken();
}

export function getProducts() {
  return request('/api/products');
}

export function getProduct(id) {
  return request(`/api/products/${id}`);
}

export function createProduct(product) {
  return request('/api/products', {
    method: 'POST',
    body: JSON.stringify(product),
  });
}

export function updateProduct(id, product) {
  return request(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(product),
  });
}

export function deleteProduct(id) {
  return request(`/api/products/${id}`, {
    method: 'DELETE',
  });
}