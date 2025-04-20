import { Request, Response } from "express";
import prisma from "../../utils/prisma";

// Add type definitions at the top of the file
interface StatusCount {
  status: string;
  count: number | bigint;
}

interface TypeCount {
  attestation_type: string;
  count: number | bigint;
}

interface MonthlyTrend {
  month: string;
  count: number | bigint;
}

interface AttestationFilter {
  status?: string;
  attestation_type?: string;
  citizen_id?: number;
}

interface AttestationStatusUpdate {
  status: string;
  rejection_reason?: string;
  attested_document_key?: string;
  notes?: string;
  completion_date?: Date;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Attestation:
 *       type: object
 *       required:
 *         - document_type
 *         - citizen_id
 *         - attestation_type
 *       properties:
 *         attestation_id:
 *           type: integer
 *           description: The auto-generated ID of the attestation
 *         document_type:
 *           type: string
 *           enum: [BIRTH_CERTIFICATE, MARRIAGE_CERTIFICATE, DEGREE, COMMERCIAL_DOC, LEGAL_DOC, MEDICAL_DOC, OTHER]
 *           description: Type of document being attested
 *         document_number:
 *           type: string
 *           description: Original document reference number
 *         document_issue_date:
 *           type: string
 *           format: date
 *           description: Issue date of the original document
 *         citizen_id:
 *           type: integer
 *           description: ID of the citizen requesting attestation
 *         foreign_entity:
 *           type: string
 *           description: Foreign entity involved (university, government, etc.)
 *         country_of_use:
 *           type: string
 *           description: Country where the attested document will be used
 *         attestation_type:
 *           type: string
 *           enum: [LOCAL, INTERNATIONAL, APOSTILLE]
 *           description: Type of attestation requested
 *         status:
 *           type: string
 *           enum: [SUBMITTED, IN_REVIEW, APPROVED, REJECTED, COMPLETED]
 *           description: Current status of the attestation request
 *         rejection_reason:
 *           type: string
 *           description: Reason for rejection if status is REJECTED
 *         application_date:
 *           type: string
 *           format: date-time
 *           description: Date when the attestation was requested
 *         completion_date:
 *           type: string
 *           format: date-time
 *           description: Date when the attestation was completed
 *         document_key:
 *           type: string
 *           description: Reference to the uploaded document file
 *         attested_document_key:
 *           type: string
 *           description: Reference to the attested document file
 *         fee_amount:
 *           type: number
 *           description: Fee charged for the attestation service
 *         payment_status:
 *           type: string
 *           enum: [PENDING, PAID, WAIVED]
 *           description: Status of payment for this attestation
 *         notes:
 *           type: string
 *           description: Additional notes or comments
 *       example:
 *         attestation_id: 1
 *         document_type: "DEGREE"
 *         document_number: "ABC123456"
 *         document_issue_date: "2023-01-15"
 *         citizen_id: 123
 *         foreign_entity: "University of London"
 *         country_of_use: "United Kingdom"
 *         attestation_type: "INTERNATIONAL"
 *         status: "APPROVED"
 *         application_date: "2023-05-10T09:30:00Z"
 *         completion_date: "2023-05-15T14:45:00Z"
 *         document_key: "attestations/original/abc123.pdf"
 *         attested_document_key: "attestations/approved/abc123_attested.pdf"
 *         fee_amount: 50.00
 *         payment_status: "PAID"
 *         notes: "Urgent processing requested"
 */

/**
 * Controller for document attestation operations
 */
export const attestationController = {
  /**
   * @swagger
   * /api/attestation/requests:
   *   post:
   *     summary: Submit a new attestation request
   *     tags: [Attestations]
   *     description: Submit a new request for document attestation
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER, USER]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - document_type
   *               - citizen_id
   *               - attestation_type
   *             properties:
   *               document_type:
   *                 type: string
   *                 enum: [BIRTH_CERTIFICATE, MARRIAGE_CERTIFICATE, DEGREE, COMMERCIAL_DOC, LEGAL_DOC, MEDICAL_DOC, OTHER]
   *               document_number:
   *                 type: string
   *               document_issue_date:
   *                 type: string
   *                 format: date
   *               citizen_id:
   *                 type: integer
   *               foreign_entity:
   *                 type: string
   *               country_of_use:
   *                 type: string
   *               attestation_type:
   *                 type: string
   *                 enum: [LOCAL, INTERNATIONAL, APOSTILLE]
   *               document_key:
   *                 type: string
   *                 description: Key of the uploaded document file
   *               notes:
   *                 type: string
   *     responses:
   *       201:
   *         description: Attestation request submitted successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Attestation'
   *       400:
   *         description: Invalid input data
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  submitAttestationRequest: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      // Implementation would extract data from request and create a new attestation record
      // Here's a sample of how it would be structured:
      const {
        document_type,
        document_number,
        document_issue_date,
        citizen_id,
        foreign_entity,
        country_of_use,
        attestation_type,
        document_key,
        notes,
      } = req.body;

      // Example validation (would use zod in a real implementation)
      if (!document_type || !citizen_id || !attestation_type) {
        res.status(400).json({
          error:
            "Required fields missing: document_type, citizen_id, and attestation_type are required",
        });
        return;
      }

      // First create an attestation request record
      const newAttestationRequest = await prisma.attestationRequest.create({
        data: {
          requestor_name: req.body.requestor_name || "Default Requestor",
          requestor_id_type: req.body.requestor_id_type || "NATIONAL_ID",
          requestor_id_number: req.body.requestor_id_number || "N/A",
          contact_phone: req.body.contact_phone || "N/A",
          contact_email: req.body.contact_email,
          attestation_type: req.body.attestation_type || "PERSONAL",
          document_type: document_type,
          document_description: req.body.document_description,
          issuing_authority: req.body.issuing_authority,
          target_country: country_of_use,
          is_apostille: attestation_type === "APOSTILLE",
          fee_amount: calculateFee(attestation_type) || 0,
          embassy: { connect: { embassy_id: req.body.embassy_id || 1 } }, // Default to embassy ID 1 if not provided
          status: "PENDING",
        },
      });

      // Then create the attestation record with the relation to the request
      const newAttestation = await prisma.attestation.create({
        data: {
          document_type,
          document_number,
          document_issue_date: document_issue_date
            ? new Date(document_issue_date)
            : undefined,
          citizen: {
            connect: { citizen_id: parseInt(citizen_id.toString(), 10) },
          },
          foreign_entity,
          country_of_use,
          attestation_type,
          document_key,
          notes,
          status: "SUBMITTED",
          application_date: new Date(),
          fee_amount: calculateFee(attestation_type) || 0, // Function to calculate fee based on type
          payment_status: "PENDING",
          request: {
            connect: { request_id: newAttestationRequest.request_id },
          },
        },
      });

      res.status(201).json(newAttestation);
    } catch (error) {
      console.error("Error creating attestation request:", error);
      res.status(500).json({ error: "Failed to submit attestation request" });
    }
  },

  /**
   * @swagger
   * /api/attestation/requests:
   *   get:
   *     summary: Get all attestation requests
   *     tags: [Attestations]
   *     description: Retrieve all attestation requests with optional filtering
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER, MANAGER]
   *     parameters:
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [SUBMITTED, IN_REVIEW, APPROVED, REJECTED, COMPLETED]
   *         description: Filter by status
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [LOCAL, INTERNATIONAL, APOSTILLE]
   *         description: Filter by attestation type
   *       - in: query
   *         name: citizenId
   *         schema:
   *           type: integer
   *         description: Filter by citizen ID
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Items per page
   *     responses:
   *       200:
   *         description: List of attestation requests
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Attestation'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     totalCount:
   *                       type: integer
   *                     currentPage:
   *                       type: integer
   *                     pageSize:
   *                       type: integer
   *                     totalPages:
   *                       type: integer
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  getAllAttestationRequests: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { status, type, citizenId, page = 1, pageSize = 20 } = req.query;

      const filter: AttestationFilter = {};

      // Apply filters with proper type casting
      if (status) filter.status = status.toString();
      if (type) filter.attestation_type = type.toString();
      if (citizenId) filter.citizen_id = parseInt(citizenId.toString(), 10);

      // Pagination
      const skip =
        (parseInt(page.toString(), 10) - 1) * parseInt(pageSize.toString(), 10);
      const take = parseInt(pageSize.toString(), 10);

      // Query database
      const [attestations, totalCount] = await Promise.all([
        prisma.attestation.findMany({
          where: filter,
          skip,
          take,
          orderBy: { application_date: "desc" },
          include: {
            citizen: {
              select: {
                citizen_id: true,
                first_name_en: true,
                last_name_en: true,
                national_id: true,
              },
            },
          },
        }),
        prisma.attestation.count({ where: filter }),
      ]);

      // Return paginated results
      res.json({
        data: attestations,
        pagination: {
          totalCount,
          currentPage: parseInt(page.toString(), 10),
          pageSize: take,
          totalPages: Math.ceil(totalCount / take),
        },
      });
    } catch (error) {
      console.error("Error fetching attestation requests:", error);
      res
        .status(500)
        .json({ error: "Failed to retrieve attestation requests" });
    }
  },

  /**
   * @swagger
   * /api/attestation/requests/{id}:
   *   get:
   *     summary: Get attestation request by ID
   *     tags: [Attestations]
   *     description: Retrieve detailed information about a specific attestation request
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER, MANAGER]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Attestation ID
   *     responses:
   *       200:
   *         description: Attestation details
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Attestation'
   *       404:
   *         description: Attestation not found
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  getAttestationById: async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;

      const attestation = await prisma.attestation.findUnique({
        where: { attestation_id: parseInt(id, 10) },
        include: {
          citizen: {
            select: {
              citizen_id: true,
              first_name_en: true,
              last_name_en: true,
              first_name_ar: true,
              last_name_ar: true,
              national_id: true,
              date_of_birth: true,
              nationality: true,
            },
          },
        },
      });

      if (!attestation) {
        res.status(404).json({ error: "Attestation request not found" });
        return;
      }

      res.json(attestation);
    } catch (error) {
      console.error(`Error fetching attestation ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to retrieve attestation request" });
    }
  },

  /**
   * @swagger
   * /api/attestation/requests/{id}/status:
   *   put:
   *     summary: Update attestation status
   *     tags: [Attestations]
   *     description: Update the status of an attestation request (e.g., approve, reject, complete)
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: Attestation ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [IN_REVIEW, APPROVED, REJECTED, COMPLETED]
   *               rejection_reason:
   *                 type: string
   *                 description: Required if status is REJECTED
   *               attested_document_key:
   *                 type: string
   *                 description: Key of the attested document file (required if COMPLETED)
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Attestation status updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Attestation'
   *       400:
   *         description: Invalid input or transition
   *       404:
   *         description: Attestation not found
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  updateAttestationStatus: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const { status, rejection_reason, attested_document_key, notes } =
        req.body;

      // Validate status
      if (
        !status ||
        !["IN_REVIEW", "APPROVED", "REJECTED", "COMPLETED"].includes(status)
      ) {
        res.status(400).json({ error: "Invalid status value" });
        return;
      }

      // Check if attestation exists
      const attestation = await prisma.attestation.findUnique({
        where: { attestation_id: parseInt(id, 10) },
      });

      if (!attestation) {
        res.status(404).json({ error: "Attestation request not found" });
        return;
      }

      // Validate status transition
      if (!isValidStatusTransition(attestation.status, status)) {
        res.status(400).json({
          error: `Invalid status transition from ${attestation.status} to ${status}`,
        });
        return;
      }

      // Require reason for rejection
      if (status === "REJECTED" && !rejection_reason) {
        res.status(400).json({ error: "Rejection reason is required" });
        return;
      }

      // Require attested document for completion
      if (status === "COMPLETED" && !attested_document_key) {
        res
          .status(400)
          .json({ error: "Attested document key is required for completion" });
        return;
      }

      // Update the attestation
      const updateData: AttestationStatusUpdate = { status };

      if (rejection_reason) updateData.rejection_reason = rejection_reason;
      if (attested_document_key)
        updateData.attested_document_key = attested_document_key;
      if (notes) updateData.notes = notes;

      // Set completion date if status is COMPLETED
      if (status === "COMPLETED") {
        updateData.completion_date = new Date();
      }

      const updatedAttestation = await prisma.attestation.update({
        where: { attestation_id: parseInt(id, 10) },
        data: updateData,
      });

      res.json(updatedAttestation);
    } catch (error) {
      console.error(`Error updating attestation ${req.params.id}:`, error);
      res.status(500).json({ error: "Failed to update attestation status" });
    }
  },

  /**
   * @swagger
   * /api/attestation/citizen/{citizenId}:
   *   get:
   *     summary: Get attestations by citizen ID
   *     tags: [Attestations]
   *     description: Retrieve all attestation requests for a specific citizen
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER, MANAGER]
   *     parameters:
   *       - in: path
   *         name: citizenId
   *         required: true
   *         schema:
   *           type: integer
   *         description: ID of the citizen
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [SUBMITTED, IN_REVIEW, APPROVED, REJECTED, COMPLETED]
   *         description: Filter by status
   *     responses:
   *       200:
   *         description: List of attestation requests for the citizen
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Attestation'
   *       401:
   *         description: Unauthorized
   *       500:
   *         description: Server error
   */
  getAttestationsByCitizen: async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { citizenId } = req.params;
      const { status } = req.query;

      const filter: AttestationFilter = {
        citizen_id: parseInt(citizenId, 10),
      };

      if (status) filter.status = status.toString();

      const attestations = await prisma.attestation.findMany({
        where: filter,
        orderBy: { application_date: "desc" },
      });

      res.json(attestations);
    } catch (error) {
      console.error(
        `Error fetching attestations for citizen ${req.params.citizenId}:`,
        error
      );
      res
        .status(500)
        .json({ error: "Failed to retrieve attestation requests" });
    }
  },

  /**
   * @swagger
   * /api/attestation/stats:
   *   get:
   *     summary: Get attestation statistics
   *     tags: [Attestations]
   *     description: Retrieve statistics about attestation requests (counts by status, type, etc.)
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, MANAGER]
   *     responses:
   *       200:
   *         description: Attestation statistics
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 totalCount:
   *                   type: integer
   *                 byStatus:
   *                   type: object
   *                   additionalProperties:
   *                     type: integer
   *                 byType:
   *                   type: object
   *                   additionalProperties:
   *                     type: integer
   *                 monthlyTrends:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       month:
   *                         type: string
   *                       count:
   *                         type: integer
   *             example:
   *               totalCount: 250
   *               byStatus:
   *                 SUBMITTED: 42
   *                 IN_REVIEW: 58
   *                 APPROVED: 35
   *                 REJECTED: 15
   *                 COMPLETED: 100
   *               byType:
   *                 LOCAL: 85
   *                 INTERNATIONAL: 145
   *                 APOSTILLE: 20
   *               monthlyTrends:
   *                 - month: "2025-01"
   *                   count: 35
   *                 - month: "2025-02"
   *                   count: 48
   *                 - month: "2025-03"
   *                   count: 62
   *                 - month: "2025-04"
   *                   count: 55
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       500:
   *         description: Server error
   */
  getAttestationStats: async (req: Request, res: Response): Promise<void> => {
    try {
      // Get total count
      const totalCount = await prisma.attestation.count();

      // Get counts by status
      const statusCounts = await prisma.$queryRaw<StatusCount[]>`
        SELECT status, COUNT(*) as count
        FROM Attestation
        GROUP BY status
      `;

      // Get counts by attestation type
      const typeCounts = await prisma.$queryRaw<TypeCount[]>`
        SELECT attestation_type, COUNT(*) as count
        FROM Attestation
        GROUP BY attestation_type
      `;

      // Get monthly trends for the past 6 months
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

      const monthlyTrends = await prisma.$queryRaw<MonthlyTrend[]>`
        SELECT 
          DATE_FORMAT(application_date, '%Y-%m') as month,
          COUNT(*) as count
        FROM Attestation
        WHERE application_date >= ${sixMonthsAgo}
        GROUP BY DATE_FORMAT(application_date, '%Y-%m')
        ORDER BY month ASC
      `;

      // Format the response
      const byStatus: Record<string, number> = {};
      const byType: Record<string, number> = {};

      (statusCounts as StatusCount[]).forEach((item) => {
        byStatus[item.status] = Number(item.count);
      });

      (typeCounts as TypeCount[]).forEach((item) => {
        byType[item.attestation_type] = Number(item.count);
      });

      res.json({
        totalCount,
        byStatus,
        byType,
        monthlyTrends: (monthlyTrends as MonthlyTrend[]).map((item) => ({
          month: item.month,
          count: Number(item.count),
        })),
      });
    } catch (error) {
      console.error("Error generating attestation statistics:", error);
      res
        .status(500)
        .json({ error: "Failed to retrieve attestation statistics" });
    }
  },
};

/**
 * Calculate fee based on attestation type
 * This would typically be a more complex function based on business rules
 */
function calculateFee(attestationType: string): number {
  switch (attestationType) {
    case "LOCAL":
      return 25.0;
    case "INTERNATIONAL":
      return 50.0;
    case "APOSTILLE":
      return 75.0;
    default:
      return 25.0;
  }
}

/**
 * Validate attestation status transitions
 * Define allowed transitions between statuses
 */
function isValidStatusTransition(
  currentStatus: string,
  newStatus: string
): boolean {
  const allowedTransitions: Record<string, string[]> = {
    SUBMITTED: ["IN_REVIEW", "REJECTED"],
    IN_REVIEW: ["APPROVED", "REJECTED"],
    APPROVED: ["COMPLETED"],
    REJECTED: [], // Terminal state
    COMPLETED: [], // Terminal state
  };

  // Get allowed transitions for current status
  // Use type assertion to tell TypeScript that currentStatus is a valid key
  const allowed =
    allowedTransitions[currentStatus as keyof typeof allowedTransitions] || [];

  // Check if new status is in the allowed transitions
  return allowed.includes(newStatus);
}
