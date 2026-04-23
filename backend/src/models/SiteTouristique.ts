import mongoose, { Document } from 'mongoose';

export interface ISiteTouristique extends Document {
  nom: string;
  description: string;
  image: string;
  quartier: string;
  type: string;
  dureeVisite: string;
  tarif: string;
  horaires: string;
}

const siteSchema = new mongoose.Schema<ISiteTouristique>(
  {
    nom: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    quartier: { type: String, required: true },
    type: { type: String, required: true },
    dureeVisite: { type: String, required: true },
    tarif: { type: String, required: true },
    horaires: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<ISiteTouristique>('SiteTouristique', siteSchema);