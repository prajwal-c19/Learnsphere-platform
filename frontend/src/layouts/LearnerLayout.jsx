import Sidebar from "../components/common/Sidebar";
import TopNavbar from "../components/common/TopNavbar";

function LearnerLayout({ children }) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopNavbar />

        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

export default LearnerLayout;
