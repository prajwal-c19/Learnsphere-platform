import os
from pathlib import Path

from PIL import (
    Image,
    ImageDraw,
    ImageFont
)


# ==========================================================
# Upload Folder
# ==========================================================

THUMBNAIL_FOLDER = "uploads/thumbnails"

Path(
    THUMBNAIL_FOLDER
).mkdir(
    parents=True,
    exist_ok=True
)


# ==========================================================
# Category Colors
# ==========================================================

CATEGORY_COLORS = {

    "Programming": (52, 152, 219),

    "Python": (41, 128, 185),

    "AI": (142, 68, 173),

    "Machine Learning": (155, 89, 182),

    "Data Science": (39, 174, 96),

    "Cloud": (52, 73, 94),

    "Cyber Security": (44, 62, 80),

}


# ==========================================================
# Generate Thumbnail
# ==========================================================

def generate_thumbnail(

    title: str,

    category: str

):

    width = 1280

    height = 720

    background = CATEGORY_COLORS.get(

        category,

        (33, 37, 41)

    )

    image = Image.new(

        "RGB",

        (width, height),

        background

    )

    draw = ImageDraw.Draw(image)

    try:

        title_font = ImageFont.truetype(

            "arial.ttf",

            64

        )

        subtitle_font = ImageFont.truetype(

            "arial.ttf",

            34

        )

    except:

        title_font = ImageFont.load_default()

        subtitle_font = ImageFont.load_default()

    # Course Title

    draw.text(

        (80, 180),

        title,

        fill="white",

        font=title_font

    )

    # Category

    draw.text(

        (80, 290),

        category,

        fill=(230, 230, 230),

        font=subtitle_font

    )

    # Branding

    draw.text(

        (80, 620),

        "LearnSphere",

        fill="white",

        font=subtitle_font

    )

    filename = (

        title

        .replace(" ", "_")

        .lower()

        + ".png"

    )

    filepath = os.path.join(

        THUMBNAIL_FOLDER,

        filename

    )

    image.save(filepath)

    return {

        "thumbnail_url":

            f"/uploads/thumbnails/{filename}"

    }