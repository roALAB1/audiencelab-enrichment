# Deployment & Enterprise Setup Guide

This document provides comprehensive instructions for deploying the AudienceLab Enrichment Dashboard to production and setting up enterprise-grade infrastructure.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [CI/CD Pipeline Setup](#cicd-pipeline-setup)
3. [Deployment Options](#deployment-options)
4. [Security Configuration](#security-configuration)
5. [Monitoring & Analytics](#monitoring--analytics)
6. [Performance Optimization](#performance-optimization)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools
- Node.js 20+ or 18+
- npm or pnpm
- Git
- GitHub account (for CI/CD)

### Optional Tools
- Docker & Docker Compose (for containerized deployment)
- Vercel CLI or Netlify CLI
- AWS CLI (for S3/CloudFront deployment)

---

## CI/CD Pipeline Setup

### GitHub Actions

The project includes three GitHub Actions workflows:

#### 1. Main CI/CD Pipeline (`.github/workflows/ci.yml`)

**Triggers:**
- Push to `main`, `master`, or `develop` branches
- Pull requests to these branches

**Jobs:**
1. **Lint** - Code quality checks and TypeScript validation
2. **Build** - Application build and artifact creation
3. **Security** - npm audit for vulnerabilities
4. **Dependency Review** - Check for security issues in dependencies (PRs only)
5. **Deploy Preview** - Deploy PR previews to Vercel
6. **Deploy Production** - Deploy to production (main/master only)

#### 2. CodeQL Security Scan (`.github/workflows/codeql.yml`)

**Triggers:**
- Push to main branches
- Pull requests
- Weekly schedule (Mondays at midnight)

**Purpose:**
- Automated security vulnerability scanning
- Code quality analysis
- Dependency security checks

#### 3. Dependabot (`.github/dependabot.yml`)

**Purpose:**
- Automatic dependency updates
- Security vulnerability patches
- Weekly update schedule

### Setting Up GitHub Actions

1. **Push code to GitHub:**
```bash
git remote add origin https://github.com/your-username/audiencelab-enrichment.git
git push -u origin main
```

2. **Configure GitHub Secrets:**

Go to `Settings > Secrets and variables > Actions` and add:

| Secret Name | Description | Required For |
|------------|-------------|--------------|
| `VERCEL_TOKEN` | Vercel deployment token | Vercel deployment |
| `VERCEL_ORG_ID` | Vercel organization ID | Vercel deployment |
| `VERCEL_PROJECT_ID` | Vercel project ID | Vercel deployment |
| `NETLIFY_AUTH_TOKEN` | Netlify authentication token | Netlify deployment |
| `NETLIFY_SITE_ID` | Netlify site ID | Netlify deployment |

3. **Enable workflows:**
- Workflows are automatically enabled when you push to GitHub
- Check the "Actions" tab to see workflow runs

---

## Deployment Options

### Option 1: Vercel (Recommended)

**Advantages:**
- Zero-configuration deployment
- Automatic HTTPS
- Global CDN
- Preview deployments for PRs
- Serverless functions support

**Steps:**

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Login to Vercel:**
```bash
vercel login
```

3. **Deploy:**
```bash
# Development deployment
vercel

# Production deployment
vercel --prod
```

4. **Configure project:**
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

5. **Set environment variables in Vercel dashboard:**
- `VITE_AUDIENCELAB_API_KEY`
- Any other required variables

**Configuration file:** `vercel.json` (already included)

---

### Option 2: Netlify

**Advantages:**
- Simple deployment
- Form handling
- Split testing
- Analytics

**Steps:**

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Login:**
```bash
netlify login
```

3. **Deploy:**
```bash
# Build first
npm run build

# Deploy
netlify deploy --prod --dir=dist
```

4. **Or connect GitHub repository:**
- Go to Netlify dashboard
- Click "New site from Git"
- Select your repository
- Configure build settings:
  - Build command: `npm run build`
  - Publish directory: `dist`

**Configuration file:** `netlify.toml` (already included)

---

### Option 3: Docker Container

**Advantages:**
- Consistent environment
- Easy scaling
- Works anywhere (AWS, GCP, Azure, DigitalOcean)

**Steps:**

1. **Build Docker image:**
```bash
docker build -t audiencelab-enrichment:latest .
```

2. **Run container:**
```bash
docker run -d -p 3001:80 --name audiencelab audiencelab-enrichment:latest
```

3. **Or use Docker Compose:**
```bash
docker-compose up -d
```

4. **Push to container registry:**
```bash
# Tag for Docker Hub
docker tag audiencelab-enrichment:latest your-username/audiencelab-enrichment:latest

# Push
docker push your-username/audiencelab-enrichment:latest
```

**Configuration files:**
- `Dockerfile` (multi-stage build)
- `docker-compose.yml`
- `nginx.conf` (nginx configuration)

---

### Option 4: AWS S3 + CloudFront

**Advantages:**
- Highly scalable
- Low cost
- Global CDN
- Custom domain support

**Steps:**

1. **Build application:**
```bash
npm run build
```

2. **Create S3 bucket:**
```bash
aws s3 mb s3://audiencelab-enrichment
```

3. **Configure bucket for static hosting:**
```bash
aws s3 website s3://audiencelab-enrichment --index-document index.html --error-document index.html
```

4. **Upload files:**
```bash
aws s3 sync dist/ s3://audiencelab-enrichment --delete
```

5. **Set up CloudFront distribution** (optional but recommended)

---

### Option 5: GitHub Pages

**Advantages:**
- Free hosting
- Simple setup
- Good for demos

**Steps:**

1. **Install gh-pages:**
```bash
npm install -D gh-pages
```

2. **Add deploy script to `package.json`:**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **Deploy:**
```bash
npm run deploy
```

4. **Configure GitHub Pages:**
- Go to repository Settings > Pages
- Select `gh-pages` branch
- Save

---

## Security Configuration

### Security Headers

All deployment configurations include security headers:

- **X-Frame-Options:** Prevents clickjacking
- **X-Content-Type-Options:** Prevents MIME sniffing
- **X-XSS-Protection:** Enables XSS filter
- **Referrer-Policy:** Controls referrer information
- **Permissions-Policy:** Restricts browser features

### HTTPS

- **Vercel/Netlify:** Automatic HTTPS with Let's Encrypt
- **Docker:** Use reverse proxy (nginx, Caddy) with SSL
- **AWS:** Use CloudFront with ACM certificate

### Environment Variables

**Never commit sensitive data!**

1. Create `.env.local` for local development
2. Use platform-specific secret management:
   - Vercel: Environment Variables in dashboard
   - Netlify: Environment Variables in dashboard
   - Docker: Use secrets or environment files
   - AWS: Use Systems Manager Parameter Store

---

## Testing Infrastructure

### Unit Tests

**Framework:** Vitest + React Testing Library

**Run tests:**
```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

**Configuration:** `vitest.config.ts`

### Code Quality

**ESLint:**
```bash
npm run lint
```

**Prettier:**
```bash
npm run format
```

**TypeScript:**
```bash
npm run type-check
```

---

## Monitoring & Analytics

### Recommended Tools

1. **Sentry** - Error tracking
   - Sign up at sentry.io
   - Add `VITE_SENTRY_DSN` to environment variables
   - Install: `npm install @sentry/react`

2. **Google Analytics** - Usage analytics
   - Create GA4 property
   - Add `VITE_GA_TRACKING_ID` to environment variables

3. **Vercel Analytics** - Performance monitoring (if using Vercel)
   - Automatically available
   - View in Vercel dashboard

4. **LogRocket** - Session replay
   - Sign up at logrocket.com
   - Install: `npm install logrocket`

### Health Checks

**Docker deployment includes health check endpoint:**
```
GET /health
Response: "healthy"
```

---

## Performance Optimization

### Build Optimization

1. **Code splitting** - Automatic with Vite
2. **Tree shaking** - Removes unused code
3. **Minification** - Reduces bundle size
4. **Compression** - Gzip/Brotli enabled

### Caching Strategy

**Static assets:** 1 year cache (immutable)
**HTML:** No cache (always fresh)
**API responses:** Custom cache headers

### CDN Configuration

- Use Vercel/Netlify CDN (automatic)
- Or CloudFront for AWS deployments
- Enable HTTP/2 and HTTP/3

---

## Continuous Integration Best Practices

### Branch Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Urgent production fixes

### Commit Convention

Use conventional commits:
```
feat: Add new enrichment field
fix: Resolve credit calculation bug
docs: Update deployment guide
style: Format code with Prettier
refactor: Simplify credit system logic
test: Add tests for CSV upload
chore: Update dependencies
```

### Pull Request Workflow

1. Create feature branch
2. Make changes and commit
3. Push to GitHub
4. Open pull request
5. Automated checks run:
   - Linting
   - Type checking
   - Tests
   - Security scan
   - Build verification
6. Preview deployment created
7. Code review
8. Merge to main
9. Automatic production deployment

---

## Troubleshooting

### Build Failures

**Issue:** TypeScript errors
```bash
# Check errors
npx tsc --noEmit

# Fix common issues
npm run lint --fix
```

**Issue:** Missing dependencies
```bash
# Clean install
rm -rf node_modules package-lock.json
npm install
```

### Deployment Failures

**Vercel:**
- Check build logs in Vercel dashboard
- Verify environment variables
- Ensure `vercel.json` is correct

**Netlify:**
- Check deploy logs
- Verify `netlify.toml` configuration
- Check build command and publish directory

**Docker:**
```bash
# Check container logs
docker logs audiencelab

# Rebuild image
docker build --no-cache -t audiencelab-enrichment:latest .
```

### Runtime Errors

**Check browser console:**
- Open DevTools (F12)
- Check Console tab for errors
- Check Network tab for failed requests

**Common issues:**
- Missing environment variables
- CORS errors (check API configuration)
- 404 errors (check routing configuration)

---

## Scaling Considerations

### Horizontal Scaling

- Use load balancer (AWS ALB, nginx)
- Deploy multiple instances
- Use container orchestration (Kubernetes, ECS)

### Database Integration

For enterprise scale:
- Add PostgreSQL/MySQL for data persistence
- Store enrichment history
- User accounts and authentication
- API rate limiting per user

### Queue System

For large batch jobs:
- Implement job queue (Bull, BullMQ)
- Background processing
- Progress tracking
- Retry logic

### Caching Layer

- Redis for session storage
- Cache API responses
- Rate limit tracking

---

## Production Checklist

Before going live:

- [ ] Environment variables configured
- [ ] HTTPS enabled
- [ ] Security headers set
- [ ] Error tracking enabled (Sentry)
- [ ] Analytics configured (GA4)
- [ ] Performance monitoring active
- [ ] Backup strategy in place
- [ ] CI/CD pipeline tested
- [ ] Load testing completed
- [ ] Documentation updated
- [ ] Team trained on deployment process
- [ ] Rollback plan documented
- [ ] Monitoring alerts configured
- [ ] Custom domain configured
- [ ] SSL certificate valid

---

## Support

For deployment issues:
- Check GitHub Actions logs
- Review platform-specific documentation
- Contact support@audiencelab.io

---

**Last Updated:** 2024-10-30
**Version:** 1.0.0

