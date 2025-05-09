from unittest.mock import patch, MagicMock
from app.services import feedback_service
from fastapi import UploadFile
from _pytest.logging import LogCaptureFixture


def test_upload_attachment_to_s3_success():
    mock_file = MagicMock(spec=UploadFile)
    mock_file.file = MagicMock()
    with patch("boto3.client") as mock_boto:
        mock_s3 = mock_boto.return_value
        url = feedback_service.upload_attachment_to_s3(mock_file, "test.txt")
        assert url is not None
        mock_s3.upload_fileobj.assert_called_once()


def test_upload_attachment_to_s3_failure():
    mock_file = MagicMock(spec=UploadFile)
    with patch("boto3.client", side_effect=Exception("fail")):
        url = feedback_service.upload_attachment_to_s3(mock_file, "test.txt")
        assert url is None


def test_create_github_issue_success():
    with patch("app.services.feedback_service.Github") as mock_github, \
         patch.dict("os.environ", {"GITHUB_TOKEN": "token", "GITHUB_REPO": "repo"}):
        mock_repo = mock_github.return_value.get_repo.return_value
        result = feedback_service.create_github_issue("title", "body", "low")
        assert result is True
        mock_repo.create_issue.assert_called_once()


def test_create_github_issue_no_config():
    with patch.dict("os.environ", {"GITHUB_TOKEN": "", "GITHUB_REPO": ""}):
        result = feedback_service.create_github_issue("title", "body", "low")
        assert result is False


def test_create_github_issue_failure():
    with patch("app.services.feedback_service.Github", side_effect=Exception("fail")), \
         patch.dict("os.environ", {"GITHUB_TOKEN": "token", "GITHUB_REPO": "repo"}):
        result = feedback_service.create_github_issue("title", "body", "low")
        assert result is False


def test_format_feedback_yaml():
    data = {"a": 1, "b": 2}
    yaml_str = feedback_service.format_feedback_yaml(data)
    assert "a: 1" in yaml_str and "b: 2" in yaml_str


def test_audit_log_feedback(caplog: LogCaptureFixture):
    data = {"title": "t", "description": "d"}
    with caplog.at_level("INFO"):
        feedback_service.audit_log_feedback(data)
        assert any("Feedback submission" in m for m in caplog.messages)
