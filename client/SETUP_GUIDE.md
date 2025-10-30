# AudienceLab Enrichment Dashboard - Setup Guide

**Version:** 2.0  
**Last Updated:** October 30, 2025

---

## 📦 What's Included

This dashboard is a production-ready React + TypeScript application with:

✅ **Complete Credit System** - Per-field pricing with 40+ fields  
✅ **API Integration** - Full AudienceLab API connectivity  
✅ **Parallel Processing** - 1-20 concurrent batches  
✅ **Real-time Progress** - Live progress tracking  
✅ **Results Display** - Sortable, searchable, exportable table  
✅ **Email Validation** - Robust validation and duplicate detection  
✅ **CSV Processing** - Smart email extraction  

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 16+ (recommended: 18+)
- **npm** or **yarn**
- **AudienceLab API Key**

### Installation

```bash
# 1. Navigate to project directory
cd audiencelab-dashboard

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.local .env.local
# Edit .env.local and add your API key:
# VITE_AUDIENCELAB_API_KEY=your_api_key_here

# 4. Run development server
npm run dev

# 5. Open in browser
# Visit: http://localhost:5173
```

---

## 📁 Project Structure

```
audiencelab-dashboard/
├── components/              # Reusable UI components
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── Header.tsx          # Top header bar
│   ├── ProgressTracker.tsx # Real-time progress display
│   ├── ResultsTable.tsx    # Results table with export
│   └── ui/                 # Base UI components
│       ├── Card.tsx
│       └── icons.tsx
├── features/                # Feature modules
│   ├── enrichment/         # Main enrichment feature
│   │   ├── EnrichmentTab.tsx      # Original (from AI Studio)
│   │   └── EnrichmentTab_v2.tsx   # Enhanced with API integration
│   ├── overview/
│   ├── quality/
│   ├── analytics/
│   ├── activity/
│   └── settings/
├── services/                # API services
│   └── audienceLabAPI.ts   # AudienceLab API client
├── hooks/                   # Custom React hooks
│   ├── useCreditSystem.ts  # Credit management
│   └── useLocalStorage.ts  # Persistent storage
├── constants.ts             # Field definitions & packages
├── types.ts                 # TypeScript types
├── App.tsx                  # Main app component
└── index.html              # HTML entry point
```

---

## 🔧 Configuration

### API Key Setup

**Option 1: Environment Variable (Recommended for Production)**

```bash
# .env.local
VITE_AUDIENCELAB_API_KEY=your_api_key_here
```

**Option 2: localStorage (For Development/Testing)**

The dashboard will prompt you to enter your API key in the Settings tab if not found in environment variables.

### Processing Settings

Configure in the Enrichment tab:

- **Parallel Batches:** 1-20 (default: 5)
- **Batch Size:** 100-1000 emails (default: 1000)

Settings are saved to localStorage and persist across sessions.

---

## 🎯 Using the Enhanced Version

### Activating the Full API Integration

**Replace the original EnrichmentTab with the enhanced version:**

```bash
# Backup original
mv features/enrichment/EnrichmentTab.tsx features/enrichment/EnrichmentTab_original.tsx

# Activate enhanced version
mv features/enrichment/EnrichmentTab_v2.tsx features/enrichment/EnrichmentTab.tsx
```

### Features in Enhanced Version

1. **Full API Integration**
   - Real API calls to `api.audiencelab.io`
   - Automatic error handling
   - Retry logic

2. **Parallel Batch Processing**
   - Process 1-20 batches simultaneously
   - Configurable batch size (100-1000)
   - Automatic rate limiting

3. **Real-time Progress Tracking**
   - Live progress bar
   - Batch completion status
   - Credits used tracking
   - Time remaining estimate

4. **Results Display**
   - Complete results table
   - Sort by any column
   - Search/filter
   - Export to CSV/JSON
   - Pagination

5. **Processing Settings**
   - Adjust concurrency on the fly
   - Configure batch size
   - Settings persist in localStorage

---

## 📊 Credit System

### How It Works

The dashboard uses a per-field credit pricing model:

**Base Fields (1 credit):**
- Email, First Name, Last Name, Job Title, Company, etc.

**Phone Fields (3-5 credits):**
- Phone, Mobile Phone (harder to find, higher value)

**Company Data (2-3 credits):**
- Company Revenue, Company Employees, Company Size

**Premium Fields (4-5 credits):**
- Skills, Company Technologies (advanced data)

**Free Fields (0 credits):**
- Confidence Score, Email Status (always included)

### Field Packages

Pre-configured packages for quick selection:

| Package | Fields | Credits/Contact |
|---------|--------|-----------------|
| **Basic** | 6 essential fields | 6 credits |
| **Standard** | 12 fields | 12 credits |
| **Professional** | 17 fields | 20 credits |
| **Premium** | 21 fields | 35 credits |
| **Complete** | All 40+ fields | 50 credits |

### Credit Tracking

- Real-time balance display
- Cost estimation before enrichment
- Credit consumption tracking
- Low credit warnings (5%, 10%, 20%)

---

## 🔄 Workflow

### 1. Upload CSV

- Drag and drop or browse for CSV file
- Automatic email extraction
- Works with any CSV format

### 2. Validation

- Email format validation
- Duplicate detection and removal
- Invalid email filtering
- Preview of valid emails

### 3. Select Fields

- Choose from 40+ fields
- Use pre-configured packages or custom selection
- See credit cost per field
- Real-time cost estimation

### 4. Configure Processing

- Set parallel batches (1-20)
- Set batch size (100-1000)
- Optimize for speed or stability

### 5. Start Enrichment

- Real-time progress tracking
- Batch completion updates
- Credits used monitoring
- Time remaining estimate

### 6. View Results

- Complete results table
- Sort, search, filter
- Export to CSV or JSON
- Pagination for large datasets

---

## 🚀 Deployment

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Output will be in dist/ directory
```

### Deploy to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variable in Vercel dashboard:
# VITE_AUDIENCELAB_API_KEY=your_api_key_here
```

### Deploy to Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build
npm run build

# Deploy
netlify deploy --prod --dir=dist

# Set environment variable in Netlify dashboard:
# VITE_AUDIENCELAB_API_KEY=your_api_key_here
```

### Deploy to Custom Server

```bash
# Build
npm run build

# Copy dist/ folder to your server
# Serve with any static file server (nginx, Apache, etc.)
```

---

## 🧪 Testing

### Test API Connection

1. Open Settings tab
2. Enter API key
3. Click "Test Connection"
4. Should see success message

### Test Enrichment

1. Create a test CSV with 10-20 emails
2. Upload to dashboard
3. Select "Basic" package
4. Set concurrency to 2
5. Start enrichment
6. Verify results appear

---

## 🐛 Troubleshooting

### API Key Not Found

**Error:** `API key not found. Please set VITE_AUDIENCELAB_API_KEY or configure in settings.`

**Solution:**
1. Check `.env.local` file exists
2. Verify API key is set correctly
3. Restart development server
4. Or enter API key in Settings tab

### Rate Limit Exceeded

**Error:** `429 Too Many Requests - Rate limit exceeded`

**Solution:**
1. Reduce parallel batches (try 3-5)
2. Reduce batch size (try 500)
3. Add delay between batches
4. Check your API quota

### CORS Errors

**Error:** `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution:**
1. Use backend proxy (recommended for production)
2. Contact AudienceLab support to whitelist your domain
3. For development, use browser extension to disable CORS

### No Results Displayed

**Issue:** Enrichment completes but no results shown

**Solution:**
1. Check browser console for errors
2. Verify API response format matches expected structure
3. Check that selected fields are in API response
4. Try with fewer fields first

---

## 📝 API Reference

### Enrichment Endpoint

```
POST https://api.audiencelab.io/enrich/v1/query
```

**Headers:**
```
X-API-Key: your_api_key
Content-Type: application/json
```

**Request Body:**
```json
{
  "emails": ["email1@example.com", "email2@example.com"],
  "columns": ["email", "first_name", "last_name", "company"],
  "page_size": 100
}
```

**Response:**
```json
{
  "data": {
    "contacts": [
      {
        "email": "email1@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "company": "Acme Inc"
      }
    ],
    "cursor": "optional_pagination_cursor",
    "has_more": false
  },
  "usage": {
    "records_used_hour": 100,
    "records_limit_hour": 10000,
    "records_used_day": 500,
    "records_limit_day": 100000,
    "records_used_month": 5000,
    "records_limit_month": 500000
  }
}
```

### Rate Limits

- **Enrichment API:** 30 requests/minute
- **Batch Size:** Max 1,000 emails per request
- **Recommended Concurrency:** 5-10 batches

---

## 🎨 Customization

### Add SPARK Branding

Edit `index.html` or create a CSS file:

```css
:root {
    --spark-blue: #3B82F6;
    --spark-indigo: #6366F1;
    --spark-gradient: linear-gradient(135deg, #3B82F6 0%, #6366F1 100%);
}

/* Apply to header */
header {
    background: var(--spark-gradient);
}
```

### Modify Field Costs

Edit `constants.ts`:

```typescript
export const ALL_FIELDS: Field[] = [
    { id: 'email', name: 'Email', cost: 1, category: 'personal' },
    { id: 'phone', name: 'Phone', cost: 5, category: 'personal' }, // Change cost here
    // ...
];
```

### Add New Field Packages

Edit `constants.ts`:

```typescript
export const FIELD_PACKAGES: FieldPackage[] = [
    // ... existing packages
    { 
        id: 'enterprise', 
        name: 'Enterprise', 
        fields: ['email', 'first_name', /* ... */], 
        total_credits: 75 
    },
];
```

---

## 📞 Support

### Documentation

- **Full API Docs:** See `AudienceLab_API_Documentation.md`
- **Quick References:** See `*_API_Quick_Reference.md` files
- **LLM Context:** See `AudienceLab_LLM_Context_Document.md`

### Issues

For bugs or feature requests, contact your AudienceLab account manager.

---

## ✅ Checklist

Before deploying to production:

- [ ] API key configured in environment variables
- [ ] Test enrichment with sample data
- [ ] Verify credit system calculations
- [ ] Test export functionality (CSV, JSON)
- [ ] Check responsive design on mobile
- [ ] Apply SPARK branding
- [ ] Set up error tracking (Sentry, etc.)
- [ ] Configure analytics (Google Analytics, etc.)
- [ ] Test with large datasets (10K+ emails)
- [ ] Verify rate limiting works correctly

---

## 🎉 You're Ready!

Your AudienceLab Enrichment Dashboard is now set up and ready to use.

**Next Steps:**
1. Run `npm run dev` to start development server
2. Upload a test CSV file
3. Try enriching with different field packages
4. Export results and verify data quality
5. Deploy to production when ready

**Happy Enriching! 🚀**

