import express from 'express';
import multer from 'multer';
import { documentController } from '../../controllers/documents/documentController';

const router = express.Router();

// Configure multer for memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * @route   POST /api/documents/upload
 * @desc    Upload a document to MinIO
 */
router.post('/upload', upload.single('document'), documentController.uploadDocument);

/**
 * @route   GET /api/documents/download/:key
 * @desc    Get a download URL for a document
 */
router.get('/download/:key', documentController.getDocumentDownloadUrl);

export default router;