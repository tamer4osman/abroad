import { Request, Response } from "express";
import prisma from "../../utils/prisma";

/**
 * Controller for Legal Proxy operations
 */
export const proxyController = {
  /**
   * Create a new legal proxy
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
   * Get all legal proxies
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
   * Get a legal proxy by ID
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
   * Update a legal proxy by ID
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
   * Delete a legal proxy by ID
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