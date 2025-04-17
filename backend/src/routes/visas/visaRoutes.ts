import express from 'express';
import { visaController } from '../../controllers/visas/visaController';

const router = express.Router();

/**
 * @route   POST /api/visas/applications
 * @desc    Create a new visa application
 */
router.post('/applications', visaController.createApplication);

/**
 * @route   GET /api/visas/applications
 * @desc    Get all visa applications
 */
router.get('/applications', visaController.getAllApplications);

/**
 * @route   GET /api/visas/applications/:id
 * @desc    Get a visa application by ID
 */
router.get('/applications/:id', visaController.getApplicationById);

/**
 * @route   PUT /api/visas/applications/:id
 * @desc    Update a visa application
 */
router.put('/applications/:id', visaController.updateApplication);

/**
 * @route   DELETE /api/visas/applications/:id
 * @desc    Delete a visa application
 */
router.delete('/applications/:id', visaController.deleteApplication);

export default router;