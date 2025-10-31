# Multi-stage build for production
FROM node:20-alpine AS builder

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy package.json only
COPY package.json ./

# Install dependencies (without lockfile, will resolve latest compatible versions)
RUN npm install --legacy-peer-deps --no-audit --no-fund

# Copy source code
COPY client ./client
COPY shared ./shared  
COPY server ./server
COPY vite.config.ts ./
COPY tsconfig.json ./
COPY tailwind.config.ts ./
COPY postcss.config.js ./

# Build frontend only using vite directly
ENV NODE_ENV=production
RUN npx vite build

# Verify build succeeded
RUN test -f dist/public/index.html || (echo "ERROR: Build failed - index.html not found" && exit 1)

# Production stage
FROM nginx:alpine

# Copy static files from builder
COPY --from=builder /app/dist/public /usr/share/nginx/html

# Copy nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s CMD wget -q --spider http://localhost/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

