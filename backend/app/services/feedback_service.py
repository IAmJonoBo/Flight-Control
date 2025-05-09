import os
import logging
import yaml
from github import Github
import boto3  # type: ignore
from typing import Optional, Dict, Any
from fastapi import UploadFile

logger = logging.getLogger("feedback_service")
logging.basicConfig(level=logging.INFO)


def upload_attachment_to_s3(attachment: UploadFile, filename: str) -> Optional[str]:
    try:
        s3 = boto3.client(
            "s3",
            endpoint_url=os.getenv("S3_ENDPOINT"),
            aws_access_key_id=os.getenv("S3_ACCESS_KEY"),
            aws_secret_access_key=os.getenv("S3_SECRET_KEY"),
        )
        bucket = os.getenv("S3_BUCKET", "feedback-attachments")
        key = f"feedback/{filename}"
        s3.upload_fileobj(attachment.file, bucket, key, ExtraArgs={"ACL": "public-read"})  # type: ignore
        url = f"{os.getenv('S3_PUBLIC_URL', '')}/{bucket}/{key}"
        logger.info(f"Uploaded attachment to S3: {url}")
        return url
    except Exception as e:
        logger.error(f"S3 upload failed: {e}")
        return None


def create_github_issue(title: str, body: str, severity: str) -> bool:
    GITHUB_TOKEN = os.getenv("GITHUB_TOKEN")
    GITHUB_REPO = os.getenv("GITHUB_REPO")
    if not GITHUB_TOKEN or not GITHUB_REPO:
        logger.error("GitHub integration not configured")
        return False
    try:
        g = Github(GITHUB_TOKEN)
        repo = g.get_repo(GITHUB_REPO)
        labels = [f"severity:{severity}", "triage:feedback"]
        repo.create_issue(title=title, body=body, labels=labels)
        logger.info(f"Created GitHub issue for feedback: {title}")
        return True
    except Exception as e:
        logger.error(f"GitHub Issue creation failed: {e}")
        return False


def format_feedback_yaml(data: Dict[str, Any]) -> str:
    return yaml.safe_dump(data, sort_keys=False)


def audit_log_feedback(data: Dict[str, Any]):
    logger.info(f"Feedback submission: {data}")
