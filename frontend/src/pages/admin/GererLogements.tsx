import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../lib/api';

interface Logement {
  _id: string;
  id?: string;
  titre: string;
  quartier: string;
  categorie: 'Appartement' | 'Maison' | 'Villa';
  prix: number;
  chambres: number;
  capacite: number;
  superficie: number;
  sallesDeBain: number;
  description: string;
  equipements: string[];
  images: string[];
  disponible: boolean;
}

interface LogementForm {
  titre: string;
  description: string;
  quartier: string;
  categorie: 'Appartement' | 'Maison' | 'Villa';
  prix: string;
  chambres: string;
  sallesDeBain: string;
  capacite: string;
  superficie: string;
  images: string;
  equipements: string;
}

const QUARTIERS = ['Almadies', 'Ngor', 'Plateau', 'Ouakam', 'Mermoz', 'Sacré-Cœur', 'Fann', 'Liberté', 'Grand Dakar', 'Pikine'];
const CATEGORIES = ['Appartement', 'Maison', 'Villa'];

const FORM_VIDE: LogementForm = {
  titre: '',
  description: '',
  quartier: 'Almadies',
  categorie: 'Appartement',
  prix: '',
  chambres: '1',
  sallesDeBain: '1',
  capacite: '1',
  superficie: '',
  images: '',
  equipements: 'WiFi, Climatisation, Cuisine équipée, TV, Parking',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';

export default function GererLogements() {
  // Suppression de 'error' ici pour éviter l'erreur TS6133 sur Netlify
  const { data: logements, loading, refetch } = useFetch<Logement[]>('/logements');

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<LogementForm>(FORM_VIDE);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const [deleting, setDeleting] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  const set = (field: keyof LogementForm, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post('/logements', {
        titre: formData.titre,
        description: formData.description,
        quartier: formData.quartier,
        categorie: formData.categorie,
        prix: Number(formData.prix),
        chambres: Number(formData.chambres),
        sallesDeBain: Number(formData.sallesDeBain),
        capacite: Number(formData.capacite),
        superficie: Number(formData.superficie),
        images: formData.images
          .split('\n')
          .map((s) => s.trim())
          .filter((s) => s.startsWith('http')),
        equipements: formData.equipements
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        disponible: true,
      });
      setFormData(FORM_VIDE);
      setShowForm(false);
      setTimeout(() => refetch(), 300);
    } catch (err: any) {
      setSubmitError(err.response?.data?.message || 'Données invalides. Vérifiez tous les champs.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/logements/${id}`);
      setTimeout(() => refetch(), 300);
    } catch {
      alert('Erreur lors de la suppression');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleDisponible = async (logement: Logement) => {
    const currentId = logement._id || logement.id;
    if (!currentId) return;
    
    setToggling(currentId);
    try {
      await api.put(`/logements/${currentId}`, { disponible: !logement.disponible });
      setTimeout(() => refetch(), 300);
    } catch {
      alert('Erreur lors de la mise à jour');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 pb-20">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight uppercase">Dashboard Admin</h1>
          <p className="text-stone-500 font-medium">
            Gestion immobilière <span className="text-cyan-600">Xarala</span>
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSubmitError(null); }}
          className="bg-stone-900 text-white px-8 py-4 rounded-2xl font-black hover:bg-cyan-600 transition-all shadow-xl active:scale-95"
        >
          + AJOUTER UN BIEN
        </button>
      </div>

      {/* Formulaire Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-stone-900/80 backdrop-blur-md z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl my-8 overflow-hidden">
            <div className="flex items-center justify-between p-8 border-b border-stone-100">
              <h2 className="text-2xl font-black text-stone-900 uppercase">Nouveau Logement</h2>
              <button onClick={() => setShowForm(false)} className="text-stone-400 hover:text-red-500 transition-colors">
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 space-y-6">
              {submitError && (
                <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">
                  {submitError}
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Titre du bien</label>
                    <input type="text" required value={formData.titre} onChange={(e) => set('titre', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-500 font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Description</label>
                    <textarea required rows={4} value={formData.description} onChange={(e) => set('description', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-500 font-medium" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Quartier</label>
                      <select value={formData.quartier} onChange={(e) => set('quartier', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl font-bold">
                        {QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Catégorie</label>
                      <select value={formData.categorie} onChange={(e) => set('categorie', e.target.value as any)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl font-bold">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Prix (FCFA / Nuit)</label>
                    <input type="number" required value={formData.prix} onChange={(e) => set('prix', e.target.value)} className="w-full px-5 py-4 bg-stone-100 border-none rounded-2xl font-black text-cyan-600 text-xl" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Équipements (virgules)</label>
                    <input type="text" value={formData.equipements} onChange={(e) => set('equipements', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl text-xs font-bold" />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-stone-50 rounded-[2rem]">
                {['chambres', 'sallesDeBain', 'capacite', 'superficie'].map((field) => (
                  <div key={field}>
                    <label className="block text-[9px] font-black text-stone-400 uppercase mb-2 text-center">{field === 'capacite' ? 'Pers.' : field}</label>
                    <input type="number" value={(formData as any)[field]} onChange={(e) => set(field as any, e.target.value)} className="w-full p-3 bg-white border-none rounded-xl font-bold text-center" />
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-[10px] font-black text-stone-400 uppercase tracking-widest mb-2">Liens Images (un par ligne)</label>
                <textarea rows={3} value={formData.images} onChange={(e) => set('images', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl font-mono text-[10px] mb-4" placeholder="https://..." />
                {formData.images.includes('http') && (
                  <div className="h-32 w-full rounded-2xl overflow-hidden border-2 border-dashed border-stone-200">
                    <img src={formData.images.split('\n')[0]} alt="Aperçu" className="w-full h-full object-cover" onError={(e) => e.currentTarget.src = FALLBACK_IMAGE} />
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="flex-1 bg-cyan-500 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-stone-900 transition-all disabled:opacity-50 shadow-lg">
                  {submitting ? 'TRAITEMENT...' : 'PUBLIER LE BIEN'}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="px-8 bg-stone-100 text-stone-400 py-5 rounded-2xl font-bold uppercase">ANNULER</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste des biens */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Logement</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Quartier</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Prix</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest">Disponibilité</th>
                  <th className="px-8 py-6 text-[10px] font-black text-stone-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {logements?.map((l) => {
                  const id = l._id || l.id || '';
                  return (
                    <tr key={id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img src={l.images[0] || FALLBACK_IMAGE} className="w-16 h-12 object-cover rounded-xl shadow-sm" alt="" />
                          <div>
                            <p className="font-bold text-stone-900 text-sm">{l.titre}</p>
                            <p className="text-[10px] text-stone-400 font-black uppercase">{l.chambres} CH · {l.capacite} PERS</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 font-bold text-stone-600 text-sm">{l.quartier}</td>
                      <td className="px-8 py-5 font-black text-stone-900">{l.prix.toLocaleString()} <span className="text-[10px] text-stone-400">FCFA</span></td>
                      <td className="px-8 py-5">
                        <button onClick={() => handleToggleDisponible(l)} disabled={toggling === id} className={`text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest transition-all ${l.disponible ? 'bg-green-100 text-green-700' : 'bg-red-50 text-red-400'}`}>
                          {toggling === id ? '...' : l.disponible ? 'Libre' : 'Occupé'}
                        </button>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button onClick={() => handleDelete(id, l.titre)} disabled={deleting === id} className="text-red-400 hover:text-red-600 p-2 transition-colors">
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}