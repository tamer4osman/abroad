import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { z } from 'zod';

const prisma = new PrismaClient();

// Define a schema for citizen creation
const createCitizenSchema = z.object({
  first_name: z.string().min(2),
  last_name: z.string().min(2),
  birth_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  // Add other fields as needed
});

/**
 * Controller for Citizen-related operations
 */
export const citizenController = {
  /**F
   * Create a new citizen
   */
  createCitizen: async (req: Request, res: Response): Promise<void> => {
    try {
      // Validate the request body using the schema
      const validatedData = createCitizenSchema.parse(req.body);

      const newCitizen = await prisma.citizen.create({
        data: validatedData, // Use validated data
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
        orderBy: { created_at: "desc" },
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