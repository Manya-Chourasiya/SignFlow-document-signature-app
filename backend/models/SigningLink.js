const mongoose = require("mongoose");

const signingLinkSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      required: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "SigningLink",
  signingLinkSchema
);