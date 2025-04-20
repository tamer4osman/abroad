import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * @swagger
 * components:
 *   schemas:
 *     VisaApplication:
 *       type: object
 *       required:
 *         - first_name
 *         - last_name
 *         - nationality
 *         - passport_number
 *         - visa_type
 *       properties:
 *         application_id:
 *           type: integer
 *           description: The auto-generated ID of the visa application
 *         first_name:
 *           type: string
 *           description: First name of the applicant
 *         last_name:
 *           type: string
 *           description: Last name of the applicant
 *         gender:
 *           type: string
 *           enum: [M, F, Other]
 *           description: Gender of the applicant
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: Date of birth of the applicant
 *         nationality:
 *           type: string
 *           description: Nationality of the applicant
 *         passport_number:
 *           type: string
 *           description: Passport number of the applicant
 *         passport_issue_date:
 *           type: string
 *           format: date
 *           description: Issue date of the applicant's passport
 *         passport_expiry_date:
 *           type: string
 *           format: date
 *           description: Expiry date of the applicant's passport
 *         visa_type:
 *           type: string
 *           enum: [TOURIST, BUSINESS, STUDENT, WORK, TRANSIT, DIPLOMATIC, MULTIPLE_ENTRY]
 *           description: Type of visa requested
 *         entry_type:
 *           type: string
 *           enum: [SINGLE, MULTIPLE]
 *           description: Type of entry requested (single or multiple)
 *         duration_days:
 *           type: integer
 *           description: Requested duration of stay in days
 *         application_date:
 *           type: string
 *           format: date-time
 *           description: Date when application was submitted
 *         status:
 *           type: string
 *           enum: [SUBMITTED, PROCESSING, APPROVED, REJECTED, ISSUED]
 *           description: Current status of the application
 *         rejection_reason:
 *           type: string
 *           description: Reason for rejection if application is rejected
 *         processing_fee:
 *           type: number
 *           format: float
 *           description: Fee charged for processing the application
 *         payment_status:
 *           type: string
 *           enum: [PENDING, PAID, REFUNDED]
 *           description: Payment status for the application fee
 *         embassy_id:
 *           type: integer
 *           description: ID of the embassy handling the application
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
 *         first_name: 'John'
 *         last_name: 'Smith'
 *         gender: 'M'
 *         date_of_birth: '1985-05-15'
 *         nationality: 'Canadian'
 *         passport_number: 'AB123456'
 *         passport_issue_date: '2020-01-10'
 *         passport_expiry_date: '2030-01-10'
 *         visa_type: 'TOURIST'
 *         entry_type: 'SINGLE'
 *         duration_days: 30
 *         application_date: '2023-05-01T09:30:00Z'
 *         status: 'PROCESSING'
 *         rejection_reason: null
 *         processing_fee: 50.00
 *         payment_status: 'PAID'
 *         embassy_id: 3
 *         created_at: '2023-05-01T09:30:00Z'
 *         updated_at: '2023-05-02T14:20:00Z'
 *     
 *     Sponsor:
 *       type: object
 *       properties:
 *         sponsor_id:
 *           type: integer
 *           description: The auto-generated ID of the sponsor
 *         application_id:
 *           type: integer
 *           description: ID of the visa application being sponsored
 *         name:
 *           type: string
 *           description: Full name of the sponsor
 *         relationship:
 *           type: string
 *           description: Relationship to the applicant
 *         address:
 *           type: string
 *           description: Address of the sponsor
 *         phone_number:
 *           type: string
 *           description: Contact phone number of the sponsor
 *         email:
 *           type: string
 *           description: Email address of the sponsor
 *         occupation:
 *           type: string
 *           description: Occupation of the sponsor
 *         created_at:
 *           type: string
 *           format: date-time
 *           description: Timestamp when record was created
 *       example:
 *         sponsor_id: 1
 *         application_id: 1
 *         name: 'Ahmed Mohammed'
 *         relationship: 'Business Associate'
 *         address: '123 Main St, Tripoli, Libya'
 *         phone_number: '+218912345678'
 *         email: 'ahmed.mohammed@example.com'
 *         occupation: 'Business Owner'
 *         created_at: '2023-05-01T10:15:00Z'
 */

/**
 * Controller for Visa Application operations
 */
export const visaController = {
  /**
   * @swagger
   * /api/visa/applications:
   *   post:
   *     summary: Create a new visa application
   *     tags: [Visas]
   *     description: Submit a new application for a visa
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - first_name
   *               - last_name
   *               - nationality
   *               - passport_number
   *               - passport_expiry_date
   *               - visa_type
   *             properties:
   *               first_name:
   *                 type: string
   *               last_name:
   *                 type: string
   *               gender:
   *                 type: string
   *                 enum: [M, F, Other]
   *               date_of_birth:
   *                 type: string
   *                 format: date
   *               nationality:
   *                 type: string
   *               passport_number:
   *                 type: string
   *               passport_issue_date:
   *                 type: string
   *                 format: date
   *               passport_expiry_date:
   *                 type: string
   *                 format: date
   *               visa_type:
   *                 type: string
   *                 enum: [TOURIST, BUSINESS, STUDENT, WORK, TRANSIT, DIPLOMATIC, MULTIPLE_ENTRY]
   *               entry_type:
   *                 type: string
   *                 enum: [SINGLE, MULTIPLE]
   *                 default: SINGLE
   *               duration_days:
   *                 type: integer
   *                 minimum: 1
   *               embassy_id:
   *                 type: integer
   *               sponsors:
   *                 type: array
   *                 items:
   *                   type: object
   *                   properties:
   *                     name:
   *                       type: string
   *                     relationship:
   *                       type: string
   *                     address:
   *                       type: string
   *                     phone_number:
   *                       type: string
   *                     email:
   *                       type: string
   *                     occupation:
   *                       type: string
   *     responses:
   *       201:
   *         description: Visa application created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VisaApplication'
   *       400:
   *         description: Invalid input data
   *       500:
   *         description: Server error
   */
  createApplication: async (req: Request, res: Response): Promise<void> => {
    try {
      const newApplication = await prisma.visaApplication.create({
        data: req.body,
      });
      res.status(201).json(newApplication);
    } catch (error) {
      console.error("Error creating visa application:", error);
      res.status(500).json({ error: "Failed to create visa application." });
    }
  },

  /**
   * @swagger
   * /api/visa/applications:
   *   get:
   *     summary: Get all visa applications
   *     tags: [Visas]
   *     description: Retrieve a list of all visa applications with optional filtering
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *         description: Filter by application status (comma-separated for multiple values)
   *       - in: query
   *         name: applicant_name
   *         schema:
   *           type: string
   *         description: Filter by applicant's first or last name (partial match)
   *       - in: query
   *         name: nationality
   *         schema:
   *           type: string
   *         description: Filter by applicant's nationality (partial match)
   *       - in: query
   *         name: application_date
   *         schema:
   *           type: string
   *           format: date
   *         description: Filter by application date (exact date match)
   *     responses:
   *       200:
   *         description: A list of visa applications
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 allOf:
   *                   - $ref: '#/components/schemas/VisaApplication'
   *                   - type: object
   *                     properties:
   *                       embassy:
   *                         type: object
   *                       sponsors:
   *                         type: array
   *                         items:
   *                           $ref: '#/components/schemas/Sponsor'
   *       500:
   *         description: Server error
   */
  getAllApplications: async (req: Request, res: Response): Promise<void> => {
    try {
      const { status, applicant_name, application_date, nationality } =
        req.query;

      // Build filter conditions based on query parameters
      const whereClause: Prisma.VisaApplicationWhereInput = {};

      if (status) {
        whereClause.status = status.toString().includes(",")
          ? { in: status.toString().split(",") }
          : status.toString();
      }

      if (applicant_name) {
        // Use OR condition to search in both first_name and last_name
        whereClause.OR = [
          {
            first_name: {
              contains: applicant_name.toString(),
            },
          },
          {
            last_name: {
              contains: applicant_name.toString(),
            },
          },
        ];
      }

      if (nationality) {
        whereClause.nationality = {
          contains: nationality.toString(),
        };
      }

      if (application_date) {
        const date = new Date(application_date.toString());
        whereClause.application_date = {
          gte: date,
          lt: new Date(date.getTime() + 24 * 60 * 60 * 1000), // Add 1 day
        };
      }

      const applications = await prisma.visaApplication.findMany({
        where: whereClause,
        orderBy: { application_date: "desc" },
        include: {
          embassy: true,
          sponsors: true,
        },
      });

      res.json(applications);
    } catch (error) {
      console.error("Error fetching visa applications:", error);
      res.status(500).json({ error: "Failed to fetch visa applications." });
    }
  },

  /**
   * @swagger
   * /api/visa/applications/{id}:
   *   get:
   *     summary: Get a visa application by ID
   *     tags: [Visas]
   *     description: Retrieve detailed information about a visa application including embassy and sponsors
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The visa application ID
   *     responses:
   *       200:
   *         description: Detailed visa application information
   *         content:
   *           application/json:
   *             schema:
   *               allOf:
   *                 - $ref: '#/components/schemas/VisaApplication'
   *                 - type: object
   *                   properties:
   *                     embassy:
   *                       type: object
   *                     sponsors:
   *                       type: array
   *                       items:
   *                         $ref: '#/components/schemas/Sponsor'
   *       404:
   *         description: Visa application not found
   *       500:
   *         description: Server error
   */
  getApplicationById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const application = await prisma.visaApplication.findUnique({
        where: { application_id: parseInt(id, 10) },
        include: {
          embassy: true,
          sponsors: true,
        },
      });

      if (!application) {
        res.status(404).json({ error: "Visa application not found." });
        return;
      }

      res.json(application);
    } catch (error) {
      console.error(`Error fetching visa application ${id}:`, error);
      res.status(500).json({ error: "Failed to fetch visa application." });
    }
  },

  /**
   * @swagger
   * /api/visa/applications/{id}:
   *   put:
   *     summary: Update a visa application by ID
   *     tags: [Visas]
   *     description: Update the details of an existing visa application
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The visa application ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               first_name:
   *                 type: string
   *               last_name:
   *                 type: string
   *               nationality:
   *                 type: string
   *               status:
   *                 type: string
   *                 enum: [SUBMITTED, PROCESSING, APPROVED, REJECTED, ISSUED]
   *               rejection_reason:
   *                 type: string
   *               processing_fee:
   *                 type: number
   *               payment_status:
   *                 type: string
   *                 enum: [PENDING, PAID, REFUNDED]
   *               duration_days:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Visa application updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/VisaApplication'
   *       404:
   *         description: Visa application not found
   *       500:
   *         description: Server error
   */
  updateApplication: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const updatedApplication = await prisma.visaApplication.update({
        where: { application_id: parseInt(id, 10) },
        data: req.body,
      });

      res.json(updatedApplication);
    } catch (error) {
      console.error(`Error updating visa application ${id}:`, error);

      if (
        error instanceof Error &&
        error.message.includes("Record to update not found")
      ) {
        res.status(404).json({ error: "Visa application not found." });
        return;
      }

      res.status(500).json({ error: "Failed to update visa application." });
    }
  },

  /**
   * @swagger
   * /api/visa/applications/{id}:
   *   delete:
   *     summary: Delete a visa application by ID
   *     tags: [Visas]
   *     description: Remove a visa application from the system
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The visa application ID
   *     responses:
   *       204:
   *         description: Visa application successfully deleted
   *       404:
   *         description: Visa application not found
   *       500:
   *         description: Server error
   */
  deleteApplication: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await prisma.visaApplication.delete({
        where: { application_id: parseInt(id, 10) },
      });

      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting visa application ${id}:`, error);

      if (
        error instanceof Error &&
        error.message.includes("Record to delete does not exist")
      ) {
        res.status(404).json({ error: "Visa application not found." });
        return;
      }

      res.status(500).json({ error: "Failed to delete visa application." });
    }
  },
};
