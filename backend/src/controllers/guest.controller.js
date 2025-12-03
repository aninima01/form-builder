import Form from "../models/Form.js";
import FormGuest from "../models/FormGuest.js";
import FormResponse from "../models/FormResponse.js";
import Guest from "../models/Guest.js";

import crypto from "crypto";

// POST /api/guests - Create a new guest
export async function createGuest(req, res) {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and email are required",
      });
    }

    let guest = await Guest.findOne({
      email: email.toLowerCase(),
      adminId: req.adminId,
    });

    if (guest) {
      return res.status(200).json({
        message: "Guest already exists",
        guest,
      });
    }

    guest = new Guest({
      name,
      email: email.toLowerCase(),
      phone,
      adminId: req.adminId,
    });

    await guest.save();

    res.status(201).json({
      message: "Guest created successfully",
      guest,
    });
  } catch (error) {
    console.error("Create guest error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Guest with this email already exists",
      });
    }

    res.status(500).json({ error: "Failed to create guest" });
  }
}

// GET /api/guests - Get all guests
export async function getAllGuests(req, res) {
  try {
    const guests = await Guest.find({ adminId: req.adminId }).sort({
      createdAt: -1,
    });

    res.json({
      guests,
      totalGuests: guests.length,
    });
  } catch (error) {
    console.error("Get guests error:", error);
    res.status(500).json({ error: "Failed to fetch guests" });
  }
}

// GET /api/guests/:id - Get single guest
export async function getGuestById(req, res) {
  try {
    const guest = await Guest.findOne({
      _id: req.params.id,
      adminId: req.adminId,
    });

    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    res.json({ guest });
  } catch (error) {
    console.error("Get guest error:", error);
    res.status(500).json({ error: "Failed to fetch guest" });
  }
}

// PUT /api/guests/:id - Update guest
export async function updateGuest(req, res) {
  try {
    const { name, email, phone } = req.body;

    const guest = await Guest.findOneAndUpdate(
      { _id: req.params.id, adminId: req.adminId },
      { name, email: email?.toLowerCase(), phone },
      { new: true, runValidators: true }
    );

    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    res.json({
      message: "Guest updated successfully",
      guest,
    });
  } catch (error) {
    console.error("Update guest error:", error);
    res.status(500).json({ error: "Failed to update guest" });
  }
}

// DELETE /api/guests/:id - Delete guest
export async function deleteGuest(req, res) {
  try {
    const guest = await Guest.findOneAndDelete({
      _id: req.params.id,
      adminId: req.adminId,
    });

    if (!guest) {
      return res.status(404).json({ error: "Guest not found" });
    }

    await FormGuest.deleteMany({ guestId: req.params.id });
    await FormResponse.deleteMany({ guestId: req.params.id });

    res.json({ message: "Guest deleted successfully" });
  } catch (error) {
    console.error("Delete guest error:", error);
    res.status(500).json({ error: "Failed to delete guest" });
  }
}

// POST /api/forms/:formId/guests - Assign guest to form and generate token
export async function assignGuestToForm(req, res) {
  try {
    const { formId } = req.params;
    const { guestId, guestEmail, guestName, expiresInDays } = req.body;

    const form = await Form.findOne({
      _id: formId,
      adminId: req.adminId,
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    let guest;

    if (guestId) {
      guest = await Guest.findOne({
        _id: guestId,
        adminId: req.adminId,
      });

      if (!guest) {
        return res.status(404).json({ error: "Guest not found" });
      }
    } else if (guestEmail && guestName) {
      guest = await Guest.findOne({
        email: guestEmail.toLowerCase(),
        adminId: req.adminId,
      });

      if (!guest) {
        guest = new Guest({
          name: guestName,
          email: guestEmail.toLowerCase(),
          adminId: req.adminId,
        });
        await guest.save();
      }
    } else {
      return res.status(400).json({
        error: "Either guestId or both guestEmail and guestName are required",
      });
    }

    let formGuest = await FormGuest.findOne({
      formId,
      guestId: guest._id,
    });

    if (formGuest) {
      if (formGuest.isSubmitted) {
        return res.status(400).json({
          error: "Guest has already submitted this form",
          submittedAt: formGuest.submittedAt,
        });
      }

      const link = `${process.env.FRONTEND_URL}/form/${formGuest.token}`;
      return res.json({
        message: "Guest already assigned to this form",
        token: formGuest.token,
        link,
        formGuest: {
          id: formGuest._id,
          guest: {
            name: guest.name,
            email: guest.email,
          },
          form: {
            id: form._id,
            title: form.title,
          },
          token: formGuest.token,
          isSubmitted: formGuest.isSubmitted,
          createdAt: formGuest.createdAt,
          expiresAt: formGuest.expiresAt,
        },
      });
    }

    const token = crypto.randomBytes(32).toString("hex");

    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : null;

    formGuest = new FormGuest({
      formId,
      guestId: guest._id,
      token,
      expiresAt,
    });

    await formGuest.save();

    const link = `${process.env.FRONTEND_URL}/form/${token}`;

    res.status(201).json({
      message: "Guest assigned to form successfully",
      token,
      link,
      formGuest: {
        id: formGuest._id,
        guest: {
          id: guest._id,
          name: guest.name,
          email: guest.email,
        },
        form: {
          id: form._id,
          title: form.title,
        },
        token: formGuest.token,
        isSubmitted: formGuest.isSubmitted,
        createdAt: formGuest.createdAt,
        expiresAt: formGuest.expiresAt,
      },
    });
  } catch (error) {
    console.error("Assign guest error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        error: "Guest already assigned to this form",
      });
    }

    res.status(500).json({ error: "Failed to assign guest to form" });
  }
}

// GET /api/forms/:formId/guests - Get all guests assigned to a form
export async function getFormGuests(req, res) {
  try {
    const { formId } = req.params;

    const form = await Form.findOne({
      _id: formId,
      adminId: req.adminId,
    });

    if (!form) {
      return res.status(404).json({ error: "Form not found" });
    }

    const formGuests = await FormGuest.find({ formId })
      .populate("guestId", "name email phone")
      .sort({ createdAt: -1 });

    const formattedGuests = formGuests.map((fg) => ({
      id: fg._id,
      guest: {
        id: fg.guestId._id,
        name: fg.guestId.name,
        email: fg.guestId.email,
        phone: fg.guestId.phone,
      },
      token: fg.token,
      link: `${process.env.FRONTEND_URL}/form/${fg.token}`,
      isSubmitted: fg.isSubmitted,
      submittedAt: fg.submittedAt,
      createdAt: fg.createdAt,
      expiresAt: fg.expiresAt,
    }));

    res.json({
      form: {
        id: form._id,
        title: form.title,
      },
      guests: formattedGuests,
      totalGuests: formattedGuests.length,
      submittedCount: formattedGuests.filter((g) => g.isSubmitted).length,
      pendingCount: formattedGuests.filter((g) => !g.isSubmitted).length,
    });
  } catch (error) {
    console.error("Get form guests error:", error);
    res.status(500).json({ error: "Failed to fetch form guests" });
  }
}
