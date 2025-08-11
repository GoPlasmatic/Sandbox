# Multi-stage build for Docusaurus application

# Stage 1: Build stage
FROM node:20-alpine AS builder

# Build argument for API URL (can be overridden during build)
ARG REFRAME_API_URL=http://localhost:3000

# Set environment variable for build process
ENV REFRAME_API_URL=$REFRAME_API_URL

# Set working directory
WORKDIR /app

# Copy package files
COPY website/package*.json ./

# Install dependencies
RUN npm ci --only=production && \
    npm cache clean --force

# Copy website source
COPY website/ ./

# Build the application with the API URL configuration
RUN npm run build

# Stage 2: Production stage
FROM node:20-alpine

# Install serve to run the static site
RUN npm install -g serve

# Set working directory
WORKDIR /app

# Copy built application from builder stage
COPY --from=builder /app/build ./build

# Expose port 3000
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start the application
CMD ["serve", "-s", "build", "-l", "3000"]