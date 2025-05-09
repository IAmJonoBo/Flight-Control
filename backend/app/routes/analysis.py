from fastapi import APIRouter, Body, HTTPException
from app.services.analysis_service import analyze_code
from typing import Dict, Any

router = APIRouter()


@router.post("/analysis/run")
def run_analysis_endpoint(payload: Dict[str, Any] = Body(...)):
    code = payload.get("code", "")
    model = payload.get("model", "graphcodebert")
    if not code or len(code.strip()) < 3:
        raise HTTPException(status_code=400, detail="Invalid or empty code input.")
    result = analyze_code(code, model)
    if "error" in result:
        if (
            "not available" in result["error"]
            or "Failed to load model" in result["error"]
        ):
            raise HTTPException(status_code=400, detail=result["error"])
        raise HTTPException(status_code=500, detail=result["error"])
    return {"result": result}
