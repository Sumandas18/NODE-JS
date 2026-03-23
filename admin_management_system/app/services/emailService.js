const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: (process.env.EMAIL_USER || '').trim(),
        pass: (process.env.EMAIL_PASS || '').trim(),
    },
});

async function sendCredentials({ name, email, employeeId, password }) {
    await transporter.sendMail({
        from: `"Employee System" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your Employee Login Credentials',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 24px; border-radius: 8px;">
                <h2 style="color: #2c3e50;">Welcome, ${name}!</h2>
                <p>Your employee account has been created. Use the credentials below to log in:</p>
                <table style="border-collapse: collapse; width: 100%;">
                    <tr><td style="padding: 8px; font-weight: bold;">Employee ID</td><td style="padding: 8px;">${employeeId}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${email}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">Temporary Password</td><td style="padding: 8px; color: #e74c3c;">${password}</td></tr>
                </table>
                <p style="margin-top: 16px; color: #7f8c8d;">Change your password after login.</p>
            </div>
        `,
    });
}

module.exports = { sendCredentials };