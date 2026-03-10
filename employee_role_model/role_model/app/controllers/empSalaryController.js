const empsalaryModel = require("../models/empSalaryModel");

class empSalaryController {
  async createEmpSalary(req, res) {
    try {
      if (!req.user || !req.user.id) {
        return res.status(401).json({
          status: false,
          message: "Authentication required to create product",
        });
      }
      const data = {
        emp_name: req.body.emp_name,
        basic_salary: req.body.basic_salary,
        bonus: req.body.bonus,
        deduction: req.body.deduction,
        month: req.body.month,
        year: req.body.year,
        created_by: req.user.id,
      };

      const empsalary = await empsalaryModel.create(data);
      if (empsalary) {
        return res.status(201).json({
          status: true,
          message: "Employee salary created successfully",
          data: empsalary,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error creating employee salary",
        data: error,
      });
    }
  }

  async getAllEmpSalaries(req, res) {
    try {
      const empsalaries = await empsalaryModel.find();
      if (empsalaries) {
        return res.status(200).json({
          status: true,
          message: "Employee salaries retrieved successfully",
          total: empsalaries.length,
          data: empsalaries,
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error retrieving employee salaries",
        data: error,
      });
    }
  }

  async getEmpSalaryById(req, res) {
    try {
      const empsalary = await empsalaryModel.findById(req.params.id);
      if (empsalary) {
        return res.status(200).json({
          status: true,
          message: "Employee salary retrieved successfully",
          data: empsalary,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Employee salary not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error retrieving employee salary",
        data: error,
      });
    }
  }

  async updateEmpSalary(req, res) {
    try {
      const id = req.params.id;
      if (req.user.is_admin !== "admin" && req.user.is_admin !== "manager") {
        return res.status(403).json({
          status: false,
          message: "Unauthorized to update employee salary",
        });
      }
      const empsalary = await empsalaryModel.findByIdAndUpdate(id, req.body, {
        new: true,
      });
      if (empsalary) {
        return res.status(200).json({
          status: true,
          message: "Employee salary updated successfully",
          data: empsalary,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Employee salary not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error updating employee salary",
        data: error,
      });
    }
  }

  async deleteEmpSalary(req, res) {
    try {
      if (req.user.is_admin !== "admin") {
        return res.status(403).json({
          status: false,
          message: "Unauthorized to delete employee salary",
        });
      }
      const empsalary = await empsalaryModel.findByIdAndDelete(req.params.id);
      if (empsalary) {
        return res.status(200).json({
          status: true,
          message: "Employee salary deleted successfully",
          data: empsalary,
        });
      } else {
        return res.status(404).json({
          status: false,
          message: "Employee salary not found",
        });
      }
    } catch (error) {
      return res.status(500).json({
        status: false,
        message: "Error deleting employee salary",
        data: error,
      });
    }
  }
}

module.exports = new empSalaryController();
