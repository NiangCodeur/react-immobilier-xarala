import { Router, Request, Response } from 'express';
import SiteTouristique from '../models/SiteTouristique';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = Router();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const sites = await SiteTouristique.find().sort({ createdAt: -1 });
    res.json(sites);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const site = await SiteTouristique.findById(req.params.id);
    if (!site) { res.status(404).json({ message: 'Site non trouvé' }); return; }
    res.json(site);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

router.post('/', protect, adminOnly, async (req: Request, res: Response) => {
  try {
    const site = await SiteTouristique.create(req.body);
    res.status(201).json(site);
  } catch (err) {
    res.status(400).json({ message: 'Données invalides', error: err });
  }
});

export default router;