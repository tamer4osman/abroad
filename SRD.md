# Libyan Foreign Ministry Management System
# System Requirements Document (SRD)

**Document Version:** 1.1  
**Date:** April 19, 2025  
**Status:** Updated  
**Prepared by:** Senior Software Architecture Team

## 1. Introduction

### 1.1 Purpose
This System Requirements Document (SRD) defines the high-level system, hardware, software, and integration requirements for the Libyan Foreign Ministry Management System (LFMMS). It is intended to guide the implementation, deployment, and operation of the LFMMS, reflecting the latest updates in both frontend and backend architecture as of April 2025.

### 1.2 Scope
The SRD covers all system-level requirements for the LFMMS, including:
- Web-based SPA frontend (React 18, TypeScript, Vite, Tailwind CSS)
- Modular RESTful backend API (Express.js, TypeScript, Prisma ORM, MySQL, JWT)
- Integration, deployment, and operational requirements
- Security, performance, and maintainability standards

## 2. System Overview

The LFMMS is a full-stack digital platform for consular services at Libyan diplomatic missions. It replaces paper-based processes with a secure, scalable, and user-friendly web application. The system supports civil registry, passport, visa, attestation, proxy, and reporting modules, with full Arabic RTL support and robust security.

## 3. System Requirements

### 3.1 Functional Requirements
- Support for all core consular services: civil registry, passport, visa, attestation, proxy, reporting
- User authentication and RBAC (role-based access control)
- Real-time form validation and multi-step workflows
- Document upload, secure storage (AWS S3), and versioning
- Advanced search, filtering, and reporting
- Notification system (in-app, email for key events)
- Audit logging and activity tracking
- Responsive UI with RTL and accessibility (WCAG 2.1 AA)
- Dark/light mode toggle

### 3.2 Non-Functional Requirements
- Page load < 2 seconds; API response < 500ms
- Support for 50+ concurrent users per installation
- Data encryption at rest and in transit (HTTPS, DB, S3)
- Automated backup and disaster recovery
- Modular, maintainable codebase (feature-based structure)
- Compliance with Libyan government data security standards
- Comprehensive documentation and training materials
- System availability 99.5% during operational hours

### 3.3 Hardware Requirements
- Server: Quad-core CPU, 16GB RAM, SSD storage, Linux/Windows OS
- Database: MySQL 8+ (hosted or managed)
- Client: Modern browser (Chrome, Firefox, Edge, Safari), 1280x720+ resolution
- Network: Reliable internet connection; support for intermittent connectivity
- Scanners, printers, biometric devices as required by consular operations

### 3.4 Software Requirements
- Node.js 18+, npm/yarn
- MySQL 8+, Prisma ORM
- Express.js (backend), React 18 (frontend)
- Tailwind CSS, Framer Motion, Lucide React
- ESLint, Prettier, Jest/Vitest, Cypress/Playwright
- AWS S3 or compatible object storage for documents
- .env files for environment-specific configuration

### 3.5 Integration Requirements
- RESTful API endpoints for all modules
- JWT authentication and RBAC enforced on backend
- File upload endpoints (Multer, S3 integration)
- Export to PDF/Excel
- Future integration with central ministry systems (API-ready)
- WebSockets for real-time notifications (future phase)

### 3.6 Security Requirements
- Secure authentication (JWT, short expiry, refresh tokens)
- RBAC enforced in backend and reflected in frontend UI
- Input validation (Zod, client and server)
- Rate limiting (express-rate-limit)
- Audit logging (backend middleware)
- Session timeout (30 min inactivity)
- Password policy enforcement
- Compliance with OWASP Top 10

### 3.7 Deployment & Operational Requirements
- CI/CD pipeline for automated build, test, and deployment
- Environment configuration guides and scripts
- Monitoring and alerting (Sentry, Datadog, etc.)
- Regular security updates and maintenance schedule
- Backup and recovery procedures
- Training and support helpdesk for users

## 4. Appendices

### 4.1 References
- [SRS.md]: Software Requirements Specification
- [TRD.md]: Technical Requirements Document
- [FRD.md]: Functional Requirements Document
- [PRD.md]: Product Requirements Document
- [QRD.md]: Quality Requirements Document
- [MRD.md]: Market Requirements Document
- [BRD.md]: Business Requirements Document
- [README.md]: Project Overview
- [system-architecture.puml]: Architecture Diagram
- [data-flow-diagram.puml]: Data Flow Diagram

### 4.2 Glossary
Refer to SRS.md, FRD.md, and MRD.md for domain-specific terminology.

---
**Contact:** Project Manager: [Name] - [email@example.com]  
**Last Updated:** April 19, 2025

