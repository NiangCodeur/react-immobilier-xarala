 import { useMemo, useState } from 'react';
import type { Logement } from '../types';
import { LOGEMENTS } from '../data/mockData';
import LogementCard from '../components/LogementCard';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('');

  // ✅ fiterLogements calculé à partir de LOGEMENTS, search et categorieFilter
  const filteredLogements = useMemo(() => {
    let filtered: Logement[] = LOGEMENTS;

    if (search) { 
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(l =>
        l.titre.toLowerCase().includes(searchLower) ||
        l.quartier.toLowerCase().includes(searchLower)
      );
    }
    if (categorieFilter) {
      filtered = filtered.filter(l => l.categorie === categorieFilter);
    }
    return filtered;
  }, [search, categorieFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="relative bg-cyan-500 text-white py-24 overflow-hidden">
        {/* <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div> */}
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
            Votre logement à Dakar
          </h1>
          <p className="text-xl text-cyan-100 max-w-2xl">
            Découvrez des espaces uniques dans les quartiers les plus recherchés de la capitale
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8 -mt-16 relative z-10 border border-stone-100">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <input
                type="text"
                placeholder="Rechercher un logement..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // ✅ onKeyPress supprimé — le filtre est déjà temps réel via useMemo
                className="w-full px-6 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-stone-900 placeholder-stone-400"
              />
            </div>
            <select
              value={categorieFilter}
              onChange={(e) => setCategorieFilter(e.target.value)}
              className="px-6 py-4 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors text-stone-900"
            >
              <option value="">Toutes catégories</option>
              <option value="Appartement">Appartement</option>
              <option value="Maison">Maison</option>
              <option value="Villa">Villa</option>
            </select>
          </div>
          {/* ✅ Bouton supprimé — le filtre est instantané, il ne sert plus à rien */}
        </div>

        {/* ✅ filteredLogements au lieu de logements */}
        <div className="mt-12 mb-6 text-stone-600">
          {filteredLogements.length} logement{filteredLogements.length > 1 ? 's' : ''} disponible{filteredLogements.length > 1 ? 's' : ''}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLogements.map(logement => (
            <LogementCard key={logement.id} logement={logement} />
          ))}
        </div>
      </div>
    </div>
  );
}

