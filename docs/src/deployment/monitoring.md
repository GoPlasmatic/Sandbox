# Monitoring

Monitor Reframe in production environments.

## Health Checks

### HTTP Health Endpoint

```bash
curl http://localhost:3000/health
```

Response:
```json
{
  "status": "healthy",
  "engines": {
    "transform": "ready",
    "generation": "ready",
    "validation": "ready"
  },
  "package": {
    "id": "swift-cbpr-mt-mx",
    "version": "2.1.2",
    "loaded_at": "2025-01-15T10:30:00Z"
  },
  "uptime_seconds": 86400
}
```

### Docker Health Check

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 10s
```

### Kubernetes Probes

```yaml
readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 10

livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 15
  periodSeconds: 20
```

## Metrics

### Prometheus Endpoint

```bash
curl http://localhost:3000/metrics
```

### Available Metrics

```
# Request metrics
reframe_requests_total{endpoint,status}
reframe_request_duration_seconds{endpoint,le}

# Transformation metrics
reframe_transformations_total{direction,type,status}
reframe_transformation_duration_seconds{direction,type,le}

# Validation metrics
reframe_validations_total{format,status}

# Generation metrics
reframe_generations_total{type}

# System metrics
reframe_uptime_seconds
reframe_package_workflows_total
```

### Prometheus Configuration

```yaml
# prometheus.yml
scrape_configs:
  - job_name: 'reframe'
    static_configs:
      - targets: ['reframe:3000']
    metrics_path: /metrics
    scrape_interval: 30s
```

### Grafana Dashboard

Key panels to include:

- **Request Rate**: `rate(reframe_requests_total[5m])`
- **Error Rate**: `rate(reframe_requests_total{status="error"}[5m])`
- **Latency P99**: `histogram_quantile(0.99, rate(reframe_request_duration_seconds_bucket[5m]))`
- **Transformations by Type**: `sum by (type) (rate(reframe_transformations_total[5m]))`

## Logging

### Log Levels

| Level | Description |
|-------|-------------|
| `error` | Errors only |
| `warn` | Warnings and errors |
| `info` | General info (recommended for production) |
| `debug` | Debug information |
| `trace` | Detailed tracing |

### Log Formats

**compact** (default):
```
2025-01-15T10:30:00Z INFO reframe::api: Transform request direction=outgoing type=MT103
```

**json** (for log aggregation):
```json
{"timestamp":"2025-01-15T10:30:00Z","level":"INFO","target":"reframe::api","message":"Transform request","direction":"outgoing","type":"MT103"}
```

**pretty** (for development):
```
2025-01-15T10:30:00.123Z  INFO reframe::api: Transform request
    direction: outgoing
    type: MT103
```

### Log Aggregation

#### Fluentd

```yaml
<source>
  @type tail
  path /var/log/reframe/*.log
  pos_file /var/log/fluentd/reframe.pos
  tag reframe
  <parse>
    @type json
  </parse>
</source>
```

#### Loki

```yaml
scrape_configs:
  - job_name: reframe
    static_configs:
      - targets:
          - localhost
        labels:
          job: reframe
          __path__: /var/log/reframe/*.log
```

## Alerting

### Key Alerts

#### High Error Rate

```yaml
- alert: ReframeHighErrorRate
  expr: rate(reframe_requests_total{status="error"}[5m]) > 0.1
  for: 5m
  labels:
    severity: critical
  annotations:
    summary: High error rate in Reframe
```

#### High Latency

```yaml
- alert: ReframeHighLatency
  expr: histogram_quantile(0.99, rate(reframe_request_duration_seconds_bucket[5m])) > 1
  for: 5m
  labels:
    severity: warning
  annotations:
    summary: High latency in Reframe
```

#### Service Down

```yaml
- alert: ReframeDown
  expr: up{job="reframe"} == 0
  for: 1m
  labels:
    severity: critical
  annotations:
    summary: Reframe service is down
```

#### Package Reload Failed

```yaml
- alert: ReframePackageError
  expr: reframe_package_load_errors_total > 0
  for: 1m
  labels:
    severity: warning
  annotations:
    summary: Package reload failed
```

## Tracing

### OpenTelemetry (if enabled)

```json
{
  "tracing": {
    "enabled": true,
    "exporter": "otlp",
    "endpoint": "http://jaeger:4317",
    "service_name": "reframe"
  }
}
```

### Trace Context

Reframe propagates trace context through headers:
- `traceparent`
- `tracestate`

## Dashboard Example

### Key Metrics to Display

1. **Overview**
   - Requests per second
   - Error rate percentage
   - Average latency

2. **Transformations**
   - By direction (outgoing/incoming)
   - By message type
   - Success/failure rate

3. **System**
   - CPU usage
   - Memory usage
   - Uptime

4. **Package**
   - Loaded workflows
   - Last reload time
   - Reload errors

## Best Practices

1. **Set appropriate log level** - Use `info` for production
2. **Use JSON logging** - Easier to parse and aggregate
3. **Configure alerts** - Catch issues before users notice
4. **Monitor latency** - P99 is more important than average
5. **Track by message type** - Identify problematic transformations
6. **Set retention policies** - Don't fill up storage

---

**[Configuration Reference →](./configuration.md)**

**[Docker Deployment →](./docker.md)**
