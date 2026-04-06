# Ink2Deck Converter

<div align="center">
  <img src="https://img.shields.io/badge/React-18.2.0-61DAFB?style=for-the-badge&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-6.2.3-646CFF?style=for-the-badge&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Google%20Gemini-1.5--Flash-4285F4?style=for-the-badge&logo=google" alt="Google Gemini" />
  <img src="https://img.shields.io/badge/Supabase-2.45.6-3ECF8E?style=for-the-badge&logo=supabase" alt="Supabase" />
</div>

<br />

<div align="center">
  <h3>Transform whiteboard images into professional slide decks with AI-powered content extraction</h3>
  <p>Advanced OCR, diagram recognition, and mathematical equation parsing for seamless conversion</p>
</div>

## 📋 Table of Contents

- [Features](#-features)
- [Technology Stack](#-technology-stack)
- [Architecture](#-architecture)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Integration](#-api-integration)
- [Project Structure](#-project-structure)
- [Development](#-development)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🎯 Core Functionality
- **Smart Image Upload**: Drag-and-drop interface with real-time image preview
- **AI-Powered OCR**: Advanced text extraction using Google Gemini 1.5 Flash API
- **Diagram Detection**: Automatic identification and vectorization of charts, graphs, and visual elements
- **Mathematical Equation Parsing**: LaTeX and MathML conversion for complex formulas
- **Document Structure Analysis**: Intelligent content organization and slide generation

### 🎨 User Experience
- **Responsive Design**: Mobile-first approach with adaptive layouts
- **Real-time Processing**: Live progress indicators and processing feedback
- **Template Selection**: Multiple slide themes and customization options
- **Export Formats**: Generate both PowerPoint (.pptx) and PDF presentations
- **Error Handling**: Comprehensive error states with retry mechanisms

### 🔧 Technical Features
- **Type-Safe Development**: Full TypeScript implementation with strict typing
- **Modern React Patterns**: Hooks, Context API, and component composition
- **Performance Optimized**: Code splitting, lazy loading, and efficient bundling
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠 Technology Stack

### Frontend Framework
- **React 18.2.0** - Modern React with concurrent features
- **TypeScript 5.8.2** - Type-safe JavaScript with advanced type features
- **Vite 6.2.3** - Fast build tool and development server

### UI/UX Libraries
- **Radix UI** - Unstyled, accessible UI primitives
- **Tailwind CSS 3.4.1** - Utility-first CSS framework
- **shadcn/ui** - Re-usable component library built on Radix UI
- **Framer Motion** - Production-ready motion library for React
- **Lucide React** - Beautiful & consistent icon toolkit

### AI & Processing
- **Google Gemini 1.5 Flash** - Multimodal AI for image analysis and OCR
- **PDFKit** - PDF generation and manipulation
- **pptxgenjs** - PowerPoint presentation creation

### Backend & Storage
- **Supabase** - Open source Firebase alternative
- **PostgreSQL** - Advanced open source relational database

### Development Tools
- **ESLint** - Code linting and formatting
- **Tempo DevTools** - Development and debugging utilities
- **React Router** - Declarative routing for React

## 🏗 Architecture

### System Overview
```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   User Upload   │───▶│  AI Processing   │───▶│  Slide Export   │
│   (React UI)    │    │  (Gemini API)    │    │  (PPTX/PDF)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   File Storage  │    │   Content Struct │    │   Template Eng  │
│   (Supabase)    │    │   (TypeScript)   │    │   (pptxgenjs)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

### Component Architecture
- **Separation of Concerns**: Clear separation between UI, business logic, and data layers
- **Custom Hooks**: Reusable logic for API calls, file handling, and state management
- **Context Providers**: Global state management for user preferences and app settings
- **Error Boundaries**: Graceful error handling and user feedback

### Data Flow
1. **Upload Phase**: File validation, preview generation, and storage upload
2. **Processing Phase**: AI-powered content extraction and structure analysis
3. **Conversion Phase**: Template application and format-specific export

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm/yarn
- Google Gemini API key
- Supabase account (optional for local development)

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ink2deck-converter.git
   cd ink2deck-converter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   ```bash
   # Create .env.local file
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 🎯 Usage

### Basic Workflow

1. **Upload Image**
   - Drag and drop or click to select whiteboard/smartboard images
   - Supported formats: JPEG, PNG, WebP
   - Real-time preview with zoom and pan controls

2. **AI Processing**
   - Automatic text extraction using Gemini API
   - Diagram and chart detection
   - Mathematical equation recognition
   - Content structure analysis

3. **Slide Generation**
   - Choose from multiple presentation templates
   - Customize slide layouts and themes
   - Export to PowerPoint or PDF format

### Advanced Features

- **Batch Processing**: Upload multiple images for bulk conversion
- **Template Customization**: Modify slide designs and color schemes
- **Content Editing**: Post-processing text and layout adjustments
- **Collaboration**: Share processing results and export links

## 🔗 API Integration

### Google Gemini API
```typescript
// Image processing with multimodal AI
const result = await processImageWithGemini(imageBase64);
// Returns: { text, diagrams, error }
```

### Supabase Integration
```typescript
// File storage and analytics
const { data, error } = await supabase.storage
  .from('whiteboard-images')
  .upload(filePath, file);
```

### Export Generation
```typescript
// PowerPoint creation
const pptxBlob = await createPptxBlob(outline, template, theme);

// PDF generation
const pdfBlob = await createPDFBlob(outline, template);
```

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── home.tsx         # Main application page
│   ├── conversion/      # Slide conversion UI
│   ├── layout/          # Header, footer, navigation
│   ├── processing/      # Processing dashboard and progress
│   ├── ui/             # Reusable UI components (shadcn/ui)
│   └── upload/         # File upload components
├── lib/                # Business logic and utilities
│   ├── ai.ts           # AI processing functions
│   ├── gemini.ts       # Gemini API integration
│   ├── ppt-generation.ts # PowerPoint export
│   ├── pdf-generation.ts # PDF export
│   ├── supabase.ts     # Database and storage
│   └── utils.ts        # Helper functions
├── types/              # TypeScript type definitions
│   └── supabase.ts     # Database schema types
└── stories/            # Storybook stories for components
```

## 🚀 Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server
npm run build           # Build for production
npm run preview         # Preview production build
npm run types:supabase  # Generate Supabase types

# Code Quality
npm run lint            # Run ESLint
npm run build-no-errors # Build with TypeScript checks
```

### Development Workflow

1. **Feature Development**
   - Create feature branch from `main`
   - Implement changes with tests
   - Ensure TypeScript compilation
   - Run linting and formatting

2. **Code Standards**
   - ESLint configuration for code quality
   - Prettier for consistent formatting
   - Husky pre-commit hooks for quality checks

3. **Testing Strategy**
   - Unit tests for utility functions
   - Integration tests for API calls
   - E2E tests for critical user flows

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect Repository**
   ```bash
   # Vercel CLI
   vercel --prod
   ```

2. **Environment Variables**
   - Set `VITE_GEMINI_API_KEY`
   - Configure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

3. **Build Configuration**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": "dist",
     "installCommand": "npm install"
   }
   ```

### Other Platforms

- **Netlify**: Drag-and-drop `dist` folder or connect repository
- **GitHub Pages**: Use GitHub Actions for automated deployment
- **Docker**: Containerized deployment with multi-stage builds

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

### Code Guidelines
- Follow TypeScript best practices
- Write meaningful commit messages
- Add JSDoc comments for complex functions
- Ensure accessibility compliance
- Test across multiple browsers

### Areas for Contribution
- [ ] Mobile app development (React Native)
- [ ] Additional AI model integrations
- [ ] More export formats (Google Slides, Keynote)
- [ ] Advanced template customization
- [ ] Multi-language OCR support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Google Gemini** for advanced AI capabilities
- **Supabase** for reliable backend infrastructure
- **shadcn/ui** for beautiful component primitives
- **Vite** for lightning-fast development experience


---

<div align="center">
  <p>Built with ❤️ using modern web technologies</p>
  <p>
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#contributing">Contributing</a>
  </p>
</div>
