from unittest.mock import patch, MagicMock
from app.services import analysis_service
import importlib
from typing import Any
import pytest

def test_analyze_code_valid():
    mock_module = MagicMock()
    mock_module.infer = MagicMock(return_value={"result": "ok"})
    with patch("importlib.import_module", return_value=mock_module):
        result = analysis_service.analyze_code("def foo(): pass", "graphcodebert")
        assert result == {"result": "ok"}


def test_analyze_code_invalid():
    mock_module = MagicMock()
    mock_module.infer = MagicMock(return_value={"result": "ok"})
    with patch("importlib.import_module", return_value=mock_module):
        result = analysis_service.analyze_code("", "graphcodebert")
        assert "error" in result
        assert "Invalid or empty code input" in result["error"]


def test_analyze_code_missing_model():
    with patch("app.services.model_service.load_model", side_effect=ValueError("not available")):
        result = analysis_service.analyze_code("def foo(): pass", "nonexistent")
        assert "error" in result and "not available" in result["error"]


def test_analyze_code_import_error():
    real_import_module = importlib.import_module
    def import_side_effect(name: str, *args: Any, **kwargs: Any) -> Any:
        if name == "ai-ml.models.graphcodebert.inference":
            raise ImportError("fail")
        return real_import_module(name, *args, **kwargs)
    with patch("importlib.import_module", side_effect=import_side_effect):
        result = analysis_service.analyze_code("def foo(): pass", "graphcodebert")
        assert "error" in result and "fail" in result["error"]


def test_analyze_code_inference_error():
    real_import_module = importlib.import_module
    def import_side_effect(name: str, *args: Any, **kwargs: Any) -> Any:
        if name == "ai-ml.models.graphcodebert.inference":
            mock_module = MagicMock()
            mock_module.infer = MagicMock(side_effect=Exception("inference fail"))
            return mock_module
        return real_import_module(name, *args, **kwargs)
    with patch("importlib.import_module", side_effect=import_side_effect):
        result = analysis_service.analyze_code("def foo(): pass", "graphcodebert")
        assert "error" in result and "inference fail" in result["error"]


def test_analyze_code_value_error():
    with patch("app.services.model_service.load_model", side_effect=ValueError("bad model")):
        result = analysis_service.analyze_code("def foo(): pass", model_name="badmodel")
        assert result["error"] == "Model 'badmodel' is not available."


def test_analyze_code_import_error():
    with patch("app.services.model_service.load_model", side_effect=ImportError("import fail")):
        result = analysis_service.analyze_code("def foo(): pass", model_name="importfail")
        assert result["error"] == "Model 'importfail' is not available."


def test_analyze_code_generic_exception():
    mock_module = MagicMock()
    mock_module.infer.side_effect = Exception("unexpected")
    with patch("app.services.model_service.importlib.import_module", return_value=mock_module):
        result = analysis_service.analyze_code("def foo(): pass")
        assert "Model inference failed" in result["error"]