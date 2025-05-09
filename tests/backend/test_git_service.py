from unittest.mock import patch, MagicMock
from app.services import git_service  # type: ignore
import os
import pytest

def test_clone_repo_success():
    with patch("os.path.exists", return_value=False), \
         patch("app.services.git_service.Repo.clone_from") as mock_clone:
        result = git_service.clone_repo("https://github.com/octocat/Hello-World.git", "/tmp/cloned_repo")
        assert result["success"] is True
        assert result["path"] == "/tmp/cloned_repo"
        mock_clone.assert_called_once_with("https://github.com/octocat/Hello-World.git", "/tmp/cloned_repo")

def test_clone_repo_dest_exists():
    with patch("os.path.exists", return_value=True):
        result = git_service.clone_repo("https://github.com/octocat/Hello-World.git", "/tmp/cloned_repo")
        assert "error" in result and "already exists" in result["error"]

def test_clone_repo_git_error():
    with patch("os.path.exists", return_value=False), \
         patch("app.services.git_service.Repo.clone_from", side_effect=git_service.GitCommandError("cmd", 1)):
        result = git_service.clone_repo("https://github.com/octocat/Hello-World.git", "/tmp/cloned_repo")
        assert "error" in result and "Git clone failed" in result["error"]

def test_clone_repo_unexpected_error():
    with patch("os.path.exists", return_value=False), \
         patch("app.services.git_service.Repo.clone_from", side_effect=Exception("fail")):
        result = git_service.clone_repo("https://github.com/octocat/Hello-World.git", "/tmp/cloned_repo")
        assert "error" in result and "Unexpected error" in result["error"]