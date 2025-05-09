import redis
import os
import json
from typing import Dict, Any, Tuple
import requests

# Placeholder for Redis and Celery configuration

REDIS_URL = "redis://localhost:6379/0"
CELERY_BROKER_URL = REDIS_URL
CELERY_RESULT_BACKEND = REDIS_URL

# Vault integration

VAULT_ADDR = os.getenv("VAULT_ADDR")
VAULT_TOKEN = os.getenv("VAULT_TOKEN")
JWKS_PATH = os.getenv("JWKS_PATH", "jwks.json")

_jwks_cache = None


def load_jwks() -> Dict[str, Any]:
    global _jwks_cache
    if _jwks_cache is not None:
        return _jwks_cache
    if VAULT_ADDR and VAULT_TOKEN:
        # Load JWKS from Vault
        url = f"{VAULT_ADDR}/v1/secret/data/jwks"
        headers = {"X-Vault-Token": VAULT_TOKEN}
        try:
            resp = requests.get(url, headers=headers)
            if resp.status_code == 403:
                # Token expired, try to renew (requires Vault policies)
                renew_url = f"{VAULT_ADDR}/v1/auth/token/renew-self"
                renew_resp = requests.post(renew_url, headers=headers)
                renew_resp.raise_for_status()
                # Retry original request
                resp = requests.get(url, headers=headers)
            resp.raise_for_status()
            data = resp.json()
            _jwks_cache = data["data"]["data"]
        except Exception as e:
            raise RuntimeError(f"Failed to load JWKS from Vault: {e}")
    else:
        # Load JWKS from local file
        with open(JWKS_PATH) as f:
            _jwks_cache = json.load(f)
    return _jwks_cache


def get_current_signing_key() -> Tuple[str, str]:
    jwks = load_jwks()
    kid = jwks["current"]
    secret = jwks["keys"][kid]
    return kid, secret


def get_verification_keys() -> Dict[str, str]:
    jwks = load_jwks()
    return jwks["keys"]


def get_redis_client():
    try:
        client = redis.Redis.from_url(REDIS_URL)
        client.ping()
        return client
    except Exception as e:
        raise RuntimeError(f"Failed to connect to Redis: {e}")
