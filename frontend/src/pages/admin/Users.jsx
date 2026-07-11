import { useEffect, useMemo, useState } from "react";
import { Search, Users } from "lucide-react";

import { getAllUsers } from "../../services/userService";

function AdminUsers() {

    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [error, setError] = useState("");

    useEffect(() => {

        fetchUsers();

    }, []);

    const fetchUsers = async () => {

        try {

            const response = await getAllUsers();

            setUsers(response);

        }

        catch (err) {

            console.error(err);

            setError("Failed to load users.");

        }

        finally {

            setLoading(false);

        }

    };

    const filteredUsers = useMemo(() => {

        return users.filter((user) =>

            user.name
                .toLowerCase()
                .includes(search.toLowerCase())

            ||

            user.email
                .toLowerCase()
                .includes(search.toLowerCase())

        );

    }, [users, search]);

    if (loading) {

        return (

            <div className="flex justify-center items-center min-h-screen text-2xl">

                Loading Users...

            </div>

        );

    }

    if (error) {

        return (

            <div className="flex justify-center items-center min-h-screen text-red-600 text-2xl">

                {error}

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-slate-100 p-8">

            <div className="flex justify-between items-center mb-8">

                <div>

                    <h1 className="text-4xl font-bold">

                        User Management

                    </h1>

                    <p className="text-slate-500 mt-2">

                        Total Users : {users.length}

                    </p>

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-md p-5 mb-8">

                <div className="flex items-center gap-3">

                    <Search
                        className="text-slate-500"
                        size={20}
                    />

                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={search}
                        onChange={(e) =>
                            setSearch(e.target.value)
                        }
                        className="w-full outline-none"
                    />

                </div>

            </div>

            <div className="bg-white rounded-2xl shadow-md overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-900 text-white">

                        <tr>

                            <th className="text-left px-6 py-4">

                                Name

                            </th>

                            <th className="text-left px-6 py-4">

                                Email

                            </th>

                            <th className="text-left px-6 py-4">

                                Role

                            </th>

                            <th className="text-left px-6 py-4">

                                Verified

                            </th>

                            <th className="text-left px-6 py-4">

                                Joined

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredUsers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="5"
                                        className="text-center py-10 text-slate-500"
                                    >

                                        No users found.

                                    </td>

                                </tr>

                            ) : (

                                filteredUsers.map((user) => (

                                    <tr
                                        key={user.id}
                                        className="border-b hover:bg-slate-50"
                                    >

                                        <td className="px-6 py-5 font-semibold">

                                            <div className="flex items-center gap-3">

                                                <div className="bg-indigo-100 p-2 rounded-full">

                                                    <Users
                                                        size={18}
                                                        className="text-indigo-600"
                                                    />

                                                </div>

                                                {user.name}

                                            </div>

                                        </td>

                                        <td className="px-6 py-5">

                                            {user.email}

                                        </td>

                                        <td className="px-6 py-5">

                                            {

                                                user.role === "admin"

                                                    ? (

                                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm">

                                                            Admin

                                                        </span>

                                                    )

                                                    : (

                                                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

                                                            Learner

                                                        </span>

                                                    )

                                            }

                                        </td>

                                        <td className="px-6 py-5">

                                            {

                                                user.is_verified

                                                    ? (

                                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">

                                                            Verified

                                                        </span>

                                                    )

                                                    : (

                                                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">

                                                            Pending

                                                        </span>

                                                    )

                                            }

                                        </td>

                                        <td className="px-6 py-5">

                                            {

                                                new Date(
                                                    user.created_at
                                                ).toLocaleDateString()

                                            }

                                        </td>

                                    </tr>

                                ))

                            )

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}

export default AdminUsers;
