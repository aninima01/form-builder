import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true },
  label: { type: String, required: true },
  type: {
    type: String,
    enum: ["text", "textarea", "number", "dropdown", "date", "multiselect"],
    required: true,
  },
  required: { type: Boolean, default: false },
  options: [String],
  placeholder: String,
});

const formSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  fields: [fieldSchema],
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Form = mongoose.model("Form", formSchema);
export default Form;
