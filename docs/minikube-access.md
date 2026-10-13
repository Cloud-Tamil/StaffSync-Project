# ☸️ Minikube Access & Deployment Guide · PulseHR Enterprise

This guide provides step-by-step instructions to build, deploy, access, and troubleshoot **PulseHR Enterprise** on **Minikube** (locally or inside **Google Cloud Shell**).

---

## 📑 Quick Navigation
1. [Prerequisites](#1-prerequisites)
2. [Start Minikube](#2-start-minikube)
3. [Build & Load Docker Image into Minikube](#3-build--load-docker-image-into-minikube) *(Crucial step to prevent ImagePullBackOff)*
4. [Deploy the Application via Kubernetes Manifests](#4-deploy-the-application-via-kubernetes-manifests)
5. [How to Access the Application](#5-how-to-access-the-application)
   - [Method A: Google Cloud Shell Web Preview (Recommended for Cloud Shell)](#method-a-google-cloud-shell-web-preview)
   - [Method B: Minikube Service URL (Local Machine)](#method-b-minikube-service-url)
   - [Method C: Direct NodePort with Minikube IP](#method-c-direct-nodeport-with-minikube-ip)
   - [Method D: Minikube Tunnel](#method-d-minikube-tunnel)
6. [Useful Verification & Diagnostic Commands](#6-useful-verification--diagnostic-commands)
7. [Common Issues & Solutions](#7-common-issues--solutions)
8. [Teardown & Cleanup](#8-teardown--cleanup)

---

## 1. Prerequisites

Ensure you have `minikube`, `docker`, and `kubectl` installed:

```bash
# Verify Minikube installation
minikube version

# Verify Kubectl installation
kubectl version --client

# Verify Docker engine
docker --version
```

Make sure your terminal is inside the root project directory:
```bash
pwd
# Expected output ends with your repository folder (e.g. ~/Staffsync)
```

---

## 2. Start Minikube

Start your Minikube cluster using the Docker driver:

### In Google Cloud Shell or Linux:
```bash
minikube start --driver=docker
```

### On macOS / Windows:
```bash
minikube start
```

### Verify cluster is running:
```bash
minikube status
```
*Expected status:*
```text
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

---

## 3. Build & Load Docker Image into Minikube

> ⚠️ **Important:** Because Minikube runs inside its own virtualized environment, images built on your host Docker daemon are not automatically visible to Minikube. You **must** either point your terminal's Docker to Minikube or load the image into Minikube.

Choose **either Option 1 (Fastest)** or **Option 2 (Direct Load)**:

### Option 1: Direct Build inside Minikube Environment (Recommended)
This points your current shell's Docker CLI directly into Minikube's internal Docker engine:

```bash
# 1. Configure shell to use Minikube's Docker daemon
eval $(minikube docker-env)

# 2. Build the production Docker image directly inside Minikube
docker build -t pulsehr:latest .
```
*(Any container image built now is immediately available inside Minikube without pulling).*

---

### Option 2: Build Locally and Load Image into Minikube
If you build with your standard host Docker daemon:

```bash
# 1. Build the image locally
docker build -t pulsehr:latest .

# 2. Load the image into the Minikube cluster
minikube image load pulsehr:latest
```

Verify that the image is present inside Minikube:
```bash
minikube image ls | grep pulsehr
```

---

## 4. Deploy the Application via Kubernetes Manifests

PulseHR includes production-ready manifests under the `k8s/` directory.

### Deploy all manifests in one command (Recommended):
```bash
kubectl apply -k k8s/
```

### Or deploy step-by-step:
```bash
# 1. Namespace & ServiceAccount
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/serviceaccount.yaml

# 2. ConfigMap & Secret
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secret.yaml

# 3. Deployment & Service
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Monitor the Deployment:
```bash
# Watch the rollout progress
kubectl rollout status deployment/pulsehr-deployment -n pulsehr

# Check pods
kubectl get pods -n pulsehr -o wide
```

*Expected output:*
```text
NAME                                  READY   STATUS    RESTARTS   AGE
pulsehr-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          20s
pulsehr-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          20s
```

---

## 5. How to Access the Application

Depending on whether you are running in **Google Cloud Shell** or on your **local machine**, choose the best access method:

### Method A: Google Cloud Shell Web Preview (Recommended for Cloud Shell)
In Google Cloud Shell, you cannot directly open browser windows to private container IPs. Forward the service port:

```bash
kubectl port-forward -n pulsehr svc/pulsehr-service 8080:80
```

1. Look at the top-right toolbar of Google Cloud Shell.
2. Click the **Web Preview** icon (eye / screen icon).
3. Select **"Preview on port 8080"**.
4. The PulseHR web application will open immediately in a new browser tab!

*(Keep the terminal running, or run in the background with `kubectl port-forward -n pulsehr svc/pulsehr-service 8080:80 &`)*.

---

### Method B: Minikube Service URL (Local Workstation)
If running on macOS, Linux, or Windows:

```bash
# Directly open the application in your default web browser:
minikube service pulsehr-service -n pulsehr

# Or print the direct URL:
minikube service pulsehr-service -n pulsehr --url
```

---

### Method C: Direct NodePort with Minikube IP
The service is pre-configured with `NodePort: 30080`:

```bash
# Find Minikube's IP address:
minikube ip

# Test connectivity via curl:
curl -I http://$(minikube ip):30080
```
Open **`http://<MINIKUBE_IP>:30080`** in your browser.

---

### Method D: Minikube Tunnel (LoadBalancer / Ingress)
If you want to access via standard HTTP port:

```bash
# Start Minikube tunnel in a separate terminal:
minikube tunnel
```

If you enabled the ingress addon (`minikube addons enable ingress`):
```bash
kubectl apply -f k8s/ingress.yaml
```
Add `pulsehr.local` to your `/etc/hosts`:
```bash
echo "$(minikube ip) pulsehr.local" | sudo tee -a /etc/hosts
```
Then navigate to `http://pulsehr.local`.

---

## 6. Useful Verification & Diagnostic Commands

### View Pods & Services
```bash
# Get all resources in pulsehr namespace
kubectl get all -n pulsehr

# View endpoints
kubectl get endpoints -n pulsehr
```

### Inspect Pod Logs
```bash
# Stream live logs from all PulseHR containers
kubectl logs -n pulsehr -l app=pulsehr -f --tail=100
```

### Execute Shell inside Pod
```bash
# Open interactive shell in a running pod
POD_NAME=$(kubectl get pods -n pulsehr -l app=pulsehr -o jsonpath='{.items[0].metadata.name}')
kubectl exec -it -n pulsehr $POD_NAME -- sh
```

### Restart the Application
```bash
# Perform rolling restart
kubectl rollout restart deployment/pulsehr-deployment -n pulsehr
```

---

## 7. Common Issues & Solutions

### ❌ Issue 1: `ErrImagePull` or `ImagePullBackOff`
- **Cause:** Minikube is trying to pull `pulsehr:latest` from Docker Hub because it doesn't exist locally in Minikube's Docker daemon.
- **Fix:**
  ```bash
  # Option A: Load host image into Minikube
  minikube image load pulsehr:latest

  # Option B: Rebuild directly in Minikube
  eval $(minikube docker-env)
  docker build -t pulsehr:latest .
  
  # Then trigger rollout
  kubectl rollout restart deployment/pulsehr-deployment -n pulsehr
  ```

---

### ❌ Issue 2: `CrashLoopBackOff` or Container Failing Health Check
- **Cause:** Nginx failed to start or port configuration mismatch.
- **Fix:** Inspect the pod logs and event details:
  ```bash
  kubectl describe pod -n pulsehr -l app=pulsehr
  kubectl logs -n pulsehr -l app=pulsehr --previous
  ```

---

### ❌ Issue 3: Port Forward Already in Use (`bind: address already in use`)
- **Cause:** Another process is bound to port `8080` or `3000`.
- **Fix:** Use a different local port:
  ```bash
  # Forward to port 8081 or 3002 instead:
  kubectl port-forward -n pulsehr svc/pulsehr-service 8081:80
  ```

---

### ❌ Issue 4: Minikube Paused or Out of Resources
- **Fix:** Check resource usage and unpause or allocate more memory:
  ```bash
  minikube status
  minikube unpause
  ```

---

## 8. Teardown & Cleanup

### Remove All PulseHR Kubernetes Resources
```bash
# Delete all resources created by manifests
kubectl delete -k k8s/

# Or delete the entire namespace:
kubectl delete namespace pulsehr
```

### Stop or Delete Minikube Cluster
```bash
# Stop Minikube cluster (preserves data)
minikube stop

# Delete Minikube cluster completely (clean slate)
minikube delete
```
