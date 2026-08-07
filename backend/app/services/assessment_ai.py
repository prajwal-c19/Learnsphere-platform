import json
import os

import google.generativeai as genai

from dotenv import load_dotenv
from fastapi import HTTPException

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)

model = genai.GenerativeModel(
    "gemini-3.5-flash"
)


def generate_questions(course, lessons, total_questions=10):

    lesson_content = ""

    for lesson in lessons:

        lesson_content += f"""

Lesson Title:
{lesson.title}

Lesson Description:
{lesson.description or ""}

"""

    prompt = f"""
You are an expert educator.

Generate EXACTLY {total_questions} multiple choice questions.

Course Title:
{course.title}

Course Description:
{course.description}

Lessons:
{lesson_content}

Rules:

- Generate exactly {total_questions} questions.
- Every question must have exactly four options.
- Only one option is correct.
- Correct answer must be only A, B, C or D.
- Do not repeat questions.
- Do not generate explanations.
- Return ONLY valid JSON.

Example:

[
  {{
    "question":"What is Python?",
    "option_a":"Programming Language",
    "option_b":"Database",
    "option_c":"Operating System",
    "option_d":"Browser",
    "correct_answer":"A"
  }}
]
"""

    try:

        response = model.generate_content(prompt)

        text = response.text.strip()

        if text.startswith("```json"):
            text = text.replace("```json", "").replace("```", "").strip()

        elif text.startswith("```"):
            text = text.replace("```", "").strip()

        return json.loads(text)

    except Exception as e:

        raise HTTPException(
            status_code=500,
            detail=f"Gemini Error: {str(e)}"
        )