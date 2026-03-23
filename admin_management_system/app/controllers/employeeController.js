const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Employee = require('../models/employeeModel');

class EmployeeController {
async loginEmployee  (req, res){
    try {
        const { email, password } = req.body;

        const emp = await Employee.findOne({ email });
        if (!emp) return res.status(404).json({ message: 'Employee not found' });
        if (!emp.isActive) return res.status(403).json({ message: 'Account is inactive. Contact your admin.' });

        const isMatch = await bcrypt.compare(password, emp.password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        emp.lastLogin = new Date();
        await emp.save();

        const token = jwt.sign(
            { id: emp._id, role: 'employee' },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN }
        );

        res.json({ message: 'Login successful', token, isFirstLogin: emp.isFirstLogin });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

 async changePassword(req, res) {
    try {
        const { currentPassword, newPassword } = req.body;

        const emp = await Employee.findById(req.user.id);
        if (!emp) return res.status(404).json({ message: 'Employee not found' });

        const isMatch = await bcrypt.compare(currentPassword, emp.password);
        if (!isMatch) return res.status(401).json({ message: 'Current password is incorrect' });

        emp.password = await bcrypt.hash(newPassword, 10);
        emp.isFirstLogin = false;
        await emp.save();

        res.json({ message: 'Password changed successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

 async getDashboard(req, res) {
    try {
        const emp = await Employee.findById(req.user.id).select('-password');
        if (!emp) return res.status(404).json({ message: 'Employee not found' });

        res.json({ message: 'Welcome to your dashboard', employee: emp });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};
}


module.exports = new EmployeeController();