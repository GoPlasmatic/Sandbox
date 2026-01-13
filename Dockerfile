# Multi-stage build for mdbook documentation

# Stage 1: Build stage with mdbook
FROM rust:alpine AS builder

# Install mdbook
RUN apk add --no-cache musl-dev && \
    cargo install mdbook --no-default-features

# Set working directory
WORKDIR /app

# Copy documentation source
COPY docs/ ./docs/

# Build the documentation
RUN mdbook build docs

# Stage 2: Production stage with nginx
FROM nginx:alpine

# Copy built documentation from builder stage
COPY --from=builder /app/docs/book /usr/share/nginx/html

# Copy custom nginx config for SPA routing
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ $uri.html /index.html; \
    } \
    error_page 404 /404.html; \
    gzip on; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript; \
}' > /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
