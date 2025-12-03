import Form from "../models/Form.js";
import FormGuest from "../models/FormGuest.js";
import FormResponse from "../models/FormResponse.js";
import Guest from "../models/Guest.js";

// POST /api/forms - Create a new form
export async function createForm(req, res) {
  try {
    const { title, description, fields } = req.body;

    if (!title || !fields || fields.length === 0) {
      return res.status(400).json({
        error: "Title and at least one field are required",
      });
    }

    const form = new Form({
      title,
      description,
      fields,
      adminId: req.adminId,
    });

    await form.save();

    res.status(201).json({
      message: "Form created successfully",
      form,
    });
  } catch (error) {
    console.error("Create form error:", error);
    res.status(500).json({ error: "Failed to create form" });
  }
}

// GET /api/forms - Get all forms for admin
export async function getAllForms(req, res) {
  try {
    const forms = await Form.find({ adminId: req.adminId }).sort({
      createdAt: -1,
    });

    res.json({ forms });
  } catch (error) {
    console.error("Get forms error:", error);
    res.status(500).json({ error: "Failed to fetch forms" });
  }
}

// GET /api/forms/:id - Get single form
export async function getFormById(req, res) {
  try {
    const form = await Form.findOne({
      _id: req.params.id,
      adminId: req.adminId,
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({ form });
  } catch (error) {
    console.error("Get form error:", error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
}

// PUT /api/forms/:id - Update form
export async function updateForm(req, res) {
  try {
    const { title, description, fields, isActive } = req.body;

    const form = await Form.findOneAndUpdate(
      { _id: req.params.id, adminId: req.adminId },
      { title, description, fields, isActive, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    res.json({
      message: "Form updated successfully",
      form,
    });
  } catch (error) {
    console.error("Update form error:", error);
    res.status(500).json({ error: "Failed to update form" });
  }
}

// DELETE /api/forms/:id - Delete form
export async function deleteForm(req, res) {
  try {
    const form = await Form.findOneAndDelete({
      _id: req.params.id,
      adminId: req.adminId,
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    await FormGuest.deleteMany({ formId: req.params.id });
    await FormResponse.deleteMany({ formId: req.params.id });

    res.json({ message: "Form deleted successfully" });
  } catch (error) {
    console.error("Delete form error:", error);
    res.status(500).json({ error: "Failed to delete form" });
  }
}

// GET /api/forms/token/:token - Guest views form (token-based)
export async function getFormByToken(req, res) {
  try {
    const { token } = req.params;

    const formGuest = await FormGuest.findOne({ token })
      .populate("formId")
      .populate("guestId", "name email");

    if (!formGuest) {
      return res.status(404).json({ error: "Invalid token" });
    }

    if (formGuest.isSubmitted) {
      return res.status(403).json({
        error: "Form already submitted",
        submittedAt: formGuest.submittedAt,
      });
    }

    if (formGuest.expiresAt && formGuest.expiresAt < new Date()) {
      return res.status(403).json({
        error: "Token has expired",
        expiresAt: formGuest.expiresAt,
      });
    }

    if (!formGuest.formId.isActive) {
      return res.status(403).json({ error: "Form is no longer active" });
    }

    res.json({
      form: {
        id: formGuest.formId._id,
        title: formGuest.formId.title,
        description: formGuest.formId.description,
        fields: formGuest.formId.fields,
      },
      guest: {
        name: formGuest.guestId.name,
        email: formGuest.guestId.email,
      },
      token: formGuest.token,
    });
  } catch (error) {
    console.error("Get form by token error:", error);
    res.status(500).json({ error: "Failed to fetch form" });
  }
}

// POST /api/forms/:formId/response - Submit form response
export async function submitFormResponse(req, res) {
  try {
    const { formId } = req.params;
    const { token, responses } = req.body;

    if (!token) {
      return res.status(400).json({ error: "Token is required" });
    }

    if (!responses || typeof responses !== "object") {
      return res.status(400).json({ error: "Responses are required" });
    }

    const formGuest = await FormGuest.findOne({
      formId,
      token,
      isSubmitted: false,
    }).populate("formId guestId");

    if (!formGuest) {
      return res.status(403).json({
        error: "Invalid token or form already submitted",
      });
    }

    if (formGuest.expiresAt && formGuest.expiresAt < new Date()) {
      return res.status(403).json({ error: "Token has expired" });
    }

    if (!formGuest.formId.isActive) {
      return res.status(403).json({ error: "Form is no longer active" });
    }

    const validationErrors = validateResponses(
      formGuest.formId.fields,
      responses
    );

    if (validationErrors.length > 0) {
      return res.status(400).json({
        error: "Validation failed",
        errors: validationErrors,
      });
    }

    const formResponse = new FormResponse({
      formId: formGuest.formId._id,
      formGuestId: formGuest._id,
      guestId: formGuest.guestId._id,
      responses: responses,
    });

    await formResponse.save();

    formGuest.isSubmitted = true;
    formGuest.submittedAt = new Date();
    await formGuest.save();

    res.status(201).json({
      message: "Form submitted successfully",
      submittedAt: formGuest.submittedAt,
    });
  } catch (error) {
    console.error("Submit form error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Form already submitted",
      });
    }

    res.status(500).json({ error: "Failed to submit form" });
  }
}

// GET /api/forms/:formId/responses - Get all responses for a form
export async function getFormResponses(req, res) {
  try {
    const { formId } = req.params;

    const form = await Form.findOne({
      _id: formId,
      adminId: req.adminId,
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const responses = await FormResponse.find({ formId })
      .populate("guestId", "name email")
      .populate("formGuestId", "submittedAt")
      .sort({ submittedAt: -1 });

    const formattedResponses = responses.map((response) => ({
      id: response._id,
      guest: {
        name: response.guestId.name,
        email: response.guestId.email,
      },
      responses: response.responses,
      submittedAt: response.submittedAt,
    }));

    res.json({
      form: {
        id: form._id,
        title: form.title,
        description: form.description,
        fields: form.fields,
      },
      responses: formattedResponses,
      totalResponses: formattedResponses.length,
    });
  } catch (error) {
    console.error("Get responses error:", error);
    res.status(500).json({ error: "Failed to fetch responses" });
  }
}

// Helper function to validate responses
export function validateResponses(fields, responses) {
  const errors = [];

  fields.forEach((field) => {
    const response = responses[field.name];

    if (field.required && (!response || response === "")) {
      errors.push({
        field: field.name,
        message: `${field.label} is required`,
      });
      return;
    }

    if (response !== undefined && response !== null && response !== "") {
      switch (field.type) {
        case "number":
          if (isNaN(response)) {
            errors.push({
              field: field.name,
              message: `${field.label} must be a number`,
            });
          }
          break;

        case "date":
          if (isNaN(Date.parse(response))) {
            errors.push({
              field: field.name,
              message: `${field.label} must be a valid date`,
            });
          }
          break;

        case "dropdown":
          if (field.options && !field.options.includes(response)) {
            errors.push({
              field: field.name,
              message: `${field.label} must be one of the provided options`,
            });
          }
          break;

        case "multiselect":
          if (!Array.isArray(response)) {
            errors.push({
              field: field.name,
              message: `${field.label} must be an array`,
            });
          } else if (
            field.options &&
            !response.every((r) => field.options.includes(r))
          ) {
            errors.push({
              field: field.name,
              message: `${field.label} contains invalid options`,
            });
          }
          break;
      }
    }
  });

  return errors;
}
