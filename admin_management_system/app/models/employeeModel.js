const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "employee" },
    isActive: { type: Boolean, default: true },
    isFirstLogin: { type: Boolean, default: true },
    lastLogin: { type: Date },
  },
  { timestamps: true },
);

const employeeModel = mongoose.model("Employee", employeeSchema);
module.exports = employeeModel;