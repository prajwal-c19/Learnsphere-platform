import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopNavbar from "../components/admin/AdminTopNavbar";

function AdminLayout({ children }) {

    return (

        <div className="flex min-h-screen bg-slate-100">

            <AdminSidebar />

            <div className="flex-1 flex flex-col">

                <AdminTopNavbar />

                <main className="p-8">

                    {children}

                </main>

            </div>

        </div>

    );

}

export default AdminLayout;
