import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller for Passport Application operations
 */
export const passportController = {
  /**
   * Create a new passport application
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
   * Get all passport applications
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
   * Get a passport application by ID
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
   * Update a passport application by ID
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
   * Delete a passport application by ID
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