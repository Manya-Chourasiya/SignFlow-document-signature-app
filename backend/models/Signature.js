const mongoose = require("mongoose");

const signatureSchema = new mongoose.Schema({
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

  signer: {
    type: String,
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
  },
});

module.exports = mongoose.model("Signature", signatureSchema);