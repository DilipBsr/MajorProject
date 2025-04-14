const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const bcrypt=require("bcrypt");
const User = require("../Models/User"); // your Mongoose User model

const forgotController=async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: "User not found" });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });

  const resetLink = `http://localhost:5000/auth/reset-password/${token}`;

  // Send email (local SMTP example)
  const transporter = nodemailer.createTransport({
    service: "gmail", // or use SendGrid/Mailgun
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: "Password Reset Link",
    html: `<p>Click to reset password: <a href="${resetLink}">${resetLink}</a></p>`,
  });

  res.json({ message: "Reset link sent to your email" });
};


const resetPasswordController= async (req, res) => {
  const { token, newPassword } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    user.password = hashedPassword; // hash it if you're hashing passwords
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};


module.exports = {
  forgotController,
  resetPasswordController,
};