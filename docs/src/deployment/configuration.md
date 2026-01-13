# Configuration Reference

Complete configuration options for Reframe.

## Configuration Sources

Configuration is loaded in priority order:

1. **Environment variables** (highest)
2. **Configuration file** (`reframe.config.json`)
3. **Built-in defaults** (lowest)

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `REFRAME_HOST` | `0.0.0.0` | Server bind address |
| `REFRAME_PORT` | `3000` | Server port |
| `REFRAME_PACKAGE_PATH` | `/packages` | Package directory |
| `TOKIO_WORKER_THREADS` | CPU cores | Async worker threads |
| `RUST_LOG` | `info` | Log level |
| `RUST_LOG_FORMAT` | `compact` | Log format (compact/json/pretty) |
| `MONGODB_URI` | - | MongoDB connection string |
| `MONGODB_DATABASE` | `reframe` | Database name |

## Configuration File

Create `reframe.config.json` in the working directory:

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "workers": 4
  },

  "logging": {
    "level": "info",
    "format": "compact",
    "file": null
  },

  "packages": [
    {
      "path": "/packages/swift-cbpr",
      "enabled": true
    }
  ],

  "database": {
    "mongodb_uri": "mongodb://localhost:27017",
    "database_name": "reframe",
    "store_messages": false
  },

  "api_docs": {
    "enabled": true,
    "title": "Reframe API",
    "version": "3.1.8"
  }
}
```

## Section Details

### Server

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "workers": 4
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `host` | string | `0.0.0.0` | Bind address |
| `port` | number | `3000` | Listen port |
| `workers` | number | CPU cores | Tokio worker threads |

### Logging

```json
{
  "logging": {
    "level": "info",
    "format": "compact",
    "file": {
      "path": "/var/log/reframe/reframe.log",
      "rotation": "daily",
      "max_files": 7
    }
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `level` | string | `info` | Log level (trace/debug/info/warn/error) |
| `format` | string | `compact` | Output format (compact/json/pretty) |
| `file.path` | string | null | Log file path |
| `file.rotation` | string | `daily` | Rotation (daily/hourly/never) |
| `file.max_files` | number | 7 | Files to keep |

### Packages

```json
{
  "packages": [
    {
      "path": "/packages/swift-cbpr",
      "enabled": true
    },
    {
      "path": "/packages/custom",
      "enabled": false
    }
  ]
}
```

| Option | Type | Description |
|--------|------|-------------|
| `path` | string | Path to package directory |
| `enabled` | boolean | Whether to load this package |

### Database

```json
{
  "database": {
    "mongodb_uri": "mongodb://localhost:27017",
    "database_name": "reframe",
    "store_messages": true,
    "ttl_days": 90
  }
}
```

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `mongodb_uri` | string | - | MongoDB connection URI |
| `database_name` | string | `reframe` | Database name |
| `store_messages` | boolean | false | Store transformed messages |
| `ttl_days` | number | 90 | Message retention days |

### API Documentation

```json
{
  "api_docs": {
    "enabled": true,
    "title": "Reframe API",
    "version": "3.1.8",
    "description": "ISO 20022 Transformation Engine",
    "contact": {
      "name": "Support",
      "email": "support@example.com"
    }
  }
}
```

## Complete Example

```json
{
  "server": {
    "host": "0.0.0.0",
    "port": 3000,
    "workers": 8
  },

  "logging": {
    "level": "info",
    "format": "json",
    "file": {
      "path": "/var/log/reframe/reframe.log",
      "rotation": "daily",
      "max_files": 30
    }
  },

  "packages": [
    {
      "path": "/packages/swift-cbpr",
      "enabled": true
    }
  ],

  "database": {
    "mongodb_uri": "mongodb://mongo:27017",
    "database_name": "reframe_prod",
    "store_messages": true,
    "ttl_days": 365
  },

  "api_docs": {
    "enabled": true,
    "title": "Reframe Production API",
    "version": "3.1.8"
  }
}
```

## Docker Configuration

### Environment Variables

```bash
docker run \
  -e REFRAME_PORT=8080 \
  -e RUST_LOG=debug \
  -e TOKIO_WORKER_THREADS=8 \
  plasmatic/reframe:latest
```

### Configuration File Mount

```bash
docker run \
  -v /path/to/reframe.config.json:/app/reframe.config.json \
  plasmatic/reframe:latest
```

## Kubernetes Configuration

### ConfigMap

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: reframe-config
data:
  reframe.config.json: |
    {
      "server": {
        "port": 3000
      },
      "logging": {
        "level": "info",
        "format": "json"
      }
    }
```

### Secret (for sensitive values)

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: reframe-secrets
type: Opaque
stringData:
  MONGODB_URI: "mongodb://user:pass@host:27017"
```

## Validation

Reframe validates configuration on startup:

```
2025-01-15T10:30:00Z INFO reframe: Loading configuration
2025-01-15T10:30:00Z INFO reframe: Server: 0.0.0.0:3000
2025-01-15T10:30:00Z INFO reframe: Workers: 8
2025-01-15T10:30:00Z INFO reframe: Log level: info
2025-01-15T10:30:00Z INFO reframe: Package: /packages/swift-cbpr (enabled)
```

Invalid configuration causes startup failure with clear error messages.

---

**[Kubernetes Deployment →](./kubernetes.md)**
