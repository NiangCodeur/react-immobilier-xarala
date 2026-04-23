import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import User from './models/User'; // Vérifie le chemin de ton modèle
import dotenv from 'dotenv';

dotenv.config();

const reset = async () => {
  await mongoose.connect(process.env.MONGODB_URI!);
  
  const email = 'admin@xarala.com';
  const password = 'Dakar2026';
  const hashedPassword = await bcrypt.hash(password, 12);

  // On cherche l'admin et on met à jour, sinon on le crée
  await User.findOneAndUpdate(
    { email },
    { 
      nom: 'Admin AfroLab',
      email,
      motDePasse: hashedPassword,
      role: 'admin' 
    },
    { upsert: true, new: true }
  );

  console.log("✅ L'admin a été réinitialisé avec succès !");
  console.log("Email: admin@xarala.com");
  console.log("Password: Dakar2026");
  process.exit();
};

reset();