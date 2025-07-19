import express from "express";
import { versionController } from '../../controllers/version/versionController.js';

const router = express.Router();

/**
 * Version information routes
 */
router.get("/", versionController.getVersionInfo);
router.get("/supported", versionController.getSupportedVersions);

export default router;