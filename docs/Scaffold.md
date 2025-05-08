### **📁 Project Structure Overview**
```bash
flight-control/
├── frontend/                  # React + Tailwind UI
├── backend/                   # FastAPI backend
├── ai-ml/                     # AI/ML pipeline (GraphCodeBERT, LoRA)
├── infrastructure/              # Docker, Terraform, Kubernetes
├── ci-cd/                     # GitHub Actions, Snyk
├── docs/                      # Documentation (Docusaurus, Swagger)
├── tests/                     # Unit & integration tests
├── shared/                    # Shared utilities (logging, config)
└── .env                       # Environment variables
```

---

### **1. 🌐 Frontend Scaffold (`frontend/`)**
**Tech Stack**: React + Vite + Tailwind CSS + TypeScript
**Key Components**:
- **Dashboard**: Code metrics visualization
- **Code Editor**: Monaco Editor + LSP integration
- **Analysis Results**: Refactoring suggestions + diff viewer
- **Settings**: Domain-specific model configuration
- **Docs Portal**: API docs, tutorials

**Local Workflow:**
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
- Start the dev server:
  ```bash
  npm run dev
  # Open http://localhost:5173
  ```
- React 17+ automatic JSX runtime is enabled: you do **not** need to import `React` for JSX. ESLint is configured for this.

```bash
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── CodeEditor.tsx
│   │   ├── GraphVisualizer.tsx
│   │   └── RefactoringCard.tsx
│   ├── hooks/
│   │   ├── useAnalysis.ts
│   │   └── useAuth.ts
│   ├── pages/
│   │   ├── Dashboard.tsx
│   │   ├── Settings.tsx
│   │   └── Login.tsx
│   ├── services/
│   │   ├── apiClient.ts
│   │   └── authService.ts
│   ├── App.tsx
│   └── main.tsx
├── vite.config.ts
└── package.json
```

**Key Dependencies**:
```json
{
  "dependencies": {
    "react": "^18.2",
    "react-router-dom": "^6.14",
    "tailwindcss": "^3.3",
    "monaco-editor": "^0.33",
    "axios": "^1.6",
    "react-query": "^4.39"
  },
  "devDependencies": {
    "vite": "^4.4",
    "@vitejs/plugin-react": "^3.2",
    "typescript": "^5.0"
  }
}
```

---

### **2. 🧠 Backend Scaffold (`backend/`)**
**Tech Stack**: FastAPI (Python) + PostgreSQL + Redis + Celery
**Key Endpoints**:
- Git integration (`/git/*`)
- Analysis triggering (`/analysis/*`)
- Model management (`/models/*`)
- Auth (`/auth/*`)

```bash
backend/
├── app/
│   ├── main.py            # FastAPI app
│   ├── routes/
│   │   ├── git.py
│   │   ├── analysis.py
│   │   ├── models.py
│   │   └── auth.py
│   ├── models/
│   │   ├── code_smell.py
│   │   └── user.py
│   ├── services/
│   │   ├── git_service.py
│   │   ├── analysis_service.py
│   │   └── model_service.py
│   ├── database.py        # SQLAlchemy ORM
│   └── config.py          # Redis, Celery
├── requirements.txt
└── Dockerfile
```

**Key Dependencies**:
```txt
fastapi>=0.95
uvicorn>=0.21
sqlalchemy>=2.0
redis>=4.5
celery>=5.2
gitpython>=3.1
```

---

### **3. 🤖 AI/ML Pipeline Scaffold (`ai-ml/`)**
**Tech Stack**: PyTorch + Transformers + ONNX + LoRA
**Key Components**:
- GraphCodeBERT fine-tuning
- Synthetic data generation
- Batch inference service

```bash
ai-ml/
├── data/
│   ├── raw/
│   ├── processed/
│   └── synthetic/
├── models/
│   ├── graphcodebert/
│   │   ├── train.py
│   │   ├── inference.py
│   │   └── config.json
│   ├── lora/
│   │   ├── train_lora.py
│   │   └── peft_utils.py
│   └── synthetic/
│       ├── generate.py
│       └── validate.py
├── notebooks/
│   └── analysis_exploration.ipynb
├── requirements.txt
└── Dockerfile
```

**Key Dependencies**:
```txt
transformers>=4.33
torch>=2.0
datasets>=2.14
peft>=0.4.0
codebert-score>=0.1
semgrep (CLI, for validation)
```

---

### **4. 🏗️ Infrastructure Scaffold (`infrastructure/`)**
**Tech Stack**: Docker + Kubernetes + Terraform
**Key Components**:
- Docker Compose for local dev
- Kubernetes manifests for production
- Terraform for cloud provisioning

```bash
infrastructure/
├── docker-compose.yml
├── k8s/
│   ├── deployments/
│   │   ├── frontend.yaml
│   │   ├── backend.yaml
│   │   └── ai.yaml
│   ├── services/
│   │   ├── redis.yaml
│   │   └── postgres.yaml
│   └── keda/
│       └── autoscaling.yaml
├── terraform/
│   ├── providers.tf
│   ├── network.tf
│   └── compute/
│       ├── aws_ecs.tf
│       └── gcp_gke.tf
├── Dockerfiles/
│   ├── frontend.Dockerfile
│   ├── backend.Dockerfile
│   └── ai.Dockerfile
└── .env.example
```

**Example `docker-compose.yml`**:
```yaml
version: '3.8'
services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: admin
      POSTGRES_PASSWORD: securepassword

  redis:
    image: redis:7
```

---

### **5. 🚀 CI/CD Scaffold (`ci-cd/`)**
**Tech Stack**: GitHub Actions + Snyk + ArgoCD
**Key Workflows**:
- Linting + Unit Tests
- Model Retraining
- Deployment Pipeline

```bash
ci-cd/
├── .github/
│   └── workflows/
│       ├── ci.yml
│       ├── cd.yml
│       └── model-training.yml
├── snyk/
│   └── .snyk
├── argocd/
│   └── app.yaml
└── scripts/
    ├── test.sh
    └── deploy.sh
```

**GitHub Actions Example (`ci.yml`)**:
```yaml
name: CI Pipeline
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd frontend && npm install && npm run test
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: 3.10
      - run: pip install -r backend/requirements.txt
      - run: python -m pytest backend/tests/
```

---

### **6. 📚 Documentation Scaffold (`docs/`)**
**Tech Stack**: Docusaurus + Swagger UI
**Key Components**:
- User Guides
- API Reference
- Technical Architecture

```bash
docs/
├── docusaurus.config.js
├── src/
│   ├── pages/
│   └── docs/
│       ├── getting-started.md
│       └── api-reference.md
├── swagger/
│   └── openapi.yaml
└── package.json
```

---

### **7. 🧪 Tests Scaffold (`tests/`)**
**Tech Stack**: Pytest + Jest + Cypress
**Key Tests**:
- Unit tests for backend
- E2E tests for frontend
- Model accuracy validation

```bash
tests/
├── backend/
│   ├── test_git.py
│   └── test_analysis.py
├── frontend/
│   ├── App.test.tsx
│   └── CodeEditor.test.tsx
├── e2e/
│   └── dashboard.spec.js
└── model/
    └── test_model_accuracy.py
```

---

### **8. 🛠️ Shared Utilities (`shared/`)**
**Key Components**:
- Logging
- Config Management
- Common Types

```bash
shared/
├── logger/
│   └── winston.config.js
├── config/
│   └── index.js
└── types/
    └── code-smells.ts
```

---

### **🔧 Setup Instructions**
1. **Install Dependencies**:
   ```bash
   # Frontend
   cd frontend && npm install

   # Backend
   cd backend && pip install -r requirements.txt

   # AI/ML
   cd ai-ml && pip install -r requirements.txt
   ```

2. **Start Docker**:
   ```bash
   docker-compose up -d
   ```

3. **Run Migrations**:
   ```bash
   cd backend && alembic upgrade head
   ```

4. **Start Development Servers**:
   ```bash
   # Frontend
   npm run dev

   # Backend
   uvicorn app.main:app --reload
   ```

### **Checklist Items**
- [ ] Frontend: Floating feedback button, modal form (minimalist, accessible, responsive)
- [ ] Frontend: ARIA roles, focus trap, keyboard shortcut (Ctrl+Shift+F), dark/light mode
- [ ] Frontend: Static analysis (ESLint) and type checking (TypeScript) pass before commit
- [ ] Backend: Feedback endpoint, YAML formatting, GitHub Issue creation
- [ ] Backend: Map severity to labels, add triage:feedback label
- [x] Frontend: Toast notifications (React-Toastify), ARIA-friendly, promise-based
- [x] Frontend: Inline field errors, focus management, ARIA attributes
- [x] Frontend: Submit button loading state
- [x] Frontend: Persistent network failure banner (offline/critical errors)
- [x] Frontend: Centralized error handling, accessible notifications
