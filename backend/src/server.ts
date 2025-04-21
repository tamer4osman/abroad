import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import fs from "fs";

// Import routes from modular structure
import citizenRoutes from './routes/citizens';
import passportRoutes from "./routes/passports/passportRoutes";
import proxyRoutes from "./routes/proxies/proxyRoutes";
import documentRoutes from "./routes/documents/documentRoutes";
import visaRoutes from "./routes/visas/visaRoutes";
import versionRoutes from "./routes/version/versionRoutes"; // Import version routes
import attestationRoutes from "./routes/attestations/attestationRoutes"; // Import attestation routes

// Import middleware
import { requestLogger } from "./middlewares/loggingMiddleware";
import {
  apiRateLimit,
  uploadRateLimit,
} from "./middlewares/rateLimitMiddleware";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware";

// Import Swagger setup
import { setupSwagger } from "./utils/swagger";

// Get package.json version
const packageJsonPath = path.resolve(__dirname, '..', 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const apiVersion = packageJson.version ?? '1.0.0';
const apiMajorVersion = apiVersion.split('.')[0];

// Initialize Express app and environment variables
dotenv.config();
const app = express();

// --- Global Middleware ---
app.use(cors()); // Consider more restrictive CORS settings for production
app.use(express.json()); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded
app.use(requestLogger); // Log all requests

// Apply rate limiting to all routes
app.use(apiRateLimit);

// Set up Swagger documentation
setupSwagger(app);

// --- Version information endpoint (no version prefix needed) ---
app.use("/api/version", versionRoutes);

// --- Documentation routes ---
app.get("/api/docs/getting-started", (req, res) => {
  res.json({
    message: "This endpoint provides documentation only. Please refer to the API documentation for the Getting Started guide."
  });
});

// --- Basic Routes ---
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Abroad API",
    version: apiVersion,
    documentation: "/api-docs",
    authentication: {
      type: "JWT (Bearer Token)",
      login: `/api/v${apiMajorVersion}/auth/login`,
      refreshToken: `/api/v${apiMajorVersion}/auth/refresh-token`,
      tokenFormat: "Authorization: Bearer {token}",
      description: "Most API endpoints require authentication. Use the login endpoint to obtain a JWT token."
    },
    versionInfo: `/api/version`,
    endpoints: {
      health: {
        path: `/api/v${apiMajorVersion}/health`,
        description: "Check API health status",
        requiresAuth: false
      },
      citizens: {
        path: `/api/v${apiMajorVersion}/citizens`,
        description: "Manage citizen information, registration, and lookups",
        requiresAuth: true
      },
      passports: {
        path: `/api/v${apiMajorVersion}/passports`,
        description: "Handle passport applications, renewals, and management",
        requiresAuth: true
      },
      proxies: {
        path: `/api/v${apiMajorVersion}/proxies`,
        description: "Services for various government proxy operations",
        requiresAuth: true
      },
      visas: {
        path: `/api/v${apiMajorVersion}/visa`,
        description: "Process visa applications and related services",
        requiresAuth: true
      },
      documents: {
        path: `/api/v${apiMajorVersion}/documents`,
        description: "Document upload, verification and management",
        requiresAuth: true
      },
      attestations: {
        path: `/api/v${apiMajorVersion}/attestation`,
        description: "Document attestation and legalization services",
        requiresAuth: true
      }
    }
  });
});

app.get(`/api/v${apiMajorVersion}/health`, (req, res) => {
  res.json({ 
    status: "ok",
    timestamp: new Date(),
    uptime: process.uptime(),
    serverInfo: {
      name: "Abroad API Server",
      environment: process.env.NODE_ENV ?? 'development',
      version: apiVersion
    }
  });
});

// --- Create versioned API router ---
const v1Router = express.Router();

// --- Register modular routes to the versioned router ---
v1Router.use("/citizens", citizenRoutes);
v1Router.use("/passports", passportRoutes);
v1Router.use("/proxies", proxyRoutes);
v1Router.use("/visa", visaRoutes);
v1Router.use("/attestation", attestationRoutes);

// Apply upload rate limiting specifically to document routes
v1Router.use("/documents", uploadRateLimit, documentRoutes);

// --- Mount the versioned router at the /api/v1 path ---
app.use(`/api/v${apiMajorVersion}`, v1Router);

// --- Legacy routes (unversioned) for backward compatibility ---
// This provides a transition period for API consumers
app.use("/api/citizens", citizenRoutes);
app.use("/api/passports", passportRoutes);
app.use("/api/proxies", proxyRoutes);
app.use("/api/visa", visaRoutes);
app.use("/api/documents", uploadRateLimit, documentRoutes);

// --- Error handling middleware ---
// Must be registered after all routes
app.use(notFoundHandler); // Handle 404 for undefined routes
app.use(errorHandler); // Handle all other errors

// --- Server Start ---
const PORT = process.env.PORT ?? 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API Documentation available at http://localhost:${PORT}/api-docs`);
  console.log(`API Version: ${apiVersion} (v${apiMajorVersion})`);
});
