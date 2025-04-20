import { Request, Response } from "express";
import prisma from "../../utils/prisma";

/**
 * @swagger
 * components:
 *   schemas:
 *     LegalProxy:
 *       type: object
 *       required:
 *         - grantor_citizen_id
 *         - proxy_type
 *         - start_date
 *         - end_date
 *         - status
 *       properties:
 *         proxy_id:
 *           type: integer
 *           description: The auto-generated ID of the legal proxy
 *         grantor_citizen_id:
 *           type: integer
 *           description: ID of the citizen granting the proxy authority
 *         proxy_type:
 *           type: string
 *           enum: [GENERAL, SPECIFIC, REAL_ESTATE, COURT, INHERITANCE, BANK, DIVORCE, DOCUMENT_COMPLETION]
 *           description: Type of legal proxy authority granted
 *         recipient_name:
 *           type: string
 *           description: Full name of the person receiving proxy authority
 *         recipient_id_number:
 *           type: string
 *           description: ID number of the person receiving proxy authority
 *         proxy_details:
 *           type: string
 *           description: Detailed description of proxy powers and limitations
 *         start_date:
 *           type: string
 *           format: date
 *           description: Date when proxy becomes effective
 *         end_date:
 *           type: string
 *           format: date
 *           description: Date when proxy expires
 *         status:
 *           type: string
 *           enum: [DRAFT, PENDING, APPROVED, REJECTED, CANCELED, EXPIRED]
 *           description: Current status of the legal proxy
 *         rejection_reason:
 *           type: string
 *           description: Reason for rejection if proxy is rejected
 *         embassy_id:
 *           type: integer
 *           description: ID of the embassy handling the proxy (if international)
 *         approved_by_id:
 *           type: integer
 *           description: ID of the officer who approved the proxy
 *         approval_date:
 *           type: string
 *           format: date-time
 *           description: Date and time when proxy was approved
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was last updated
 *       example:
 *         proxy_id: 1
 *         grantor_citizen_id: 123
 *         proxy_type: 'REAL_ESTATE'
 *         recipient_name: 'Mohammed Abdullah'
 *         recipient_id_number: '987654321'
 *         proxy_details: 'Authority to sell property located at 45 Omar Al-Mukhtar St, Tripoli. Property deed number: 12345.'
 *         start_date: '2023-06-01'
 *         end_date: '2023-12-31'
 *         status: 'APPROVED'
 *         rejection_reason: null
 *         embassy_id: null
 *         approved_by_id: 5
 *         approval_date: '2023-05-25T11:30:00Z'
 *         created_at: '2023-05-20T09:45:00Z'
 *         updated_at: '2023-05-25T11:30:00Z'
 *     
 *     ProxyActivity:
 *       type: object
 *       properties:
 *         activity_id:
 *           type: integer
 *           description: The auto-generated ID of the proxy activity
 *         proxy_id:
 *           type: integer
 *           description: ID of the related legal proxy
 *         activity_type:
 *           type: string
 *           description: Type of activity performed using the proxy
 *         activity_date:
 *           type: string
 *           format: date-time
 *           description: Date and time when the activity occurred
 *         details:
 *           type: string
 *           description: Detailed description of the activity
 *         location:
 *           type: string
 *           description: Location where activity took place
 *         verified:
 *           type: boolean
 *           description: Whether the activity has been verified by an official
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was created
 *       example:
 *         activity_id: 1
 *         proxy_id: 1
 *         activity_type: 'PROPERTY_SALE'
 *         activity_date: '2023-07-15T14:20:00Z'
 *         details: 'Sold property deed #12345 to buyer Fatima Hassan for 250,000 LYD'
 *         location: 'Tripoli Real Estate Office'
 *         verified: true
 *         created_at: '2023-07-15T14:25:00Z'
 *     
 *     ProxyDocument:
 *       type: object
 *       properties:
 *         document_id:
 *           type: integer
 *           description: The auto-generated ID of the proxy document
 *         proxy_id:
 *           type: integer
 *           description: ID of the related legal proxy
 *         document_type:
 *           type: string
 *           description: Type of document
 *         file_path:
 *           type: string
 *           description: Path to the stored document file
 *         upload_date:
 *           type: string
 *           format: date-time
 *           description: Date and time when document was uploaded
 *         verified:
 *           type: boolean
 *           description: Whether the document has been verified
 *       example:
 *         document_id: 1
 *         proxy_id: 1
 *         document_type: 'PROPERTY_DEED'
 *         file_path: '/documents/proxies/1/deed_12345.pdf'
 *         upload_date: '2023-05-20T10:15:00Z'
 *         verified: true
 */

/**
 * Controller for Legal Proxy operations
 */
export const proxyController = {
  /**
   * @swagger
   * /api/proxies:
   *   post:
   *     summary: Create a new legal proxy
   *     tags: [Proxies]
   *     description: Register a new legal proxy authorization between citizens
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - grantor_citizen_id
   *               - proxy_type
   *               - recipient_name
   *               - recipient_id_number
   *               - start_date
   *               - end_date
   *             properties:
   *               grantor_citizen_id:
   *                 type: integer
   *                 description: ID of the citizen granting the proxy authority
   *               proxy_type:
   *                 type: string
   *                 enum: [GENERAL, SPECIFIC, REAL_ESTATE, COURT, INHERITANCE, BANK, DIVORCE, DOCUMENT_COMPLETION]
   *                 description: Type of legal proxy authority granted
   *               recipient_name:
   *                 type: string
   *                 description: Full name of the person receiving proxy authority
   *               recipient_id_number:
   *                 type: string
   *                 description: ID number of the person receiving proxy authority
   *               proxy_details:
   *                 type: string
   *                 description: Detailed description of proxy powers and limitations
   *               start_date:
   *                 type: string
   *                 format: date
   *                 description: Date when proxy becomes effective
   *               end_date:
   *                 type: string
   *                 format: date
   *                 description: Date when proxy expires
   *               status:
   *                 type: string
   *                 enum: [DRAFT, PENDING, APPROVED, REJECTED, CANCELED, EXPIRED]
   *                 default: PENDING
   *               embassy_id:
   *                 type: integer
   *                 description: ID of the embassy handling the proxy (if international)
   *     responses:
   *       201:
   *         description: Legal proxy created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LegalProxy'
   *       400:
   *         description: Invalid input data
   *       500:
   *         description: Server error
   */
  createProxy: async (req: Request, res: Response): Promise<void> => {
    try {
      const newProxy = await prisma.legalProxy.create({
        data: req.body,
      });
      res.status(201).json(newProxy);
    } catch (error) {
      console.error("Error creating legal proxy:", error);
      res.status(500).json({ error: "Failed to create legal proxy." });
    }
  },

  /**
   * @swagger
   * /api/proxies:
   *   get:
   *     summary: Get all legal proxies
   *     tags: [Proxies]
   *     description: Retrieve a list of all legal proxies with related information
   *     responses:
   *       200:
   *         description: A list of legal proxies
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 allOf:
   *                   - $ref: '#/components/schemas/LegalProxy'
   *                   - type: object
   *                     properties:
   *                       grantor_citizen:
   *                         $ref: '#/components/schemas/Citizen'
   *                       embassy:
   *                         type: object
   *                       approved_by:
   *                         type: object
   *                       documents:
   *                         type: array
   *                         items:
   *                           $ref: '#/components/schemas/ProxyDocument'
   *                       activities:
   *                         type: array
   *                         items:
   *                           $ref: '#/components/schemas/ProxyActivity'
   *       500:
   *         description: Server error
   */
  getAllProxies: async (req: Request, res: Response): Promise<void> => {
    try {
      const proxies = await prisma.legalProxy.findMany({
        orderBy: { created_at: "desc" },
        include: {
          grantor_citizen: true,
          embassy: true,
          approved_by: true,
          documents: true,
          activities: true
        },
      });
      res.json(proxies);
    } catch (error) {
      console.error("Error fetching legal proxies:", error);
      res.status(500).json({ error: "Failed to fetch legal proxies." });
    }
  },

  /**
   * @swagger
   * /api/proxies/{id}:
   *   get:
   *     summary: Get a legal proxy by ID
   *     tags: [Proxies]
   *     description: Retrieve detailed information about a legal proxy including related entities
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The legal proxy ID
   *     responses:
   *       200:
   *         description: Detailed legal proxy information
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/LegalProxy'
   *                 - type: object
   *                   properties:
   *                     grantor_citizen:
   *                       $ref: '#/components/schemas/Citizen'
   *                     embassy:
   *                       type: object
   *                     approved_by:
   *                       type: object
   *                     documents:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/ProxyDocument'
   *                     activities:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/ProxyActivity'
   *       404:
   *         description: Legal proxy not found
   *       500:
   *         description: Server error
   */
  getProxyById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const proxy = await prisma.legalProxy.findUnique({
        where: { proxy_id: parseInt(id, 10) },
        include: {
          grantor_citizen: true,
          embassy: true,
          approved_by: true,
          documents: true,
          activities: true
        }
      });
      
      if (!proxy) {
        res.status(404).json({ error: "Legal proxy not found." });
        return;
      }
      
      res.json(proxy);
    } catch (error) {
      console.error(`Error fetching legal proxy ${id}:`, error);
      res.status(500).json({ error: "Failed to fetch legal proxy." });
    }
  },

  /**
   * @swagger
   * /api/proxies/{id}:
   *   put:
   *     summary: Update a legal proxy by ID
   *     tags: [Proxies]
   *     description: Update the details of an existing legal proxy
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The legal proxy ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               proxy_details:
   *                 type: string
   *                 description: Detailed description of proxy powers and limitations
   *               end_date:
   *                 type: string
   *                 format: date
   *                 description: Date when proxy expires
   *               status:
   *                 type: string
   *                 enum: [DRAFT, PENDING, APPROVED, REJECTED, CANCELED, EXPIRED]
   *               rejection_reason:
   *                 type: string
   *                 description: Reason for rejection if proxy is rejected
   *               approved_by_id:
   *                 type: integer
   *                 description: ID of the officer who approved the proxy
   *               approval_date:
   *                 type: string
   *                 format: date-time
   *                 description: Date and time when proxy was approved
   *     responses:
   *       200:
   *         description: Legal proxy updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/LegalProxy'
   *       404:
   *         description: Legal proxy not found
   *       500:
   *         description: Server error
   */
  updateProxy: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const updatedProxy = await prisma.legalProxy.update({
        where: { proxy_id: parseInt(id, 10) },
        data: req.body
      });
      
      res.json(updatedProxy);
    } catch (error) {
      console.error(`Error updating legal proxy ${id}:`, error);
      
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Legal proxy not found." });
        return;
      }
      
      res.status(500).json({ error: "Failed to update legal proxy." });
    }
  },

  /**
   * @swagger
   * /api/proxies/{id}:
   *   delete:
   *     summary: Delete a legal proxy by ID
   *     tags: [Proxies]
   *     description: Remove a legal proxy from the system
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The legal proxy ID
   *     responses:
   *       204:
   *         description: Legal proxy successfully deleted
   *       404:
   *         description: Legal proxy not found
   *       500:
   *         description: Server error
   */
  deleteProxy: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await prisma.legalProxy.delete({
        where: { proxy_id: parseInt(id, 10) }
      });
      
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting legal proxy ${id}:`, error);
      
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Legal proxy not found." });
        return;
      }
      
      res.status(500).json({ error: "Failed to delete legal proxy." });
    }
  }
};