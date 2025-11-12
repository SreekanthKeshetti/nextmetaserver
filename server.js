/**
 * Project: MERN App (GoDaddy SMTP + React frontend)
 * Author: Srikanth
 * Description: Express backend with Nodemailer (GoDaddy SMTP), Multer for file uploads, and React frontend serving.
 */

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ====================== Multer setup ======================
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir);

const upload = multer({ dest: uploadsDir });

// ====================== Nodemailer setup (GoDaddy SMTP) ======================
const transporter = nodemailer.createTransport({
  host: "smtpout.secureserver.net",
  port: 465,       // SSL
  secure: true,    // true for 465, false for 587
  auth: {
    user: process.env.EMAIL_USER, // your GoDaddy email
    pass: process.env.EMAIL_PASS, // your Webmail password
  },
});

transporter.verify((err, success) => {
  if (err) console.error("❌ SMTP connection failed:", err);
  else console.log("✅ SMTP connection established with GoDaddy Webmail!");
});

// ====================== Debug Endpoint ======================
app.get("/ping", (req, res) => res.send("✅ Server is working!"));

// ====================== API ROUTES ======================

// ScrollContactSection
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
Subject: ${subject}
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

// ContactUsPage
app.post("/api/contact-page", async (req, res) => {
  const { firstName, lastName, email, country, message } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: "New Contact (Contact Page)",
    text: `
📩 New Contact from ContactUsPage

First Name: ${firstName}
Last Name: ${lastName}
Email: ${email}
Country: ${country}
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

// Chatbot Form
app.post("/api/chatbot", async (req, res) => {
  const { name, email, datetime, topic } = req.body;
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `💬 New Chatbot Message - ${topic || "General"}`,
    text: `
Name: ${name || "N/A"}
Email: ${email || "N/A"}
Date/Time: ${datetime || "N/A"}
Topic: ${topic || "N/A"}
Submitted: ${new Date().toLocaleString()}
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

// Career Form (with resume upload)
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
    res.status(200).json({ success: true, message: "Application sent successfully" });
    if (resumeFile) fs.unlinkSync(resumeFile.path);
  } catch (err) {
    console.error("❌ Error sending application:", err);
    res.status(500).json({ success: false, message: "Error sending application" });
  }
});

// ====================== Serve React frontend ======================
app.use(express.static(path.join(__dirname, "public")));

// Catch-all for React routes (Express 5 safe)
app.all(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ====================== Start Server ======================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
