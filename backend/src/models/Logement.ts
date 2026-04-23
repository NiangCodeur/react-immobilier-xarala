import mongoose, { Document } from 'mongoose';

export interface ILogement extends Document {
  titre: string;
  quartier: string;
  categorie: 'Appartement' | 'Maison' | 'Villa';
  prix: number;
  description: string;
  equipements: string[];
  images: string[];
  capacite: number;
  chambres: number;
  sallesDeBain: number;
  superficie: number;
  disponible: boolean;
}

const logementSchema = new mongoose.Schema<ILogement>(
  {
    titre: { type: String, required: true },
    quartier: { type: String, required: true },
    categorie: { type: String, enum: ['Appartement', 'Maison', 'Villa'], required: true },
    prix: { type: Number, required: true },
    description: { type: String, required: true },
    equipements: [{ type: String }],
    images: [{ type: String }],
    capacite: { type: Number, required: true },
    chambres: { type: Number, required: true },
    sallesDeBain: { type: Number, required: true },
    superficie: { type: Number, required: true },
    disponible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model<ILogement>('Logement', logementSchema);