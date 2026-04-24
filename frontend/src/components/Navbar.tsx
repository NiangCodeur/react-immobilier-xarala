import { Link } from 'react-router-dom';
// 1. On importe le "cerveau" de la connexion
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  // 2. On récupère l'utilisateur et la fonction pour sortir
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white border-b border-stone-200 sticky top-0 z-50 backdrop-blur-sm bg-white/95">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link 
            to="/"
            className="text-2xl font-bold tracking-tight bg-cyan-500 bg-clip-text text-transparent hover:from-orange-700 hover:to-rose-700 transition-all"
          >
            Dakar Logements
          </Link>

          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="text-sm font-medium transition-colors text-stone-600 hover:text-cyan-500"
            >
              Logements
            </Link>
            <Link
              to="/tourisme"
              className="text-sm font-medium transition-colors text-stone-600 hover:text-cyan-500"
            >
              Tourisme
            </Link>
            <Link
              to="/contact"
              className="text-sm font-medium transition-colors text-stone-600 hover:text-cyan-500"
            >
              Contact
            </Link>

            {/* 3. Si un utilisateur est connecté, on affiche le bouton Déconnexion */}
            {user && (
              <button
                onClick={logout}
                className="text-sm font-medium text-stone-600 hover:text-red-500 transition-colors border-l pl-8 border-stone-200"
              >
                Déconnexion
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};