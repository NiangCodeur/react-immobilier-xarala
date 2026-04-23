import { useFetch } from '../../hooks/useFetch';

interface Stats {
  logements: number;
  reservations: number;
  contacts: number;
}

interface Reservation {
  _id: string;
  nomComplet: string;
  email: string;
  dateDebut: string;
  statut: 'en_attente' | 'confirmee' | 'annulee';
  logement?: { titre: string; quartier: string };
}

interface Contact {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  objet: string;
  lu: boolean;
  createdAt: string;
}

const statutColors = {
  en_attente: 'bg-yellow-100 text-yellow-700',
  confirmee: 'bg-green-100 text-green-700',
  annulee: 'bg-red-100 text-red-700',
};

const statutLabels = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
};

export default function DashboardHome() {
  const { data: reservations } = useFetch<Reservation[]>('/reservations');
  const { data: contacts } = useFetch<Contact[]>('/contacts');
  const { data: logements } = useFetch<unknown[]>('/logements');

  const stats: Stats = {
    logements: logements?.length ?? 0,
    reservations: reservations?.length ?? 0,
    contacts: contacts?.length ?? 0,
  };

  const nonLus = contacts?.filter((c) => !c.lu).length ?? 0;
  const enAttente = reservations?.filter((r) => r.statut === 'en_attente').length ?? 0;

  const statCards = [
    {
      label: 'Logements',
      value: stats.logements,
      color: 'bg-cyan-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      label: 'Réservations',
      value: stats.reservations,
      badge: enAttente > 0 ? `${enAttente} en attente` : null,
      color: 'bg-violet-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
    },
    {
      label: 'Messages',
      value: stats.contacts,
      badge: nonLus > 0 ? `${nonLus} non lu${nonLus > 1 ? 's' : ''}` : null,
      color: 'bg-orange-500',
      icon: (
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Tableau de bord</h1>
        <p className="text-stone-500 mt-1">Vue d'ensemble de votre activité</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statCards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl p-6 shadow-sm border border-stone-100 flex items-center gap-4">
            <div className={`${card.color} w-12 h-12 rounded-xl flex items-center justify-center text-white flex-shrink-0`}>
              {card.icon}
            </div>
            <div>
              <p className="text-stone-500 text-sm">{card.label}</p>
              <p className="text-3xl font-bold text-stone-900">{card.value}</p>
              {card.badge && (
                <span className="text-xs text-orange-600 font-medium">{card.badge}</span>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Dernières réservations */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Dernières réservations</h2>
          {!reservations || reservations.length === 0 ? (
            <p className="text-stone-400 text-sm">Aucune réservation pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {reservations.slice(0, 5).map((r) => (
                <div key={r._id} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
                  <div>
                    <p className="font-semibold text-stone-800 text-sm">{r.nomComplet}</p>
                    <p className="text-xs text-stone-400">{r.logement?.titre ?? '—'}</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statutColors[r.statut]}`}>
                    {statutLabels[r.statut]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Derniers messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <h2 className="text-lg font-bold text-stone-900 mb-4">Derniers messages</h2>
          {!contacts || contacts.length === 0 ? (
            <p className="text-stone-400 text-sm">Aucun message pour l'instant.</p>
          ) : (
            <div className="space-y-3">
              {contacts.slice(0, 5).map((c) => (
                <div key={c._id} className="flex items-center justify-between py-3 border-b border-stone-50 last:border-0">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-stone-800 text-sm">{c.prenom} {c.nom}</p>
                      {!c.lu && <span className="w-2 h-2 rounded-full bg-orange-500" />}
                    </div>
                    <p className="text-xs text-stone-400 truncate max-w-[200px]">{c.objet}</p>
                  </div>
                  <p className="text-xs text-stone-400">
                    {new Date(c.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}