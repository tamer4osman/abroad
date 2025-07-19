import express from 'express';
import { attestationController } from '../../controllers/attestations/attestationController.js';
import { authenticate, authorize } from '../../middlewares/authMiddleware.js';

const router = express.Router();

/**
 * Attestation routes for document legalization and authentication
 */

// Submit a new attestation request
router.post('/', authenticate, authorize(['ADMIN', 'OFFICER', 'USER']), attestationController.submitAttestationRequest);

// Get all attestation requests with filtering
router.get('/requests', authenticate, authorize(['ADMIN', 'OFFICER', 'MANAGER']), attestationController.getAllAttestationRequests);

// Get specific attestation by ID
router.get('/requests/:id', authenticate, authorize(['ADMIN', 'OFFICER', 'MANAGER']), attestationController.getAttestationById);

// Update attestation status
router.put('/requests/:id/status', authenticate, authorize(['ADMIN', 'OFFICER']), attestationController.updateAttestationStatus);

// Get attestations by citizen ID
router.get('/citizen/:citizenId', authenticate, authorize(['ADMIN', 'OFFICER', 'MANAGER']), attestationController.getAttestationsByCitizen);

// Get attestation statistics
router.get('/stats', authenticate, authorize(['ADMIN', 'MANAGER']), attestationController.getAttestationStats);

export default router;