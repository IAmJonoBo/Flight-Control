from fastapi.testclient import TestClient
from unittest.mock import patch
from app.main import app  # type: ignore
import io
from fastapi.testclient import TestClient as FastAPITestClient
from _pytest.monkeypatch import MonkeyPatch

def test_feedback_valid(monkeypatch: MonkeyPatch):
    client: FastAPITestClient = TestClient(app)
    # Mock S3 and GitHub integrations
    monkeypatch.setenv("GITHUB_TOKEN", "dummy")
    monkeypatch.setenv("GITHUB_REPO", "dummy/repo")
    monkeypatch.setenv("S3_ENDPOINT", "http://localhost:9000")
    monkeypatch.setenv("S3_ACCESS_KEY", "dummy")
    monkeypatch.setenv("S3_SECRET_KEY", "dummy")
    monkeypatch.setenv("S3_BUCKET", "test-bucket")
    monkeypatch.setenv("S3_PUBLIC_URL", "http://localhost:9000")
    with patch("app.routes.feedback.upload_attachment_to_s3", return_value="http://localhost:9000/test-bucket/feedback/file.txt"), \
         patch("app.routes.feedback.create_github_issue", return_value=True):
        response = client.post(
            "/feedback",
            data={
                "title": "Test Feedback",
                "description": "This is a test feedback description.",
                "severity": "high",
                "email": "user@example.com",
            },
            files={"attachment": ("file.txt", io.BytesIO(b"test"), "text/plain")},
        )
        assert response.status_code == 201
        assert "detail" in response.json()

def test_feedback_invalid_severity():
    client: FastAPITestClient = TestClient(app)
    response = client.post(
        "/feedback",
        data={
            "title": "Test Feedback",
            "description": "This is a test feedback description.",
            "severity": "invalid",
        },
    )
    assert response.status_code == 400
    assert "Invalid severity" in response.text

def test_feedback_short_title():
    client: FastAPITestClient = TestClient(app)
    response = client.post(
        "/feedback",
        data={
            "title": "Hi",
            "description": "This is a test feedback description.",
            "severity": "low",
        },
    )
    assert response.status_code == 400
    assert "Title must be 3-100 characters" in response.text

def test_feedback_short_description():
    client: FastAPITestClient = TestClient(app)
    response = client.post(
        "/feedback",
        data={
            "title": "Valid Title",
            "description": "short",
            "severity": "medium",
        },
    )
    assert response.status_code == 400
    assert "Description must be 10-2000 characters" in response.text

def test_feedback_missing_required():
    client: FastAPITestClient = TestClient(app)
    response = client.post(
        "/feedback",
        data={
            "description": "This is a test feedback description.",
            "severity": "high",
        },
    )
    assert response.status_code == 422  # FastAPI validation error for missing title