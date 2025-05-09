# Flight Control

[![CI](https://github.com/your-organization/flight-control/actions/workflows/ci.yml/badge.svg)](https://github.com/your-organization/flight-control/actions/workflows/ci.yml)
[![Docs](https://github.com/your-organization/flight-control/actions/workflows/docs.yml/badge.svg)](https://github.com/your-organization/flight-control/actions/workflows/docs.yml)
[![Coverage](https://img.shields.io/badge/coverage-98%25%2B-brightgreen)](https://codecov.io/gh/your-organization/flight-control)
[![OpenAPI](https://img.shields.io/badge/OpenAPI-Swagger-blue)](./docs/swagger/openapi.yaml)
[![Live Docs](https://your-org.github.io/flight-control/)](https://your-org.github.io/flight-control/)

> **Flight Control** is a modular, production-grade platform for intelligent code analysis, combining FastAPI, React, and advanced AI/ML (GraphCodeBERT, LoRA) with robust CI/CD, infrastructure-as-code, and best-in-class documentation.

---

## 🚀 Quickstart

```bash
git clone https://github.com/your-organization/flight-control.git
cd flight-control
# See Getting Started for full setup
```

- **Frontend:** `cd frontend && npm install && npm run dev`
- **Backend:** `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
- **AI/ML:** `cd ai-ml && pip install -r requirements.txt`
- **Docs:** `cd docs && npm install && npm run start`

---

## 📦 Project Structure

```bash
flight-control/
├── frontend/        # React + Vite + Tailwind UI
├── backend/         # FastAPI backend
├── ai-ml/           # AI/ML pipeline (GraphCodeBERT, LoRA)
├── infrastructure/  # Docker, Kubernetes, Terraform
├── ci-cd/           # GitHub Actions, Snyk, ArgoCD
├── docs/            # Docusaurus, Swagger/OpenAPI
├── tests/           # Unit, integration, E2E tests
├── shared/          # Shared config, logger, types
└── .env             # Environment variables
```

---

## 📚 Documentation

- [Vision & Overview](./docs/src/docs/vision.md)
- [Milestones & Phases](./docs/src/docs/milestones.md)
- [Key Deliverables](./docs/src/docs/deliverables.md)
- [Review & Update Process](./docs/src/docs/review-process.md)
- [Next Steps](./docs/src/docs/next-steps.md)
- [Enhancements & Suggestions](./docs/src/docs/enhancements.md)
- [Getting Started](./docs/src/docs/getting-started.md)
- [API Reference](./docs/src/docs/api-reference.md)
- [Security Guide](./docs/src/docs/security.md)
- [Accessibility Guide](./docs/src/docs/accessibility.md)
- [Feedback & User Testing](./docs/src/docs/feedback.md)
- [Pilot Deployment](./docs/src/docs/pilot-deployment.md)
- [Infrastructure Guide](./infrastructure/README.md)
- [Changelog](./CHANGELOG.md)
- [Contributing](./CONTRIBUTING.md)
- [Code of Conduct](./CODE_OF_CONDUCT.md)

---

## 🧪 Testing
- **Backend:** `cd backend && pytest`
- **Frontend:** `cd frontend && npm run test`
- **AI/ML:** `cd ai-ml && pytest`
- **E2E:** See [Getting Started](./docs/src/docs/getting-started.md#run-all-tests)
- **Coverage:** Enforced in CI (98%+ backend, 80%+ frontend)

---

## 🛡️ Security & Infrastructure
- Secrets managed via Vault/Kubernetes Secrets ([Security Guide](./docs/src/docs/security.md))
- Snyk/Trivy scans in CI
- Prometheus/Grafana/Sentry for monitoring
- See [Infrastructure Guide](./infrastructure/README.md)

---

## 🤝 Contributing
- See [Contributing](./CONTRIBUTING.md)
- All PRs require tests, docs, and code review
- Roadmap and future enhancements in [Enhancements & Suggestions](./docs/src/docs/enhancements.md)

---

## 📣 Support
- [GitHub Issues](https://github.com/your-organization/flight-control/issues)
- Slack: `#flight-control`

---

> See the [Getting Started](./docs/src/docs/getting-started.md) and [Vision & Overview](./docs/src/docs/vision.md) for full onboarding, automation, and best practices.