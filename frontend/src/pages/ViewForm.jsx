import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  getFormById,
  getFormGuests,
  addGuestsToForm,
  deleteForm,
} from "../lib/api.js";
import toast from "react-hot-toast";
import {
  Eye,
  Users,
  Plus,
  Copy,
  CheckCircle,
  XCircle,
  Calendar,
  ClipboardList,
  Trash2,
  Mail,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const ViewForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showAddGuest, setShowAddGuest] = useState(false);
  const [guestData, setGuestData] = useState({
    guestName: "",
    guestEmail: "",
    expiresInDays: "",
  });

  const { data: formData, isLoading: formLoading } = useQuery({
    queryKey: ["form", id],
    queryFn: () => getFormById(id),
  });

  const { data: guestsData, isLoading: guestsLoading } = useQuery({
    queryKey: ["formGuests", id],
    queryFn: () => getFormGuests(id),
  });

  const addGuestMutation = useMutation({
    mutationFn: addGuestsToForm,
    onSuccess: (data) => {
      toast.success("Guest added successfully!");
      queryClient.invalidateQueries(["formGuests", id]);
      setShowAddGuest(false);
      setGuestData({ guestName: "", guestEmail: "", expiresInDays: "" });
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || error.message || "Failed to add guest";
      toast.error(errorMessage);
      console.error("Add guest error:", error);
    },
  });

  const deleteFormMutation = useMutation({
    mutationFn: deleteForm,
    onSuccess: () => {
      toast.success("Form deleted successfully!");
      queryClient.invalidateQueries(["forms"]);
      navigate("/dashboard");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to delete form");
    },
  });

  const handleAddGuest = (e) => {
    e.preventDefault();

    if (!guestData.guestName || !guestData.guestEmail) {
      toast.error("Name and email are required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(guestData.guestEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (guestData.expiresInDays && parseInt(guestData.expiresInDays) < 1) {
      toast.error("Expiry days must be at least 1");
      return;
    }

    addGuestMutation.mutate({
      formId: id,
      guestName: guestData.guestName,
      guestEmail: guestData.guestEmail,
      expiresInDays: guestData.expiresInDays
        ? parseInt(guestData.expiresInDays)
        : null,
    });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success("Link copied to clipboard!");
  };

  const handleDeleteForm = () => {
    if (
      window.confirm(
        "Are you sure you want to delete this form? This action cannot be undone."
      )
    ) {
      deleteFormMutation.mutate(id);
    }
  };

  if (formLoading || guestsLoading) {
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

  const form = formData?.form;
  const guests = guestsData?.guests || [];

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-7xl">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-4xl font-bold text-white mb-2">
                  {form?.title}
                </h1>
                {form?.description && (
                  <p className="text-white/60">{form.description}</p>
                )}
                <div className="flex items-center gap-4 mt-3 text-sm text-white/60">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>
                      Created {new Date(form?.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="px-2 py-1 bg-white/10 rounded-lg text-xs">
                    {form?.fields?.length} fields
                  </div>
                </div>
              </div>

              <div className="flex gap-2">
                <Link to={`/forms/${id}/responses`}>
                  <button className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition flex items-center gap-2 shadow-lg shadow-white/10">
                    <ClipboardList className="w-5 h-5" />
                    View Responses
                  </button>
                </Link>
                <button
                  onClick={handleDeleteForm}
                  className="bg-red-500/20 border border-red-500/30 text-red-300 px-6 py-3 rounded-xl font-semibold hover:bg-red-500/30 transition flex items-center gap-2"
                  disabled={deleteFormMutation.isPending}
                >
                  <Trash2 className="w-5 h-5" />
                  Delete
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div className="text-white/60 text-sm mb-2">Total Guests</div>
                <div className="text-4xl font-bold text-white">
                  {guestsData?.totalGuests || 0}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
                <div className="text-white/60 text-sm mb-2">Submitted</div>
                <div className="text-4xl font-bold text-green-500">
                  {guestsData?.submittedCount || 0}
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <XCircle className="w-8 h-8 text-yellow-500" />
                </div>
                <div className="text-white/60 text-sm mb-2">Pending</div>
                <div className="text-4xl font-bold text-yellow-500">
                  {guestsData?.pendingCount || 0}
                </div>
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg mb-8">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Form Fields
              </h2>
              <div className="space-y-3">
                {form?.fields?.map((field, index) => (
                  <div
                    key={index}
                    className="bg-white/5 border border-white/10 p-4 rounded-xl"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">
                        {field.label}
                      </span>
                      <span className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80">
                        {field.type}
                      </span>
                      {field.required && (
                        <span className="px-2 py-1 bg-red-500/20 border border-red-500/30 rounded-lg text-xs text-red-300">
                          Required
                        </span>
                      )}
                    </div>
                    {field.options && (
                      <p className="text-sm text-white/60">
                        Options: {field.options.join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                  <Users className="w-6 h-6" />
                  Guests & Links
                </h2>
                <button
                  onClick={() => setShowAddGuest(!showAddGuest)}
                  className="bg-white text-black px-4 py-2 rounded-xl font-semibold hover:bg-white/90 transition flex items-center gap-2 text-sm shadow-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Guest
                </button>
              </div>

              {showAddGuest && (
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-4">
                  <form onSubmit={handleAddGuest} className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="block mb-2">
                          <span className="text-white/80 text-sm">Name</span>
                        </label>
                        <input
                          type="text"
                          placeholder="Guest Name"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition text-sm"
                          value={guestData.guestName}
                          onChange={(e) =>
                            setGuestData({
                              ...guestData,
                              guestName: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block mb-2">
                          <span className="text-white/80 text-sm">Email</span>
                        </label>
                        <input
                          type="email"
                          placeholder="guest@example.com"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition text-sm"
                          value={guestData.guestEmail}
                          onChange={(e) =>
                            setGuestData({
                              ...guestData,
                              guestEmail: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div>
                        <label className="block mb-2">
                          <span className="text-white/80 text-sm">
                            Expires In (Days)
                          </span>
                        </label>
                        <input
                          type="number"
                          placeholder="Optional"
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition text-sm"
                          value={guestData.expiresInDays}
                          onChange={(e) =>
                            setGuestData({
                              ...guestData,
                              expiresInDays: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        type="submit"
                        className="bg-white text-black px-4 py-2 rounded-lg font-semibold hover:bg-white/90 transition text-sm"
                        disabled={addGuestMutation.isPending}
                      >
                        {addGuestMutation.isPending ? "Adding..." : "Add Guest"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowAddGuest(false)}
                        className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {guests.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 mx-auto text-white/30 mb-4" />
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    No guests yet
                  </h3>
                  <p className="text-white/60 mb-4">
                    Add guests to generate form links
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left p-3 text-white/80 font-semibold">
                          Guest
                        </th>
                        <th className="text-left p-3 text-white/80 font-semibold">
                          Status
                        </th>
                        <th className="text-left p-3 text-white/80 font-semibold">
                          Created
                        </th>
                        <th className="text-left p-3 text-white/80 font-semibold">
                          Expires
                        </th>
                        <th className="text-left p-3 text-white/80 font-semibold">
                          Link
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {guests.map((guest) => (
                        <tr
                          key={guest.id}
                          className="border-b border-white/10 hover:bg-white/5 transition"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-white/60" />
                              <div>
                                <div className="font-semibold text-white">
                                  {guest.guest.name}
                                </div>
                                <div className="text-sm text-white/60">
                                  {guest.guest.email}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            {guest.isSubmitted ? (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-xs">
                                <CheckCircle className="w-3 h-3" />
                                Submitted
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-lg text-yellow-300 text-xs">
                                <XCircle className="w-3 h-3" />
                                Pending
                              </span>
                            )}
                          </td>
                          <td className="p-3 text-sm text-white/80">
                            {new Date(guest.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm text-white/80">
                            {guest.expiresAt
                              ? new Date(guest.expiresAt).toLocaleDateString()
                              : "Never"}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() =>
                                copyToClipboard(
                                  `${window.location.origin}/form/${guest.token}`
                                )
                              }
                              className="inline-flex items-center gap-1 px-3 py-1 bg-white/10 text-white rounded-lg hover:bg-white/20 transition text-xs"
                              disabled={guest.isSubmitted}
                            >
                              <Copy className="w-3 h-3" />
                              Copy Link
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ViewForm;
