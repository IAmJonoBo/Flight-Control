from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

# In-memory store for demonstration; replace with persistent storage in production
_advanced_settings = {"param": ""}

class AdvancedSettings(BaseModel):
    param: str

@router.get("/settings/advanced", response_model=AdvancedSettings)
def get_advanced_settings():
    return _advanced_settings

@router.post("/settings/advanced")
def save_advanced_settings(settings: AdvancedSettings):
    _advanced_settings["param"] = settings.param
    return {"detail": "Settings saved"}