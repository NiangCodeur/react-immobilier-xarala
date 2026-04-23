import { Router, Request, Response } from 'express';
import Contact from '../models/Contact';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// POST /api/contacts  — public
router.post('/', async (req: Request, res: Response) => {
  try {
    const contact = await Contact.create(req.body);
    res.status(201).json({ message: 'Message envoyé avec succès', contact });
  } catch (err) {
    res.status(400).json({ message: 'Données invalides', error: err });
  }
});

// GET /api/contacts  — admin seulement
router.get('/', protect, adminOnly, async (_req: Request, res: Response) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

export default router;