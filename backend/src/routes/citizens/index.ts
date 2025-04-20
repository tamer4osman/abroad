import { Router } from 'express';
import { citizenController } from '../../controllers/citizens/citizenController';
import { authenticate } from '../../middlewares/authMiddleware';

const router = Router();

// Apply auth middleware to all citizens routes
router.use(authenticate);

// Citizen routes
router.post('/', citizenController.createCitizen);
router.get('/', citizenController.getAllCitizens);
router.get('/search', citizenController.searchCitizens); // Advanced search endpoint
router.get('/:id', citizenController.getCitizenById);
router.put('/:id', citizenController.updateCitizen);
router.delete('/:id', citizenController.deleteCitizen);

export default router;