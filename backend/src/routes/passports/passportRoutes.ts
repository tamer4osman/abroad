import express from 'express';
import { passportController } from '../../controllers/passports/passportController.js';

const router = express.Router();

/**
 * @route   POST /api/passports/applications
 * @desc    Create a new passport application
 */
router.post('/applications', passportController.createApplication);

/**
 * @route   GET /api/passports/applications
 * @desc    Get all passport applications
 */
router.get('/applications', passportController.getAllApplications);

/**
 * @route   GET /api/passports/applications/:id
 * @desc    Get a passport application by ID
 */
router.get('/applications/:id', passportController.getApplicationById);

/**
 * @route   PUT /api/passports/applications/:id
 * @desc    Update a passport application
 */
router.put('/applications/:id', passportController.updateApplication);

/**
 * @route   DELETE /api/passports/applications/:id
 * @desc    Delete a passport application
 */
router.delete('/applications/:id', passportController.deleteApplication);

export default router;