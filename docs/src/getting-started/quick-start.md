# Quick Start: Run Reframe in 5 Minutes

Get the open source SWIFT MT to ISO 20022 transformation engine running locally.

> **Note**: This guide uses the CBPR+ package (SWIFT MT ↔ ISO 20022). Reframe supports custom transformation packages for other formats.

## Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- curl or similar HTTP client

## Step 1: Start Reframe

```bash
# Pull and run Reframe
docker run -d -p 3000:3000 --name reframe plasmatic/reframe:latest

# Verify it's running
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "healthy",
  "engines": {
    "transform": "ready",
    "generation": "ready",
    "validation": "ready"
  }
}
```

## Step 2: Transform a Message (CBPR+ Example)

Transform an MT103 to ISO 20022 pacs.008 using the included CBPR+ package:

```bash
curl -X POST http://localhost:3000/api/transform \
  -H "Content-Type: application/json" \
  -d '{
    "message": "{1:F01BNPAFRPPXXX0000000000}{2:I103DEUTDEFFXXXXN}{4:\n:20:REF123456\n:23B:CRED\n:32A:250115USD50000,00\n:50K:/12345678\nACME CORPORATION\n123 MAIN STREET\nNEW YORK NY 10001\n:59:/98765432\nGLOBAL TRADING LTD\n456 HIGH STREET\nLONDON EC1A 1BB\n:71A:SHA\n-}"
  }'
```

The response contains the transformed pacs.008 XML message.

## Step 3: Generate a Sample Message

Generate a test MT103 message:

```bash
curl -X POST http://localhost:3000/api/generate \
  -H "Content-Type: application/json" \
  -d '{"message_type": "MT103", "scenario": "standard"}'
```

## Step 4: Validate a Message

Validate any MT or ISO 20022 message:

```bash
curl -X POST http://localhost:3000/api/validate \
  -H "Content-Type: application/json" \
  -d '{
    "message": "<your message here>",
    "business_validation": true
  }'
```

## Try the Playground

For a visual interface, use the interactive playground:

**[Open Playground →](../playground/index.md)**

The playground lets you:
- Generate sample messages
- Transform between formats
- Validate messages
- See API requests and responses

## What's Next?

<div class="next-steps">

**[First Transformation Tutorial →](./first-transformation.md)**
Step-by-step guide to understanding MT103 → pacs.008 transformation

**[CBPR+ Guide →](../cbpr-plus/overview.md)**
Explore all supported message types

**[API Reference →](../api-reference/overview.md)**
Complete API documentation

</div>

## Common Issues

### Port Already in Use

```bash
# Check what's using port 3000
lsof -i :3000

# Use a different port
docker run -p 8080:3000 plasmatic/reframe:latest
```

### Container Not Starting

```bash
# Check container logs
docker logs reframe

# Run in foreground for debugging
docker run -p 3000:3000 plasmatic/reframe:latest
```

### Connection Refused

Ensure Docker is running and the container is healthy:

```bash
docker ps
docker inspect reframe | grep Health
```
