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

// Ensure uploads folder exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
}

// 🗂️ Multer setup for file uploads
const upload = multer({ dest: uploadsDir });

// 💌 Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Explicit host
  port: 587, // Secure port
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ========================== DEBUG ENDPOINT ==========================
app.get("/ping", (req, res) => res.send("✅ Server is working!"));

// ========================== API ROUTES ==========================

// 📨 Contact form 1 (ScrollContactSection)
app.post("/api/contact-scroll", async (req, res) => {
  console.log("Received /api/contact-scroll request:", req.body);
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
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// 📨 Contact form 2 (ContactUsPage)
app.post("/api/contact-page", async (req, res) => {
  console.log("Received /api/contact-page request:", req.body);
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
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// 💬 Chatbot form
app.post("/api/chatbot", async (req, res) => {
  console.log("Received /api/chatbot request:", req.body);
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
Time Submitted: ${new Date().toLocaleString()}
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ success: true, message: "Email sent successfully" });
  } catch (err) {
    console.error("Error sending mail:", err);
    res.status(500).json({ success: false, message: "Error sending email" });
  }
});

// 🧑‍💼 Career form (with resume upload)
app.post("/api/career-apply", upload.single("resume"), async (req, res) => {
  console.log("Received /api/career-apply request:", req.body);
  const { fullName, email, phone, message, jobTitle } = req.body;
  const resumeFile = req.file;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: process.env.EMAIL_TO,
    subject: `🧑‍💼 New Job Application - ${jobTitle}`,
    text: `
📄 New Job Application Received

Job Title: ${jobTitle}
Name: ${fullName}
Email: ${email}
Phone: ${phone}
Message: ${message || "N/A"}

Submitted At: ${new Date().toLocaleString()}
    `,
    attachments: resumeFile
      ? [
          {
            filename: resumeFile.originalname,
            path: resumeFile.path,
          },
        ]
      : [],
  };

  try {
    await transporter.sendMail(mailOptions);
    res
      .status(200)
      .json({ success: true, message: "Application sent successfully" });

    // Delete temp file after sending
    if (resumeFile) fs.unlinkSync(resumeFile.path);
  } catch (err) {
    console.error("Error sending career application:", err);
    res
      .status(500)
      .json({ success: false, message: "Error sending application" });
  }
});

// ========================== REACT FRONTEND SERVING ==========================
app.use(express.static(path.join(__dirname, "public")));

app.get("/^/.*$/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ========================== START SERVER ==========================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

