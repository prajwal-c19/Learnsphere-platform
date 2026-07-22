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

    response = model.generate_content(prompt)

    return response.text.strip()