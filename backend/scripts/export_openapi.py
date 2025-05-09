import sys
import yaml
from app.main import app
from fastapi.openapi.utils import get_openapi

schema = get_openapi(
    title=app.title,
    version=app.version,
    routes=app.routes,
)
yaml.safe_dump(schema, sys.stdout)