from fastapi import APIRouter
from typing import Dict

router = APIRouter()


@router.get("/health")
def health_check() -> Dict[str, str]:
    """
    Health check endpoint for service monitoring.
    Returns:
        Dict[str, str]: Service status.
    """
    return {"status": "ok"}
