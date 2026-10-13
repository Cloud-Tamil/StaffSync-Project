# 🐳 PulseHR Enterprise · Comprehensive Docker & Container Deployment Guide

This document provides a production-grade guide for containerizing, building, testing, optimizing, and operating **PulseHR Enterprise** using **Docker** and **Docker Compose**.

---

## 📑 Table of Contents
1. [Prerequisites & System Verification](#1-prerequisites--system-verification)
2. [Quick Start (One-Liner Execution)](#2-quick-start-one-liner-execution)
3. [Building the Docker Container Image](#3-building-the-docker-container-image)
4. [Running the Application Container](#4-running-the-application-container)
5. [Docker Compose Orchestration](#5-docker-compose-orchestration)
6. [Inspecting, Logs & Container Management](#6-inspecting-logs--container-management)
7. [Health Checks & Verification](#7-health-checks--verification)
8. [Multi-Architecture & Registry Publishing (Docker Hub / GCR / Artifact Registry)](#8-multi-architecture--registry-publishing)
9. [Debugging & Interactive Shell Access](#9-debugging--interactive-shell-access)
10. [Useful Docker Cheatsheet & Troubleshooting](#10-useful-docker-cheatsheet--troubleshooting)

---

## 1. Prerequisites & System Verification

Verify that Docker and Docker Compose are installed on your workstation, virtual machine, or Cloud Shell:

```bash
# Verify Docker engine version
docker --version

# Verify Docker Compose plugin version
docker compose version

# Check that the Docker daemon is active
docker info
```

Ensure your current terminal is in the project root directory:
```bash
# Check working directory
pwd

# Ensure Dockerfile and docker-compose.yml are present
ls -la Dockerfile docker-compose.yml
```

---

## 2. Quick Start (One-Liner Execution)

### Option 1: Using Pure Docker CLI
```bash
# Build and run in detached mode on port 3000
docker build -t plusehr:latest . && docker run -d -p 3000:80 --name plusehr-app plusehr:latest
```

### Option 2: Using Docker Compose
```bash
# Build images and start container in the background
docker compose up -d --build
```

Access the application in your browser at:  
👉 **`http://localhost:3000`** *(or `http://<YOUR_SERVER_IP>:3000`)*

---

## 3. Building the Docker Container Image

### A. Standard Build
Build the image using the multi-stage `Dockerfile`:
```bash
# Build with tag 'plusehr:latest'
docker build -t plusehr:latest .
```

### B. Build with Semantic Version Tagging
Tag both with specific version number and latest:
```bash
docker build -t plusehr:1.0.0 -t plusehr:latest .
```

### C. Build Without Cache (Clean Build)
If you updated dependencies or want a completely fresh build:
```bash
docker build --no-cache -t plusehr:latest .
```

### D. Verify the Generated Image
```bash
# List the built image and check size (typically < 35MB due to Alpine + Nginx)
docker images | grep plusehr
```

---

## 4. Running the Application Container

### A. Run in Detached Mode (Background)
Maps host port `3000` to Nginx port `80` inside the container:
```bash
docker run -d \
  -p 3000:80 \
  --name plusehr-app \
  --restart unless-stopped \
  plusehr:latest
```

### B. Run on a Custom Port (e.g., Port 8080 or Port 80)
If port 3000 is occupied on your host:
```bash
# Run on Host Port 8080
docker run -d -p 8080:80 --name plusehr-app plusehr:latest

# Run directly on standard HTTP Port 80
docker run -d -p 80:80 --name plusehr-app plusehr:latest
```

### C. Run with Explicit Resource Limits (Production Safety)
```bash
docker run -d \
  -p 3000:80 \
  --name plusehr-app \
  --memory="256m" \
  --cpus="0.5" \
  --restart unless-stopped \
  plusehr:latest
```

---

## 5. Docker Compose Orchestration

The project includes `docker-compose.yml` for unified lifecycle management.

### A. Start Services
```bash
# Start in background
docker compose up -d

# Force rebuild before starting
docker compose up -d --build
```

### B. Check Status
```bash
docker compose ps
```

### C. View Live Logs
```bash
# Follow logs in real-time
docker compose logs -f

# Follow logs with timestamps
docker compose logs -f -t
```

### D. Stop & Tear Down
```bash
# Stop containers (preserves volumes)
docker compose stop

# Stop and remove containers and networks
docker compose down

# Stop, remove containers and remove unused images
docker compose down --rmi local
```

---

## 6. Inspecting, Logs & Container Management

### Check Running Containers
```bash
docker ps --filter "name=plusehr"
```

### Stream Real-Time Logs
```bash
# Stream last 100 lines and follow
docker logs -f --tail 100 plusehr-app
```

### Monitor Resource Utilization (CPU, Memory, Network I/O)
```bash
docker stats plusehr-app
```

### Stop, Start, and Restart Container
```bash
# Pause container
docker stop plusehr-app

# Resume container
docker start plusehr-app

# Graceful restart
docker restart plusehr-app
```

### Remove Container
```bash
# Stop and remove
docker stop plusehr-app && docker rm plusehr-app

# Force removal
docker rm -f plusehr-app
```

---

## 7. Health Checks & Verification

The Docker image includes an integrated automated `HEALTHCHECK`:
- Frequency: every 30 seconds
- Probe: `wget -qO- http://localhost/ || exit 1`

### Check Container Health Status:
```bash
# Inspect container health
docker inspect --format='{{json .State.Health}}' plusehr-app | jq
```

### Test HTTP Response from Host Terminal:
```bash
# Verify HTTP 200 OK
curl -I http://localhost:3000

# Test SPA client-side routing fallback
curl -I http://localhost:3000/attendance
```

---

## 8. Multi-Architecture & Registry Publishing

If you want to push to Docker Hub, GitHub Container Registry (GHCR), or Google Artifact Registry:

### A. Docker Hub
```bash
# 1. Login to Docker Hub
docker login

# 2. Tag with your Docker Hub username
docker tag plusehr:latest <your-dockerhub-username>/plusehr:latest
docker tag plusehr:latest <your-dockerhub-username>/plusehr:1.0.0

# 3. Push images
docker push <your-dockerhub-username>/plusehr:latest
docker push <your-dockerhub-username>/plusehr:1.0.0
```

### B. Multi-Architecture Build (AMD64 + ARM64 / Apple Silicon / Raspberry Pi)
```bash
# Create buildx builder instance
docker buildx create --use --name pulsehr-builder

# Build and push multi-arch manifest
docker buildx build \
  --platform linux/amd64,linux/arm64 \
  -t <your-dockerhub-username>/plusehr:latest \
  --push .
```

---

## 9. Debugging & Interactive Shell Access

### Enter the Running Nginx Container:
```bash
docker exec -it plusehr-app /bin/sh
```

Inside the container:
```sh
# View installed static files
ls -la /usr/share/nginx/html

# Check Nginx configuration
cat /etc/nginx/conf.d/default.conf

# Check Nginx process
ps aux

# Test local web server from inside
wget -qO- http://localhost:80/ | head -n 15

# Exit container shell
exit
```

---

## 10. Useful Docker Cheatsheet & Troubleshooting

| Problem | Cause | Solution |
| :--- | :--- | :--- |
| `Bind for 0.0.0.0:3000 failed: port is already allocated` | Another app or container uses port 3000 | Find and kill it, or map to an alternate port: `docker run -d -p 3001:80 --name plusehr-app plusehr:latest` |
| `Cannot connect to the Docker daemon` | Docker service is stopped | Start service: `sudo systemctl start docker` or launch Docker Desktop |
| `permission denied while trying to connect to Docker daemon` | User not in `docker` group | Run with `sudo` or add user: `sudo usermod -aG docker $USER && newgrp docker` |
| `unable to get image ... invalid reference format: repository name must be lowercase` | Directory name or service name has uppercase letters (e.g. `Staffsync` or `PulseHR`) which Docker rejects | Docker image names must be strictly lowercase. Use `docker-compose.yml` with explicit `name: staffsync` and `image: staffsync-pulsehr:latest`, or run `docker compose -p staffsync up -d --build` |
| Old static files cached in browser | HTTP 304 or aggressive browser cache | Hard refresh with `Ctrl + F5` (Windows/Linux) or `Cmd + Shift + R` (macOS) |

### Clean Up Unused Docker Artifacts (Free Up Disk Space):

#### 1. Stop and Remove Active / Conflicting Containers
Docker will not let you delete an image if it is tied to an active or existing container. Run this command to force-stop and delete all containers at once:
```bash
docker rm -f plusehr pulsehr-enterprise plusehr-app
```
*(The `-f` flag forces them to stop and removes them immediately without requiring a separate `docker stop` step).*

#### 2. Delete Specific Images
Once the containers are stopped and removed, delete the target images using `docker rmi` with names or image IDs:
```bash
docker rmi plusehr:latestv1 staffsync-pulsehr:latest d7ddf03956a3 4635062651de
```
*(Tip: Run `docker images` to find the exact Image IDs or tags currently on your system).*

#### 💡 Alternative: The Nuclear Option (Clean Everything / Blank Slate)
If you want a fresh start and want to wipe out all stopped containers, dangling layers, networks, and unused images in one single command:
```bash
docker system prune -a --volumes
```
> ⚠️ **Warning:** This will delete **all** stopped containers, all unused networks, all images without at least one container associated, and all build caches. Use only when you want a completely clean slate.

#### Quick Layer & Builder Prunes:
```bash
# Remove dangling/untagged images only
docker image prune -f

# Clean up all stopped containers, networks, and builder caches
docker system prune -f
```

---

## 🚀 Summary of Most Common Daily Commands

```bash
# 1. Build
docker build -t plusehr:latest .

# 2. Run
docker run -d -p 3000:80 --name plusehr-app plusehr:latest

# 3. Check logs
docker logs -f plusehr-app

# 4. Stop
docker stop plusehr-app

# 5. Remove
docker rm plusehr-app
```
