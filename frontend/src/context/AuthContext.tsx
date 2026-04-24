import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react'; 
import { authApi } from '../lib/api';

// Définition de la structure de l'utilisateur
interface User {
  id: string;
  nom: string;
  email: string;
  role: 'admin' | 'user';
}

// Définition des types pour le contexte d'authentification
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, motDePasse: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // 1. Rehydration : On récupère la session au chargement de la page
  useEffect(() => {
    const restaurerSession = () => {
      const token = localStorage.getItem('token');
      const stored = localStorage.getItem('user');
      
      if (token && stored) {
        try {
          setUser(JSON.parse(stored));
        } catch (error) {
          console.error("Erreur lors de la restauration de session:", error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    restaurerSession();
  }, []);

  // 2. Fonction de connexion avec verrouillage Admin
  const login = async (email: string, motDePasse: string) => {
    try {
      setLoading(true);
      
      // Appel API (wrapper fetch de api.ts)
      const res = await authApi.login({ email, motDePasse });

      // SÉCURITÉ : Vérification du rôle avant d'autoriser l'accès
      if (res.user.role !== 'admin') {
        throw new Error("Accès refusé : Vous n'êtes pas administrateur.");
      }

      // Si c'est bien un admin, on enregistre les données
      localStorage.setItem('token', res.token);
      localStorage.setItem('user', JSON.stringify(res.user));
      
      setUser(res.user);
    } catch (error: any) {
      // On remonte l'erreur pour qu'elle soit affichée sur la page de Login
      console.error("Tentative de connexion échouée:", error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 3. Déconnexion
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      isAdmin: user?.role === 'admin' 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour accéder à l'auth
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé à l’intérieur d’un AuthProvider');
  }
  return ctx;
}