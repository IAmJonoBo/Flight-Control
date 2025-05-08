# Getting Started

Welcome to Flight Control!

Flight Control is an AI-driven code analysis and refactoring platform. This guide will help you set up the project locally and understand the basics.

## Prerequisites
- Node.js v18+
- Python 3.10+
- Docker
- Git

## Local Setup (Best Practice)
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-org/flight-control.git
   cd flight-control
   ```
2. **Install dependencies:**
   - **Frontend:**
     ```bash
     cd frontend
     npm install
     # Run static analysis and type checks
     npm run lint
     npx tsc --noEmit
     # Start the local dev server
     npm run dev
     # Open http://localhost:5173
     ```
   - **Backend:**
     ```bash
     cd backend
     pip install -r requirements.txt
     # Start FastAPI server
     uvicorn app.main:app --reload
     # Open http://localhost:8000/docs for API docs
     ```
   - **AI/ML:**
     ```bash
     cd ai-ml
     pip install -r requirements.txt
     # Run model scripts as needed
     ```
3. **(Optional) Start all services with Docker Compose:**
   ```bash
   docker-compose up -d
   # This will start frontend, backend, db, and redis
   ```
4. **Run all tests:**
   ```bash
   ./ci-cd/scripts/test.sh
   # Or run frontend tests:
   cd frontend && npm run test
   # Or backend tests:
   cd backend && pytest
   ```
5. **Build and view documentation locally:**
   ```bash
   cd docs
   npm install
   npm run start
   # Open http://localhost:3000
   ```

## Usage Examples

### 1. Code Analysis
- Enter or paste code in the Dashboard's code editor.
- The backend will analyze the code using the currently selected model (see Model Selection below) and return results such as:
  ```json
  {
    "result": {
      "predicted_class": 1,
      "confidence": 0.98
    }
  }
  ```

### 2. Clone a Git Repository
- Enter a repository URL in the "Clone a Git Repository" input on the Dashboard.
- Click "Clone" to trigger the backend clone operation.
- Success and error messages will be displayed below the input.

### 3. Model Selection
- Go to the Settings page (or use the model selection dropdown at the top of the Dashboard).
- The "Model Selection" dropdown will be populated dynamically from the backend.
- Select a model to use for analysis. All code analysis requests will use the currently selected model.

## Accessibility & Compliance
- Flight Control aims for WCAG 2.1 AA accessibility compliance.
- Automated accessibility checks are run in CI using axe-core.
- Please report any accessibility issues or suggestions via GitHub Issues.

## Troubleshooting
- If a service fails to start, check logs with `docker-compose logs <service>`.
- For database issues, ensure Docker is running and ports are not in use.
- For frontend issues, ensure all dependencies are installed and static analysis passes (`npm run lint`, `npx tsc --noEmit`).
- For more help, see the [Developer Guide](./developer-guide.md).

## Contributing
- Please review the [Project Plan](../../../../PROJECT_PLAN.md) and [Changelog](../../../../CHANGELOG.md) before submitting PRs.
- Update documentation and tests with every feature or fix.