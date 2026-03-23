const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: (process.env.EMAIL_USER || "").trim(),
    pass: (process.env.EMAIL_PASS || "").trim(),
  },
});

async function sendCredentials({ name, email, employeeId, password }) {
  await transporter.sendMail({
    from: `"Employee System" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Employee Login Credentials",
    html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <p>Hi ${name},</p>

                <p>Your employee account has been created. Here are your login details:</p>

                <p><strong>Employee ID:</strong> ${employeeId}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Password:</strong> ${password}</p>

                <p>Please change your password after logging in.</p>

                <p>Thanks,<br/>Employee System</p>
            </div>
        `,
  });
}

module.exports = { sendCredentials };
