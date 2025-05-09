from fastapi import FastAPI
from app.routes import (
    health_router,
    git_router,
    analysis_router,
    models_router,
    auth_router,
    feedback_router,
)
from prometheus_fastapi_instrumentator import Instrumentator
import os
import sentry_sdk
from sentry_sdk.integrations.asgi import SentryAsgiMiddleware

app = FastAPI(title="Flight Control API")

SENTRY_DSN = os.getenv("SENTRY_DSN")
if SENTRY_DSN:
    sentry_sdk.init(dsn=SENTRY_DSN, traces_sample_rate=0.1)
    app.add_middleware(SentryAsgiMiddleware)

app.include_router(health_router)
app.include_router(git_router)
app.include_router(analysis_router)
app.include_router(models_router)
app.include_router(auth_router)
app.include_router(feedback_router)

Instrumentator().instrument(app).expose(app)
