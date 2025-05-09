# API Reference

This section provides an overview of the main API endpoints for Flight Control.

## Implemented Endpoints
- `GET /health` — Returns API status.
  - **Response:** `{ "status": "ok" }`

- `POST /analysis/run` — Run code analysis using GraphCodeBERT (or other models).
  - **Request:** `{ "code": "def foo(): pass", "model": "graphcodebert" }` (model is optional)
  - **Response:** `{ "result": { "predicted_class": 1, "confidence": 0.98 } }`
  - **Errors:** 400 (invalid input or model), 500 (inference error)

- `POST /git/clone` — Clone a repository to a temporary directory.
  - **Request:** `{ "url": "https://github.com/octocat/Hello-World.git" }`
  - **Response:** `{ "result": { "success": true, "path": "/tmp/cloned_repo" } }`
  - **Errors:** 400 (invalid URL), 500 (clone error)

- `GET /models/list` — List available models.
  - **Response:** `{ "models": ["graphcodebert", "lora", ...] }`
  - **Errors:** 500 (listing error)

- `POST /auth/login` — User login (stub).

## Model Training & Data Pipeline (CLI)
- `python ai-ml/models/lora/train_lora.py` — Fine-tune models with LoRA adapters (see Developer Guide for usage).
- `python ai-ml/models/synthetic/generate.py` — Generate synthetic code samples with code smells.
- `python ai-ml/models/synthetic/validate.py` — Validate synthetic samples with Semgrep and CodeBERTScore.

## OpenAPI Documentation
See the [OpenAPI YAML](../../swagger/openapi.yaml) for the full API schema and planned endpoints.

## Notes
- Endpoints above are production-ready unless marked as "stub".
