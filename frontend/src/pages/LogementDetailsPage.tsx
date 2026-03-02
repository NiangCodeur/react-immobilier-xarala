import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import type { FormDataReservation } from '../types'; 
import { LOGEMENTS } from '../data/mockData';

import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { IoMdCheckmark } from "react-icons/io";
import { FaLocationDot } from "react-icons/fa6";

export default function LogementDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [currentImage, setCurrentImage] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<FormDataReservation>({
    nomComplet: '', email: '', telephone: '', dateDebut: '', dateFin: '', nombrePersonnes: 1, message: ''
  });
  const [success, setSuccess] = useState(false);

  const logement = LOGEMENTS.find(l => l.id === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({ nomComplet: '', email: '', telephone: '', dateDebut: '', dateFin: '', nombrePersonnes: 1, message: '' });
    setTimeout(() => { setSuccess(false); setShowForm(false); }, 3000);
  };

  if (!logement) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 via-white to-rose-50">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-stone-900 mb-4">Logement non trouvé</h1>
          <Link to="/" className="text-cyan-500 hover:text-cyan-600 font-medium">
            Retour aux logements
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50 py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <button
          onClick={() => navigate('/')}
          className="mb-6 flex items-center text-cyan-500 hover:text-cyan-600 font-medium"
        >
          <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Retour
        </button>

        <div className="bg-white rounded-2xl overflow-hidden shadow-xl mb-8">
          <div className="relative h-96">
            <img src={logement.images[currentImage]} alt={logement.titre} className="w-full h-full object-cover" />
            {logement.images.length > 1 && (
              <>
                <button onClick={() => setCurrentImage(p => p === 0 ? logement.images.length - 1 : p - 1)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white shadow-lg">
                    <FaAngleLeft className="w-6 h-6 text-cyan-500" />
                </button>
                <button onClick={() => setCurrentImage(p => p === logement.images.length - 1 ? 0 : p + 1)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm p-3 rounded-full hover:bg-white shadow-lg">
                  <FaAngleRight className="w-6 h-6 text-cyan-500" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {logement.images.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImage(i)}
                      className={`h-2 rounded-full transition-all ${currentImage === i ? 'bg-white w-8' : 'bg-white/60 w-2'}`} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                <div className="text-4xl font-bold bg-cyan-500 bg-clip-text text-transparent">
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
                { label: 'm²', value: logement.superficie }
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

            <div>
              <h2 className="text-2xl font-bold text-stone-900 mb-4">Équipements</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {logement.equipements.map((eq, i) => (
                  <div key={i} className="flex items-center text-stone-700">
                    <IoMdCheckmark className="w-5 h-5 mr-3 text-cyan-500" />
                    {eq}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-8 sticky top-24">
              {!showForm ? (
                <button onClick={() => setShowForm(true)}
                  className="w-full bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-cyan-600 transition-all shadow-lg hover:shadow-xl">
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
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {[
                      { label: 'Nom complet *', type: 'text', field: 'nomComplet' as keyof FormDataReservation },
                      { label: 'Email *', type: 'email', field: 'email' as keyof FormDataReservation },
                      { label: 'Téléphone *', type: 'tel', field: 'telephone' as keyof FormDataReservation },
                      { label: 'Date début *', type: 'date', field: 'dateDebut' as keyof FormDataReservation },
                      { label: 'Date fin', type: 'date', field: 'dateFin' as keyof FormDataReservation },
                      { label: 'Nombre de personnes *', type: 'number', field: 'nombrePersonnes' as keyof FormDataReservation, min: 1, max: logement.capacite }
                    ].map((input, i) => (
                      <div key={i}>
                        <label className="block text-sm font-semibold text-stone-700 mb-2">{input.label}</label>
                        <input
                          type={input.type}
                          required={input.label.includes('*')}
                          value={formData[input.field]}
                          onChange={(e) => setFormData({ ...formData, [input.field]: input.type === 'number' ? parseInt(e.target.value) || 1 : e.target.value })}
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
                    <button type="submit" className="w-full bg-cyan-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-cyan-600 transition-all">
                      Envoyer
                    </button>
                    <button type="button" onClick={() => setShowForm(false)}
                      className="w-full bg-stone-100 text-stone-700 px-6 py-3 rounded-xl font-semibold hover:bg-stone-200 transition-colors">
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
};

