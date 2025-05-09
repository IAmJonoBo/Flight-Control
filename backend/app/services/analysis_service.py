# Placeholder for analysis service logic

import logging
import sys
import os
from typing import Dict, Any, Callable
from app.services.model_service import load_model

# Set up a module-level logger (replace with shared logger if available)
logger = logging.getLogger("analysis_service")
logging.basicConfig(level=logging.INFO)

# Ensure the model path is available for import (legacy support)
sys.path.append(
    os.path.abspath(
        os.path.join(os.path.dirname(__file__), "../../../ai-ml/models/graphcodebert")
    )
)

def analyze_code(code: str, model_name: str = "graphcodebert") -> Dict[str, Any]:
    """
    Analyze code using the specified model.
    Args:
        code (str): The code to analyze.
        model_name (str): The model to use for analysis.
    Returns:
        Dict[str, Any]: The analysis result or error message.
    """
    if not code or len(code.strip()) < 3:
        logger.warning("Invalid or empty code input received for analysis.")
        return {"error": "Invalid or empty code input."}
    try:
        infer: Callable[[str], Dict[str, Any]] = load_model(model_name)
        result: Dict[str, Any] = infer(code)
        logger.info(f"Analysis completed successfully with model '{model_name}'.")
        return result
    except ValueError as ve:
        logger.error(f"Model value error: {ve}")
        return {"error": str(ve)}
    except ImportError as ie:
        logger.error(f"Model import error: {ie}")
        return {"error": str(ie)}
    except Exception as e:
        logger.exception(f"Model inference failed: {e}")
        return {"error": f"Model inference failed: {e}"}
