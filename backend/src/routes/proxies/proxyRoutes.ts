import express from 'express';
import { proxyController } from '../../controllers/proxies/proxyController.js';

const router = express.Router();

/**
 * @route   POST /api/proxies
 * @desc    Create a new legal proxy
 */
router.post('/', proxyController.createProxy);

/**
 * @route   GET /api/proxies
 * @desc    Get all legal proxies
 */
router.get('/', proxyController.getAllProxies);

/**
 * @route   GET /api/proxies/:id
 * @desc    Get a legal proxy by ID
 */
router.get('/:id', proxyController.getProxyById);

/**
 * @route   PUT /api/proxies/:id
 * @desc    Update a legal proxy
 */
router.put('/:id', proxyController.updateProxy);

/**
 * @route   DELETE /api/proxies/:id
 * @desc    Delete a legal proxy
 */
router.delete('/:id', proxyController.deleteProxy);

export default router;