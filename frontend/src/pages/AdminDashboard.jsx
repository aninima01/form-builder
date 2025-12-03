import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { getAllForms } from "../lib/api.js";
import {
  ClipboardList,
  Users,
  Eye,
  Plus,
  Calendar,
  Trash2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const AdminDashboard = () => {
  const {
    data: forms,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["forms"],
    queryFn: getAllForms,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen bg-black">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-black">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar />
          <div className="flex-1 flex items-center justify-center">
            <div className="bg-red-500/10 backdrop-blur-xl border border-red-500/20 rounded-2xl p-6 max-w-md text-white">
              <span>Error loading forms: {error.message}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-white/60 mt-2">
                  Manage your forms and view responses
                </p>
              </div>

              <Link to="/forms/create">
                <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition flex items-center gap-2 shadow-lg shadow-white/10">
                  <Plus className="w-5 h-5" />
                  Create New Form
                </button>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <div className="text-white/60 text-sm mb-2">Total Forms</div>
                <div className="text-4xl font-bold text-white">
                  {forms?.length || 0}
                </div>
                <div className="text-white/40 text-xs mt-2">
                  All created forms
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2 text-white">
                <ClipboardList className="w-6 h-6" />
                Your Forms
              </h2>

              {!forms || forms.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-16 h-16 mx-auto text-white/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    No forms yet
                  </h3>
                  <p className="text-white/60 mb-4">
                    Create your first form to get started
                  </p>
                  <Link to="/forms/create">
                    <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition shadow-lg">
                      Create Form
                    </button>
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {forms.map((form) => (
                    <div
                      key={form._id}
                      className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-5 hover:bg-white/10 transition-all shadow-lg group"
                    >
                      <h3 className="text-lg font-bold line-clamp-1 text-white mb-2">
                        {form.title}
                      </h3>

                      {form.description && (
                        <p className="text-sm text-white/60 line-clamp-2 mb-3">
                          {form.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 text-sm text-white/60 mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {new Date(form.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="px-2 py-1 bg-white/10 rounded-lg text-xs">
                          {form.fields?.length || 0} fields
                        </div>
                      </div>

                      <div className="flex justify-end gap-2">
                        <Link to={`/forms/${form._id}`}>
                          <button className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition flex items-center gap-1 text-sm">
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </Link>

                        <Link to={`/forms/${form._id}/responses`}>
                          <button className="px-4 py-2 bg-white text-black rounded-lg hover:bg-white/90 transition flex items-center gap-1 text-sm font-semibold">
                            <ClipboardList className="w-4 h-4" />
                            Responses
                          </button>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
