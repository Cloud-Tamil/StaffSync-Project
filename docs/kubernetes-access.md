# ☸️ PulseHR Enterprise · Kubernetes Deployment Guide

This directory contains production-ready Kubernetes manifests for deploying **PulseHR Enterprise**.

---

## 📁 Manifest Directory Structure

```
k8s/
├── namespace.yaml         # Dedicated Kubernetes Namespace ('pulsehr')
├── serviceaccount.yaml    # Least-privilege ServiceAccount ('pulsehr-service-account')
├── configmap.yaml         # Application runtime configuration (environment variables)
├── secret.yaml            # Sensitive enterprise secrets (keys, PIN salt, session tokens)
├── deployment.yaml        # High-availability Deployment (2 replicas, rolling updates, health probes)
├── service.yaml           # Service manifest (NodePort 30080 & ClusterIP 80)
├── ingress.yaml           # Ingress manifest (Nginx Ingress controller compatible)
├── hpa.yaml               # Horizontal Pod Autoscaler manifest (2 to 5 replicas based on CPU & Memory)
├── pdb.yaml               # Pod Disruption Budget manifest (minAvailable: 1 for node drain protection)
├── networkpolicy.yaml     # Zero-trust NetworkPolicy (ports 80, 443, 53)
├── kustomization.yaml     # Declarative Kustomize composition
└── README.md              # This operations guide
```

---

## 🚀 1. Deployment Options

### Option A: Declarative Kustomize Deployment (Recommended)
Apply the complete folder declaratively using Kustomize:
```bash
kubectl apply -k k8s/
```

### Option B: All-in-One Manifest
Deploy everything from the single consolidated manifest:
```bash
kubectl apply -f k8s/kubernetes.yaml
```

### Option C: Step-by-Step Modular Deployment
If you prefer applying manifests individually in logical order:
```bash
# 1. Core namespace & security
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/serviceaccount.yaml

# 2. Configuration & Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 3. Workloads & Networking
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
kubectl apply -f k8s/ingress.yaml

# 4. Resilience & Scaling
kubectl apply -f k8s/hpa.yaml
kubectl apply -f k8s/pdb.yaml
kubectl apply -f k8s/networkpolicy.yaml
```

---

## 🔐 2. Configuring Secrets (`k8s/secret.yaml`)

The `k8s/secret.yaml` manifest defines enterprise security credentials:
- `MASTER_PIN_SALT`: Used for supervisor and PIN authentication hashing.
- `ENCRYPTION_KEY`: 256-bit AES encryption key for client backups and payroll exports.
- `JWT_SECRET`: Signing token for session authentication.
- `SESSION_SECRET`: Cookie signature and cryptographic verification.

To generate new random secure keys:
```bash
openssl rand -hex 16
```
Edit `k8s/secret.yaml` before applying, or apply secrets via CLI:
```bash
kubectl create secret generic pulsehr-secrets \
  --namespace=pulsehr \
  --from-literal=MASTER_PIN_SALT=$(openssl rand -hex 16) \
  --from-literal=ENCRYPTION_KEY=$(openssl rand -hex 16) \
  --from-literal=JWT_SECRET=$(openssl rand -hex 16) \
  --from-literal=SESSION_SECRET=$(openssl rand -hex 16) \
  --dry-run=client -o yaml | kubectl apply -f -
```

---

## 🔍 3. Verify Deployment Status

Check that all components are running and healthy:

```bash
# Check all resources in the pulsehr namespace
kubectl get all -n pulsehr

# Check ConfigMaps and Secrets
kubectl get configmap,secret -n pulsehr

# Check pod startup and readiness status
kubectl get pods -n pulsehr -o wide

# Check pod logs
kubectl logs -n pulsehr -l app=pulsehr --tail=50
```

---

## 🌐 4. Accessing the Application

### Method 1: Port-Forwarding (Instant Local Access)
Forward traffic from your local machine directly to the Kubernetes service:
```bash
kubectl port-forward -n pulsehr svc/pulsehr-service 8080:80
```
Open **`http://localhost:8080`** in your browser.

### Method 2: NodePort Access
If you are running Minikube, Docker Desktop, or Kind:
- **Minikube**: Run `minikube service pulsehr-service -n pulsehr`
- **Docker Desktop / Kind**: Access `http://localhost:30080`

### Method 3: Ingress Controller
If you have an ingress controller (such as `ingress-nginx`) active:
```bash
kubectl get ingress -n pulsehr
```

---

## 🔄 5. Zero-Downtime Rolling Update

When you update the Docker image:

```bash
# 1. Build and tag new image
docker build -t pulsehr:v1.1 .

# 2. Update deployment image
kubectl set image deployment/pulsehr-deployment pulsehr=pulsehr:v1.1 -n pulsehr

# 3. Monitor rollout status
kubectl rollout status deployment/pulsehr-deployment -n pulsehr
```

---

## 🧹 6. Teardown & Cleanup

To remove all resources:

```bash
# If deployed via Kustomize:
kubectl delete -k k8s/

# Or if deployed via unified manifest:
kubectl delete -f k8s/kubernetes.yaml
```
