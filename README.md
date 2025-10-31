# AudienceLab Enrichment Dashboard

A modern, high-performance contact enrichment dashboard built with React and TypeScript. Upload CSV files with email addresses and enrich them with 40+ professional and personal data fields including names, job titles, company information, phone numbers, and social profiles.

![Dashboard Preview](https://img.shields.io/badge/Status-Production%20Ready-success)
![React](https://img.shields.io/badge/React-19.2.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## Features

### Core Functionality
- **CSV Upload & Validation** - Drag-and-drop or click to upload CSV files with automatic email extraction and validation
- **Smart Email Processing** - RFC 5322 compliant validation, duplicate detection, and invalid email filtering
- **40+ Enrichment Fields** - Personal info, professional details, contact information, location data, and career history
- **Parallel Batch Processing** - Process up to 1M+ emails efficiently with configurable concurrency (1-20 batches)
- **Real-Time Progress Tracking** - Live progress bar, batch completion status, and estimated time remaining
- **Advanced Results Table** - Search, sort, paginate through enriched contacts
- **Export Functionality** - Download results as CSV or JSON with one click

### Credit System
- **Real-Time Cost Estimation** - See exact credit cost before enrichment
- **Balance Tracking** - Monitor credit usage and remaining balance
- **Warning System** - Get alerts for low credits or insufficient balance
- **Usage Statistics** - Track daily and monthly consumption

### User Experience
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **SPARK Branding** - Modern blue color scheme with professional UI
- **Field Packages** - Pre-configured packages (Basic, Standard, Professional, Premium, Complete)
- **Custom Selection** - Choose individual fields for precise control
- **Settings Persistence** - Batch size and concurrency preferences saved locally

## Tech Stack

- **Frontend Framework:** React 19.2.0
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS (via CDN)
- **Icons:** Lucide React
- **Build Tool:** Vite 6.4.1
- **State Management:** React Context + Hooks
- **Storage:** localStorage for settings

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- npm or pnpm

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd audiencelab-enrichment

# Install dependencies
npm install
# or
pnpm install

# Start development server
npm run dev
# or
pnpm dev
```

The application will be available at `http://localhost:3001`

### Build for Production

```bash
# Create production build
npm run build
# or
pnpm build

# Preview production build
npm run preview
# or
pnpm preview
```

## Project Structure

```
audiencelab-enrichment/
├── client/                    # Frontend application
│   ├── components/           # Reusable UI components
│   │   ├── ui/              # Base UI components (Card, icons)
│   │   ├── Header.tsx       # App header with credit display
│   │   ├── Sidebar.tsx      # Navigation sidebar
│   │   ├── ProgressTracker.tsx  # Real-time progress display
│   │   └── ResultsTable.tsx     # Enriched results table
│   ├── features/            # Feature-specific components
│   │   ├── enrichment/      # Enrichment workflow
│   │   ├── overview/        # Dashboard overview
│   │   ├── quality/         # Data quality tools
│   │   ├── analytics/       # Usage analytics
│   │   ├── activity/        # Activity history
│   │   └── settings/        # User settings
│   ├── hooks/               # Custom React hooks
│   │   └── useCreditSystem.ts  # Credit management
│   ├── services/            # API services
│   │   ├── audienceLabAPI.ts   # Real API integration
│   │   └── mockEnrichmentAPI.ts # Mock API for testing
│   ├── App.tsx              # Main application component
│   ├── constants.ts         # Field definitions and packages
│   ├── types.ts             # TypeScript type definitions
│   └── index.tsx            # Application entry point
├── public/                   # Static assets
├── .gitignore               # Git ignore rules
├── package.json             # Dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite configuration
└── README.md                # This file
```

## Usage Guide

### 1. Upload Contacts

Drag and drop a CSV file or click to browse. The system will:
- Extract all email addresses from the CSV
- Validate email format (RFC 5322)
- Remove duplicates
- Filter out invalid emails
- Display validation summary

### 2. Select Fields to Enrich

Choose from pre-configured packages or select individual fields:

**Packages:**
- **Basic** (6 credits) - Email, First Name, Last Name
- **Standard** (12 credits) - Basic + Job Title, Company
- **Professional** (20 credits) - Standard + Phone, LinkedIn
- **Premium** (35 credits) - Professional + Department, Seniority
- **Complete** (50 credits) - All 40+ fields

**Field Categories:**
- Personal: Name, Email, Phone
- Professional: Job Title, Company, Department, Seniority
- Location: City, State, Country, ZIP, Timezone
- Career: Years of Experience, Previous Companies

### 3. Configure Processing Settings

Adjust parallel processing for optimal performance:
- **Parallel Batches:** 1-20 (default: 5)
- **Batch Size:** 100-1,000 emails (default: 1,000)

Settings are saved automatically for future sessions.

### 4. Start Enrichment

Click "Start Enrichment" to begin processing. Monitor:
- Real-time progress bar
- Batches completed / total batches
- Emails processed / total emails
- Credits being used
- Estimated time remaining

### 5. View & Export Results

Once complete:
- Search results by any field
- Sort by clicking column headers
- Navigate through pages (50/100/200 per page)
- Export to CSV or JSON format

## API Integration

### Mock API (Default)

The project includes a mock API for testing and demonstration:
- Generates realistic fake data
- No API key required
- Instant results
- Perfect for development

### Real API Integration

To connect to the AudienceLab API:

1. Update `EnrichmentTab.tsx`:
```typescript
// Change this import
import { mockEnrichContactsParallel } from '../../services/mockEnrichmentAPI';
// To this
import { enrichContactsParallel } from '../../services/audienceLabAPI';

// Update function call
const enrichedContacts = await enrichContactsParallel(
  // ... same parameters
);
```

2. Add environment variable:
```bash
VITE_AUDIENCELAB_API_KEY=your_api_key_here
```

3. Update API base URL in `audienceLabAPI.ts` if needed

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# AudienceLab API
VITE_AUDIENCELAB_API_KEY=your_api_key

# Optional: Custom API base URL
VITE_API_BASE_URL=https://api.audiencelab.io
```

### Tailwind Configuration

The project uses Tailwind CSS via CDN. To customize:

1. Install Tailwind locally:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init
```

2. Update `index.html` to remove CDN link
3. Import Tailwind in your CSS file

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint (if configured)

### Code Style

- TypeScript for type safety
- Functional components with hooks
- Context API for global state
- localStorage for settings persistence
- Modular component structure

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Netlify

```bash
# Install Netlify CLI
npm i -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

### Other Platforms

Build the project and deploy the `dist` folder to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Google Cloud Storage
- Azure Static Web Apps

## Performance

- **Concurrent Processing:** Up to 20 parallel batches
- **Batch Size:** Up to 1,000 emails per batch
- **Throughput:** Process 1M+ emails efficiently
- **Memory Efficient:** Streaming results, minimal memory footprint

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT License - see LICENSE file for details

## Support

For issues, questions, or feature requests:
- Open an issue on GitHub
- Contact: support@audiencelab.io
- Documentation: https://docs.audiencelab.io

## Changelog

### v1.0.0 (Current)
- ✅ CSV upload and email validation
- ✅ 40+ enrichment fields
- ✅ Parallel batch processing
- ✅ Real-time progress tracking
- ✅ Results table with search/sort
- ✅ CSV and JSON export
- ✅ Credit system with cost estimation
- ✅ Mock API for testing
- ✅ Responsive design
- ✅ Settings persistence

## Roadmap

- [ ] User authentication and accounts
- [ ] Enrichment history and saved searches
- [ ] API rate limit management
- [ ] Bulk job scheduling
- [ ] Email templates for outreach
- [ ] CRM integrations (Salesforce, HubSpot)
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features

---

Built with ❤️ using React, TypeScript, and Tailwind CSS

# Trigger deployment
