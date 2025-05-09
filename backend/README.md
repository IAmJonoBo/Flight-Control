# Flight Control Backend

## JWT Secret Management & Key Rotation

See the [Security Guide](../docs/src/docs/security.md) for full details on JWT secret management, key rotation, and best practices.

## Refresh Token Handling
- Store refresh tokens in a secure HttpOnly cookie (see Security Guide).
- Access tokens are kept in memory only.
- Set cookies with `HttpOnly`, `Secure`, and `SameSite` flags as appropriate for dev/prod.

## Feedback Backend Setup

See the [Feedback & User Testing Guide](../docs/src/docs/feedback.md) for full details on feedback endpoints and user testing.

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
- [Security Guide](../docs/src/docs/security.md)
- [Feedback & User Testing Guide](../docs/src/docs/feedback.md)