from unittest.mock import patch, MagicMock
import pytest
from app.services import model_service

def test_load_model_success():
    with patch("importlib.import_module") as mock_import:
        mock_module = MagicMock()
        mock_module.infer = MagicMock()
        mock_import.return_value = mock_module
        infer_func = model_service.load_model("graphcodebert")
        assert callable(infer_func)
        assert infer_func == mock_module.infer

def test_load_model_missing():
    with pytest.raises(ValueError) as exc:
        model_service.load_model("nonexistent")
    assert "not available" in str(exc.value)

def test_load_model_import_error():
    with patch("importlib.import_module", side_effect=Exception("fail")):
        with pytest.raises(ImportError) as exc:
            model_service.load_model("graphcodebert")
        assert "Failed to load model" in str(exc.value)

def test_load_model_missing_infer():
    with patch("importlib.import_module") as mock_import:
        mock_module = MagicMock()
        delattr(mock_module, "infer")
        mock_import.return_value = mock_module
        with pytest.raises(ImportError):
            model_service.load_model("graphcodebert")

def test_load_model_import_exception():
    with patch("importlib.import_module", side_effect=Exception("import fail")):
        with pytest.raises(ImportError) as excinfo:
            model_service.load_model("graphcodebert")
        assert "Failed to load model" in str(excinfo.value)

def test_load_model_missing_infer():
    mock_module = MagicMock()
    del mock_module.infer
    with patch("importlib.import_module", return_value=mock_module):
        with pytest.raises(ImportError) as excinfo:
            model_service.load_model("graphcodebert")
        assert "Failed to load model" in str(excinfo.value)