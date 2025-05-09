from fastapi.testclient import TestClient
from app.main import app

def test_models_list():
    client = TestClient(app)
    response = client.get("/models/list")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert isinstance(data["models"], list)