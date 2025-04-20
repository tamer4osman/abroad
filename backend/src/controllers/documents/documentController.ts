import { Request, Response } from "express";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { v4 as uuidv4 } from "uuid";
import path from "path";

// MinIO/S3 Client Configuration
const minioEndpoint = process.env.MINIO_ENDPOINT || "localhost";
const minioPort = parseInt(process.env.MINIO_PORT || "9000", 10);
const minioAccessKey = process.env.MINIO_ACCESS_KEY;
const minioSecretKey = process.env.MINIO_SECRET_KEY;
const minioBucket = process.env.MINIO_BUCKET;
const minioUseSSL = process.env.MINIO_USE_SSL === "true";

// Initialize S3 client
const s3Client = new S3Client({
  endpoint: `${minioUseSSL ? "https" : "http"}://${minioEndpoint}:${minioPort}`,
  region: "us-east-1", // Default region for MinIO
  credentials: {
    accessKeyId: minioAccessKey || '',
    secretAccessKey: minioSecretKey || '',
  },
  forcePathStyle: true, // Required for MinIO
});

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Status message of the upload operation
 *         key:
 *           type: string
 *           description: Unique key identifying the document in storage
 *         originalName:
 *           type: string
 *           description: Original filename of the uploaded document
 *         size:
 *           type: integer
 *           description: Size of the file in bytes
 *         mimetype:
 *           type: string
 *           description: MIME type of the uploaded file
 *       example:
 *         message: "File uploaded successfully"
 *         key: "passport/123/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf"
 *         originalName: "passport_photo.pdf"
 *         size: 254879
 *         mimetype: "application/pdf"
 *     
 *     DownloadUrlResponse:
 *       type: object
 *       properties:
 *         downloadUrl:
 *           type: string
 *           description: Pre-signed URL for downloading the document
 *       example:
 *         downloadUrl: "https://minio.abroad-app.com:9000/documents/passport/123/a1b2c3d4-e5f6-7890-abcd-ef1234567890.pdf?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=..."
 */

/**
 * Helper function to generate pre-signed URL for downloading a document
 */
async function getPresignedDownloadUrl(key: string): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: minioBucket || '',
    Key: key,
  });
  // Expires in 15 minutes
  return getSignedUrl(s3Client, command, { expiresIn: 900 });
}

/**
 * Controller for document operations with MinIO
 */
export const documentController = {
  /**
   * @swagger
   * /api/documents/upload:
   *   post:
   *     summary: Upload a document
   *     tags: [Documents]
   *     description: Upload a document file to the storage system with associated metadata
   *     consumes:
   *       - multipart/form-data
   *     parameters:
   *       - in: formData
   *         name: file
   *         type: file
   *         required: true
   *         description: The file to upload
   *       - in: formData
   *         name: documentType
   *         type: string
   *         required: true
   *         description: Type of document (e.g., passport, visa, proxy)
   *       - in: formData
   *         name: relatedRecordId
   *         type: string
   *         required: false
   *         description: ID of the related record (e.g., passport ID, visa application ID)
   *     responses:
   *       201:
   *         description: Document uploaded successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UploadResponse'
   *       400:
   *         description: No file uploaded or invalid request
   *       500:
   *         description: Server error
   */
  uploadDocument: async (req: Request, res: Response): Promise<void> => {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded." });
      return;
    }

    try {
      const file = req.file;
      const fileExtension = path.extname(file.originalname);
      
      // Get metadata from request body for structuring the object key
      const documentType = req.body.documentType || 'general'; // e.g., 'passport', 'visa', 'proxy'
      const relatedRecordId = req.body.relatedRecordId || ''; // e.g., the ID of the related record
      
      // Create a structured key for better organization
      const uniqueKey = relatedRecordId 
        ? `${documentType}/${relatedRecordId}/${uuidv4()}${fileExtension}`
        : `${documentType}/${uuidv4()}${fileExtension}`;

      // Upload to MinIO
      const putCommand = new PutObjectCommand({
        Bucket: minioBucket || '',
        Key: uniqueKey,
        Body: file.buffer,
        ContentType: file.mimetype,
        // ACL: 'public-read', // Only if making files public by default
      });

      await s3Client.send(putCommand);

      // Return the key (which will be stored in the database)
      res.status(201).json({
        message: "File uploaded successfully",
        key: uniqueKey,
        originalName: file.originalname,
        size: file.size,
        mimetype: file.mimetype
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ error: "Failed to upload file." });
    }
  },

  /**
   * @swagger
   * /api/documents/{key}/download-url:
   *   get:
   *     summary: Get a download URL for a document
   *     tags: [Documents]
   *     description: Generate a pre-signed URL for downloading a specific document
   *     parameters:
   *       - in: path
   *         name: key
   *         required: true
   *         schema:
   *           type: string
   *         description: The storage key of the document to download
   *     responses:
   *       200:
   *         description: Download URL generated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/DownloadUrlResponse'
   *       404:
   *         description: Document not found
   *       500:
   *         description: Server error
   */
  getDocumentDownloadUrl: async (req: Request, res: Response): Promise<void> => {
    const { key } = req.params;
    try {
      // Optional: Add authorization check here
      // Does the current user have permission to access this key?

      const presignedUrl = await getPresignedDownloadUrl(key);
      
      // Return the pre-signed URL to the client
      res.json({ downloadUrl: presignedUrl });
      
      // Alternative: Redirect the client directly to the download
      // res.redirect(presignedUrl);
    } catch (error) {
      console.error(`Error generating pre-signed URL for key ${key}:`, error);
      
      if (error instanceof Error && error.name === "NoSuchKey") {
        res.status(404).json({ error: "Document not found." });
        return;
      }
      
      res.status(500).json({ error: "Failed to get download link." });
    }
  }
};