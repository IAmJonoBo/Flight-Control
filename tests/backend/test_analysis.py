from fastapi.testclient import TestClient
from app.main import app  # type: ignore
from unittest.mock import patch, MagicMock
from fastapi.testclient import TestClient as FastAPITestClient

def test_analysis_valid():
    client: FastAPITestClient = TestClient(app)  # type: ignore
    mock_module = MagicMock()
    mock_module.infer.return_value = {"predicted_class": "test", "score": 1.0}
    with patch("app.services.model_service.importlib.import_module", return_value=mock_module):
        response = client.post("/analysis/run", json={"code": "def foo(): pass"})
        assert response.status_code == 200
        assert "result" in response.json()
        assert "predicted_class" in response.json()["result"]

def test_analysis_invalid():
    client: FastAPITestClient = TestClient(app)  # type: ignore
    response = client.post("/analysis/run", json={"code": ""})
    assert response.status_code == 400
    assert response.json()["detail"] == "Invalid or empty code input."

def test_analysis_invalid_model():
    client: FastAPITestClient = TestClient(app)  # type: ignore
    response = client.post("/analysis/run", json={"code": "def foo(): pass", "model": "nonexistent_model"})
    assert response.status_code == 400
    assert "not available" in response.json()["detail"] or "Failed to load model" in response.json()["detail"]
