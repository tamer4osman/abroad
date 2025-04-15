import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import routes from modular structure
import citizenRoutes from "./routes/citizens/citizenRoutes";
import passportRoutes from "./routes/passports/passportRoutes";
import proxyRoutes from "./routes/proxies/proxyRoutes";
import documentRoutes from "./routes/documents/documentRoutes";

// Import middleware
import { requestLogger } from "./middlewares/loggingMiddleware";
import {
  apiRateLimit,
  uploadRateLimit,
} from "./middlewares/rateLimitMiddleware";
import { errorHandler, notFoundHandler } from "./middlewares/errorMiddleware";

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

// --- Basic Routes ---
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// --- Register modular routes ---
app.use("/api/citizens", citizenRoutes);
app.use("/api/passports", passportRoutes);
app.use("/api/proxies", proxyRoutes);

// Apply upload rate limiting specifically to document routes
app.use("/api/documents", uploadRateLimit, documentRoutes);

// --- Error handling middleware ---
// Must be registered after all routes
app.use(notFoundHandler); // Handle 404 for undefined routes
app.use(errorHandler); // Handle all other errors

// --- Server Start ---
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
