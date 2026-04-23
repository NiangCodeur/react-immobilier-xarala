import { Router, Request, Response } from 'express';
import Logement from '../models/Logement';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

// GET /api/logements  — public
router.get('/', async (req: Request, res: Response) => {
  try {
    const { categorie, quartier, prixMin, prixMax } = req.query;
    const filtre: Record<string, unknown> = { disponible: true };

    if (categorie) filtre.categorie = categorie;
    if (quartier) filtre.quartier = quartier;
    if (prixMin || prixMax) {
      filtre.prix = {};
      if (prixMin) (filtre.prix as Record<string, number>).$gte = Number(prixMin);
      if (prixMax) (filtre.prix as Record<string, number>).$lte = Number(prixMax);
    }

    const logements = await Logement.find(filtre).sort({ createdAt: -1 });
    res.json(logements);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// GET /api/logements/:id  — public
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const logement = await Logement.findById(req.params.id);
    if (!logement) {
      res.status(404).json({ message: 'Logement non trouvé' });
      return;
    }
    res.json(logement);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// POST /api/logements  — admin seulement
router.post('/', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const logement = await Logement.create(req.body);
    res.status(201).json(logement);
  } catch (err) {
    res.status(400).json({ message: 'Données invalides', error: err });
  }
});

// PUT /api/logements/:id  — admin seulement
router.put('/:id', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const logement = await Logement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!logement) {
      res.status(404).json({ message: 'Logement non trouvé' });
      return;
    }
    res.json(logement);
  } catch (err) {
    res.status(400).json({ message: 'Erreur mise à jour', error: err });
  }
});

// DELETE /api/logements/:id  — admin seulement
router.delete('/:id', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const logement = await Logement.findByIdAndDelete(req.params.id);
    if (!logement) {
      res.status(404).json({ message: 'Logement non trouvé' });
      return;
    }
    res.json({ message: 'Logement supprimé' });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

export default router;