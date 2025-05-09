from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, HttpUrl
from app.services.git_service import clone_repo
from typing import Dict, Any

router = APIRouter()

class GitCloneRequest(BaseModel):
    url: HttpUrl

@router.post("/git/clone")
def clone_repo_endpoint(payload: GitCloneRequest) -> Dict[str, Any]:
    """
    Clone a git repository to a temporary directory.
    Args:
        payload (GitCloneRequest): The request body containing the repository URL.
    Returns:
        Dict[str, Any]: Success or error message.
    """
    url = payload.url
    result = clone_repo(str(url))
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    return {"message": f"Cloning repo from {url}", "result": result}
