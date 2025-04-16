import { Request, Response } from "express";
import { z } from 'zod';
import prisma from "../../utils/prisma";

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

/**
 * Controller for Citizen-related operations
 */
export const citizenController = {
  /**
   * Create a new citizen
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
   * Get all citizens
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
   * Get a single citizen by ID
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
   * Update a citizen by ID
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
   * Delete a citizen by ID
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
  }
};

// Example in a route file
// router.post('/', validate(createCitizenSchema), citizenController.createCitizen);