# 🎓 LearnSphere - Learning Experience Platform (LXP)

LearnSphere is a full-stack Learning Experience Platform (LXP) that enables learners to enroll in courses, track learning progress, complete assessments, and earn certificates, while providing administrators with a comprehensive dashboard to manage users, courses, lessons, assessments, and questions.

---

## 🚀 Features

### 👨‍🎓 Learner Module

- User Registration & Login
- JWT Authentication
- Browse Available Courses
- Enroll in Courses
- My Courses Dashboard
- Continue Learning
- Track Course Progress
- Lesson-based Learning
- Assessment Unlock Based on Progress
- Take Assessments
- Instant Result Evaluation
- Download Course Certificate
- Personalized Dashboard
- Recent Learning Activity
- Protected Routes

---

### 👨‍💼 Admin Module

- Secure Admin Login
- Dashboard Analytics
- User Management
- Course Management (CRUD)
- Lesson Management (CRUD)
- Assessment Management (CRUD)
- Question Management (CRUD)
- View Platform Statistics

---

## 🛠️ Tech Stack

### Frontend

- React.js
- React Router DOM
- Tailwind CSS
- Axios
- Lucide React Icons

### Backend

- FastAPI
- SQLAlchemy ORM
- Pydantic
- JWT Authentication
- Passlib (Password Hashing)

### Database

- PostgreSQL
- SQLite (Development)

---

## 📂 Project Structure

```
learnsphere/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── database/
│   │   ├── dependencies/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── main.py
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
└── README.md
```

---

# 📊 Database Modules

- Users
- Courses
- Lessons
- Lesson Progress
- Enrollments
- Assessments
- Questions
- Results

---

# 🔐 Authentication

LearnSphere uses JSON Web Token (JWT) based authentication.

Features include:

- Secure Login
- Password Hashing
- Protected API Routes
- Role-Based Authorization
- Admin Access Control

---

# 📚 Learning Workflow

```
Register/Login
        │
        ▼
Browse Courses
        │
        ▼
Enroll in Course
        │
        ▼
Learn Through Lessons
        │
        ▼
Track Progress
        │
        ▼
Assessment Unlock
        │
        ▼
Take Assessment
        │
        ▼
View Result
        │
        ▼
Download Certificate
```

---

# 👨‍💼 Admin Workflow

```
Admin Login
      │
      ▼
Dashboard
      │
      ├── Users
      ├── Courses
      ├── Lessons
      ├── Assessments
      └── Questions
```

---

# 📸 Screenshots

## Learner

- Login
- Dashboard
- Courses
- My Courses
- Learning Page
- Assessment
- Result
- Certificate

## Admin

- Dashboard
- Users
- Courses
- Lessons
- Assessments
- Questions

*(Add screenshots after deployment.)*

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/learnsphere.git

cd learnsphere
```

---

## Backend Setup

```bash
cd backend

python -m venv venv
```

Activate Virtual Environment

### Windows

```bash
venv\Scripts\activate
```

### Linux / macOS

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

Swagger API

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# 🔑 Default Admin Credentials

```
Email:
admin@learnsphere.com

Password:
Admin@123
```

---

# 📈 Future Enhancements

- Global Course Search
- Email Notifications
- Discussion Forum
- Live Classes
- Assignment Submission
- Certificate Verification
- Learning Analytics
- Dark Mode
- Mobile Responsive Improvements
- AI-Based Course Recommendation

---

# 🎯 Key Features

- Full Stack Learning Management System
- JWT Authentication
- Role-Based Authorization
- Course & Lesson Management
- Progress Tracking
- Quiz & Assessment Engine
- Automatic Result Evaluation
- Certificate Generation
- Responsive User Interface
- RESTful API Architecture

---

# 👨‍💻 Author

**Prajwala c**

Artificial Intelligence & Machine Learning Student

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.