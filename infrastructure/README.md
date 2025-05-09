# Infrastructure Guide: Vault & MinIO Deployment

This guide covers deploying HashiCorp Vault and MinIO for both development and production environments.

---

## Vault Deployment

### Development (Single-Node, Docker Compose)
- Use the official Vault Docker image with integrated Raft storage.
- Example Compose service:

```yaml
vault:
  image: hashicorp/vault:1.13
  environment:
    VAULT_DEV_ROOT_TOKEN_ID: devroot
    VAULT_DEV_LISTEN_ADDRESS: 0.0.0.0:8200
  ports:
    - "8200:8200"
  cap_add:
    - IPC_LOCK
```
- Access at http://localhost:8200 (devroot token).
- Store secrets for local dev in Vault or .env files.

### Production (Multi-Node, TLS, ACLs)
- Deploy 3–5 node Raft cluster (see [Vault HA Raft Guide](https://developer.hashicorp.com/vault/docs/enterprise/raft)).
- Enable TLS on all APIs, configure ACL policies, and enable audit logging.
- Use Helm or Terraform for k8s/cloud automation.
- Restrict network access to Vault API and UI.
- Rotate root/unseal keys and store securely (e.g., offline or in HSM).

---

## MinIO Deployment

### Development (Single-Node, Docker Compose)
- Use the official MinIO Docker image.
- Example Compose service:

```yaml
minio:
  image: minio/minio:latest
  environment:
    MINIO_ROOT_USER: minioadmin
    MINIO_ROOT_PASSWORD: minioadmin
  command: server /data
  ports:
    - "9000:9000"
    - "9001:9001"
  volumes:
    - ./minio-data:/data
```
- Access at http://localhost:9000 (UI: 9001).
- Use for local S3-compatible storage (artifacts, models).

### Production (Distributed, TLS, Monitoring)
- Deploy MinIO in distributed mode (≥4 nodes/drives) for erasure-coded redundancy.
- Secure with TLS certificates (see [MinIO TLS Guide](https://min.io/docs/minio/linux/security/tls.html)).
- Monitor with Prometheus exporters.
- Optionally, use MinIO Gateway for S3 cloud bursting.

---

## Best Practices
- **Secrets:** Never store secrets in code or public repos. Use Vault for all sensitive config in prod.
- **TLS:** Always enable TLS in production for both Vault and MinIO.
- **Monitoring:** Use Prometheus/Grafana for health and usage metrics.
- **Backups:** Regularly back up Vault and MinIO data volumes.

---

For more, see the [Developer Guide](../docs/Developer%20Guide.md) and [Security Docs](../docs/src/docs/accessibility.md).