const express = require("express");
const multer = require("multer");
const path = require("path");
const Signature = require("../models/Signature");
const AuditLog = require("../models/AuditLog");

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads", "signatures"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /upload-image
router.post("/upload-image", upload.single("signature"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image uploaded" });
    }
    res.status(200).json({
      success: true,
      imagePath: `uploads/signatures/${req.file.filename}`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST / — create signature
router.post("/", async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);
    const signature = await Signature.create(req.body);
    await AuditLog.create({
      documentId: signature.documentId,
      action: "Signature Added",
      user: signature.signer,
      ipAddress: req.ip,
    });
    console.log("SAVED:", signature);
    res.status(201).json({ success: true, signature });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET / — all signatures
router.get("/", async (req, res) => {
  try {
    const signatures = await Signature.find();
    res.status(200).json(signatures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// PATCH /:signatureId/status — update status
router.patch("/:signatureId/status", async (req, res) => {
  try {
    const { status, rejectionReason } = req.body;
    const signature = await Signature.findByIdAndUpdate(
      req.params.signatureId,
      { status, rejectionReason: rejectionReason || "" },
      { new: true }
    );
    if (!signature) {
      return res.status(404).json({ message: "Signature not found" });
    }
    await AuditLog.create({
      documentId: signature.documentId,
      action: `Status changed to ${status}`,
      user: signature.signer,
      ipAddress: req.ip,
    });
    res.status(200).json(signature);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// DELETE /:id — MUST come before GET /:documentId to avoid Express param conflicts
router.delete("/:id", async (req, res) => {
  try {
    console.log("DELETE signature id:", req.params.id);
    const deleted = await Signature.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Signature not found" });
    }
    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// GET /:documentId — fetch signatures for a document (keep AFTER delete)
router.get("/:documentId", async (req, res) => {
  try {
    const signatures = await Signature.find({
      documentId: req.params.documentId,
    }).sort({ createdAt: 1 });
    res.status(200).json(signatures);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;