const express = require("express");
const Signature = require("../models/Signature");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const signature = new Signature(req.body);

    await signature.save();

    res.status(201).json({
      message: "Signature Saved",
      signature,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const signatures = await Signature.find();

    res.json(signatures);
  } catch (error) {
    res.status(500).json({
      error: error.message,
    });
  }
});

module.exports = router;