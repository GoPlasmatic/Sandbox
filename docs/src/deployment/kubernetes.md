# Kubernetes Deployment

Deploy Reframe on Kubernetes for production workloads.

## Basic Deployment

### Deployment

```yaml
# reframe-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: reframe
  labels:
    app: reframe
spec:
  replicas: 3
  selector:
    matchLabels:
      app: reframe
  template:
    metadata:
      labels:
        app: reframe
    spec:
      containers:
      - name: reframe
        image: ghcr.io/goplasmatic/reframe:3.1.8
        ports:
        - containerPort: 3000
        env:
        - name: RUST_LOG
          value: "info"
        - name: TOKIO_WORKER_THREADS
          value: "4"
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "1000m"
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

### Service

```yaml
# reframe-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: reframe
spec:
  selector:
    app: reframe
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

### Ingress

```yaml
# reframe-ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: reframe
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  ingressClassName: nginx
  tls:
  - hosts:
    - api.example.com
    secretName: reframe-tls
  rules:
  - host: api.example.com
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: reframe
            port:
              number: 80
```

## Apply Resources

```bash
kubectl apply -f reframe-deployment.yaml
kubectl apply -f reframe-service.yaml
kubectl apply -f reframe-ingress.yaml
```

## ConfigMap

### Configuration File

```yaml
# reframe-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: reframe-config
data:
  reframe.config.json: |
    {
      "server": {
        "host": "0.0.0.0",
        "port": 3000
      },
      "logging": {
        "level": "info",
        "format": "json"
      }
    }
```

### Mount ConfigMap

```yaml
spec:
  containers:
  - name: reframe
    volumeMounts:
    - name: config
      mountPath: /app/reframe.config.json
      subPath: reframe.config.json
  volumes:
  - name: config
    configMap:
      name: reframe-config
```

## Custom Package

### Using PersistentVolume

```yaml
# reframe-pv.yaml
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: reframe-packages
spec:
  accessModes:
    - ReadOnlyMany
  resources:
    requests:
      storage: 1Gi
```

```yaml
spec:
  containers:
  - name: reframe
    volumeMounts:
    - name: packages
      mountPath: /packages/custom
    env:
    - name: REFRAME_PACKAGE_PATH
      value: "/packages"
  volumes:
  - name: packages
    persistentVolumeClaim:
      claimName: reframe-packages
```

## Horizontal Pod Autoscaler

```yaml
# reframe-hpa.yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: reframe
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: reframe
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
  - type: Resource
    resource:
      name: memory
      target:
        type: Utilization
        averageUtilization: 80
```

## Pod Disruption Budget

```yaml
# reframe-pdb.yaml
apiVersion: policy/v1
kind: PodDisruptionBudget
metadata:
  name: reframe
spec:
  minAvailable: 1
  selector:
    matchLabels:
      app: reframe
```

## Network Policy

```yaml
# reframe-network-policy.yaml
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: reframe
spec:
  podSelector:
    matchLabels:
      app: reframe
  policyTypes:
  - Ingress
  - Egress
  ingress:
  - from:
    - namespaceSelector:
        matchLabels:
          name: ingress-nginx
    ports:
    - protocol: TCP
      port: 3000
  egress:
  - to:
    - namespaceSelector: {}
    ports:
    - protocol: TCP
      port: 443
```

## Helm Chart

### values.yaml

```yaml
replicaCount: 3

image:
  repository: ghcr.io/goplasmatic/reframe
  tag: "3.1.8"
  pullPolicy: IfNotPresent

service:
  type: ClusterIP
  port: 80

ingress:
  enabled: true
  className: nginx
  hosts:
    - host: api.example.com
      paths:
        - path: /
          pathType: Prefix
  tls:
    - secretName: reframe-tls
      hosts:
        - api.example.com

resources:
  limits:
    cpu: 1000m
    memory: 512Mi
  requests:
    cpu: 250m
    memory: 256Mi

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70

env:
  RUST_LOG: info
  TOKIO_WORKER_THREADS: "4"
```

## Monitoring

### ServiceMonitor (Prometheus)

```yaml
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: reframe
spec:
  selector:
    matchLabels:
      app: reframe
  endpoints:
  - port: http
    path: /metrics
    interval: 30s
```

## Operations

### Check Status

```bash
kubectl get pods -l app=reframe
kubectl get svc reframe
kubectl get ingress reframe
```

### View Logs

```bash
kubectl logs -l app=reframe -f
```

### Scale

```bash
kubectl scale deployment reframe --replicas=5
```

### Rolling Update

```bash
kubectl set image deployment/reframe reframe=ghcr.io/goplasmatic/reframe:3.2.0
kubectl rollout status deployment/reframe
```

### Rollback

```bash
kubectl rollout undo deployment/reframe
```

---

**[Docker Deployment →](./docker.md)**

**[Configuration Reference →](./configuration.md)**
