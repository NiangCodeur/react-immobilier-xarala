import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';

const router = Router();

// Helper pour générer le Token
const generateToken = (id: string, role: string) =>
  jwt.sign(
    { id, role }, 
    String(process.env.JWT_SECRET), 
    {
      expiresIn: '7d', 
    }
  );

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { nom, email, motDePasse } = req.body;

    const existant = await User.findOne({ email });
    if (existant) {
      res.status(400).json({ message: 'Email déjà utilisé' });
      return;
    }

    const hash = await bcrypt.hash(motDePasse, 12);
    const user = await User.create({ nom, email, motDePasse: hash });

    res.status(201).json({
      token: generateToken(user._id.toString(), user.role),
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, motDePasse } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    const valide = await bcrypt.compare(motDePasse, user.motDePasse);
    if (!valide) {
      res.status(401).json({ message: 'Email ou mot de passe incorrect' });
      return;
    }

    res.json({
      token: generateToken(user._id.toString(), user.role),
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// GET /api/auth/me (protégé)
router.get('/me', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Non autorisé' });
    return;
  }
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id).select('-motDePasse');
    res.json(user);
  } catch {
    res.status(401).json({ message: 'Token invalide' });
  }
});

// --- NOUVELLE ROUTE : PATCH /api/auth/profil ---
router.patch('/profil', async (req: Request, res: Response): Promise<void> => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Non autorisé' });
    return;
  }

  try {
    const decoded = jwt.verify(authHeader.split(' ')[1], process.env.JWT_SECRET!) as { id: string };
    const { email, motDePasseActuel, nouveauMotDePasse } = req.body;

    const user = await User.findById(decoded.id);
    if (!user) {
      res.status(404).json({ message: 'Utilisateur non trouvé' });
      return;
    }

    // 1. Vérifier le mot de passe actuel avant tout changement (Sécurité capitale)
    const valide = await bcrypt.compare(motDePasseActuel, user.motDePasse);
    if (!valide) {
      res.status(401).json({ message: 'Mot de passe actuel incorrect' });
      return;
    }

    // 2. Mise à jour de l'email
    if (email && email !== user.email) {
      const emailExistant = await User.findOne({ email });
      if (emailExistant) {
        res.status(400).json({ message: 'Cet email est déjà utilisé' });
        return;
      }
      user.email = email;
    }

    // 3. Mise à jour du mot de passe
    if (nouveauMotDePasse) {
      if (nouveauMotDePasse.length < 6) {
        res.status(400).json({ message: 'Le mot de passe doit faire au moins 6 caractères' });
        return;
      }
      user.motDePasse = await bcrypt.hash(nouveauMotDePasse, 12);
    }

    await user.save();
    
    res.json({
      message: 'Profil mis à jour avec succès',
      user: { id: user._id, nom: user.nom, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(401).json({ message: 'Token invalide ou erreur serveur' });
  }
});

export default router;