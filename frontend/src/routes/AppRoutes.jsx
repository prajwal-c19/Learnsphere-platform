import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import Dashboard from "../pages/learner/Dashboard";
import Courses from "../pages/learner/Courses";
import MyCourses from "../pages/learner/MyCourses";
import CourseLessons from "../pages/learner/CourseLessons";
import Assessment from "../pages/learner/Assessment";
import Result from "../pages/learner/Result";

import AdminDashboard from "../pages/admin/Dashboard";
import Users from "../pages/admin/Users";
import AdminCourses from "../pages/admin/Courses";
import AdminAssessments from "../pages/admin/Assessments";
import QuestionManagement from "../pages/admin/QuestionManagement";
import LessonManagement from "../pages/admin/LessonManagement";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import AdminProtectedRoute from "../components/auth/AdminProtectedRoute";

import Assessments from "../pages/learner/Assessments";
import Results from "../pages/learner/Results";

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* ===========================
                    Learner Routes
                ============================ */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/courses"
                    element={
                        <ProtectedRoute>
                            <Courses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-courses"
                    element={
                        <ProtectedRoute>
                            <MyCourses />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/course/:courseId/lessons"
                    element={
                        <ProtectedRoute>
                            <CourseLessons />
                        </ProtectedRoute>
                    }
                />
               <Route
                    path="/assessments"
                    element={
                        <ProtectedRoute>
                            <Assessments />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/assessment/:courseId"
                    element={
                        <ProtectedRoute>
                            <Assessment />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/results"
                    element={
                        <ProtectedRoute>
                            <Results />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/result/:assessmentId"
                    element={
                        <ProtectedRoute>
                            <Result />
                        </ProtectedRoute>
                    }
                />

                {/* ===========================
                    Admin Routes
                ============================ */}

                <Route
                    path="/admin"
                    element={
                        <AdminProtectedRoute>
                            <AdminDashboard />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/users"
                    element={
                        <AdminProtectedRoute>
                            <Users />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/courses"
                    element={
                        <AdminProtectedRoute>
                            <AdminCourses />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/courses/:courseId/lessons"
                    element={
                        <AdminProtectedRoute>
                            <LessonManagement />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/assessments"
                    element={
                        <AdminProtectedRoute>
                            <AdminAssessments />
                        </AdminProtectedRoute>
                    }
                />

                <Route
                    path="/admin/assessments/:assessmentId/questions"
                    element={
                        <AdminProtectedRoute>
                            <QuestionManagement />
                        </AdminProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default AppRoutes;
