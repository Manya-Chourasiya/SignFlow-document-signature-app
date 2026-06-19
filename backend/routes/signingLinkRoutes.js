const express = require("express");
const crypto = require("crypto");

const SigningLink = require("../models/SigningLink");
const Document = require("../models/Document");
const router = express.Router();

/*
=================================
Create Signing Link
=================================
*/

router.post("/create", async (req, res) => {
  try {
    const { documentId } = req.body;

    const token = crypto
      .randomBytes(24)
      .toString("hex");

    const signingLink =
      await SigningLink.create({
        documentId,
        token,
        expiresAt: new Date(
          Date.now() +
            7 * 24 * 60 * 60 * 1000
        ),
      });

    res.status(201).json({
      success: true,
      signingLink,
      publicUrl: `http://localhost:5173/sign/${token}`,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

/*
=================================
Get Signing Link By Token
=================================
*/

router.get("/:token", async (req, res) => {
  try {
    const signingLink =
      await SigningLink.findOne({
        token: req.params.token,
        isActive: true,
      }).populate("documentId");

    if (!signingLink) {
      return res.status(404).json({
        message: "Invalid signing link",
      });
    }

    res.status(200).json(signingLink);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;