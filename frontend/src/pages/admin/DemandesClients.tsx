import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../lib/api';

interface Reservation {
  _id: string;
  nomComplet: string;
  email: string;
  telephone: string;
  dateDebut: string;
  dateFin: string;
  nombrePersonnes: number;
  message?: string;
  statut: 'en_attente' | 'confirmee' | 'annulee';
  logement?: { titre: string; quartier: string; prix: number };
  createdAt: string;
}

interface Contact {
  _id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  objet: string;
  message: string;
  lu: boolean;
  createdAt: string;
}

const statutColors = {
  en_attente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  confirmee: 'bg-green-100 text-green-700 border-green-200',
  annulee: 'bg-red-100 text-red-700 border-red-200',
};

const statutLabels = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  annulee: 'Annulée',
};

export default function DemandesClients() {
  const [tab, setTab] = useState<'reservations' | 'contacts'>('reservations');

  const { data: reservations, loading: loadingRes, refetch: refetchRes } = useFetch<Reservation[]>('/reservations');
  const { data: contacts, loading: loadingCon, refetch: refetchCon } = useFetch<Contact[]>('/contacts');

  const [updatingStatut, setUpdatingStatut] = useState<string | null>(null);
  const [markingLu, setMarkingLu] = useState<string | null>(null);

  const handleStatut = async (id: string, statut: string) => {
    setUpdatingStatut(id);
    try {
      await api.patch(`/reservations/${id}/statut`, { statut });
      refetchRes();
    } catch {
      alert('Erreur lors de la mise à jour');
    } finally {
      setUpdatingStatut(null);
    }
  };

  const handleMarquerLu = async (id: string) => {
    setMarkingLu(id);
    try {
      await api.patch(`/contacts/${id}/lu`, {});
      refetchCon();
    } catch {
      alert('Erreur');
    } finally {
      setMarkingLu(null);
    }
  };

  const nonLus = contacts?.filter((c) => !c.lu).length ?? 0;
  const enAttente = reservations?.filter((r) => r.statut === 'en_attente').length ?? 0;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-900">Demandes clients</h1>
        <p className="text-stone-500 mt-1">Gérez les réservations et messages reçus</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('reservations')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            tab === 'reservations'
              ? 'bg-cyan-500 text-white shadow-lg'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-cyan-300'
          }`}
        >
          Réservations
          {enAttente > 0 && (
            <span className="bg-yellow-400 text-yellow-900 text-xs px-1.5 py-0.5 rounded-full font-bold">
              {enAttente}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('contacts')}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
            tab === 'contacts'
              ? 'bg-cyan-500 text-white shadow-lg'
              : 'bg-white text-stone-600 border border-stone-200 hover:border-cyan-300'
          }`}
        >
          Messages
          {nonLus > 0 && (
            <span className="bg-orange-400 text-white text-xs px-1.5 py-0.5 rounded-full font-bold">
              {nonLus}
            </span>
          )}
        </button>
      </div>

      {/* Réservations */}
      {tab === 'reservations' && (
        <div>
          {loadingRes && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loadingRes && (!reservations || reservations.length === 0) && (
            <div className="bg-white rounded-2xl p-12 text-center text-stone-400 border border-stone-100">
              Aucune réservation pour l'instant.
            </div>
          )}
          {!loadingRes && reservations && reservations.length > 0 && (
            <div className="space-y-4">
              {reservations.map((r) => (
                <div key={r._id} className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-bold text-stone-900">{r.nomComplet}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border font-medium ${statutColors[r.statut]}`}>
                          {statutLabels[r.statut]}
                        </span>
                      </div>
                      <p className="text-sm text-stone-500 mb-1">{r.email} · {r.telephone}</p>
                      {r.logement && (
                        <p className="text-sm font-medium text-cyan-600 mb-2">
                          {r.logement.titre} — {r.logement.prix?.toLocaleString()} FCFA/nuit
                        </p>
                      )}
                      <div className="flex flex-wrap gap-4 text-sm text-stone-600">
                        <span>📅 Du {new Date(r.dateDebut).toLocaleDateString('fr-FR')} au {new Date(r.dateFin).toLocaleDateString('fr-FR')}</span>
                        <span>👥 {r.nombrePersonnes} personne{r.nombrePersonnes > 1 ? 's' : ''}</span>
                      </div>
                      {r.message && (
                        <p className="mt-3 text-sm text-stone-600 bg-stone-50 rounded-lg p-3 italic">
                          "{r.message}"
                        </p>
                      )}
                    </div>

                    {/* Actions statut */}
                    <div className="flex flex-col gap-2 min-w-[140px]">
                      {r.statut !== 'confirmee' && (
                        <button
                          onClick={() => handleStatut(r._id, 'confirmee')}
                          disabled={updatingStatut === r._id}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl text-sm font-semibold hover:bg-green-600 transition-all disabled:opacity-50"
                        >
                          ✓ Confirmer
                        </button>
                      )}
                      {r.statut !== 'annulee' && (
                        <button
                          onClick={() => handleStatut(r._id, 'annulee')}
                          disabled={updatingStatut === r._id}
                          className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all disabled:opacity-50"
                        >
                          ✕ Annuler
                        </button>
                      )}
                      {r.statut !== 'en_attente' && (
                        <button
                          onClick={() => handleStatut(r._id, 'en_attente')}
                          disabled={updatingStatut === r._id}
                          className="px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-200 transition-all disabled:opacity-50"
                        >
                          Remettre en attente
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Messages contact */}
      {tab === 'contacts' && (
        <div>
          {loadingCon && (
            <div className="flex justify-center py-16">
              <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {!loadingCon && (!contacts || contacts.length === 0) && (
            <div className="bg-white rounded-2xl p-12 text-center text-stone-400 border border-stone-100">
              Aucun message pour l'instant.
            </div>
          )}
          {!loadingCon && contacts && contacts.length > 0 && (
            <div className="space-y-4">
              {contacts.map((c) => (
                <div key={c._id} className={`bg-white rounded-2xl shadow-sm border p-6 transition-all ${!c.lu ? 'border-orange-200' : 'border-stone-100'}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-stone-900">{c.prenom} {c.nom}</h3>
                        {!c.lu && <span className="w-2 h-2 rounded-full bg-orange-500 flex-shrink-0" />}
                      </div>
                      <p className="text-sm text-stone-500 mb-2">{c.email} · {c.telephone}</p>
                      <p className="text-sm font-semibold text-stone-700 mb-2">Objet : {c.objet}</p>
                      <p className="text-sm text-stone-600 bg-stone-50 rounded-lg p-3">{c.message}</p>
                      <p className="text-xs text-stone-400 mt-2">
                        {new Date(c.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                      </p>
                    </div>
                    {!c.lu && (
                      <button
                        onClick={() => handleMarquerLu(c._id)}
                        disabled={markingLu === c._id}
                        className="flex-shrink-0 px-4 py-2 bg-stone-100 text-stone-600 rounded-xl text-sm font-medium hover:bg-stone-200 transition-all disabled:opacity-50"
                      >
                        {markingLu === c._id ? '...' : 'Marquer lu'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}