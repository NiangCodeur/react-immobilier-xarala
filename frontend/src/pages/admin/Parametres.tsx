import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authApi } from '../../lib/api';

export default function Parametres() {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [motDePasseActuel, setMotDePasseActuel] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [statut, setStatut] = useState({ type: '', message: '' });

  const gererSoumission = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatut({ type: '', message: '' });

    try {
      await authApi.updateProfil({
        email,
        motDePasseActuel,
        nouveauMotDePasse: nouveauMotDePasse || undefined
      });
      setStatut({ type: 'success', message: 'Tes accès ont été mis à jour, Zébulon !' });
      setMotDePasseActuel('');
      setNouveauMotDePasse('');
    } catch (err: any) {
      setStatut({ type: 'error', message: err.response?.data?.message || 'Une erreur est survenue' });
    }
  };

  return (
    <div className="max-w-2xl bg-white p-8 rounded-3xl shadow-sm border border-stone-100">
      <h1 className="text-2xl font-black mb-2 text-stone-900">Paramètres du compte</h1>
      <p className="text-stone-500 mb-8 text-sm">Gère tes identifiants de connexion AfroLab AI.</p>

      {statut.message && (
        <div className={`p-4 rounded-xl mb-6 font-bold text-sm ${statut.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {statut.message}
        </div>
      )}

      <form onSubmit={gererSoumission} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-stone-700 mb-2">Adresse Email</label>
          <input 
            type="email" 
            className="w-full p-4 border-2 border-stone-100 rounded-2xl focus:border-orange-500 outline-none transition-all"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-stone-50">
          <label className="block text-sm font-bold text-stone-700 mb-2">Nouveau mot de passe (optionnel)</label>
          <input 
            type="password" 
            className="w-full p-4 border-2 border-stone-100 rounded-2xl focus:border-orange-500 outline-none transition-all"
            placeholder="Laisse vide pour ne pas changer"
            value={nouveauMotDePasse}
            onChange={(e) => setNouveauMotDePasse(e.target.value)}
          />
        </div>

        <div className="pt-4 border-t border-stone-50 bg-orange-50/30 p-4 rounded-2xl">
          <label className="block text-sm font-bold text-orange-800 mb-2">Confirmation requise</label>
          <p className="text-xs text-orange-600 mb-3">Saisis ton mot de passe actuel pour valider les changements.</p>
          <input 
            type="password" 
            required
            className="w-full p-4 border-2 border-orange-100 rounded-2xl focus:border-orange-500 outline-none transition-all"
            placeholder="Ton mot de passe actuel"
            value={motDePasseActuel}
            onChange={(e) => setMotDePasseActuel(e.target.value)}
          />
        </div>

        <button type="submit" className="w-full bg-stone-900 text-white p-4 rounded-2xl font-bold hover:bg-black transition-all shadow-lg">
          Enregistrer les modifications
        </button>
      </form>
    </div>
  );
}