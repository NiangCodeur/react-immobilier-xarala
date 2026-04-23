// const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// const getHeaders = (): HeadersInit => {
//   const token = localStorage.getItem('token');
//   return {
//     'Content-Type': 'application/json',
//     ...(token ? { Authorization: `Bearer ${token}` } : {}),
//   };
// };

// const handleResponse = async (res: Response) => {
//   if (res.status === 401) {
//     // Si l'erreur arrive sur la route de login, c'est une erreur d'identifiants
//     if (res.url.includes('/auth/login')) {
//       const errorData = await res.json().catch(() => ({ message: 'Identifiants invalides' }));
//       throw new Error(errorData.message || 'Email ou mot de passe incorrect');
//     }

//     // Pour les autres routes, c'est une session expirée
//     localStorage.removeItem('token');
//     localStorage.removeItem('user');
//     if (window.location.pathname !== '/login') {
//       window.location.href = '/login';
//     }
//     throw new Error('Session expirée, veuillez vous reconnecter');
//   }

//   if (!res.ok) {
//     const error = await res.json().catch(() => ({ message: 'Erreur réseau' }));
//     throw new Error(error.message || 'Erreur serveur');
//   }
//   return res.json();
// };

// export const api = {
//   get: (path: string) =>
//     fetch(`${BASE_URL}${path}`, { headers: getHeaders() }).then(handleResponse),

//   post: (path: string, body: unknown) =>
//     fetch(`${BASE_URL}${path}`, {
//       method: 'POST',
//       headers: getHeaders(),
//       body: JSON.stringify(body),
//     }).then(handleResponse),

//   patch: (path: string, body: unknown) =>
//     fetch(`${BASE_URL}${path}`, {
//       method: 'PATCH',
//       headers: getHeaders(),
//       body: JSON.stringify(body),
//     }).then(handleResponse),
  
//   // Tu peux ajouter put et delete ici si besoin
// };

// // ON RÉACTIVE TOUT ICI
// export const authApi = {
//   register: (data: { nom: string; email: string; motDePasse: string }) =>
//     api.post('/auth/register', data),

//   login: (data: { email: string; motDePasse: string }) =>
//     api.post('/auth/login', data),

//   me: () => 
//     api.get('/auth/me'),

//   updateProfil: (data: { email?: string; motDePasseActuel: string; nouveauMotDePasse?: string }) =>
//     api.patch('/auth/profil', data),
// };

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const getHeaders = (): HeadersInit => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

const handleResponse = async (res: Response) => {
  // Gestion du 401 (Non autorisé / Session expirée)
  if (res.status === 401) {
    if (res.url.includes('/auth/login')) {
      const errorData = await res.json().catch(() => ({ message: 'Identifiants invalides' }));
      throw new Error(errorData.message || 'Email ou mot de passe incorrect');
    }
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (window.location.pathname !== '/login') {
      window.location.href = '/login';
    }
    throw new Error('Session expirée, veuillez vous reconnecter');
  }

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: 'Erreur réseau' }));
    throw new Error(error.message || 'Erreur serveur');
  }
  return res.json();
};

// --- L'OBJET API COMPLET ---
export const api = {
  get: (path: string) =>
    fetch(`${BASE_URL}${path}`, { headers: getHeaders() }).then(handleResponse),

  post: (path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  put: (path: string, body: unknown) => // AJOUTÉ : Pour handleToggleDisponible
    fetch(`${BASE_URL}${path}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  patch: (path: string, body: unknown) =>
    fetch(`${BASE_URL}${path}`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(body),
    }).then(handleResponse),

  delete: (path: string) => // AJOUTÉ : Pour handleDelete
    fetch(`${BASE_URL}${path}`, {
      method: 'DELETE',
      headers: getHeaders(),
    }).then(handleResponse),
};

// --- SERVICES D'AUTH ---
export const authApi = {
  register: (data: { nom: string; email: string; motDePasse: string }) =>
    api.post('/auth/register', data),

  login: (data: { email: string; motDePasse: string }) =>
    api.post('/auth/login', data),

  me: () => 
    api.get('/auth/me'),

  updateProfil: (data: { email?: string; motDePasseActuel: string; nouveauMotDePasse?: string }) =>
    api.patch('/auth/profil', data),
};