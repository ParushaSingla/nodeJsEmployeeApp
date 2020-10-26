const mongoose = require("mongoose");

const OpeningSchema = new mongoose.Schema({
  _id: String,
  projectName: {
    type: String,
    required: true,
  },
  clientName: {
    type: String,
    required: true,
  },
  technologies: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.String,
    ref: "user",
  },
  employeesApplied: [
    {
      type: mongoose.Schema.Types.String,
      ref: "user",
    },
  ],
});

module.exports = mongoose.model("Opening", OpeningSchema);
