import { Request, Response } from "express";
import path from "path";
import fs from "fs";

/**
 * @swagger
 * tags:
 *   name: Version
 *   description: API version information
 */

/**
 * Get package.json version for API versioning
 */
const getApiVersion = (): { version: string, major: string, minor: string, patch: string } => {
  try {
    const packageJsonPath = path.resolve(__dirname, '../../../package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const version = packageJson.version || '1.0.0';
    const [major, minor, patch] = version.split('.');
    return { 
      version, 
      major: major || '1', 
      minor: minor || '0', 
      patch: patch || '0' 
    };
  } catch (error) {
    console.error("Error reading package.json version:", error);
    return { version: '1.0.0', major: '1', minor: '0', patch: '0' };
  }
};

/**
 * Controller for API version information
 */
export const versionController = {
  /**
   * @swagger
   * /api/version:
   *   get:
   *     summary: Get API version information
   *     tags: [Version]
   *     description: Returns information about the current API version and support status
   *     security: []  # No authentication required
   *     responses:
   *       200:
   *         description: Version information retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 currentVersion:
   *                   type: object
   *                   properties:
   *                     version:
   *                       type: string
   *                       description: Full version number
   *                     released:
   *                       type: string
   *                       format: date
   *                       description: Release date of this version
   *                     supportUntil:
   *                       type: string
   *                       format: date
   *                       description: End of support date
   *                     isLatest:
   *                       type: boolean
   *                       description: Whether this is the latest version
   *                 supportedVersions:
   *                   type: array
   *                   items:
   *                     type: object
   *                     properties:
   *                       version:
   *                         type: string
   *                         description: Full version number
   *                       url:
   *                         type: string
   *                         description: Base URL for this version
   *                       supportUntil:
   *                         type: string
   *                         format: date
   *                         description: End of support date
   *                       status:
   *                         type: string
   *                         enum: [latest, supported, deprecated, sunset]
   *                         description: Status of this version
   *                 changelog:
   *                   type: string
   *                   description: URL to the changelog
   *             example:
   *               currentVersion:
   *                 version: "1.0.0"
   *                 released: "2025-04-01"
   *                 supportUntil: "2027-04-01"
   *                 isLatest: true
   *               supportedVersions:
   *                 - version: "1.0.0"
   *                   url: "/api/v1"
   *                   supportUntil: "2027-04-01"
   *                   status: "latest"
   *               changelog: "https://abroad-app.com/api/changelog"
   *       500:
   *         description: Server error retrieving version information
   */
  getVersionInfo: (req: Request, res: Response): void => {
    try {
      const { version } = getApiVersion();
      
      // In a real-world scenario, you might get this data from a database or configuration file
      const versionInfo = {
        currentVersion: {
          version: version,
          released: "2025-04-01",
          supportUntil: "2027-04-01",
          isLatest: true
        },
        supportedVersions: [
          {
            version: version,
            url: "/api/v1",
            supportUntil: "2027-04-01",
            status: "latest"
          }
          // For demonstration purposes only. In a real API, you might list older versions here
          // {
          //   version: "0.9.0",
          //   url: "/api/v0",
          //   supportUntil: "2026-04-01",
          //   status: "deprecated"
          // }
        ],
        changelog: "https://abroad-app.com/api/changelog"
      };
      
      res.json(versionInfo);
    } catch (error) {
      console.error("Error getting version information:", error);
      res.status(500).json({ error: "Failed to retrieve version information" });
    }
  },
  
  /**
   * @swagger
   * /api/version/supported:
   *   get:
   *     summary: Get supported API versions
   *     tags: [Version]
   *     description: Returns a list of all supported API versions
   *     security: []  # No authentication required
   *     responses:
   *       200:
   *         description: Supported versions retrieved successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 type: object
   *                 properties:
   *                   version:
   *                     type: string
   *                   url:
   *                     type: string
   *                   status:
   *                     type: string
   *                   supportUntil:
   *                     type: string
   *                     format: date
   *       500:
   *         description: Server error retrieving supported versions
   */
  getSupportedVersions: (req: Request, res: Response): void => {
    try {
      const { version } = getApiVersion();
      
      const supportedVersions = [
        {
          version: version,
          url: "/api/v1",
          status: "latest",
          supportUntil: "2027-04-01"
        }
        // Add more versions as needed
      ];
      
      res.json(supportedVersions);
    } catch (error) {
      console.error("Error getting supported versions:", error);
      res.status(500).json({ error: "Failed to retrieve supported versions" });
    }
  }
};