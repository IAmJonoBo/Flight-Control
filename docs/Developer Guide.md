# Developer Guide for Flight Control

This guide provides a comprehensive roadmap for developers to onboard, contribute, and maintain the **Flight Control** platform. The platform is structured into modular components, leveraging modern tools for backend, frontend, AI/ML, infrastructure, and CI/CD workflows.

---

## 📦 Project Structure Overview
The project is organized into the following directories:

```bash
flight-control/
├── frontend/                  # React + Tailwind UI
├── backend/                   # FastAPI backend
├── ai-ml/                     # AI/ML pipeline (GraphCodeBERT, LoRA)
├── infrastructure/            # Docker, Kubernetes, Terraform
├── ci-cd/                     # GitHub Actions, Snyk
├── docs/                      # Documentation (Docusaurus, Swagger)
├── tests/                     # Unit & integration tests
├── shared/                    # Shared utilities (logging, config)
└── .env                       # Environment variables
```

---

## 🔧 Setup Instructions

### **1. Prerequisites**
- **Node.js**: v18+
- **Python**: 3.10+
- **Docker**: Latest version
- **Kubernetes**: `kubectl` and `kind` (for local testing)
- **Git**
- **VSCode** (recommended) with Prettier + ESLint extensions

---

### **2. Clone the Repository**
```bash
git clone https://github.com/your-organization/flight-control.git
cd flight-control
```

---

### **3. Install Dependencies**
#### **Frontend**
```bash
cd frontend
npm install
```

#### **Backend**
```bash
cd backend
pip install -r requirements.txt
```

#### **AI/ML**
```bash
cd ai-ml
pip install -r requirements.txt
```

---

### **4. Configure Environment Variables**
Copy the `.env.example` file:
```bash
cp .env.example .env
```

Edit `.env` with your credentials (e.g., GitHub API token, PostgreSQL password).

---

### **5. Start Development Servers**
#### **Local Development**
```bash
# Start Docker containers
docker-compose up -d

# Run database migrations (backend)
cd backend
alembic upgrade head

# Start frontend and backend servers
npm run dev  # Frontend (Vite)
uvicorn app.main:app --reload  # Backend (FastAPI)
```

#### **Kubernetes (Production)**
```bash
# Deploy to Kubernetes
cd infrastructure/k8s
kubectl apply -f deployments/
kubectl apply -f services/
```

---

## 🧪 Development Workflow

### **1. Feature Development**
- **Branching Strategy**:
  - Use `git flow` or GitHub PR workflows.
  - Create feature branches:
    ```bash
    git checkout -b feature/new-analysis-endpoint
    ```

- **Commit Conventions**:
  - Use [Conventional Commits](https://www.conventionalcommits.org/):
    ```bash
    feat: add synthetic data validation pipeline
    fix: stabilize LoRA training on Spring Boot datasets
    ```

---

### **2. Frontend Development**
#### **Tech Stack**: React + Vite + Tailwind CSS
#### **Key Files**:
- **Components**: `frontend/src/components/`
- **Hooks**: `frontend/src/hooks/`
- **Pages**: `frontend/src/pages/`
- **Services**: `frontend/src/services/`

#### **Running Tests**:
```bash
cd frontend
npm run test
```

---

### **3. Backend Development**
#### **Tech Stack**: FastAPI + PostgreSQL + Redis
#### **Key Files**:
- **API Routes**: `backend/app/routes/`
- **Models**: `backend/app/models/`
- **Services**: `backend/app/services/`
- **Database**: `backend/app/database.py`

#### **Database Migrations**:
Use Alembic:
```bash
cd backend
alembic revision -m "add code smell table"
alembic upgrade head
```

#### **Testing API Endpoints**:
```bash
cd backend
python -m pytest tests/
```

---

### **4. AI/ML Pipeline Development**
#### **Tech Stack**: PyTorch + Transformers + LoRA + PEFT
#### **Key Files**:
- **Model Training**: `ai-ml/models/graphcodebert/train.py`
- **LoRA Fine-Tuning**: `ai-ml/models/lora/train_lora.py`, `ai-ml/models/lora/peft_utils.py`
- **Synthetic Data**: `ai-ml/models/synthetic/generate.py`, `ai-ml/models/synthetic/validate.py`

#### **LoRA Fine-Tuning**
- Fine-tune GraphCodeBERT or similar models with LoRA adapters for efficient domain adaptation.
- Spectral regularization is supported for stability.
- **Usage Example:**
  ```bash
  cd ai-ml
  python models/lora/train_lora.py --dataset_path=data/processed/train.json --output_dir=models/lora/adapter --base_model=microsoft/graphcodebert-base --epochs=3 --spectral_reg
  ```
- **Configurable Args:** LoRA rank, alpha, dropout, learning rate, batch size, epochs, spectral regularization lambda.
- **Requirements:** `transformers`, `peft`, `datasets`, `torch`

#### **Synthetic Data Generation**
- Generate code samples with code smells for training and validation.
- **Usage Example:**
  ```bash
  python models/synthetic/generate.py --output=data/synthetic/samples.json --num_samples=100 --smells god_method long_parameter_list
  ```
- **Requirements:** Python 3.8+, no external dependencies for basic template generation.

#### **Synthetic Data Validation**
- Validate generated samples using Semgrep (syntax/lint) and CodeBERTScore (semantic similarity).
- **Usage Example:**
  ```bash
  python models/synthetic/validate.py --input=data/synthetic/samples.json --semgrep_rules=rules/python.yml --reference=data/processed/real.json --output=data/synthetic/validation_report.json
  ```
- **Requirements:** `semgrep` CLI, CodeBERTScore (optional, for advanced validation)

#### **Model Registry Extensibility**
- The backend model registry (`backend/app/services/model_service.py`) is extensible:
  - Each model entry includes: `module`, `display_name`, `description`, and `config_schema`.
  - To add a new model, add an entry to `MODEL_REGISTRY` with the required fields.
  - Example (LoRA):
    ```python
    "lora": {
        "module": "ai-ml.models.lora.inference",
        "display_name": "GraphCodeBERT + LoRA Adapter",
        "description": "GraphCodeBERT fine-tuned with LoRA adapters for efficient domain adaptation.",
        "config_schema": {
            "base_model": {"type": "string", "default": "microsoft/graphcodebert-base"},
            "adapter_path": {"type": "string", "default": "ai-ml/models/lora/adapter"},
        },
    }
    ```
- The `/models/list` endpoint returns all available models with metadata for frontend selection.
- Inference logic is loaded dynamically from the specified module's `infer` function.

---

### **5. Infrastructure & CI/CD**
#### **Local Docker Setup**:
```bash
# Build and run Docker Compose
docker-compose up --build
```

#### **Kubernetes Integration**:
- Use `infrastructure/k8s/` for deployments.
- Monitor with `kubectl get pods`:

#### **GitHub Actions**:
- **CI Pipeline**: `ci-cd/.github/workflows/ci.yml`
- **CD Pipeline**: `ci-cd/.github/workflows/cd.yml`
- **Model Training Workflow**: `ci-cd/.github/workflows/model-training.yml`

#### **Infrastructure Hardening & Security**
- **Secrets:** Sensitive env vars (DB, Redis, S3, GitHub, JWT) are stored in Kubernetes Secrets (`backend-secret.yaml`). Never commit real secrets; use `kubectl create secret` in production.
- **ConfigMaps:** Non-sensitive config (log level, S3 endpoint, etc.) is stored in ConfigMaps (`backend-configmap.yaml`).
- **Pod Security:** All pods/containers use `securityContext` with `runAsNonRoot: true`, `readOnlyRootFilesystem: true`, `allowPrivilegeEscalation: false`, and drop all capabilities.
- **Network Policies:** Only allow necessary pod-to-pod communication (see `networkpolicy.yaml`).
- **AI Dockerfile:** Now secure, minimal, and runs as non-root user.
- **Best Practices:**
  - All services are `ClusterIP` by default (internal-only).
  - Resource requests/limits and readiness/liveness probes are set for all deployments.
  - HPA and KEDA are used for autoscaling.
  - For production HTTPS, add Ingress with cert-manager (see infra docs for example).

---

## 📚 Documentation

### **1. Developer Documentation**
- **Frontend**: `docs/src/docs/`
- **API Reference**: `docs/swagger/openapi.yaml`
- **Technical Architecture**: `docs/src/docs/tech-architecture.md`

### **2. How to Contribute**
- Update documentation when adding new features.
- Use Docusaurus for user guides:
  ```bash
  cd docs
  npm run start
  ```

---

## 🧩 Coding Standards

### **1. Frontend (React + TypeScript)**
- Use Prettier with VSCode settings:
  ```json
  {
    "prettier.singleQuote": true,
    "prettier.trailingComma": "es5"
  }
  ```
- Component naming: `PascalCase` for files and components.

### **2. Backend (Python)**
- Follow PEP8 with `black`:
  ```bash
  pip install black
  black app/
  ```
- Use type hints in all functions.

### **3. Git Workflow**
- Always rebase before submitting PRs:
  ```bash
  git fetch origin main
  git rebase origin/main
  ```
- Write clear commit messages.

---

## 🔐 Security & Compliance

### **1. Dependency Scanning**
- Use Snyk in CI/CD:
  ```bash
  cd backend
  snyk test
  ```

### **2. Data Privacy**
- Anonymize code in AI/ML pipelines (e.g., remove personal identifiers from code samples).
- Encrypt data at rest using AWS KMS.

---

## 🛠️ Troubleshooting

### **Common Issues**
1. **Frontend Build Errors**:
   - Run `npm install` again.
   - Check `vite.config.ts` for missing plugins.

2. **Backend Database Connection**:
   - Verify PostgreSQL is running:
     ```bash
     docker ps | grep postgres
     ```

3. **Kubernetes Deployment Failures**:
   - Check logs:
     ```bash
     kubectl logs <pod-name>
     ```

---

## 📣 Contribution Guidelines

### **1. Submitting a Pull Request**
- Write clear PR descriptions (e.g., "Fix: stabilize LoRA training on Spring Boot datasets").
- Assign reviewers from the core team.

### **2. Code Review Process**
- All PRs require at least 1 approval.
- Use GitHub code comments for discussions.

---

## 📞 Need Help?
For questions or feedback, reach out to:
- **Project Lead**: [Your Name]
- **Slack Channel**: `#flight-control`
- **GitHub Issues**: [Create an Issue](https://github.com/your-organization/flight-control/issues)

Let's build the future of intelligent code analysis together! 🚀

---

**Next Steps**:
1. **Refine Nx Configuration**: Validate Spring Boot monorepo structure.
2. **Benchmark LoRA vs Full Fine-Tuning**: Compare F1 scores on Spring PetClinic.
3. **Synthetic Data Validation**: Implement CodeBERTScore + human-in-the-loop pipelines.

## Authentication Endpoints

### POST /auth/refresh
- Rotates refresh token (sets new HttpOnly cookie)
- Blacklists old refresh token in Redis
- Returns new access token
- Requires valid refresh token cookie

### POST /auth/logout
- Blacklists current refresh token in Redis
- Deletes refresh token cookie
- Returns {"detail": "Logged out"}

### Security Rationale
- Refresh token rotation prevents replay attacks
- Blacklist ensures used tokens cannot be reused
- HttpOnly cookies prevent XSS
- Redis is used for fast blacklist checks

### Example Usage
```http
POST /auth/refresh
Cookie: refresh_token=...

Response: {"access_token": "...", "expires_in": 900}

POST /auth/logout
Cookie: refresh_token=...

Response: {"detail": "Logged out"}
```

## Backend API Endpoints

### POST /analysis/run
- Runs code analysis using GraphCodeBERT.
- **Request:**
  ```json
  { "code": "def foo(): pass" }
  ```
- **Response:**
  ```json
  { "result": { "predicted_class": 1, "confidence": 0.98 } }
  ```
- **Errors:**
  - 400: Invalid or empty code input.
  - 500: Model inference failed.

---

### POST /git/clone
- Clones a git repository to a temporary directory.
- **Request:**
  ```json
  { "url": "https://github.com/octocat/Hello-World.git" }
  ```
- **Response:**
  ```json
  { "message": "Cloning repo from ...", "result": { "success": true, "path": "/tmp/cloned_repo" } }
  ```
- **Errors:**
  - 400: Invalid or empty URL.
  - 500: Git clone failed or directory exists.

---

### GET /models/list
- Lists available AI/ML models.
- **Response:**
  ```json
  { "models": ["graphcodebert", "lora", ...] }
  ```
- **Errors:**
  - 500: Failed to list models.

---

### GET /health
- Health check endpoint.
- **Response:**
  ```json
  { "status": "ok" }
  ```

All endpoints use FastAPI, type hints, and robust error handling. See `tests/backend/` for example usage and test coverage.

## 📝 In-App Feedback Form

### UI/UX Principles
- Floating feedback button (bottom-right), expands to modal with smooth animation
- Modal overlay with full-screen, semi-transparent backdrop and centered form
- Minimalist, whitespace-rich layout with bold, legible typography
- Microinteractions: subtle hover, focus, and submit animations
- Responsive and accessible: ARIA roles, focus trap, keyboard shortcut (Ctrl+Shift+F)
- Dark/light mode support

### Form Fields
- Title (required)
- Description (required, multiline)
- Severity (dropdown: Low, Medium, High, Critical)
- Email (optional, for follow-up)
- Attachments (optional, for screenshots)

### Accessibility
- All fields have ARIA labels
- Modal traps focus and is keyboard navigable
- Sufficient color contrast and screen reader support

### Accessibility Audit: meta-viewport
- The `<meta name="viewport">` tag is implemented as recommended by [axe-core](https://dequeuniversity.com/rules/axe/4.10/meta-viewport) and WCAG 2.1 AA.
- No `user-scalable="no"` or `maximum-scale=1` is present.
- The Vite dev server runs on port 3002; audits should target this port.
- If automated tools report a violation or stall, it is likely due to process management or tool limitations. Manual verification confirms compliance.

### Feedback Backend (YAML, S3/MinIO, GitHub Integration)

- **Endpoint:** `POST /feedback` (multipart/form-data)
- **Fields:** title (3-100 chars), description (10-2000 chars), severity (low/medium/high/critical), email (optional), attachment (optional)
- **Validation:** Manual and Pydantic; returns 400 for invalid input
- **Attachment:** Uploaded to S3/MinIO using `boto3` with env-configured credentials
- **YAML:** Feedback is formatted as YAML for the GitHub issue body
- **GitHub:** Issue is created via PyGithub, with severity and triage labels
- **Audit Logging:** All feedback submissions are logged (stdout/file)
- **Error Handling:** Returns 400 for validation errors, 500 for S3/GitHub errors
- **Required Environment Variables:**
  - `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`, `S3_PUBLIC_URL`
  - `GITHUB_TOKEN`, `GITHUB_REPO`
- **Extensibility:** S3/MinIO and GitHub logic is in `feedback_service.py` for reuse and testing
- **TODOs:**
  - Add retry/fallback for S3/GitHub failures
  - Add test coverage for feedback submission and error cases
  - Add audit log export/rotation if needed

## Security & Secrets Management
- **Vault Integration:** All sensitive secrets (JWT keys, GitHub tokens, S3/MinIO credentials) are loaded from HashiCorp Vault in production, or from environment variables in development.
- **Secret Rotation:**
  - JWT signing keys: rotated every 30–90 days (configurable)
  - GitHub tokens: rotated every 60 days or on role change
  - S3/MinIO keys: rotated every 90 days or on incident
- **MinIO for Artifact Storage:**
  - All model artifacts and feedback attachments are stored in MinIO (S3-compatible)
  - Access keys are never hardcoded; always loaded from Vault or environment
- **Developer Workflow:**
  - Use `.env.example` as a template; never commit real secrets
  - For local dev, use `docker-compose` to start Vault and MinIO
  - For production, secrets are injected via CI/CD or Kubernetes secrets
- **Best Practices:**
  - Principle of least privilege for all service accounts
  - Audit logs enabled for Vault and MinIO
  - All secrets encrypted at rest and in transit

## Model Artifact Storage & Cloud Integration
- **MinIO/S3 Usage:** All model artifacts (trained models, logs, feedback attachments) are stored in MinIO (S3-compatible) with versioning enabled.
- **Artifact Versioning:** Each artifact is saved with a unique version/tag (e.g., model name, timestamp, git commit hash).
- **Developer Workflow:**
  - Use provided Python or CLI tools to upload/download artifacts from MinIO
  - Access keys are loaded from Vault or environment; never hardcoded
  - Artifacts are organized by project, model, and version
- **CI/CD Integration:**
  - Model training jobs automatically upload new artifacts to MinIO
  - CI/CD pipelines validate artifact integrity and permissions
- **Best Practices:**
  - Principle of least privilege for MinIO access keys
  - Enable bucket versioning and server-side encryption
  - Regularly audit and prune old artifacts as per retention policy

## CI/CD & Monitoring
- **CI/CD Workflows:**
  - Linting, unit/integration tests, and accessibility checks (axe-core) on every PR
  - Model training jobs triggered via GitHub Actions, with artifact upload to MinIO
  - Deployment to dev/prod via ArgoCD or GitHub Actions
  - Automated validation of model artifacts and permissions
- **Accessibility:** axe-core checks run in CI for every frontend change
- **Monitoring & Alerting:**
  - Feedback endpoint, model storage, and critical flows monitored via Prometheus/Grafana
  - Alerts for failures, slow responses, or storage issues
  - Audit logs for all critical actions (feedback, model upload, secret access)
- **Best Practices:**
  - All CI/CD secrets managed via Vault or GitHub Actions secrets
  - Rollbacks and canary deploys supported for safe releases

## 🚦 Production Monitoring, Scaling & Security

### Monitoring & Alerting
- **Prometheus**: FastAPI backend exposes `/metrics` using `prometheus_fastapi_instrumentator`. Add Prometheus scrape configs to monitor API latency, error rates, and resource usage.
- **Grafana**: Recommended for dashboards and alerting (see sample configs in `infrastructure/`).
- **Sentry**: Error tracking is integrated in both backend (FastAPI) and frontend (React). Set `SENTRY_DSN`/`VITE_SENTRY_DSN` in your environment to enable.

### Kubernetes Scaling & Reliability
- **Resource requests/limits**: All pods have sensible CPU/memory requests and limits (see `backend.yaml`, `ai.yaml`).
- **Readiness/liveness probes**: Backend and AI/ML pods use `/health` for Kubernetes probes.
- **Horizontal Pod Autoscaler (HPA)**: Deploy `backend-hpa.yaml` and `ai-hpa.yaml` to autoscale pods based on CPU utilization.
- **TLS**: Use cert-manager for HTTPS in production clusters.

### Example: Deploying HPA
```bash
kubectl apply -f infrastructure/k8s/deployments/backend-hpa.yaml
kubectl apply -f infrastructure/k8s/deployments/ai-hpa.yaml
```

### Security Audits
- **Dependency Scanning**: Snyk and Trivy are used in CI/CD to scan for vulnerabilities.
- **Secrets Management**: All sensitive secrets are loaded from Vault or environment variables; never hardcoded.
- **Audit Logs**: Vault and MinIO audit logs are enabled.
- **Penetration Testing**: Run regular security audits and penetration tests before public releases.

See the Technical Brief and infrastructure docs for more details and best practices.

## 🚦 Production Hardening, Monitoring & Scaling

### Monitoring & Metrics
- **Prometheus**: FastAPI backend exposes metrics at `/metrics` using `prometheus_fastapi_instrumentator`. Add Prometheus scrape configs to monitor API latency, error rates, and resource usage.
- **Grafana**: Recommended for dashboards and alerting (see sample configs in `infrastructure/`).
- **Sentry**: Error tracking is integrated in both backend (FastAPI) and frontend (React). Set `SENTRY_DSN`/`VITE_SENTRY_DSN` in your environment to enable.

### Docker & Container Security
- All Dockerfiles use minimal base images and run as non-root users for security.
- Use Trivy or Snyk to scan images for vulnerabilities in CI/CD.

### Kubernetes Scaling & Reliability
- **Resource requests/limits**: All pods have sensible CPU/memory requests and limits.
- **Readiness/liveness probes**: Backend and AI/ML pods use `/health` for Kubernetes probes.
- **Horizontal Pod Autoscaler (HPA)**: Deploy `backend-hpa.yaml` and `ai-hpa.yaml` to autoscale pods based on CPU utilization.
- **TLS**: Use cert-manager for HTTPS in production clusters.

### Example: Deploying HPA
```bash
kubectl apply -f infrastructure/k8s/deployments/backend-hpa.yaml
kubectl apply -f infrastructure/k8s/deployments/ai-hpa.yaml
```

See the Technical Brief and infrastructure docs for more details and best practices.

### Model Selection & Configuration (Advanced)

- The backend maintains a model registry (`MODEL_REGISTRY` in `model_service.py`) with metadata for each model (name, display name, description, config schema).
- `/models/list` returns an array of model metadata objects (not just names).
- The frontend Settings page displays model display names and descriptions, and allows users to select a model for analysis.
- The selected model is used for all analysis requests.
- The system is extensible: add new models to the registry and implement their inference logic.
- (Planned) Model-specific configuration can be exposed via the config schema and UI.

## 🧪 Test Coverage

- **Backend:** All major endpoints are covered, including model selection, error handling, and invalid model names. Model inference is validated.
- **Frontend:** Dashboard and Settings are tested for model selection, analysis, and accessibility. Error handling and UI flows are covered.
- **E2E:** Dashboard flow covers model selection, code analysis, and result rendering.
- **Accessibility:** Manual and automated audits are documented; ARIA and focus management are tested in code and user flows.

### Monaco Editor with LSP Integration

- The code editor now integrates Monaco with Language Server Protocol (LSP) for Python.
- **Dependencies:** `monaco-languageclient`, `vscode-ws-jsonrpc`, `@monaco-editor/react` (optional, not used in current implementation).
- **How it works:**
  - Registers the Python language and creates a Monaco model with a file URI.
  - On mount, connects to a running LSP server via WebSocket (default: `ws://localhost:5007`).
  - Starts a `MonacoLanguageClient` for real-time diagnostics, autocomplete, and hover support.
- **To run locally:**
  1. Install and run a Python LSP server with WebSocket support (e.g., `python-lsp-server`):
     ```bash
     pip install python-lsp-server
     pylsp --ws --port 5007
     ```
  2. Start the frontend as usual (`npm run dev`).
  3. The editor will connect automatically and provide LSP features for Python code.
- **Known TODOs:**
  - Support multiple languages and LSP servers in the future.
  - Add fallback for when LSP server is unavailable.
  - Ensure accessibility (tab order, ARIA, focus management).

## 🚀 Local Development Workflow (2024)

### **Frontend (Vite + React + Tailwind + TypeScript)**
- Install dependencies:
  ```bash
  cd frontend
  npm install
  ```
- Run static analysis and type checks:
  ```bash
  npm run lint
  npx tsc --noEmit
  ```
- Start the local dev server:
  ```bash
  npm run dev
  # Open http://localhost:5173
  ```
- Run tests:
  ```bash
  npm run test
  ```
- Accessibility:
  - Automated checks run in CI (axe-core)
  - Manual ARIA/focus/keyboard audits are documented

### **Backend (FastAPI + Postgres + Redis)**
- Install dependencies:
  ```bash
  cd backend
  pip install -r requirements.txt
  ```
- Start the server:
  ```bash
  uvicorn app.main:app --reload
  # Open http://localhost:8000/docs
  ```
- Run tests:
  ```bash
  pytest
  ```

### **AI/ML (PyTorch + Transformers + LoRA)**
- Install dependencies:
  ```bash
  cd ai-ml
  pip install -r requirements.txt
  ```
- Run model scripts as needed.

### **All Services (Docker Compose)**
- Start all services:
  ```bash
  docker-compose up -d
  ```

## 🛠️ Troubleshooting Local Development
- **Frontend build errors:**
  - Run `npm install` again.
  - Ensure static analysis passes (`npm run lint`, `npx tsc --noEmit`).
  - Check `vite.config.ts` for missing plugins.
- **Backend database connection:**
  - Ensure Docker is running and ports are not in use.
  - Check `docker-compose logs backend` and `docker-compose logs postgres`.
- **Kubernetes deployment failures:**
  - Check logs with `kubectl logs <pod-name>`.
- **LSP/Monaco integration:**
  - Ensure the Python LSP server is running (`pylsp --ws --port 5007`).
  - See Monaco section for details.
