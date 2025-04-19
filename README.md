# Libyan Foreign Ministry Management System

A comprehensive administrative dashboard built with React, TypeScript, and Vite, designed for managing citizen services at the Libyan Foreign Ministry offices abroad.

## 🚀 Features

- **Complete Civil Registry Management** – Register citizens, manage marriages, births, divorces, and deaths with full audit trails
- **Passport & Visa Processing** – Issue and renew passports, handle travel documents, add children to passports, and manage visa applications with status tracking
- **Document Attestation** – Process local and international document certifications, including apostille and translation workflows
- **Legal Proxy Management** – Manage court, bank, divorce, real estate, inheritance, document completion, and general proxies
- **Advanced Reporting & Analytics** – Generate operational and custom reports, visualize trends, and export to PDF/Excel
- **Responsive Arabic Interface** – Fully RTL-supported dashboard, dark/light mode, and accessibility (WCAG 2.1 AA)
- **Modern UI/UX** – Built with Framer Motion animations, Tailwind CSS, and feature-based modular components
- **High Performance & Scalability** – Optimized with Vite, code splitting, lazy loading, and modular backend (Express.js, Prisma, MySQL)
- **Security & Compliance** – JWT authentication, RBAC, 2FA, audit logging, rate limiting, Zod validation, and S3 encryption

## ⚙️ Technical Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React, i18n (full Arabic RTL)
- **Routing**: React Router v6 (nested routes)
- **State Management**: React Context API, custom hooks
- **Form Management**: react-hook-form, Zod validation
- **Backend**: Express.js (TypeScript), Prisma ORM (MySQL), modular routing/controllers, JWT, Zod, Multer, AWS S3
- **Testing**: Vitest/Jest, Cypress/Playwright
- **CI/CD**: Automated pipeline for build, test, and deployment

## 💻 Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone [repository-url]

# Navigate to project directory
cd abroad

# Install dependencies
npm install

# Start development server
npm run dev
```

### ESLint Configuration

For production applications, enable type-aware linting:

```js
// eslint.config.js
export default tseslint.config({
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
  // Use type-checked rules
  extends: ['tseslint.configs.recommendedTypeChecked', 'tseslint.configs.stylisticTypeChecked'],
  plugins: {
    react: 'eslint-plugin-react',
  },
  rules: {
    // React-specific rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```

## 🏗️ Project Structure

```
src/
├── components/          # UI components organized by service type
│   ├── common/          # Shared components
│   ├── civil-registry/  # Civil registry components
│   ├── passports/       # Passport components
│   ├── visas/           # Visa components
│   ├── attestations/    # Attestation components
│   ├── proxies/         # Proxy components
│   └── forms/           # Form components
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── services/            # API and business logic services
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── App.tsx              # Main application layout and routing
└── main.tsx             # Application entry point
backend/
├── src/
│   ├── controllers/     # Business logic by feature
│   ├── middlewares/     # Auth, validation, logging, error handling
│   ├── routes/          # Modular API routes by feature
│   └── server.ts        # Express app entry point
├── prisma/              # Prisma schema and migrations
└── package.json         # Backend dependencies
```

## 📱 Responsive Design

- Optimized for desktop, tablet, and mobile
- Arabic-first, full RTL layout
- Accessible (WCAG 2.1 AA), keyboard navigation, and screen reader support

## 🔒 Security Features

- JWT authentication and RBAC (role-based access control)
- Two-factor authentication for admin roles
- Form validation and sanitization (Zod, react-hook-form)
- Secure file upload and S3 storage
- Data encryption at rest and in transit
- Audit logging and rate limiting

## 📋 Development Roadmap and Current Status

Current Status: **Phase 1** (as of April 19, 2025)

### Progress Overview
- **Civil Registry Management**: 75% complete
- **Passport Services**: 65% complete
- **Reports & Analytics**: 35% complete
- **Visa Processing**: Initial implementation (10%)
- **Document Attestation**: Initial implementation (5%)
- **Legal Proxy Management**: Initial implementation (5%)

### Development Phases
- **Phase 1** (Current): Core civil registry and passport services - Target: June 15, 2025
- **Phase 2**: Visa processing and document attestation - Target: August 30, 2025
- **Phase 3**: Legal proxy management and reporting - Target: October 15, 2025
- **Phase 4**: API integration with ministry backend systems - Target: December 10, 2025
- **Phase 5**: Advanced analytics and monitoring features - Target: February 28, 2026

For detailed progress tracking and feature status, see the [Development Roadmap](./developmentRoadmap.md).

---

Last Updated: April 19, 2025  
Built with ❤️ for the Libyan Foreign Ministry
