const express = require("express");
const multer = require("multer");
const path = require("path");

console.log(
  "DOCUMENT PATH:",
  require.resolve("../models/Document")
);

const Document = require("../models/Document");

console.log("DOCUMENT MODEL:", Document);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/upload", upload.single("pdf"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send("No file uploaded");
    }

    const document = new Document({
      fileName: req.file.filename,
      filePath: req.file.path,
    });

    await document.save();

    res.status(201).json({
      message: "PDF Uploaded Successfully",
      document,
    });
  } catch (error) {
    console.log("ERROR:", error);
    console.log("MESSAGE:", error.message);

    res.status(500).json({
      error: error.message,
    });
  }
});

router.get("/", async (req, res) => {
  try {
    const documents = await Document.find();

    res.status(200).json(documents);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Failed to fetch documents",
    });
  }
});

module.exports = router;