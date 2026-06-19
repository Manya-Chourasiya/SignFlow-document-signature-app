const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    x: {
      type: Number,
      required: true,
    },

    y: {
      type: Number,
      required: true,
    },

    page: {
      type: Number,
      default: 1,
    },

    // Size of the PDF preview (in CSS pixels) on the frontend at the exact
    // moment this signature was placed. Required to correctly scale x/y
    // into PDF point space when generating the signed PDF — without these,
    // the signature position cannot be trusted (see documentRoutes.js).
    pageWidth: {
      type: Number,
      required: true,
    },

    pageHeight: {
      type: Number,
      required: true,
    },

    signer: {
      type: String,
      required: true,
    },

    signerName: {
      type: String,
      default: "",
    },

    signatureImage: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: [
       "Pending",
       "Signed",
       "Rejected",
      ],
      default: "Pending",
    },
    rejectionReason: {
     type: String,
     default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "Signature",
  signatureSchema
);