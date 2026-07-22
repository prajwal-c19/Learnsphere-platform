"""Add video_type to lessons

Revision ID: 55850e6df37c
Revises: f3a9fefae7d0
Create Date: 2026-07-17 11:54:42.252744

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers
revision: str = "55850e6df37c"
down_revision: Union[str, Sequence[str], None] = "f3a9fefae7d0"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:

    op.add_column(
        "lessons",
        sa.Column(
            "video_type",
            sa.String(length=20),
            nullable=False,
            server_default="youtube",
        ),
    )


def downgrade() -> None:

    op.drop_column(
        "lessons",
        "video_type",
    )