import React, { useState } from 'react';
import type { FormDataContact } from '../types';

export default function ContactPage() {
  const [formData, setFormData] = useState<FormDataContact>({ 
    nom: '', prenom: '', email: '', telephone: '', objet: '', message: '' 
  });
  const [success, setSuccess] = useState(false);
   
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(true);
    setFormData({ nom: '', prenom: '', email: '', telephone: '', objet: '', message: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-rose-50">
      <div className="relative bg-gradient-to-br from-cyan-500 via-cyan-500 to-cyan-500 text-white py-24 overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzBoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyem0wLTRoLTJ2LTJoMnYyeiIvPjwvZz48L2c+PC9zdmc+')] opacity-30"></div>
        <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Contactez-nous</h1>
          <p className="text-xl text-orange-100">Nous sommes là pour vous aider</p>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold text-stone-900 mb-8">Nos coordonnées</h2>
            <div className="space-y-6">
              {[
                { icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z', title: 'Email', value: 'contact@dakar-logements.com' },
                { icon: 'M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z', title: 'Téléphone', value: '+221 XX XXX XX XX' },
                { icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z', title: 'Adresse', value: 'Dakar, Sénégal' }
              ].map((contact, i) => (
                <div key={i} className="flex items-start bg-white rounded-xl p-6 shadow-sm border border-stone-100">
                  <div className="flex-shrink-0 w-12 h-12 bg-cyan-500 rounded-lg flex items-center justify-center">
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={contact.icon} />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-bold text-stone-900">{contact.title}</h3>
                    <p className="text-stone-600 mt-1">{contact.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-stone-100">
            <h2 className="text-3xl font-bold text-stone-900 mb-6">Envoyez un message</h2>
            {success && <div className="bg-green-100 border-2 border-green-400 text-green-700 px-4 py-3 rounded-xl mb-6 font-medium">Message envoyé !</div>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                {(['nom', 'prenom'] as const).map(field => (
                  <div key={field}>
                    <label className="block text-sm font-semibold text-stone-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
                    <input type="text" required value={formData[field]} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                      className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors" />
                  </div>
                ))}
              </div>
              {(['email', 'telephone', 'objet'] as const).map(field => (
                <div key={field}>
                  <label className="block text-sm font-semibold text-stone-700 mb-2">{field.charAt(0).toUpperCase() + field.slice(1)} *</label>
                  <input type={field === 'email' ? 'email' : field === 'telephone' ? 'tel' : 'text'} required value={formData[field]}
                    onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors" />
                </div>
              ))}
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Message *</label>
                <textarea required rows={5} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:outline-none focus:border-cyan-500 transition-colors" />
              </div>
              <button type="submit" className="w-full bg-cyan-500 text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-600 transition-all shadow-lg cursor-pointer">
                Envoyer
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
