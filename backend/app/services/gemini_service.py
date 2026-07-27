import os

import google.generativeai as genai

from dotenv import load_dotenv

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-3.5-flash"
)

from fastapi import HTTPException

def generate_course_description(course_name: str):

    prompt = f"""
You are an expert course creator.

Generate a professional course description
for the following course.

Course Name:
{course_name}

Requirements:
- Around 120-150 words.
- Professional tone.
- Mention what students will learn.
- Mention practical skills.
- Do not use markdown.
- Return only the description.
"""

    try:

        response = model.generate_content(prompt)

        return response.text.strip()

    except Exception as e:

        error = str(e)

        if (
            "RESOURCE_EXHAUSTED" in error
            or "quota" in error.lower()
            or "429" in error
        ):

            raise HTTPException(
                status_code=429,
                detail=(
                    "AI description generation is temporarily unavailable because "
                    "the free Gemini quota has been reached. Please try again later."
                )
            )

        raise HTTPException(
            status_code=500,
            detail=f"Gemini Error: {error}"
        )