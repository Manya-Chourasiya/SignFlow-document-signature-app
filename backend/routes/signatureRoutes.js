const express = require("express");
const Signature = require("../models/Signature");

const router = express.Router();

/*
Create Signature
*/
router.post("/", async (req, res) => {
  try {
    const signature = await Signature.create(req.body);

    res.status(201).json({
      success: true,
      signature,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
Get All Signatures
*/
router.get("/", async (req, res) => {
  try {
    const signatures = await Signature.find();

    res.status(200).json(signatures);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/*
Get Signatures For One Document
*/
router.get("/:documentId", async (req, res) => {
  try {
    const signatures = await Signature.find({
      documentId: req.params.documentId,
    }).sort({ createdAt: 1 });

    res.status(200).json(signatures);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;