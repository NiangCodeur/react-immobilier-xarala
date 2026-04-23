import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  nom: string;
  email: string;
  motDePasse: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    nom: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    motDePasse: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
  },
  { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);