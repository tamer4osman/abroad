import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     PassportApplication:
 *       type: object
 *       required:
 *         - citizen_id
 *         - application_type
 *         - status
 *       properties:
 *         application_id:
 *           type: integer
 *           description: The auto-generated ID of the passport application
 *         citizen_id:
 *           type: integer
 *           description: ID of the citizen applying for passport
 *         application_type:
 *           type: string
 *           enum: [NEW, RENEWAL, REPLACEMENT, CHILD_ADD]
 *           description: Type of passport application
 *         application_date:
 *           type: string
 *           format: date-time
 *           description: Date when application was submitted
 *         status:
 *           type: string
 *           enum: [SUBMITTED, REVIEWING, APPROVED, REJECTED, COMPLETED]
 *           description: Current status of the application
 *         processing_fee:
 *           type: number
 *           format: float
 *           description: Fee charged for processing the application
 *         payment_status:
 *           type: string
 *           enum: [PENDING, PAID, REFUNDED]
 *           description: Payment status for the application fee
 *         payment_date:
 *           type: string
 *           format: date-time
 *           description: Date when payment was made
 *         embassy_id:
 *           type: integer
 *           description: ID of the embassy handling application (if international)
 *         rejection_reason:
 *           type: string
 *           description: Reason for rejection if application is rejected
 *         additional_notes:
 *           type: string
 *           description: Any additional notes or comments
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was last updated
 *       example:
 *         application_id: 1
 *         citizen_id: 123
 *         application_type: NEW
 *         application_date: '2023-05-15T10:30:00Z'
 *         status: REVIEWING
 *         processing_fee: 50.00
 *         payment_status: PAID
 *         payment_date: '2023-05-15T10:35:00Z'
 *         embassy_id: null
 *         rejection_reason: null
 *         additional_notes: 'Urgent processing requested'
 *         created_at: '2023-05-15T10:30:00Z'
 *         updated_at: '2023-05-15T11:45:00Z'
 *     
 *     Passport:
 *       type: object
 *       required:
 *         - citizen_id
 *         - passport_number
 *         - issue_date
 *         - expiry_date
 *       properties:
 *         passport_id:
 *           type: integer
 *           description: The auto-generated ID of the passport
 *         citizen_id:
 *           type: integer
 *           description: ID of the citizen who owns the passport
 *         application_id:
 *           type: integer
 *           description: ID of the application that resulted in this passport
 *         passport_number:
 *           type: string
 *           description: Unique passport number
 *         passport_type:
 *           type: string
 *           enum: [REGULAR, DIPLOMATIC, SERVICE, TEMPORARY]
 *           description: Type of passport issued
 *         issue_date:
 *           type: string
 *           format: date
 *           description: Date when passport was issued
 *         issue_place:
 *           type: string
 *           description: Place where passport was issued
 *         expiry_date:
 *           type: string
 *           format: date
 *           description: Date when passport expires
 *         issuing_authority:
 *           type: string
 *           description: Authority that issued the passport
 *         status:
 *           type: string
 *           enum: [VALID, EXPIRED, CANCELLED, LOST, STOLEN]
 *           description: Current status of the passport
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was created
 *         updated_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was last updated
 *       example:
 *         passport_id: 1
 *         citizen_id: 123
 *         application_id: 1
 *         passport_number: 'AB1234567'
 *         passport_type: 'REGULAR'
 *         issue_date: '2023-06-01'
 *         issue_place: 'Tripoli'
 *         expiry_date: '2033-06-01'
 *         issuing_authority: 'Ministry of Interior'
 *         status: 'VALID'
 *         created_at: '2023-06-01T09:15:00Z'
 *         updated_at: '2023-06-01T09:15:00Z'
 */

/**
 * Controller for Passport Application operations
 */
export const passportController = {
  /**
   * @swagger
   * /api/passports/applications:
   *   post:
   *     summary: Create a new passport application
   *     tags: [Passports]
   *     description: Submit a new application for a passport
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - citizen_id
   *               - application_type
   *             properties:
   *               citizen_id:
   *                 type: integer
   *                 description: ID of the citizen applying for passport
   *               application_type:
   *                 type: string
   *                 enum: [NEW, RENEWAL, REPLACEMENT, CHILD_ADD]
   *                 description: Type of passport application
   *               embassy_id:
   *                 type: integer
   *                 description: ID of the embassy handling application (if international)
   *               processing_fee:
   *                 type: number
   *                 description: Fee charged for processing the application
   *               payment_status:
   *                 type: string
   *                 enum: [PENDING, PAID, REFUNDED]
   *                 default: PENDING
   *               additional_notes:
   *                 type: string
   *                 description: Any additional notes or comments
   *     responses:
   *       201:
   *         description: Passport application created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PassportApplication'
   *       400:
   *         description: Invalid input data
   *       500:
   *         description: Server error
   */
  createApplication: async (req: Request, res: Response): Promise<void> => {
    try {
      const newApplication = await prisma.passportApplication.create({
        data: req.body,
      });
      res.status(201).json(newApplication);
    } catch (error) {
      console.error("Error creating passport application:", error);
      res.status(500).json({ error: "Failed to create passport application." });
    }
  },

  /**
   * @swagger
   * /api/passports/applications:
   *   get:
   *     summary: Get all passport applications
   *     tags: [Passports]
   *     description: Retrieve a list of all passport applications with related citizen and embassy data
   *     responses:
   *       200:
   *         description: A list of passport applications
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 allOf:
   *                   - $ref: '#/components/schemas/PassportApplication'
   *                   - type: object
   *                     properties:
   *                       citizen:
   *                         $ref: '#/components/schemas/Citizen'
   *                       embassy:
   *                         type: object
   *       500:
   *         description: Server error
   */
  getAllApplications: async (req: Request, res: Response): Promise<void> => {
    try {
      const applications = await prisma.passportApplication.findMany({
        orderBy: { application_date: "desc" },
        include: {
          citizen: true,
          embassy: true,
        },
      });
      res.json(applications);
    } catch (error) {
      console.error("Error fetching passport applications:", error);
      res.status(500).json({ error: "Failed to fetch passport applications." });
    }
  },

  /**
   * @swagger
   * /api/passports/applications/{id}:
   *   get:
   *     summary: Get a passport application by ID
   *     tags: [Passports]
   *     description: Retrieve detailed information about a passport application including citizen, embassy and issued passport
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The passport application ID
   *     responses:
   *       200:
   *         description: Detailed passport application information
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/PassportApplication'
   *                 - type: object
   *                   properties:
   *                     citizen:
   *                       $ref: '#/components/schemas/Citizen'
   *                     embassy:
   *                       type: object
   *                     passport:
   *                       $ref: '#/components/schemas/Passport'
   *       404:
   *         description: Passport application not found
   *       500:
   *         description: Server error
   */
  getApplicationById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const application = await prisma.passportApplication.findUnique({
        where: { application_id: parseInt(id, 10) },
        include: {
          citizen: true,
          embassy: true,
          passport: true // Include the issued passport if it exists
        }
      });
      
      if (!application) {
        res.status(404).json({ error: "Passport application not found." });
        return;
      }
      
      res.json(application);
    } catch (error) {
      console.error(`Error fetching passport application ${id}:`, error);
      res.status(500).json({ error: "Failed to fetch passport application." });
    }
  },

  /**
   * @swagger
   * /api/passports/applications/{id}:
   *   put:
   *     summary: Update a passport application by ID
   *     tags: [Passports]
   *     description: Update the details of an existing passport application
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The passport application ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [SUBMITTED, REVIEWING, APPROVED, REJECTED, COMPLETED]
   *               processing_fee:
   *                 type: number
   *               payment_status:
   *                 type: string
   *                 enum: [PENDING, PAID, REFUNDED]
   *               payment_date:
   *                 type: string
   *                 format: date-time
   *               embassy_id:
   *                 type: integer
   *               rejection_reason:
   *                 type: string
   *               additional_notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Passport application updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/PassportApplication'
   *       404:
   *         description: Passport application not found
   *       500:
   *         description: Server error
   */
  updateApplication: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const updatedApplication = await prisma.passportApplication.update({
        where: { application_id: parseInt(id, 10) },
        data: req.body
      });
      
      res.json(updatedApplication);
    } catch (error) {
      console.error(`Error updating passport application ${id}:`, error);
      
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Passport application not found." });
        return;
      }
      
      res.status(500).json({ error: "Failed to update passport application." });
    }
  },

  /**
   * @swagger
   * /api/passports/applications/{id}:
   *   delete:
   *     summary: Delete a passport application by ID
   *     tags: [Passports]
   *     description: Remove a passport application from the system
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The passport application ID
   *     responses:
   *       204:
   *         description: Passport application successfully deleted
   *       404:
   *         description: Passport application not found
   *       500:
   *         description: Server error
   */
  deleteApplication: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await prisma.passportApplication.delete({
        where: { application_id: parseInt(id, 10) }
      });
      
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting passport application ${id}:`, error);
      
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Passport application not found." });
        return;
      }
      
      res.status(500).json({ error: "Failed to delete passport application." });
    }
  }
};