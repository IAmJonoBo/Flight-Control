from unittest.mock import patch, MagicMock
from app.services import feedback_service  # type: ignore
from fastapi import UploadFile
import os
import pytest

def test_upload_attachment_to_s3_success():
    mock_file = MagicMock(spec=UploadFile)
    mock_file.file = MagicMock()
    with patch("boto3.client") as mock_boto:
        mock_s3 = mock_boto.return_value
        url = feedback_service.upload_attachment_to_s3(mock_file, "test.txt")
        assert url is not None
        mock_s3.upload_fileobj.assert_called_once()

def test_upload_attachment_to_s3_client_failure():
    mock_file = MagicMock(spec=UploadFile)
    with patch("boto3.client", side_effect=Exception("client fail")):
        url = feedback_service.upload_attachment_to_s3(mock_file, "test.txt")
        assert url is None

def test_upload_attachment_to_s3_upload_failure():
    mock_file = MagicMock(spec=UploadFile)
    with patch("boto3.client") as mock_boto:
        mock_s3 = mock_boto.return_value
        mock_s3.upload_fileobj.side_effect = Exception("upload fail")
        url = feedback_service.upload_attachment_to_s3(mock_file, "test.txt")
        assert url is None

def test_create_github_issue_success():
    with patch("app.services.feedback_service.Github") as mock_github, \
         patch.dict(os.environ, {"GITHUB_TOKEN": "token", "GITHUB_REPO": "repo"}):
        mock_repo = mock_github.return_value.get_repo.return_value
        result = feedback_service.create_github_issue("title", "body", "low")
        assert result is True
        mock_repo.create_issue.assert_called_once()

def test_create_github_issue_no_config():
    with patch.dict(os.environ, {"GITHUB_TOKEN": "", "GITHUB_REPO": ""}):
        result = feedback_service.create_github_issue("title", "body", "low")
        assert result is False

def test_create_github_issue_repo_failure():
    with patch("app.services.feedback_service.Github") as mock_github, \
         patch.dict(os.environ, {"GITHUB_TOKEN": "token", "GITHUB_REPO": "repo"}):
        mock_github.return_value.get_repo.side_effect = Exception("repo fail")
        result = feedback_service.create_github_issue("title", "body", "low")
        assert result is False

def test_create_github_issue_issue_failure():
    with patch("app.services.feedback_service.Github") as mock_github, \
         patch.dict(os.environ, {"GITHUB_TOKEN": "token", "GITHUB_REPO": "repo"}):
        mock_repo = mock_github.return_value.get_repo.return_value
        mock_repo.create_issue.side_effect = Exception("issue fail")
        result = feedback_service.create_github_issue("title", "body", "low")
        assert result is False