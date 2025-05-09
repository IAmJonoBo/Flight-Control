#!/bin/bash
set -e

# Frontend tests
cd ../../frontend && npm install && npm run test

# Backend tests
cd ../backend && pip install -r requirements.txt && pytest app/tests/

# AI/ML tests (placeholder)
cd ../ai-ml && pip install -r requirements.txt && python models/graphcodebert/train.py