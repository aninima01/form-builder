import express from "express";
import {
  createGuest,
  getAllGuests,
  getGuestById,
  updateGuest,
  deleteGuest,
  assignGuestToForm,
  getFormGuests,
} from "../controllers/guest.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// All guest routes are admin-protected
router.post("/guests", protectRoute, createGuest);
router.get("/guests", protectRoute, getAllGuests);
router.get("/guests/:id", protectRoute, getGuestById);
router.put("/guests/:id", protectRoute, updateGuest);
router.delete("/guests/:id", protectRoute, deleteGuest);

// Form-Guest assignment
router.post("/forms/:formId/guests", protectRoute, assignGuestToForm);
router.get("/forms/:formId/guests", protectRoute, getFormGuests);

export default router;
