import { Navigate } from "react-router-dom";

function AdminProtectedRoute({

    children

}) {

    const token = localStorage.getItem(
        "token"
    );

    if (!token) {

        return <Navigate to="/" replace />;

    }

    try {

        const payload = JSON.parse(

            atob(
                token.split(".")[1]
            )

        );

        if (
            payload.role !== "admin"
        ) {

            return (
                <Navigate
                    to="/dashboard"
                    replace
                />
            );

        }

        return children;

    }

    catch (error) {

        console.error(error);

        localStorage.removeItem(
            "token"
        );

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }

}

export default AdminProtectedRoute;
