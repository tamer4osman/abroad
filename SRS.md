# Software Requirements Specification (SRS)
# Libyan Foreign Ministry Management System

**Document Version:** 1.1  
**Date:** April 19, 2025  
**Status:** Updated  
**Prepared by:** Project Architect Team

## 1. Introduction

### 1.1 Purpose
This Software Requirements Specification (SRS) document describes the functional and non-functional requirements for the Libyan Foreign Ministry Management System (LFMMS). It is intended to be used by the development team to implement the system according to the needs of the Libyan Foreign Ministry offices abroad. This version reflects the latest updates in both frontend and backend architecture, technology stack, and modular structure as of April 2025.

### 1.2 Project Scope
The LFMMS is a full-stack web application designed to digitize and streamline consular services at Libyan diplomatic missions worldwide. The system manages civil registry, passport and visa processing, document attestation, legal proxy management, and reporting through a unified, Arabic-first interface. The frontend is a SPA (React 18, TypeScript, Vite, Tailwind CSS), and the backend is a modular RESTful API (Express.js, TypeScript, Prisma ORM, MySQL, JWT authentication).

### 1.3 Definitions, Acronyms, and Abbreviations
- **LFMMS**: Libyan Foreign Ministry Management System
- **CR**: Civil Registry
- **UI/UX**: User Interface/User Experience
- **RTL**: Right-to-Left (for Arabic language support)
- **API**: Application Programming Interface

### 1.4 References
1. Libyan Civil Registry Laws and Regulations
2. Passport Issuance Guidelines for Diplomatic Missions
3. Document Attestation Protocols
4. Legal Proxy Documentation Requirements

### 1.5 Overview
This document is organized as follows:
- Section 1: Introduction
- Section 2: Overall Description
- Section 3: Specific Requirements
- Section 4: System Features
- Section 5: Non-Functional Requirements
- Section 6: Interface Requirements
- Section 7: Other Requirements
- Section 8: References to supporting documents (TRD, FRD, PRD, QRD, MRD)

## 2. Overall Description

### 2.1 Product Perspective
The LFMMS is a new, standalone, full-stack system replacing paper-based processes in Libyan diplomatic missions. The frontend is a SPA deployed in embassy/consulate intranets, communicating with a secure backend API. Future phases will integrate with central ministry systems in Libya. The backend is modular, feature-based, and exposes RESTful endpoints for all business domains.

### 2.2 Product Functions
At a high level, the system will:
- Manage civil registry records (births, marriages, divorces, deaths)
- Process passport applications and renewals
- Issue travel documents
- Process visa applications
- Authenticate and attest documents
- Handle legal proxy services
- Generate reports and statistics
- Provide secure authentication, RBAC, and audit logging
- Support document upload, storage (AWS S3), and versioning

### 2.3 User Classes and Characteristics

#### 2.3.1 System Administrators
- Technical staff responsible for system maintenance
- Full access to all system functions and configuration settings
- Responsible for user management, data backups, and monitoring

#### 2.3.2 Embassy/Consulate Staff
- Process daily transactions and applications
- Access to service-specific modules based on role
- Moderate technical proficiency

#### 2.3.3 Diplomatic Officials
- View reports and approve certain transactions
- Limited interaction with the system focusing on approval workflows and statistics
- Varying technical proficiency

### 2.4 Operating Environment
- Web-based SPA accessible through modern browsers (Chrome, Firefox, Edge, Safari)
- Responsive design for desktops, tablets, and mobile devices
- Arabic-first, RTL layout throughout
- Compatible with Windows 10/11
- Minimum screen resolution: 1280x720
- Backend runs on Node.js 18+, MySQL, Prisma ORM, deployed on secure servers (Linux/Windows)
- .env files for environment-specific configuration (never committed)

### 2.5 Design and Implementation Constraints
- Must comply with Libyan government data security standards
- Must support Arabic as the primary language with English as secondary
- Must function in environments with inconsistent internet connectivity
- All dates must support both Gregorian and Hijri calendars
- Modular folder structure for both frontend (`src/components`, `src/services`, etc.) and backend (`src/routes`, `src/controllers`, `src/middlewares`)
- Use of ESLint, Prettier, and code review for quality

### 2.6 User Documentation
The system will include:
- Admin user manual
- End-user operation guides
- Quick reference cards for common tasks
- In-application help sections
- Video tutorials for complex processes

### 2.7 Assumptions and Dependencies
- The system assumes each diplomatic mission has stable power supply or backup systems
- Depends on access to reliable document scanning equipment
- Assumes staff will receive adequate training before system deployment
- Assumes backend API is available and secured via HTTPS

## 3. Specific Requirements

### 3.1 External Interface Requirements

#### 3.1.1 User Interfaces
- Arabic-first interface with complete RTL support (Tailwind CSS RTL, i18n library)
- Accessible design following WCAG 2.1 AA standards
- Dark/light mode toggle
- Responsive design for multiple device types
- Consistent navigation and action buttons
- Intuitive form design with clear validation messages (Zod, react-hook-form)

#### 3.1.2 Hardware Interfaces
- Support for document scanners
- Support for image capture devices
- Support for printing to standard office printers
- Compatible with standard biometric capture devices

#### 3.1.3 Software Interfaces
- RESTful API endpoints for all business domains (citizens, passports, visas, proxies, documents, attestations, reports)
- JWT-based authentication for all protected endpoints
- Role-based access control (RBAC) enforced on backend and reflected in frontend UI
- File upload endpoints (Multer, AWS S3 integration)
- Export capabilities to standard formats (PDF, Excel)
- Integration with email systems for notifications (future phase)
- Future API integration with central ministry databases

#### 3.1.4 Communications Interfaces
- HTTPS for all communications
- REST API design for all modules
- WebSockets for real-time notifications (future phase)

## 4. System Features

### 4.1 Civil Registry Management

#### 4.1.1 Citizen Registration
**Description:** Register citizens living abroad in the consular system.
**Priority:** High
**Requirements:**
- Capture all personal information (name, DOB, place of birth, gender, etc.)
- Support for family relationships and dependencies
- Document upload for identification
- Address and contact information
- Search functionality by national ID, name, and other parameters
- Edit/update capabilities with change history

#### 4.1.2 Marriage Registration
**Description:** Record marriages involving Libyan citizens.
**Priority:** High
**Requirements:**
- Capture details of both spouses
- Verification of identity documents
- Marriage certificate upload
- Witness information
- Legal status verification
- Generation of official documentation

#### 4.1.3 Birth Registration
**Description:** Register births of children to Libyan citizens abroad.
**Priority:** High
**Requirements:**
- Parental information with verification
- Hospital/birth certificate details
- Medical information
- Witness information
- Generation of birth certificate
- Notification to relevant authorities

#### 4.1.4 Divorce Registration
**Description:** Record divorce proceedings involving Libyan citizens.
**Priority:** Medium
**Requirements:**
- Reference to existing marriage records
- Court order documentation
- Status tracking
- Legal document generation
- Update of citizen status in registry

#### 4.1.5 Death Registration
**Description:** Record deaths of Libyan citizens abroad.
**Priority:** High
**Requirements:**
- Verification of identity
- Medical certification upload
- Informant information
- Cause of death (if available)
- Generation of death certificate
- Update of citizen status in registry

### 4.2 Passport Services

#### 4.2.1 Passport Issuance
**Description:** Process new passport applications.
**Priority:** Critical
**Requirements:**
- Verification of citizenship
- Biometric data capture
- Photo requirements enforcement
- Application tracking
- Fee collection recording
- Status notifications
- Printing preparation

#### 4.2.2 Travel Document Issuance
**Description:** Issue emergency travel documents.
**Priority:** High
**Requirements:**
- Expedited processing workflow
- Limited validity settings
- Special case documentation
- Urgent processing flags

#### 4.2.3 Add Child to Passport
**Description:** Process requests to add children to parent passports.
**Priority:** Medium
**Requirements:**
- Parent passport verification
- Child information collection
- Relationship verification
- Photo requirements
- Update tracking

#### 4.2.4 Completed Requests Management
**Description:** Track and manage completed passport applications.
**Priority:** Medium
**Requirements:**
- Searchable database of completed requests
- Status tracking
- Delivery confirmation
- Archive capabilities

### 4.3 Visa Processing

#### 4.3.1 New Visa Requests
**Description:** Process visa applications for entry to Libya.
**Priority:** High
**Requirements:**
- Applicant information collection
- Purpose of travel documentation
- Supporting document upload
- Visa type selection
- Fee processing
- Application tracking

#### 4.3.2 Pending Requests Management
**Description:** Manage visa applications in process.
**Priority:** Medium
**Requirements:**
- Status tracking
- Additional information requests
- Approval workflow
- Rejection handling with reason documentation
- Communication with applicants

#### 4.3.3 Completed Requests
**Description:** Track issued visas and outcomes.
**Priority:** Medium
**Requirements:**
- Complete history of applications
- Search functionality
- Statistical reporting
- Pattern analysis

### 4.4 Document Attestation

#### 4.4.1 Local Attestation
**Description:** Process document attestation for local use.
**Priority:** Medium
**Requirements:**
- Document classification
- Verification process
- Stamping and certification tracking
- Fee collection
- Document tracking

#### 4.4.2 International Attestation
**Description:** Process document attestation for international use.
**Priority:** Medium
**Requirements:**
- Apostille requirements
- International standards compliance
- Multi-level approval workflows
- Specialized stamp tracking
- International authority coordination

### 4.5 Legal Proxy Management

#### 4.5.1 Court Proxy
**Description:** Process legal representation authorizations for court matters.
**Priority:** Medium
**Requirements:**
- Detailed authorization parameters
- Temporal limitations
- Specific action authorizations
- Verification processes
- Proxy party information

#### 4.5.2 Bank Proxy
**Description:** Process financial institution representation authorizations.
**Priority:** Medium
**Requirements:**
- Account specifications
- Transaction limitations
- Identity verification
- Banking institution details
- Expiration handling

#### 4.5.3 - 4.5.7 Additional Proxy Types
**Description:** Handle specialized proxy requirements (divorce, real estate, inheritance, document completion, general).
**Priority:** Medium
**Requirements:**
- Type-specific fields and validations
- Domain-specific document requirements
- Specialized verification workflows
- Authority limitations
- Expiration tracking

### 4.6 Reporting

**Description:** Generate statistical and operational reports.
**Priority:** Medium
**Requirements:**
- Predefined report templates
- Custom report creation
- Data visualization
- Export to multiple formats
- Scheduled report generation
- Year-over-year comparisons
- Service utilization metrics

## 5. Non-Functional Requirements

### 5.1 Performance
- Page load time < 2 seconds (SPA, Vite, code splitting)
- Form submission processing < 3 seconds (client-side and API)
- Search results display < 1 second
- Support for 50+ concurrent users per installation
- Document upload handling up to 20MB per file
- Backend API response time < 500ms for standard operations

### 5.2 Security
- Role-based access control (RBAC) enforced in backend middleware
- Two-factor authentication for administrative access (UI and backend endpoints)
- Data encryption at rest (DB, S3) and in transit (HTTPS)
- Comprehensive audit logging (backend middleware)
- Session timeout after 30 minutes of inactivity
- Password policy enforcement (backend validation)
- Regular security scanning and testing (`npm audit`, penetration testing)
- Input validation (Zod on backend, client-side validation)
- Rate limiting (express-rate-limit middleware)

### 5.3 Reliability
- System availability of 99.5% during operational hours
- Automated backup systems (DB, S3)
- Graceful error handling (centralized error middleware, user-friendly messages)
- Fault tolerance for network interruptions (frontend status indicators)
- Data validation to maintain integrity (client and server)

### 5.4 Usability
- Intuitive interface requiring minimal training
- Consistent terminology aligned with ministerial vocabulary
- Clear error messages in Arabic
- Contextual help throughout the application
- Keyboard shortcuts for common operations
- Save and resume functionality for complex forms

### 5.5 Maintainability
- Modular architecture (feature-based folders, reusable components)
- Comprehensive documentation (README, ADRs, code comments)
- Code standards adherence (ESLint, Prettier)
- Well-structured component and API hierarchy
- Separation of concerns in design (controllers, services, middlewares)

### 5.6 Scalability
- Horizontal scaling support (stateless backend, scalable DB)
- Database partitioning capability (Prisma, MySQL)
- Load balancing readiness
- Microservices-ready architecture (modular backend)
- Caching mechanisms for frequently accessed data (future phase)

## 6. Implementation Phases

Implementation will follow the phased approach outlined in the Development Roadmap:

### Phase 1: Core Civil Registry and Passport Services
- User authentication and authorization
- Basic dashboard UI with RTL support
- Civil registry core functions
- Passport issuance and management

### Phase 2: Visa Processing and Document Attestation
- Visa application workflow
- Document attestation systems
- Enhanced search and filtering
- Document management improvements

### Phase 3: Legal Proxy Management and Reporting
- All proxy management modules
- Reporting and analytics foundation
- Advanced filtering and search
- Print optimization

### Phase 4: API Integration with Ministry Backend Systems
- Integration architecture
- Central database synchronization
- National ID verification
- Secure data transmission protocols

### Phase 5: Advanced Analytics and Monitoring
- Advanced analytics dashboard
- Predictive modeling
- Resource optimization tools
- Service quality metrics

## 7. Appendices

### 7.1 Glossary
[Terminology specific to the Libyan government and diplomatic services]

### 7.2 Analysis Models
- Process flow diagrams
- Entity relationship diagrams
- User journey maps

### 7.3 Issues List
[To be maintained throughout the project lifecycle]

## 8. References
- [TRD.md](TRD.md): Technical Requirements Document
- [FRD.md](FRD.md): Functional Requirements Document
- [PRD.md](PRD.md): Product Requirements Document
- [QRD.md](QRD.md): Quality Requirements Document
- [MRD.md](MRD.md): Market Requirements Document
- [README.md](README.md): Project Overview
- [system-architecture.puml](system-architecture.puml): Architecture Diagram
- [data-flow-diagram.puml](data-flow-diagram.puml): Data Flow Diagram