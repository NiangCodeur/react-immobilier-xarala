import { Router, Request, Response } from 'express';
import Reservation from '../models/Reservation';
import { protect, adminOnly, AuthRequest } from '../middleware/authMiddleware';

const router = Router();

// POST /api/reservations  — public (le visiteur réserve sans compte)
router.post('/', async (req: Request, res: Response) => {
  try {
    const reservation = await Reservation.create(req.body);
    res.status(201).json({ message: 'Réservation envoyée avec succès', reservation });
  } catch (err) {
    res.status(400).json({ message: 'Données invalides', error: err });
  }
});

// GET /api/reservations  — admin seulement
router.get('/', protect, adminOnly, async (_req: AuthRequest, res: Response) => {
  try {
    const reservations = await Reservation.find()
      .populate('logement', 'titre quartier prix')
      .sort({ createdAt: -1 });
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err });
  }
});

// PATCH /api/reservations/:id/statut  — admin seulement
router.patch('/:id/statut', protect, adminOnly, async (req: Request, res: Response): Promise<void> => {
  try {
    const { statut } = req.body;
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      { statut },
      { new: true }
    );
    if (!reservation) { res.status(404).json({ message: 'Réservation non trouvée' }); return; }
    res.json(reservation);
  } catch (err) {
    res.status(400).json({ message: 'Erreur mise à jour', error: err });
  }
});

export default router;