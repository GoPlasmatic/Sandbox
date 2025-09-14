# Docker Configuration Guide

This guide provides instructions on how to configure the API endpoint for the Docusaurus application when using Docker.

## Setting the API URL

The application uses the `REFRAME_API_URL` environment variable to set the API endpoint. This **must be set at build time** when creating the Docker image.

### Method 1: Using Docker Compose (Recommended)

This is the preferred method for managing the API URL, as it integrates seamlessly with your development workflow.

1. Create a `.env` file in the project root:
```bash
cp .env.example .env
```

2. Edit the `.env` file and set your API URL:
```bash
REFRAME_API_URL=https://your-api-server.comk
```

3. Build and run with docker-compose:
```bash
docker-compose up --build
```

The `--build` flag ensures the image is rebuilt with the new environment variable.
**Note:** For security, ensure your .env file is added to your .gitignore to prevent it from being committed to version control.

### Method 2: Using Docker Build Command

If building the image directly with Docker:

```bash
# Build with custom API URL
docker build --build-arg REFRAME_API_URL=https://your-api-server.com -t docusaurus-app .

# Run the container
docker run -p 3000:3000 docusaurus-app
```

### Method 3: Using Environment Variable at Build Time

```bash
# Export the environment variable
export REFRAME_API_URL=https://your-api-server.com

# Build with docker-compose (it will use the exported variable)
docker-compose build

# Run the container
docker-compose up
```

## Important Notes

1. **Build-Time Configuration**: The `REFRAME_API_URL` must be set at build time, not runtime. This is because Docusaurus bakes the configuration into the static build.

2. **Rebuilding Required**: If you change the `REFRAME_API_URL`, you must rebuild the Docker image for the changes to take effect:
   ```bash
   docker-compose build --no-cache
   docker-compose up
   ```

3. **Default Value**: If `REFRAME_API_URL` is not set, it defaults to `http://localhost:3000`. This default is configured within the Dockerfile or the application's source code.

## Verifying the Configuration

After building and running the container, you can verify the API URL is correctly configured:

1. Open the application in your browser.
2. Open the browser's Developer Tools (press **F12**).
3. Go to the **Network** tab.
4. Perform any action that makes an API call.
5. Check that the requests are directed to your configured API URL.

## Troubleshooting

### API URL Not Updating

If the API URL doesn't seem to update after changing the environment variable:

1. Ensure you're rebuilding the image:
   ```bash
   docker-compose down
   docker-compose build --no-cache
   docker-compose up
   ```

2. Clear your browser cache and hard reload (Ctrl+Shift+R or Cmd+Shift+R).

3. Verify the build argument is being passed correctly:
   ```bash
   docker-compose config
   ```
   This should show the `REFRAME_API_URL` in the build args section.

### Connection Refused Errors

If you're getting connection refused errors when the Docker container tries to reach the API:

1. If the API is running on your host machine, use your machine's IP address instead of `localhost`:
   - On Linux/Mac: `REFRAME_API_URL=http://host.docker.internal:3000`
   - On Windows: `REFRAME_API_URL=http://host.docker.internal:3000`

2. If the API is in another Docker container, ensure they're on the same network:
   ```yaml
   # docker-compose.yml
   services:
     docusaurus:
       networks:
         - app-network
     api:
       networks:
         - app-network
   
   networks:
     app-network:
       driver: bridge
   ```
