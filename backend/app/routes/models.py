from fastapi import APIRouter
from typing import Dict, Any
from app.services.model_service import MODEL_REGISTRY

router = APIRouter()


@router.get("/models/list")
def list_models_endpoint() -> Dict[str, Any]:
    """
    List all available models and their metadata from the registry.
    Returns:
        Dict[str, Any]: A dictionary containing a list of models and their metadata.
    """
    models = [
        {
            "name": key,
            "display_name": value.get("display_name", key),
            "description": value.get("description", ""),
            "config_schema": value.get("config_schema", {}),
        }
        for key, value in MODEL_REGISTRY.items()
    ]
    return {"models": models}
