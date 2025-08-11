# API Configuration Guide

## Overview

The Reframe API URL is configurable at build time using environment variables. This allows you to deploy the same codebase to different environments with different API endpoints.

## Configuration Methods

### 1. Environment Variable (Recommended for Production)

Set the `REFRAME_API_URL` environment variable when building the site:

```bash
# Linux/Mac
export REFRAME_API_URL=https://api.your-domain.com
npm run build

# Windows
set REFRAME_API_URL=https://api.your-domain.com
npm run build

# Or inline
REFRAME_API_URL=https://api.your-domain.com npm run build
```

### 2. Using .env File (Development)

Create a `.env` file in the website directory:

```bash
cp .env.example .env
```

Then edit `.env`:
```
REFRAME_API_URL=http://localhost:3000
```

### 3. Default Configuration

If no environment variable is set, the default API URL is `http://localhost:3000`.

## Deployment Examples

### Vercel

Set the environment variable in your Vercel project settings:
- Go to Project Settings → Environment Variables
- Add `REFRAME_API_URL` with your production API URL

### Netlify

Set in netlify.toml or in the Netlify UI:
```toml
[build.environment]
  REFRAME_API_URL = "https://api.your-domain.com"
```

### Docker

```dockerfile
ARG REFRAME_API_URL=https://api.your-domain.com
ENV REFRAME_API_URL=$REFRAME_API_URL
RUN npm run build
```

### GitHub Actions

```yaml
- name: Build website
  env:
    REFRAME_API_URL: ${{ secrets.REFRAME_API_URL }}
  run: npm run build
```

## Testing Different Configurations

To test with different API URLs without rebuilding:

1. **For Development (with CORS disabled in browser):**
   ```bash
   REFRAME_API_URL=http://localhost:3000 npm start
   ```

2. **For Production Build:**
   ```bash
   REFRAME_API_URL=https://api.production.com npm run build
   npm run serve
   ```

## Troubleshooting

### CORS Issues

If you're getting CORS errors in development:

1. **Option 1:** Disable CORS in your browser for development
   - Chrome: `--disable-web-security --user-data-dir=/tmp/chrome`
   - Firefox: Set `security.fileuri.strict_origin_policy` to false in about:config

2. **Option 2:** Configure CORS on your Reframe API server

### API URL Not Updating

If the API URL doesn't seem to update:

1. Clear the build cache: `npm run clear`
2. Rebuild the site: `npm run build`
3. Check that the environment variable is properly set: `echo $REFRAME_API_URL`

## Current Configuration

The current API URL configuration can be viewed in the browser console:

1. Open Developer Tools (F12)
2. Go to Console
3. The API URL is logged when making requests

## Security Notes

- Never commit `.env` files with production API URLs to version control
- Use environment-specific builds for different deployments
- Consider using API keys or authentication for production APIs