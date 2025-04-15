# Technical Requirements Document (TRD)
# Libyan Foreign Ministry Management System

**Document Version:** 1.1  
**Date:** April 16, 2025  
**Status:** Updated  
**Prepared by:** Senior Software Architecture Team

## 1. Introduction

### 1.1 Purpose
This Technical Requirements Document (TRD) specifies the technical architecture, design choices, development standards, and non-functional requirements for the Libyan Foreign Ministry Management System (LFMMS). It serves as a technical blueprint for the development team, ensuring consistency, quality, and adherence to architectural decisions. This version reflects the latest updates in the codebase, folder structure, and technology stack as of April 2025.

### 1.2 Scope
This document covers the technical aspects of the LFMMS frontend application, including architecture, technology stack, data handling, UI/UX implementation details, security measures, performance targets, development practices, and deployment considerations. Backend architecture and specific database implementation details are covered in separate documentation but are referenced where necessary for context.

### 1.3 References
1.  Software Requirements Specification ([`SRS.md`](SRS.md ))
2.  Functional Requirements Document ([`FRD.md`](FRD.md ))
3.  Product Requirements Document ([`PRD.md`](PRD.md ))
4.  Business Requirements Document ([`BRD.md`](BRD.md ))
5.  Development Roadmap ([`developmentRoadmap.md`](developmentRoadmap.md ))
6.  Project README ([`README.md`](README.md ))

## 2. System Architecture

### 2.1 High-Level Architecture
The LFMMS is implemented as a full-stack web application with a modular, service-oriented backend and a modern SPA frontend. The frontend communicates with the backend API via RESTful principles over HTTPS. The architecture emphasizes modularity, separation of concerns, and scalability.

### 2.2 Technology Stack

#### 2.2.1 Frontend
-   **Framework/Library:** React 18
-   **Language:** TypeScript
-   **Build Tool/Bundler:** Vite
-   **Routing:** React Router v6 (Nested routes)
-   **Styling:** Tailwind CSS (with JIT compilation)
-   **UI Components:** Custom components library in `src/components/`
-   **Animations:** Framer Motion
-   **Icons:** Lucide React
-   **State Management:** React Context API for global state (e.g., theme, auth), Custom React Hooks for form/local component state
-   **Form Handling:** Custom React Hooks with validation libraries (e.g., Zod, react-hook-form)

#### 2.2.2 Backend
-   **Framework:** Express.js (TypeScript)
-   **Language:** TypeScript
-   **Database ORM:** Prisma (MySQL)
-   **Authentication:** JWT (JSON Web Token)
-   **File Uploads:** Multer (with AWS S3 integration for storage)
-   **Validation:** Zod (schema validation)
-   **Rate Limiting:** express-rate-limit (API and upload endpoints)
-   **Logging:** Custom middleware for request logging
-   **Environment Management:** dotenv
-   **API Structure:** Modular routing (feature-based: citizens, passports, proxies, documents, etc.)
-   **Error Handling:** Centralized error and 404 middleware

#### 2.2.3 Development Environment
-   **Node.js:** Version 18+
-   **Package Manager:** npm or yarn
-   **Linting:** ESLint with TypeScript support and React plugin
-   **Formatting:** Prettier (integrated with ESLint)

### 2.3 Component Architecture

#### 2.3.1 Frontend Structure
-   The application follows a modular structure based on features/services:
    - **Common Components:** Reusable UI elements in `src/components/common/`
    - **Feature Components:** Module-specific components in `src/components/[feature-name]/`
    - **Form Components:** Specialized form components in `src/components/forms/`
    - **Hooks:** Custom hooks in `src/hooks/`
    - **Context:** Global state providers in `src/context/`
    - **Utils:** Utility functions in `src/utils/`
    - **Types:** TypeScript interfaces/types in `src/types/`
-   All routes and lazy-loaded components are managed in `src/App.tsx`.

#### 2.3.2 Backend Structure
-   **Entry Point:** `backend/src/server.ts` initializes Express, middleware, and routes.
-   **Routes:** Feature-based modular routes in `backend/src/routes/[feature]/` (e.g., citizens, passports, proxies, documents).
-   **Controllers:** Business logic in `backend/src/controllers/[feature]/`.
-   **Middlewares:**
    - `authMiddleware.ts`: JWT authentication and role-based access control
    - `loggingMiddleware.ts`: Request logging
    - `rateLimitMiddleware.ts`: API and upload rate limiting
    - `validationMiddleware.ts`: Request validation using Zod
    - `errorMiddleware.ts`: Centralized error and 404 handling
-   **Prisma ORM:** Database schema in `backend/prisma/schema.prisma`, migrations managed via Prisma CLI.
-   **File Uploads:** Multer middleware, with AWS S3 SDK for storage integration.
-   **Environment Variables:** Managed via `.env` (not committed)

#### 2.3.3 API Design
-   RESTful endpoints under `/api/[resource]` (e.g., `/api/citizens`, `/api/passports`)
-   Health check endpoint: `/api/health`
-   All endpoints protected by appropriate middleware (auth, rate limiting, validation)

## 3. Data Management

### 3.1 Data Flow
-   Frontend components fetch data from the backend API using custom hooks (e.g., abstracting `fetch` or `axios`).
-   Backend exposes RESTful endpoints for CRUD operations, protected by authentication and validation middleware.
-   State is managed locally within components or shared via Context API where necessary.
-   Form data is managed using custom hooks, validated on the client-side before submission, and re-validated on the server-side (Zod).

### 3.2 Data Validation
-   Client-side validation is implemented for all user inputs to provide immediate feedback, using libraries like Zod or integrated with form management hooks.
-   Validation rules align with requirements specified in the [`FRD.md`](FRD.md ) and [`SRS.md`](SRS.md ).
-   Server-side validation is enforced by the backend API.

### 3.3 Data Persistence (Client-Side)
-   `localStorage` or `sessionStorage` is used for persisting non-sensitive user preferences (e.g., theme, language).
-   Authentication tokens are stored securely (preferably via `HttpOnly` cookies handled by the backend).

### 3.4 Data Migration
-   Data migration from legacy paper-based systems is supported via manual entry interfaces or bulk import tools, as required.

## 4. User Interface (UI) and User Experience (UX)

### 4.1 Design System & Styling
-   Tailwind CSS utility-first approach is used for all styling.
-   A consistent design language is maintained across all components.
-   Custom base styles and component styles are defined in the Tailwind configuration or global CSS files.
-   Dark/Light mode themes are supported and toggleable by the user.

### 4.2 Responsiveness
-   The application is fully responsive and optimized for Desktop, Tablet, and Mobile viewports.
-   Tailwind's responsive modifiers (`sm:`, `md:`, `lg:`, `xl:`) are used throughout.

### 4.3 Internationalization (i18n) & Localization (l10n)
-   The primary language is Arabic, requiring full Right-to-Left (RTL) support throughout the UI. Tailwind CSS's RTL variants are utilized.
-   All user-facing strings are to be managed through a dedicated i18n library (e.g., `i18next`, `react-intl`) to facilitate future language additions.
-   Date and number formatting respect localization standards (Gregorian/Hijri support).

### 4.4 Accessibility (a11y)
-   The application strives to meet WCAG 2.1 Level AA standards.
-   Semantic HTML is used.
-   Proper ARIA attributes are applied where necessary.
-   Keyboard navigation is fully supported.
-   Focus management is handled correctly, especially in modals and dynamic content.
-   Color contrast ratios meet accessibility guidelines.

### 4.5 Animations
-   Subtle animations using Framer Motion enhance UX without hindering performance.
-   Animations are consistent and meaningful.

## 5. Non-Functional Requirements (NFRs)

*(Referencing [`SRS.md`](SRS.md #L313) for details)*

### 5.1 Performance
-   **Page Load Time:** < 2 seconds (First Contentful Paint).
-   **Interaction Response Time:** < 100ms for most UI interactions.
-   **Form Submission:** < 3 seconds (client-side processing).
-   **Optimization:** Vite's code splitting, lazy loading for routes/components, asset optimization, and efficient state management are used. Bundle size is minimized.
-   **Concurrency:** Frontend handles API responses efficiently, supporting backend capacity (e.g., 50+ concurrent users per installation).

### 5.2 Scalability
-   Frontend architecture is modular to allow for easy addition of new features/modules.
-   State management patterns avoid performance bottlenecks as the application grows.
-   API interactions are efficient to minimize backend load.

### 5.3 Security
-   **Authentication:** JWT-based authentication for all protected endpoints.
-   **Authorization:** Role-Based Access Control (RBAC) enforced in `authMiddleware.ts` and on the frontend.
-   **Data Transmission:** All communication with the backend uses HTTPS.
-   **Input Sanitization:** Zod validation on all incoming requests; further sanitization in Prisma models.
-   **Dependencies:** Dependencies are regularly audited for known vulnerabilities (e.g., using `npm audit`).
-   **Session Management:** JWT expiration and refresh logic; session timeout (30 mins inactivity) enforced on frontend.
-   **Password Policy:** Strong password policies enforced during user management/reset flows.
-   **2FA:** UI flows for Two-Factor Authentication for administrative roles are supported (backend endpoints to be implemented).
-   **Rate Limiting:** express-rate-limit middleware for API and file upload endpoints.
-   **Logging:** All requests and errors are logged via custom middleware; sensitive data is never logged.

### 5.4 Reliability
-   **Availability:** Target 99.5% uptime during operational hours.
-   **Error Handling:** Graceful error handling for API failures, network issues, and unexpected client-side errors. User-friendly error messages are provided in Arabic.
-   **Data Integrity:** Client-side validation prevents submission of invalid data. Backend enforces ultimate data integrity.

### 5.5 Maintainability
-   Coding standards and project structure are strictly followed.
-   Clean, well-documented TypeScript code is required.
-   Components are reusable and have single responsibilities.
-   Dependencies are kept updated.

### 5.6 Usability
-   Intuitive design, consistent terminology, clear messaging, and contextual help are provided as per [`SRS.md`](SRS.md #L336).

## 6. Integration Requirements

### 6.1 Backend API Integration
-   All interactions with the backend occur via a well-defined RESTful API over HTTPS.
-   API endpoints, request/response formats, and authentication mechanisms are specified in the backend codebase and OpenAPI documentation (to be maintained).
-   Consistent error handling for API responses (e.g., 4xx, 5xx status codes) is implemented via centralized error middleware.

### 6.2 Future Integrations (Phase 4+)
-   The frontend architecture anticipates future integrations with central ministry systems.
-   API interaction layers are abstracted to facilitate potential changes or additions to backend services.

## 7. Development Standards & Practices

### 7.1 Version Control
-   **System:** Git
-   **Platform:** GitHub (or specified alternative)
-   **Branching Strategy:** Gitflow (or similar structured model) is used. Main branches are protected. Features are developed in separate branches.
-   **Commit Messages:** Conventional Commits standard is followed.

### 7.2 Coding Standards
-   ESLint and Prettier configurations are enforced.
-   Standard React/TypeScript best practices are followed (e.g., hooks rules, immutability, proper typing).
-   Code is well-commented, especially for complex logic or non-obvious implementations.

### 7.3 Testing Strategy
-   **Unit Tests:** Vitest or Jest with React Testing Library is used for components, hooks, and utilities. Target >70% code coverage.
-   **Integration Tests:** Test interactions between components and modules, including routing and context usage.
-   **End-to-End (E2E) Tests:** Cypress or Playwright is used for critical user flows.
-   Tests are run automatically as part of the CI/CD pipeline.

### 7.4 Build & Deployment
-   **Build Process:** Vite (`npm run build`) is used for optimized production builds.
-   **Environment Variables:** `.env` files are used for environment-specific configuration. No sensitive information is committed.
-   **CI/CD:** CI/CD pipeline (e.g., GitHub Actions) automates testing, building, and deployment to staging/production environments.
-   **Deployment Target:** Web server capable of serving static files and handling SPA routing (e.g., Nginx, Apache, cloud hosting services).

## 8. Operational Requirements

### 8.1 Monitoring
-   Basic frontend performance monitoring is implemented (e.g., using browser APIs, Sentry, Datadog).
-   Key user interactions and errors are tracked.

### 8.2 Logging
-   Client-side errors are logged and may be sent to a centralized logging service (e.g., Sentry).
-   Audit logging of user actions is primarily a backend responsibility but requires frontend cooperation to trigger relevant API calls.

### 8.3 Backup & Recovery
-   Frontend application code is managed via version control (Git).
-   User data backup and recovery are backend responsibilities.

## 9. Appendices

### 9.1 Glossary
*(Refer to glossaries in [`SRS.md`](SRS.md #L391), [`BRD.md`](BRD.md #L180), [`MRD.md`])* 

### 9.2 Architecture Diagrams
*(See `system-architecture.puml`, `data-flow-diagram.puml`, and other diagrams in the repository)*

---

**Contact:** Project Manager: [Name] - [email@example.com]  
**Last Updated:** April 16, 2025

