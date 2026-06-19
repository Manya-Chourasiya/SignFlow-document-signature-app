const express = require("express");
const AuditLog = require("../models/AuditLog");

const router = express.Router();

router.get("/:documentId", async (req, res) => {
  try {
    const logs = await AuditLog.find({
      documentId: req.params.documentId,
    }).sort({ createdAt: -1 });

    res.status(200).json(logs);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;