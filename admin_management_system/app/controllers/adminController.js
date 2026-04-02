const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const Admin = require("../models/adminModel");
const Employee = require("../models/employeeModel");
const { sendCredentials } = require("../services/emailService");
const {
  generateEmployeeId,
  generatePassword,
} = require("../utils/generateCredentials");

class AdminController {
  async login(req, res) {
    try {
      const { email, password } = req.body;
      const admin = await Admin.findOne({ email });
      if (!admin) return res.status(404).json({ message: "Admin not found" });

      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin._id, role: "admin" },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
      );
      res.json({ message: "Login successful", token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async createEmployee(req, res) {
    try {
      const { name, email } = req.body;

      const exists = await Employee.findOne({ email });
      if (exists)
        return res
          .status(400)
          .json({ message: "Employee with this email already exists" });

      const employeeId = generateEmployeeId();
      const plainPassword = generatePassword();
      const hashedPassword = await bcrypt.hash(plainPassword, 10);

      const employee = await Employee.create({
        employeeId,
        name,
        email,
        password: hashedPassword,
      });

      // Send email in the background — don't block the response
      sendCredentials({ name, email, employeeId, password: plainPassword })
        .catch((err) => console.error("Email send failed:", err.message));

      res
        .status(201)
        .json({
          message: "Employee created successfully. Credentials sent via email.",
          employeeId: employee.employeeId,
        });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getEmployees(req, res) {
    try {
      const employees = await Employee.find().select("-password");
      res.json({ count: employees.length, employees });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async toggleStatus(req, res) {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee)
        return res.status(404).json({ message: "Employee not found" });

      employee.isActive = !employee.isActive;
      await employee.save();

      res.json({
        message: `Employee ${employee.isActive ? "activated" : "deactivated"} successfully`,
        isActive: employee.isActive,
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async resetPassword(req, res) {
    try {
      const employee = await Employee.findById(req.params.id);
      if (!employee)
        return res.status(404).json({ message: "Employee not found" });

      const plainPassword = generatePassword();
      employee.password = await bcrypt.hash(plainPassword, 10);
      employee.isFirstLogin = true;
      await employee.save();

      await sendCredentials({
        name: employee.name,
        email: employee.email,
        employeeId: employee.employeeId,
        password: plainPassword,
      });

      res.json({
        message: "Password reset and new credentials sent to employee email id",
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = new AdminController();
