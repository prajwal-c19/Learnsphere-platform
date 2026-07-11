from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user

from app.models.user import User

from app.services import certificate_service

router = APIRouter(
    prefix="/certificate",
    tags=["Certificate"]
)


@router.get("/{assessment_id}")
def download_certificate(
    assessment_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    buffer = certificate_service.generate_certificate(
        db=db,
        current_user=current_user,
        assessment_id=assessment_id
    )

    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={
            "Content-Disposition": (
                f"attachment; filename=certificate_{assessment_id}.pdf"
            )
        }
    )
