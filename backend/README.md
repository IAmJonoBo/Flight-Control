# Flight Control Backend

## JWT Secret Management & Key Rotation

- **Dev:** Store JWT secrets in `.env` or local Vault instance.
- **Prod:** Store secrets in HashiCorp Vault (see [infrastructure/README.md](../infrastructure/README.md)).
- **Key Rotation:**
  - Rotate JWT signing keys every 30–90 days.
  - Use a `jwks.json` file to map key IDs (kid) to secrets for verification.
  - Support multiple keys for seamless rotation.

## Example jwks.json
```json
{
  "current": "key-2024-06-01",
  "keys": {
    "key-2024-06-01": "<32+ char secret>",
    "key-2024-03-01": "<old secret>"
  }
}
```

## Refresh Token Handling
- Store refresh tokens in a separate, secure HttpOnly cookie.
- Access tokens are kept in memory only (not in localStorage/sessionStorage).
- Set cookies with `HttpOnly`, `Secure`, and `SameSite` flags:
  - Dev: `SameSite=Lax`, `Secure=false`
  - Prod: `SameSite=None`, `Secure=true`
- Example (FastAPI):
```python
response.set_cookie(
    key="refresh_token",
    value=refresh_token,
    httponly=True,
    secure=is_prod,
    samesite="None" if is_prod else "Lax",
    max_age=7*24*60*60  # 7 days
)
```

## Feedback Backend Setup

- **Required Environment Variables:**
  - `S3_ENDPOINT`, `S3_ACCESS_KEY`, `S3_SECRET_KEY`, `S3_BUCKET`, `S3_PUBLIC_URL`
  - `GITHUB_TOKEN`, `GITHUB_REPO`
- **Usage:**
  - Submit feedback via `POST /feedback` (multipart/form-data)
  - Fields: title, description, severity, email (optional), attachment (optional)
  - Attachments are uploaded to S3/MinIO; feedback is formatted as YAML and posted as a GitHub Issue with labels

**Example cURL:**
```bash
curl -X POST http://localhost:8000/feedback \
  -F "title=Bug in analysis" \
  -F "description=The analysis endpoint returns a 500 error on large files." \
  -F "severity=high" \
  -F "email=user@example.com" \
  -F "attachment=@/path/to/screenshot.png"
```

## References
- [Vault & MinIO Deployment](../infrastructure/README.md)
- [Security & Accessibility Guide](../docs/src/docs/accessibility.md)