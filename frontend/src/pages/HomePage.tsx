
import { useMemo, useState } from 'react';
import type { Logement } from '../types';
import { useFetch } from '../hooks/useFetch';
import LogementCard from '../components/LogementCard';

export default function HomePage() {
  const [search, setSearch] = useState('');
  const [categorieFilter, setCategorieFilter] = useState('');

  const { data: logements, loading, error } = useFetch<Logement[]>('/logements');

  const filteredLogements = useMemo(() => {
    if (!logements) return [];
    let filtered = logements;
    if (search) {
      const s = search.toLowerCase();
      filtered = filtered.filter(
        (l) => l.titre.toLowerCase().includes(s) || l.quartier.toLowerCase().includes(s)
      );
    }
    if (categorieFilter) filtered = filtered.filter((l) => l.categorie === categorieFilter);
    return filtered;
  }, [logements, search, categorieFilter]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="relative bg-cyan-500 text-white py-24 overflow-hidden">
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
        </div>

        {loading && (
          <div className="mt-16 flex justify-center">
            <div className="flex items-center gap-3 text-stone-500">
              <div className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
              Chargement des logements...
            </div>
          </div>
        )}

        {error && (
          <div className="mt-16 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-6 text-center">
            <p className="font-semibold">Impossible de charger les logements</p>
            <p className="text-sm mt-1 text-red-500">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <>
            <div className="mt-12 mb-6 text-stone-600">
              {filteredLogements.length} logement{filteredLogements.length > 1 ? 's' : ''} disponible{filteredLogements.length > 1 ? 's' : ''}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredLogements.map((logement) => (
                <LogementCard key={logement.id} logement={logement} />
              ))}
            </div>
            {filteredLogements.length === 0 && (
              <div className="text-center py-16 text-stone-500">
                Aucun logement ne correspond à votre recherche.
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
