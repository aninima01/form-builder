import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { getFormByToken, submitFormResponse } from "../lib/api";
import toast from "react-hot-toast";
import {
  CheckCircle,
  AlertCircle,
  Send,
  User,
  ClipboardList,
} from "lucide-react";

const GuestForm = () => {
  const { token } = useParams();
  const [formResponses, setFormResponses] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["guestForm", token],
    queryFn: () => getFormByToken(token),
    retry: false,
  });

  const submitMutation = useMutation({
    mutationFn: submitFormResponse,
    onSuccess: () => {
      setIsSubmitted(true);
      toast.success("Form submitted successfully!");
    },
    onError: (error) => {
      toast.error(error.response?.data?.error || "Failed to submit form");
    },
  });

  const handleInputChange = (fieldName, value) => {
    setFormResponses({
      ...formResponses,
      [fieldName]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const missingFields = data.form.fields
      .filter((field) => field.required)
      .filter(
        (field) =>
          !formResponses[field.name] ||
          formResponses[field.name] === "" ||
          (Array.isArray(formResponses[field.name]) &&
            formResponses[field.name].length === 0)
      );

    if (missingFields.length > 0) {
      toast.error(
        `Please fill all required fields: ${missingFields
          .map((f) => f.label)
          .join(", ")}`
      );
      return;
    }

    submitMutation.mutate({
      formId: data.form.id,
      token: token,
      responses: formResponses,
    });
  };

  const renderField = (field) => {
    const value = formResponses[field.name] || "";

    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case "textarea":
        return (
          <textarea
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition h-32 resize-none"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case "number":
        return (
          <input
            type="number"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case "date":
        return (
          <input
            type="date"
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/40 transition"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          />
        );

      case "dropdown":
        return (
          <select
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 transition"
            value={value}
            onChange={(e) => handleInputChange(field.name, e.target.value)}
            required={field.required}
          >
            <option value="" className="bg-black">
              Select an option
            </option>
            {field.options?.map((option, index) => (
              <option key={index} value={option} className="bg-black">
                {option}
              </option>
            ))}
          </select>
        );

      case "multiselect":
        return (
          <div className="space-y-2">
            {field.options?.map((option, index) => (
              <label
                key={index}
                className="flex items-center gap-2 cursor-pointer text-white"
              >
                <input
                  type="checkbox"
                  className="w-5 h-5 rounded border-white/20 bg-white/10 checked:bg-white checked:border-white"
                  checked={(value || []).includes(option)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v) => v !== option);
                    handleInputChange(field.name, newValues);
                  }}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white/60">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg max-w-md w-full p-6">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-white mb-2">Invalid Link</h2>
            <p className="text-white/60">
              {error.response?.data?.error ||
                "This form link is invalid or has expired."}
            </p>
            {error.response?.data?.submittedAt && (
              <p className="text-sm text-white/60 mt-2">
                Already submitted on{" "}
                {new Date(error.response.data.submittedAt).toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black p-4">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg max-w-md w-full p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mb-4 mx-auto" />
            <h2 className="text-2xl font-bold text-white mb-2">Thank You!</h2>
            <p className="text-white/60 mb-4">
              Your response has been submitted successfully.
            </p>
            <div className="bg-white/5 border border-white/10 rounded-xl p-4">
              <p className="text-sm font-semibold text-white">
                Form: {data.form.title}
              </p>
              <p className="text-xs text-white/60 mt-1">
                Submitted by: {data.guest.name}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <ClipboardList className="w-8 h-8 text-white" />
            <div>
              <h1 className="text-3xl font-bold text-white">
                {data.form.title}
              </h1>
              {data.form.description && (
                <p className="text-white/60 mt-1">{data.form.description}</p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm bg-white/5 border border-white/10 p-3 rounded-xl">
            <User className="w-4 h-4 text-white" />
            <span className="font-semibold text-white">{data.guest.name}</span>
            <span className="text-white/60">({data.guest.email})</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {data.form.fields.map((field) => (
            <div
              key={field.name}
              className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6"
            >
              <label className="block">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-lg font-semibold text-white">
                    {field.label}
                    {field.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </span>
                  <span className="px-2 py-1 bg-white/10 rounded-lg text-xs text-white/80">
                    {field.type}
                  </span>
                </div>
                {renderField(field)}
                {field.required && (
                  <p className="text-red-400 text-xs mt-2">
                    This field is required
                  </p>
                )}
              </label>
            </div>
          ))}

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-lg p-6">
            <button
              type="submit"
              className="w-full bg-white text-black px-6 py-3 rounded-xl font-semibold hover:bg-white/90 transition flex items-center justify-center gap-2 shadow-lg"
              disabled={submitMutation.isPending}
            >
              {submitMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  Submit Form
                </>
              )}
            </button>

            <p className="text-center text-sm text-white/60 mt-4">
              Please review your responses before submitting. You can only
              submit this form once.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestForm;
