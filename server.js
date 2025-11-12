/**
 * Backend-only server for GoDaddy Webmail SMTP
 * Author: Srikanth
 * Description: Express backend with Nodemailer and Multer for file uploads.
 */

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const multer = require("multer");
const fs = require("fs");
const path = require("path");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ====================== Multer setup ======================
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);
const upload = multer({ dest: uploadsDir });

// ====================== Nodemailer setup ======================
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER, // GoDaddy Webmail
    pass: process.env.EMAIL_PASS, // Webmail password
  },
});

// Verify SMTP connection
transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP connection failed:", err);
  else console.log("✅ SMTP connected to GoDaddy Webmail!");
});

// ====================== Debug Endpoint ======================
app.get("/ping", (req, res) => res.send("✅ Server is working!"));

// ====================== Test Email Endpoint ======================
app.get("/send-test-email", async (req, res) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "Test Email from Render Backend",
    text: "This is a test email to confirm GoDaddy SMTP is working from Render.",
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Test email sent!" });
  } catch (err) {
    console.error("❌ Test email failed:", err);
    res.status(500).json({ success: false, message: "Test email failed", error: err.message });
  }
});

// ====================== Scroll Contact Form ======================
app.post("/api/contact-scroll", async (req, res) => {
  const { name, email, phoneNumber, company, subject, message } = req.body;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: subject || "New Contact (Scroll Section)",
    text: `
📩 New Contact from ScrollContactSection

Name: ${name}
Email: ${email}
Phone: ${phoneNumber}
Company: ${company}
Message: ${message}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("❌ Error sending email:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// ====================== Career Form ======================
app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
  const { fullName, email, phone, message, jobTitle } = req.body;
  const resumeFile = req.file;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `🧑‍💼 New Job Application - ${jobTitle}`,
    text: `
📄 New Job Application

Job Title: ${jobTitle}
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Message: ${message || "N/A"}

Submitted: ${new Date().toLocaleString()}
    `,
    attachments: resumeFile ? [{ filename: resumeFile.originalname, path: resumeFile.path }] : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    if (resumeFile) fs.unlinkSync(resumeFile.path);
    res.status(200).json({ success: true, message: "Application sent successfully" });
  } catch (err) {
    console.error("❌ Error sending application:", err);
    res.status(500).json({ success: false, message: "Error sending application" });
  }
});

// ====================== Start Server ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
