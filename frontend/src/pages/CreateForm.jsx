import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { createForm } from "../lib/api";
import toast from "react-hot-toast";
import { Plus, Trash2, GripVertical } from "lucide-react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "textarea", label: "Text Area" },
  { value: "number", label: "Number" },
  { value: "date", label: "Date" },
  { value: "dropdown", label: "Dropdown" },
  { value: "multiselect", label: "Multi-Select" },
];

const CreateForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    fields: [],
  });

  const [currentField, setCurrentField] = useState({
    name: "",
    label: "",
    type: "text",
    required: false,
    options: "",
  });

  const createFormMutation = useMutation({
    mutationFn: createForm,
    onSuccess: (data) => {
      toast.success("Form created successfully!");
      queryClient.invalidateQueries(["forms"]);
      navigate(`/forms/${data.form._id}`);
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to create form");
    },
  });

  const addField = () => {
    if (!currentField.name || !currentField.label) {
      toast.error("Field name and label are required");
      return;
    }

    if (formData.fields.some((f) => f.name === currentField.name)) {
      toast.error("Field name must be unique");
      return;
    }

    const newField = {
      name: currentField.name,
      label: currentField.label,
      type: currentField.type,
      required: currentField.required,
    };

    if (
      (currentField.type === "dropdown" ||
        currentField.type === "multiselect") &&
      currentField.options
    ) {
      newField.options = currentField.options
        .split(",")
        .map((opt) => opt.trim())
        .filter(Boolean);
    }

    setFormData({
      ...formData,
      fields: [...formData.fields, newField],
    });

    setCurrentField({
      name: "",
      label: "",
      type: "text",
      required: false,
      options: "",
    });

    toast.success("Field added!");
  };

  const removeField = (index) => {
    setFormData({
      ...formData,
      fields: formData.fields.filter((_, i) => i !== index),
    });
    toast.success("Field removed");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title) {
      toast.error("Form title is required");
      return;
    }

    if (formData.fields.length === 0) {
      toast.error("At least one field is required");
      return;
    }

    createFormMutation.mutate(formData);
  };

  const needsOptions = ["dropdown", "multiselect"].includes(currentField.type);

  return (
    <div className="flex h-screen bg-black">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="container mx-auto max-w-5xl">
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">
                Create New Form
              </h1>
              <p className="text-white/60">
                Build a dynamic form with custom fields
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                <h2 className="text-2xl font-bold text-white">Form Details</h2>

                <div>
                  <label className="block mb-2">
                    <span className="text-white/80 font-semibold">
                      Form Title <span className="text-red-500">*</span>
                    </span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Customer Feedback Form"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block mb-2">
                    <span className="text-white/80 font-semibold">
                      Description
                    </span>
                  </label>
                  <textarea
                    placeholder="Optional description for your form"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition h-24 resize-none"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                <h2 className="text-2xl font-bold text-white">Add Fields</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2">
                      <span className="text-white/80 font-semibold">
                        Field Name
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., fullName"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition"
                      value={currentField.name}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          name: e.target.value,
                        })
                      }
                    />
                    <p className="text-white/40 text-xs mt-1">
                      Unique identifier (no spaces)
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2">
                      <span className="text-white/80 font-semibold">
                        Field Label
                      </span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Full Name"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition"
                      value={currentField.label}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          label: e.target.value,
                        })
                      }
                    />
                    <p className="text-white/40 text-xs mt-1">
                      Display label for users
                    </p>
                  </div>

                  <div>
                    <label className="block mb-2">
                      <span className="text-white/80 font-semibold">
                        Field Type
                      </span>
                    </label>
                    <select
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition"
                      value={currentField.type}
                      onChange={(e) =>
                        setCurrentField({
                          ...currentField,
                          type: e.target.value,
                        })
                      }
                    >
                      {FIELD_TYPES.map((type) => (
                        <option
                          key={type.value}
                          value={type.value}
                          className="bg-black"
                        >
                          {type.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {needsOptions && (
                    <div>
                      <label className="block mb-2">
                        <span className="text-white/80 font-semibold">
                          Options
                        </span>
                      </label>
                      <input
                        type="text"
                        placeholder="Option1, Option2, Option3"
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition"
                        value={currentField.options}
                        onChange={(e) =>
                          setCurrentField({
                            ...currentField,
                            options: e.target.value,
                          })
                        }
                      />
                      <p className="text-white/40 text-xs mt-1">
                        Comma-separated values
                      </p>
                    </div>
                  )}

                  <div>
                    <label className="flex items-center gap-3 cursor-pointer mt-8">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-white/20 bg-white/10 checked:bg-white checked:border-white"
                        checked={currentField.required}
                        onChange={(e) =>
                          setCurrentField({
                            ...currentField,
                            required: e.target.checked,
                          })
                        }
                      />
                      <span className="text-white/80 font-semibold">
                        Required Field
                      </span>
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={addField}
                  className="bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition flex items-center gap-2 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Add Field
                </button>
              </div>

              {formData.fields.length > 0 && (
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg space-y-4">
                  <h2 className="text-2xl font-bold text-white">
                    Form Fields ({formData.fields.length})
                  </h2>

                  <div className="space-y-2">
                    {formData.fields.map((field, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white/5 border border-white/10 p-4 rounded-xl hover:bg-white/10 transition"
                      >
                        <GripVertical className="w-5 h-5 text-white/40" />
                        <div className="flex-1">
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
                          <p className="text-sm text-white/60">
                            Name: {field.name}
                            {field.options &&
                              ` • Options: ${field.options.join(", ")}`}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeField(index)}
                          className="p-2 hover:bg-red-500/20 rounded-lg transition text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/dashboard")}
                  className="px-6 py-3 bg-white/10 text-white rounded-xl hover:bg-white/20 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-white text-black rounded-xl hover:bg-white/90 transition font-semibold shadow-lg flex items-center gap-2"
                  disabled={createFormMutation.isPending}
                >
                  {createFormMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                      Creating...
                    </>
                  ) : (
                    "Create Form"
                  )}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
};

export default CreateForm;
