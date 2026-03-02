import { Link } from 'react-router-dom';
import type { Logement } from '../types';

    export default function LogementCard({ logement }: { logement: Logement }) {
  return (
    <Link 
      to={`/logement/${logement.id}`}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 border border-stone-100"
    >
      <div className="relative h-64 overflow-hidden">
        <img
          src={logement.images[0]}
          alt={logement.titre}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-semibold text-stone-800">
          {logement.categorie}
        </div>
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-stone-900 mb-2 group-hover:text-cyan-500 transition-colors line-clamp-2">
          {logement.titre}
        </h3>
        <div className="flex items-center text-stone-500 mb-4 text-sm">
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          </svg>
          {logement.quartier}
        </div>
        <div className="flex items-center gap-4 text-sm text-stone-600 mb-5 pb-5 border-b border-stone-100">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {logement.capacite} personnes.
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            {logement.chambres} chambres.
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-stone-900">{logement.prix.toLocaleString()}</span>
          <span className="text-stone-600 text-sm">FCFA / nuit</span>
        </div>
      </div>
    </Link>
  );
};