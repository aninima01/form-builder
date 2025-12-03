import mongoose from "mongoose";
import crypto from "crypto";

const formGuestSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest",
    required: true,
  },
  token: {
    type: String,
    unique: true,
    required: true,
    index: true,
  },
  isSubmitted: { type: Boolean, default: false },
  submittedAt: Date,
  createdAt: { type: Date, default: Date.now },
  expiresAt: Date,
});

formGuestSchema.index({ formId: 1, guestId: 1 }, { unique: true });

formGuestSchema.pre("save", function (next) {
  if (!this.token) {
    this.token = crypto.randomBytes(32).toString("hex");
  }
});

formGuestSchema.methods.isTokenValid = function () {
  if (this.isSubmitted) return false;
  if (this.expiresAt && this.expiresAt < new Date()) return false;
  return true;
};

const FormGuest = mongoose.model("FormGuest", formGuestSchema);
export default FormGuest;
