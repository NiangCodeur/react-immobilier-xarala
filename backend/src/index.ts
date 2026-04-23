import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import logementsRouter from './routes/logements';
import sitesRouter from './routes/sitesTouristiques';
import reservationsRouter from './routes/reservations';
import contactsRouter from './routes/contacts';
import authRouter from './routes/auth';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

app.use('/api/auth', authRouter);
app.use('/api/logements', logementsRouter);
app.use('/api/sites-touristiques', sitesRouter);
app.use('/api/reservations', reservationsRouter);
app.use('/api/contacts', contactsRouter);

app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

// Le mot de bienvenue à l'entrée principale
app.get('/', (req, res) => {
  res.send('Bienvenue sur l\'API de Xarala Immobilier ! Le moteur tourne à plein régime. 🚀');
});

mongoose
  .connect(process.env.MONGODB_URI!)
  .then(() => {
    console.log('✅ MongoDB connecté');
    app.listen(PORT, () => console.log(`🚀 Serveur sur http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ Erreur MongoDB :', err);
    process.exit(1);
  });