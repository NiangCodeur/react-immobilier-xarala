import mongoose, { Document } from 'mongoose';

export interface IContact extends Document {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  objet: string;
  message: string;
  lu: boolean;
}

const contactSchema = new mongoose.Schema<IContact>(
  {
    nom: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    objet: { type: String, required: true },
    message: { type: String, required: true },
    lu: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<IContact>('Contact', contactSchema);