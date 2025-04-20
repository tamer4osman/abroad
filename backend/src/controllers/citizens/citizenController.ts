import { Request, Response } from "express";
import { z } from 'zod';
import prisma from "../../utils/prisma";
import { Prisma } from '@prisma/client';

// Define a schema for citizen creation
const createCitizenSchema = z.object({
  national_id: z.string(),
  first_name_ar: z.string().min(2),
  last_name_ar: z.string().min(2),
  first_name_en: z.string().min(2),
  last_name_en: z.string().min(2),
  father_name_ar: z.string(),
  father_name_en: z.string(),
  mother_name_ar: z.string(),
  mother_name_en: z.string(),
  gender: z.string(), // M/F/Other
  date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  place_of_birth: z.string(),
  marital_status: z.string(), // SINGLE, MARRIED, DIVORCED, WIDOWED
  occupation: z.string().optional(),
  nationality: z.string().default("Libyan"),
  is_alive: z.boolean().default(true),
});

// Define a schema for advanced search
const searchCitizensSchema = z.object({
  nameAr: z.string().optional(),
  nameEn: z.string().optional(),
  nationalId: z.string().optional(),
  passportNumber: z.string().optional(),
  familyMemberId: z.string().optional(),
  relationship: z.string().optional(),
  birthDateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  birthDateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  registrationDateFrom: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  registrationDateTo: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  gender: z.string().optional(),
  maritalStatus: z.string().optional(),
  isAlive: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(20),
});

/**
 * @swagger
 * components:
 *   schemas:
 *     Citizen:
 *       type: object
 *       required:
 *         - national_id
 *         - first_name_ar
 *         - last_name_ar
 *         - first_name_en
 *         - last_name_en
 *         - gender
 *         - date_of_birth
 *         - place_of_birth
 *         - marital_status
 *       properties:
 *         citizen_id:
 *           type: integer
 *           description: The auto-generated ID of the citizen
 *         national_id:
 *           type: string
 *           description: National ID number of the citizen
 *         first_name_ar:
 *           type: string
 *           description: First name in Arabic
 *         last_name_ar:
 *           type: string
 *           description: Last name in Arabic
 *         first_name_en:
 *           type: string
 *           description: First name in English
 *         last_name_en:
 *           type: string
 *           description: Last name in English
 *         father_name_ar:
 *           type: string
 *           description: Father's name in Arabic
 *         father_name_en:
 *           type: string
 *           description: Father's name in English
 *         mother_name_ar:
 *           type: string
 *           description: Mother's name in Arabic
 *         mother_name_en:
 *           type: string
 *           description: Mother's name in English
 *         gender:
 *           type: string
 *           description: Gender of the citizen (M/F/Other)
 *         date_of_birth:
 *           type: string
 *           format: date
 *           description: Date of birth
 *         place_of_birth:
 *           type: string
 *           description: Place of birth
 *         marital_status:
 *           type: string
 *           enum: [SINGLE, MARRIED, DIVORCED, WIDOWED]
 *           description: Marital status
 *         occupation:
 *           type: string
 *           description: Occupation or profession
 *         nationality:
 *           type: string
 *           description: Nationality of the citizen
 *           default: Libyan
 *         is_alive:
 *           type: boolean
 *           description: Whether the citizen is alive
 *           default: true
 *         registration_date:
 *           type: string
 *           format: date-time
 *           description: Date when the citizen was registered
 *       example:
 *         citizen_id: 1
 *         national_id: '1234567890'
 *         first_name_ar: 'محمد'
 *         last_name_ar: 'علي'
 *         first_name_en: 'Mohammed'
 *         last_name_en: 'Ali'
 *         father_name_ar: 'أحمد'
 *         father_name_en: 'Ahmed'
 *         mother_name_ar: 'فاطمة'
 *         mother_name_en: 'Fatima'
 *         gender: 'M'
 *         date_of_birth: '1990-01-01'
 *         place_of_birth: 'Tripoli'
 *         marital_status: 'SINGLE'
 *         occupation: 'Engineer'
 *         nationality: 'Libyan'
 *         is_alive: true
 *         registration_date: '2023-01-01T12:00:00Z'
 */

/**
 * Controller for Citizen-related operations
 */
export const citizenController = {
  /**
   * @swagger
   * /api/citizens:
   *   post:
   *     summary: Create a new citizen
   *     tags: [Citizens]
   *     description: Register a new citizen in the system with personal information
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - national_id
   *               - first_name_ar
   *               - last_name_ar
   *               - first_name_en
   *               - last_name_en
   *               - father_name_ar
   *               - father_name_en
   *               - mother_name_ar
   *               - mother_name_en
   *               - gender
   *               - date_of_birth
   *               - place_of_birth
   *               - marital_status
   *             properties:
   *               national_id:
   *                 type: string
   *               first_name_ar:
   *                 type: string
   *                 minLength: 2
   *               last_name_ar:
   *                 type: string
   *                 minLength: 2
   *               first_name_en:
   *                 type: string
   *                 minLength: 2
   *               last_name_en:
   *                 type: string
   *                 minLength: 2
   *               father_name_ar:
   *                 type: string
   *               father_name_en:
   *                 type: string
   *               mother_name_ar:
   *                 type: string
   *               mother_name_en:
   *                 type: string
   *               gender:
   *                 type: string
   *                 description: M/F/Other
   *               date_of_birth:
   *                 type: string
   *                 format: date
   *                 pattern: '^\d{4}-\d{2}-\d{2}$'
   *               place_of_birth:
   *                 type: string
   *               marital_status:
   *                 type: string
   *                 enum: [SINGLE, MARRIED, DIVORCED, WIDOWED]
   *               occupation:
   *                 type: string
   *               nationality:
   *                 type: string
   *                 default: Libyan
   *               is_alive:
   *                 type: boolean
   *                 default: true
   *     responses:
   *       201:
   *         description: Citizen created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Citizen'
   *       400:
   *         description: Invalid input data
   *       500:
   *         description: Server error
   */
  createCitizen: async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate the request body using the schema
      const validatedData = createCitizenSchema.parse(req.body);
      
      // Convert string date to Date object for Prisma
      const dateOfBirth = new Date(validatedData.date_of_birth);

      const newCitizen = await prisma.citizen.create({
        data: {
          national_id: validatedData.national_id,
          first_name_ar: validatedData.first_name_ar,
          last_name_ar: validatedData.last_name_ar,
          first_name_en: validatedData.first_name_en,
          last_name_en: validatedData.last_name_en,
          father_name_ar: validatedData.father_name_ar,
          father_name_en: validatedData.father_name_en,
          mother_name_ar: validatedData.mother_name_ar,
          mother_name_en: validatedData.mother_name_en,
          gender: validatedData.gender,
          date_of_birth: dateOfBirth,
          place_of_birth: validatedData.place_of_birth,
          marital_status: validatedData.marital_status,
          occupation: validatedData.occupation,
          nationality: validatedData.nationality,
          is_alive: validatedData.is_alive,
        },
      });
      res.status(201).json(newCitizen);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        res.status(400).json({ error: "Invalid input data.", details: error.errors });
        return;
      }
      console.error("Error creating citizen:", error);
      res.status(500).json({ error: "Failed to create citizen." });
    }
  },

  /**
   * @swagger
   * /api/citizens:
   *   get:
   *     summary: Get all citizens
   *     tags: [Citizens]
   *     description: Retrieve a list of all citizens in the system
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER, MANAGER]
   *     responses:
   *       200:
   *         description: A list of citizens
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Citizen'
   *       500:
   *         description: Server error
   */
  getAllCitizens: async (req: Request, res: Response): Promise<void> => {
    try {
      const citizens = await prisma.citizen.findMany({
        // Add pagination, filtering, sorting as needed
        orderBy: { registration_date: "desc" },
      });
      res.json(citizens);
    } catch (error) {
      console.error("Error fetching citizens:", error);
      res.status(500).json({ error: "Failed to fetch citizens." });
    }
  },

  /**
   * @swagger
   * /api/citizens/{id}:
   *   get:
   *     summary: Get a citizen by ID
   *     tags: [Citizens]
   *     description: Retrieve detailed information about a citizen by their ID
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER, MANAGER]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The citizen ID
   *     responses:
   *       200:
   *         description: Detailed citizen information
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Citizen'
   *       404:
   *         description: Citizen not found
   *       500:
   *         description: Server error
   */
  getCitizenById: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const citizen = await prisma.citizen.findUnique({
        where: { citizen_id: parseInt(id, 10) },
        // include related data if needed
      });
      
      if (!citizen) {
        res.status(404).json({ error: "Citizen not found." });
        return;
      }
      
      res.json(citizen);
    } catch (error) {
      console.error(`Error fetching citizen ${id}:`, error);
      res.status(500).json({ error: "Failed to fetch citizen." });
    }
  },

  /**
   * @swagger
   * /api/citizens/{id}:
   *   put:
   *     summary: Update a citizen by ID
   *     tags: [Citizens]
   *     description: Update citizen information by ID
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The citizen ID
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               first_name_ar:
   *                 type: string
   *               last_name_ar:
   *                 type: string
   *               first_name_en:
   *                 type: string
   *               last_name_en:
   *                 type: string
   *               father_name_ar:
   *                 type: string
   *               father_name_en:
   *                 type: string
   *               mother_name_ar:
   *                 type: string
   *               mother_name_en:
   *                 type: string
   *               gender:
   *                 type: string
   *               date_of_birth:
   *                 type: string
   *                 format: date
   *               place_of_birth:
   *                 type: string
   *               marital_status:
   *                 type: string
   *               occupation:
   *                 type: string
   *               nationality:
   *                 type: string
   *               is_alive:
   *                 type: boolean
   *     responses:
   *       200:
   *         description: Citizen updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Citizen'
   *       404:
   *         description: Citizen not found
   *       500:
   *         description: Server error
   */
  updateCitizen: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      const updatedCitizen = await prisma.citizen.update({
        where: { citizen_id: parseInt(id, 10) },
        data: req.body,
      });
      
      res.json(updatedCitizen);
    } catch (error) {
      console.error(`Error updating citizen ${id}:`, error);
      
      // Check if this is a "not found" error
      if (error instanceof Error && error.message.includes("Record to update not found")) {
        res.status(404).json({ error: "Citizen not found." });
        return;
      }
      
      res.status(500).json({ error: "Failed to update citizen." });
    }
  },

  /**
   * @swagger
   * /api/citizens/{id}:
   *   delete:
   *     summary: Delete a citizen by ID
   *     tags: [Citizens]
   *     description: Remove a citizen from the system
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *         description: The citizen ID
   *     responses:
   *       204:
   *         description: Citizen successfully deleted
   *       404:
   *         description: Citizen not found
   *       500:
   *         description: Server error
   */
  deleteCitizen: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    try {
      await prisma.citizen.delete({
        where: { citizen_id: parseInt(id, 10) },
      });
      
      res.status(204).send();
    } catch (error) {
      console.error(`Error deleting citizen ${id}:`, error);
      
      // Check if this is a "not found" error
      if (error instanceof Error && error.message.includes("Record to delete does not exist")) {
        res.status(404).json({ error: "Citizen not found." });
        return;
      }
      
      res.status(500).json({ error: "Failed to delete citizen." });
    }
  },
  
  /**
   * @swagger
   * /api/citizens/search:
   *   get:
   *     summary: Advanced search for citizens
   *     tags: [Citizens]
   *     description: Search for citizens using multiple criteria and filters with pagination
   *     security:
   *       - bearerAuth: []
   *     x-roles-required: [ADMIN, OFFICER, MANAGER]
   *     parameters:
   *       - in: query
   *         name: nameAr
   *         schema:
   *           type: string
   *         description: Name in Arabic to search for
   *       - in: query
   *         name: nameEn
   *         schema:
   *           type: string
   *         description: Name in English to search for
   *       - in: query
   *         name: nationalId
   *         schema:
   *           type: string
   *         description: National ID to search for
   *       - in: query
   *         name: passportNumber
   *         schema:
   *           type: string
   *         description: Passport number to search for
   *       - in: query
   *         name: familyMemberId
   *         schema:
   *           type: string
   *         description: Family member ID to search for relationships
   *       - in: query
   *         name: relationship
   *         schema:
   *           type: string
   *         description: Type of family relationship
   *       - in: query
   *         name: birthDateFrom
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for birth date range (YYYY-MM-DD)
   *       - in: query
   *         name: birthDateTo
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for birth date range (YYYY-MM-DD)
   *       - in: query
   *         name: registrationDateFrom
   *         schema:
   *           type: string
   *           format: date
   *         description: Start date for registration date range (YYYY-MM-DD)
   *       - in: query
   *         name: registrationDateTo
   *         schema:
   *           type: string
   *           format: date
   *         description: End date for registration date range (YYYY-MM-DD)
   *       - in: query
   *         name: gender
   *         schema:
   *           type: string
   *         description: Gender filter (M/F/Other)
   *       - in: query
   *         name: maritalStatus
   *         schema:
   *           type: string
   *         description: Marital status filter (SINGLE, MARRIED, DIVORCED, WIDOWED)
   *       - in: query
   *         name: isAlive
   *         schema:
   *           type: boolean
   *         description: Filter by alive status
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *         description: Page number for pagination
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 20
   *         description: Number of items per page
   *     responses:
   *       200:
   *         description: Search results with pagination metadata
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Citizen'
   *                 pagination:
   *                   type: object
   *                   properties:
   *                     totalCount:
   *                       type: integer
   *                       description: Total number of citizens matching the search criteria
   *                     currentPage:
   *                       type: integer
   *                       description: Current page number
   *                     pageSize:
   *                       type: integer
   *                       description: Number of items per page
   *                     totalPages:
   *                       type: integer
   *                       description: Total number of pages
   *                     hasNextPage:
   *                       type: boolean
   *                       description: Whether there is a next page
   *                     hasPreviousPage:
   *                       type: boolean
   *                       description: Whether there is a previous page
   *       400:
   *         description: Invalid search parameters
   *       500:
   *         description: Server error
   */
  searchCitizens: async (req: Request, res: Response): Promise<void> => {
    try {
      // Parse and validate query parameters
      const parsedQuery = searchCitizensSchema.safeParse(req.query);
      
      if (!parsedQuery.success) {
        res.status(400).json({ 
          error: "Invalid search parameters", 
          details: parsedQuery.error.errors 
        });
        return;
      }
      
      const {
        nameAr,
        nameEn,
        nationalId,
        passportNumber,
        familyMemberId,
        relationship,
        birthDateFrom,
        birthDateTo,
        registrationDateFrom,
        registrationDateTo,
        gender,
        maritalStatus,
        isAlive,
        page,
        pageSize
      } = parsedQuery.data;
      
      // Build where clause based on search criteria
      const whereClause: Prisma.CitizenWhereInput = {};
      
      // Name search (Arabic)
      if (nameAr) {
        whereClause.OR = [
          { first_name_ar: { contains: nameAr } },
          { last_name_ar: { contains: nameAr } },
          { father_name_ar: { contains: nameAr } },
          { mother_name_ar: { contains: nameAr } },
        ];
      }
      
      // Name search (English)
      if (nameEn) {
        // If we already have OR conditions from nameAr, we need to merge them
        const nameEnConditions = [
          { first_name_en: { contains: nameEn } },
          { last_name_en: { contains: nameEn } },
          { father_name_en: { contains: nameEn } },
          { mother_name_en: { contains: nameEn } },
        ];
        
        if (whereClause.OR) {
          // Combine with existing OR conditions using AND
          whereClause.AND = [
            { OR: whereClause.OR },
            { OR: nameEnConditions },
          ];
          delete whereClause.OR;
        } else {
          whereClause.OR = nameEnConditions;
        }
      }
      
      // National ID search
      if (nationalId) {
        whereClause.national_id = { contains: nationalId };
      }
      
      // Passport search - we'll need to include related passport records
      if (passportNumber) {
        whereClause.passports = {
          some: {
            passport_number: { contains: passportNumber },
          },
        };
      }
      
      // Family relationship search
      if (familyMemberId || relationship) {
        const familyCondition: Prisma.FamilyRelationshipWhereInput = {};
        
        if (familyMemberId) {
          familyCondition.related_citizen_id = parseInt(familyMemberId, 10);
        }
        
        if (relationship) {
          familyCondition.relationship_type = relationship;
        }
        
        whereClause.familyRelations = {
          some: familyCondition,
        };
      }
      
      // Date range searches
      if (birthDateFrom || birthDateTo) {
        whereClause.date_of_birth = {};
        
        if (birthDateFrom) {
          whereClause.date_of_birth.gte = new Date(birthDateFrom);
        }
        
        if (birthDateTo) {
          whereClause.date_of_birth.lte = new Date(birthDateTo);
        }
      }
      
      // Registration date range
      if (registrationDateFrom || registrationDateTo) {
        whereClause.registration_date = {};
        
        if (registrationDateFrom) {
          whereClause.registration_date.gte = new Date(registrationDateFrom);
        }
        
        if (registrationDateTo) {
          whereClause.registration_date.lte = new Date(registrationDateTo);
        }
      }
      
      // Gender filter
      if (gender) {
        whereClause.gender = gender;
      }
      
      // Marital status filter
      if (maritalStatus) {
        whereClause.marital_status = maritalStatus;
      }
      
      // Alive status filter
      if (isAlive !== undefined) {
        whereClause.is_alive = isAlive;
      }
      
      // Calculate pagination
      const skip = (page - 1) * pageSize;
      
      // Execute the search query
      const [citizens, totalCount] = await Promise.all([
        prisma.citizen.findMany({
          where: whereClause,
          skip,
          take: pageSize,
          orderBy: { registration_date: 'desc' },
          include: {
            passports: true,
            familyRelations: {
              include: {
                related_citizen: {
                  select: {
                    citizen_id: true,
                    first_name_ar: true,
                    last_name_ar: true,
                    first_name_en: true,
                    last_name_en: true,
                  }
                }
              }
            },
            contactInfos: true
          }
        }),
        prisma.citizen.count({ where: whereClause }),
      ]);
      
      // Return paginated results with metadata
      res.json({
        data: citizens,
        pagination: {
          totalCount,
          currentPage: page,
          pageSize,
          totalPages: Math.ceil(totalCount / pageSize),
          hasNextPage: skip + citizens.length < totalCount,
          hasPreviousPage: page > 1,
        },
      });
      
    } catch (error) {
      console.error("Error searching citizens:", error);
      res.status(500).json({ error: "Failed to search citizens." });
    }
  }
};

// Example in a route file
// router.post('/', validate(createCitizenSchema), citizenController.createCitizen);
// router.get('/search', citizenController.searchCitizens);