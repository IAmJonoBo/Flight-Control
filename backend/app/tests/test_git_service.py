from unittest.mock import patch
from app.services import git_service
from pathlib import Path


def test_clone_repo_success():
    with patch("os.path.exists", return_value=False), \
         patch("app.services.git_service.Repo.clone_from") as mock_clone:
        result = git_service.clone_repo("https://github.com/octocat/Hello-World.git", "/tmp/cloned_repo")
        assert result["success"] is True
        assert result["path"] == "/tmp/cloned_repo"
        mock_clone.assert_called_once_with("https://github.com/octocat/Hello-World.git", "/tmp/cloned_repo")


def test_clone_repo_dest_exists(tmp_path: Path):
    dest = tmp_path / "cloned_repo"
    dest.mkdir()
    result = git_service.clone_repo("https://github.com/octocat/Hello-World.git", str(dest))
    assert "error" in result and "already exists" in result["error"]


def test_clone_repo_git_error():
    with patch("app.services.git_service.Repo.clone_from", side_effect=git_service.GitCommandError("cmd", 1)):
        result = git_service.clone_repo("https://github.com/octocat/Hello-World.git", "/tmp/should_not_exist")
        assert "error" in result and "Git clone failed" in result["error"]


def test_clone_repo_unexpected_error():
    with patch("app.services.git_service.Repo.clone_from", side_effect=Exception("fail")):
        result = git_service.clone_repo("https://github.com/octocat/Hello-World.git", "/tmp/should_not_exist")
        assert "error" in result and "Unexpected error" in result["error"]