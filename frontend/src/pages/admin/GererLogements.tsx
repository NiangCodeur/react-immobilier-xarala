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

const QUARTIERS = [
  'Almadies', 'Ngor', 'Plateau', 'Ouakam', 'Mermoz',
  'Sacré-Cœur', 'Fann', 'Liberté', 'Grand Dakar', 'Pikine',
];

const FORM_VIDE: LogementForm = {
  titre: '',
  description: '',
  quartier: 'Almadies',
  categorie: 'Appartement',
  prix: '',
  chambres: '1',
  sallesDeBain: '1',
  capacite: '2',
  superficie: '',
  images: '',
  equipements: '',
};

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';

export default function GererLogements() {
  const { data: logements, loading, error, refetch } = useFetch<Logement[]>('/logements');

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
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur lors de la création');
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
      // On retire (err) ici car il n'était pas utilisé ou causait une erreur
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
      // On retire (err) ici pour éviter l'erreur TS6133
      alert('Erreur lors de la mise à jour');
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight uppercase">Dashboard Admin</h1>
          <p className="text-stone-500 font-medium">
            Gestion immobilière <span className="text-cyan-600">AfroLab AI</span>
          </p>
        </div>
        <button
          onClick={() => { setShowForm(true); setSubmitError(null); }}
          className="flex items-center gap-2 bg-stone-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-cyan-600 transition-all shadow-xl active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un bien
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="flex items-center justify-between p-8 border-b border-stone-100">
              <h2 className="text-2xl font-black text-stone-900 uppercase">Nouveau bien</h2>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {submitError && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">{submitError}</div>}
                <div>
                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Titre du bien</label>
                    <input type="text" required value={formData.titre} onChange={(e) => set('titre', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-500 font-medium transition-all" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                       <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Quartier</label>
                       <select value={formData.quartier} onChange={(e) => set('quartier', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl font-medium">
                           {QUARTIERS.map(q => <option key={q} value={q}>{q}</option>)}
                       </select>
                   </div>
                   <div>
                       <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Prix (FCFA)</label>
                       <input type="number" value={formData.prix} onChange={(e) => set('prix', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl font-medium" />
                   </div>
                </div>

                <div>
                   <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Liens Images (un par ligne)</label>
                   <textarea rows={3} value={formData.images} onChange={(e) => set('images', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl font-mono text-xs" />
                </div>

                <div className="flex gap-4 pt-4">
                    <button type="submit" disabled={submitting} className="flex-1 bg-cyan-500 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-cyan-600 disabled:opacity-50">
                        {submitting ? 'Enregistrement...' : 'Valider'}
                    </button>
                    <button type="button" onClick={() => setShowForm(false)} className="flex-1 bg-stone-100 text-stone-500 py-4 rounded-2xl font-bold uppercase tracking-widest">Annuler</button>
                </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-2xl text-red-600 font-bold border border-red-100">Erreur : {error}</div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Bien Immobilier</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Quartier</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Prix / Nuit</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Statut</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logements?.map((logement) => {
                  const currentId = logement._id || (logement as any).id;
                  return (
                    <tr key={currentId} className="border-b border-stone-50 hover:bg-stone-50/50 transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <img
                            src={logement.images?.[0] || FALLBACK_IMAGE}
                            alt=""
                            className="w-14 h-12 object-cover rounded-xl shadow-sm"
                            onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                          />
                          <div>
                            <p className="font-bold text-stone-900 text-sm">{logement.titre}</p>
                            <p className="text-[10px] text-stone-400 font-bold uppercase">{logement.chambres} Ch. · {logement.capacite} Pers.</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-sm font-semibold text-stone-600">{logement.quartier}</td>
                      <td className="px-8 py-5 text-sm font-black text-stone-900">
                        {logement.prix.toLocaleString()} <span className="text-[10px] text-stone-400">FCFA</span>
                      </td>
                      <td className="px-8 py-5">
                        <button
                          onClick={() => handleToggleDisponible(logement)}
                          disabled={toggling === currentId}
                          className={`text-[10px] px-4 py-2 rounded-full font-black uppercase tracking-wider transition-all ${
                            logement.disponible
                              ? 'bg-green-100 text-green-700 hover:bg-green-200'
                              : 'bg-stone-100 text-stone-400'
                          }`}
                        >
                          {toggling === currentId ? '...' : logement.disponible ? 'Disponible' : 'Occupé'}
                        </button>
                      </td>
                      <td className="px-8 py-5">
                        <button
                          onClick={() => handleDelete(currentId, logement.titre)}
                          disabled={deleting === currentId}
                          className="text-[10px] px-4 py-2 rounded-xl bg-red-50 text-red-600 font-black uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all disabled:opacity-30"
                        >
                          {deleting === currentId ? '...' : 'Supprimer'}
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