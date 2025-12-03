import express from "express";
import {
  createForm,
  getAllForms,
  getFormById,
  updateForm,
  deleteForm,
  getFormByToken,
  submitFormResponse,
  getFormResponses,
} from "../controllers/form.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Admin routes (protected)
router.post("/forms", protectRoute, createForm);
router.get("/forms", protectRoute, getAllForms);
router.get("/forms/:id", protectRoute, getFormById);
router.put("/forms/:id", protectRoute, updateForm);
router.delete("/forms/:id", protectRoute, deleteForm);

// Admin - Get responses for a form
router.get("/forms/:formId/responses", protectRoute, getFormResponses);

// Guest routes (public - token-based)
router.get("/forms/token/:token", getFormByToken);
router.post("/forms/:formId/response", submitFormResponse);

export default router;
