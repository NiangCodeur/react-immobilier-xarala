import mongoose, { Document } from 'mongoose';

export interface IReservation extends Document {
  logement: mongoose.Types.ObjectId;
  nomComplet: string;
  email: string;
  telephone: string;
  dateDebut: Date;
  dateFin: Date;
  nombrePersonnes: number;
  message?: string;
  statut: 'en_attente' | 'confirmee' | 'annulee';
}

const reservationSchema = new mongoose.Schema<IReservation>(
  {
    logement: { type: mongoose.Schema.Types.ObjectId, ref: 'Logement', required: true },
    nomComplet: { type: String, required: true },
    email: { type: String, required: true },
    telephone: { type: String, required: true },
    dateDebut: { type: Date, required: true },
    dateFin: { type: Date, required: true },
    nombrePersonnes: { type: Number, required: true },
    message: { type: String },
    statut: { type: String, enum: ['en_attente', 'confirmee', 'annulee'], default: 'en_attente' },
  },
  { timestamps: true }
);

export default mongoose.model<IReservation>('Reservation', reservationSchema);