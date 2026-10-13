# 🏢 PulseHR Enterprise

Modern, high-performance Human Resource & Workforce Management System built with React 19, TypeScript, Tailwind CSS, and Vite.

---

## 🚀 Quick Deployment & Access Guides

PulseHR Enterprise is containerized and cloud-ready for local development, Docker environments, Kubernetes clusters, and Minikube. Choose your preferred guide:

| Guide | Description | Path |
|---|---|---|
| **☸️ Minikube Access Guide** | Step-by-step setup for **Minikube** on local machines and Google Cloud Shell | [`minikube/README.md`](./minikube/README.md) & [`docs/minikube-access.md`](./docs/minikube-access.md) |
| **🐳 Docker & Compose Guide** | Production multi-stage Docker build, Docker Compose orchestration, and cleanup | [`docs/docker-access.md`](./docs/docker-access.md) |
| **☸️ Kubernetes Production Guide** | Production Kubernetes manifests (Deployments, Services, Ingress, HPA, PDB) | [`docs/kubernetes-access.md`](./docs/kubernetes-access.md) & [`k8s/`](./k8s/) |
| **💻 Local Development Guide** | Running natively with Node.js and Vite dev server | [`docs/Local-Access.md`](./docs/Local-Access.md) |

---

## 🛠️ Tech Stack

- **Frontend:** React 19, TypeScript, Lucide Icons
- **Styling:** Tailwind CSS v4
- **Build Tool:** Vite 6
- **Server:** Nginx Alpine (production container)
- **Containerization:** Multi-stage Dockerfile, Docker Compose
- **Orchestration:** Kubernetes 1.25+ manifests & Kustomize
