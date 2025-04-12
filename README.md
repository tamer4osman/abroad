# Libyan Foreign Ministry Management System

A comprehensive administrative dashboard built with React, TypeScript, and Vite, designed for managing citizen services at the Libyan Foreign Ministry offices abroad.

## 🚀 Features

- **Complete Civil Registry Management** - Handle citizen registration, marriages, births, divorces, and deaths
- **Passport & Visa Processing** - Issue passports, travel documents, add children to passports, and manage visa applications
- **Document Attestation** - Process both local and international document certifications
- **Legal Proxy Management** - Handle various types of legal proxies including court, bank, divorce, real estate, and inheritance
- **Responsive Arabic Interface** - Fully RTL-supported dashboard with dark/light mode
- **Modern UI/UX** - Built with Framer Motion animations and Tailwind CSS
- **High Performance** - Optimized with lazy loading and code splitting

## ⚙️ Technical Stack

- **Frontend**: React 18, TypeScript, Vite
- **Routing**: React Router v6 with nested routes
- **Styling**: Tailwind CSS with dark mode support
- **UI Components**: Custom components with Framer Motion animations
- **Icons**: Lucide React for consistent iconography
- **Form Management**: Custom React hooks for form state
- **Internationalization**: Full Arabic RTL support

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
│   └── forms/           # Form components
├── hooks/               # Custom React hooks
├── context/             # React context providers
├── utils/               # Utility functions
├── types/               # TypeScript type definitions
├── App.tsx              # Main application layout and routing
└── main.tsx             # Application entry point
```

## 📱 Responsive Design

This dashboard is fully responsive and optimized for:
- Desktop administration
- Tablet use by field officers
- Mobile viewing for supervisors on the go

## 🔒 Security Features

- Role-based access control
- Form validation and sanitization
- Secure authentication flow
- Data encryption for sensitive information

## 📋 Development Roadmap

- **Phase 1**: Core civil registry and passport services
- **Phase 2**: Visa processing and document attestation
- **Phase 3**: Legal proxy management and reporting
- **Phase 4**: API integration with ministry backend systems
- **Phase 5**: Advanced analytics and monitoring features

---

Built with ❤️ for the Libyan Foreign Ministry
