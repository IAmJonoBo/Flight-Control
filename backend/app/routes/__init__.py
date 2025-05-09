from fastapi import APIRouter
from .health import router as health_router
from .git import router as git_router
from .analysis import router as analysis_router
from .models import router as models_router
from .auth import router as auth_router
from .feedback import router as feedback_router
from .settings import router as settings_router

__all__ = [
    "health_router",
    "git_router",
    "analysis_router",
    "models_router",
    "auth_router",
    "feedback_router",
    "settings_router",
]

router = APIRouter()
router.include_router(auth_router)
router.include_router(health_router)
router.include_router(feedback_router)
router.include_router(models_router)
router.include_router(git_router)
router.include_router(analysis_router)
router.include_router(settings_router)
