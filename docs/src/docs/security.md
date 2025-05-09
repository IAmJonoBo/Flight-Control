# Security Guide

This guide summarizes key security practices for Flight Control.

## JWT Key Management
- Use high-entropy, randomly generated secrets (≥32 chars) for JWT signing.
- Rotate keys every 30–90 days; maintain a `jwks.json` mapping key IDs to secrets.
- Support multiple keys for seamless rotation and verification.

## Vault for Secrets
- Store all production secrets (JWT keys, DB passwords, API tokens) in HashiCorp Vault.
- Use `.env` or local Vault for development only.
- Restrict Vault access with ACLs and enable audit logging.

## MinIO for Artifacts
- Store model checkpoints, logs, and artifacts in MinIO (S3-compatible).
- Enable TLS and access control in production.
- Regularly back up MinIO data.

## Refresh Token Best Practices
- Store refresh tokens in secure, HttpOnly cookies (never in localStorage).
- Use short-lived access tokens (in memory only).
- Set cookies with `Secure` and `SameSite` flags.

## References
- [Backend README](../../../backend/README.md)
- [Infrastructure Guide](../../../infrastructure/README.md)