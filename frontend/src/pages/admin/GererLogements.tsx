// import { useState } from 'react';
// import { useFetch } from '../../hooks/useFetch';
// import { api } from '../../lib/api';

// interface Logement {
//   _id: string;
//   titre: string;
//   quartier: string;
//   categorie: 'Appartement' | 'Maison' | 'Villa';
//   prix: number;
//   chambres: number;
//   capacite: number;
//   superficie: number;
//   sallesDeBain: number;
//   description: string;
//   equipements: string[];
//   images: string[];
//   disponible: boolean;
// }

// interface LogementForm {
//   titre: string;
//   description: string;
//   quartier: string;
//   categorie: 'Appartement' | 'Maison' | 'Villa';
//   prix: string;
//   chambres: string;
//   sallesDeBain: string;
//   capacite: string;
//   superficie: string;
//   images: string;
//   equipements: string;
// }

// const QUARTIERS = [
//   'Almadies', 'Ngor', 'Plateau', 'Ouakam', 'Mermoz',
//   'Sacré-Cœur', 'Fann', 'Liberté', 'Grand Dakar', 'Pikine',
// ];

// const FORM_VIDE: LogementForm = {
//   titre: '',
//   description: '',
//   quartier: 'Almadies',
//   categorie: 'Appartement',
//   prix: '',
//   chambres: '1',
//   sallesDeBain: '1',
//   capacite: '2',
//   superficie: '',
//   images: '',
//   equipements: '',
// };

// const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';

// export default function GererLogements() {
//   const { data: logements, loading, error, refetch } = useFetch<Logement[]>('/logements');

//   const [showForm, setShowForm] = useState(false);
//   const [formData, setFormData] = useState<LogementForm>(FORM_VIDE);
//   const [submitting, setSubmitting] = useState(false);
//   const [submitError, setSubmitError] = useState<string | null>(null);

//   const [deleting, setDeleting] = useState<string | null>(null);
//   const [toggling, setToggling] = useState<string | null>(null);

//   const set = (field: keyof LogementForm, value: string) =>
//     setFormData((prev) => ({ ...prev, [field]: value }));

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);
//     setSubmitError(null);
//     try {
//       await api.post('/logements', {
//         titre: formData.titre,
//         description: formData.description,
//         quartier: formData.quartier,
//         categorie: formData.categorie,
//         prix: Number(formData.prix),
//         chambres: Number(formData.chambres),
//         sallesDeBain: Number(formData.sallesDeBain),
//         capacite: Number(formData.capacite),
//         superficie: Number(formData.superficie),
//         // Fix cause 1 — filtre les URLs invalides
//         images: formData.images
//           .split('\n')
//           .map((s) => s.trim())
//           .filter((s) => s.startsWith('http')),
//         equipements: formData.equipements
//           .split(',')
//           .map((s) => s.trim())
//           .filter(Boolean),
//         disponible: true,
//       });
//       setFormData(FORM_VIDE);
//       setShowForm(false);
//       // Fix cause 3 — laisse MongoDB confirmer avant refetch
//       setTimeout(() => refetch(), 300);
//     } catch (err: unknown) {
//       setSubmitError(err instanceof Error ? err.message : 'Erreur lors de la création');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleDelete = async (id: string, titre: string) => {
//     if (!confirm(`Supprimer "${titre}" ?`)) return;
//     setDeleting(id);
//     try {
//       await api.delete(`/logements/${id}`);
//       setTimeout(() => refetch(), 300);
//     } catch {
//       alert('Erreur lors de la suppression');
//     } finally {
//       setDeleting(null);
//     }
//   };

//   const handleToggleDisponible = async (logement: Logement) => {
//     setToggling(logement._id);
//     try {
//       await api.put(`/logements/${logement._id}`, { disponible: !logement.disponible });
//       setTimeout(() => refetch(), 300);
//     } catch {
//       alert('Erreur lors de la mise à jour');
//     } finally {
//       setToggling(null);
//     }
//   };

//   return (
//     <div>
//       {/* Header */}
//       <div className="flex items-center justify-between mb-8">
//         <div>
//           <h1 className="text-2xl font-bold text-stone-900">Logements</h1>
//           <p className="text-stone-500 mt-1">
//             {logements?.length ?? 0} logement{(logements?.length ?? 0) > 1 ? 's' : ''} au total
//           </p>
//         </div>
//         <button
//           onClick={() => { setShowForm(true); setSubmitError(null); }}
//           className="flex items-center gap-2 bg-cyan-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:bg-cyan-600 transition-all shadow-lg"
//         >
//           <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
//           </svg>
//           Ajouter un logement
//         </button>
//       </div>

//       {/* Modal formulaire */}
//       {showForm && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center p-4 overflow-y-auto">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl my-8">

//             <div className="flex items-center justify-between p-6 border-b border-stone-100">
//               <h2 className="text-xl font-bold text-stone-900">Nouveau logement</h2>
//               <button
//                 onClick={() => setShowForm(false)}
//                 className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-stone-100 text-stone-500 transition-colors"
//               >
//                 <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6 space-y-5">
//               {submitError && (
//                 <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm font-medium">
//                   {submitError}
//                 </div>
//               )}

//               <div>
//                 <label className="block text-sm font-semibold text-stone-700 mb-2">Titre *</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.titre}
//                   onChange={(e) => set('titre', e.target.value)}
//                   placeholder="Ex: Villa moderne avec piscine aux Almadies"
//                   className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-stone-700 mb-2">Description *</label>
//                 <textarea
//                   required
//                   rows={3}
//                   value={formData.description}
//                   onChange={(e) => set('description', e.target.value)}
//                   placeholder="Décrivez le logement..."
//                   className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors resize-none"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-2">Quartier *</label>
//                   <select
//                     required
//                     value={formData.quartier}
//                     onChange={(e) => set('quartier', e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                   >
//                     {QUARTIERS.map((q) => <option key={q} value={q}>{q}</option>)}
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-2">Catégorie *</label>
//                   <select
//                     required
//                     value={formData.categorie}
//                     onChange={(e) => set('categorie', e.target.value as LogementForm['categorie'])}
//                     className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                   >
//                     <option value="Appartement">Appartement</option>
//                     <option value="Maison">Maison</option>
//                     <option value="Villa">Villa</option>
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-2">Prix / nuit (FCFA) *</label>
//                   <input
//                     type="number"
//                     required
//                     min={0}
//                     value={formData.prix}
//                     onChange={(e) => set('prix', e.target.value)}
//                     placeholder="Ex: 35000"
//                     className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-2">Superficie (m²) *</label>
//                   <input
//                     type="number"
//                     required
//                     min={0}
//                     value={formData.superficie}
//                     onChange={(e) => set('superficie', e.target.value)}
//                     placeholder="Ex: 85"
//                     className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-2">Chambres *</label>
//                   <input
//                     type="number"
//                     required
//                     min={1}
//                     value={formData.chambres}
//                     onChange={(e) => set('chambres', e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-2">Salles de bain *</label>
//                   <input
//                     type="number"
//                     required
//                     min={1}
//                     value={formData.sallesDeBain}
//                     onChange={(e) => set('sallesDeBain', e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-semibold text-stone-700 mb-2">Capacité (pers.) *</label>
//                   <input
//                     type="number"
//                     required
//                     min={1}
//                     value={formData.capacite}
//                     onChange={(e) => set('capacite', e.target.value)}
//                     className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-stone-700 mb-2">
//                   URLs des images *
//                   <span className="text-stone-400 font-normal ml-1">(une par ligne)</span>
//                 </label>
//                 <textarea
//                   required
//                   rows={3}
//                   value={formData.images}
//                   onChange={(e) => set('images', e.target.value)}
//                   placeholder={`https://images.unsplash.com/photo-xxx?w=800\nhttps://images.unsplash.com/photo-yyy?w=800`}
//                   className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors font-mono text-sm resize-none"
//                 />
//                 {/* Fix cause 2 — aperçu image en temps réel */}
//                 {formData.images.split('\n').filter((s) => s.trim().startsWith('http')).length > 0 && (
//                   <div className="mt-2 flex gap-2 flex-wrap">
//                     {formData.images
//                       .split('\n')
//                       .map((s) => s.trim())
//                       .filter((s) => s.startsWith('http'))
//                       .slice(0, 3)
//                       .map((url, i) => (
//                         <img
//                           key={i}
//                           src={url}
//                           alt={`aperçu ${i + 1}`}
//                           className="w-20 h-16 object-cover rounded-lg border-2 border-stone-200"
//                           onError={(e) => {
//                             e.currentTarget.src = FALLBACK_IMAGE;
//                             e.currentTarget.classList.add('opacity-50');
//                           }}
//                         />
//                       ))}
//                   </div>
//                 )}
//               </div>

//               <div>
//                 <label className="block text-sm font-semibold text-stone-700 mb-2">
//                   Équipements
//                   <span className="text-stone-400 font-normal ml-1">(séparés par des virgules)</span>
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.equipements}
//                   onChange={(e) => set('equipements', e.target.value)}
//                   placeholder="WiFi, Climatisation, Piscine, Parking..."
//                   className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
//                 />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="flex-1 bg-cyan-500 text-white py-3 rounded-xl font-bold hover:bg-cyan-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
//                 >
//                   {submitting ? (
//                     <span className="flex items-center justify-center gap-2">
//                       <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                       Enregistrement...
//                     </span>
//                   ) : 'Enregistrer'}
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => setShowForm(false)}
//                   className="flex-1 bg-stone-100 text-stone-700 py-3 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
//                 >
//                   Annuler
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {loading && (
//         <div className="flex justify-center py-16">
//           <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
//         </div>
//       )}

//       {error && (
//         <div className="bg-red-50 border-2 border-red-200 text-red-700 rounded-xl p-6">
//           Impossible de charger les logements : {error}
//         </div>
//       )}

//       {!loading && !error && logements && (
//         <div className="bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead>
//                 <tr className="border-b border-stone-100 bg-stone-50">
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Logement</th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Quartier</th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Catégorie</th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Prix / nuit</th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Statut</th>
//                   <th className="text-left px-6 py-4 text-sm font-semibold text-stone-600">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {logements.length === 0 && (
//                   <tr>
//                     <td colSpan={6} className="px-6 py-12 text-center text-stone-400">
//                       Aucun logement. Cliquez sur "Ajouter un logement" pour commencer.
//                     </td>
//                   </tr>
//                 )}
//                 {logements.map((logement) => (
//                   <tr key={logement._id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
//                     {/* Fix cause 2 — miniature avec fallback dans la table */}
//                     <td className="px-6 py-4">
//                       <div className="flex items-center gap-3">
//                         <img
//                           src={logement.images?.[0]}
//                           alt={logement.titre}
//                           className="w-12 h-10 object-cover rounded-lg flex-shrink-0"
//                           onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
//                         />
//                         <div>
//                           <p className="font-semibold text-stone-900 text-sm line-clamp-1">{logement.titre}</p>
//                           <p className="text-xs text-stone-400">{logement.chambres} ch. · {logement.capacite} pers.</p>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 text-sm text-stone-600">{logement.quartier}</td>
//                     <td className="px-6 py-4">
//                       <span className="text-xs px-2 py-1 rounded-full bg-cyan-100 text-cyan-700 font-medium">
//                         {logement.categorie}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 text-sm font-semibold text-stone-900">
//                       {logement.prix.toLocaleString()} FCFA
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => handleToggleDisponible(logement)}
//                         disabled={toggling === logement._id}
//                         className={`text-xs px-3 py-1.5 rounded-full font-medium transition-all ${
//                           logement.disponible
//                             ? 'bg-green-100 text-green-700 hover:bg-green-200'
//                             : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
//                         }`}
//                       >
//                         {toggling === logement._id ? '...' : logement.disponible ? 'Disponible' : 'Indisponible'}
//                       </button>
//                     </td>
//                     <td className="px-6 py-4">
//                       <button
//                         onClick={() => handleDelete(logement._id, logement.titre)}
//                         disabled={deleting === logement._id}
//                         className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-all disabled:opacity-50"
//                       >
//                         {deleting === logement._id ? '...' : 'Supprimer'}
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

import { useState } from 'react';
import { useFetch } from '../../hooks/useFetch';
import { api } from '../../lib/api';

interface Logement {
  _id: string;
  id?: string; // Ajout de la compatibilité pour l'ID normalisé
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

  // --- FIX SUPPRESSION ---
  const handleDelete = async (id: string, titre: string) => {
    if (!confirm(`Supprimer "${titre}" ?`)) return;
    setDeleting(id);
    try {
      await api.delete(`/logements/${id}`);
      setTimeout(() => refetch(), 300);
    } catch (err: any) {
      // On affiche l'erreur réelle pour mieux comprendre
      alert('Erreur lors de la suppression : ' + (err.message || 'Erreur inconnue'));
    } finally {
      setDeleting(null);
    }
  };

  // --- FIX DISPONIBILITÉ ---
  const handleToggleDisponible = async (logement: Logement) => {
    const currentId = logement._id || logement.id; // Sécurité ID
    if (!currentId) return;
    
    setToggling(currentId);
    try {
      await api.put(`/logements/${currentId}`, { disponible: !logement.disponible });
      setTimeout(() => refetch(), 300);
    } catch (err: any) {
      alert('Erreur lors de la mise à jour : ' + (err.message || 'Erreur inconnue'));
    } finally {
      setToggling(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-stone-900 tracking-tight">DASHBOARD ADMIN</h1>
          <p className="text-stone-500 font-medium">
            Gestion du parc immobilier <span className="text-cyan-600">AfroLab AI</span>
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

      {/* Modal formulaire (inchangé mais inclus pour la cohérence) */}
      {showForm && (
        <div className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-start justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl my-8 overflow-hidden">
            <div className="flex items-center justify-between p-8 border-b border-stone-100">
              <h2 className="text-2xl font-black text-stone-900 uppercase">Nouveau bien</h2>
              <button onClick={() => setShowForm(false)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-stone-100 text-stone-400">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            {/* ... reste du formulaire (formData etc) ... */}
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                {submitError && <div className="p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100">{submitError}</div>}
                <div>
                    <label className="block text-xs font-black text-stone-400 uppercase tracking-widest mb-2">Titre du bien</label>
                    <input type="text" required value={formData.titre} onChange={(e) => set('titre', e.target.value)} className="w-full px-5 py-4 bg-stone-50 border-none rounded-2xl focus:ring-2 focus:ring-cyan-500 font-medium transition-all" />
                </div>
                {/* [Les autres champs du formulaire ici] */}
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
                {/* [Textarea Images] */}
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

      {/* --- TABLE DES LOGEMENTS --- */}
      {loading ? (
        <div className="flex justify-center py-20"><div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" /></div>
      ) : (
        <div className="bg-white rounded-[2rem] shadow-xl border border-stone-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Bien Immobilier</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Quartier</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Catégorie</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Prix / Nuit</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Statut</th>
                  <th className="text-left px-8 py-5 text-[10px] font-black text-stone-400 uppercase tracking-[0.2em]">Actions</th>
                </tr>
              </thead>
              <tbody>
                {logements?.map((logement) => {
                  const currentId = logement._id || (logement as any).id; // PROTECTION ID
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
                      <td className="px-8 py-5">
                        <span className="text-[10px] px-3 py-1 rounded-full bg-cyan-50 text-cyan-700 font-black uppercase">
                          {logement.categorie}
                        </span>
                      </td>
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