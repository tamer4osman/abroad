import express from 'express';
import { citizenController } from '../../controllers/citizens/citizenController';
import { authenticate, authorize } from '../../middlewares/authMiddleware';

const router = express.Router();

/**
 * @route   POST /api/citizens
 * @desc    Create a new citizen
 */
router.post('/', authenticate, authorize(['admin', 'registrar']), citizenController.createCitizen);

/**
 * @route   GET /api/citizens
 * @desc    Get all citizens
 */
router.get('/', authenticate, citizenController.getAllCitizens);

/**
 * @route   GET /api/citizens/:id
 * @desc    Get a single citizen by ID
 */
router.get('/:id', citizenController.getCitizenById);

/**
 * @route   PUT /api/citizens/:id
 * @desc    Update a citizen by ID
 */
router.put('/:id', citizenController.updateCitizen);

/**
 * @route   DELETE /api/citizens/:id
 * @desc    Delete a citizen by ID
 */
router.delete('/:id', citizenController.deleteCitizen);

export default router;