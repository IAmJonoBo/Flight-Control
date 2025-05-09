from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel, EmailStr
from typing import Optional, Dict, Any
from app.services.feedback_service import (
    upload_attachment_to_s3,
    create_github_issue,
    format_feedback_yaml,
    audit_log_feedback,
)

router = APIRouter()


class FeedbackRequest(BaseModel):
    title: str
    description: str
    severity: str
    email: Optional[EmailStr] = None


@router.post("/feedback", status_code=201)
async def submit_feedback(
    title: str = Form(...),
    description: str = Form(...),
    severity: str = Form(...),
    email: Optional[str] = Form(None),
    attachment: Optional[UploadFile] = File(None),
) -> Dict[str, Any]:
    """
    Submit user feedback, optionally with an attachment. Validates input, uploads attachments, and creates a GitHub issue.
    Args:
        title (str): Feedback title.
        description (str): Feedback description.
        severity (str): Severity level (low, medium, high, critical).
        email (Optional[str]): User email.
        attachment (Optional[UploadFile]): Optional file attachment.
    Returns:
        Dict[str, Any]: Success message.
    """
    # Validate severity
    if severity not in {"low", "medium", "high", "critical"}:
        raise HTTPException(status_code=400, detail="Invalid severity")
    # Manual length validation
    if not (3 <= len(title) <= 100):
        raise HTTPException(status_code=400, detail="Title must be 3-100 characters")
    if not (10 <= len(description) <= 2000):
        raise HTTPException(
            status_code=400, detail="Description must be 10-2000 characters"
        )
    # Validate with Pydantic
    try:
        FeedbackRequest(
            title=title, description=description, severity=severity, email=email
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
    # Handle attachment upload (S3/MinIO)
    attachment_url = None
    if attachment:
        filename = attachment.filename or "attachment"
        attachment_url = upload_attachment_to_s3(attachment, filename)
        if not attachment_url:
            raise HTTPException(status_code=500, detail="Attachment upload failed")
    # Format YAML for issue body
    feedback_data = {
        "title": title,
        "description": description,
        "severity": severity,
        "email": email,
        "attachment": attachment_url,
    }
    issue_body = format_feedback_yaml(feedback_data)
    # Audit log
    audit_log_feedback(feedback_data)
    # GitHub Issue creation
    if not create_github_issue(title, issue_body, severity):
        raise HTTPException(status_code=500, detail="GitHub Issue creation failed")
    return {"detail": "Feedback submitted. Thank you!"}
