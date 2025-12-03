import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { getFormResponses } from "../lib/api";
import {
  ClipboardList,
  User,
  Calendar,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Download,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ResponsePage = () => {
  const { id } = useParams();
  const [expandedResponses, setExpandedResponses] = useState(new Set());

  const { data, isLoading, error } = useQuery({
    queryKey: ["formResponses", id],
    queryFn: () => getFormResponses(id),
  });

  const toggleExpanded = (responseId) => {
    setExpandedResponses((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(responseId)) {
        newSet.delete(responseId);
      } else {
        newSet.add(responseId);
      }
      return newSet;
    });
  };

  const exportToCSV = () => {
    if (!data?.responses || data.responses.length === 0) return;

    const form = data.form;
    const responses = data.responses;

    const headers = [
      "Submission Date",
      "Guest Name",
      "Guest Email",
      ...form.fields.map((field) => field.label),
    ];

    const rows = responses.map((response) => {
      const row = [
        new Date(response.submittedAt).toLocaleString(),
        response.guest.name,
        response.guest.email,
      ];

      form.fields.forEach((field) => {
        const value = response.responses[field.name];
        if (Array.isArray(value)) {
          row.push(value.join("; "));
        } else if (value !== undefined && value !== null) {
          row.push(value.toString());
        } else {
          row.push("");
        }
      });

      return row;
    });

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${form.title}_responses.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
              <span>Error loading responses: {error.message}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const form = data?.form;
  const responses = data?.responses || [];

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-7xl">
            {/* Header */}
            <div className="mb-8">
              <Link
                to={`/forms/${id}`}
                className="inline-flex items-center gap-2 text-white/60 hover:text-white transition mb-4"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Form
              </Link>

              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-4xl font-bold text-white mb-2">
                    Form Responses
                  </h1>
                  <p className="text-white/60 text-lg">{form?.title}</p>
                  {form?.description && (
                    <p className="text-white/60 text-sm mt-1">
                      {form.description}
                    </p>
                  )}
                </div>

                {responses.length > 0 && (
                  <button
                    onClick={exportToCSV}
                    className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition flex items-center gap-2 shadow-lg shadow-white/10"
                  >
                    <Download className="w-5 h-5" />
                    Export CSV
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <ClipboardList className="w-8 h-8 text-white" />
                </div>
                <div className="text-white/60 text-sm mb-2">
                  Total Responses
                </div>
                <div className="text-4xl font-bold text-white">
                  {data?.totalResponses || 0}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Calendar className="w-8 h-8 text-white" />
                </div>
                <div className="text-white/60 text-sm mb-2">Form Fields</div>
                <div className="text-4xl font-bold text-white">
                  {form?.fields?.length || 0}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <User className="w-8 h-8 text-white" />
                </div>
                <div className="text-white/60 text-sm mb-2">
                  Unique Respondents
                </div>
                <div className="text-4xl font-bold text-white">
                  {responses.length}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold mb-6 text-white">
                All Submissions
              </h2>

              {responses.length === 0 ? (
                <div className="text-center py-12">
                  <ClipboardList className="w-16 h-16 mx-auto text-white/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    No responses yet
                  </h3>
                  <p className="text-white/60">
                    Responses will appear here once guests submit the form
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {responses.map((response) => {
                    const isExpanded = expandedResponses.has(response.id);

                    return (
                      <div
                        key={response.id}
                        className="bg-white/5 border border-white/10 rounded-xl overflow-hidden"
                      >
                        <div
                          className="p-4 flex items-center justify-between cursor-pointer hover:bg-white/10 transition-colors"
                          onClick={() => toggleExpanded(response.id)}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold text-xl">
                              {response.guest.name.charAt(0).toUpperCase()}
                            </div>

                            <div>
                              <div className="font-semibold text-lg text-white">
                                {response.guest.name}
                              </div>
                              <div className="text-sm text-white/60">
                                {response.guest.email}
                              </div>
                              <div className="flex items-center gap-1 text-xs text-white/60 mt-1">
                                <Calendar className="w-3 h-3" />
                                Submitted{" "}
                                {new Date(
                                  response.submittedAt
                                ).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          <button className="p-2 hover:bg-white/10 rounded-lg transition">
                            {isExpanded ? (
                              <ChevronUp className="w-5 h-5 text-white" />
                            ) : (
                              <ChevronDown className="w-5 h-5 text-white" />
                            )}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="border-t border-white/10 p-4 bg-white/5">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {form.fields.map((field) => {
                                const value = response.responses[field.name];
                                const displayValue = Array.isArray(value)
                                  ? value.join(", ")
                                  : value !== undefined && value !== null
                                  ? value.toString()
                                  : "No response";

                                return (
                                  <div
                                    key={field.name}
                                    className="bg-white/5 border border-white/10 p-3 rounded-xl"
                                  >
                                    <div className="flex items-center gap-2 mb-2">
                                      <span className="font-semibold text-sm text-white">
                                        {field.label}
                                      </span>
                                      <span className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80">
                                        {field.type}
                                      </span>
                                    </div>
                                    <div className="text-white/80">
                                      {displayValue}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ResponsePage;
