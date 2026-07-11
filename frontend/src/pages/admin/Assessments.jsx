import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";

import AdminLayout from "../../layouts/AdminLayout";

import AssessmentForm from "../../components/admin/AssessmentForm";
import AssessmentTable from "../../components/admin/AssessmentTable";

import { getCourses } from "../../services/courseService";

import {
    getAllAssessments,
    createAssessment,
    updateAssessment,
    deleteAssessment
} from "../../services/assessmentService";

function Assessments() {

    const [assessments, setAssessments] = useState([]);

    const [courses, setCourses] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [openForm, setOpenForm] = useState(false);

    const [editingAssessment, setEditingAssessment] = useState(null);

    useEffect(() => {

        loadData();

    }, []);

    const loadData = async () => {

        try {

            const assessmentResponse =
                await getAllAssessments();

            const courseResponse =
                await getCourses();

            setAssessments(
                assessmentResponse
            );

            setCourses(
                courseResponse
            );

        }

        catch (error) {

            console.error(error);

            alert("Failed to load assessments.");

        }

        finally {

            setLoading(false);

        }

    };

    const filteredAssessments = useMemo(() => {

        return assessments.filter((assessment) =>

            assessment.title
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [assessments, search]);

    const handleCreate = () => {

        setEditingAssessment(null);

        setOpenForm(true);

    };

    const handleEdit = (assessment) => {

        setEditingAssessment(
            assessment
        );

        setOpenForm(true);

    };

    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(

            "Delete this assessment?"

        );

        if (!confirmDelete) return;

        try {

            await deleteAssessment(id);

            loadData();

        }

        catch (error) {

            console.error(error);

            alert("Failed to delete assessment.");

        }

    };

    const handleSubmit = async (
        assessmentData
    ) => {

        try {

            if (editingAssessment) {

                await updateAssessment(

                    editingAssessment.id,

                    assessmentData

                );

            }

            else {

                await createAssessment(
                    assessmentData
                );

            }

            setOpenForm(false);

            setEditingAssessment(null);

            loadData();

        }

        catch (error) {

            console.error(error);

            alert("Operation failed.");

        }

    };

    

    return (

        <AdminLayout>

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold">

                        Assessment Management

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Total Assessments : {assessments.length}

                    </p>

                </div>

                <button
                    onClick={handleCreate}
                    className="bg-indigo-600 text-white px-6 py-3 rounded-xl flex items-center gap-2 hover:bg-indigo-700"
                >

                    <Plus size={20} />

                    Add Assessment

                </button>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

                <div className="flex items-center gap-3">

                    <Search
                        size={20}
                        className="text-slate-500"
                    />

                    <input
                        type="text"
                        placeholder="Search assessment..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                        className="w-full outline-none"
                    />

                </div>

            </div>

            {

                loading

                    ?

                    (

                        <div className="text-center text-2xl">

                            Loading Assessments...

                        </div>

                    )

                    :

                    (

                        <AssessmentTable

                            assessments={
                                filteredAssessments
                            }

                            courses={courses}

                            onEdit={
                                handleEdit
                            }

                            onDelete={
                                handleDelete
                            }

                            

                        />

                    )

            }

            <AssessmentForm

                open={openForm}

                onClose={() => {

                    setOpenForm(false);

                    setEditingAssessment(null);

                }}

                onSubmit={handleSubmit}

                editingAssessment={
                    editingAssessment
                }

                courses={courses}

            />

        </AdminLayout>

    );

}

export default Assessments;
