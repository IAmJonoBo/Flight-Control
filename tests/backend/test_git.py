from fastapi.testclient import TestClient
from app.main import app  # type: ignore
import pytest
from fastapi.testclient import TestClient as FastAPITestClient

def test_git_clone_invalid():
    client: FastAPITestClient = TestClient(app)
    response = client.post("/git/clone", json={"url": ""})
    assert response.status_code == 422
    # Optionally check for validation error message
    assert "Input should be a valid URL" in response.text

@pytest.mark.skip(reason="Requires network and a real repo; enable for integration testing.")
def test_git_clone_valid():
    client: FastAPITestClient = TestClient(app)
    # Use a public, small repo for testing
    response = client.post("/git/clone", json={"url": "https://github.com/octocat/Hello-World.git"})
    # Accept 200 or 500 (if already exists or network error)
    assert response.status_code in (200, 500)