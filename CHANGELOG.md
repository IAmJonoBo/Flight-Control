# Flight Control Changelog

## v0.1.0 (Scaffolding & Foundation)

- Added: Complete directory structure for monorepo (frontend, backend, ai-ml, infrastructure, ci-cd, docs, tests, shared).
- Added: Frontend scaffold (Vite + React + Tailwind + TypeScript) with branding, sample components, pages, hooks, and services.
- Added: .gitignore for monorepo best practices.
- Added: Placeholder logo and Tailwind color palette.
- Added: Minimal test stub for frontend (Jest + React Testing Library).
- Planned: Backend, AI/ML, infrastructure, CI/CD, documentation, and shared module scaffolding.
- Added: AI/ML module scaffold (requirements, GraphCodeBERT and LoRA scripts, synthetic data scripts, Dockerfile, and notebook stub).
- Added: Infrastructure scaffold (docker-compose.yml, k8s manifests, Terraform AWS/GCP stubs, Dockerfiles for all services, .env.example).
- Added: CI/CD scaffold (GitHub Actions workflows for CI, CD, model training; Snyk config; ArgoCD manifest; test and deploy scripts).
- Added: Documentation scaffold (Docusaurus config, getting started, API reference, OpenAPI YAML, docs package.json).
- Added: Shared utilities (logger, config, types) and test stubs for backend, frontend, e2e, and model modules.
- Implemented: Initial code analysis API and service logic (mock result), with TODOs for ML integration and input validation.
- Integrated: Monaco Editor in frontend, wired to backend analysis API, with TODOs for LSP, debouncing, and loading state.
- Implemented: Initial model training, synthetic data generation, and validation scripts in AI/ML module, with TODOs for advanced logic.
- Implemented: Backend database models (User, CodeSmell), SQLAlchemy base, and Redis client setup, with TODOs for migrations and advanced config.
- Updated: Project plan to mark completed milestones and clarify next steps. Updated getting started and API reference docs to reflect current state and future plans.
- Expanded: Backend endpoints for /git/clone, /models/list, and /auth/login, with TODOs for validation, security, and integration.
- Added: Advanced frontend feature stubs (diff viewer, expanded settings, docs portal, and new route).
- Expanded: Kubernetes and Terraform integration (new service manifests, Postgres PVC, outputs and variables files, TODOs for production hardening).
- Enhanced: CI/CD for model artifact saving, accessibility checks (axe-core), and TODOs for cloud storage, ArgoCD sync, and full WCAG 2.1 AA compliance.
- Added: Accessibility and compliance documentation (new guide, sidebar update, roadmap for audits and user testing).
- Added: Pilot deployment and feedback guide, including sidebar update and feedback process documentation.
- Added: Vault & MinIO deployment guide, JWT key rotation and refresh token handling docs, security and feedback guides. Project plan fully up to date.
- Documented production monitoring (Prometheus, Grafana, Sentry), scaling (Kubernetes HPA, resource limits), and security audit steps in the Developer Guide
- Integrated Monaco Editor with LSP (Python): real-time diagnostics, autocomplete, and hover support in the code editor; docs and TODOs updated

## [Unreleased]

### Added

- /auth/refresh endpoint: rotates refresh token, blacklists old token in Redis, issues new access token and refresh token (cookie)
- /auth/logout endpoint: blacklists current refresh token, deletes cookie
- Redis-based blacklist for used refresh tokens
- Secure, HttpOnly cookies for refresh tokens
- Frontend: Toast notifications (React-Toastify), ARIA-friendly, promise-based
- Frontend: Inline field errors, focus management, ARIA attributes
- Frontend: Submit button loading state
- Frontend: Persistent network failure banner (offline/critical errors)
- Frontend: Centralized error handling, accessible notifications
- Implemented production-ready backend endpoints for code analysis (`/analysis/run`), git clone (`/git/clone`), model listing (`/models/list`), and health check (`/health`).
- Integrated GraphCodeBERT inference with robust error handling.
- Added/updated tests for all new endpoints.
- Updated documentation to reflect new backend API and service architecture.
- Advanced model selection: backend model registry now includes metadata (display name, description, config schema)
- /models/list returns model metadata, not just names
- Frontend Settings UI displays model display names and descriptions, and uses the new structure
- System is extensible for new models and (planned) model-specific configuration
- Expanded test coverage: backend (model selection, error handling), frontend (Settings, Dashboard), and e2e (model selection and analysis flow)
- Added CONTRIBUTING.md, CODE_OF_CONDUCT.md, and GitHub issue/PR templates for public release and community onboarding

### Security

- Implements refresh token rotation and blacklist to prevent replay attacks
- All refresh tokens are single-use and stored in cookies only

### Planned

- In-app feedback form: floating button, modal, minimalist and accessible UI
- Backend feedback endpoint: formats as YAML, creates GitHub Issue
- Maps severity to labels, auto-adds triage:feedback
- Accessibility: ARIA, focus trap, keyboard shortcut, dark/light mode

---

## Instructions

- Update the changelog with every significant change (feature, fix, refactor, infra, docs).
- Review and update the project plan at the start and end of each development phase.
- Use the changelog to inform release notes and retrospectives.
