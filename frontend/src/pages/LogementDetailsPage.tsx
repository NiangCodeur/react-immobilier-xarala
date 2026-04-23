

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { FormDataReservation } from '../types';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';
import { FaLocationDot } from 'react-icons/fa6';
import { IoMdCheckmark } from 'react-icons/io';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800';

interface LogementApi {
  _id: string;
  titre: string;
  quartier: string;
  categorie: string;
  prix: number;
  description: string;
  equipements: string[];
  images: string[];
  capacite: number;
  chambres: number;
  sallesDeBain: number;
  superficie: number;
}

export default function LogementDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [currentImage, setCurrentImage] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormDataReservation>({
    nomComplet: '', email: '', telephone: '',
    dateDebut: '', dateFin: '', nombrePersonnes: 1, message: '',
  });

  const { data: logement, loading, error } = useFetch<LogementApi>(`/logements/${id}`);

  const images = logement?.images?.length ? logement.images : [FALLBACK_IMAGE];
  const total = images.length;

  const prev = useCallback(() => {
    setCurrentImage((p) => (p === 0 ? total - 1 : p - 1));
    setIsAutoPlaying(false);
  }, [total]);

  const next = useCallback(() => {
    setCurrentImage((p) => (p === total - 1 ? 0 : p + 1));
    setIsAutoPlaying(false);
  }, [total]);

  const goTo = (i: number) => {
    setCurrentImage(i);
    setIsAutoPlaying(false);
  };

  // Autoplay toutes les 4s
  useEffect(() => {
    if (!isAutoPlaying || total <= 1) return;
    const timer = setInterval(() => {
      setCurrentImage((p) => (p === total - 1 ? 0 : p + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [isAutoPlaying, total]);

  // Clavier ← →
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [prev, next]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logement) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      await api.post('/reservations', { ...formData, logement: logement._id });
      setSuccess(true);
      setFormData({ nomComplet: '', email: '', telephone: '', dateDebut: '', dateFin: '', nombrePersonnes: 1, message: '' });
      setTimeout(() => { setSuccess(false); setShowForm(false); }, 3000);
    } catch (err: unknown) {
      setSubmitError(err instanceof Error ? err.message : 'Erreur lors de la réservation');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !logement) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Logement non trouvé</h1>
          <Link to="/" className="text-cyan-500 hover:text-cyan-600 font-medium">Retour aux logements</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Retour */}
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-cyan-500 hover:text-cyan-600 font-medium transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        {/* ═══════════════ SLIDER ═══════════════ */}
        <div className="bg-white rounded-2xl overflow-hidden shadow-xl mb-8">

          {/* Image principale */}
          <div className="relative h-[480px] bg-stone-900 group">
            {images.map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${logement.titre} — photo ${i + 1}`}
                onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                className={`absolute inset-0 w-full h-full object-cover transition-all duration-700 ${
                  i === currentImage
                    ? 'opacity-100 scale-100'
                    : 'opacity-0 scale-105 pointer-events-none'
                }`}
              />
            ))}

            {/* Overlay gradient bas */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />

            {/* Compteur */}
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
              {currentImage + 1} / {total}
            </div>

            {/* Bouton autoplay */}
            {total > 1 && (
              <button
                onClick={() => setIsAutoPlaying((p) => !p)}
                className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white p-2 rounded-full hover:bg-black/70 transition-all"
                title={isAutoPlaying ? 'Pause' : 'Lecture auto'}
              >
                {isAutoPlaying ? (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>
            )}

            {/* Flèches */}
            {total > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white backdrop-blur-sm hover:bg-white/90 text-cyan-500 hover:text-stone-900 p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white backdrop-blur-sm hover:bg-white/90 text-cyan-500 hover:text-stone-900 p-3 rounded-full transition-all duration-200 opacity-0 group-hover:opacity-100"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Dots */}
            {total > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className={`rounded-full transition-all duration-300 ${
                      i === currentImage
                        ? 'bg-white w-8 h-2.5'
                        : 'bg-white/50 hover:bg-white/80 w-2.5 h-2.5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Thumbnails */}
          {total > 1 && (
            <div className="flex gap-2 p-3 bg-stone-50 overflow-x-auto scrollbar-hide">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`flex-shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                    i === currentImage
                      ? 'border-cyan-500 opacity-100 scale-105'
                      : 'border-transparent opacity-60 hover:opacity-90'
                  }`}
                >
                  <img
                    src={src}
                    alt={`miniature ${i + 1}`}
                    onError={(e) => { e.currentTarget.src = FALLBACK_IMAGE; }}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>
        {/* ═══════════════ FIN SLIDER ═══════════════ */}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Infos */}
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg p-8">
            <div className="flex justify-between items-start mb-6 pb-6 border-b border-stone-200">
              <div>
                <h1 className="text-4xl font-bold text-stone-900 mb-2">{logement.titre}</h1>
                <div className="flex items-center text-stone-600">
                  <FaLocationDot className="w-5 h-5 mr-2 text-cyan-500" />
                  {logement.quartier}
                </div>
              </div>
              <div className="text-right">
                <div className="text-4xl font-bold text-cyan-500">
                  {logement.prix.toLocaleString()}
                </div>
                <div className="text-stone-600 text-sm">FCFA / nuit</div>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-6 py-6 mb-6 border-b border-stone-200">
              {[
                { label: 'Personnes', value: logement.capacite },
                { label: 'Chambres', value: logement.chambres },
                { label: 'Salles de bain', value: logement.sallesDeBain },
                { label: 'm²', value: logement.superficie },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-stone-900">{stat.value}</div>
                  <div className="text-sm text-stone-600 mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Description</h2>
              <p className="text-stone-700 leading-relaxed">{logement.description}</p>
            </div>

            {logement.equipements?.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold text-stone-900 mb-4">Équipements</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {logement.equipements.map((eq, i) => (
                    <div key={i} className="flex items-center text-stone-700">
                      <IoMdCheckmark className="w-5 h-5 mr-3 text-cyan-500 flex-shrink-0" />
                      {eq}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Réservation */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              {!showForm ? (
                <button
                  onClick={() => setShowForm(true)}
                  className="w-full bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-600 transition-all shadow-lg"
                >
                  Réserver maintenant
                </button>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-stone-900 mb-6">Réservation</h3>
                  {success && (
                    <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 font-medium">
                      Demande envoyée avec succès !
                    </div>
                  )}
                  {submitError && (
                    <div className="bg-red-100 border-2 border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6 font-medium">
                      {submitError}
                    </div>
                  )}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { label: 'Nom complet *', type: 'text', field: 'nomComplet' as keyof FormDataReservation },
                      { label: 'Email *', type: 'email', field: 'email' as keyof FormDataReservation },
                      { label: 'Téléphone *', type: 'tel', field: 'telephone' as keyof FormDataReservation },
                      { label: 'Date début *', type: 'date', field: 'dateDebut' as keyof FormDataReservation },
                      { label: 'Date fin', type: 'date', field: 'dateFin' as keyof FormDataReservation },
                      { label: 'Nombre de personnes *', type: 'number', field: 'nombrePersonnes' as keyof FormDataReservation, min: 1, max: logement.capacite },
                    ].map((input, i) => (
                      <div key={i}>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">{input.label}</label>
                        <input
                          type={input.type}
                          required={input.label.includes('*')}
                          value={formData[input.field]}
                          onChange={(e) => setFormData({
                            ...formData,
                            [input.field]: input.type === 'number' ? parseInt(e.target.value) || 1 : e.target.value,
                          })}
                          min={input.min}
                          max={input.max}
                          className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                        />
                      </div>
                    ))}
                    <div>
                      <label className="block text-sm font-semibold text-stone-700 mb-2">Message</label>
                      <textarea
                        rows={3}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors"
                        placeholder="Questions ou demandes..."
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-all disabled:opacity-60"
                    >
                      {submitting ? 'Envoi en cours...' : 'Envoyer'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="w-full bg-stone-100 text-stone-700 px-6 py-3 rounded-xl font-semibold hover:bg-stone-200 transition-colors"
                    >
                      Annuler
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}