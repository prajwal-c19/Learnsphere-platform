import io
from datetime import date

from fastapi import HTTPException
from sqlalchemy.orm import Session

from reportlab.lib.pagesizes import landscape, A4
from reportlab.lib.colors import HexColor
from reportlab.lib.units import cm
from reportlab.pdfgen import canvas

from app.models.result import Result
from app.models.assessment import Assessment
from app.models.course import Course
from app.models.user import User


def generate_certificate(
    db: Session,
    current_user: User,
    assessment_id: int
):

    result = (
        db.query(Result)
        .filter(
            Result.user_id == current_user.id,
            Result.assessment_id == assessment_id,
        )
        .order_by(Result.submitted_at.desc())
        .first()
    )

    if not result or not result.passed:

        raise HTTPException(
            status_code=400,
            detail="Certificate is only available after passing the assessment."
        )

    assessment = (
        db.query(Assessment)
        .filter(Assessment.id == assessment_id)
        .first()
    )

    course = (
        db.query(Course)
        .filter(Course.id == assessment.course_id)
        .first()
    )

    buffer = io.BytesIO()

    page = landscape(A4)

    pdf = canvas.Canvas(buffer, pagesize=page)

    width, height = page

    indigo = HexColor("#4f46e5")
    slate = HexColor("#334155")

    pdf.setStrokeColor(indigo)
    pdf.setLineWidth(6)
    pdf.rect(
        1 * cm, 1 * cm,
        width - 2 * cm, height - 2 * cm
    )

    pdf.setFont("Helvetica-Bold", 34)
    pdf.setFillColor(indigo)
    pdf.drawCentredString(
        width / 2, height - 4 * cm,
        "LearnSphere"
    )

    pdf.setFont("Helvetica", 18)
    pdf.setFillColor(slate)
    pdf.drawCentredString(
        width / 2, height - 5.3 * cm,
        "Certificate of Completion"
    )

    pdf.setFont("Helvetica", 14)
    pdf.drawCentredString(
        width / 2, height - 7.5 * cm,
        "This certifies that"
    )

    pdf.setFont("Helvetica-Bold", 26)
    pdf.setFillColor(indigo)
    pdf.drawCentredString(
        width / 2, height - 9 * cm,
        current_user.name
    )

    pdf.setFont("Helvetica", 14)
    pdf.setFillColor(slate)
    pdf.drawCentredString(
        width / 2, height - 10.5 * cm,
        "has successfully completed the course"
    )

    pdf.setFont("Helvetica-Bold", 20)
    pdf.drawCentredString(
        width / 2, height - 12 * cm,
        course.title if course else assessment.title
    )

    pdf.setFont("Helvetica", 12)
    pdf.drawCentredString(
        width / 2, height - 14 * cm,
        f"Score: {result.percentage}%  |  Issued on {date.today().strftime('%B %d, %Y')}"
    )

    pdf.showPage()
    pdf.save()

    buffer.seek(0)

    return buffer
