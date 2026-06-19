const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { PDFDocument, rgb } = require("pdf-lib");

const Document = require("../models/Document");
const Signature = require("../models/Signature");
const AuditLog = require("../models/AuditLog");

const router = express.Router();

/*
=================================
Multer Configuration
=================================
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

/*
=================================
Upload PDF
=================================
*/

router.post(
  "/upload",
  upload.single("pdf"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).send("No file uploaded");
      }

      const document = new Document({
        fileName: req.file.filename,
        filePath: req.file.path,
      });

      await document.save();
      await AuditLog.create({
       documentId: document._id,
       action: "PDF Uploaded",
       user: "manya@gmail.com",
       ipAddress: req.ip,
      });

      res.status(201).json({
        message: "PDF Uploaded Successfully",
        document,
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        error: error.message,
      });
    }
  }
);

/*
=================================
Get All Documents
=================================
*/

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

/*
=================================
Delete Document
=================================
*/

router.delete("/:id", async (req, res) => {
  try {
    const document = await Document.findByIdAndDelete(
      req.params.id
    );

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Document deleted",
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
Download Signed PDF
=================================
*/

router.get(
  "/download-signed/:documentId",
  async (req, res) => {
    try {
      const document = await Document.findById(
        req.params.documentId
      );

      if (!document) {
        return res.status(404).json({
          message: "Document not found",
        });
      }

      const signatures = await Signature.find({
        documentId: document._id,
      });

      const pdfPath = path.join(
        __dirname,
        "..",
        document.filePath
      );

      const existingPdfBytes = fs.readFileSync(pdfPath);

      const pdfDoc = await PDFDocument.load(existingPdfBytes);

      const pages = pdfDoc.getPages();
      const firstPage = pages[0];

      const pdfWidth = firstPage.getWidth();
      const pdfHeight = firstPage.getHeight();

      // Must match the on-screen signature width in the frontend
      // (`style={{ width: "120px" }}` in App.jsx). If you ever change one,
      // change the other.
      const SIGNATURE_PREVIEW_WIDTH = 120;

      for (const sig of signatures) {
        if (!sig.signatureImage) continue;

        const imagePath = path.join(
          __dirname,
          "..",
          sig.signatureImage
        );

        const imageBytes = fs.readFileSync(imagePath);

        // Some signature pads export PNG (with transparency) instead of JPG.
        // Detect by file extension so transparent signatures don't break.
        const ext = path.extname(imagePath).toLowerCase();
        const signatureImage =
          ext === ".png"
            ? await pdfDoc.embedPng(imageBytes)
            : await pdfDoc.embedJpg(imageBytes);

        // REQUIRED: the frontend now sends the exact on-screen size of the
        // PDF preview at the moment the signature was placed. Without this,
        // we cannot know what scale sig.x/sig.y were captured at, and the
        // signature will land in the wrong spot (this was the original bug).
        if (!sig.pageWidth || !sig.pageHeight) {
          console.warn(
            `Signature ${sig._id} has no pageWidth/pageHeight saved — ` +
            `skipping placement, position cannot be trusted.`
          );
          continue;
        }

        const scaleX = pdfWidth / sig.pageWidth;
        const scaleY = pdfHeight / sig.pageHeight;

        // Same aspect ratio the browser uses: native image size, scaled to
        // a fixed on-screen width of SIGNATURE_PREVIEW_WIDTH.
        const imgNativeAspect =
          signatureImage.height / signatureImage.width;
        const boxWidthPreview = SIGNATURE_PREVIEW_WIDTH;
        const boxHeightPreview = SIGNATURE_PREVIEW_WIDTH * imgNativeAspect;

        const drawWidth = boxWidthPreview * scaleX;
        const drawHeight = boxHeightPreview * scaleY;

        // Frontend renders signatures with
        // `transform: translate(-50%, -50%)`, meaning sig.x/sig.y is the
        // CENTER of the image, not the top-left corner. Match that here:
        // first move from center to top-left in preview space, then convert
        // to PDF point space, then flip Y (browser origin is top-left, PDF
        // origin is bottom-left), then subtract drawHeight because
        // pdf-lib's drawImage y is the BOTTOM of the image box.
        const previewTopLeftX = sig.x - boxWidthPreview / 2;
        const previewTopLeftY = sig.y - boxHeightPreview / 2;

        const pdfX = previewTopLeftX * scaleX;
        const pdfY =
          pdfHeight - previewTopLeftY * scaleY - drawHeight;

        firstPage.drawImage(signatureImage, {
          x: pdfX,
          y: pdfY,
          width: drawWidth,
          height: drawHeight,
        });
      }

      const pdfBytes = await pdfDoc.save();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        "attachment; filename=signed-document.pdf"
      );

      res.send(Buffer.from(pdfBytes));
    } catch (error) {
      console.error(error);

      res.status(500).json({
        message: "Failed to generate signed PDF",
      });
    }
  }
);

module.exports = router;