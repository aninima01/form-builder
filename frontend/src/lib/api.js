import { axiosInstance } from "./axios";

export const getAuthUser = async () => {
  try {
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  } catch (error) {
    console.log("Error in getAuthUser:", error);
    return null;
  }
};

export const signup = async (signupData) => {
  const response = await axiosInstance.post("/auth/signup", signupData);
  return response.data;
};

export const login = async (loginData) => {
  const response = await axiosInstance.post("/auth/login", loginData);
  return response.data;
};

export const logout = async () => {
  const response = await axiosInstance.post("/auth/logout");
  return response.data;
};

// forms apis

// Get all forms (Admin)
export const getAllForms = async () => {
  const response = await axiosInstance.get("/forms");
  return response.data.forms; // <-- extract array
};

// Get single form by ID (Admin)
export const getFormById = async (formId) => {
  const response = await axiosInstance.get(`/forms/${formId}`);
  return response.data;
};

// Create a new form (Admin)
export const createForm = async (formData) => {
  const response = await axiosInstance.post("/forms", formData);
  return response.data;
};

// Update form (Admin)
export const updateForm = async ({ formId, formData }) => {
  const response = await axiosInstance.put(`/forms/${formId}`, formData);
  return response.data;
};

// Delete form (Admin)
export const deleteForm = async (formId) => {
  const response = await axiosInstance.delete(`/forms/${formId}`);
  return response.data;
};

// guest apis

// Add guests to a form and generate tokens (Admin)
export const addGuestsToForm = async ({
  formId,
  guestName,
  guestEmail,
  expiresInDays,
}) => {
  const response = await axiosInstance.post(`/forms/${formId}/guests`, {
    guestName,
    guestEmail,
    expiresInDays,
  });
  return response.data;
};

// Get all guests for a form (Admin)
export const getFormGuests = async (formId) => {
  const response = await axiosInstance.get(`/forms/${formId}/guests`);
  return response.data;
};

// Get form by token (Guest)
export const getFormByToken = async (token) => {
  const response = await axiosInstance.get(`/forms/token/${token}`);
  return response.data;
};

// response apis

// Submit form response (Guest)
export const submitFormResponse = async ({ formId, token, responses }) => {
  const response = await axiosInstance.post(`/forms/${formId}/response`, {
    token,
    responses,
  });
  return response.data;
};

// Get all responses for a form (Admin)
export const getFormResponses = async (formId) => {
  const response = await axiosInstance.get(`/forms/${formId}/responses`);
  return response.data;
};

// Get single response by ID (Admin)
export const getResponseById = async ({ formId, responseId }) => {
  const response = await axiosInstance.get(
    `/forms/${formId}/responses/${responseId}`
  );
  return response.data;
};

// Delete response (Admin)
export const deleteResponse = async ({ formId, responseId }) => {
  const response = await axiosInstance.delete(
    `/forms/${formId}/responses/${responseId}`
  );
  return response.data;
};
