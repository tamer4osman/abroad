import { Request, Response } from "express";
import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * Controller for Visa Application operations
 */
export const visaController = {
  /**
   * Create a new visa application
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
   * Get all visa applications with optional filtering
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
   * Get a visa application by ID
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
   * Update a visa application by ID
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
   * Delete a visa application by ID
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
