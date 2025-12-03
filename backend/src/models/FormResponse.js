import mongoose from "mongoose";

const formResponseSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Form",
    required: true,
  },
  formGuestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "FormGuest",
    required: true,
  },
  guestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Guest",
    required: true,
  },
  responses: {
    type: Map,
    of: mongoose.Schema.Types.Mixed,
    required: true,
  },
  submittedAt: { type: Date, default: Date.now },
});

formResponseSchema.index({ formGuestId: 1 }, { unique: true });

const FormResponse = mongoose.model("FormResponse", formResponseSchema);
export default FormResponse;
