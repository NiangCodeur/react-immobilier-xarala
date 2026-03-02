import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-cyan-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="text-2xl font-bold mb-4 bg-cyan-500 bg-clip-text text-transparent">
              Dakar Logements
            </h3>
            <p className="text-stone-400 leading-relaxed">
              Votre plateforme de confiance pour trouver le logement idéal à Dakar.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Liens rapides</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-stone-400 hover:text-cyan-500 transition-colors">
                  Logements
                </Link>
              </li>
              <li>
                <Link to="/tourisme" className="text-stone-400 hover:text-cyan-500 transition-colors">
                  Tourisme
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-stone-400 hover:text-cyan-500 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact</h3>
            <ul className="space-y-3 text-stone-400">
              <li>contact@dakar-logements.com</li>
              <li>+221 77 472 50 61</li>
              <li>Dakar, Sénégal</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-stone-800 mt-12 pt-8 text-center text-stone-500">
          <p>&copy; 2026 Dakar Logements & Tourisme. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};